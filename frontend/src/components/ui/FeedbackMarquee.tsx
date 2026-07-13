"use client";

import { motion } from "framer-motion";
import GlassCard from "./GlassCard";

const testimonials = [
  { name: "Nivethitha", role: "Owner @Sri ASK Residency", quote: "Haizo Tech delivered a modern platform that scaled from day one. Their team is responsive, thoughtful, and deeply technical." },
  { name: "Sarah Chen", role: "Product Lead @ FinEdge", quote: "The AI integrations they built completely transformed our internal operations. Outstanding engineering talent." },
  { name: "Michael Chang", role: "Founder @ NovaHealth", quote: "Our telemedicine app is fast, secure, and beautiful. HaizoTech managed the complexity with ease." },
];

export default function FeedbackMarquee() {
  // Duplicate array for seamless looping
  const marqueeItems = [...testimonials, ...testimonials];

  return (
    <div className="relative w-full overflow-hidden py-4 group">
      {/* Gradient Masks */}
      <div className="absolute inset-y-0 left-0 w-12 md:w-32 bg-gradient-to-r from-[#030712] to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-12 md:w-32 bg-gradient-to-l from-[#030712] to-transparent z-10 pointer-events-none" />

      <motion.div
        animate={{ x: [0, "-50%"] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="flex w-max gap-6"
      >
        {marqueeItems.map((testimonial, i) => (
          <div key={i} className="w-[85vw] md:w-[400px] shrink-0">
            <GlassCard className="h-full flex flex-col justify-between p-8 hover:-translate-y-2 transition-transform cursor-pointer">
              <p className="text-lg italic text-gray-300 mb-8">"{testimonial.quote}"</p>
              <div className="flex items-center gap-4 border-t border-white/10 pt-4 mt-auto">
                <div className="w-10 h-10 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold shrink-0">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-white">{testimonial.name}</h4>
                  <p className="text-sm text-blue-400">{testimonial.role}</p>
                </div>
              </div>
            </GlassCard>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
