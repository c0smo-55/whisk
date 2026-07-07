"use client";

import { motion } from "framer-motion";
import type { Idea } from "@/lib/types";
import PixelSprite from "./PixelSprite";

// Stage one of the agent pipeline, rendered: the AI's three pitches.
// Picking one kicks off the cinematic bake.
export default function IdeaCards({
  ideas,
  source,
  onPick,
  disabled,
}: {
  ideas: Idea[];
  source: "ai" | "demo";
  onPick: (idea: Idea) => void;
  disabled: boolean;
}) {
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex flex-col items-center gap-2 text-center"
      >
        <h2 className="font-pixel text-sm text-plum">the ai pitches three bakes</h2>
        <p className="text-sm font-semibold text-plum/60">
          {source === "demo"
            ? "demo ideas — add an api key for live ones"
            : "designed around your bowl — pick your favourite"}
        </p>
      </motion.div>

      <div className="grid gap-5 md:grid-cols-3">
        {ideas.map((idea, i) => (
          <motion.div
            key={idea.title}
            initial={{ opacity: 0, y: 50, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 90, damping: 15, delay: i * 0.12 }}
            whileHover={{ y: -8 }}
            className="glass flex flex-col items-center gap-4 p-6 text-center"
          >
            <motion.span
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2.6 + i * 0.4, repeat: Infinity, ease: "easeInOut" }}
            >
              <PixelSprite name={idea.sprite} size={56} />
            </motion.span>
            <h3 className="font-pixel text-[10px] leading-relaxed text-plum">
              {idea.title}
            </h3>
            <p className="flex-1 text-sm font-semibold leading-relaxed text-plum/65">
              {idea.hook}
            </p>
            <motion.button
              type="button"
              disabled={disabled}
              onClick={() => onPick(idea)}
              whileTap={{ scale: 0.94 }}
              className="pixel-btn w-full bg-gradient-to-r from-rose to-lavender px-4 py-3 font-pixel text-[9px] text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              bake this
            </motion.button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
