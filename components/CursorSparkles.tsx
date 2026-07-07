"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const COLORS = ["#FF9EC7", "#B79CED", "#8FB8FF", "#FFD68A"];

interface Spark {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
}

// Tiny pixel squares that trail the cursor and pop away. Throttled so fast
// mouse moves don't flood the DOM.
export default function CursorSparkles() {
  const [sparks, setSparks] = useState<Spark[]>([]);
  const lastSpawn = useRef(0);
  const nextId = useRef(0);

  useEffect(() => {
    function onMove(e: MouseEvent) {
      const now = performance.now();
      if (now - lastSpawn.current < 70) return;
      lastSpawn.current = now;

      const id = nextId.current++;
      const spark: Spark = {
        id,
        x: e.clientX,
        y: e.clientY,
        color: COLORS[id % COLORS.length],
        size: 5 + (id % 3) * 3,
      };
      setSparks((prev) => [...prev.slice(-14), spark]);
      setTimeout(() => {
        setSparks((prev) => prev.filter((s) => s.id !== id));
      }, 650);
    }

    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-50" aria-hidden>
      {sparks.map((s) => (
        <motion.span
          key={s.id}
          className="absolute block"
          style={{
            left: s.x,
            top: s.y,
            width: s.size,
            height: s.size,
            backgroundColor: s.color,
          }}
          initial={{ opacity: 0.9, scale: 1, rotate: 0 }}
          animate={{
            opacity: 0,
            scale: 0.3,
            rotate: 90,
            y: 14 + (s.id % 4) * 6,
            x: (s.id % 2 === 0 ? 1 : -1) * (6 + (s.id % 3) * 4),
          }}
          transition={{ duration: 0.65, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}
