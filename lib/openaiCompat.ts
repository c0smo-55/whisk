import {
  IDEAS_SCHEMA,
  RECIPE_SCHEMA,
  SYSTEM_PROMPT,
  ideasPrompt,
  recipePrompt,
} from "./schemas";
import type { GenerateRequest, Idea, Recipe } from "./types";

// OpenAI-compatible provider — works with any service speaking the
// /chat/completions dialect: Groq (free tier), DeepSeek, OpenRouter,
// Together, a local Ollama, etc. Configure via env:
//   LLM_API_KEY   — required to enable this provider
//   LLM_BASE_URL  — default: Groq
//   LLM_MODEL     — default: llama-3.3-70b-versatile (open-source Llama)

const BASE_URL = () => process.env.LLM_BASE_URL ?? "https://api.groq.com/openai/v1";
const MODEL = () => process.env.LLM_MODEL ?? "llama-3.3-70b-versatile";

async function callTool<T>(
  toolName: string,
  description: string,
  parameters: object,
  userPrompt: string,
  maxTokens: number
): Promise<T> {
  const res = await fetch(`${BASE_URL()}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.LLM_API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL(),
      max_tokens: maxTokens,
      temperature: 0.8,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      tools: [{ type: "function", function: { name: toolName, description, parameters } }],
      tool_choice: { type: "function", function: { name: toolName } },
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`LLM API error ${res.status}: ${detail.slice(0, 300)}`);
  }

  const data = await res.json();
  const call = data.choices?.[0]?.message?.tool_calls?.[0];
  if (!call?.function?.arguments) {
    throw new Error("Model did not return structured output.");
  }
  return JSON.parse(call.function.arguments) as T;
}

export async function compatSuggestIdeas(req: GenerateRequest): Promise<Idea[]> {
  const result = await callTool<{ ideas: Idea[] }>(
    "record_ideas",
    "Record exactly three distinct bake ideas for these ingredients.",
    IDEAS_SCHEMA,
    ideasPrompt(req.ingredients, req.vibe),
    700
  );
  return result.ideas;
}

export async function compatGenerateRecipe(req: GenerateRequest): Promise<Recipe> {
  return callTool<Recipe>(
    "record_recipe",
    "Record the final designed recipe in structured form.",
    RECIPE_SCHEMA,
    recipePrompt(req.ingredients, req.vibe, req.chosen),
    1400
  );
}
