"use client";

import { MotionConfig } from "framer-motion";
import { ReactNode } from "react";

export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <MotionConfig
      reducedMotion="user"
      transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.65 }}
    >
      {children}
    </MotionConfig>
  );
}
