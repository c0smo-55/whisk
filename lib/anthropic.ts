import Anthropic from "@anthropic-ai/sdk";
import { DESSERT_SPRITES, type GenerateRequest, type Recipe } from "./types";

// A tool schema is the clean way to force Claude into exactly our Recipe shape —
// the model must "call" record_recipe with valid args, so we get typed JSON back
// instead of parsing prose. This is the core bit of LLM engineering in the app.
const RECIPE_TOOL: Anthropic.Tool = {
  name: "record_recipe",
  description: "Record the final designed recipe in structured form.",
  input_schema: {
    type: "object",
    properties: {
      title: { type: "string", description: "Short, appetising recipe name." },
      sprite: {
        type: "string",
        enum: [...DESSERT_SPRITES],
        description: "The pixel-art icon that best matches the bake.",
      },
      description: { type: "string", description: "1–2 warm sentences." },
      difficulty: { type: "string", enum: ["easy", "medium", "advanced"] },
      totalMinutes: { type: "number", description: "Prep + bake time in minutes." },
      servings: { type: "string", description: "e.g. '8 slices' or '12 cookies'." },
      ingredients: {
        type: "array",
        items: {
          type: "object",
          properties: {
            item: { type: "string" },
            amount: { type: "string", description: "With units, e.g. '120 g'." },
          },
          required: ["item", "amount"],
        },
      },
      steps: {
        type: "array",
        items: { type: "string" },
        description: "Ordered, friendly instructions.",
      },
      substitutions: {
        type: "array",
        items: {
          type: "object",
          properties: {
            missing: { type: "string" },
            use: { type: "string" },
          },
          required: ["missing", "use"],
        },
        description: "Swaps if a listed ingredient is unavailable.",
      },
      coffeePairing: {
        type: "object",
        properties: {
          drink: { type: "string" },
          why: { type: "string" },
        },
        required: ["drink", "why"],
      },
      bakerTip: { type: "string", description: "One make-or-break tip." },
    },
    required: [
      "title",
      "sprite",
      "description",
      "difficulty",
      "totalMinutes",
      "servings",
      "ingredients",
      "steps",
      "substitutions",
      "coffeePairing",
      "bakerTip",
    ],
  },
};

const SYSTEM = `You are Whisk, a warm, precise baking studio assistant with a barista's palate.
Given a home baker's available ingredients (and an optional vibe), design ONE achievable recipe that
leans on what they have. Prefer realistic home quantities and metric units. Keep the tone friendly and
encouraging. Always call record_recipe with the complete structured recipe — never reply in prose.`;

export function hasApiKey(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

export async function generateRecipe(req: GenerateRequest): Promise<Recipe> {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const userPrompt = [
    `Ingredients I have: ${req.ingredients}`,
    req.vibe ? `Vibe I'm going for: ${req.vibe}` : "",
    "Design one recipe that mostly uses these. Call record_recipe.",
  ]
    .filter(Boolean)
    .join("\n");

  const message = await client.messages.create({
    model: "claude-sonnet-5",
    max_tokens: 1400,
    system: SYSTEM,
    tools: [RECIPE_TOOL],
    tool_choice: { type: "tool", name: "record_recipe" },
    messages: [{ role: "user", content: userPrompt }],
  });

  const toolUse = message.content.find(
    (block): block is Anthropic.ToolUseBlock => block.type === "tool_use"
  );
  if (!toolUse) {
    throw new Error("Claude did not return a structured recipe.");
  }
  return toolUse.input as Recipe;
}
