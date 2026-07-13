"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function TypewriterText({ words, className, textClassName }: { words: string[], className?: string, textClassName?: string }) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const word = words[index];
    
    const updateText = () => {
      if (isDeleting) {
        setText((prev) => word.substring(0, Math.max(0, prev.length - 1)));
        if (text === "") {
          setIsDeleting(false);
          setIndex((prev) => (prev + 1) % words.length);
        }
      } else {
        setText((prev) => word.substring(0, prev.length + 1));
        if (text === word) {
          setIsPaused(true);
          setTimeout(() => {
            setIsPaused(false);
            setIsDeleting(true);
          }, 2500); // Pause when word is fully typed
        }
      }
    };
    
    const timer = setTimeout(updateText, isDeleting ? 40 : 80);
    return () => clearTimeout(timer);
  }, [text, isDeleting, index, words, isPaused]);

  return (
    <span className={`inline-flex items-center ${className || ""}`}>
      <span className={textClassName}>{text}</span>
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
        className="ml-[4px] w-[3px] h-[0.9em] bg-blue-500 inline-block align-middle rounded-full"
      />
    </span>
  );
}
