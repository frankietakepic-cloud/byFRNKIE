import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, X, Camera, BookOpen, Wrench, Calendar, MapPin, Tag, ArrowRight } from "lucide-react";
import { Photo, JournalEntry, Project, DailyEntry } from "../../types";

interface PublicSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  photos: Photo[];
  journals: JournalEntry[];
  projects: Project[];
  dailyEntries: DailyEntry[];
  onSelectPhoto: (photo: Photo) => void;
  onSelectJournal: (journal: JournalEntry) => void;
  onSelectProject: (project: Project) => void;
}

export default function PublicSearchModal({
  isOpen,
  onClose,
  photos,
  journals,
  projects,
  dailyEntries,
  onSelectPhoto,
  onSelectJournal,
  onSelectProject
}: PublicSearchModalProps) {
  const [query, setQuery] = useState("");

  // Keydown shortcut ⌘K or ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery("");
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.trim().toLowerCase();

  const matchingPhotos = q
    ? photos.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.caption?.toLowerCase().includes(q) ||
          p.location?.toLowerCase().includes(q) ||
          p.camera?.toLowerCase().includes(q)
      )
    : [];

  const matchingJournals = q
    ? journals.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.content.toLowerCase().includes(q) ||
          j.category.toLowerCase().includes(q)
      )
    : [];

  const matchingProjects = q
    ? projects.filter(
        (pr) =>
          pr.title.toLowerCase().includes(q) ||
          pr.description.toLowerCase().includes(q) ||
          pr.process.toLowerCase().includes(q)
      )
    : [];

  const matchingDaily = q
    ? dailyEntries.filter(
        (d) =>
          d.content.toLowerCase().includes(q) ||
          d.location?.toLowerCase().includes(q) ||
          d.focusMood?.toLowerCase().includes(q)
      )
    : [];

  const totalResults =
    matchingPhotos.length + matchingJournals.length + matchingProjects.length + matchingDaily.length;

  return (
    <div className="fixed inset-0 z-50 bg-neutral-950/85 backdrop-blur-sm flex items-start justify-center p-4 pt-16 md:pt-24 font-sans select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="bg-[#141414] border border-neutral-800 w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
      >
        {/* Search Header Input */}
        <div className="p-4 border-b border-neutral-800 flex items-center gap-3 bg-[#181818]">
          <Search className="w-4 h-4 text-neutral-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Kyoto, Saigon, Vespa, Film, Philosophy, 2026..."
            className="w-full bg-transparent text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none font-sans"
          />
          <button
            onClick={onClose}
            className="p-1 text-neutral-500 hover:text-neutral-200 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Container */}
        <div className="p-4 md:p-6 overflow-y-auto flex flex-col gap-6 custom-scrollbar">
          {!q ? (
            <div className="flex flex-col items-center justify-center py-10 text-center gap-3 font-mono text-xs text-neutral-500">
              <span>Knowledge Graph Global Search</span>
              <p className="text-[11px] text-neutral-600 max-w-sm">
                Type any keyword to instantly search across photographs, essays, workshop projects, daily entries, locations, and cameras.
              </p>
            </div>
          ) : totalResults === 0 ? (
            <div className="py-12 text-center font-mono text-xs text-neutral-500">
              No archive entries found matching "{query}". Try "Kyoto", "Saigon", "Vespa", or "Philosophy".
            </div>
          ) : (
            <div className="flex flex-col gap-6 font-sans">
              {/* Photo Results */}
              {matchingPhotos.length > 0 && (
                <div className="flex flex-col gap-2">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-amber-400 font-bold">
                    Photographs ({matchingPhotos.length})
                  </span>
                  <div className="flex flex-col gap-2">
                    {matchingPhotos.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => {
                          onSelectPhoto(p);
                          onClose();
                        }}
                        className="p-3 bg-[#1a1a1a] hover:bg-[#222] rounded-lg border border-neutral-800 flex items-center justify-between cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <img src={p.url} alt={p.title} className="w-10 h-10 object-cover rounded border border-neutral-700" />
                          <div className="flex flex-col">
                            <span className="text-xs font-medium text-neutral-200">{p.title}</span>
                            <span className="text-[10px] font-mono text-neutral-500">{p.location || "Archive"} • {p.date || "2026"}</span>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-neutral-500" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Journal Results */}
              {matchingJournals.length > 0 && (
                <div className="flex flex-col gap-2">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-400 font-bold">
                    Essays & Field Notes ({matchingJournals.length})
                  </span>
                  <div className="flex flex-col gap-2">
                    {matchingJournals.map((j) => (
                      <div
                        key={j.id}
                        onClick={() => {
                          onSelectJournal(j);
                          onClose();
                        }}
                        className="p-3 bg-[#1a1a1a] hover:bg-[#222] rounded-lg border border-neutral-800 flex items-center justify-between cursor-pointer transition-colors"
                      >
                        <div className="flex flex-col">
                          <span className="text-xs font-medium text-neutral-200">{j.title}</span>
                          <span className="text-[10px] font-mono text-neutral-500">{j.category} • {j.date}</span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-neutral-500" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Project Results */}
              {matchingProjects.length > 0 && (
                <div className="flex flex-col gap-2">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-purple-400 font-bold">
                    Workshop Projects ({matchingProjects.length})
                  </span>
                  <div className="flex flex-col gap-2">
                    {matchingProjects.map((pr) => (
                      <div
                        key={pr.id}
                        onClick={() => {
                          onSelectProject(pr);
                          onClose();
                        }}
                        className="p-3 bg-[#1a1a1a] hover:bg-[#222] rounded-lg border border-neutral-800 flex items-center justify-between cursor-pointer transition-colors"
                      >
                        <div className="flex flex-col">
                          <span className="text-xs font-medium text-neutral-200">{pr.title}</span>
                          <span className="text-[10px] font-mono text-neutral-500">{pr.category} • {pr.status || "Complete"}</span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-neutral-500" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-[#101010] border-t border-neutral-800 flex justify-between items-center font-mono text-[10px] text-neutral-500">
          <span>Esc to close</span>
          <span>byFRNK Knowledge Graph</span>
        </div>
      </motion.div>
    </div>
  );
}
