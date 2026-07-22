# 🎀 Whisk — AI baking studio (still working on it)

Tap your pixel pantry, hit **whisk**, and an AI pastry brain designs you a complete
recipe card — measurements, steps, smart substitutions, and a barista-grade coffee
pairing — rendered in a hand-drawn 8-bit pastel world.

**Live demo:** _(Vercel link here)_ · **New here? Read the [User Guide](USER_GUIDE.md).**

## What is this? (the no-jargon version)

Whisk is a website where an AI acts as your personal pastry chef. You tap in
whatever's in your kitchen — flour, matcha, strawberries — and it first pitches
**three desserts you could actually make**, designed around exactly those
ingredients. Pick your favourite, and it invents the complete recipe on the
spot: measurements, step-by-step instructions, substitutions for anything
you're missing, and even a coffee pairing.

There's no recipe database hiding underneath. Every recipe is generated fresh
by an AI (the same kind of technology behind ChatGPT). The engineering work is
in making that AI behave like a **reliable product component**: my site asks it
for answers in a strict, organised format, checks them, and renders them as an
interactive recipe card — not a wall of chatbot text. And if you're just
*visiting* the site, there's nothing to set up — the AI runs on the server,
so you only bring your ingredients.

The look is equally deliberate: every ingredient is a hand-drawn pixel-art
sprite (think Game Boy, but pastel), you tap them into a mixing bowl, and while
your recipe is being created a little whisk stirs your ingredients until
sparkles burst. I bake and I'm a certified barista — this is the project only
I would have made.

## Why this exists

Most "AI demos" are a text box and a wall of prose. Whisk treats the LLM as a
**structured product component**: the model's output is forced into a typed schema
and rendered as a real, interactive UI — not chat.

## How the AI part works

- **A two-stage agent pipeline** — stage one (`/api/suggest`) has the model pitch
  three distinct bakes for your exact bowl; the one you pick is fed into stage two
  (`/api/generate`), which designs the full recipe around that choice. Two chained,
  structured LLM calls, not one prompt-and-pray.
- **Tool-use as an output contract** — [`lib/schemas.ts`](lib/schemas.ts) defines
  `record_ideas` and `record_recipe` JSON Schemas, and both stages force the model
  to "call" them (`tool_choice`). Responses are validated, typed JSON (`Idea[]`,
  `Recipe`), never prose that needs parsing.
- **Provider-agnostic** — [`lib/provider.ts`](lib/provider.ts) routes to Claude
  ([`lib/anthropic.ts`](lib/anthropic.ts)) or any OpenAI-compatible API
  ([`lib/openaiCompat.ts`](lib/openaiCompat.ts)): Groq's free tier, DeepSeek,
  OpenRouter, even a local Ollama — same schemas, same contract. Off-schema
  output from smaller models is clamped to safe values, not crashed on.
- **Server-side only** — keys live in environment variables and every model
  call happens in Next.js route handlers, so nothing sensitive ever reaches the
  browser. Visitors never need their own key: the deployed site's AI runs on
  the server's key, like any real product.
- **Abuse-resistant** — [`lib/rateLimit.ts`](lib/rateLimit.ts) caps each visitor
  at 8 requests/minute (~4 bakes), so a single user can't drain the free-tier
  quota for everyone else.
- **Deterministic fallback** — with no key at all, both stages serve from built-in
  demo pools, seeded by the bowl contents so different bowls still give different
  results, and the deployed site is always clickable for reviewers.

## The design system

Every ingredient, dessert, and decoration is an original 8-bit sprite — a pixel
grid + tiny palette in [`lib/sprites.ts`](lib/sprites.ts), rendered as crisp SVG
rects by [`components/PixelSprite.tsx`](components/PixelSprite.tsx). No emojis,
no icon fonts, no image assets: the whole sprite sheet is ~200 lines of data
that scales razor-sharp to any size.

The interaction layer (Framer Motion) fuses **Apple-style glassmorphism** with the
8-bit sprites:

- 🎀 **Hero landing page** — cursor-parallax sprite layers, a floating glass
  "product shot" recipe card that counter-tilts against the mouse, and a
  pausable sprite marquee
- 🍓 **Tappable glass pantry** — ingredients pop into a mixing bowl
- 🌸 **Apple-style scroll story** — the hero scales/dissolves as you scroll;
  frosted feature cards and the studio spring in on view
- ☁️ **Living background** — drifting aurora gradients + parallax pixel clouds,
  behind layered backdrop-blur glass panels
- ✨ **Cursor sparkle trail**, sprinkle burst on reveal, tilt-on-hover recipe card
- ✅ **Tappable bake checklist** and a pixel-heart difficulty gauge

Palette: pastel pink with lavender and periwinkle. Type: Press Start 2P + Nunito.

## Run it

```bash
npm install
npm run dev          # demo mode, no key needed
```

For live generation, copy `.env.example` to `.env.local` and configure **one** provider
(full walkthrough in the [User Guide](USER_GUIDE.md)):

- **Free — Google Gemini** (recommended): grab a key at
  [aistudio.google.com](https://aistudio.google.com), then set
  ```
  LLM_API_KEY=your_key
  LLM_BASE_URL=https://generativelanguage.googleapis.com/v1beta/openai
  LLM_MODEL=gemini-2.5-flash
  ```
- **Free — Groq**: a [console.groq.com](https://console.groq.com/keys) key as
  `LLM_API_KEY` (defaults target Groq + open-source Llama 3.3 70B, so no other
  vars needed). Same setup works for DeepSeek or OpenRouter by overriding
  `LLM_BASE_URL` + `LLM_MODEL`.
- **Paid:** an `ANTHROPIC_API_KEY` for Claude (takes priority if both are set).

## Stack

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS · Framer Motion ·
Claude API / any OpenAI-compatible LLM (Groq, DeepSeek, OpenRouter…)
