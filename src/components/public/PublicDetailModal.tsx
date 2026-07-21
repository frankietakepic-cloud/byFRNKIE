import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, MapPin, Calendar, Camera, Clock, Wrench, Layers, Share2, Globe, ArrowUpRight, BookOpen } from "lucide-react";
import { Photo, JournalEntry, Project } from "../../types";

interface PublicDetailModalProps {
  photo?: Photo | null;
  journal?: JournalEntry | null;
  project?: Project | null;
  onClose: () => void;
  onSelectPhoto: (photo: Photo) => void;
  onSelectJournal: (journal: JournalEntry) => void;
  onSelectProject: (project: Project) => void;
  allPhotos: Photo[];
  allJournals: JournalEntry[];
  allProjects: Project[];
}

export default function PublicDetailModal({
  photo,
  journal,
  project,
  onClose,
  onSelectPhoto,
  onSelectJournal,
  onSelectProject,
  allPhotos,
  allJournals,
  allProjects
}: PublicDetailModalProps) {
  if (!photo && !journal && !project) return null;

  return (
    <div className="fixed inset-0 z-50 bg-neutral-950/85 backdrop-blur-md flex items-center justify-center p-4 md:p-8 font-sans selection:bg-neutral-800 selection:text-white">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        className="bg-[#141414] border border-neutral-800 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Modal Top Bar */}
        <div className="p-4 bg-[#181818] border-b border-neutral-800 flex items-center justify-between shrink-0 font-mono text-xs">
          <div className="flex items-center gap-2 text-neutral-400">
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span className="uppercase text-[10px] tracking-wider">
              {photo ? "Ledger Photo Entry" : journal ? "Field Essay Entry" : "Workshop Blueprint"}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-neutral-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Main Scrollable Content */}
        <div className="p-6 md:p-10 overflow-y-auto flex flex-col gap-8 custom-scrollbar">
          {/* DETAIL TYPE 1: PHOTO */}
          {photo && (
            <div className="flex flex-col gap-8">
              <div className="aspect-[16/9] w-full rounded-xl overflow-hidden bg-neutral-950 border border-neutral-800 relative">
                <img src={photo.url} alt={photo.title} className="w-full h-full object-cover" />
              </div>

              <div className="flex flex-col gap-4 font-sans">
                <div className="flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-neutral-500 border-b border-neutral-800/80 pb-3">
                  <div className="flex items-center gap-2 text-amber-400 font-bold">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{photo.location || "Kyoto, Japan"}</span>
                  </div>
                  <span>{photo.date || "2026"}</span>
                </div>

                <h2 className="font-serif text-3xl text-neutral-100 font-medium">
                  {photo.title}
                </h2>

                <p className="text-sm md:text-base text-neutral-300 font-light leading-relaxed">
                  {photo.caption || photo.story}
                </p>

                {/* Technical Parameters */}
                <div className="bg-[#101010] p-5 rounded-xl border border-neutral-800 grid grid-cols-2 md:grid-cols-4 gap-4 font-mono text-xs text-neutral-400 mt-2">
                  <div>
                    <span className="text-[9px] uppercase text-neutral-500 block">Camera</span>
                    <span className="text-neutral-200">{photo.camera || "Rangefinder"}</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase text-neutral-500 block">Lens</span>
                    <span className="text-neutral-200">{photo.lens || "35mm Prime"}</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase text-neutral-500 block">Aperture</span>
                    <span className="text-neutral-200">{photo.aperture || "f/2.8"}</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase text-neutral-500 block">ISO / Film</span>
                    <span className="text-neutral-200">ISO {photo.iso || "400"}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* DETAIL TYPE 2: JOURNAL */}
          {journal && (
            <div className="flex flex-col gap-6 max-w-2xl mx-auto w-full">
              <div className="flex items-center justify-between font-mono text-xs text-neutral-500 border-b border-neutral-800/80 pb-3">
                <span className="bg-amber-950/40 border border-amber-900/40 text-amber-300 px-2.5 py-0.5 rounded text-[10px] uppercase font-bold">
                  {journal.category}
                </span>
                <div className="flex items-center gap-3">
                  <span>{journal.date}</span>
                  <span>•</span>
                  <span>{journal.readingTime || 4} min read</span>
                </div>
              </div>

              <h2 className="font-serif text-3xl md:text-4xl text-neutral-100 font-medium leading-tight">
                {journal.title}
              </h2>

              <div className="font-sans text-sm md:text-base text-neutral-200 font-light leading-relaxed space-y-4 pt-2 whitespace-pre-line">
                {journal.content}
              </div>

              {/* Footnotes & Citation */}
              <div className="bg-[#101010] p-4 rounded-lg border border-neutral-800 font-mono text-xs text-neutral-400 mt-6 space-y-1">
                <span className="text-[9px] uppercase text-neutral-500 font-bold block">Archive Footnote:</span>
                <p className="text-[11px] text-neutral-300">
                  Published in byFRNK Field Journal. Connected to Saigon & Kyoto observation logs.
                </p>
              </div>
            </div>
          )}

          {/* DETAIL TYPE 3: PROJECT */}
          {project && (
            <div className="flex flex-col gap-8 font-sans">
              <div className="flex items-center justify-between font-mono text-xs text-neutral-500 border-b border-neutral-800/80 pb-3">
                <span className="bg-purple-950/40 border border-purple-900/40 text-purple-300 px-2.5 py-0.5 rounded text-[10px] uppercase font-bold">
                  {project.category}
                </span>
                <span className="text-emerald-400 font-bold">{project.status || "Complete"}</span>
              </div>

              <h2 className="font-serif text-3xl text-neutral-100 font-medium">
                {project.title}
              </h2>

              <p className="text-sm md:text-base text-neutral-300 font-light leading-relaxed">
                {project.description}
              </p>

              {/* Full Breakdown Sections */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans text-xs">
                <div className="bg-[#101010] p-5 rounded-xl border border-neutral-800 flex flex-col gap-2">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-amber-400 font-bold">
                    Core Purpose & Context
                  </span>
                  <p className="text-neutral-300 leading-relaxed font-light">
                    {project.purpose || project.context || "Restoring physical & digital reliability."}
                  </p>
                </div>

                <div className="bg-[#101010] p-5 rounded-xl border border-neutral-800 flex flex-col gap-2">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-400 font-bold">
                    Outcome & Reliability
                  </span>
                  <p className="text-neutral-300 leading-relaxed font-light">
                    {project.outcome}
                  </p>
                </div>

                <div className="bg-[#101010] p-5 rounded-xl border border-neutral-800 flex flex-col gap-2 md:col-span-2">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-purple-400 font-bold">
                    Full Engineering Process & Failures
                  </span>
                  <p className="text-neutral-300 leading-relaxed font-light">
                    {project.process}
                  </p>
                  {project.failures && (
                    <p className="text-rose-300 leading-relaxed font-light pt-2 border-t border-neutral-800/80 mt-2">
                      <strong className="font-mono text-[10px] text-rose-400 uppercase block">Failure Encountered:</strong>
                      {project.failures}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Interconnected Knowledge Graph Recommendations Bar */}
          <div className="pt-6 border-t border-neutral-800/80 flex flex-col gap-3 font-mono text-xs">
            <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold">
              Connected Knowledge Graph Nodes:
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {allPhotos.slice(0, 1).map((p) => (
                <div
                  key={p.id}
                  onClick={() => onSelectPhoto(p)}
                  className="p-3 bg-[#181818] hover:bg-[#202020] rounded-lg border border-neutral-800 flex items-center justify-between cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Camera className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-neutral-300 text-xs font-sans">{p.title}</span>
                  </div>
                  <span className="text-[10px] text-amber-400 font-mono">Examine →</span>
                </div>
              ))}

              {allJournals.slice(0, 1).map((j) => (
                <div
                  key={j.id}
                  onClick={() => onSelectJournal(j)}
                  className="p-3 bg-[#181818] hover:bg-[#202020] rounded-lg border border-neutral-800 flex items-center justify-between cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-neutral-300 text-xs font-sans">{j.title}</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono">Read Essay →</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
