"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useTransform, animate, useInView } from "framer-motion";

export default function CountUp({ 
  to, 
  duration = 2, 
  delay = 0,
  suffix = "",
  decimals = 0
}: { 
  to: number; 
  duration?: number;
  delay?: number;
  suffix?: string;
  decimals?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => 
    latest.toFixed(decimals) + suffix
  );
  
  useEffect(() => {
    if (isInView) {
      const controls = animate(count, to, {
        duration: duration,
        delay: delay,
        ease: [0.22, 1, 0.36, 1]
      });
      return controls.stop;
    }
  }, [count, to, duration, delay, isInView]);

  return <motion.span ref={ref}>{rounded}</motion.span>;
}
