<div align="center">
  <img src="https://via.placeholder.com/150/00C2FF/0F1923?text=SWAN" alt="SWAN Logo" width="100" />
  <h1>SWAN — Social Workflow & Agentic Network</h1>
  <p><em>The world's first high-frequency Social Media Marketing economy natively on Arc L1.</em></p>
</div>

<br />

## ✦ The Vision
The Social Media Marketing industry runs on flat-rate subscription software — static tools that charge the same whether you run one campaign or a thousand. There is no mechanism for AI agents to autonomously purchase micro-data from one another.

**SWAN changes this.**

SWAN decentralizes every marketing task into an autonomous micro-service. Each insight has a price. Each agent can hire any other agent. Value settles on-chain in real-time using USDC nanopayments over the **x402 HTTP protocol**, backed by the Circle Programmable Wallet on **Arc L1**.

## 🏗 Architecture
SWAN is structured as a five-layer stack.
1. **CMO Agent (Orchestrator):** Gemini 3 Pro reasoning. Multi-step campaign planning, budget allocation, and task dispatching.
2. **Worker Agents (Execution):** Specialized models (KPI analysis, hook testing, sentiment reading) exposed via a unified API using Featherless.
3. **PM Agent (Verification):** Gemini 3 Flash multimodal vision analysis. Checks brand tone alignment and data dashboards before task acceptance.
4. **x402 Gateway (Payment Rail):** HTTP 402 middleware enforcing EIP-3009 authorization prior to endpoint access.
5. **Arc L1 (Settlement):** Deterministic sub-second transaction finality. Batch settlement rolls up 50+ micro-payments into a single block with zero gas costs.

## 📈 The Margin Proof (Economics)
The economic viability of SWAN depends on Arc L1's gas structure. This business model is physically impossible on legacy chains.
- **Average Task Cost:** $0.0021 USDC 
- **Arc L1 Gas Cost:** $0.0000 
- **Net Margin (per task):** +$0.0019

If running a 50-task batch loop, SWAN successfully settles the micro-tasks in a single block without margin loss.

## 🚀 Getting Started

### Prerequisites
Make sure you have Node.js installed. In a production environment, you will need active API keys for Gemini, Circle, and Featherless.

### Local Installation
1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`
2. Set up your \`.env.local\` file (copy from \`.env.example\`). To run in **Mock Validation Mode** for the demo, you can leave the keys blank.
3. Start the development server:
   \`\`\`bash
   npm run dev
   \`\`\`
4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the Orchestrator Dashboard.

---
*Built during a 5-Day Sprint.*
