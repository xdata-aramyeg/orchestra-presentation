"use client";

import { type ReactNode } from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";

const EASE_EDITORIAL = [0.32, 0.72, 0, 1] as const;

type RevealProps = {
  children: ReactNode;
  /** stagger offset in seconds when several Reveals sit in a list */
  delay?: number;
  className?: string;
  /** render as a list item, paragraph, etc. — defaults to a div */
  as?: "div" | "li" | "section" | "article" | "header" | "p";
};

/**
 * Scroll-entry primitive: a gentle, heavy fade-up with a slight blur that
 * settles via a custom editorial easing curve. Transform + opacity + filter
 * only. Honors prefers-reduced-motion by rendering the final state immediately.
 */
export function Reveal({
  children,
  delay = 0,
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
    hidden: { opacity: 0, y: 28, filter: "blur(6px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.8, ease: EASE_EDITORIAL, delay },
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
