import { simulateEcommerceRevenue, CalculatorInputs } from './engine';

const testInputs: CalculatorInputs = {
    totalPages: 2000,
    domainAuthority: 30,
    competition: "medium",
    avgCpc: 2.50,
    avgCpm: 12.00,
    monthsSinceLaunch: 24,
    avgProductPrice: 150,
    netMargin: 0.35,
    storeTrust: "average",
    applyMobilePenalty: true,
};

const result = simulateEcommerceRevenue(testInputs);

console.log("--- TEST RESULTS ---");
console.log("Yearly Revenue:", result.totals.yearlyRevenue);
console.log("Yearly Orders:", result.totals.yearlyOrders);
console.log("Blended CVR:", (result.totals.blendedCvr * 100).toFixed(2) + "%");
console.log("Yearly Profit:", result.totals.yearlyProfit);
console.log("Final Month RPV:", result.monthlyData[result.monthlyData.length - 1].rpv);
console.log("--------------------");

if (result.totals.yearlyRevenue > 0 && result.totals.yearlyOrders > 0) {
    console.log("SUCCESS: Engine produced positive ecommerce metrics.");
} else {
    console.log("FAILURE: Engine failed to produce valid ecommerce metrics.");
}

console.log("\n--- GSC AD VALUE TEST ---");
const gscResult = (require('./engine').simulateGSCAdValue(testInputs));
console.log("Yearly Traffic Value:", gscResult.totals.yearlyTrafficValue);
console.log("Expected Value Calculation (Approx):", (gscResult.totals.yearlyClicks * testInputs.avgCpc) + ((gscResult.totals.yearlyClicks / 1000) * testInputs.avgCpm));

if (gscResult.totals.yearlyTrafficValue > 0) {
    console.log("SUCCESS: Engine produced positive GSC Ad Value.");
} else {
    console.log("FAILURE: Engine failed to produce valid GSC Ad Value.");
    process.exit(1);
}
