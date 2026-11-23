"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

export const MECHANICAL_EASE: [number, number, number, number] = [
  0.22, 1, 0.36, 1,
];

/**
 * Fixed 2px Electric Lime-Yellow (#DDF247) top scroll progress bar
 */
export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 32,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX, transformOrigin: "0% 50%" }}
      className="fixed inset-x-0 top-0 z-50 h-[2px] bg-accent"
    />
  );
}

/**
 * Viewport-triggered mechanical slide + opacity reveal
 */
export function RevealOnScroll({
  children,
  delay = 0,
  y = 24,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.65, delay, ease: MECHANICAL_EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Architectural shutter / reveal that observes an unclipped outer wrapper
 * so IntersectionObserver always triggers reliably.
 */
export function ClipReveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div
        initial={{ y: 28, opacity: 0 }}
        animate={isInView ? { y: 0, opacity: 1 } : { y: 28, opacity: 0 }}
        transition={{ duration: 0.68, delay, ease: MECHANICAL_EASE }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/**
 * Scroll-triggered horizontal hairline divider draw
 */
export function AnimatedHairline({
  delay = 0,
  className = "",
}: {
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.85, delay, ease: MECHANICAL_EASE }}
      style={{ transformOrigin: "0% 50%" }}
      className={`h-[1px] w-full bg-border ${className}`}
    />
  );
}

/**
 * Smooth vertical parallax container for showroom imagery
 */
export function ParallaxImageFrame({
  children,
  offset = 24,
  className = "",
}: {
  children: ReactNode;
  offset?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [-offset, offset]);

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div style={{ y }} className="h-full w-full">
        {children}
      </motion.div>
    </div>
  );
}

/**
 * Tabular-nums odometer counter triggered when entering viewport
 */
export function AnimatedCounter({
  target,
  suffix = "",
  prefix = "",
  decimals = 0,
}: {
  target: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let startTimestamp: number | null = null;
    const durationMs = 1100;

    function step(timestamp: number) {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      const progress = Math.min(elapsed / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3.5);
      setValue(target * eased);
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setValue(target);
      }
    }

    requestAnimationFrame(step);
  }, [isInView, target]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {decimals > 0
        ? value.toFixed(decimals)
        : Math.round(value).toLocaleString("en-PK")}
      {suffix}
    </span>
  );
}

/**
 * Dark-Theme Interactive SVG Motion Graphic for the 4-Step Import Process
 */
