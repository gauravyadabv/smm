import { FunctionDeclaration, SchemaType } from "@google/generative-ai";

export const hireSpecialistDeclaration: FunctionDeclaration = {
  name: "hire_specialist",
  description: "Hires a specialized worker agent to perform a specific marketing or analysis task. Each call initiates a micro-payment via the x402 protocol.",
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      specialist_type: {
        type: SchemaType.STRING,
        description: "The type of specialist to hire. Options: 'kpi_analyst', 'sentiment_reader', 'creative_director', 'data_scientist', 'media_buyer'.",
      },
      task_description: {
        type: SchemaType.STRING,
        description: "A detailed description of the task for the specialist, including target platforms, handles, or required outputs.",
      },
      max_budget_usdc: {
        type: SchemaType.NUMBER,
        description: "The maximum budget allocated for this task in USDC (e.g., 0.05).",
      }
    },
    required: ["specialist_type", "task_description", "max_budget_usdc"],
  },
};

export const cmoTools = [
  {
    functionDeclarations: [hireSpecialistDeclaration],
  },
];
