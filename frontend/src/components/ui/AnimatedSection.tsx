"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

type AnimationVariant = "fadeUp" | "fadeIn" | "scaleUp" | "slideRight" | "slideLeft";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: AnimationVariant;
}

export default function AnimatedSection({ 
  children, 
  className = "", 
  delay = 0,
  variant = "fadeUp"
}: AnimatedSectionProps) {
  
  const variants = {
    fadeUp: {
      initial: { opacity: 0, y: 40 },
      animate: { opacity: 1, y: 0 }
    },
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 }
    },
    scaleUp: {
      initial: { opacity: 0, scale: 0.9, y: 20 },
      animate: { opacity: 1, scale: 1, y: 0 }
    },
    slideRight: {
      initial: { opacity: 0, x: -50 },
      animate: { opacity: 1, x: 0 }
    },
    slideLeft: {
      initial: { opacity: 0, x: 50 },
      animate: { opacity: 1, x: 0 }
    }
  };

  return (
    <motion.div
      initial={variants[variant].initial}
      whileInView={variants[variant].animate}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        duration: 0.8, 
        delay, 
        ease: [0.21, 0.47, 0.32, 0.98] // Custom spring-like easing for a more premium feel
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
