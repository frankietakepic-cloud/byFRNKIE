import React from "react";
import { motion } from "motion/react";
import { ArrowRight, Wrench, Compass, Calendar } from "lucide-react";
import { Photo, JournalEntry, Project, DailyEntry } from "../../types";

interface PublicHomeViewProps {
  photos: Photo[];
  journals: JournalEntry[];
  projects: Project[];
  dailyEntries: DailyEntry[];
  setCurrentTab: (tab: string) => void;
  onSelectPhoto: (photo: Photo) => void;
  onSelectJournal: (journal: JournalEntry) => void;
  onSelectProject: (project: Project) => void;
}

export default function PublicHomeView({
  photos,
  journals,
  projects,
  dailyEntries,
  setCurrentTab,
  onSelectPhoto,
  onSelectJournal,
  onSelectProject
}: PublicHomeViewProps) {
  const publishedPhotos = photos.filter((p) => p.status === "published" || !p.status);
  const featuredPhoto = publishedPhotos[0] || photos[0];
  const secondaryPhotos = publishedPhotos.slice(1, 4);

  const featuredJournal = journals[0];
  const featuredProject = projects[0];
  const recentDaily = dailyEntries.slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col gap-24 md:gap-36 font-sans selection:bg-neutral-800 selection:text-white"
    >
      {/* SECTION 1: THE FIRST WINDOW INTO THE ARCHIVE */}
      <section className="flex flex-col gap-10 pt-4 md:pt-10">
        <div className="flex flex-col gap-6 max-w-4xl">
          <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.35em] uppercase text-neutral-500">
            <span>ARCHIVE INDEX</span>
            <span>/</span>
            <span>FRANKIE</span>
          </div>
          
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-neutral-100 font-normal tracking-tight leading-[1.12]">
            Documenting life through photography, engineering, writing and observation.
          </h1>

          <p className="font-sans text-sm md:text-base text-neutral-400 font-light max-w-2xl leading-relaxed">
            byFRNK is a quiet, continuous ledger recording light, constructed physical assemblies, field essays, and daily observations in one quiet space.
          </p>
        </div>

        {/* Panoramic Cover Window */}
        <div 
          onClick={() => featuredPhoto && onSelectPhoto(featuredPhoto)}
          className="relative aspect-[16/8] md:aspect-[21/9] w-full overflow-hidden border border-neutral-900/80 bg-neutral-950 rounded-lg group cursor-pointer"
        >
          <img
            src={featuredPhoto?.url || "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1600&auto=format&fit=crop"}
            alt={featuredPhoto?.title || "Archive Cover"}
            className="w-full h-full object-cover grayscale-[20%] group-hover:scale-[1.01] transition-transform duration-[2500ms] ease-out"
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-transparent to-transparent z-10 opacity-75" />

          {/* Minimalist Tactile Metadata Frame */}
          <div className="absolute bottom-6 left-6 right-6 z-20 flex flex-col sm:flex-row sm:items-end justify-between gap-4 font-mono text-xs">
            <div className="flex flex-col gap-1">
              <span className="text-[9px] uppercase text-neutral-500 tracking-[0.2em]">Exhibition Entry</span>
              <h2 className="font-serif text-lg md:text-xl text-neutral-100 font-medium">
                {featuredPhoto?.title || "Kyoto Morning Fog"}
              </h2>
            </div>

            <div className="flex items-center gap-3 text-[11px] text-neutral-400 bg-neutral-950/90 backdrop-blur-md px-4 py-2 border border-neutral-800/80 rounded-md">
              <span>{featuredPhoto?.location || "Kyoto"}</span>
              <span className="text-neutral-700">•</span>
              <span>{featuredPhoto?.camera || "35mm Rangefinder"}</span>
              <span className="text-neutral-100 font-medium ml-2 opacity-80 group-hover:opacity-100 transition-opacity">
                Examine →
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: EDITORIAL PAUSE & MANIFESTO */}
      <section className="max-w-4xl mx-auto w-full flex flex-col gap-12 border-t border-neutral-900/80 pt-20">
        <div className="flex flex-col gap-3">
          <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-neutral-500">
            PHILOSOPHY
          </span>
          <h2 className="font-serif text-2xl md:text-3xl text-neutral-100 font-normal">
            The Discipline of Subtraction
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
          <div className="md:col-span-7 flex flex-col gap-6">
            <blockquote className="font-serif text-lg md:text-xl text-neutral-200 italic leading-relaxed border-l border-neutral-800 pl-6">
              "When visual noise is removed, silence emerges. In that silence, we begin to observe—the grain of concrete, the geometry of light, the gravity of an idea."
            </blockquote>
            <p className="font-sans text-xs md:text-sm text-neutral-400 font-light leading-relaxed">
              byFRNK rejects aggressive growth, metrics, and engagement loops. It is an intentional digital space created to age gracefully across decades.
            </p>
          </div>

          <div className="md:col-span-5 bg-[#111111] p-6 border border-neutral-900 rounded-lg flex flex-col gap-4 font-mono text-xs">
            <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-500">
              AXES OF OBSERVATION
            </span>
            <div className="space-y-4 font-sans text-xs text-neutral-400 font-light">
              <div>
                <strong className="text-neutral-200 font-normal block font-mono text-[11px]">01 / Photography</strong>
                <span>Atmosphere, geometry, and light recorded on analog & digital tools.</span>
              </div>
              <div>
                <strong className="text-neutral-200 font-normal block font-mono text-[11px]">02 / Engineering</strong>
                <span>Workshop assemblies, restored machinery, and clean software systems.</span>
              </div>
              <div>
                <strong className="text-neutral-200 font-normal block font-mono text-[11px]">03 / Essays & Logs</strong>
                <span>Philosophical notes, field observations, and daily micro-moments.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: ESSAYS - LATEST JOURNAL */}
      <section className="flex flex-col gap-10 border-t border-neutral-900/80 pt-20">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-neutral-500">
              ESSAYS
            </span>
            <h2 className="font-serif text-2xl md:text-3xl text-neutral-100 font-normal">
              Latest Field Essay
            </h2>
          </div>
          <button
            onClick={() => setCurrentTab("journal")}
            className="font-mono text-xs uppercase tracking-widest text-neutral-400 hover:text-white flex items-center gap-2 cursor-pointer transition-colors"
          >
            <span>All Essays</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {featuredJournal && (
          <div
            onClick={() => onSelectJournal(featuredJournal)}
            className="bg-[#121212] hover:bg-[#151515] border border-neutral-900 hover:border-neutral-800 p-8 md:p-12 rounded-lg transition-all duration-300 cursor-pointer flex flex-col gap-6 group"
          >
            <div className="flex items-center justify-between font-mono text-xs text-neutral-500">
              <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-medium">
                {featuredJournal.category}
              </span>
              <div className="flex items-center gap-3">
                <span>{featuredJournal.date}</span>
                <span>•</span>
                <span>{featuredJournal.readingTime || 4} min read</span>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="font-serif text-2xl md:text-3xl text-neutral-100 font-normal group-hover:text-white transition-colors">
                {featuredJournal.title}
              </h3>
              <p className="font-sans text-xs md:text-sm text-neutral-400 font-light line-clamp-3 leading-relaxed max-w-3xl">
                {featuredJournal.content}
              </p>
            </div>

            <div className="pt-4 border-t border-neutral-900/80 font-mono text-xs text-neutral-400 group-hover:text-neutral-200 transition-colors flex items-center justify-between">
              <span>Read complete text with notes →</span>
              <span className="text-[10px] text-neutral-600 uppercase tracking-widest">Linked Entry</span>
            </div>
          </div>
        )}
      </section>

      {/* SECTION 4: WORKSHOP BLUEPRINT */}
      <section className="flex flex-col gap-10 border-t border-neutral-900/80 pt-20">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-neutral-500">
              WORKSHOP
            </span>
            <h2 className="font-serif text-2xl md:text-3xl text-neutral-100 font-normal">
              Featured Assembly
            </h2>
          </div>
          <button
            onClick={() => setCurrentTab("workshop")}
            className="font-mono text-xs uppercase tracking-widest text-neutral-400 hover:text-white flex items-center gap-2 cursor-pointer transition-colors"
          >
            <span>Notebook</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {featuredProject && (
          <div
            onClick={() => onSelectProject(featuredProject)}
            className="grid grid-cols-1 md:grid-cols-12 gap-8 bg-[#121212] border border-neutral-900 p-6 md:p-8 rounded-lg hover:border-neutral-800 transition-all cursor-pointer group"
          >
            <div className="md:col-span-5 aspect-[4/3] rounded overflow-hidden bg-neutral-950 border border-neutral-900 shrink-0">
              <img
                src={featuredProject.imageUrl || "https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?q=80&w=1200&auto=format&fit=crop"}
                alt={featuredProject.title}
                className="w-full h-full object-cover grayscale-[15%] group-hover:scale-105 transition-transform duration-700"
              />
            </div>

            <div className="md:col-span-7 flex flex-col justify-between gap-6">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 font-mono text-[10px] uppercase text-neutral-500 tracking-wider">
                  <Wrench className="w-3.5 h-3.5 text-neutral-400" />
                  <span>{featuredProject.category}</span>
                  <span>•</span>
                  <span>{featuredProject.status || "Complete"}</span>
                </div>

                <h3 className="font-serif text-2xl text-neutral-100 font-normal group-hover:text-white transition-colors">
                  {featuredProject.title}
                </h3>

                <p className="font-sans text-xs md:text-sm text-neutral-400 font-light leading-relaxed line-clamp-3">
                  {featuredProject.description}
                </p>
              </div>

              <div className="flex flex-col gap-2 pt-4 border-t border-neutral-900 font-mono text-xs">
                <span className="text-[10px] text-neutral-500 uppercase tracking-widest">Technical Process:</span>
                <p className="text-neutral-300 line-clamp-2 text-xs font-sans italic">
                  "{featuredProject.process}"
                </p>
                <span className="text-neutral-200 group-hover:underline text-xs pt-2">Examine Blueprint →</span>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* SECTION 5: EXHIBITION - ASYMMETRICAL RHYTHM */}
      <section className="flex flex-col gap-10 border-t border-neutral-900/80 pt-20">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-neutral-500">
              GALLERIA
            </span>
            <h2 className="font-serif text-2xl md:text-3xl text-neutral-100 font-normal">
              Curated Exhibition Wall
            </h2>
          </div>
          <button
            onClick={() => setCurrentTab("galleria")}
            className="font-mono text-xs uppercase tracking-widest text-neutral-400 hover:text-white flex items-center gap-2 cursor-pointer transition-colors"
          >
            <span>Open Exhibition</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Asymmetrical Pacing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
          {secondaryPhotos[0] && (
            <div
              onClick={() => onSelectPhoto(secondaryPhotos[0])}
              className="md:col-span-7 group bg-[#121212] border border-neutral-900 rounded-lg overflow-hidden hover:border-neutral-800 transition-all cursor-pointer flex flex-col"
            >
              <div className="aspect-[16/10] w-full overflow-hidden bg-neutral-950 relative">
                <img
                  src={secondaryPhotos[0].url}
                  alt={secondaryPhotos[0].title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 grayscale-[10%]"
                />
                <div className="absolute top-4 left-4 bg-neutral-950/90 backdrop-blur-md px-3 py-1 rounded font-mono text-[9px] text-neutral-400 uppercase tracking-widest">
                  {secondaryPhotos[0].location || "Kyoto"}
                </div>
              </div>

              <div className="p-6 flex flex-col gap-2 font-sans">
                <h4 className="font-serif text-lg text-neutral-100 font-normal group-hover:text-white">
                  {secondaryPhotos[0].title}
                </h4>
                <p className="text-xs text-neutral-400 font-light leading-relaxed line-clamp-2">
                  {secondaryPhotos[0].caption || secondaryPhotos[0].story}
                </p>
                <div className="flex items-center justify-between pt-3 border-t border-neutral-900 font-mono text-[10px] text-neutral-500">
                  <span>{secondaryPhotos[0].camera || "Rangefinder"}</span>
                  <span>{secondaryPhotos[0].date || "2026"}</span>
                </div>
              </div>
            </div>
          )}

          <div className="md:col-span-5 flex flex-col gap-6 justify-between">
            {secondaryPhotos.slice(1, 3).map((photo, idx) => (
              <div
                key={photo.id || idx}
                onClick={() => onSelectPhoto(photo)}
                className="group bg-[#121212] border border-neutral-900 rounded-lg p-4 hover:border-neutral-800 transition-all cursor-pointer flex gap-4 items-center"
              >
                <div className="w-28 h-24 rounded overflow-hidden bg-neutral-950 shrink-0">
                  <img
                    src={photo.url}
                    alt={photo.title}
                    className="w-full h-full object-cover grayscale-[10%] group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="flex flex-col gap-1.5 flex-1 min-w-0 font-sans">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-500">
                    {photo.location || "Archive"}
                  </span>
                  <h4 className="font-serif text-sm text-neutral-100 font-normal truncate group-hover:text-white">
                    {photo.title}
                  </h4>
                  <p className="text-[11px] text-neutral-400 font-light line-clamp-2 leading-snug">
                    {photo.caption}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6: DAILY OBSERVATION LOG */}
      <section className="flex flex-col gap-10 border-t border-neutral-900/80 pt-20">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-neutral-500">
              DAILY LOG
            </span>
            <h2 className="font-serif text-2xl md:text-3xl text-neutral-100 font-normal">
              Field Moments
            </h2>
          </div>
          <button
            onClick={() => setCurrentTab("daily")}
            className="font-mono text-xs uppercase tracking-widest text-neutral-400 hover:text-white flex items-center gap-2 cursor-pointer transition-colors"
          >
            <span>All Log Entries</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentDaily.map((entry) => (
            <div
              key={entry.id}
              onClick={() => setCurrentTab("daily")}
              className="bg-[#121212] border border-neutral-900 p-6 rounded-lg flex flex-col justify-between gap-6 hover:border-neutral-800 transition-colors cursor-pointer"
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between font-mono text-[10px] text-neutral-500">
                  <span>{entry.date} • {entry.time}</span>
                  <span className="text-neutral-400">{entry.location || "Studio"}</span>
                </div>
                <p className="font-sans text-xs text-neutral-300 font-light leading-relaxed line-clamp-4">
                  "{entry.content}"
                </p>
              </div>

              {entry.focusMood && (
                <div className="font-mono text-[9px] uppercase tracking-widest text-neutral-500 pt-3 border-t border-neutral-900">
                  Mood: {entry.focusMood}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 7: PLACES & TIMELINE PERSPECTIVES */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-neutral-900/80 pt-20">
        <div 
          onClick={() => setCurrentTab("map")}
          className="bg-[#121212] border border-neutral-900 hover:border-neutral-800 p-8 rounded-lg flex flex-col justify-between gap-6 cursor-pointer group transition-colors"
        >
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 font-mono text-[10px] text-neutral-400 uppercase tracking-widest">
              <Compass className="w-4 h-4 text-neutral-500" />
              <span>GEOGRAPHY</span>
            </div>
            <h3 className="font-serif text-2xl text-neutral-100 font-normal group-hover:text-white">
              Places as Narrative
            </h3>
            <p className="font-sans text-xs text-neutral-400 font-light leading-relaxed">
              Locations are not folders. Experience photographs, writing, and field observations connected across Kyoto, Saigon, Tokyo, and Toronto.
            </p>
          </div>
          <div className="font-mono text-xs text-neutral-300 group-hover:underline flex items-center gap-1.5">
            <span>Explore Map & Stories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        <div 
          onClick={() => setCurrentTab("timeline")}
          className="bg-[#121212] border border-neutral-900 hover:border-neutral-800 p-8 rounded-lg flex flex-col justify-between gap-6 cursor-pointer group transition-colors"
        >
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 font-mono text-[10px] text-neutral-400 uppercase tracking-widest">
              <Calendar className="w-4 h-4 text-neutral-500" />
              <span>BIOGRAPHICAL ERA</span>
            </div>
            <h3 className="font-serif text-2xl text-neutral-100 font-normal group-hover:text-white">
              Chapters of Life
            </h3>
            <p className="font-sans text-xs text-neutral-400 font-light leading-relaxed">
              A biographical timeline tracing moments, physical projects, and photography through eras rather than arbitrary upload dates.
            </p>
          </div>
          <div className="font-mono text-xs text-neutral-300 group-hover:underline flex items-center gap-1.5">
            <span>Browse Timeline</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </section>
    </motion.div>
  );
}

