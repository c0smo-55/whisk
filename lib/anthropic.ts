import Anthropic from "@anthropic-ai/sdk";
import {
  IDEAS_SCHEMA,
  RECIPE_SCHEMA,
  SYSTEM_PROMPT,
  ideasPrompt,
  recipePrompt,
} from "./schemas";
import type { GenerateRequest, Idea, Recipe } from "./types";

// Claude provider. A tool schema is the clean way to force the model into
// exactly our shape — it must "call" the tool with valid args, so we get
// typed JSON back instead of parsing prose.

async function callTool<T>(
  toolName: string,
  description: string,
  schema: Anthropic.Tool.InputSchema,
  userPrompt: string,
  maxTokens: number
): Promise<T> {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const message = await client.messages.create({
    model: "claude-sonnet-5",
    max_tokens: maxTokens,
    system: SYSTEM_PROMPT,
    tools: [{ name: toolName, description, input_schema: schema }],
    tool_choice: { type: "tool", name: toolName },
    messages: [{ role: "user", content: userPrompt }],
  });

  const toolUse = message.content.find(
    (block): block is Anthropic.ToolUseBlock => block.type === "tool_use"
  );
  if (!toolUse) {
    throw new Error("Claude did not return structured output.");
  }
  return toolUse.input as T;
}

export async function anthropicSuggestIdeas(req: GenerateRequest): Promise<Idea[]> {
  const result = await callTool<{ ideas: Idea[] }>(
    "record_ideas",
    "Record exactly three distinct bake ideas for these ingredients.",
    IDEAS_SCHEMA as unknown as Anthropic.Tool.InputSchema,
    ideasPrompt(req.ingredients, req.vibe),
    700
  );
  return result.ideas;
}

export async function anthropicGenerateRecipe(req: GenerateRequest): Promise<Recipe> {
  return callTool<Recipe>(
    "record_recipe",
    "Record the final designed recipe in structured form.",
    RECIPE_SCHEMA as unknown as Anthropic.Tool.InputSchema,
    recipePrompt(req.ingredients, req.vibe, req.chosen),
    1400
  );
}
