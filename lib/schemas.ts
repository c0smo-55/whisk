import { DESSERT_SPRITES } from "./types";

// The JSON Schemas both providers are forced to fill. Keeping them in one
// place means Claude and any OpenAI-compatible model (Groq, DeepSeek,
// OpenRouter…) are held to exactly the same output contract.

export const SYSTEM_PROMPT = `You are Whisk, a warm, precise baking studio assistant with a barista's palate.
Given a home baker's available ingredients (and an optional vibe), design achievable bakes that
lean on what they have. Prefer realistic home quantities and metric units. Keep the tone friendly and
encouraging. Always answer by calling the provided tool with complete structured data — never in prose.`;

export const IDEAS_SCHEMA = {
  type: "object",
  properties: {
    ideas: {
      type: "array",
      minItems: 3,
      maxItems: 3,
      items: {
        type: "object",
        properties: {
          title: { type: "string", description: "Short, appetising bake name." },
          sprite: {
            type: "string",
            enum: [...DESSERT_SPRITES],
            description: "The pixel-art icon that best matches the bake.",
          },
          hook: {
            type: "string",
            description: "One line on why this bake fits their bowl.",
          },
        },
        required: ["title", "sprite", "hook"],
      },
    },
  },
  required: ["ideas"],
} as const;

export const RECIPE_SCHEMA = {
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
} as const;

export function ideasPrompt(ingredients: string, vibe?: string): string {
  return [
    `Ingredients I have: ${ingredients}`,
    vibe ? `Vibe I'm going for: ${vibe}` : "",
    "Pitch three distinct bakes I could make with these.",
  ]
    .filter(Boolean)
    .join("\n");
}

export function recipePrompt(ingredients: string, vibe?: string, chosen?: string): string {
  return [
    `Ingredients I have: ${ingredients}`,
    vibe ? `Vibe I'm going for: ${vibe}` : "",
    chosen
      ? `I picked this bake from your suggestions: ${chosen}. Design exactly that.`
      : "Design one recipe that mostly uses these.",
  ]
    .filter(Boolean)
    .join("\n");
}
