export type CompetitionLevel = "low" | "medium" | "high";
export type StoreTrust = "low" | "average" | "strong" | "elite";
export type ContentDepth = "thin" | "average" | "comprehensive";

export interface IntentDistribution {
  transactional: number;
  commercial: number;
  informational: number;
}

export interface CalculatorInputs {
  totalPages: number;
  domainAuthority: number;
  competition: CompetitionLevel;
  avgCpc: number;
  avgCpm: number;
  monthsSinceLaunch: number;
  inventoryGrowthRate?: number; // Monthly percentage growth of totalPages

  // Joint Impact Parameters
  brandStrength?: StoreTrust; // Impacts CTR (Traffic) and CVR (Ecommerce)
  pageSpeedScore?: number;    // 0-100, Impacts rankings (Traffic) and UX (Ecommerce)
  contentDepth?: ContentDepth; // Impacts Indexing velocity (Traffic) and Trust (Ecommerce)

  // Ecommerce Specific
  avgProductPrice?: number;
  netMargin?: number;
  storeTrust?: StoreTrust;
  intentDistribution?: IntentDistribution;

  // Toggles
  applyCannibalizationPenalty?: boolean;
  applySeasonality?: boolean;
  applyCoreUpdateVolatility?: boolean;
  applyContentDecay?: boolean;
  applySerpSuppression?: boolean;
  applyReindexationRisk?: boolean;
  applyMobilePenalty?: boolean;
}

export interface TrafficData {
  month: number;
  indexedPages: number;
  impressions: number;
  clicks: number;
  ctr: number;
  avgPosition: number;
  totalPages: number;
}

export interface GSCAdValueData extends TrafficData {
  trafficValue: number;
}

export interface EcommerceData extends TrafficData {
  orders: number;
  revenue: number;
  profit: number;
  rpv: number;
}

// Internal CTR Curve
const CTR_CURVE: Record<string, number> = {
  "1": 0.27, "2": 0.15, "3": 0.11, "4": 0.08, "5": 0.07,
  "6": 0.05, "7": 0.04, "8": 0.03, "9": 0.025, "10": 0.022,
  "11-20": 0.01, "21-50": 0.003, "51-100": 0.001,
};

const BASE_RANKING_DISTRIBUTION = [
  { range: "1-3", weight: 0.03, positions: ["1", "2", "3"] },
  { range: "4-10", weight: 0.12, positions: ["4", "5", "6", "7", "8", "9", "10"] },
  { range: "11-20", weight: 0.20, positions: ["11-20"] },
  { range: "21-50", weight: 0.40, positions: ["21-50"] },
  { range: "51-100", weight: 0.25, positions: ["51-100"] },
];

/**
 * BASE TRAFFIC ENGINE: Calculates SEO metrics ONLY
 */
