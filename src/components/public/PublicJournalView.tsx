import React, { useState } from "react";
import { motion } from "motion/react";
import { BookOpen, Clock, Tag, ArrowLeft, ArrowRight, Share2, Layers } from "lucide-react";
import { JournalEntry, Photo, Project } from "../../types";

interface PublicJournalViewProps {
  journals: JournalEntry[];
  photos: Photo[];
  projects: Project[];
  onSelectJournal: (journal: JournalEntry) => void;
  onSelectPhoto: (photo: Photo) => void;
  onSelectProject: (project: Project) => void;
}

export default function PublicJournalView({
  journals,
  photos,
  projects,
  onSelectJournal,
  onSelectPhoto,
  onSelectProject
}: PublicJournalViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = ["all", ...Array.from(new Set(journals.map((j) => j.category)))];

  const filtered = selectedCategory === "all"
    ? journals
    : journals.filter((j) => j.category === selectedCategory);

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
        <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-neutral-500">
          FIELD NOTES & ESSAYS
        </span>
        <h1 className="font-serif text-3xl md:text-5xl text-neutral-100 font-normal tracking-tight">
          The Journal
        </h1>
        <p className="font-sans text-xs md:text-sm text-neutral-400 font-light max-w-xl leading-relaxed">
          Not a blog. A collection of essays, observations, and field notes designed like a printed magazine. Comfortable reading width, clean typography, footnotes, and connected knowledge graph nodes.
        </p>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 pt-2 flex-wrap font-mono text-[11px]">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded transition-colors uppercase cursor-pointer ${
                selectedCategory === cat
                  ? "bg-neutral-200 text-neutral-950 font-bold"
                  : "bg-[#161616] text-neutral-400 hover:text-neutral-200 border border-neutral-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Essays List */}
      <div className="flex flex-col gap-10">
        {filtered.map((entry) => {
          // Find connected photos or projects
          const connectedPhoto = photos.find((p) => p.location?.toLowerCase().includes("kyoto") || p.title.toLowerCase().includes(entry.category.toLowerCase()));
          const connectedProject = projects[0];

          return (
            <article
              key={entry.id}
              onClick={() => onSelectJournal(entry)}
              className="bg-[#141414] hover:bg-[#181818] border border-neutral-800/80 hover:border-neutral-700 p-8 md:p-10 rounded-xl transition-all duration-300 cursor-pointer flex flex-col gap-6 group"
            >
              <div className="flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-neutral-500 border-b border-neutral-800/60 pb-4">
                <div className="flex items-center gap-3">
                  <span className="bg-neutral-800 text-neutral-300 px-2.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">
                    {entry.category}
                  </span>
                  <span>{entry.date}</span>
                </div>

                <div className="flex items-center gap-2 text-neutral-400 text-[11px]">
                  <Clock className="w-3.5 h-3.5 text-neutral-500" />
                  <span>{entry.readingTime || 4} min read</span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <h2 className="font-serif text-2xl md:text-3xl text-neutral-100 font-medium group-hover:text-white transition-colors">
                  {entry.title}
                </h2>
                <div className="font-sans text-xs md:text-sm text-neutral-300 font-light leading-relaxed line-clamp-4 space-y-3">
                  {entry.content}
                </div>
              </div>

              {/* Connected Knowledge Graph Bar */}
              <div className="pt-4 border-t border-neutral-800/80 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
                <div className="flex items-center gap-3 text-[10px] text-neutral-500">
                  <Layers className="w-3.5 h-3.5 text-amber-400" />
                  <span>References:</span>
                  {connectedPhoto && (
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectPhoto(connectedPhoto);
                      }}
                      className="text-neutral-300 hover:text-white underline cursor-pointer"
                    >
                      Photo: {connectedPhoto.title}
                    </span>
                  )}
                  {connectedProject && (
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectProject(connectedProject);
                      }}
                      className="text-neutral-300 hover:text-white underline cursor-pointer"
                    >
                      Project: {connectedProject.title}
                    </span>
                  )}
                </div>

                <span className="text-amber-400 group-hover:underline text-xs">Read full essay →</span>
              </div>
            </article>
          );
        })}
      </div>
    </motion.div>
  );
}
