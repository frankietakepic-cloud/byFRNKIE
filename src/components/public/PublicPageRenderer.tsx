import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowRight,
  BookOpen,
  Wrench,
  Camera,
  Compass,
  Calendar,
  Layers,
  Sparkles,
  Quote as QuoteIcon
} from "lucide-react";
import {
  PageLayout,
  PageComponent,
  HeroConfig,
  Photo,
  JournalEntry,
  Project,
  DailyEntry
} from "../../types";

interface PublicPageRendererProps {
  page: PageLayout;
  heroConfig: HeroConfig;
  photos: Photo[];
  journals: JournalEntry[];
  projects: Project[];
  dailyEntries: DailyEntry[];
  setCurrentTab: (tab: string) => void;
  onSelectPhoto: (photo: Photo) => void;
  onSelectJournal: (journal: JournalEntry) => void;
  onSelectProject: (project: Project) => void;
}

export default function PublicPageRenderer({
  page,
  heroConfig,
  photos,
  journals,
  projects,
  dailyEntries,
  setCurrentTab,
  onSelectPhoto,
  onSelectJournal,
  onSelectProject
}: PublicPageRendererProps) {
  // Live Hero cycling state
  const [heroIndex, setHeroIndex] = useState(0);

  // Resolved hero photographs list
  const heroPhotos = React.useMemo(() => {
    let list = photos.filter((p) => p.status === "published" || !p.status);
    if (heroConfig.excludedPhotoIds?.length) {
      list = list.filter((p) => !heroConfig.excludedPhotoIds.includes(p.id));
    }

    if (heroConfig.sourceType === "pinned_images" && heroConfig.pinnedPhotoIds?.length) {
      const pinnedList = heroConfig.pinnedPhotoIds
        .map((id) => photos.find((p) => p.id === id))
        .filter((p): p is Photo => !!p);
      if (pinnedList.length > 0) return pinnedList;
    } else if (heroConfig.sourceType === "favorites") {
      const favs = list.filter((p) => p.favorite);
      if (favs.length > 0) list = favs;
    }

    return list.length > 0 ? list : photos;
  }, [photos, heroConfig]);

  // Slow invisible transition timer for Hero
  useEffect(() => {
    if (heroPhotos.length <= 1 || heroConfig.displayMode === "static") return;
    const intervalMs = (heroConfig.transitionIntervalSeconds || 12) * 1000;
    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroPhotos.length);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [heroPhotos, heroConfig]);

  const currentHeroPhoto = heroPhotos[heroIndex % heroPhotos.length] || photos[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col gap-16 md:gap-28 font-sans selection:bg-neutral-800 selection:text-white"
    >
      {page.components.map((comp) => {
        // Component 1: HERO
        if (comp.type === "hero") {
          return (
            <section key={comp.id} className="flex flex-col gap-8 pt-2 md:pt-6">
              <div className="flex flex-col gap-4 max-w-4xl">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-neutral-400">
                    {comp.subtitle || "LIVING DIGITAL ARCHIVE • FRANKIE"}
                  </span>
                </div>

                <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-neutral-100 font-normal tracking-tight leading-[1.15]">
                  {comp.title || "Documenting life through photography, engineering, writing and observation."}
                </h1>

                {comp.content && (
                  <p className="font-sans text-sm md:text-base text-neutral-400 font-light max-w-2xl leading-relaxed mt-2">
                    {comp.content}
                  </p>
                )}
              </div>

              {/* Panoramic Live Cover Art Frame */}
              <div className="relative aspect-[16/7] md:aspect-[21/9] w-full overflow-hidden border border-neutral-900 bg-neutral-950 rounded-xl group shadow-2xl">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentHeroPhoto?.id || heroIndex}
                    src={currentHeroPhoto?.url}
                    alt={currentHeroPhoto?.title || "Hero Photography"}
                    initial={{ opacity: 0.2 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0.2 }}
                    transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                    style={{ objectPosition: heroConfig.crops?.desktop || "center 40%" }}
                    className="w-full h-full object-cover grayscale-[15%] group-hover:scale-[1.01] transition-transform duration-[3000ms]"
                  />
                </AnimatePresence>

                <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-transparent to-transparent z-10 opacity-80" />

                {/* Metadata Overlay */}
                {heroConfig.showMetadataOverlay && currentHeroPhoto && (
                  <div className="absolute bottom-6 left-6 right-6 z-20 flex flex-col sm:flex-row sm:items-end justify-between gap-4 font-mono text-xs">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] uppercase text-neutral-500 tracking-wider">Archive Ledger Entry</span>
                      <h2 className="font-serif text-lg md:text-xl text-neutral-100 font-medium">
                        {currentHeroPhoto.title}
                      </h2>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-neutral-400 bg-neutral-950/80 backdrop-blur-md px-3.5 py-2 border border-neutral-800 rounded">
                      {heroConfig.metadataFields.location && (
                        <span>{currentHeroPhoto.location || "Archive"}</span>
                      )}
                      {heroConfig.metadataFields.camera && currentHeroPhoto.camera && (
                        <>
                          <span>•</span>
                          <span>{currentHeroPhoto.camera}</span>
                        </>
                      )}
                      <button
                        onClick={() => onSelectPhoto(currentHeroPhoto)}
                        className="text-neutral-100 hover:text-white underline cursor-pointer ml-1 font-bold"
                      >
                        Examine Entry
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </section>
          );
        }

        // Component 2: EDITORIAL TEXT
        if (comp.type === "editorial_text") {
          return (
            <section key={comp.id} className="max-w-3xl mx-auto w-full flex flex-col gap-4 border-t border-neutral-900 pt-12">
              {comp.subtitle && (
                <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-neutral-500">
                  {comp.subtitle}
                </span>
              )}
              {comp.title && (
                <h2 className="font-serif text-2xl md:text-3xl text-neutral-100 font-medium">
                  {comp.title}
                </h2>
              )}
              {comp.content && (
                <p className="font-sans text-sm md:text-base text-neutral-300 font-light leading-relaxed">
                  {comp.content}
                </p>
              )}
            </section>
          );
        }

        // Component 3: MANIFESTO
        if (comp.type === "manifesto") {
          return (
            <section key={comp.id} className="max-w-4xl mx-auto w-full flex flex-col gap-8 border-t border-neutral-900 pt-16">
              <div className="flex flex-col gap-2">
                <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-neutral-500">
                  {comp.subtitle || "PHILOSOPHY"}
                </span>
                <h2 className="font-serif text-2xl md:text-3xl text-neutral-100 font-medium">
                  {comp.title}
                </h2>
              </div>

              <div className="p-8 bg-[#141414] border border-neutral-800 rounded-xl flex flex-col gap-4">
                <p className="font-serif text-base md:text-lg text-neutral-200 italic leading-relaxed">
                  "{comp.content}"
                </p>
                {comp.author && (
                  <span className="font-mono text-xs text-neutral-500 text-right">— {comp.author}</span>
                )}
              </div>
            </section>
          );
        }

        // Component 4: FEATURED JOURNAL
        if (comp.type === "featured_journal") {
          const featJournal = journals.find((j) => comp.selectedJournalIds?.includes(j.id)) || journals[0];
          if (!featJournal) return null;

          return (
            <section key={comp.id} className="flex flex-col gap-8 border-t border-neutral-900 pt-16">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-neutral-500">
                    {comp.subtitle || "THOUGHTS & ESSAYS"}
                  </span>
                  <h2 className="font-serif text-2xl md:text-3xl text-neutral-100 font-medium">
                    {comp.title || "Latest Essay"}
                  </h2>
                </div>
                <button
                  onClick={() => setCurrentTab("journal")}
                  className="font-mono text-xs uppercase tracking-wider text-neutral-400 hover:text-white flex items-center gap-1.5 cursor-pointer"
                >
                  <span>View All Essays</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div
                onClick={() => onSelectJournal(featJournal)}
                className="bg-[#141414] hover:bg-[#181818] border border-neutral-800 hover:border-neutral-700 p-8 md:p-10 rounded-xl transition-all duration-300 cursor-pointer flex flex-col gap-6 group"
              >
                <div className="flex items-center justify-between font-mono text-xs text-neutral-500">
                  <span className="bg-neutral-800 text-neutral-300 px-2.5 py-1 rounded-sm text-[10px] uppercase tracking-wider font-bold">
                    {featJournal.category}
                  </span>
                  <span>{featJournal.date}</span>
                </div>

                <div className="flex flex-col gap-3">
                  <h3 className="font-serif text-2xl md:text-3xl text-neutral-100 font-medium group-hover:text-white transition-colors">
                    {featJournal.title}
                  </h3>
                  <p className="font-sans text-xs md:text-sm text-neutral-400 font-light line-clamp-3 leading-relaxed">
                    {featJournal.content}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-neutral-800/80 font-mono text-xs text-neutral-400">
                  <span className="text-amber-400/90 group-hover:underline">Read full essay with footnotes →</span>
                </div>
              </div>
            </section>
          );
        }

        // Component 5: FEATURED PROJECT
        if (comp.type === "featured_project") {
          const featProj = projects.find((p) => comp.selectedProjectIds?.includes(p.id)) || projects[0];
          if (!featProj) return null;

          return (
            <section key={comp.id} className="flex flex-col gap-8 border-t border-neutral-900 pt-16">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-neutral-500">
                    {comp.subtitle || "WORKSHOP"}
                  </span>
                  <h2 className="font-serif text-2xl md:text-3xl text-neutral-100 font-medium">
                    {comp.title || "Featured Project"}
                  </h2>
                </div>
                <button
                  onClick={() => setCurrentTab("workshop")}
                  className="font-mono text-xs uppercase tracking-wider text-neutral-400 hover:text-white flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Engineer Notebook</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div
                onClick={() => onSelectProject(featProj)}
                className="grid grid-cols-1 md:grid-cols-12 gap-8 bg-[#141414] border border-neutral-800 p-6 md:p-8 rounded-xl hover:border-neutral-700 transition-all cursor-pointer group"
              >
                <div className="md:col-span-5 aspect-[4/3] rounded-lg overflow-hidden bg-neutral-900 border border-neutral-800 shrink-0">
                  <img
                    src={featProj.imageUrl || photos[1]?.url}
                    alt={featProj.title}
                    className="w-full h-full object-cover grayscale-[15%] group-hover:scale-105 transition-transform duration-700"
                  />
                </div>

                <div className="md:col-span-7 flex flex-col justify-between gap-4">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2 font-mono text-[10px] uppercase text-neutral-500">
                      <Wrench className="w-3.5 h-3.5 text-amber-400" />
                      <span>{featProj.category}</span>
                    </div>

                    <h3 className="font-serif text-2xl text-neutral-100 font-medium group-hover:text-white transition-colors">
                      {featProj.title}
                    </h3>

                    <p className="font-sans text-xs md:text-sm text-neutral-400 font-light leading-relaxed line-clamp-3">
                      {featProj.description}
                    </p>
                  </div>

                  <span className="text-amber-400 group-hover:underline font-mono text-xs pt-1">
                    Examine Blueprint & Lessons Learned →
                  </span>
                </div>
              </div>
            </section>
          );
        }

        // Component 6: GALLERY
        if (comp.type === "gallery") {
          return (
            <section key={comp.id} className="flex flex-col gap-8 border-t border-neutral-900 pt-16">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-neutral-500">
                    {comp.subtitle || "PHOTOGRAPHY"}
                  </span>
                  <h2 className="font-serif text-2xl md:text-3xl text-neutral-100 font-medium">
                    {comp.title || "Curated Exhibition"}
                  </h2>
                </div>
                <button
                  onClick={() => setCurrentTab("galleria")}
                  className="font-mono text-xs uppercase tracking-wider text-neutral-400 hover:text-white flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Open Galleria</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {photos.slice(0, 3).map((photo) => (
                  <div
                    key={photo.id}
                    onClick={() => onSelectPhoto(photo)}
                    className="group bg-[#141414] border border-neutral-800 rounded-xl overflow-hidden hover:border-neutral-700 transition-all cursor-pointer flex flex-col"
                  >
                    <div className="aspect-[4/3] w-full overflow-hidden bg-neutral-900 relative">
                      <img
                        src={photo.url}
                        alt={photo.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 grayscale-[10%]"
                      />
                    </div>
                    <div className="p-4 flex flex-col gap-2">
                      <h4 className="font-serif text-base text-neutral-100 font-medium">{photo.title}</h4>
                      <p className="text-xs text-neutral-400 line-clamp-2">{photo.caption}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        }

        // Fallback for other components
        return (
          <section key={comp.id} className="border-t border-neutral-900 pt-12 flex flex-col gap-2">
            <span className="font-mono text-[10px] uppercase text-neutral-500">{comp.subtitle || comp.type}</span>
            <h3 className="font-serif text-2xl text-neutral-100">{comp.title}</h3>
            {comp.content && <p className="font-sans text-xs text-neutral-400">{comp.content}</p>}
          </section>
        );
      })}
    </motion.div>
  );
}
