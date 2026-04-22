import { NextResponse } from "next/server";
import { withX402Payment } from "@/lib/payments/x402-gateway";

const workerLogic = async (req: Request) => {
  try {
    const mockDataScience = {
      role: "Data Scientist",
      predictiveOutcome: "Viral probability: 64%",
      anomalies: "Drop-off detected at second 12 of similar recent videos.",
      optimization: "Shorten intro by 2 seconds to maximize hook retention."
    };

    return NextResponse.json({ success: true, data: mockDataScience });
  } catch (error) {
    console.error("[API/Worker/Data] Error:", error);
    return NextResponse.json({ error: "Failed to perform data analysis" }, { status: 500 });
  }
};

export const GET = withX402Payment(workerLogic, {
  priceInUSDC: 0.015,
  paymentAddress: "arc:0xWorkerDataAddressG7H8I9",
});
