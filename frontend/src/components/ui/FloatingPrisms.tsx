"use client";

import { motion } from "framer-motion";

const Prism = ({ size, color, duration, delay, position, floatOffset = 30 }: { size: number, color: string, duration: number, delay: number, position: string, floatOffset?: number }) => {
  return (
    <motion.div
      animate={{ 
        y: [-floatOffset, floatOffset, -floatOffset],
        rotateX: [0, 360], 
        rotateY: [0, 360] 
      }}
      transition={{ 
        y: { duration: duration * 0.8, repeat: Infinity, ease: "easeInOut", delay },
        rotateX: { duration, repeat: Infinity, ease: "linear" },
        rotateY: { duration: duration * 1.2, repeat: Infinity, ease: "linear" }
      }}
      className={`absolute ${position}`}
      style={{ width: size, height: size, transformStyle: "preserve-3d" }}
    >
      {/* Front */}
      <div className={`absolute inset-0 border border-white/30 backdrop-blur-md shadow-[inset_0_0_20px_rgba(255,255,255,0.2)] rounded-2xl ${color}`} style={{ transform: `translateZ(${size/2}px)` }} />
      {/* Back */}
      <div className={`absolute inset-0 border border-white/30 backdrop-blur-md shadow-[inset_0_0_20px_rgba(255,255,255,0.2)] rounded-2xl ${color}`} style={{ transform: `rotateY(180deg) translateZ(${size/2}px)` }} />
      {/* Right */}
      <div className={`absolute inset-0 border border-white/30 backdrop-blur-md shadow-[inset_0_0_20px_rgba(255,255,255,0.2)] rounded-2xl ${color}`} style={{ transform: `rotateY(90deg) translateZ(${size/2}px)` }} />
      {/* Left */}
      <div className={`absolute inset-0 border border-white/30 backdrop-blur-md shadow-[inset_0_0_20px_rgba(255,255,255,0.2)] rounded-2xl ${color}`} style={{ transform: `rotateY(-90deg) translateZ(${size/2}px)` }} />
      {/* Top */}
      <div className={`absolute inset-0 border border-white/30 backdrop-blur-md shadow-[inset_0_0_20px_rgba(255,255,255,0.2)] rounded-2xl ${color}`} style={{ transform: `rotateX(90deg) translateZ(${size/2}px)` }} />
      {/* Bottom */}
      <div className={`absolute inset-0 border border-white/30 backdrop-blur-md shadow-[inset_0_0_20px_rgba(255,255,255,0.2)] rounded-2xl ${color}`} style={{ transform: `rotateX(-90deg) translateZ(${size/2}px)` }} />
    </motion.div>
  );
};

export default function FloatingPrisms() {
  return (
    <div className="relative w-full h-[500px] flex items-center justify-center [perspective:1000px]">
      {/* Center Large Prism */}
      <Prism 
        size={140} 
        color="bg-blue-500/20 bg-gradient-to-br from-blue-400/20 to-transparent" 
        duration={25} 
        delay={0} 
        position="z-20"
        floatOffset={20}
      />
      
      {/* Top Right Medium Prism */}
      <Prism 
        size={80} 
        color="bg-purple-500/20 bg-gradient-to-br from-purple-400/20 to-transparent" 
        duration={15} 
        delay={1} 
        position="top-[15%] right-[15%] z-10"
        floatOffset={40}
      />

      {/* Bottom Left Small Prism */}
      <Prism 
        size={60} 
        color="bg-emerald-500/20 bg-gradient-to-br from-emerald-400/20 to-transparent" 
        duration={18} 
        delay={2} 
        position="bottom-[15%] left-[20%] z-30"
        floatOffset={35}
      />

      {/* Top Left Tiny Prism */}
      <Prism 
        size={40} 
        color="bg-indigo-500/20 bg-gradient-to-br from-indigo-400/20 to-transparent" 
        duration={12} 
        delay={3} 
        position="top-[25%] left-[10%] z-30"
        floatOffset={25}
      />
      
      {/* Glow effect behind to make glass stand out */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-blue-600/10 blur-[100px] rounded-full pointer-events-none" />
    </div>
  );
}
