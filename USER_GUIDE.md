# 🧁 Whisk — User Guide

Everything you need to run Whisk, bake with it, and deploy it. For the
architecture story, see the [README](README.md).

## 1. What Whisk does

You tell Whisk what's in your kitchen. An AI then works in **two stages**:

1. **Pitch** — it suggests three different bakes designed around your exact
   ingredients (and your vibe, if you gave one).
2. **Bake** — you pick a pitch, and it designs the complete recipe: metric
   measurements, ordered steps, substitutions for anything you might be
   missing, a difficulty rating, and a coffee pairing.

No key configured? Whisk runs in **demo mode** — a built-in set of recipes so
the site is always clickable. You'll see a `demo bake` badge on results.

## 2. Using the app

1. **Open the studio** — scroll down or hit the button on the landing page.
2. **Tap the pantry shelf** — each 8-bit ingredient you tap drops into the
   mixing bowl. Tap again to take it back out.
3. **Anything the shelf doesn't have** — type it in the "something else?" box
   (condensed milk, oats, miso… anything) and hit **add**. Click a chip to
   remove it.
4. **Set a vibe (optional)** — "cosy rainy afternoon", "birthday for a friend
   who hates frosting", whatever. The AI genuinely uses it.
5. **whisk up ideas!** — the AI pitches three bakes. Read the hooks, pick one.
6. **bake this** — enjoy the show 🥣✨ — then the recipe card appears:
   - **tap each step** to check it off as you bake
   - hearts show difficulty (1 = easy, 3 = advanced)
   - swaps, coffee pairing and a make-or-break tip live at the bottom

## 3. Running it locally

You need [Node.js](https://nodejs.org) 18+.

```bash
git clone https://github.com/c0smo-55/whisk.git
cd whisk
npm install
npm run dev
```

Open http://localhost:3000. That's demo mode — to make it real AI, keep reading.

## 4. Getting a free AI key

> **Just visiting the deployed site?** You don't need any of this — the AI runs
> on the site's own key. Keys are only for people running their own copy.

Whisk speaks to any OpenAI-compatible LLM API. Two genuinely free options:

### Option A — Google Gemini (easiest if you have a Google account)

1. Go to [aistudio.google.com](https://aistudio.google.com) and sign in.
2. Click **Get API key** → **Create API key**. Free — no credit card, and it
   cannot silently charge you (there's no card to charge).
3. Create a file called `.env.local` in the project root:

   ```
   LLM_API_KEY=your_key_here
   LLM_BASE_URL=https://generativelanguage.googleapis.com/v1beta/openai
   LLM_MODEL=gemini-2.5-flash
   ```

Free-tier limits are roughly 10 requests/minute and a few hundred per day.
One full bake = 2 requests (ideas + recipe), so that's plenty.

### Option B — Groq (open-source Llama models)

1. Sign up at [console.groq.com](https://console.groq.com) (free, no card) and
   create a key. *Tip: if the login loops or you get "access denied", try an
   incognito window and avoid VPNs/campus Wi-Fi for the signup.*
2. `.env.local` needs just one line — the defaults already point at Groq:

   ```
   LLM_API_KEY=gsk_your_key_here
   ```

### Other providers

Any service with an OpenAI-compatible `/chat/completions` endpoint works —
DeepSeek, OpenRouter, Together, a local Ollama — by setting all three vars:

```
LLM_API_KEY=...
LLM_BASE_URL=https://openrouter.ai/api/v1        # example: OpenRouter
LLM_MODEL=deepseek/deepseek-chat-v3-0324:free    # example: free DeepSeek
```

There's also `ANTHROPIC_API_KEY` for Claude (paid; wins if both are set).

**After editing `.env.local`, restart the dev server** — env files are only
read at startup. `.env.local` is gitignored, so your key can never be pushed.

## 5. Deploying to Vercel

1. Push the repo to GitHub (already done if you cloned this one).
2. At [vercel.com/new](https://vercel.com/new), import the repo — the defaults
   are correct, no build config needed.
3. In **Project → Settings → Environment Variables**, add the same variables
   from your `.env.local` (`LLM_API_KEY`, `LLM_BASE_URL`, `LLM_MODEL`).
   Skip this and the deployed site runs in demo mode.
4. Deploy. Add the live URL to the README so people can click it.

## 6. Troubleshooting

| Symptom | Fix |
|---|---|
| Every result shows the `demo bake` badge | No key is loaded: check `.env.local` exists in the project root, then restart the dev server. |
| "Whisk couldn't dream up a recipe just now" | Usually a rate limit (free tiers allow ~10 requests/min) — wait a minute. If it persists, check the terminal running `npm run dev` for the real error. |
| "Whisk needs a breather — try again in a minute." | You hit Whisk's own per-visitor limit (8 requests/min). It resets on its own. |
| Terminal shows `MALFORMED_FUNCTION_CALL` | The model ran out of output tokens. Budgets in `lib/openaiCompat.ts` are already generous — if you switched to another thinking-heavy model, raise them further. |
| Terminal shows `LLM API error 401/403` | The key is wrong or expired — re-copy it into `.env.local` and restart. |
| Page looks broken after a server restart | Hard refresh: `Ctrl + Shift + R`. |
| `EADDRINUSE: port 3000` | Another dev server is still running — close it, or run `npx kill-port 3000`. |

---

made with ♡ by [hannah how](https://github.com/c0smo-55)
