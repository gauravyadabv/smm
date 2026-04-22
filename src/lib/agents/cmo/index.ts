import { GoogleGenerativeAI, ChatSession } from "@google/generative-ai";
import { CMO_SYSTEM_PROMPT } from "./prompt";
import { cmoTools } from "./tools";

// Initialize Gemini Client
const getGenAIClient = () => {
  const apiKey = process.env.GEMINI_API_KEY || "mock-api-key";
  return new GoogleGenerativeAI(apiKey);
};

export class CMOAgent {
  private chatSession: ChatSession | null = null;
  private isMockMode: boolean = false;

  constructor() {
    this.isMockMode = !process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "your_gemini_api_key_here";
  }

  /**
   * Initializes a new chat session with the CMO persona rules.
   */
  async initSession() {
    if (this.isMockMode) {
      console.log("[CMO Agent] Running in Mock Mode - no API key detected.");
      return;
    }

    const genAI = getGenAIClient();
    // Using Gemini 1.5 Pro to represent "Gemini 3 Pro" as specified in the PRD (using actual available model string)
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro",
      systemInstruction: CMO_SYSTEM_PROMPT,
      tools: cmoTools,
    });

    this.chatSession = model.startChat({
      history: [],
      generationConfig: {
        temperature: 0.2, // CMO should be highly deterministic and analytical
      },
    });
  }

  /**
   * Sends a brief or message to the CMO agent
   */
  async sendMessage(message: string): Promise<string> {
    if (this.isMockMode) {
      return this.mockResponse(message);
    }

    if (!this.chatSession) {
      await this.initSession();
    }

    try {
      const result = await this.chatSession!.sendMessage(message);
      const response = result.response;
      
      // If the model demands a function call to hire a specialist
      const functionCalls = response.functionCalls();
      if (functionCalls && functionCalls.length > 0) {
        let finalResponse = "";
        
        for (const call of functionCalls) {
          if (call.name === "hire_specialist") {
            const args = call.args as any;
            console.log(`[CMO Agent] 📡 Dispatching Worker: ${args.specialist_type} (Budget: ${args.max_budget_usdc} USDC)`);
            
            // Execute the mock task execution (this will be the actual x402 gateway loop later)
            const simulatedResult = this.simulateSpecialistTask(args.specialist_type, args);
            
            // Send the function response back to Gemini to continue its reasoning
            const continueResult = await this.chatSession!.sendMessage([{
              functionResponse: {
                name: "hire_specialist",
                response: simulatedResult,
              }
            }]);
            
            finalResponse = continueResult.response.text();
          }
        }
        return finalResponse;
      }

      return response.text();
    } catch (error) {
      console.error("[CMO Agent] Error:", error);
      throw new Error("Failed to process message through CMO agent.");
    }
  }

  /**
   * Simulates a specialist response while the API layer isn't hooked up to Featherless/x402 yet
   */
  private simulateSpecialistTask(specialistType: string, args: any) {
    console.log(`[x402 Gateway Placeholder] Payment of ${args.max_budget_usdc} USDC transferred to worker. Payload returned.`);
    switch (specialistType) {
      case "kpi_analyst":
        return { status: "success", data: { engagementRate: "4.2%", growth: "+12%", sentiment: "Positive" } };
      case "sentiment_reader":
         return { status: "success", data: { main_emotion: "Excitement", top_themes: ["launch", "cool tech", "fast"] } };
      case "creative_director":
         return { status: "success", data: { recommendations: ["Bold typography", "Day in the life format"], tone: "Professional" } };
      case "data_scientist":
         return { status: "success", data: { viral_prob: "64%", anomaly: "Drop-off at sec 12 detected." } };
      case "media_buyer":
         return { status: "success", data: { platforms: ["X", "TikTok"], suggested_bid: "0.05 USDC" } };
      default:
        return { status: "success", data: { result: "Simulated completion." } };
    }
  }

  private mockResponse(message: string): string {
    return `[Mock Validation] As the CMO Agent, I analyzed the brief: "${message}".\n\nI have identified that I need external data. \n\n-> *Hired: KPI Analyst (0.01 USDC paid via Arc)*\n-> *Hired: Sentiment Reader (0.002 USDC paid via Arc)*\n\nBoth executed successfully via the x402 simulator. The user's campaign strategy is now verified.`;
  }
}
