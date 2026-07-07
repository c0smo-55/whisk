"use client";

import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { Recipe } from "@/lib/types";
import { matchSprite } from "@/lib/sprites";
import PixelSprite from "./PixelSprite";
import SprinkleBurst from "./SprinkleBurst";

const DIFFICULTY_HEARTS: Record<Recipe["difficulty"], number> = {
  easy: 1,
  medium: 2,
  advanced: 3,
};

function DifficultyGauge({ level }: { level: Recipe["difficulty"] }) {
  const filled = DIFFICULTY_HEARTS[level];
  return (
    <div className="flex items-center gap-2">
      <span className="font-pixel text-[9px] uppercase text-plum/60">lvl</span>
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <span key={i} className={i < filled ? "" : "opacity-20 grayscale"}>
            <PixelSprite name="heart" size={20} />
          </span>
        ))}
      </div>
      <span className="font-pixel text-[9px] text-rose">{level}</span>
    </div>
  );
}

export default function RecipeCard({
  recipe,
  source,
}: {
  recipe: Recipe;
  source: "claude" | "demo";
}) {
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const cardRef = useRef<HTMLDivElement>(null);

  // Tilt: track the pointer across the card, springs keep it buttery.
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(my, [0, 1], [4, -4]), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useTransform(mx, [0, 1], [-5, 5]), { stiffness: 150, damping: 20 });

  function onMouseMove(e: React.MouseEvent) {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width);
    my.set((e.clientY - rect.top) / rect.height);
  }

  function toggleStep(i: number) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }

  return (
    <div className="relative" style={{ perspective: 1200 }}>
      <SprinkleBurst />
      <motion.article
        ref={cardRef}
        onMouseMove={onMouseMove}
        onMouseLeave={() => {
          mx.set(0.5);
          my.set(0.5);
        }}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        initial={{ opacity: 0, y: 60, scale: 0.92 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 90, damping: 16 }}
        className="pixel-panel relative mx-auto max-w-2xl p-6 sm:p-10"
      >
        {source === "demo" && (
          <span className="absolute right-4 top-4 border-2 border-plum bg-butter px-2 py-1 font-pixel text-[8px]">
            demo bake
          </span>
        )}

        <header className="flex flex-col items-center gap-4 text-center">
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <PixelSprite name={recipe.sprite} size={88} />
          </motion.div>
          <h2 className="font-pixel text-sm leading-relaxed text-plum sm:text-base">
            {recipe.title}
          </h2>
          <p className="max-w-md text-[15px] font-semibold text-plum/75">
            {recipe.description}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <DifficultyGauge level={recipe.difficulty} />
            <span className="font-pixel text-[9px] text-plum/70">
              {recipe.totalMinutes} min
            </span>
            <span className="font-pixel text-[9px] text-plum/70">{recipe.servings}</span>
          </div>
        </header>

        <hr className="my-6 border-t-[3px] border-dashed border-plum/20" />

        {/* ingredients, each with its matched pixel sprite */}
        <section>
          <h3 className="mb-4 font-pixel text-[10px] uppercase text-rose">Pantry pulls</h3>
          <ul className="grid gap-2 sm:grid-cols-2">
            {recipe.ingredients.map((ing, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.06 }}
                className="flex items-center gap-3 border-2 border-plum/15 bg-white/50 px-3 py-2"
              >
                <PixelSprite name={matchSprite(ing.item)} size={26} />
                <span className="flex-1 text-sm font-bold text-plum">{ing.item}</span>
                <span className="text-sm font-semibold text-plum/60">{ing.amount}</span>
              </motion.li>
            ))}
          </ul>
        </section>

        {/* tappable step checklist */}
        <section className="mt-8">
          <h3 className="mb-4 font-pixel text-[10px] uppercase text-rose">
            The bake — tap as you go
          </h3>
          <ol className="space-y-3">
            {recipe.steps.map((step, i) => {
              const done = checked.has(i);
              return (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 + i * 0.08 }}
                >
                  <button
                    type="button"
                    onClick={() => toggleStep(i)}
                    className={`flex w-full items-start gap-3 border-2 px-3 py-2.5 text-left transition-colors ${
                      done
                        ? "border-lavender/60 bg-lavender/15"
                        : "border-plum/15 bg-white/50 hover:border-petal/60"
                    }`}
                  >
                    <span
                      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border-2 border-plum font-pixel text-[10px] ${
                        done ? "bg-petal text-white" : "bg-white"
                      }`}
                    >
                      {done ? "x" : ""}
                    </span>
                    <span
                      className={`text-sm font-semibold leading-relaxed ${
                        done ? "text-plum/40 line-through" : "text-plum/85"
                      }`}
                    >
                      <span className="font-pixel text-[9px] text-lavender">{i + 1} </span>
                      {step}
                    </span>
                  </button>
                </motion.li>
              );
            })}
          </ol>
        </section>

        {/* substitutions */}
        {recipe.substitutions.length > 0 && (
          <section className="mt-8">
            <h3 className="mb-4 font-pixel text-[10px] uppercase text-rose">Out of it? Swap it</h3>
            <div className="grid gap-2 sm:grid-cols-2">
              {recipe.substitutions.map((sub, i) => (
                <div key={i} className="border-2 border-plum/15 bg-white/50 px-3 py-2 text-sm">
                  <span className="font-bold text-plum">{sub.missing}</span>
                  <span className="mx-2 font-pixel text-[9px] text-periwinkle">&gt;&gt;</span>
                  <span className="font-semibold text-plum/70">{sub.use}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* coffee pairing — the barista's corner */}
        <section className="mt-8 border-[3px] border-plum bg-sky/60 p-4">
          <h3 className="mb-2 font-pixel text-[10px] uppercase text-plum">
            Barista&apos;s pairing
          </h3>
          <p className="text-sm font-bold text-plum">{recipe.coffeePairing.drink}</p>
          <p className="mt-1 text-sm font-semibold text-plum/70">{recipe.coffeePairing.why}</p>
        </section>

        {/* baker's tip */}
        <section className="mt-4 border-[3px] border-plum bg-butter/50 p-4">
          <h3 className="mb-2 font-pixel text-[10px] uppercase text-plum">Make-or-break tip</h3>
          <p className="text-sm font-semibold text-plum/80">{recipe.bakerTip}</p>
        </section>
      </motion.article>
    </div>
  );
}
