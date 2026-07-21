import React, { useState } from "react";
import { motion } from "motion/react";
import { Calendar, Clock, Layers, ArrowRight } from "lucide-react";
import { Photo, JournalEntry, Project } from "../../types";

interface PublicTimelineViewProps {
  photos: Photo[];
  journals: JournalEntry[];
  projects: Project[];
  onSelectPhoto: (photo: Photo) => void;
  onSelectJournal: (journal: JournalEntry) => void;
  onSelectProject: (project: Project) => void;
}

export default function PublicTimelineView({
  photos,
  journals,
  projects,
  onSelectPhoto,
  onSelectJournal,
  onSelectProject
}: PublicTimelineViewProps) {
  const eras = [
    { year: "2026", label: "The Present Era", desc: "Focus on living digital archives, Rangefinder photography, and workshop restorations." },
    { year: "2025", label: "Highland & Studio Studies", desc: "Dalat field note studies, black and white darkroom experiments, and system architectures." },
    { year: "2024", label: "Mechanical Restorations", desc: "Dismantling classic vehicles, carburetors, precision machining, and quiet writing." }
  ];

  const [selectedYear, setSelectedYear] = useState<string>("2026");

  const eraPhotos = photos.filter((p) => p.date?.includes(selectedYear));
  const eraJournals = journals.filter((j) => j.date?.includes(selectedYear));

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col gap-12 font-sans max-w-5xl mx-auto selection:bg-neutral-800 selection:text-white"
    >
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-neutral-900 pb-8">
        <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-neutral-500 flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5 text-amber-400" />
          <span>CHRONOLOGICAL ERA ARCHIVE</span>
        </span>
        <h1 className="font-serif text-3xl md:text-5xl text-neutral-100 font-normal tracking-tight">
          Life Timeline
        </h1>
        <p className="font-sans text-xs md:text-sm text-neutral-400 font-light max-w-xl leading-relaxed">
          Browsing the archive chronologically by life. Not by when a file was uploaded, but when the observation occurred in life.
        </p>

        {/* Year Selectors */}
        <div className="flex items-center gap-3 pt-4 font-mono text-xs">
          {eras.map((era) => (
            <button
              key={era.year}
              onClick={() => setSelectedYear(era.year)}
              className={`px-4 py-2 rounded-lg border transition-all cursor-pointer ${
                selectedYear === era.year
                  ? "bg-amber-950/40 border-amber-800 text-amber-200 font-bold"
                  : "bg-[#141414] border-neutral-800 text-neutral-400 hover:text-neutral-200"
              }`}
            >
              <span>{era.year} Era</span>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Era Entries */}
      <div className="flex flex-col gap-8">
        <div className="bg-[#141414] border border-neutral-800 p-6 rounded-xl font-sans">
          <span className="font-mono text-xs uppercase text-amber-400 font-bold block mb-1">
            {selectedYear} Era Overview
          </span>
          <p className="text-xs md:text-sm text-neutral-300 font-light leading-relaxed">
            {eras.find((e) => e.year === selectedYear)?.desc}
          </p>
        </div>

        {/* Timeline Items */}
        <div className="space-y-6">
          {eraPhotos.map((photo) => (
            <div
              key={photo.id}
              onClick={() => onSelectPhoto(photo)}
              className="bg-[#141414] border border-neutral-800/80 p-5 rounded-xl hover:border-neutral-700 transition-all cursor-pointer flex flex-col md:flex-row items-center gap-6 group"
            >
              <img
                src={photo.url}
                alt={photo.title}
                className="w-full md:w-48 aspect-[4/3] object-cover rounded border border-neutral-800 shrink-0"
              />
              <div className="flex flex-col gap-2 font-sans flex-1">
                <div className="flex items-center justify-between font-mono text-[10px] text-neutral-500">
                  <span>{photo.date}</span>
                  <span>{photo.location}</span>
                </div>
                <h3 className="font-serif text-xl text-neutral-100 font-medium group-hover:text-white">
                  {photo.title}
                </h3>
                <p className="text-xs text-neutral-400 font-light line-clamp-2">
                  {photo.caption}
                </p>
              </div>
            </div>
          ))}

          {eraJournals.map((j) => (
            <div
              key={j.id}
              onClick={() => onSelectJournal(j)}
              className="bg-[#141414] border border-neutral-800/80 p-6 rounded-xl hover:border-neutral-700 transition-all cursor-pointer flex flex-col gap-3 font-sans group"
            >
              <div className="flex items-center justify-between font-mono text-[10px] text-neutral-500">
                <span className="text-amber-400 uppercase font-bold">{j.category}</span>
                <span>{j.date}</span>
              </div>
              <h3 className="font-serif text-xl text-neutral-100 font-medium group-hover:text-white">
                {j.title}
              </h3>
              <p className="text-xs text-neutral-400 font-light line-clamp-3">
                {j.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
