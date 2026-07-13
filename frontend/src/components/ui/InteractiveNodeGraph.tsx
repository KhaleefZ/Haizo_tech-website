"use client";

import { useEffect, useRef } from "react";
import GlassCard from "./GlassCard";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

export default function InteractiveNodeGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Particle settings
    const particleCount = 45;
    const maxDistance = 120;
    const mouseRadius = 150;
    const particles: Particle[] = [];

    let mouse = { x: -1000, y: -1000 };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 1.2,
        vy: (Math.random() - 0.5) * 1.2,
        radius: Math.random() * 2 + 1,
      });
    }

    let hue = 220; // Starting color (blue)

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      hue = (hue + 0.1) % 360;

      for (let i = 0; i < particleCount; i++) {
        const p = particles[i];

        // Friction / drag
        p.vx *= 0.97;
        p.vy *= 0.97;

        // Restore natural cruising speed slowly if drag slows particles too much
        const currentSpeed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        const naturalSpeed = 0.8;
        if (currentSpeed < naturalSpeed) {
          const ratio = (naturalSpeed - currentSpeed) * 0.03;
          p.vx += (p.vx / (currentSpeed || 1)) * ratio;
          p.vy += (p.vy / (currentSpeed || 1)) * ratio;
        }

        // Movement
        p.x += p.vx;
        p.y += p.vy;

        // Bounce off walls
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        // Mouse interaction (repel with friction & acceleration)
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < mouseRadius) {
          const angle = Math.atan2(dy, dx);
          const force = (mouseRadius - dist) / mouseRadius;
          p.vx += Math.cos(angle) * force * 0.4;
          p.vy += Math.sin(angle) * force * 0.4;
        }

        // Draw particle with shifting HSL color
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${hue}, 85%, 60%, 0.8)`;
        ctx.fill();

        // Connect particles
        for (let j = i + 1; j < particleCount; j++) {
          const p2 = particles[j];
          const dx2 = p.x - p2.x;
          const dy2 = p.y - p2.y;
          const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

          if (dist2 < maxDistance) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            
            // Dynamic opacity based on distance
            const opacity = 1 - dist2 / maxDistance;
            
            // Shifting gradient line
            const grad = ctx.createLinearGradient(p.x, p.y, p2.x, p2.y);
            grad.addColorStop(0, `hsla(${hue}, 85%, 60%, ${opacity * 0.4})`);
            grad.addColorStop(1, `hsla(${(hue + 60) % 360}, 85%, 60%, ${opacity * 0.4})`);
            
            ctx.strokeStyle = grad;
            ctx.lineWidth = 1.2;
            ctx.stroke();
          }
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <GlassCard className="absolute inset-4 rounded-3xl overflow-hidden border border-white/20 shadow-2xl backdrop-blur-xl animate-[float_6s_ease-in-out_infinite]" hoverEffect={false}>
      {/* Label layer on top of canvas */}
      <div className="absolute top-8 left-8 z-10 pointer-events-none">
        <div className="flex justify-between items-start mb-2">
          <div className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-medium border border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.3)] backdrop-blur-md">
            Neural Connectivity
          </div>
        </div>
        <h3 className="text-2xl font-bold text-white mb-1">Architecture</h3>
        <p className="text-sm text-gray-400 font-mono">Real-time Node Graph Analysis</p>
      </div>

      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full z-0 cursor-crosshair"
      />
    </GlassCard>
  );
}
