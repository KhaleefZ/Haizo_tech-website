"use client";

import { ReactNode, useRef, useState } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { motion } from "framer-motion";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export default function GlassCard({ children, className, hoverEffect = true }: GlassCardProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current || isFocused) return;

    const div = divRef.current;
    const rect = div.getBoundingClientRect();

    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleFocus = () => {
    setIsFocused(true);
    setOpacity(1);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setOpacity(0);
  };

  const handleMouseEnter = () => {
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <motion.div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "glass-panel p-6 relative overflow-hidden group border border-white/10 transition-all duration-500",
        hoverEffect && "hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] hover:border-blue-500/30 hover:bg-white/10 hover:-translate-y-1",
        className
      )}
    >
      {/* Background Spotlight Effect overlay */}
      {hoverEffect && (
        <div
          className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 z-0"
          style={{
            opacity,
            background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(59, 130, 246, 0.15), transparent 40%)`,
          }}
        />
      )}

      {/* Border Spotlight Glow Effect */}
      {hoverEffect && (
        <div
          className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 z-0 rounded-[inherit]"
          style={{
            opacity,
            background: `radial-gradient(150px circle at ${position.x}px ${position.y}px, rgba(59, 130, 246, 0.6), transparent 70%)`,
            mask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
            maskComposite: "exclude",
            WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
            WebkitMaskComposite: "xor",
            padding: "1.5px"
          }}
        />
      )}
      
      {/* Content wrapper */}
      <div className="relative z-10 h-full w-full">{children}</div>
    </motion.div>
  );
}
