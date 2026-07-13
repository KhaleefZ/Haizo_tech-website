import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface ServiceTerminalConfig {
  name: string;
  topBadge: string;
  bottomBadge: string;
  code: string[];
}

const serviceConfigs: ServiceTerminalConfig[] = [
  {
    name: "Custom Software",
    topBadge: "SYSTEM_ONLINE",
    bottomBadge: "SOFTWARE_COMPILED",
    code: [
      "const app = new CustomSoftware({",
      "  architecture: 'Microservices',",
      "  database: 'PostgreSQL',",
      "  scaling: 'Auto-scaling',",
      "});",
      "await app.compile();",
      "> Compiling dependency graph...",
      "> Running 142 unit tests: OK",
      "> Docker container built successfully",
      "> API endpoints initialized"
    ]
  },
  {
    name: "Web & Mobile Apps",
    topBadge: "CLIENT_SYNC_OK",
    bottomBadge: "PWA_DEPLOYED",
    code: [
      "const app = new MobileApp({",
      "  platform: ['iOS', 'Android'],",
      "  framework: 'React Native',",
      "  theme: 'Glassmorphic',",
      "});",
      "await app.deploy();",
      "> Bundling assets...",
      "> Optimizing images & caching...",
      "> App Store bundle verified",
      "> Deploying PWA to edge CDN"
    ]
  },
  {
    name: "AI & Intelligent Systems",
    topBadge: "NEURAL_CHAIN_ON",
    bottomBadge: "AI_MODEL_SYNCED",
    code: [
      "const model = new AIModel({",
      "  architecture: 'Transformer',",
      "  pipeline: 'RAG Vector Search',",
      "  vectorDb: 'pgvector',",
      "});",
      "await model.train();",
      "> Loading vector embeddings...",
      "> Tuning temperature and top-p...",
      "> Multi-agent chain online",
      "> Response latency: 120ms"
    ]
  },
  {
    name: "Network Solutions",
    topBadge: "ZERO_TRUST_PASS",
    bottomBadge: "SDWAN_TUNNEL_OK",
    code: [
      "const net = new SDWANNetwork({",
      "  topology: 'Mesh Network',",
      "  nodes: 50,",
      "  firewall: 'NextGen Zero Trust',",
      "});",
      "await net.sync();",
      "> Handshaking routing table...",
      "> Encrypting VPN tunnels...",
      "> Security handshake: OK",
      "> Throughput: 10 Gbps"
    ]
  }
];

