"use client";

import { motion } from "framer-motion";
import PixelSprite from "./PixelSprite";
import type { SpriteName } from "@/lib/sprites";

const FEATURES: {
  sprite: SpriteName;
  title: string;
  body: string;
  accent: string;
}[] = [
  {
    sprite: "strawberry",
    title: "tap the pantry",
    body: "Every ingredient is its own hand-drawn 8-bit sprite. Tap them into the mixing bowl — no typing needed.",
    accent: "from-blush to-petal/30",
  },
  {
    sprite: "whisk",
    title: "whisk it",
    body: "An AI pastry brain designs one achievable bake around exactly what you have, with smart substitutions.",
    accent: "from-sky to-periwinkle/30",
  },
  {
    sprite: "cake",
    title: "bake the card",
    body: "A designed recipe card — tappable steps, difficulty hearts, and a barista-grade coffee pairing.",
    accent: "from-cream to-lavender/30",
  },
];

// Three glass cards that rise and settle in sequence as they scroll into view.
export default function FeatureCards() {
  return (
    <section className="relative z-10 mx-auto max-w-5xl px-4 py-24">
      <motion.h2
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ type: "spring", stiffness: 70, damping: 16 }}
        className="mb-14 text-center font-pixel text-base leading-relaxed text-plum sm:text-xl"
      >
        three taps to a bake
      </motion.h2>

      <div className="grid gap-6 md:grid-cols-3">
        {FEATURES.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 70, scale: 0.92 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{
              type: "spring",
              stiffness: 80,
              damping: 16,
              delay: i * 0.12,
            }}
            whileHover={{ y: -10, scale: 1.02 }}
            className={`glass flex flex-col items-center gap-4 bg-gradient-to-b p-8 text-center ${f.accent}`}
          >
            <motion.span
              whileHover={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.4 }}
            >
              <PixelSprite name={f.sprite} size={56} />
            </motion.span>
            <h3 className="font-pixel text-[11px] text-plum">{f.title}</h3>
            <p className="text-[15px] font-semibold leading-relaxed text-plum/65">
              {f.body}
            </p>
            <span className="font-pixel text-[9px] text-lavender">0{i + 1}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
