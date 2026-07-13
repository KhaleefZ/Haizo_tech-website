import { motion } from "framer-motion";

export default function Logo({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <motion.div
      whileHover={{ 
        scale: 1.15,
        rotate: [0, -10, 10, 0],
      }}
      transition={{ 
        scale: { type: "spring", stiffness: 300, damping: 15 },
        rotate: { type: "tween", duration: 0.5, ease: "easeInOut" }
      }}
      className={`${className} inline-block select-none`}
    >
      <img 
        src="/logo.jpg" 
        alt="HaizoTech Logo" 
        className="w-full h-full object-contain rounded-md shadow-[0_0_15px_rgba(59,130,246,0.3)]" 
      />
    </motion.div>
  );
}
