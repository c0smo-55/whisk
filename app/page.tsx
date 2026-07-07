"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { GenerateResponse, Recipe } from "@/lib/types";
import { PANTRY, type SpriteName } from "@/lib/sprites";
import PixelSprite from "@/components/PixelSprite";
import FloatingPixels from "@/components/FloatingPixels";
import CursorSparkles from "@/components/CursorSparkles";
import HeroLanding from "@/components/HeroLanding";
import FeatureCards from "@/components/FeatureCards";
import Pantry from "@/components/Pantry";
import BakingLoader from "@/components/BakingLoader";
import RecipeCard from "@/components/RecipeCard";

export default function Home() {
  const [selected, setSelected] = useState<SpriteName[]>([]);
  const [custom, setCustom] = useState<string[]>([]);
  const [vibe, setVibe] = useState("");
  const [loading, setLoading] = useState(false);
  const [tick, setTick] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ recipe: Recipe; source: "claude" | "demo" } | null>(
    null
  );

  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading) return;
    const id = setInterval(() => setTick((t) => t + 1), 1600);
    return () => clearInterval(id);
  }, [loading]);

  useEffect(() => {
    if (result || loading) {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [result, loading]);

  function toggle(key: SpriteName) {
    setSelected((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  }

  async function whiskIt() {
    const labels = PANTRY.filter((p) => selected.includes(p.key)).map((p) => p.label);
    const ingredients = [...labels, ...custom].join(", ");
    if (!ingredients) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients, vibe: vibe.trim() || undefined }),
      });
      const data = (await res.json()) as GenerateResponse & { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
      setResult({ recipe: data.recipe, source: data.source });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  const bowlCount = selected.length + custom.length;

  return (
    <main className="relative">
      <CursorSparkles />
      <FloatingPixels />

      {/* floating glass nav pill */}
      <motion.nav
        initial={{ x: "-50%", y: -60, opacity: 0 }}
        animate={{ x: "-50%", y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 80, damping: 14, delay: 0.2 }}
        className="fixed left-1/2 top-5 z-40"
      >
        <div className="glass-pill flex items-center gap-5 px-5 py-2.5">
          <span className="flex items-center gap-2">
            <PixelSprite name="whisk" size={18} />
            <span className="font-pixel text-[9px] text-plum">whisk</span>
          </span>
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
        className="relative z-10 mx-auto max-w-3xl scroll-mt-24 px-4 pb-24"
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
              onClick={whiskIt}
              disabled={loading || bowlCount === 0}
              whileTap={bowlCount > 0 ? { scale: 0.96 } : {}}
              className={`pixel-btn flex items-center justify-center gap-3 px-6 py-4 font-pixel text-xs text-white ${
                bowlCount === 0 || loading
                  ? "cursor-not-allowed bg-plum/30"
                  : "bg-gradient-to-r from-rose via-lavender to-periwinkle"
              }`}
            >
              <motion.span
                animate={loading ? { rotate: [-20, 20, -20] } : {}}
                transition={{ duration: 0.4, repeat: Infinity }}
              >
                <PixelSprite name="whisk" size={22} />
              </motion.span>
              {loading ? "whisking…" : "whisk it!"}
            </motion.button>
          </div>
        </div>
      </motion.section>

      {/* ---- the bake ---- */}
      <section ref={resultRef} className="relative z-10 mx-auto max-w-3xl scroll-mt-8 px-4 pb-32">
        {loading && (
          <div className="glass-strong">
            <BakingLoader tick={tick} />
          </div>
        )}

        {error && (
          <div className="glass border-rose/40 p-6 text-center">
            <p className="font-pixel text-[10px] text-rose">{error}</p>
          </div>
        )}

        {result && <RecipeCard recipe={result.recipe} source={result.source} />}
      </section>

      <footer className="relative z-10 pb-10 text-center">
        <p className="font-pixel text-[8px] text-plum/40">
          whisk · baked with next.js + claude
        </p>
      </footer>
    </main>
  );
}
