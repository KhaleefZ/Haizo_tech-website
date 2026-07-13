"use client";

import { motion, useScroll, useTransform } from "framer-motion";

export default function BackgroundOrbs() {
  const { scrollY } = useScroll();
  
  // Parallax effects
  const y1 = useTransform(scrollY, [0, 1000], [0, 300]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -250]);
  const y3 = useTransform(scrollY, [0, 1000], [0, 150]);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      {/* Top Left Orb */}
      <motion.div 
        style={{ y: y1 }}
        className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] rounded-full bg-blue-600/20 blur-[120px] mix-blend-screen animate-blob" 
      />
      
      {/* Top Right Orb */}
      <motion.div 
        style={{ y: y2, animationDelay: "2s" }}
        className="absolute top-[10%] right-[-10%] w-[35rem] h-[35rem] rounded-full bg-purple-600/20 blur-[120px] mix-blend-screen animate-blob" 
      />
      
      {/* Bottom Left Orb */}
      <motion.div 
        style={{ y: y3, animationDelay: "4s" }}
        className="absolute bottom-[-10%] left-[20%] w-[45rem] h-[45rem] rounded-full bg-indigo-600/20 blur-[120px] mix-blend-screen animate-blob" 
      />
    </div>
  );
}
