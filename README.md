# Quant Monetization Studio: Technical Specification

## 1. Project Overview
The Quant Monetization Studio is an enterprise-grade forecasting tool designed to model financial outcomes from organic search traffic. It enables business owners and SEOs to simulate traffic growth and monetize it through two primary models: Ad Value (GSC) and Ecommerce Revenue.

---

## 2. Core Business Logic (The Engine)

### 2.1 SEO Foundation (`simulateTraffic`)
The "Foundation" layer calculates theoretical organic visibility based on site authority and niche competition.

#### Key Formulas:
- **Indexing Velocity**: Simulates logarithmic crawl budget scaling.
  - *Formula*: `indexRate = m1:30%, m2:55%, m3:70% ... up to 95% at month 12`.
- **Compounding Inventory Growth**:
  - *Formula*: `currentTotalPages = initialPages * (1 + growthRate/100)^(month-1)`
- **Impression Generation**:
  - *Formula*: `monthlyImps = (indexedPages * baseImpsPerPage) * (1 - e^(-growthK * m))`
  - *Modifiers*: Domain Authority (0.5x to 2.0x), Page Speed (+15% for >90), Content Depth (+10% for comprehensive).
- **Ranking Distribution**: 
  - Uses a fixed CTR curve: Pos 1 (27%), Pos 2 (15%), Pos 3 (11%), etc.

### 2.2 GSC Ad Value Engine (`simulateGSCAdValue`)
Models the cost-replacement value of organic traffic if it were purchased via Google Ads.

#### The "Blended Yield" Formula:
To prevent over-estimation in high-traffic scenarios, we use a conservative visit-calibration model:
```javascript
trafficValue = ((clicks / 300) * avgCpc) + ((clicks / 1000) * avgCpm)
```
- **Rationale**: Counts 1 CPC unit per 300 clicks to model high-intent cluster value while adding a CPM floor for general impressions.

### 2.3 Ecommerce Revenue Engine (`simulateEcommerceRevenue`)
A high-fidelity funnel simulation from click to profit.

#### Funnel Benchmarks:
- **ATC (Add to Cart)**: 8%
- **Checkout Start**: 60% of ATC
- **Purchase**: 55% of Checkout
#### Conversion Rate (CVR) Multipliers:
- **Brand Strength**: Elite (1.8x), Strong (1.35x), Average (1.0x).
- **Intent Distribution**: Transactional (1.5x), Commercial (1.2x), Informational (0.3x).
- **Mobile Penalty**: 0.8x (optional).

---

## 3. Enterprise API Reference

The studio exposes its logic through stateless POST endpoints.

### 3.1 GSC Simulation API
- **Endpoint**: `POST /api/simulate/gsc`
- **Request Body (`CalculatorInputs`)**:
```json
{
  "totalPages": 5000,
  "domainAuthority": 45,
  "competition": "medium",
  "avgCpc": 2.50,
  "avgCpm": 12.00,
  "monthsSinceLaunch": 12,
  "inventoryGrowthRate": 5.0,
  "brandStrength": "strong",
  "pageSpeedScore": 85,
  "applySerpSuppression": true
}
```

### 3.2 Ecommerce Simulation API
- **Endpoint**: `POST /api/simulate/ecom`
- **Request Body**: Same as GSC, plus:
```json
{
  "avgProductPrice": 85.00,
  "netMargin": 0.35,
  "storeTrust": "strong",
  "intentDistribution": {
    "transactional": 0.40,
    "commercial": 0.30,
    "informational": 0.30
  }
}
```

### 3.3 Example Implementation (Javascript/TypeScript)
```typescript
async function getForecast(params) {
  const response = await fetch('/api/simulate/gsc', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  });
  
  const data = await response.json();
  console.log('Yearly Ad Value:', data.totals.yearlyTrafficValue);
  return data;
}
```

---

## 4. Technical Implementation Detail

### 4.1 Folder Structure
- `/src/lib/engine.ts`: Core mathematical simulation logic.
- `/src/components/calculator.tsx`: Main UI orchestration and React logic.
- `/src/app/api/...`: Stateless API route handlers.

### 4.2 State Management
- **Local Persistence**: User estimations are serialized to JSON and stored in `localStorage` under the key `quant_estimations`.
- **Monte Carlo Simulations**: Performed client-side using a loop of 30 iterations with +/- 2 DA variance to generate P10/P90 probability bands.

### 4.3 UI Design System
- **Aesthetics**: High-contrast glassmorphism with `framer-motion` for state transitions.
- **Charts**: `recharts` for time-series visualization with area-shading for variance.
