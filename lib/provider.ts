import { anthropicGenerateRecipe, anthropicSuggestIdeas } from "./anthropic";
import { compatGenerateRecipe, compatSuggestIdeas } from "./openaiCompat";
import { DESSERT_SPRITES, type GenerateRequest, type Idea, type Recipe } from "./types";

// Picks whichever live AI provider is configured. Claude wins if both are
// set; with neither, the routes fall back to the demo pools.
type Provider = "anthropic" | "openai-compat" | null;

export function liveProvider(): Provider {
  if (process.env.ANTHROPIC_API_KEY) return "anthropic";
  if (process.env.LLM_API_KEY) return "openai-compat";
  return null;
}

// Open-source models sometimes colour outside the enum lines — clamp
// anything off-schema back to safe values instead of crashing the UI.
function clampSprite(sprite: unknown): Recipe["sprite"] {
  return DESSERT_SPRITES.includes(sprite as Recipe["sprite"])
    ? (sprite as Recipe["sprite"])
    : "cake";
}

function clampDifficulty(d: unknown): Recipe["difficulty"] {
  return d === "easy" || d === "medium" || d === "advanced" ? d : "medium";
}

function sanitizeIdeas(ideas: Idea[]): Idea[] {
  return ideas.slice(0, 3).map((idea) => ({
    title: String(idea.title ?? "Mystery bake"),
    sprite: clampSprite(idea.sprite),
    hook: String(idea.hook ?? ""),
  }));
}

function sanitizeRecipe(recipe: Recipe): Recipe {
  return {
    ...recipe,
    sprite: clampSprite(recipe.sprite),
    difficulty: clampDifficulty(recipe.difficulty),
    totalMinutes: Number(recipe.totalMinutes) || 45,
    ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients : [],
    steps: Array.isArray(recipe.steps) ? recipe.steps : [],
    substitutions: Array.isArray(recipe.substitutions) ? recipe.substitutions : [],
    coffeePairing: recipe.coffeePairing ?? { drink: "Latte", why: "It goes with everything." },
    bakerTip: String(recipe.bakerTip ?? ""),
  };
}

export async function aiSuggestIdeas(req: GenerateRequest): Promise<Idea[]> {
  const ideas =
    liveProvider() === "anthropic"
      ? await anthropicSuggestIdeas(req)
      : await compatSuggestIdeas(req);
  return sanitizeIdeas(ideas);
}

export async function aiGenerateRecipe(req: GenerateRequest): Promise<Recipe> {
  const recipe =
    liveProvider() === "anthropic"
      ? await anthropicGenerateRecipe(req)
      : await compatGenerateRecipe(req);
  return sanitizeRecipe(recipe);
}