export function simulateTraffic(inputs: CalculatorInputs): TrafficData[] {
  const {
    totalPages, domainAuthority, competition, monthsSinceLaunch,
    brandStrength = "average", pageSpeedScore = 70, contentDepth = "average",
    inventoryGrowthRate = 0,
    applyCannibalizationPenalty, applySeasonality, applyCoreUpdateVolatility,
    applyContentDecay, applySerpSuppression, applyReindexationRisk
  } = inputs;

  // Brand CTR Multiplier
  const brandCtrMult: Record<StoreTrust, number> = { low: 0.8, average: 1.0, strong: 1.25, elite: 1.6 };

  // Page Speed Multiplier (Core Web Vitals impact)
  const speedMult = pageSpeedScore >= 90 ? 1.15 : pageSpeedScore >= 50 ? 1.0 : 0.85;

  let authorityMultiplier = domainAuthority <= 10 ? 0.5 : domainAuthority <= 30 ? 0.8 : domainAuthority <= 50 ? 1.0 : domainAuthority <= 70 ? 1.5 : 2.0;
  const avgImpressionsMap: Record<CompetitionLevel, number> = { low: 90, medium: 375, high: 1800 };
  let baseImpressionsPerPage = avgImpressionsMap[competition] * authorityMultiplier * speedMult;

  let adjustedDist = BASE_RANKING_DISTRIBUTION.map(d => ({ ...d }));
  if (domainAuthority > 50) {
    const shift = (domainAuthority - 50) * 0.0015;
    adjustedDist[0].weight += shift * 2.5;
    adjustedDist[1].weight += shift;
    adjustedDist[4].weight -= shift * 3.5;
  } else if (domainAuthority < 20) {
    adjustedDist[0].weight = 0.005; adjustedDist[1].weight = 0.04; adjustedDist[2].weight = 0.12; adjustedDist[3].weight = 0.45; adjustedDist[4].weight = 0.385;
  }
  const totalW = adjustedDist.reduce((acc, curr) => acc + curr.weight, 0);
  adjustedDist.forEach(d => (d.weight /= totalW));

  const monthlyResults: TrafficData[] = [];
  for (let m = 1; m <= monthsSinceLaunch; m++) {
    // Content Depth impacts index velocity
    const depthIndexMult = contentDepth === "comprehensive" ? 1.1 : contentDepth === "thin" ? 0.7 : 1.0;
    let indexRate = m === 1 ? 0.3 : m === 2 ? 0.55 : m === 3 ? 0.70 : m <= 5 ? 0.75 : m === 6 ? 0.85 : m <= 11 ? 0.90 : 0.95;
    indexRate *= depthIndexMult;

    if (domainAuthority > 60) indexRate = Math.min(0.98, indexRate + 0.03);
    if (applyReindexationRisk && m > 3) indexRate *= 0.985;

    // Calculate growing inventory
    const currentTotalPages = totalPages * Math.pow(1 + (inventoryGrowthRate / 100), m - 1);
    let indexedPages = Math.floor(currentTotalPages * indexRate);
    let currentImpsPerPage = baseImpressionsPerPage;
    if (applyContentDecay && m > 12) currentImpsPerPage *= Math.pow(0.975, m - 12);
    if (applySeasonality) currentImpsPerPage *= (1 + Math.sin((m / 12) * Math.PI * 2) * 0.15);
    if (applyCoreUpdateVolatility && m % 6 === 0) currentImpsPerPage *= (0.7 + (Math.sin(m) * 0.3));

    let monthlyImps = Math.floor(indexedPages * currentImpsPerPage);
    if (applyCannibalizationPenalty && currentTotalPages > 500) {
      const scale = Math.log10(currentTotalPages / 500);
      monthlyImps = Math.floor(monthlyImps * Math.max(0.7, 1 - (0.05 * scale)));
    }

    // Growth speed influenced by content depth
    const growthK = (0.12 + domainAuthority * 0.006) * (contentDepth === "comprehensive" ? 1.2 : 1.0);
    const growthFactor = (1 - Math.exp(-growthK * m));
    monthlyImps = Math.floor(monthlyImps * growthFactor);

    let clicks = 0; let rankPosSum = 0; let rankImpSum = 0;
    const serpFactor = applySerpSuppression ? 0.8 : 1.0;

    for (const bin of adjustedDist) {
      const binImps = monthlyImps * bin.weight;
      const impsPerPos = binImps / bin.positions.length;
      for (const posKey of bin.positions) {
        // Apply Brand CTR Multiplier
        clicks += impsPerPos * CTR_CURVE[posKey] * serpFactor * brandCtrMult[brandStrength];
        const avgPosVal = posKey.includes("-") ? ((Number(posKey.split("-")[0]) + Number(posKey.split("-")[1])) / 2) : Number(posKey);
        rankPosSum += avgPosVal * impsPerPos; rankImpSum += impsPerPos;
      }
    }

    monthlyResults.push({
      month: m, indexedPages, impressions: monthlyImps, clicks: Math.floor(clicks),
      ctr: monthlyImps > 0 ? clicks / monthlyImps : 0, avgPosition: rankImpSum > 0 ? rankPosSum / rankImpSum : 0,
      totalPages: Math.floor(currentTotalPages)
    });
  }
  return monthlyResults;
}

/**
 * GSC AD VALUE ENGINE: Traffic -> Dollar Value (CPC)
 */
export function simulateGSCAdValue(inputs: CalculatorInputs) {
  const traffic = simulateTraffic(inputs);
  const data: GSCAdValueData[] = traffic.map(t => ({
    ...t, trafficValue: ((t.clicks / 300) * inputs.avgCpc) + ((t.clicks / 1000) * inputs.avgCpm)
  }));
  if (data.length === 0) {
    return {
      monthlyData: [],
      totals: {
        yearlyClicks: 0,
        monthlyClicks: 0,
        dailyClicks: 0,
        yearlyImpressions: 0,
        monthlyImpressions: 0,
        dailyImpressions: 0,
        yearlyTrafficValue: 0,
        monthlyTrafficValue: 0,
        dailyTrafficValue: 0,
        averageCtr: 0,
        avgPosition: 0
      }
    };
  }

  const last12 = data.slice(-12);
  const yearlyClicks = last12.reduce((s, d) => s + d.clicks, 0);
  const yearlyImpressions = last12.reduce((s, d) => s + d.impressions, 0);

  return {
    monthlyData: data,
    totals: {
      yearlyClicks,
      monthlyClicks: yearlyClicks / 12,
      dailyClicks: yearlyClicks / 365,
      yearlyImpressions,
      monthlyImpressions: yearlyImpressions / 12,
      dailyImpressions: yearlyImpressions / 365,
      yearlyTrafficValue: (last12.reduce((s, d) => s + d.trafficValue, 0)),
      monthlyTrafficValue: (last12.reduce((s, d) => s + d.trafficValue, 0)) / 12,
      dailyTrafficValue: (last12.reduce((s, d) => s + d.trafficValue, 0)) / 365,
      averageCtr: yearlyClicks / (yearlyImpressions || 1),
      avgPosition: data[data.length - 1].avgPosition
    }
  };
}

/**
 * ECOMMERCE REVENUE ENGINE: Traffic -> Orders -> Revenue
 */
