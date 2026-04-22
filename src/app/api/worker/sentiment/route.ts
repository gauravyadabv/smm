import { NextResponse } from "next/server";
import { withX402Payment } from "@/lib/payments/x402-gateway";

const workerLogic = async (req: Request) => {
  try {
    const { comments } = await req.json();
    
    // Simulate fetching data via Featherless API / Specialist Sentiment Model
    const mockSentimentData = {
      analyzedComments: comments?.length || 500,
      overallSentiment: "Highly Positive",
      dominantEmotion: "Excitement",
      topThemes: ["Pricing is perfect", "Love the UI", "When is Android version?"],
      actionableInsight: "Audience is eager; prioritize Android release announcements."
    };

    return NextResponse.json({ success: true, data: mockSentimentData });
  } catch (error) {
    console.error("[API/Worker/Sentiment] Error:", error);
    return NextResponse.json({ error: "Failed to read sentiment" }, { status: 500 });
  }
};

export const POST = withX402Payment(workerLogic, {
  priceInUSDC: 0.002, // 0.002 USDC per batch as per PRD
  paymentAddress: "arc:0xWorkerSentiment999ZZZ",
});
