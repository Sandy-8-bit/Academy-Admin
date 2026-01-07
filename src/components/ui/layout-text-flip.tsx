"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../../lib/utils";

export const LayoutTextFlip = ({
  text = "Build Amazing",
  words = ["Landing Pages", "Component Blocks", "Page Sections", "3D Shaders"],
  duration = 3000,
}: {
  text: string;
  words: string[];
  duration?: number;
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(
      () => setCurrentIndex((prev) => (prev + 1) % words.length),
      duration
    );
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col md:flex-row  gap-2">
      {/* Static Text */}
      <motion.span
        layoutId="subtext"
        className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4"
      >
        {text}
      </motion.span>

      {/* Animated Word Flip */}
      <motion.span
        layout
        className="relative h-fit text-center md:w-fit overflow-hidden rounded-xl bg-blue-600 /10 px-4 py-2 
                   font-sans text-2xl md:text-4xl font-semibold tracking-tight 
                   text-blue-700 shadow-sm backdrop-blur-sm border border-blue-500/10"
      >
        <AnimatePresence mode="popLayout">
          <motion.span
            key={currentIndex}
            initial={{ y: -40, opacity: 0, filter: "blur(6px)" }}
            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
            exit={{ y: 40, opacity: 0, filter: "blur(6px)" }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className={cn("inline-block max-h-fit whitespace-nowrap")}
          >
            {words[currentIndex]}
          </motion.span>
        </AnimatePresence>
      </motion.span>
    </div>
  );
};
