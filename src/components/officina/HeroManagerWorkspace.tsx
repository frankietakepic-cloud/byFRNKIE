import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Image,
  Pin,
  EyeOff,
  Sliders,
  Sparkles,
  RefreshCw,
  Check,
  Layers,
  Camera,
  MapPin,
  Calendar,
  Clock,
  ArrowRight,
  Move,
  Monitor,
  Tablet,
  Smartphone,
  Plus,
  Trash2,
  List
} from "lucide-react";
import { Photo, HeroConfig, HeroSourceType, HeroDisplayMode } from "../../types";

interface HeroManagerWorkspaceProps {
  photos: Photo[];
  heroConfig: HeroConfig;
  onUpdateHeroConfig: (config: HeroConfig) => Promise<void>;
  collectionsList: string[];
  tagsList: string[];
}

export default function HeroManagerWorkspace({
  photos,
  heroConfig,
  onUpdateHeroConfig,
  collectionsList,
  tagsList
}: HeroManagerWorkspaceProps) {
  const [config, setConfig] = useState<HeroConfig>(heroConfig);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activePreviewIndex, setActivePreviewIndex] = useState(0);
  const [activeCropDevice, setActiveCropDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");

  // Derive resolved hero photos based on source selection
  const resolvedPhotos = useMemo(() => {
    let list = photos.filter((p) => p.status === "published" || !p.status);

    // Apply exclusions
    if (config.excludedPhotoIds && config.excludedPhotoIds.length > 0) {
      list = list.filter((p) => !config.excludedPhotoIds.includes(p.id));
    }

    if (config.sourceType === "pinned_images") {
      if (config.pinnedPhotoIds && config.pinnedPhotoIds.length > 0) {
        const pinnedList = config.pinnedPhotoIds
          .map((id) => photos.find((p) => p.id === id))
          .filter((p): p is Photo => !!p);
        if (pinnedList.length > 0) return pinnedList;
      }
    } else if (config.sourceType === "favorites") {
      const favs = list.filter((p) => p.favorite);
      if (favs.length > 0) list = favs;
    } else if (config.sourceType === "specific_collection" && config.sourceValue) {
      const colPhotos = list.filter((p) => (p.collections || []).includes(config.sourceValue!));
      if (colPhotos.length > 0) list = colPhotos;
    } else if (config.sourceType === "specific_tag" && config.sourceValue) {
      const tagPhotos = list.filter((p) => (p.tags || []).includes(config.sourceValue!));
      if (tagPhotos.length > 0) list = tagPhotos;
    } else if (config.sourceType === "latest_published") {
      list = [...list].sort((a, b) => (b.date || "").localeCompare(a.date || ""));
    }

    return list.length > 0 ? list : photos.slice(0, 4);
  }, [photos, config]);

  const activePreviewPhoto = resolvedPhotos[activePreviewIndex % resolvedPhotos.length] || photos[0];

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onUpdateHeroConfig(config);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err) {
      console.error("Failed to save hero config", err);
    } finally {
      setIsSaving(false);
    }
  };

  const togglePinPhoto = (id: string) => {
    const isPinned = config.pinnedPhotoIds.includes(id);
    const newPinned = isPinned
      ? config.pinnedPhotoIds.filter((pId) => pId !== id)
      : [...config.pinnedPhotoIds, id];
    
    // Remove from excluded if pinned
    const newExcluded = config.excludedPhotoIds.filter((pId) => pId !== id);

    setConfig((prev) => ({
      ...prev,
      pinnedPhotoIds: newPinned,
      excludedPhotoIds: newExcluded
    }));
  };

  const toggleExcludePhoto = (id: string) => {
    const isExcluded = config.excludedPhotoIds.includes(id);
    const newExcluded = isExcluded
      ? config.excludedPhotoIds.filter((pId) => pId !== id)
      : [...config.excludedPhotoIds, id];

    // Remove from pinned if excluded
    const newPinned = config.pinnedPhotoIds.filter((pId) => pId !== id);

    setConfig((prev) => ({
      ...prev,
      pinnedPhotoIds: newPinned,
      excludedPhotoIds: newExcluded
    }));
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-[#111111] text-neutral-100 font-sans selection:bg-neutral-800">
      {/* LEFT COLUMN: HERO CONTROLS & CURATION PANEL */}
      <div className="w-full md:w-[480px] border-r border-neutral-800/80 flex flex-col shrink-0 overflow-y-auto custom-scrollbar p-6 gap-8 bg-[#141414]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800/80">
          <div className="flex flex-col gap-1">
            <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-emerald-400 font-bold flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" />
              LIVE ARCHIVE WINDOW
            </span>
            <h1 className="font-serif text-2xl font-medium text-neutral-100">
              Hero Manager
            </h1>
            <p className="font-sans text-xs text-neutral-400 font-light">
              Curate how photographs from Galleria cycle on the public homepage.
            </p>
          </div>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-neutral-100 hover:bg-white text-neutral-950 px-4 py-2 text-xs font-mono uppercase tracking-wider font-bold transition-colors cursor-pointer rounded flex items-center gap-2 shrink-0 disabled:opacity-50"
          >
            {isSaving ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : saveSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                Saved
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>

        {/* 1. SOURCE SELECTION */}
        <div className="flex flex-col gap-3">
          <label className="font-mono text-[10px] uppercase tracking-wider text-neutral-400 font-bold flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span>1. Hero Photographs Source</span>
          </label>
          
          <select
            value={config.sourceType}
            onChange={(e) =>
              setConfig((prev) => ({
                ...prev,
                sourceType: e.target.value as HeroSourceType
              }))
            }
            className="w-full bg-[#1A1A1A] border border-neutral-800 text-xs text-neutral-200 p-2.5 rounded font-sans focus:outline-none focus:border-neutral-600 cursor-pointer"
          >
            <option value="pinned_images">Pinned Hero Photographs ({config.pinnedPhotoIds.length})</option>
            <option value="latest_published">Latest Published Archive Entries</option>
            <option value="favorites">Star Favorites Only</option>
            <option value="specific_collection">Specific Photo Collection</option>
            <option value="specific_tag">Specific Tag (#35mm, #Leica, etc.)</option>
            <option value="random">Randomized Archive Selection</option>
          </select>

          {config.sourceType === "specific_collection" && (
            <div className="flex flex-col gap-1 mt-1">
              <span className="font-mono text-[9px] uppercase text-neutral-500">Select Collection:</span>
              <select
                value={config.sourceValue || ""}
                onChange={(e) => setConfig((prev) => ({ ...prev, sourceValue: e.target.value }))}
                className="w-full bg-[#1A1A1A] border border-neutral-800 text-xs text-neutral-200 p-2 rounded focus:outline-none"
              >
                <option value="">-- Choose Collection --</option>
                {collectionsList.map((col) => (
                  <option key={col} value={col}>{col}</option>
                ))}
              </select>
            </div>
          )}

          {config.sourceType === "specific_tag" && (
            <div className="flex flex-col gap-1 mt-1">
              <span className="font-mono text-[9px] uppercase text-neutral-500">Select Tag:</span>
              <select
                value={config.sourceValue || ""}
                onChange={(e) => setConfig((prev) => ({ ...prev, sourceValue: e.target.value }))}
                className="w-full bg-[#1A1A1A] border border-neutral-800 text-xs text-neutral-200 p-2 rounded focus:outline-none"
              >
                <option value="">-- Choose Tag --</option>
                {tagsList.map((tag) => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* 2. DISPLAY MODE & TRANSITIONS */}
        <div className="flex flex-col gap-4 border-t border-neutral-800/60 pt-6">
          <label className="font-mono text-[10px] uppercase tracking-wider text-neutral-400 font-bold flex items-center gap-2">
            <Sliders className="w-3.5 h-3.5 text-emerald-400" />
            <span>2. Display Mode & Editorial Motion</span>
          </label>

          <div className="grid grid-cols-2 gap-3 font-sans text-xs">
            <div className="flex flex-col gap-1">
              <span className="font-mono text-[9px] uppercase text-neutral-500">Display Strategy</span>
              <select
                value={config.displayMode}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    displayMode: e.target.value as HeroDisplayMode
                  }))
                }
                className="bg-[#1A1A1A] border border-neutral-800 text-xs text-neutral-200 p-2 rounded focus:outline-none"
              >
                <option value="pinned_rotation">Pinned Rotation</option>
                <option value="sequential">Sequential Order</option>
                <option value="random">Randomized Order</option>
                <option value="latest_published">Latest First</option>
                <option value="static">Static Single Frame</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <span className="font-mono text-[9px] uppercase text-neutral-500">Interval Speed</span>
              <select
                value={config.transitionIntervalSeconds}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    transitionIntervalSeconds: Number(e.target.value)
                  }))
                }
                className="bg-[#1A1A1A] border border-neutral-800 text-xs text-neutral-200 p-2 rounded focus:outline-none"
              >
                <option value={8}>8 Seconds (Quiet)</option>
                <option value={12}>12 Seconds (Recommended)</option>
                <option value={20}>20 Seconds (Meditative)</option>
                <option value={30}>30 Seconds (Ultra Slow)</option>
              </select>
            </div>
          </div>

          <div className="p-3 bg-[#1A1A1A] border border-neutral-800/80 rounded font-mono text-[10px] text-neutral-400 flex flex-col gap-1">
            <span className="text-amber-400 uppercase font-bold">Editorial Principle:</span>
            <p className="font-sans text-xs text-neutral-300 leading-relaxed font-light">
              Transitions are invisible dissolves. No slideshow navigation arrows or pagination dots appear on the public homepage to preserve atmospheric calm.
            </p>
          </div>
        </div>

        {/* 3. METADATA OVERLAY CONFIGURATION */}
        <div className="flex flex-col gap-3 border-t border-neutral-800/60 pt-6">
          <div className="flex items-center justify-between">
            <label className="font-mono text-[10px] uppercase tracking-wider text-neutral-400 font-bold flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-sky-400" />
              <span>3. Subtle Metadata Overlay</span>
            </label>
            <input
              type="checkbox"
              checked={config.showMetadataOverlay}
              onChange={(e) =>
                setConfig((prev) => ({
                  ...prev,
                  showMetadataOverlay: e.target.checked
                }))
              }
              className="accent-neutral-200 cursor-pointer"
            />
          </div>

          {config.showMetadataOverlay && (
            <div className="grid grid-cols-2 gap-2 bg-[#1A1A1A] p-3 border border-neutral-800/80 rounded font-mono text-[11px] text-neutral-300">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.metadataFields.location}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      metadataFields: { ...prev.metadataFields, location: e.target.checked }
                    }))
                  }
                  className="accent-neutral-200"
                />
                <span>Location Pin</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.metadataFields.camera}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      metadataFields: { ...prev.metadataFields, camera: e.target.checked }
                    }))
                  }
                  className="accent-neutral-200"
                />
                <span>Camera EXIF</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.metadataFields.collection}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      metadataFields: { ...prev.metadataFields, collection: e.target.checked }
                    }))
                  }
                  className="accent-neutral-200"
                />
                <span>Collection Name</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.metadataFields.date}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      metadataFields: { ...prev.metadataFields, date: e.target.checked }
                    }))
                  }
                  className="accent-neutral-200"
                />
                <span>Date Captured</span>
              </label>
            </div>
          )}
        </div>

        {/* 4. PINNED & EXCLUDED CURATION MATRIX */}
        <div className="flex flex-col gap-3 border-t border-neutral-800/60 pt-6">
          <div className="flex items-center justify-between">
            <label className="font-mono text-[10px] uppercase tracking-wider text-neutral-400 font-bold flex items-center gap-2">
              <Pin className="w-3.5 h-3.5 text-amber-400" />
              <span>4. Curate Hero Rotation List ({resolvedPhotos.length} active)</span>
            </label>
          </div>

          <div className="flex flex-col gap-2 max-h-64 overflow-y-auto custom-scrollbar pr-1">
            {photos.map((photo) => {
              const isPinned = config.pinnedPhotoIds.includes(photo.id);
              const isExcluded = config.excludedPhotoIds.includes(photo.id);

              return (
                <div
                  key={photo.id}
                  className={`flex items-center justify-between p-2 rounded border transition-colors ${
                    isPinned
                      ? "bg-amber-950/20 border-amber-900/40 text-amber-200"
                      : isExcluded
                      ? "bg-rose-950/20 border-rose-900/30 text-neutral-500 opacity-60"
                      : "bg-[#1A1A1A] border-neutral-800 text-neutral-300"
                  }`}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <img
                      src={photo.url}
                      alt={photo.title}
                      className="w-10 h-7 object-cover rounded shrink-0 border border-neutral-800"
                    />
                    <div className="flex flex-col truncate">
                      <span className="font-serif text-xs truncate font-medium">{photo.title || "Untitled"}</span>
                      <span className="font-mono text-[9px] text-neutral-500 truncate">{photo.location || "Archive"}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0 font-mono text-[10px]">
                    <button
                      onClick={() => togglePinPhoto(photo.id)}
                      className={`px-2 py-1 rounded cursor-pointer transition-colors ${
                        isPinned
                          ? "bg-amber-400 text-neutral-950 font-bold"
                          : "bg-neutral-800 text-neutral-400 hover:text-white"
                      }`}
                      title="Pin to Hero rotation"
                    >
                      <Pin className="w-3 h-3 inline mr-1" />
                      {isPinned ? "Pinned" : "Pin"}
                    </button>

                    <button
                      onClick={() => toggleExcludePhoto(photo.id)}
                      className={`px-2 py-1 rounded cursor-pointer transition-colors ${
                        isExcluded
                          ? "bg-rose-900 text-white font-bold"
                          : "bg-neutral-800 text-neutral-400 hover:text-white"
                      }`}
                      title="Exclude from Hero"
                    >
                      <EyeOff className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: LIVE INTERACTIVE PREVIEW */}
      <div className="flex-1 flex flex-col p-6 md:p-10 overflow-y-auto bg-[#0d0d0d] gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-neutral-400 font-bold">
              REAL-TIME HOMEPAGE HERO SIMULATOR
            </span>
            <span className="bg-emerald-950 border border-emerald-800 text-emerald-400 px-2 py-0.5 rounded font-mono text-[9px] uppercase font-bold">
              Live Connected
            </span>
          </div>

          <div className="flex items-center gap-2 bg-[#1A1A1A] p-1 border border-neutral-800 rounded">
            <button
              onClick={() => setActiveCropDevice("desktop")}
              className={`px-2.5 py-1 font-mono text-[10px] uppercase rounded transition-colors flex items-center gap-1 cursor-pointer ${
                activeCropDevice === "desktop"
                  ? "bg-neutral-200 text-neutral-950 font-bold"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <Monitor className="w-3 h-3" />
              Desktop
            </button>
            <button
              onClick={() => setActiveCropDevice("tablet")}
              className={`px-2.5 py-1 font-mono text-[10px] uppercase rounded transition-colors flex items-center gap-1 cursor-pointer ${
                activeCropDevice === "tablet"
                  ? "bg-neutral-200 text-neutral-950 font-bold"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <Tablet className="w-3 h-3" />
              Tablet
            </button>
            <button
              onClick={() => setActiveCropDevice("mobile")}
              className={`px-2.5 py-1 font-mono text-[10px] uppercase rounded transition-colors flex items-center gap-1 cursor-pointer ${
                activeCropDevice === "mobile"
                  ? "bg-neutral-200 text-neutral-950 font-bold"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <Smartphone className="w-3 h-3" />
              Mobile
            </button>
          </div>
        </div>

        {/* HERO CANVAS SIMULATOR */}
        <div className="flex-1 flex flex-col justify-center items-center py-6">
          <div
            className={`transition-all duration-500 w-full bg-[#121212] border border-neutral-800/80 rounded-2xl p-6 md:p-8 flex flex-col gap-8 shadow-2xl relative ${
              activeCropDevice === "desktop"
                ? "max-w-5xl"
                : activeCropDevice === "tablet"
                ? "max-w-2xl"
                : "max-w-sm"
            }`}
          >
            {/* Simulated Hero Header Text */}
            <div className="flex flex-col gap-3 max-w-3xl">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-neutral-400">
                  LIVING DIGITAL ARCHIVE • FRANKIE
                </span>
              </div>
              <h1 className="font-serif text-2xl md:text-4xl text-neutral-100 font-normal tracking-tight leading-tight">
                Documenting life through photography, engineering, writing and observation.
              </h1>
            </div>

            {/* Simulated Hero Image Canvas Frame */}
            <div className="relative aspect-[16/8] w-full overflow-hidden border border-neutral-800 bg-neutral-950 rounded-xl group">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activePreviewPhoto?.id || activePreviewIndex}
                  src={activePreviewPhoto?.url || "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1600&auto=format&fit=crop"}
                  alt={activePreviewPhoto?.title || "Hero Preview"}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    objectPosition:
                      activeCropDevice === "desktop"
                        ? config.crops?.desktop || "center 40%"
                        : activeCropDevice === "tablet"
                        ? config.crops?.tablet || "center center"
                        : config.crops?.mobile || "center center"
                  }}
                  className="w-full h-full object-cover grayscale-[15%]"
                />
              </AnimatePresence>

              <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-transparent to-transparent opacity-80" />

              {/* Live Overlay Metadata */}
              {config.showMetadataOverlay && activePreviewPhoto && (
                <div className="absolute bottom-4 left-4 right-4 z-20 flex items-end justify-between font-mono text-xs">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] uppercase text-neutral-500 tracking-wider">Archive Reference</span>
                    <h2 className="font-serif text-base text-neutral-100 font-medium">
                      {activePreviewPhoto.title || "Untitled Entry"}
                    </h2>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] text-neutral-300 bg-neutral-950/80 backdrop-blur-md px-3 py-1.5 border border-neutral-800 rounded">
                    {config.metadataFields.location && activePreviewPhoto.location && (
                      <span>{activePreviewPhoto.location}</span>
                    )}
                    {config.metadataFields.camera && activePreviewPhoto.camera && (
                      <>
                        <span>•</span>
                        <span>{activePreviewPhoto.camera}</span>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Rotation Control Bar */}
            <div className="flex items-center justify-between font-mono text-xs text-neutral-400 border-t border-neutral-800/60 pt-4">
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-neutral-500 uppercase">Rotation Index:</span>
                <span className="text-neutral-200 font-bold">
                  {activePreviewIndex + 1} of {resolvedPhotos.length}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setActivePreviewIndex((prev) => (prev > 0 ? prev - 1 : resolvedPhotos.length - 1))
                  }
                  className="bg-neutral-800 hover:bg-neutral-700 text-neutral-200 px-3 py-1 rounded text-xs cursor-pointer"
                >
                  ← Prev
                </button>
                <button
                  onClick={() => setActivePreviewIndex((prev) => (prev + 1) % resolvedPhotos.length)}
                  className="bg-neutral-800 hover:bg-neutral-700 text-neutral-200 px-3 py-1 rounded text-xs cursor-pointer"
                >
                  Next →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
