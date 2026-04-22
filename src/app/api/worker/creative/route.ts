import { NextResponse } from "next/server";
import { withX402Payment } from "@/lib/payments/x402-gateway";

const workerLogic = async (req: Request) => {
  try {
    const mockCreativeData = {
      role: "Creative Director",
      recommendations: [
        "Use high-contrast thumbnails with bold typography.",
        "Focus on the 'Day in the Life' storytelling format.",
        "Incorporate trending audio from the previous week."
      ],
      assetTone: "Professional yet approachable"
    };

    return NextResponse.json({ success: true, data: mockCreativeData });
  } catch (error) {
    console.error("[API/Worker/Creative] Error:", error);
    return NextResponse.json({ error: "Failed to generate creative brief" }, { status: 500 });
  }
};

export const GET = withX402Payment(workerLogic, {
  priceInUSDC: 0.005,
  paymentAddress: "arc:0xWorkerCreativeAddressD4E5F6",
});
