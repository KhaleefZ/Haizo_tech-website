"use client";

import { motion } from "framer-motion";
import AnimatedSection from "@/components/ui/AnimatedSection";
import GlassCard from "@/components/ui/GlassCard";
import CountUp from "@/components/ui/CountUp";
import TypewriterText from "@/components/ui/TypewriterText";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Code2, Database, Layout, ShieldCheck, Zap } from "lucide-react";
import FloatingPrisms from "@/components/ui/FloatingPrisms";
import IsometricTerminal from "@/components/ui/IsometricTerminal";
import FeedbackMarquee from "@/components/ui/FeedbackMarquee";

export default function Home() {
  const industries = [
    { name: "Healthcare", desc: "HIPAA-compliant platforms", img: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=600&auto=format&fit=crop" },
    { name: "FinTech", desc: "Secure payment gateways", img: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=600&auto=format&fit=crop" },
    { name: "EdTech", desc: "Scalable LMS", img: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=600&auto=format&fit=crop" },
    { name: "E-commerce", desc: "Digital storefronts", img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop" },
    { name: "Logistics", desc: "Supply chain AI", img: "https://images.unsplash.com/photo-1580674285054-bed31e145f59?q=80&w=600&auto=format&fit=crop" }
  ];

  return (
    <div className="flex flex-col gap-24 pb-20">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 lg:pt-40 lg:pb-32 flex items-center justify-center px-6 overflow-hidden min-h-[80vh]">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          {/* Stars Background with slow rotation */}
          <div 
            className="absolute inset-[-50%] opacity-40 animate-[spin_120s_linear_infinite]"
            style={{ 
              backgroundImage: 'radial-gradient(1.5px 1.5px at 10% 20%, white, transparent), radial-gradient(2px 2px at 30% 60%, white, transparent), radial-gradient(1px 1px at 50% 40%, white, transparent), radial-gradient(2px 2px at 70% 80%, white, transparent), radial-gradient(1.5px 1.5px at 90% 10%, white, transparent), radial-gradient(1px 1px at 20% 90%, white, transparent), radial-gradient(1.5px 1.5px at 80% 30%, white, transparent)', 
              backgroundSize: '250px 250px' 
            }} 
          />
          {/* Additional twinkling stars with counter-rotation */}
          <div 
            className="absolute inset-[-50%] opacity-20 animate-[spin_90s_linear_infinite_reverse]"
            style={{ 
              backgroundImage: 'radial-gradient(1px 1px at 15% 15%, white, transparent), radial-gradient(1.5px 1.5px at 85% 65%, white, transparent), radial-gradient(2px 2px at 45% 85%, white, transparent)', 
              backgroundSize: '300px 300px' 
            }} 
          />
          
          {/* Floating glowing particles using absolute positioning and pulse */}
          <div className="absolute inset-0 opacity-50 pointer-events-none">
             <div className="absolute top-[20%] left-[20%] w-2 h-2 bg-purple-400 rounded-full blur-[2px] animate-[pulse_4s_ease-in-out_infinite]" />
             <div className="absolute top-[60%] right-[30%] w-3 h-3 bg-blue-400 rounded-full blur-[3px] animate-[pulse_6s_ease-in-out_infinite_1s]" />
             <div className="absolute bottom-[20%] left-[40%] w-2 h-2 bg-pink-400 rounded-full blur-[2px] animate-[pulse_5s_ease-in-out_infinite_2s]" />
          </div>

          {/* Central Glowing Orbs with Blob animation */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/30 rounded-full blur-[120px] mix-blend-screen animate-blob" />
          
          {/* Secondary subtle orb for depth with delayed blob animation */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-600/20 rounded-full blur-[100px] mix-blend-screen animate-blob" style={{ animationDelay: '2s' }} />
        </div>

        <div className="container mx-auto flex flex-col items-center text-center relative z-10 max-w-4xl">
          <AnimatedSection delay={0.1} variant="fadeUp" className="w-full flex flex-col items-center">
            <motion.h1
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 1 },
                visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } }
              }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6 text-white"
            >
              <motion.span variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="block">Transforming Business Through</motion.span>
              <motion.span variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="block hover:scale-105 transition-transform duration-300 w-fit mx-auto">
                <TypewriterText
                  words={["Custom Software & AI", "Web & Mobile Application", "AI System & Integration", "Network & IT Solutions"]}
                  textClassName="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500"
                />
              </motion.span>
            </motion.h1>
          </AnimatedSection>

          <AnimatedSection delay={0.3} variant="fadeUp">
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed mb-10">
              We are a premier technology agency specializing in custom web and mobile applications, scalable cloud infrastructure, artificial intelligence, and enterprise-grade software solutions to accelerate your digital growth.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.4} variant="fadeUp" className="w-full">
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-medium transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] flex items-center gap-2 hover:scale-105"
              >
                Start a Project <ArrowRight size={18} className="animate-pulse" />
              </Link>
              <Link
                href="/services"
                className="px-8 py-4 bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 text-white rounded-full font-medium transition-all hover:scale-105"
              >
                Explore Services
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Industries Marquee */}
      <section className="w-full overflow-hidden py-10 relative">
        <AnimatedSection className="text-center mb-12 px-6">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Industries We Empower</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">Tailored service solutions spanning across diverse sectors.</p>
        </AnimatedSection>

        {/* Gradients to fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

        <div className="flex w-[200%] animate-marquee">
          {/* Double the array for seamless infinite scroll */}
          {[...industries, ...industries].map((industry, i) => (
            <div key={i} className="w-[300px] sm:w-[400px] flex-shrink-0 px-4 group">
              <div className="relative h-[250px] rounded-2xl overflow-hidden border border-white/10 cursor-pointer">
                <div className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:opacity-60 transition-opacity duration-500 grayscale group-hover:grayscale-0 group-hover:scale-110" style={{ backgroundImage: `url('${industry.img}')` }} />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">{industry.name}</h3>
                  <p className="text-gray-300 text-sm group-hover:text-white transition-colors">{industry.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Engineering Culture / How We Work */}
      <section className="container mx-auto px-6 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[500px] bg-blue-600/10 blur-[100px] rounded-full pointer-events-none" />

        <AnimatedSection className="text-center mb-16 relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Our Engineering Culture</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">We build services with scalable architecture, clean code, and AI-driven efficiency.</p>
        </AnimatedSection>

        <div className="grid lg:grid-cols-2 gap-6 relative z-10 max-w-6xl mx-auto">
          {/* Left Column */}
          <div className="flex flex-col gap-6">
            {/* Card 1: Scalable Architecture */}
            <AnimatedSection delay={0.1} className="h-full">
              <div className="relative h-full bg-[#030712]/50 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-12 overflow-hidden group hover:border-blue-500/40 transition-colors flex flex-col justify-between min-h-[300px]">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="relative z-10 w-[60%]">
                  <h3 className="text-2xl font-bold text-white mb-4">Scalable Architecture</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6">
                    Proprietary consensus driving high-frequency operations and data processing at scale.
                  </p>
                  <Link href="/services" className="inline-flex px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-sm font-medium rounded-lg transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                    Learn More
                  </Link>
                </div>

                {/* Animated Nodes */}
                <div className="absolute right-8 inset-y-0 flex items-center justify-center w-[30%] pointer-events-none">
                  {/* Glowing background orb */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-blue-500/20 rounded-full blur-[50px] animate-pulse" />

                  <motion.div
                    animate={{ y: [0, -10, 0], scale: [1, 1.05, 1] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/4 right-0 p-3 bg-[#0f172a] border border-blue-500/30 rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.3)] backdrop-blur-md"
                  >
                    <Database className="w-5 h-5 text-blue-400 drop-shadow-[0_0_5px_rgba(96,165,250,0.8)]" />
                  </motion.div>
                  <motion.div
                    animate={{ y: [0, 10, 0], scale: [1, 1.05, 1] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute top-1/2 -left-4 p-3 bg-[#0f172a] border border-purple-500/30 rounded-xl shadow-[0_0_20px_rgba(168,85,247,0.3)] backdrop-blur-md"
                  >
                    <Layout className="w-5 h-5 text-purple-400 drop-shadow-[0_0_5px_rgba(192,132,252,0.8)]" />
                  </motion.div>
                  <motion.div
                    animate={{ y: [0, -15, 0], scale: [1, 1.05, 1] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    className="absolute bottom-1/4 right-4 p-3 bg-[#0f172a] border border-emerald-500/30 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] backdrop-blur-md"
                  >
                    <Zap className="w-5 h-5 text-emerald-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.8)]" />
                  </motion.div>
                </div>
              </div>
            </AnimatedSection>

            {/* Card 2: Clean Code & Connectivity */}
            <AnimatedSection delay={0.2} className="h-full">
              <div className="relative h-full bg-[#030712]/50 backdrop-blur-xl border border-white/10 rounded-2xl p-12 overflow-hidden group hover:border-white/20 transition-colors min-h-[300px]">
                <div className="relative z-10 w-[60%]">
                  <h3 className="text-2xl font-bold text-white mb-4">Seamless Connectivity</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Access a borderless digital ecosystem. We integrate with leading tools to provide a seamless development experience.
                  </p>
                </div>

                {/* Floating Integration Icons */}
                <div className="absolute right-4 inset-y-0 w-[40%] pointer-events-none">
                  <div className="absolute top-1/2 right-12 -translate-y-1/2 w-40 h-40 bg-purple-500/10 rounded-full blur-[60px] animate-[pulse_6s_infinite]" />
                  <motion.div animate={{ x: [0, 15, 0], y: [0, -10, 0] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }} className="absolute top-10 right-4 p-2 bg-orange-500/10 border border-orange-500/40 rounded-full flex items-center justify-center w-10 h-10 shadow-[0_0_15px_rgba(249,115,22,0.3)] backdrop-blur-sm">
                    <span className="text-orange-500 font-bold text-xs">O</span>
                  </motion.div>
                  <motion.div animate={{ x: [0, -10, 0], y: [0, 15, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }} className="absolute top-24 left-4 p-2 bg-emerald-500/10 border border-emerald-500/40 rounded-full flex items-center justify-center w-10 h-10 shadow-[0_0_15px_rgba(16,185,129,0.3)] backdrop-blur-sm">
                    <span className="text-emerald-500 font-bold text-xs">S</span>
                  </motion.div>
                  <motion.div animate={{ x: [0, 10, 0], y: [0, 10, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }} className="absolute top-1/2 right-12 p-2 bg-blue-500/10 border border-blue-500/40 rounded-full flex items-center justify-center w-12 h-12 shadow-[0_0_15px_rgba(59,130,246,0.3)] backdrop-blur-sm">
                    <span className="text-blue-500 font-bold text-lg">D</span>
                  </motion.div>
                  <motion.div animate={{ x: [0, -15, 0], y: [0, -5, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }} className="absolute bottom-16 right-4 p-2 bg-indigo-500/10 border border-indigo-500/40 rounded-full flex items-center justify-center w-10 h-10 shadow-[0_0_15px_rgba(99,102,241,0.3)] backdrop-blur-sm">
                    <span className="text-indigo-500 font-bold text-xs">I</span>
                  </motion.div>
                  <motion.div animate={{ x: [0, 5, 0], y: [0, -15, 0] }} transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut", delay: 3 }} className="absolute bottom-8 left-10 p-2 bg-purple-500/10 border border-purple-500/40 rounded-full flex items-center justify-center w-10 h-10 shadow-[0_0_15px_rgba(168,85,247,0.3)] backdrop-blur-sm">
                    <span className="text-purple-500 font-bold text-xs">G</span>
                  </motion.div>
                </div>
              </div>
            </AnimatedSection>
          </div>

          {/* Right Column - Card 3: Secure By Design */}
          <AnimatedSection delay={0.3} className="h-full">
            <div className="relative h-full bg-[#030712]/50 backdrop-blur-xl border border-indigo-500/20 rounded-2xl p-12 overflow-hidden group hover:border-indigo-500/40 transition-colors">
              <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="relative z-10 h-full flex flex-col">
                <h3 className="text-3xl font-bold text-white mb-6">Secure by Design</h3>
                <div className="space-y-4 text-gray-400 text-sm leading-relaxed mb-10 pr-4">
                  <p>
                    Every application we build is protected by modern security practices and continuous monitoring.
                  </p>
                  <p>
                    We ensure your digital products meet rigorous industry standards without sacrificing development velocity.
                  </p>
                  <p>
                    From zero-trust architecture to robust threat mitigation, our proactive approach shields your infrastructure from emerging vulnerabilities.
                  </p>
                </div>

                <div className="mt-auto border border-white/10 rounded-xl p-6 bg-white/[0.02]">
                  <ul className="space-y-4">
                    {[
                      "End-to-End Data Encryption",
                      "Role-Based Access Control (RBAC)",
                      "Regular Vulnerability Assessments",
                      "Automated Security CI/CD Pipelines",
                      "Industry Standard Compliance (GDPR, HIPAA)"
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm text-gray-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_5px_rgba(99,102,241,0.8)]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Development Process Pipeline */}
      <section className="container mx-auto px-6 max-w-5xl">
        <AnimatedSection className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Development Process</h2>
        </AnimatedSection>

        <div className="relative py-10">
          {/* Central Animated Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-600 via-cyan-500 to-purple-600 -translate-x-1/2 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)] opacity-80" />

          {[
            { num: "01", title: "Research & Planning", desc: "Understanding constraints and requirements" },
            { num: "02", title: "Design & Prototype", desc: "System design and technical foundation" },
            { num: "03", title: "Development & Testing", desc: "Iterative sprint execution and QA" },
            { num: "04", title: "Deployment & Maintenance", desc: "Staging to production rollout" }
          ].map((step, i) => {
            const isLeft = i % 2 === 0;
            return (
              <AnimatedSection key={i} delay={0.1} variant={isLeft ? "slideRight" : "slideLeft"}>
                <div className={`flex w-full items-center mb-16 ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}>
                  {/* Content half */}
                  <div className={`w-1/2 ${isLeft ? 'pr-12 text-right' : 'pl-12 text-left'}`}>
                    <div className="text-blue-500 font-mono text-sm font-bold mb-2 tracking-widest">{step.num}</div>
                    <h3 className="text-3xl font-bold text-white mb-2 tracking-tight">{step.title}</h3>
                    <p className="text-gray-400 text-sm md:text-base">{step.desc}</p>
                  </div>

                  {/* Central Node */}
                  <div className="relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-[3px] border-blue-500 bg-[#050505] shadow-[0_0_20px_rgba(59,130,246,1)] -mx-4 group hover:scale-125 transition-transform cursor-pointer">
                    <div className="w-3 h-3 rounded-full bg-blue-400 animate-pulse" />
                  </div>

                  {/* Empty half for spacing */}
                  <div className="w-1/2" />
                </div>
              </AnimatedSection>
            );
          })}
        </div>
      </section>

      {/* Client Feedback Carousel */}
      <section className="container mx-auto px-6 overflow-hidden">
        <AnimatedSection className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Client Feedback</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">What partners say about our service delivery.</p>
        </AnimatedSection>

        <FeedbackMarquee />
      </section>
    </div>
  );
}
