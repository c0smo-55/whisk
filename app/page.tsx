"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import type { GenerateResponse, Recipe } from "@/lib/types";
import { PANTRY, type SpriteName } from "@/lib/sprites";
import PixelSprite from "@/components/PixelSprite";
import FloatingPixels from "@/components/FloatingPixels";
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

  // Apple-style hero: it scales down and dissolves as you scroll into the studio.
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.82]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 120]);

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
      <FloatingPixels />

      {/* ---- hero ---- */}
      <section ref={heroRef} className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4">
        <motion.div
          style={{ scale: heroScale, opacity: heroOpacity, y: heroY }}
          className="flex flex-col items-center gap-8 text-center"
        >
          <motion.div
            animate={{ rotate: [-6, 6, -6] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          >
            <PixelSprite name="whisk" size={96} />
          </motion.div>

          <h1 className="font-pixel text-3xl leading-tight text-plum sm:text-5xl">
            <span className="text-rose">W</span>
            <span className="text-lavender">H</span>
            <span className="text-periwinkle">I</span>
            <span className="text-rose">S</span>
            <span className="text-lavender">K</span>
          </h1>

          <p className="max-w-md text-lg font-bold text-plum/70">
            Tap what&apos;s in your kitchen. An AI pastry brain designs the bake —
            coffee pairing included.
          </p>

          <motion.a
            href="#studio"
            className="pixel-btn bg-petal px-6 py-3 font-pixel text-[11px] text-white"
            whileHover={{ y: -2 }}
          >
            open the studio
          </motion.a>
        </motion.div>

        <motion.div
          className="absolute bottom-10"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="font-pixel text-[10px] text-plum/40">▼ scroll</span>
        </motion.div>
      </section>

      {/* ---- the studio ---- */}
      <motion.section
        id="studio"
        className="relative z-10 mx-auto max-w-3xl px-4 pb-24"
        initial={{ opacity: 0, y: 80, scale: 0.94 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ type: "spring", stiffness: 70, damping: 18 }}
      >
        <div className="pixel-panel p-6 sm:p-10">
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
              className="pixel-btn w-full bg-white/80 px-4 py-3 text-sm font-bold text-plum outline-none placeholder:text-plum/35"
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
          <div className="pixel-panel">
            <BakingLoader tick={tick} />
          </div>
        )}

        {error && (
          <div className="pixel-panel border-rose bg-blush p-6 text-center">
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
