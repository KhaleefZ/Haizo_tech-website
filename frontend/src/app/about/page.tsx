"use client";

import AnimatedSection from "@/components/ui/AnimatedSection";
import GlassCard from "@/components/ui/GlassCard";
import CountUp from "@/components/ui/CountUp";
import { Code2, Database, Shield, Globe2, Target, Lightbulb, Handshake } from "lucide-react";
import { motion } from "framer-motion";
import Logo from "@/components/ui/Logo";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-6 py-12">
      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex items-center justify-center mb-24">
        <div className="absolute inset-0 bg-blue-600/10 blur-[120px] rounded-full max-w-4xl mx-auto top-1/2 -translate-y-1/2 pointer-events-none" />
        
        <AnimatedSection className="text-center max-w-4xl relative z-10">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-8 leading-tight">
            An obsessively technical <span className="text-gradient">engineering studio.</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 leading-relaxed font-light">
            We don't do marketing wrappers. We don't do WordPress themes. We write real code, build real databases, and ship production software that businesses run on.
          </p>
        </AnimatedSection>
      </section>

      {/* Our Origin */}
      <section className="mb-32 max-w-5xl mx-auto">
        <AnimatedSection>
          <GlassCard className="p-10 md:p-16 border-t-2 border-blue-500/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[80px] rounded-full pointer-events-none" />
            <h2 className="text-3xl font-bold text-white mb-6">Our Origin</h2>
            <div className="space-y-6 text-gray-300 text-lg leading-relaxed relative z-10">
              <p>
                HaizoTech was founded in Coimbatore, India, out of frustration with the "generic agency" model. We saw growing businesses being sold bloated, off-the-shelf SaaS solutions that forced them to change their operations, or hiring agencies that delivered fragile, unmaintainable code.
              </p>
              <p>
                We decided to build a different kind of technical partner. A studio small enough to care deeply about the codebase, but capable enough to architect enterprise-grade infrastructure. We serve clients across India and the Middle East who demand reliability over hype.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 pt-12 border-t border-white/10 relative z-10">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-400 mb-2">
                  <CountUp to={100} suffix="%" />
                </div>
                <div className="text-sm text-gray-400 uppercase tracking-wider font-semibold">Code Ownership for Clients</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">
                  <CountUp to={0} delay={0.2} />
                </div>
                <div className="text-sm text-gray-400 uppercase tracking-wider font-semibold">Offshored / Outsourced Work</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">24/7</div>
                <div className="text-sm text-gray-400 uppercase tracking-wider font-semibold">Infrastructure Support</div>
              </div>
              <div className="text-center flex flex-col items-center justify-center">
                <Globe2 className="text-blue-400 mb-2" size={36} />
                <div className="text-sm text-gray-400 uppercase tracking-wider font-semibold">HQ Coimbatore, India</div>
              </div>
            </div>
          </GlassCard>
        </AnimatedSection>
      </section>

      {/* Mission & Vision */}
      <section className="mb-32 max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          <AnimatedSection delay={0.1} variant="slideRight" className="h-full">
            <GlassCard className="h-full p-10 border-t-2 border-blue-500/50 hover:shadow-[0_0_40px_rgba(59,130,246,0.2)] transition-all duration-500 group relative overflow-hidden">
              {/* Animated Background Mesh */}
              <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full group-hover:bg-blue-500/20 transition-colors duration-700" />
              
              <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20 mb-8 relative">
                {/* Continuous Ripple Animation */}
                <motion.div
                  className="absolute inset-0 rounded-2xl border border-blue-400"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Target className="text-blue-400 relative z-10" size={28} />
                </motion.div>
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">Our Mission</h2>
              <p className="text-gray-300 text-lg leading-relaxed relative z-10">
                To engineer robust, bespoke software systems that eliminate operational bottlenecks, empowering businesses to scale without the constraints of generic SaaS.
              </p>
            </GlassCard>
          </AnimatedSection>
          
          <AnimatedSection delay={0.2} variant="slideLeft" className="h-full">
            <GlassCard className="h-full p-10 border-t-2 border-purple-500/50 hover:shadow-[0_0_40px_rgba(168,85,247,0.2)] transition-all duration-500 group relative overflow-hidden">
              {/* Animated Background Mesh */}
              <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-purple-500/10 blur-[80px] rounded-full group-hover:bg-purple-500/20 transition-colors duration-700" />

              <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center border border-purple-500/20 mb-8 relative">
                {/* Continuous Glowing Aura Animation */}
                <motion.div
                  className="absolute inset-0 bg-purple-400/30 blur-md rounded-full"
                  animate={{ opacity: [0.3, 0.8, 0.3], scale: [0.8, 1.2, 0.8] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Lightbulb className="text-purple-400 relative z-10" size={28} />
                </motion.div>
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">Our Vision</h2>
              <p className="text-gray-300 text-lg leading-relaxed relative z-10">
                To serve as the absolute technical backbone for ambitious enterprises, proving that uncompromising engineering quality is the true driver of sustainable growth.
              </p>
            </GlassCard>
          </AnimatedSection>
        </div>
      </section>

      {/* Core Values */}
      <section className="mb-12 max-w-6xl mx-auto px-6 relative py-12 overflow-hidden">
        <AnimatedSection className="mb-12 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Core Values</h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            The principles that govern how we write code and deal with clients.
          </p>
        </AnimatedSection>

        <div className="relative w-full max-w-5xl mx-auto py-8">
          
          {/* Central SVG Logo Graphic */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 z-0 flex items-center justify-center pointer-events-none hidden md:flex">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-blue-600/20 blur-[80px] rounded-full animate-pulse" />
            
            {/* Concentric Orbits */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 border border-white/5 rounded-full"
            />
            <motion.div 
              animate={{ rotate: -360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="absolute inset-4 border border-blue-500/10 rounded-full border-t-blue-500/30"
            />
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-10 border border-purple-500/10 rounded-full border-b-purple-500/40"
            />

            {/* Orbiting Particles */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-blue-400 rounded-full shadow-[0_0_10px_#60a5fa]" />
            </motion.div>
            
            <motion.div 
              animate={{ rotate: -360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute inset-10"
            >
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-purple-400 rounded-full shadow-[0_0_10px_#c084fc]" />
            </motion.div>

            {/* Central SVG Logo */}
            <motion.div 
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, type: "spring", bounce: 0.5 }}
              className="relative z-10"
            >
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="flex items-center justify-center w-28 h-28 bg-[#0a0f1c]/80 backdrop-blur-xl rounded-3xl shadow-[0_0_40px_rgba(59,130,246,0.4),inset_0_2px_10px_rgba(255,255,255,0.1)] border border-blue-500/30 p-4"
              >
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_15px_rgba(59,130,246,0.8)]" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#6366f1" />
                    </linearGradient>
                    <mask id="cutout">
                      <rect width="100" height="100" fill="white" />
                      {/* Interlocking Cuts */}
                      <line x1="65" y1="0" x2="8" y2="100" stroke="black" strokeWidth="8" />
                      <line x1="35" y1="100" x2="92" y2="0" stroke="black" strokeWidth="8" />
                    </mask>
                  </defs>
                  <g mask="url(#cutout)" stroke="url(#logo-grad)" strokeWidth="16" strokeLinejoin="miter" strokeMiterlimit="10">
                    <polygon points="30,15 70,15 90,50 70,85 30,85 10,50" />
                    <line x1="12" y1="50" x2="88" y2="50" />
                  </g>
                </svg>
              </motion.div>
            </motion.div>
          </div>

          {/* 4 Corners Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16 lg:gap-x-32 relative z-10">
            
            {/* 01: Top Left */}
            <AnimatedSection delay={0.1} className="relative group">
              <div className="absolute -top-14 -left-8 text-[140px] font-black text-white/[0.1] leading-none select-none pointer-events-none group-hover:text-blue-500/[0.25] transition-colors">01</div>
              <div className="relative z-10">
                <h3 className="text-2xl font-semibold text-white mb-3">Engineering Excellence</h3>
                <p className="text-gray-400 leading-relaxed text-sm max-w-md">
                  Speed is a feature. Bloated software costs money. We write clean, optimized code and deploy to edge networks so your internal tools load instantly.
                </p>
              </div>
            </AnimatedSection>

            {/* 02: Top Right */}
            <AnimatedSection delay={0.2} className="relative group md:text-right flex flex-col md:items-end">
              <div className="absolute -top-14 md:-right-8 -left-8 md:left-auto text-[140px] font-black text-white/[0.1] leading-none select-none pointer-events-none group-hover:text-purple-500/[0.25] transition-colors">02</div>
              <div className="relative z-10">
                <h3 className="text-2xl font-semibold text-white mb-3">Data Integrity First</h3>
                <p className="text-gray-400 leading-relaxed text-sm max-w-md">
                  Before we paint a single pixel on screen, we ensure the database schema is perfectly normalized. Beautiful UI means nothing if the underlying data is corrupted.
                </p>
              </div>
            </AnimatedSection>

            {/* 03: Bottom Left */}
            <AnimatedSection delay={0.3} className="relative group">
              <div className="absolute -top-14 -left-8 text-[140px] font-black text-white/[0.1] leading-none select-none pointer-events-none group-hover:text-emerald-500/[0.25] transition-colors">03</div>
              <div className="relative z-10">
                <h3 className="text-2xl font-semibold text-white mb-3">Absolute Ownership</h3>
                <p className="text-gray-400 leading-relaxed text-sm max-w-md">
                  No vendor lock-in. We build on open-source technologies and give you the keys to the kingdom. You own the code, the database, and the intellectual property.
                </p>
              </div>
            </AnimatedSection>

            {/* 04: Bottom Right */}
            <AnimatedSection delay={0.4} className="relative group md:text-right flex flex-col md:items-end">
              <div className="absolute -top-14 md:-right-8 -left-8 md:left-auto text-[140px] font-black text-white/[0.1] leading-none select-none pointer-events-none group-hover:text-pink-500/[0.25] transition-colors">04</div>
              <div className="relative z-10">
                <h3 className="text-2xl font-semibold text-white mb-3">Transparent Partnership</h3>
                <p className="text-gray-400 leading-relaxed text-sm max-w-md">
                  No marketing wrappers, no fluff. We tell you exactly what you need and what you don't. We act as a true technical partner, aligning our success with yours.
                </p>
              </div>
            </AnimatedSection>
            
          </div>
        </div>
      </section>
    </div>
  );
}
