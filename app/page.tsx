"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { GenerateResponse, Idea, Recipe, SuggestResponse } from "@/lib/types";
import { PANTRY, type SpriteName } from "@/lib/sprites";
import PixelSprite from "@/components/PixelSprite";
import FloatingPixels from "@/components/FloatingPixels";
import CursorSparkles from "@/components/CursorSparkles";
import HeroLanding from "@/components/HeroLanding";
import FeatureCards from "@/components/FeatureCards";
import Pantry from "@/components/Pantry";
import IdeaCards from "@/components/IdeaCards";
import BakeOverlay from "@/components/BakeOverlay";
import RecipeCard from "@/components/RecipeCard";

type Phase = "idle" | "thinking" | "baking" | "sparkle";

export default function Home() {
  const [selected, setSelected] = useState<SpriteName[]>([]);
  const [custom, setCustom] = useState<string[]>([]);
  const [vibe, setVibe] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [error, setError] = useState<string | null>(null);
  const [ideas, setIdeas] = useState<{ list: Idea[]; source: "ai" | "demo" } | null>(null);
  const [result, setResult] = useState<{ recipe: Recipe; source: "ai" | "demo" } | null>(
    null
  );
  const [showCard, setShowCard] = useState(false);

  const ideasRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ideas) ideasRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [ideas]);

  useEffect(() => {
    if (showCard) resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [showCard]);

  function toggle(key: SpriteName) {
    setSelected((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  }

  function bowlContents(): string {
    const labels = PANTRY.filter((p) => selected.includes(p.key)).map((p) => p.label);
    return [...labels, ...custom].join(", ");
  }

  // Stage one: the AI pitches three bakes for this bowl.
  async function getIdeas() {
    const ingredients = bowlContents();
    if (!ingredients || phase !== "idle") return;

    setPhase("thinking");
    setError(null);
    setIdeas(null);
    setShowCard(false);
    setResult(null);

    try {
      const res = await fetch("/api/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients, vibe: vibe.trim() || undefined }),
      });
      const data = (await res.json()) as SuggestResponse & { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
      setIdeas({ list: data.ideas, source: data.source });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setPhase("idle");
    }
  }

  // Stage two: bake the chosen idea, with the full cinematic.
  async function bake(idea: Idea) {
    if (phase !== "idle") return;

    setPhase("baking");
    setError(null);
    setShowCard(false);

    const request = fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ingredients: bowlContents(),
        vibe: vibe.trim() || undefined,
        chosen: idea.title,
      }),
    });

    // Let the bowl whisk for at least a couple of seconds, even in demo mode.
    const minShow = new Promise((r) => setTimeout(r, 2600));

    try {
      const [res] = await Promise.all([request, minShow]);
      const data = (await res.json()) as GenerateResponse & { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");

      setResult({ recipe: data.recipe, source: data.source });
      setPhase("sparkle");
      setTimeout(() => {
        setPhase("idle");
        setShowCard(true);
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setPhase("idle");
    }
  }

  const bowlCount = selected.length + custom.length;

  return (
    <main className="relative">
      <CursorSparkles />
      <FloatingPixels />

      {/* the cinematic bake: background gone, big bowl, whisk, sparkles */}
      <AnimatePresence>
        {(phase === "baking" || phase === "sparkle") && (
          <BakeOverlay
            phase={phase}
            sprites={selected.length > 0 ? selected : ["flour", "sugar", "egg"]}
          />
        )}
      </AnimatePresence>

      {/* nav: logo pill left, links pill right */}
      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 80, damping: 14, delay: 0.2 }}
        className="fixed inset-x-4 top-4 z-40 flex items-center justify-between sm:inset-x-6 sm:top-5"
      >
        <a href="#" className="glass-pill flex items-center gap-2 px-4 py-2.5">
          <PixelSprite name="whisk" size={18} />
          <span className="font-pixel text-[9px] text-plum">whisk</span>
        </a>
        <div className="glass-pill flex items-center gap-5 px-5 py-2.5">
          <a
            href="#studio"
            className="font-pixel text-[8px] text-plum/60 transition-colors hover:text-rose"
          >
            studio
          </a>
          <a
            href="https://github.com/c0smo-55/whisk"
            target="_blank"
            rel="noreferrer"
            className="font-pixel text-[8px] text-plum/60 transition-colors hover:text-rose"
          >
            github
          </a>
        </div>
      </motion.nav>

      {/* ---- hero landing ---- */}
      <HeroLanding />

      {/* ---- apple-style feature story ---- */}
      <FeatureCards />

      {/* ---- the studio ---- */}
      <motion.section
        id="studio"
        className="relative z-10 mx-auto max-w-3xl scroll-mt-24 px-4 pb-16"
        initial={{ opacity: 0, y: 80, scale: 0.94 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ type: "spring", stiffness: 70, damping: 18 }}
      >
        <div className="glass-strong p-6 sm:p-10">
          <h2 className="mb-2 text-center font-pixel text-sm text-plum">the pantry shelf</h2>
          <p className="mb-8 text-center text-sm font-semibold text-plum/60">
            tap ingredients into the bowl
          </p>

          <Pantry
            selected={selected}
            custom={custom}
            onToggle={toggle}
            onAddCustom={(item) => setCustom((prev) => (prev.includes(item) ? prev : [...prev, item]))}
            onRemoveCustom={(item) => setCustom((prev) => prev.filter((c) => c !== item))}
          />

          <div className="mt-8 flex flex-col gap-4">
            <input
              value={vibe}
              onChange={(e) => setVibe(e.target.value)}
              placeholder="the vibe (optional): cosy rainy afternoon, birthday…"
              className="glass w-full px-5 py-3.5 text-sm font-bold text-plum outline-none placeholder:text-plum/35 focus:border-petal/70"
            />

            <motion.button
              type="button"
              onClick={getIdeas}
              disabled={phase !== "idle" || bowlCount === 0}
              whileTap={bowlCount > 0 ? { scale: 0.96 } : {}}
              className={`pixel-btn flex items-center justify-center gap-3 px-6 py-4 font-pixel text-xs text-white ${
                bowlCount === 0 || phase !== "idle"
                  ? "cursor-not-allowed bg-plum/30"
                  : "bg-gradient-to-r from-rose via-lavender to-periwinkle"
              }`}
            >
              <motion.span
                animate={phase === "thinking" ? { rotate: [-20, 20, -20] } : {}}
                transition={{ duration: 0.4, repeat: Infinity }}
              >
                <PixelSprite name="whisk" size={22} />
              </motion.span>
              {phase === "thinking" ? "dreaming up bakes…" : "whisk up ideas!"}
            </motion.button>
          </div>
        </div>
      </motion.section>

      {/* ---- stage one: the pitches ---- */}
      <section ref={ideasRef} className="relative z-10 mx-auto max-w-5xl scroll-mt-8 px-4 pb-16">
        {error && (
          <div className="glass mb-6 border-rose/40 p-6 text-center">
            <p className="font-pixel text-[10px] text-rose">{error}</p>
          </div>
        )}
        {ideas && (
          <IdeaCards
            ideas={ideas.list}
            source={ideas.source}
            onPick={bake}
            disabled={phase !== "idle"}
          />
        )}
      </section>

      {/* ---- stage two: the bake ---- */}
      <section ref={resultRef} className="relative z-10 mx-auto max-w-3xl scroll-mt-8 px-4 pb-24">
        {showCard && result && <RecipeCard recipe={result.recipe} source={result.source} />}
      </section>

      {/* ---- signature ---- */}
      <footer className="relative z-10 flex flex-col items-center gap-3 pb-12">
        <div className="glass-pill flex items-center gap-2.5 px-5 py-2.5">
          <span className="font-pixel text-[9px] text-plum/80">made with</span>
          <motion.span
            animate={{ scale: [1, 1.25, 1] }}
            transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
          >
            <PixelSprite name="heart" size={16} />
          </motion.span>
          <span className="font-pixel text-[9px] text-plum/80">by hannah how</span>
        </div>
        <p className="font-pixel text-[8px] text-plum/40">
          © 2026 hannah how · next.js + claude
        </p>
      </footer>
    </main>
  );
}
