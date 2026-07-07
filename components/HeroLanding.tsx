"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { PANTRY } from "@/lib/sprites";
import { DEMO_RECIPES } from "@/lib/mock";
import PixelSprite from "./PixelSprite";

const HEARTS: Record<string, number> = { easy: 1, medium: 2, advanced: 3 };

// Twinkles orbiting the showcased dessert, each on its own beat.
const TWINKLES: {
  sprite: "sparkle" | "star";
  size: number;
  left: string;
  top: string;
  delay: number;
  duration: number;
}[] = [
  { sprite: "sparkle", size: 24, left: "-12%", top: "6%", delay: 0, duration: 1.9 },
  { sprite: "star", size: 28, left: "86%", top: "-6%", delay: 0.5, duration: 2.3 },
  { sprite: "sparkle", size: 16, left: "104%", top: "52%", delay: 1.1, duration: 1.7 },
  { sprite: "star", size: 18, left: "-10%", top: "68%", delay: 1.5, duration: 2.1 },
  { sprite: "sparkle", size: 28, left: "44%", top: "-16%", delay: 0.8, duration: 2.0 },
  { sprite: "sparkle", size: 14, left: "64%", top: "102%", delay: 0.3, duration: 1.6 },
];

// The hero showcase: no card, no label — just the 8-bit dessert itself,
// glowing and sparkling, one after another. Hover (or tap) pauses the
// parade and floats the name + details in underneath.
function DessertShowcase({
  tiltX,
  tiltY,
}: {
  tiltX: MotionValue<number>;
  tiltY: MotionValue<number>;
}) {
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const item = DEMO_RECIPES[index];

  useEffect(() => {
    if (hovered) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % DEMO_RECIPES.length), 3200);
    return () => clearInterval(id);
  }, [hovered]);

  return (
    <motion.div
      style={{ rotateX: tiltY, rotateY: tiltX, transformStyle: "preserve-3d" }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onTap={() => setHovered((h) => !h)}
      className="relative flex cursor-pointer flex-col items-center"
    >
      {/* outer glow: a breathing pastel halo */}
      <motion.div
        aria-hidden
        className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(255,158,199,0.7) 0%, rgba(183,156,237,0.45) 45%, rgba(143,184,255,0.25) 62%, transparent 72%)",
          filter: "blur(30px)",
        }}
        animate={{ scale: [1, 1.22, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* inner glow: a bright core right behind the dessert */}
      <motion.div
        aria-hidden
        className="absolute left-1/2 top-[38%] h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(255,214,232,0.6) 50%, transparent 70%)",
          filter: "blur(18px)",
        }}
        animate={{ scale: [1.15, 0.95, 1.15], opacity: [0.9, 0.6, 0.9] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* centre stage: dessert on a glass cake stand, cutlery at the ready */}
      <div className="relative flex h-72 w-80 items-center justify-center">
        {/* orbiting twinkles */}
        {TWINKLES.map((t, i) => (
          <motion.span
            key={i}
            aria-hidden
            className="absolute"
            style={{ left: t.left, top: t.top }}
            animate={{ opacity: [0, 1, 0], scale: [0.3, 1.1, 0.3], rotate: [0, 45, 90] }}
            transition={{
              duration: t.duration,
              delay: t.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <PixelSprite name={t.sprite} size={t.size} />
          </motion.span>
        ))}

        {/* fork & knife, floating on either side of the stand */}
        <motion.span
          aria-hidden
          className="absolute -left-2 top-[30%]"
          style={{ filter: "drop-shadow(0 0 10px rgba(255,255,255,0.95))" }}
          animate={{ y: [0, -7, 0], rotate: [-6, 2, -6] }}
          transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
        >
          <PixelSprite name="fork" size={52} />
        </motion.span>
        <motion.span
          aria-hidden
          className="absolute -right-2 top-[30%]"
          style={{ filter: "drop-shadow(0 0 10px rgba(255,255,255,0.95))" }}
          animate={{ y: [0, 7, 0], rotate: [6, -2, 6] }}
          transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <PixelSprite name="knife" size={52} />
        </motion.span>

        {/* the glass cake stand */}
        <div
          aria-hidden
          className="absolute bottom-3 left-1/2 flex -translate-x-1/2 flex-col items-center"
        >
          <div className="h-7 w-56 rounded-[50%] border border-white/70 bg-gradient-to-b from-white/75 to-white/35 shadow-[0_14px_30px_-12px_rgba(75,48,89,0.45)] backdrop-blur-md" />
          <div className="-mt-1 h-8 w-3 border-x border-white/60 bg-white/45 backdrop-blur-sm" />
          <div className="h-2.5 w-24 rounded-[50%] border border-white/70 bg-white/55 backdrop-blur-sm" />
        </div>

        {/* the dessert, hovering just above its plate */}
        <AnimatePresence mode="wait">
          <motion.div
            key={item.title}
            className="absolute bottom-16"
            initial={{ scale: 0, rotate: -18, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0, rotate: 18, opacity: 0 }}
            transition={{ type: "spring", stiffness: 160, damping: 15 }}
          >
            <motion.div
              animate={{ y: [0, -12, 0], rotate: [-2, 2, -2] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
            >
              <PixelSprite name={item.sprite} size={hovered ? 128 : 148} />
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* details float in only on hover */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            key="details"
            initial={{ opacity: 0, y: 16, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.94 }}
            transition={{ type: "spring", stiffness: 170, damping: 18 }}
            className="glass absolute top-full z-20 -mt-2 flex w-72 flex-col items-center gap-2.5 p-4"
          >
            <span className="text-center font-pixel text-[9px] leading-relaxed text-plum">
              {item.title.toLowerCase()}
            </span>
            <div className="flex items-center justify-center gap-4">
              <span className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className={i < HEARTS[item.difficulty] ? "" : "opacity-20 grayscale"}
                  >
                    <PixelSprite name="heart" size={13} />
                  </span>
                ))}
              </span>
              <span className="font-pixel text-[8px] text-plum/70">
                {item.totalMinutes} min
              </span>
              <span className="font-pixel text-[8px] text-plum/70">{item.servings}</span>
            </div>
            <p className="line-clamp-2 text-center text-xs font-semibold leading-relaxed text-plum/65">
              {item.description}
            </p>
            <div className="flex items-center gap-2 rounded-xl bg-sky/50 px-3 py-1.5">
              <PixelSprite name="milk" size={15} />
              <span className="line-clamp-1 text-[11px] font-bold text-plum/70">
                pairs with {item.coffeePairing.drink.toLowerCase()}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function HeroLanding() {
  const heroRef = useRef<HTMLDivElement>(null);

  // Cursor parallax: normalized -0.5..0.5, springs for that liquid Apple feel.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18 });
  const sy = useSpring(my, { stiffness: 60, damping: 18 });

  useEffect(() => {
    function onMove(e: MouseEvent) {
      mx.set(e.clientX / window.innerWidth - 0.5);
      my.set(e.clientY / window.innerHeight - 0.5);
    }
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mx, my]);

  // Parallax layers at different depths.
  const layerBack = {
    x: useTransform(sx, (v) => v * -18),
    y: useTransform(sy, (v) => v * -12),
  };
  const layerMid = {
    x: useTransform(sx, (v) => v * 30),
    y: useTransform(sy, (v) => v * 20),
  };
  const cardTiltX = useTransform(sx, [-0.5, 0.5], [-10, 10]);
  const cardTiltY = useTransform(sy, [-0.5, 0.5], [8, -8]);

  // Apple-style exit: the whole hero scales down and dissolves on scroll.
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.86]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 100]);

  return (
    <section
      ref={heroRef}
      className="relative z-10 flex min-h-screen flex-col items-center justify-center overflow-x-clip px-4 pb-24 pt-28"
    >
      {/* depth layer: big soft sprites drifting behind the glass */}
      <motion.div style={layerBack} className="pointer-events-none absolute inset-0">
        <span className="absolute left-[8%] top-[18%] opacity-50">
          <PixelSprite name="cloud" size={90} />
        </span>
        <span className="absolute right-[10%] top-[12%] opacity-60">
          <PixelSprite name="star" size={44} />
        </span>
        <span className="absolute bottom-[24%] left-[14%] opacity-60">
          <PixelSprite name="strawberry" size={48} />
        </span>
        <span className="absolute bottom-[30%] right-[8%] opacity-50">
          <PixelSprite name="cloud" size={70} />
        </span>
      </motion.div>

      <motion.div
        style={{ scale: heroScale, opacity: heroOpacity, y: heroY }}
        className="flex w-full max-w-5xl flex-col items-center gap-12 lg:flex-row lg:justify-between"
      >
        {/* left: the pitch */}
        <div className="flex max-w-xl flex-col items-center gap-7 text-center lg:items-start lg:text-left">
          <div className="glass-pill flex items-center gap-2 px-4 py-2">
            <PixelSprite name="sparkle" size={16} />
            <span className="font-pixel text-[8px] text-plum/80">
              ai pastry brain inside
            </span>
          </div>

          <h1 className="font-pixel text-4xl leading-tight text-plum sm:text-6xl">
            <span className="text-rose">W</span>
            <span className="text-lavender">H</span>
            <span className="text-periwinkle">I</span>
            <span className="text-rose">S</span>
            <span className="text-lavender">K</span>
          </h1>

          <p className="text-xl font-bold leading-relaxed text-plum/75 sm:text-2xl">
            Your kitchen, but make it pixel.
            <br />
            <span className="text-lg text-plum/55 sm:text-xl">
              Tap your pantry — get a designed recipe card, coffee pairing included.
            </span>
          </p>

          <motion.a
            href="#studio"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="pixel-btn inline-flex items-center gap-3 bg-gradient-to-r from-rose via-lavender to-periwinkle px-7 py-4 font-pixel text-[11px] text-white"
          >
            <PixelSprite name="whisk" size={20} />
            open the studio
          </motion.a>
        </div>

        {/* right: the glowing dessert showcase */}
        <motion.div style={layerMid} className="relative">
          <DessertShowcase tiltX={cardTiltX} tiltY={cardTiltY} />
        </motion.div>
      </motion.div>

      {/* sprite marquee along the bottom of the hero */}
      <div className="absolute bottom-0 left-0 right-0">
        <div className="glass !rounded-none border-x-0 border-b-0 py-3">
          <div className="marquee gap-10 pr-10">
            {[0, 1].map((copy) => (
              <div key={copy} className="flex items-center gap-10" aria-hidden={copy === 1}>
                {PANTRY.map(({ key, label }) => (
                  <span key={`${copy}-${key}`} className="flex items-center gap-2">
                    <PixelSprite name={key} size={26} />
                    <span className="font-pixel text-[8px] text-plum/50">{label}</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
