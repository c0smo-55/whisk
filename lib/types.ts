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
}

export interface GenerateResponse {
  recipe: Recipe;
  source: "claude" | "demo";
}
