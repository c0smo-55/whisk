import { NextResponse } from "next/server";
import { aiGenerateRecipe, liveProvider } from "@/lib/provider";
import { DEMO_RECIPES, hashPick } from "@/lib/mock";
import { clientIp, rateLimit } from "@/lib/rateLimit";
import type { GenerateRequest, GenerateResponse } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!rateLimit(clientIp(request))) {
    return NextResponse.json(
      { error: "Whisk needs a breather — try again in a minute." },
      { status: 429 }
    );
  }

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

  // No live provider configured → serve a demo recipe so the deployed site
  // always works. If the baker picked an idea whose title matches a demo
  // recipe, honour it; otherwise pick deterministically from the bowl.
  if (!liveProvider()) {
    const matched = body.chosen
      ? DEMO_RECIPES.find((r) => r.title.toLowerCase() === body.chosen!.toLowerCase())
      : undefined;
    const recipe =
      matched ??
      DEMO_RECIPES[hashPick(body.ingredients + (body.chosen ?? ""), DEMO_RECIPES.length)];
    const res: GenerateResponse = { recipe, source: "demo" };
    return NextResponse.json(res);
  }

  try {
    const recipe = await aiGenerateRecipe(body);
    const res: GenerateResponse = { recipe, source: "ai" };
    return NextResponse.json(res);
  } catch (err) {
    console.error("generateRecipe failed:", err);
    return NextResponse.json(
      { error: "Whisk couldn't dream up a recipe just now. Try again in a moment." },
      { status: 502 }
    );
  }
}