export default function IsometricTerminal() {
  const [currentServiceIndex, setCurrentServiceIndex] = useState(0);
  const [lines, setLines] = useState<string[]>([]);
  const [isSuccessState, setIsSuccessState] = useState(false);
  const [fadeContent, setFadeContent] = useState(true);

  useEffect(() => {
    let active = true;

    const runTerminalSequence = async () => {
      while (active) {
        const currentService = serviceConfigs[currentServiceIndex];
        setIsSuccessState(false);
        setLines([]);
        setFadeContent(true);

        // Small initial wait before typing starts
        await new Promise((r) => setTimeout(r, 600));
        if (!active) return;

        // Iterate over each line of code/output
        for (let i = 0; i < currentService.code.length; i++) {
          if (!active) return;
          const line = currentService.code[i];

          if (line.startsWith(">")) {
            // Output lines: print immediately after a short wait
            await new Promise((r) => setTimeout(r, 450));
            if (!active) return;
            setLines((prev) => [...prev, line].slice(-8));
          } else {
            // Typewrite the code declaration lines
            setLines((prev) => [...prev, ""]);
            let currentTyped = "";
            for (let charIdx = 0; charIdx <= line.length; charIdx++) {
              if (!active) return;
              currentTyped = line.substring(0, charIdx);
              setLines((prev) => {
                const nextLines = [...prev];
                nextLines[nextLines.length - 1] = currentTyped;
                return nextLines.slice(-8);
              });
              await new Promise((r) => setTimeout(r, Math.random() * 15 + 10));
            }
            await new Promise((r) => setTimeout(r, 200));
          }
        }

        // Pause to show completion success state
        if (!active) return;
        setIsSuccessState(true);
        await new Promise((r) => setTimeout(r, 4000));

        // Fade content out before reset
        if (!active) return;
        setFadeContent(false);
        await new Promise((r) => setTimeout(r, 600));

        // Switch to the next service
        if (!active) return;
        setCurrentServiceIndex((prev) => (prev + 1) % serviceConfigs.length);
      }
    };

    runTerminalSequence();

    return () => {
      active = false;
    };
  }, [currentServiceIndex]);

  const currentService = serviceConfigs[currentServiceIndex];

  return (
    <div className="relative w-full h-[400px] md:h-[500px] flex items-center justify-center [perspective:2000px]">
      
      {/* Floating Container with Isometric Rotation */}
      <motion.div
        animate={{ y: [-12, 12, -12] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="relative w-[280px] h-[200px] sm:w-[350px] sm:h-[250px] md:w-[460px] md:h-[320px] [transform-style:preserve-3d]"
        style={{
          transform: "rotateX(45deg) rotateZ(-25deg) rotateY(10deg)",
        }}
      >
        
        {/* Layer 1: Back shadow/glow */}
        <div 
          className="absolute inset-0 bg-blue-500/15 blur-[55px] rounded-2xl"
          style={{ transform: "translateZ(-50px)" }} 
        />

        {/* Layer 2: Base Glass Panel */}
        <div 
          className="absolute inset-0 bg-[#030712]/70 backdrop-blur-2xl border border-blue-500/30 rounded-2xl shadow-[inset_0_0_20px_rgba(59,130,246,0.1)] flex flex-col transition-all duration-500"
          style={{ transform: "translateZ(0px)" }} 
        >
          {/* Terminal Header */}
          <div className="bg-white/5 border-b border-white/10 p-3 md:p-4 flex items-center gap-2 rounded-t-2xl shrink-0">
            <div className="w-3 h-3 rounded-full bg-red-500/80 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80 shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
            <div className="w-3 h-3 rounded-full bg-green-500/80 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
            <span className="text-[10px] md:text-xs text-blue-300/60 font-mono ml-2 tracking-wider flex items-center gap-2">
              haizo@sys: ~ <span className="opacity-40">|</span> <span className="text-blue-400 font-bold">{currentService.name}</span>
            </span>
          </div>

          {/* Terminal Body */}
          <div 
            className={`p-4 md:p-6 font-mono text-[10px] sm:text-[11px] md:text-[13px] leading-relaxed flex-1 overflow-hidden transition-all duration-500 ${
              fadeContent ? "opacity-100 transform translate-y-0" : "opacity-0 transform -translate-y-2"
            }`}
          >
            {lines.map((line, i) => (
              <motion.div
                key={`${i}-${line}`}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className={
                  line.startsWith(">") 
                    ? "text-emerald-400 mt-1 md:mt-2" 
                    : line.startsWith("const") || line.startsWith("await")
                    ? "text-purple-400"
                    : "text-blue-200"
                }
              >
                {line}
              </motion.div>
            ))}
            <motion.div
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="inline-block w-1.5 h-3.5 bg-blue-400 ml-1 align-middle shadow-[0_0_10px_rgba(96,165,250,0.8)]"
            />
          </div>
        </div>

        {/* Layer 3: Floating UI Badges */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={`top-${currentServiceIndex}`}
            initial={{ opacity: 0, scale: 0.8, z: 20 }}
            animate={{ opacity: 1, scale: 1, z: 45 }}
            exit={{ opacity: 0, scale: 0.8, z: 20 }}
            transition={{ duration: 0.4 }}
            className="absolute -top-6 -right-6 md:-top-8 md:-right-8 px-3 py-1.5 md:px-4 md:py-2 bg-blue-500/10 backdrop-blur-md border border-blue-400/30 rounded-lg shadow-[0_0_20px_rgba(59,130,246,0.3)] text-blue-300 font-mono text-[10px] md:text-xs flex items-center gap-2"
            style={{ transform: "translateZ(45px)" }}
          >
            <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-blue-400 animate-pulse" />
            {currentService.topBadge}
          </motion.div>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.div 
            key={`bottom-${currentServiceIndex}`}
            initial={{ opacity: 0, scale: 0.8, z: 15 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              z: 35,
              borderColor: isSuccessState ? "rgba(34, 197, 94, 0.4)" : "rgba(168, 85, 247, 0.3)",
              color: isSuccessState ? "rgb(110, 231, 183)" : "rgb(216, 180, 254)"
            }}
            exit={{ opacity: 0, scale: 0.8, z: 15 }}
            transition={{ duration: 0.4 }}
            className="absolute -bottom-4 -left-4 md:-bottom-6 md:-left-6 px-3 py-1.5 md:px-4 md:py-2 bg-purple-500/10 backdrop-blur-md border rounded-lg shadow-[0_0_20px_rgba(168,85,247,0.3)] font-mono text-[10px] md:text-xs flex items-center gap-2"
            style={{ transform: "translateZ(35px)" }}
          >
            <div className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full animate-pulse ${isSuccessState ? "bg-emerald-400" : "bg-purple-400"}`} />
            {currentService.bottomBadge}
          </motion.div>
        </AnimatePresence>

      </motion.div>
    </div>
  );
}
