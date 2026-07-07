"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { PANTRY } from "@/lib/sprites";
import PixelSprite from "./PixelSprite";

// A floating glass "product shot": a miniature recipe card that bobs and
// counter-tilts against the cursor, Apple-keynote style.
function GlassPreviewCard({
  tiltX,
  tiltY,
}: {
  tiltX: MotionValue<number>;
  tiltY: MotionValue<number>;
}) {
  return (
    <motion.div
      style={{ rotateX: tiltY, rotateY: tiltX, transformStyle: "preserve-3d" }}
      className="glass-strong w-64 p-5 sm:w-72"
    >
      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
        className="flex flex-col items-center gap-3"
      >
        <PixelSprite name="cake" size={64} />
        <span className="font-pixel text-[9px] text-plum">matcha cloud cake</span>
        <div className="flex gap-1.5">
          {[0, 1].map((i) => (
            <PixelSprite key={i} name="heart" size={14} />
          ))}
          <span className="opacity-20 grayscale">
            <PixelSprite name="heart" size={14} />
          </span>
        </div>
        <div className="w-full space-y-1.5">
          <div className="h-2 w-full rounded-full bg-petal/40" />
          <div className="h-2 w-4/5 rounded-full bg-lavender/40" />
          <div className="h-2 w-3/5 rounded-full bg-periwinkle/40" />
        </div>
        <div className="mt-1 flex w-full items-center gap-2 rounded-xl bg-sky/50 px-3 py-2">
          <PixelSprite name="milk" size={18} />
          <span className="text-[11px] font-bold text-plum/70">
            pairs with an iced shakerato
          </span>
        </div>
      </motion.div>
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
          <GlassPreviewCard tiltX={cardTiltX} tiltY={cardTiltY} />
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
