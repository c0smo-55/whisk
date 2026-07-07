"use client";

import { motion } from "framer-motion";

const COLORS = ["#FF9EC7", "#B79CED", "#8FB8FF", "#FFD68A", "#FFFDF8"];

// A one-shot confetti of pixel squares, fired when a recipe card lands.
// Deterministic trajectories (index-based) keep SSR/CSR markup identical.
export default function SprinkleBurst({ count = 26 }: { count?: number }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-visible" aria-hidden>
      {Array.from({ length: count }, (_, i) => {
        const angle = (i / count) * Math.PI * 2;
        const dist = 90 + (i % 5) * 38;
        const x = Math.cos(angle) * dist;
        const y = Math.sin(angle) * dist - 40;
        const size = 6 + (i % 3) * 4;
        return (
          <motion.span
            key={i}
            className="absolute left-1/2 top-1/3 block"
            style={{
              width: size,
              height: size,
              backgroundColor: COLORS[i % COLORS.length],
            }}
            initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 1 }}
            animate={{ x, y, opacity: 0, rotate: 180 + (i % 4) * 90, scale: 0.4 }}
            transition={{ duration: 0.9 + (i % 4) * 0.15, ease: "easeOut" }}
          />
        );
      })}
    </div>
  );
}
