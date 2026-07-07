"use client";

import { motion } from "framer-motion";
import PixelSprite from "./PixelSprite";

const MESSAGES = [
  "sifting the pixels…",
  "creaming the butter…",
  "consulting the barista…",
  "folding in the clouds…",
];

// Whisking animation + a chunky pixel progress bar while Claude bakes.
export default function BakingLoader({ tick }: { tick: number }) {
  return (
    <div className="flex flex-col items-center gap-5 py-10">
      <motion.div
        animate={{ rotate: [-14, 14, -14], y: [0, 3, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <PixelSprite name="whisk" size={64} />
      </motion.div>

      <div className="pixel-panel flex h-6 w-56 items-center gap-1 !border-2 !shadow-none p-1">
        {Array.from({ length: 12 }, (_, i) => (
          <motion.span
            key={i}
            className="h-full flex-1 bg-petal"
            initial={{ opacity: 0.15 }}
            animate={{ opacity: [0.15, 1, 0.15] }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: i * 0.1,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <p className="font-pixel text-[10px] text-plum/70">
        {MESSAGES[tick % MESSAGES.length]}
      </p>
    </div>
  );
}