export function ImportStageGraphic({ step }: { step: string }) {
  if (step === "01") {
    return (
      <div className="relative h-28 w-full overflow-hidden rounded-[4px] border border-border bg-canvas p-3">
        <svg viewBox="0 0 280 90" className="h-full w-full" fill="none">
          <line x1="0" y1="22" x2="280" y2="22" stroke="#1E222A" strokeWidth="1" />
          <line x1="0" y1="45" x2="280" y2="45" stroke="#1E222A" strokeWidth="1" />
          <line x1="0" y1="68" x2="280" y2="68" stroke="#1E222A" strokeWidth="1" />
          <line x1="90" y1="0" x2="90" y2="90" stroke="#1E222A" strokeWidth="1" />
          <line x1="190" y1="0" x2="190" y2="90" stroke="#1E222A" strokeWidth="1" />

          <motion.rect
            x="30"
            y="18"
            width="120"
            height="54"
            rx="4"
            stroke="#F5F6F8"
            strokeWidth="1.5"
            fill="#131519"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, ease: MECHANICAL_EASE }}
          />
          <rect
            x="55"
            y="26"
            width="70"
            height="38"
            rx="2"
            stroke="#9499A3"
            strokeWidth="1"
          />
          <motion.circle
            cx="45"
            cy="32"
            r="3.5"
            fill="#DDF247"
            animate={{ opacity: [0.3, 1, 0.3], scale: [0.9, 1.25, 0.9] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          />
          <text
            x="54"
            y="36"
            fontFamily="monospace"
            fontSize="9"
            fontWeight="bold"
            fill="#DDF247"
          >
            A1
          </text>

          <rect
            x="175"
            y="20"
            width="86"
            height="50"
            rx="3"
            fill="#131519"
            stroke="#DDF247"
            strokeWidth="1.25"
          />
          <text
            x="185"
            y="38"
            fontFamily="monospace"
            fontSize="9"
            fill="#9499A3"
          >
            USS TOKYO
          </text>
          <text
            x="185"
            y="56"
            fontFamily="monospace"
            fontSize="13"
            fontWeight="bold"
            fill="#DDF247"
          >
            GRADE 4.5
          </text>
        </svg>
        <motion.div
          animate={{ x: ["-10%", "110%", "-10%"] }}
          transition={{ duration: 4.2, repeat: Infinity, ease: "linear" }}
          className="pointer-events-none absolute inset-y-0 left-0 w-[2px] bg-accent/70"
        />
      </div>
    );
  }

  if (step === "02") {
    return (
      <div className="relative h-28 w-full overflow-hidden rounded-[4px] border border-border bg-canvas p-3">
        <svg viewBox="0 0 280 90" className="h-full w-full" fill="none">
          <line
            x1="20"
            y1="58"
            x2="260"
            y2="58"
            stroke="#242830"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          <motion.path
            d="M 24 58 Q 140 20 256 58"
            stroke="#DDF247"
            strokeWidth="1.75"
            fill="none"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.3, ease: MECHANICAL_EASE }}
          />
          <circle cx="24" cy="58" r="4" fill="#F5F6F8" />
          <circle cx="256" cy="58" r="4" fill="#DDF247" />
          <text x="16" y="76" fontFamily="monospace" fontSize="9" fill="#9499A3">
            YOKOHAMA
          </text>
          <text x="215" y="76" fontFamily="monospace" fontSize="9" fill="#F5F6F8">
            KARACHI
          </text>

          <motion.g
            animate={{ x: [0, 180, 0] }}
            transition={{
              duration: 5.5,
              repeat: Infinity,
              ease: MECHANICAL_EASE,
            }}
          >
            <rect
              x="36"
              y="28"
              width="40"
              height="16"
              rx="2"
              fill="#DDF247"
            />
            <text
              x="42"
              y="39"
              fontFamily="monospace"
              fontSize="8"
              fontWeight="bold"
              fill="#0B0C0E"
            >
              RO-RO
            </text>
          </motion.g>
        </svg>
      </div>
    );
  }

  if (step === "03") {
    return (
      <div className="relative h-28 w-full overflow-hidden rounded-[4px] border border-border bg-canvas p-3">
        <svg viewBox="0 0 280 90" className="h-full w-full" fill="none">
          <rect
            x="16"
            y="14"
            width="248"
            height="62"
            rx="3"
            fill="#131519"
            stroke="#242830"
            strokeWidth="1.5"
          />
          <text
            x="28"
            y="32"
            fontFamily="monospace"
            fontSize="9"
            fontWeight="bold"
            fill="#F5F6F8"
          >
            CUSTOMS &amp; GD CLEARANCE
          </text>
          <motion.rect
            x="28"
            y="42"
            height="6"
            rx="1"
            fill="#9499A3"
            initial={{ width: 20 }}
            whileInView={{ width: 175 }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, ease: MECHANICAL_EASE }}
          />
          <motion.rect
            x="28"
            y="56"
            height="6"
            rx="1"
            fill="#DDF247"
            initial={{ width: 20 }}
            whileInView={{ width: 220 }}
            viewport={{ once: true }}
            transition={{ duration: 1.3, delay: 0.15, ease: MECHANICAL_EASE }}
          />
          <text
            x="212"
            y="32"
            fontFamily="monospace"
            fontSize="9"
            fontWeight="bold"
            fill="#DDF247"
          >
            VERIFIED
          </text>
        </svg>
      </div>
    );
  }

  return (
    <div className="relative h-28 w-full overflow-hidden rounded-[4px] border border-border bg-canvas p-3">
      <svg viewBox="0 0 280 90" className="h-full w-full" fill="none">
        <rect
          x="16"
          y="14"
          width="248"
          height="62"
          rx="3"
          fill="#131519"
          stroke="#DDF247"
          strokeWidth="1.25"
        />
        <motion.circle
          cx="46"
          cy="45"
          r="14"
          stroke="#DDF247"
          strokeWidth="1.75"
          animate={{ scale: [1, 1.12, 1], opacity: [1, 0.7, 1] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
        <circle cx="46" cy="45" r="5" fill="#DDF247" />
        <text
          x="74"
          y="41"
          fontFamily="monospace"
          fontSize="10"
          fontWeight="bold"
          fill="#F5F6F8"
        >
          DHA PHASE 8 • LAHORE
        </text>
        <text
          x="74"
          y="56"
          fontFamily="monospace"
          fontSize="9"
          fill="#DDF247"
        >
          READY FOR HANDOVER
        </text>
      </svg>
    </div>
  );
}
