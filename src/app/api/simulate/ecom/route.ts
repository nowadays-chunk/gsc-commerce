import { NextRequest, NextResponse } from "next/server";
import { simulateEcommerceRevenue, CalculatorInputs } from "@/lib/engine";

export async function POST(req: NextRequest) {
    try {
        const inputs: CalculatorInputs = await req.json();
        const result = simulateEcommerceRevenue(inputs);
        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json({ error: "Invalid inputs provided" }, { status: 400 });
    }
}
