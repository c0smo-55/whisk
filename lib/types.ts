// The structured shape Claude is asked to return — and the shape the UI renders.

// Every bake gets one of our hand-drawn 8-bit hero sprites (no emojis here).
export const DESSERT_SPRITES = [
  "cake",
  "cupcake",
  "cookie",
  "bread",
  "pie",
  "donut",
] as const;
export type DessertSprite = (typeof DESSERT_SPRITES)[number];

export interface Recipe {
  title: string;
  sprite: DessertSprite;
  description: string;
  difficulty: "easy" | "medium" | "advanced";
  totalMinutes: number;
  servings: string;
  ingredients: { item: string; amount: string }[];
  steps: string[];
  substitutions: { missing: string; use: string }[];
  coffeePairing: { drink: string; why: string };
  bakerTip: string;
}

export interface GenerateRequest {
  ingredients: string; // free text: "flour, eggs, matcha, condensed milk"
  vibe?: string; // optional: "something cute for a rainy afternoon"
  chosen?: string; // the idea the baker picked from the suggestions step
}

export interface GenerateResponse {
  recipe: Recipe;
  source: "claude" | "demo";
}

// Stage one of the agent pipeline: the AI pitches bakes before designing one.
export interface Idea {
  title: string;
  sprite: DessertSprite;
  hook: string; // one appetising line on why this fits the bowl
}

export interface SuggestResponse {
  ideas: Idea[];
  source: "claude" | "demo";
}
