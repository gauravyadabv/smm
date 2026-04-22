import { NextResponse } from "next/server";

export interface X402Options {
  priceInUSDC: number;
  paymentAddress: string;
}

/**
 * x402 Gateway Middleware
 * Wraps worker API routes to enforce EIP-3009/Arc L1 micro-payments.
 * Returns an HTTP 402 Payment Required response if the payment proof is missing.
 */
export function withX402Payment(
  handler: (req: Request) => Promise<NextResponse>,
  options: X402Options
) {
  return async (req: Request) => {
    const paymentProof = req.headers.get("X-Payment-Proof");

    if (!paymentProof) {
      // Missing payment. Return standard x402 requirement headers.
      return new NextResponse(
        JSON.stringify({
          error: "Payment Required",
          message: `This agent endpoint requires a micro-payment of ${options.priceInUSDC} USDC.`
        }),
        {
          status: 402,
          headers: {
            "Content-Type": "application/json",
            "X-Payment-Required": `${options.priceInUSDC} USDC`,
            "X-Payment-Address": options.paymentAddress,
            "X-Payment-Standard": "EIP-3009",
          },
        }
      );
    }

    // In a production environment, we would query Arc L1 here via ethers.js 
    // to verify the paymentProof hash actually settled and transferred funds to 'options.paymentAddress'.
    // For now, if the header exists, we assume the settlement was simulated successfully.

    console.log(`[x402 Gateway] Payment Proof accepted: ${paymentProof}`);
    return handler(req);
  };
}
