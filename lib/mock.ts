import type { Recipe } from "./types";

// Used when no ANTHROPIC_API_KEY is set, so the deployed demo always works
// and reviewers can click through without a key. Add a key to get real,
// ingredient-aware generations from Claude.
export const DEMO_RECIPE: Recipe = {
  title: "Matcha Condensed-Milk Cloud Cake",
  sprite: "cake",
  description:
    "A soft, jiggly sponge with a whisper of matcha and sweet condensed milk — light enough to feel like a rainy-afternoon nap.",
  difficulty: "medium",
  totalMinutes: 55,
  servings: "8 slices",
  ingredients: [
    { item: "Cake flour", amount: "120 g" },
    { item: "Matcha powder", amount: "1 tbsp" },
    { item: "Eggs, separated", amount: "4" },
    { item: "Condensed milk", amount: "80 g" },
    { item: "Milk", amount: "60 ml" },
    { item: "Neutral oil", amount: "45 ml" },
    { item: "Caster sugar", amount: "60 g" },
  ],
  steps: [
    "Heat oven to 150°C and line a 7-inch pan. Sift flour with matcha twice — no lumps allowed.",
    "Whisk yolks with condensed milk, milk and oil until glossy, then fold in the flour.",
    "Beat whites to soft peaks, adding sugar in three goes until they hold a gentle curl.",
    "Fold whites into the batter in thirds — patient, from the bottom up, keep the air.",
    "Bake in a water bath 45–50 min until the top springs back. Cool upside-down.",
  ],
  substitutions: [
    { missing: "Cake flour", use: "Plain flour minus 2 tbsp + 2 tbsp cornstarch" },
    { missing: "Condensed milk", use: "3 tbsp sugar + 2 tbsp extra milk" },
  ],
  coffeePairing: {
    drink: "Iced shakerato, lightly sweet",
    why: "The bitter-bright espresso cuts the cake's creamy matcha without fighting it.",
  },
  bakerTip:
    "Under-mix and it deflates; over-mix and it turns dense. Fold until *just* no streaks remain.",
};
