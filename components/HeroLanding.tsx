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

// The hero showcase: desserts float through centre stage one by one,
// Apple-keynote style. Hovering (or tapping) pauses the parade and unfolds
// that bake's details — all pulled from real recipe data.
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
    const id = setInterval(() => setIndex((i) => (i + 1) % DEMO_RECIPES.length), 3600);
    return () => clearInterval(id);
  }, [hovered]);

  return (
    <motion.div
      style={{ rotateX: tiltY, rotateY: tiltX, transformStyle: "preserve-3d" }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onTap={() => setHovered((h) => !h)}
      className="glass-strong flex min-h-[21rem] w-72 cursor-pointer flex-col items-center justify-between p-6 sm:w-80"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={item.title}
          initial={{ x: 90, opacity: 0, scale: 0.6, rotate: 8 }}
          animate={{ x: 0, opacity: 1, scale: 1, rotate: 0 }}
          exit={{ x: -90, opacity: 0, scale: 0.6, rotate: -8 }}
          transition={{ type: "spring", stiffness: 130, damping: 17 }}
          className="flex w-full flex-1 flex-col items-center gap-3"
        >
          <motion.span
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <PixelSprite name={item.sprite} size={hovered ? 64 : 92} />
          </motion.span>
          <span className="text-center font-pixel text-[9px] leading-relaxed text-plum">
            {item.title.toLowerCase()}
          </span>

          {hovered ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex w-full flex-col gap-2.5"
            >
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
              <p className="line-clamp-3 text-center text-xs font-semibold leading-relaxed text-plum/65">
                {item.description}
              </p>
              <div className="flex items-center gap-2 rounded-xl bg-sky/50 px-3 py-2">
                <PixelSprite name="milk" size={16} />
                <span className="line-clamp-2 text-[11px] font-bold leading-snug text-plum/70">
                  pairs with {item.coffeePairing.drink.toLowerCase()}
                </span>
              </div>
            </motion.div>
          ) : (
            <div className="flex w-full flex-col items-center gap-3">
              <div className="w-full space-y-1.5">
                <div className="h-2 w-full rounded-full bg-petal/40" />
                <div className="mx-auto h-2 w-4/5 rounded-full bg-lavender/40" />
                <div className="mx-auto h-2 w-3/5 rounded-full bg-periwinkle/40" />
              </div>
              <span className="font-pixel text-[8px] text-plum/40">
                hover for details
              </span>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* progress dots */}
      <div className="mt-4 flex gap-2">
        {DEMO_RECIPES.map((r, i) => (
          <span
            key={r.title}
            className={`h-2 w-2 transition-colors ${
              i === index ? "bg-rose" : "bg-plum/15"
            }`}
          />
        ))}
      </div>
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
      className="relative z-10 flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 pb-24 pt-28"
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

        {/* right: floating glass product shot */}
        <motion.div style={layerMid} className="relative">
          <span className="absolute -left-8 -top-8 z-10">
            <motion.span
              className="block"
              animate={{ y: [0, -8, 0], rotate: [0, 8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <PixelSprite name="cupcake" size={52} />
            </motion.span>
          </span>
          <span className="absolute -bottom-6 -right-6 z-10">
            <motion.span
              className="block"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
            >
              <PixelSprite name="heart" size={36} />
            </motion.span>
          </span>
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
