import { NextResponse } from "next/server";
import { generateRecipe, hasApiKey } from "@/lib/anthropic";
import { DEMO_RECIPES, hashPick } from "@/lib/mock";
import type { GenerateRequest, GenerateResponse } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: GenerateRequest;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!body.ingredients || body.ingredients.trim().length < 2) {
    return NextResponse.json(
      { error: "Tell Whisk at least one ingredient." },
      { status: 400 }
    );
  }

  // No key configured → serve a demo recipe so the deployed site always works.
  // If the baker picked an idea whose title matches a demo recipe, honour it;
  // otherwise pick deterministically from the bowl contents.
  if (!hasApiKey()) {
    const matched = body.chosen
      ? DEMO_RECIPES.find((r) =>
          r.title.toLowerCase().includes(body.chosen!.toLowerCase().slice(0, 12))
        )
      : undefined;
    const recipe =
      matched ??
      DEMO_RECIPES[hashPick(body.ingredients + (body.chosen ?? ""), DEMO_RECIPES.length)];
    const res: GenerateResponse = { recipe, source: "demo" };
    return NextResponse.json(res);
  }

  try {
    const recipe = await generateRecipe(body);
    const res: GenerateResponse = { recipe, source: "claude" };
    return NextResponse.json(res);
  } catch (err) {
    console.error("generateRecipe failed:", err);
    return NextResponse.json(
      { error: "Whisk couldn't dream up a recipe just now. Try again in a moment." },
      { status: 502 }
    );
  }
}
