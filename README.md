# 🎀 Whisk — AI baking studio

Tap your pixel pantry, hit **whisk**, and an AI pastry brain designs you a complete
recipe card — measurements, steps, smart substitutions, and a barista-grade coffee
pairing — rendered in a hand-drawn 8-bit pastel world.

**Live demo:** _(Vercel link here)_

## Why this exists

Most "AI demos" are a text box and a wall of prose. Whisk treats the LLM as a
**structured product component**: the model's output is forced into a typed schema
and rendered as a real, interactive UI — not chat.

## How the AI part works

- **Tool-use as an output contract** — [`lib/anthropic.ts`](lib/anthropic.ts) defines a
  `record_recipe` tool schema and sets `tool_choice` to force Claude to "call" it.
  The response is validated, typed JSON (`Recipe`), never prose that needs parsing.
- **Server-side only** — the key lives in an environment variable and every model
  call happens in a Next.js route handler ([`app/api/generate/route.ts`](app/api/generate/route.ts)),
  so nothing sensitive ever reaches the browser.
- **Deterministic fallback** — with no `ANTHROPIC_API_KEY` set, the API serves a
  built-in demo recipe, so the deployed site is always clickable for reviewers.

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

For live generation, copy `.env.example` to `.env.local` and add your
`ANTHROPIC_API_KEY`.

## Stack

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS · Framer Motion ·
Claude API (`@anthropic-ai/sdk`)
