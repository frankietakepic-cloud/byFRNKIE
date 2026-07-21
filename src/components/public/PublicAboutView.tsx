import React from "react";
import { motion } from "motion/react";
import { ShieldCheck, Layers, BookOpen, Wrench, Camera, Heart, Mail } from "lucide-react";

export default function PublicAboutView() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col gap-16 font-sans max-w-4xl mx-auto selection:bg-neutral-800 selection:text-white"
    >
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-neutral-900 pb-8">
        <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-neutral-500">
          PERSONAL INTRODUCTION & MANIFESTO
        </span>
        <h1 className="font-serif text-4xl md:text-6xl text-neutral-100 font-normal tracking-tight">
          About Frankie & byFRNK
        </h1>
        <p className="font-serif italic text-lg text-neutral-300 font-light max-w-2xl leading-relaxed pt-2">
          "This is not a resume. It is an introduction to a way of seeing, building, and living."
        </p>
      </div>

      {/* Main Narrative */}
      <div className="flex flex-col gap-10 text-neutral-300 font-sans text-xs md:text-sm font-light leading-relaxed space-y-4">
        <div className="bg-[#141414] border border-neutral-800/80 p-8 rounded-xl flex flex-col gap-4">
          <h2 className="font-serif text-2xl text-neutral-100 font-medium">
            Who Frankie Is
          </h2>
          <p>
            I am a photographer, software architect, engineer, and writer based between Saigon, Kyoto, and Toronto. I spend my days observing light through mechanical cameras, dismantling and restoring classic vehicles in the workshop, building quiet digital tools, and writing field essays.
          </p>
          <p>
            I do not view photography, engineering, and writing as separate disciplines or side projects. They are different expressions of the exact same instinct: the desire to look closely, understand how things work, and craft something designed to endure.
          </p>
        </div>

        {/* Why byFRNK Exists */}
        <div className="flex flex-col gap-4 bg-[#121212] border border-neutral-800/80 p-8 rounded-xl">
          <h2 className="font-serif text-2xl text-neutral-100 font-medium">
            Why byFRNK Exists
          </h2>
          <p>
            Most modern internet platforms turn creative work into ephemeral content feed material designed to be swiped away in milliseconds. Work is published to compete for algorithms rather than to be studied slowly.
          </p>
          <p>
            byFRNK was built to reject ephemerality. It is a living digital archive designed to house twenty years of observations in one quiet, connected space. When you browse this site, you are entering a knowledge graph where every photograph connects to a workshop note, a field essay, or a location coordinate.
          </p>
        </div>

        {/* The Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="bg-[#141414] border border-neutral-800 p-6 rounded-xl flex flex-col gap-3">
            <Camera className="w-5 h-5 text-amber-400" />
            <h3 className="font-serif text-lg text-neutral-100 font-medium">Photography</h3>
            <p className="text-xs text-neutral-400">
              Capturing fog, architecture, and silence with mechanical rangefinders and medium format film.
            </p>
          </div>

          <div className="bg-[#141414] border border-neutral-800 p-6 rounded-xl flex flex-col gap-3">
            <Wrench className="w-5 h-5 text-amber-400" />
            <h3 className="font-serif text-lg text-neutral-100 font-medium">Engineering</h3>
            <p className="text-xs text-neutral-400">
              Workshop mechanical restorations, custom tool fabrication, and clean, resilient software architecture.
            </p>
          </div>

          <div className="bg-[#141414] border border-neutral-800 p-6 rounded-xl flex flex-col gap-3">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <h3 className="font-serif text-lg text-neutral-100 font-medium">Writing</h3>
            <p className="text-xs text-neutral-400">
              Essays on philosophy, the discipline of subtraction, longevity, and field notes from life journeys.
            </p>
          </div>
        </div>

        {/* Colophon & Contact */}
        <div className="bg-[#101010] border border-neutral-800/80 p-6 md:p-8 rounded-xl font-mono text-xs text-neutral-400 flex flex-col gap-4">
          <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Colophon & System Specs</span>
          <p className="text-neutral-300 font-sans">
            Built with React, TypeScript, Tailwind CSS, and Node. Native dark mode identity. Designed with generous whitespace and zero intrusive visual clutter.
          </p>
          <div className="flex items-center gap-2 pt-2 text-neutral-400">
            <Mail className="w-4 h-4 text-emerald-400" />
            <span>Correspondence: frankie@byfrnk.archive</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
