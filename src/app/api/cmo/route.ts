import { NextResponse } from "next/server";
import { CMOAgent } from "@/lib/agents/cmo";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message brief is required." }, { status: 400 });
    }

    const cmo = new CMOAgent();
    // Initialize the conversational session
    await cmo.initSession();

    // Process the brief
    const responseText = await cmo.sendMessage(message);

    return NextResponse.json({ success: true, data: responseText });
  } catch (error) {
    console.error("[API/CMO] Error:", error);
    return NextResponse.json({ error: "Failed to process CMO request" }, { status: 500 });
  }
}