export function simulateEcommerceRevenue(inputs: CalculatorInputs) {
  const traffic = simulateTraffic(inputs);
  const {
    avgProductPrice = 0, netMargin = 0, storeTrust = "average",
    brandStrength = "average", pageSpeedScore = 70, contentDepth = "average",
    intentDistribution = { transactional: 0.25, commercial: 0.35, informational: 0.40 },
    applyMobilePenalty = true
  } = inputs;

  const baseCvr: Record<StoreTrust, number> = { low: 0.005, average: 0.012, strong: 0.025, elite: 0.045 };

  // Joint Impact Multipliers on CVR
  const brandCvrMult: Record<StoreTrust, number> = { low: 0.7, average: 1.0, strong: 1.35, elite: 1.8 };
  const speedCvrMult = pageSpeedScore >= 90 ? 1.1 : pageSpeedScore >= 70 ? 1.0 : 0.8;
  const depthCvrMult = contentDepth === "comprehensive" ? 1.25 : contentDepth === "thin" ? 0.6 : 1.0;

  const intentMult = (intentDistribution.transactional * 1.5) + (intentDistribution.commercial * 1.2) + (intentDistribution.informational * 0.3);
  const mobileFactor = applyMobilePenalty ? 0.8 : 1.0;
  const aov = avgProductPrice * 1.2;

  const data: EcommerceData[] = traffic.map(t => {
    const croMult = 1 + (Math.min(24, t.month) / 24) * 0.2;
    // Final CVR combines both module-specific and global parameters
    const finalCvr = baseCvr[storeTrust] * brandCvrMult[brandStrength] * speedCvrMult * depthCvrMult * intentMult * mobileFactor * croMult;
    const orders = Math.floor(t.clicks * finalCvr);
    const revenue = orders * aov;
    return { ...t, orders, revenue, profit: revenue * netMargin, rpv: t.clicks > 0 ? revenue / t.clicks : 0 };
  });

  if (data.length === 0) {
    return {
      monthlyData: [],
      totals: {
        yearlyOrders: 0,
        yearlyRevenue: 0,
        monthlyRevenue: 0,
        dailyRevenue: 0,
        yearlyProfit: 0,
        monthlyProfit: 0,
        dailyProfit: 0,
        blendedCvr: 0,
      },
      funnel: { atc: 0.08, checkout: 0.60, purchase: 0.55 }
    };
  }

  const last12 = data.slice(-12);
  return {
    monthlyData: data,
    totals: {
      yearlyOrders: last12.reduce((s, d) => s + d.orders, 0),
      yearlyRevenue: last12.reduce((s, d) => s + d.revenue, 0),
      monthlyRevenue: last12.reduce((s, d) => s + d.revenue, 0) / 12,
      dailyRevenue: last12.reduce((s, d) => s + d.revenue, 0) / 365,
      yearlyProfit: last12.reduce((s, d) => s + d.profit, 0),
      monthlyProfit: last12.reduce((s, d) => s + d.profit, 0) / 12,
      dailyProfit: last12.reduce((s, d) => s + d.profit, 0) / 365,
      blendedCvr: last12.reduce((s, d) => s + d.orders, 0) / (last12.reduce((s, d) => s + d.clicks, 0) || 1),
    },
    funnel: {
      atc: 0.08,
      checkout: 0.60,
      purchase: 0.55
    }
  };
}

// Monte Carlo (Deterministic logic for SSR)
export function simulateMonteCarlo(inputs: CalculatorInputs, type: "gsc" | "ecom", iterations = 30, mounted = false) {
  if (!mounted) {
    const res = type === "gsc" ? simulateGSCAdValue(inputs) : simulateEcommerceRevenue(inputs);
    return { median: res.monthlyData, p10: res.monthlyData, p90: res.monthlyData };
  }

  const allResults: any[][] = [];
  for (let i = 0; i < iterations; i++) {
    const jiggled = { ...inputs, domainAuthority: inputs.domainAuthority + (Math.random() * 4 - 2) };
    const res = type === "gsc" ? simulateGSCAdValue(jiggled) : simulateEcommerceRevenue(jiggled);
    allResults.push(res.monthlyData);
  }

  const median: any[] = []; const p10: any[] = []; const p90: any[] = [];
  for (let m = 0; m < inputs.monthsSinceLaunch; m++) {
    const getP = (arr: number[], pct: number) => [...arr].sort((a, b) => a - b)[Math.floor(arr.length * pct)];
    const metric = type === "gsc" ? "trafficValue" : "revenue";
    const vals = allResults.map(r => r[m][metric]);
    const clicks = allResults.map(r => r[m].clicks);
    const template = allResults[0][m];
    median.push({ ...template, clicks: getP(clicks, 0.5), [metric]: getP(vals, 0.5) });
    p10.push({ ...template, clicks: getP(clicks, 0.1), [metric]: getP(vals, 0.1) });
    p90.push({ ...template, clicks: getP(clicks, 0.9), [metric]: getP(vals, 0.9) });
  }
  return { median, p10, p90 };
}
