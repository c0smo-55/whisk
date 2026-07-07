"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PANTRY, type SpriteName } from "@/lib/sprites";
import PixelSprite from "./PixelSprite";

export interface PantryProps {
  selected: SpriteName[];
  custom: string[];
  onToggle: (key: SpriteName) => void;
  onAddCustom: (item: string) => void;
  onRemoveCustom: (item: string) => void;
}

// The tappable shelf: each ingredient is its own 8-bit sprite. Tapping pops
// it into the mixing bowl below.
export default function Pantry({
  selected,
  custom,
  onToggle,
  onAddCustom,
  onRemoveCustom,
}: PantryProps) {
  const [draft, setDraft] = useState("");

  function submitCustom() {
    const item = draft.trim();
    if (!item) return;
    onAddCustom(item);
    setDraft("");
  }

  return (
    <div className="flex flex-col gap-8">
      {/* the shelf */}
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
        {PANTRY.map(({ key, label }) => {
          const active = selected.includes(key);
          return (
            <motion.button
              key={key}
              type="button"
              onClick={() => onToggle(key)}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.9 }}
              className={`pixel-btn flex flex-col items-center gap-2 px-2 py-3 ${
                active ? "bg-petal/70" : "bg-white/70 hover:bg-blush"
              }`}
              aria-pressed={active}
            >
              <motion.span animate={active ? { rotate: [0, -8, 8, 0] } : {}}>
                <PixelSprite name={key} size={40} />
              </motion.span>
              <span
                className={`font-pixel text-[8px] ${active ? "text-white" : "text-plum/80"}`}
              >
                {label}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* anything the shelf doesn't have */}
      <div className="flex flex-col gap-3">
        <div className="flex gap-2">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submitCustom()}
            placeholder="something else? condensed milk, oats…"
            className="pixel-btn flex-1 bg-white/80 px-4 py-3 text-sm font-bold text-plum outline-none placeholder:text-plum/35"
          />
          <button
            type="button"
            onClick={submitCustom}
            className="pixel-btn bg-lavender px-4 font-pixel text-[10px] text-white"
          >
            add
          </button>
        </div>
        {custom.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {custom.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => onRemoveCustom(item)}
                className="border-2 border-plum bg-white/80 px-3 py-1 text-xs font-bold text-plum hover:bg-blush"
                title="remove"
              >
                {item} ✕
              </button>
            ))}
          </div>
        )}
      </div>

      {/* the mixing bowl */}
      <div className="flex flex-col items-center gap-2">
        <div className="relative flex h-32 w-64 items-end justify-center">
          <div className="absolute bottom-0 h-24 w-64 rounded-b-[70px] border-[3px] border-plum bg-gradient-to-b from-blush to-petal/70 shadow-pixel" />
          <div className="absolute bottom-[84px] h-3 w-64 border-[3px] border-plum bg-cream" />
          <div className="absolute bottom-8 flex w-48 flex-wrap items-center justify-center gap-1">
            <AnimatePresence>
              {selected.map((key) => (
                <motion.span
                  key={key}
                  initial={{ y: -70, opacity: 0, rotate: -20 }}
                  animate={{ y: 0, opacity: 1, rotate: 0 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 250, damping: 15 }}
                >
                  <PixelSprite name={key} size={26} />
                </motion.span>
              ))}
              {custom.map((item) => (
                <motion.span
                  key={item}
                  initial={{ y: -70, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 250, damping: 15 }}
                >
                  <PixelSprite name="sparkle" size={20} />
                </motion.span>
              ))}
            </AnimatePresence>
          </div>
        </div>
        <p className="font-pixel text-[9px] text-plum/50">
          {selected.length + custom.length === 0
            ? "the bowl is empty — tap the shelf!"
            : `${selected.length + custom.length} in the bowl`}
        </p>
      </div>
    </div>
  );
}
