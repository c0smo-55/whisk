import { NextResponse } from "next/server";
import { aiSuggestIdeas, liveProvider } from "@/lib/provider";
import { DEMO_IDEAS, hashPick } from "@/lib/mock";
import type { GenerateRequest, SuggestResponse } from "@/lib/types";

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

  // No live provider → pick three demo ideas, seeded by the bowl so
  // different bowls pitch different bakes.
  if (!liveProvider()) {
    const start = hashPick(body.ingredients + (body.vibe ?? ""), DEMO_IDEAS.length);
    const ideas = [0, 1, 2].map((i) => DEMO_IDEAS[(start + i * 2) % DEMO_IDEAS.length]);
    const res: SuggestResponse = { ideas, source: "demo" };
    return NextResponse.json(res);
  }

  try {
    const ideas = await aiSuggestIdeas(body);
    const res: SuggestResponse = { ideas, source: "ai" };
    return NextResponse.json(res);
  } catch (err) {
    console.error("suggestIdeas failed:", err);
    return NextResponse.json(
      { error: "Whisk couldn't dream up ideas just now. Try again in a moment." },
      { status: 502 }
    );
  }
}
