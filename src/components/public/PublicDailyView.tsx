import React from "react";
import { motion } from "motion/react";
import { Clock, MapPin, Coffee, Sun, Music, BookOpen, Sparkles, CheckCircle2 } from "lucide-react";
import { DailyEntry } from "../../types";

interface PublicDailyViewProps {
  dailyEntries: DailyEntry[];
}

export default function PublicDailyView({ dailyEntries }: PublicDailyViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col gap-12 font-sans max-w-4xl mx-auto selection:bg-neutral-800 selection:text-white"
    >
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-neutral-900 pb-8">
        <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-neutral-500">
          DAILY MOMENTS & OBSERVATIONS
        </span>
        <h1 className="font-serif text-3xl md:text-5xl text-neutral-100 font-normal tracking-tight">
          Daily Log
        </h1>
        <p className="font-sans text-xs md:text-sm text-neutral-400 font-light max-w-xl leading-relaxed">
          Daily is intentionally lightweight. Not every day deserves a long article. Daily captures moments—morning coffee, interesting light, workshop progress, books, music, travel, and small victories. Consistency over perfection.
        </p>
      </div>

      {/* Daily Entries Timeline Feed */}
      <div className="relative border-l border-neutral-800/80 ml-2 md:ml-4 pl-6 md:pl-8 space-y-10">
        {dailyEntries.map((entry) => (
          <div key={entry.id} className="relative group">
            {/* Timeline Node Icon */}
            <div className="absolute -left-[31px] md:-left-[39px] top-1.5 w-3 h-3 bg-neutral-900 border-2 border-amber-400 rounded-full group-hover:scale-125 transition-transform" />

            <div className="bg-[#141414] border border-neutral-800/80 p-6 rounded-xl flex flex-col gap-4 font-sans hover:border-neutral-700 transition-colors">
              {/* Entry Header Info */}
              <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs text-neutral-500 border-b border-neutral-800/60 pb-3">
                <div className="flex items-center gap-3">
                  <span className="text-neutral-200 font-bold">{entry.date}</span>
                  <span>•</span>
                  <span>{entry.time}</span>
                </div>

                <div className="flex items-center gap-2 text-amber-400/90 text-[11px]">
                  <MapPin className="w-3 h-3" />
                  <span>{entry.location || "Studio Desk"}</span>
                </div>
              </div>

              {/* Main Content Body */}
              <p className="text-xs md:text-sm text-neutral-200 font-light leading-relaxed whitespace-pre-line">
                {entry.content}
              </p>

              {/* Photos attached to Daily */}
              {entry.photoUrls && entry.photoUrls.length > 0 && (
                <div className="grid grid-cols-2 gap-3 pt-2">
                  {entry.photoUrls.map((url, i) => (
                    <img
                      key={i}
                      src={url}
                      alt="Daily moment"
                      className="rounded border border-neutral-800 object-cover aspect-[4/3] w-full"
                    />
                  ))}
                </div>
              )}

              {/* Footer Meta Tags */}
              <div className="flex items-center justify-between pt-3 border-t border-neutral-800/60 font-mono text-[10px] text-neutral-500">
                <span>Focus State: {entry.focusMood || "Observational"}</span>
                {entry.tags && entry.tags.length > 0 && (
                  <div className="flex items-center gap-1.5">
                    {entry.tags.map((t) => (
                      <span key={t} className="bg-neutral-800/80 px-2 py-0.5 rounded text-neutral-400">
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
