"use client";

import { motion } from "framer-motion";
import type { SpriteName } from "@/lib/sprites";
import PixelSprite from "./PixelSprite";
import SprinkleBurst from "./SprinkleBurst";

export type BakePhase = "baking" | "sparkle";

// The cinematic bake: everything else fades away, a big bowl holds the
// chosen ingredients, the whisk stirs, then sparkles announce the recipe.
export default function BakeOverlay({
  phase,
  sprites,
}: {
  phase: BakePhase;
  sprites: SpriteName[];
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
      className="fixed inset-0 z-[60] flex flex-col items-center justify-center"
      style={{
        background:
          "linear-gradient(160deg, #ffe3f0 0%, #e8daff 55%, #d6e9ff 100%)",
      }}
    >
      {phase === "baking" && (
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 90, damping: 14 }}
          className="flex flex-col items-center"
        >
          {/* the whisk, stirring in circles above the bowl */}
          <motion.div
            className="relative z-10 -mb-10"
            animate={{
              x: [-30, 30, -30],
              y: [0, 10, 0],
              rotate: [-18, 18, -18],
            }}
            transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <PixelSprite name="whisk" size={100} />
          </motion.div>

          {/* the big bowl */}
          <motion.div
            className="relative flex h-56 w-[22rem] items-end justify-center sm:w-96"
            animate={{ rotate: [-1.5, 1.5, -1.5] }}
            transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="absolute bottom-0 h-40 w-full rounded-b-[160px] border-4 border-plum bg-gradient-to-b from-blush to-petal/80 shadow-[10px_10px_0_0_rgba(75,48,89,0.25)]" />
            <div className="absolute bottom-[152px] h-5 w-full rounded-sm border-4 border-plum bg-cream" />

            {/* batter surface */}
            <motion.div
              className="absolute bottom-16 h-10 w-4/5 rounded-[50%] bg-cream/80"
              animate={{ scaleX: [1, 1.06, 1], scaleY: [1, 0.9, 1] }}
              transition={{ duration: 0.4, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* the chosen ingredients, tossed around by the whisk */}
            <div className="absolute bottom-14 flex w-3/5 flex-wrap items-center justify-center gap-2">
              {sprites.map((name, i) => (
                <motion.span
                  key={`${name}-${i}`}
                  animate={{
                    y: [0, -14 - (i % 3) * 6, 0],
                    rotate: [0, i % 2 === 0 ? 20 : -20, 0],
                  }}
                  transition={{
                    duration: 0.7,
                    repeat: Infinity,
                    delay: i * 0.09,
                    ease: "easeInOut",
                  }}
                >
                  <PixelSprite name={name} size={34} />
                </motion.span>
              ))}
            </div>

            {/* little splashes */}
            {[0, 1, 2, 3].map((i) => (
              <motion.span
                key={i}
                className="absolute bottom-40 block h-2.5 w-2.5 bg-petal"
                style={{ left: `${22 + i * 18}%` }}
                animate={{ y: [0, -34 - (i % 2) * 14, 0], opacity: [0, 1, 0] }}
                transition={{
                  duration: 0.9,
                  repeat: Infinity,
                  delay: i * 0.22,
                  ease: "easeOut",
                }}
              />
            ))}
          </motion.div>

          <motion.p
            className="mt-10 font-pixel text-[11px] text-plum/70"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.4, repeat: Infinity }}
          >
            whisking your bake…
          </motion.p>
        </motion.div>
      )}

      {phase === "sparkle" && (
        <div className="relative flex flex-col items-center">
          <SprinkleBurst count={44} />
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 12 }}
          >
            <PixelSprite name="star" size={90} />
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mt-6 font-pixel text-sm text-plum"
          >
            ta-da!
          </motion.p>
        </div>
      )}
    </motion.div>
  );
}
