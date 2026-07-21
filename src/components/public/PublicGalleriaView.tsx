import React, { useState } from "react";
import { motion } from "motion/react";
import { Camera, MapPin, Calendar, Layers, Eye, Sliders, Maximize2 } from "lucide-react";
import { Photo, JournalEntry, Project } from "../../types";

interface PublicGalleriaViewProps {
  photos: Photo[];
  journals: JournalEntry[];
  projects: Project[];
  onSelectPhoto: (photo: Photo) => void;
  onSelectJournal: (journal: JournalEntry) => void;
  onSelectProject: (project: Project) => void;
}

export default function PublicGalleriaView({
  photos,
  journals,
  projects,
  onSelectPhoto,
  onSelectJournal,
  onSelectProject
}: PublicGalleriaViewProps) {
  const published = photos.filter((p) => p.status === "published" || !p.status);
  const [activeCollection, setActiveCollection] = useState<string>("all");

  const collections = ["all", ...Array.from(new Set(published.flatMap((p) => p.collections || [])))];

  const filteredPhotos = activeCollection === "all"
    ? published
    : published.filter((p) => p.collections?.includes(activeCollection));

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col gap-12 font-sans max-w-6xl mx-auto selection:bg-neutral-800 selection:text-white"
    >
      {/* Galleria Header */}
      <div className="flex flex-col gap-4 border-b border-neutral-900 pb-8">
        <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-neutral-500">
          CURATED EXHIBITION
        </span>
        <h1 className="font-serif text-3xl md:text-5xl text-neutral-100 font-normal tracking-tight">
          The Galleria
        </h1>
        <p className="font-sans text-xs md:text-sm text-neutral-400 font-light max-w-xl leading-relaxed">
          Galleria is walking through a quiet exhibition. Photography supports the archive. Each photograph carries location, date, camera parameters, and observations connected to our journals and projects.
        </p>

        {/* Collections filter */}
        <div className="flex items-center gap-2 pt-2 flex-wrap font-mono text-[11px]">
          {collections.map((col) => (
            <button
              key={col}
              onClick={() => setActiveCollection(col)}
              className={`px-3 py-1 rounded transition-colors uppercase cursor-pointer ${
                activeCollection === col
                  ? "bg-neutral-200 text-neutral-950 font-bold"
                  : "bg-[#161616] text-neutral-400 hover:text-neutral-200 border border-neutral-800"
              }`}
            >
              {col === "all" ? "All Exhibitions" : col}
            </button>
          ))}
        </div>
      </div>

      {/* Exhibition Grid - Varied Scales and Rhythm */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {filteredPhotos.map((photo, idx) => {
          // Dynamic layout scale for editorial rhythm:
          // 0th photo = Hero 12 cols
          // 1st & 2nd = 6 cols
          // 3rd, 4th, 5th = 4 cols
          const isHero = idx % 5 === 0;
          const isHalf = idx % 5 === 1 || idx % 5 === 2;
          const colSpan = isHero ? "md:col-span-12" : isHalf ? "md:col-span-6" : "md:col-span-4";

          return (
            <div
              key={photo.id}
              onClick={() => onSelectPhoto(photo)}
              className={`${colSpan} bg-[#141414] border border-neutral-800/80 hover:border-neutral-700 rounded-xl overflow-hidden transition-all duration-300 cursor-pointer flex flex-col group`}
            >
              <div className={`w-full overflow-hidden bg-neutral-950 relative ${isHero ? "aspect-[16/8]" : "aspect-[4/3]"}`}>
                <img
                  src={photo.url}
                  alt={photo.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 grayscale-[10%]"
                />
                
                {/* Location Badge */}
                <div className="absolute top-3 left-3 bg-neutral-950/80 backdrop-blur-md border border-neutral-800 px-2.5 py-1 rounded font-mono text-[10px] text-neutral-300 flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-amber-400" />
                  <span>{photo.location || "Archive Studio"}</span>
                </div>

                <div className="absolute top-3 right-3 bg-neutral-950/80 backdrop-blur-md border border-neutral-800 p-1.5 rounded text-neutral-400 group-hover:text-white transition-colors">
                  <Maximize2 className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Observation & Metadata Panel */}
              <div className="p-5 md:p-6 flex flex-col justify-between flex-1 gap-4 font-sans">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between font-mono text-[10px] text-neutral-500">
                    <span>{photo.date || "2026"}</span>
                    <span>{photo.camera || "Rangefinder"}</span>
                  </div>

                  <h3 className="font-serif text-xl md:text-2xl text-neutral-100 font-medium group-hover:text-white transition-colors">
                    {photo.title}
                  </h3>

                  <p className="text-xs md:text-sm text-neutral-300 font-light leading-relaxed">
                    {photo.caption || photo.story}
                  </p>
                </div>

                {/* EXIF Parameters & Knowledge Graph */}
                <div className="pt-3 border-t border-neutral-800/80 flex flex-wrap items-center justify-between gap-2 font-mono text-[10px] text-neutral-500">
                  <div className="flex items-center gap-2">
                    <span>{photo.lens || "35mm"}</span>
                    <span>•</span>
                    <span>{photo.aperture || "f/2.8"}</span>
                    <span>•</span>
                    <span>ISO {photo.iso || "400"}</span>
                  </div>

                  <span className="text-amber-400 group-hover:underline">Examine Full Entry →</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
