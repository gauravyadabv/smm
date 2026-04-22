import { GoogleGenerativeAI } from "@google/generative-ai";

const getGenAIClient = () => {
  const apiKey = process.env.GEMINI_API_KEY || "mock-api-key";
  return new GoogleGenerativeAI(apiKey);
};

export class PMAgent {
  private isMockMode: boolean = false;

  constructor() {
    this.isMockMode = !process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "your_gemini_api_key_here";
  }

  /**
   * Verifies visual assets (e.g. data dashboards or brand images) to ensure alignment with expectations
   */
  async verifyVisualAsset(base64Image: string, assetDescription: string, expectedValidation: string): Promise<{ success: boolean; notes: string }> {
    if (this.isMockMode) {
      console.log(`[PM Agent Tracker] Verified mock visual asset for: ${assetDescription}`);
      return {
        success: true,
        notes: "Mock validation passed: The brand colors match the expected tone."
      };
    }

    try {
      const genAI = getGenAIClient();
      // Using Gemini 1.5 Flash to represent "Gemini 3 Flash" as specified in the PRD
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `
You are the PM Agent for the SWAN protocol. Your job is to verify visual assets.
Description of asset: ${assetDescription}
Expected validation: ${expectedValidation}

Analyze the provided image and respond strictly in JSON format:
{
  "success": boolean,
  "notes": "Brief explanation of why it passed or failed based on the expected validation."
}
`;

      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            data: base64Image,
            mimeType: "image/jpeg" // Defaulting to jpeg; in production, pass dynamically
          }
        }
      ]);

      const textResult = result.response.text();
      // Parse the JSON. In production we'd use robust JSON extraction from the markdown wrapper.
      const cleaned = textResult.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleaned);

      return {
        success: parsed.success,
        notes: parsed.notes
      };

    } catch (error) {
      console.error("[PM Agent] Vision Verification Error:", error);
      return { success: false, notes: "Failed to process visual validation." };
    }
  }
}
