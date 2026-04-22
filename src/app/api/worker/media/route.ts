import { NextResponse } from "next/server";
import { withX402Payment } from "@/lib/payments/x402-gateway";

const workerLogic = async (req: Request) => {
  try {
    const mockMediaData = {
      role: "Media Buyer",
      targetAudience: "Gen Z interested in FinTech",
      suggestedBidUSDC: "0.05",
      placements: ["X Home Feed", "TikTok Spark Ads", "Instagram Reels"],
      estimatedCpc: "$0.12"
    };

    return NextResponse.json({ success: true, data: mockMediaData });
  } catch (error) {
    console.error("[API/Worker/Media] Error:", error);
    return NextResponse.json({ error: "Failed to process media placement" }, { status: 500 });
  }
};

export const GET = withX402Payment(workerLogic, {
  priceInUSDC: 0.02,
  paymentAddress: "arc:0xWorkerMediaAddressJ0K1L2",
});
