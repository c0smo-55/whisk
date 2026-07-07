"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import PixelSprite from "./PixelSprite";
import type { SpriteName } from "@/lib/sprites";

// Sprites drifting behind the glass. Each has a depth: deeper ones are
// smaller, fainter, and parallax more slowly against the scroll.
const FLOATERS: {
  name: SpriteName;
  left: string;
  top: string;
  size: number;
  depth: number;
  duration: number;
  delay: number;
}[] = [
  { name: "heart", left: "6%", top: "12%", size: 34, depth: 0.35, duration: 7, delay: 0 },
  { name: "star", left: "88%", top: "8%", size: 38, depth: 0.5, duration: 9, delay: 1.2 },
  { name: "sparkle", left: "16%", top: "58%", size: 26, depth: 0.25, duration: 6, delay: 0.6 },
  { name: "cloud", left: "72%", top: "26%", size: 64, depth: 0.2, duration: 11, delay: 0.3 },
  { name: "strawberry", left: "82%", top: "64%", size: 40, depth: 0.45, duration: 8, delay: 1.8 },
  { name: "cupcake", left: "8%", top: "82%", size: 44, depth: 0.55, duration: 10, delay: 0.9 },
  { name: "sparkle", left: "60%", top: "78%", size: 22, depth: 0.3, duration: 7, delay: 2.2 },
  { name: "cloud", left: "30%", top: "30%", size: 48, depth: 0.15, duration: 13, delay: 1.5 },
  { name: "star", left: "44%", top: "88%", size: 28, depth: 0.4, duration: 8, delay: 0.2 },
  { name: "heart", left: "93%", top: "42%", size: 24, depth: 0.3, duration: 6, delay: 1 },
];

function Floater({ f }: { f: (typeof FLOATERS)[number] }) {
  const { scrollY } = useScroll();
  // Parallax: deeper sprites trail the scroll more.
  const y = useTransform(scrollY, (v) => v * -f.depth * 0.3);

  return (
    <motion.div
      className="absolute"
      style={{ left: f.left, top: f.top, y, opacity: 0.35 + f.depth * 0.5 }}
    >
      <motion.div
        animate={{ y: [0, -14, 0], rotate: [0, f.depth > 0.35 ? 6 : -6, 0] }}
        transition={{
          duration: f.duration,
          delay: f.delay,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <PixelSprite name={f.name} size={f.size} />
      </motion.div>
    </motion.div>
  );
}

export default function FloatingPixels() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {FLOATERS.map((f, i) => (
        <Floater key={i} f={f} />
      ))}
    </div>
  );
}
