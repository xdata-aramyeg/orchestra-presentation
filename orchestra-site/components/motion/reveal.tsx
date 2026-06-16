"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";

type RevealProps = {
  children: React.ReactNode;
  /** stagger offset in seconds for sequenced reveals */
  delay?: number;
  /** translate distance in px before settling */
  y?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article";
};

/**
 * Scroll-triggered reveal. Fades + lifts content into place once when it
 * enters the viewport. Honors prefers-reduced-motion by rendering statically.
 */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
  as = "div",
}: RevealProps) {
  const reduceMotion = useReducedMotion();
  const MotionTag = motion[as];

  if (reduceMotion) {
    const StaticTag = as;
    return <StaticTag className={className}>{children}</StaticTag>;
  }

  const variants: Variants = {
    hidden: { opacity: 0, y },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1], delay },
    },
  };

  return (
    <MotionTag
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
    >
      {children}
    </MotionTag>
  );
}
