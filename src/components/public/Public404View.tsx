import React from "react";
import { motion } from "motion/react";
import { Compass, ArrowLeft } from "lucide-react";

interface Public404ViewProps {
  onReturnHome: () => void;
}

export default function Public404View({ onReturnHome }: Public404ViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex flex-col items-center justify-center py-24 text-center gap-6 font-sans max-w-xl mx-auto px-6"
    >
      <div className="w-12 h-12 bg-[#141414] border border-neutral-800 rounded-full flex items-center justify-center text-amber-400">
        <Compass className="w-6 h-6 animate-spin-slow" />
      </div>

      <div className="flex flex-col gap-2">
        <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-neutral-500">
          404 • UNCHARTED COORDINATE
        </span>
        <h1 className="font-serif text-3xl md:text-4xl text-neutral-100 font-medium">
          Silence in the Archive
        </h1>
        <p className="font-serif italic text-sm text-neutral-400 font-light leading-relaxed">
          "Not all paths lead to a recorded entry. Sometimes the light shifts and leaves only quiet."
        </p>
      </div>

      <p className="font-sans text-xs text-neutral-400 max-w-md leading-relaxed font-light">
        The ledger entry or permalink you requested does not exist or has been moved to a different coordinate.
      </p>

      <button
        onClick={onReturnHome}
        className="mt-4 bg-neutral-100 hover:bg-white text-neutral-950 font-mono text-xs uppercase font-bold tracking-wider px-6 py-3 rounded-md transition-colors cursor-pointer flex items-center gap-2"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Return to Active Archive</span>
      </button>
    </motion.div>
  );
}
