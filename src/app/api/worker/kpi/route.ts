import { NextResponse } from "next/server";
import { withX402Payment } from "@/lib/payments/x402-gateway";

const workerLogic = async (req: Request) => {
  try {
    const url = new URL(req.url);
    const platform = url.searchParams.get("platform") || "unknown";
    
    // Simulate fetching data via Featherless API here...
    const mockKpiData = {
      platform,
      engagementRate: "4.8%",
      followerGrowth: "+1,200",
      topPerformingFormat: "Short-form Video",
      insights: "Audience retention is highest on tutorial content."
    };

    return NextResponse.json({ success: true, data: mockKpiData });
  } catch (error) {
    console.error("[API/Worker/KPI] Error:", error);
    return NextResponse.json({ error: "Failed to generate KPI report" }, { status: 500 });
  }
};

export const GET = withX402Payment(workerLogic, {
  priceInUSDC: 0.01,
  paymentAddress: "arc:0xWorkerKpiAddressA1B2C3",
});
