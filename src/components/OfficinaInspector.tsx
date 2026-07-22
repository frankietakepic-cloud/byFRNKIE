import React, { useState, useEffect } from "react";
import { Photo } from "../types";
import {
  X,
  Camera,
  Aperture,
  Clock,
  MapPin,
  Tag,
  FolderOpen,
  Star,
  Flag,
  Globe,
  FileText,
  Bot,
  Sparkles,
  Check,
  Trash2,
  ExternalLink,
  ChevronRight,
  Sliders
} from "lucide-react";

interface OfficinaInspectorProps {
  photo: Photo | null;
  onClose: () => void;
  onUpdatePhoto: (updatedPhoto: Photo) => void;
  onDeletePhoto: (photoId: string) => void;
  onOpenPublishModal: (photo: Photo) => void;
  onTriggerAiSuggest: (photo: Photo, action: string) => Promise<any>;
  allCollections: string[];
}

export default function OfficinaInspector({
  photo,
  onClose,
  onUpdatePhoto,
  onDeletePhoto,
  onOpenPublishModal,
  onTriggerAiSuggest,
  allCollections
}: OfficinaInspectorProps) {
  if (!photo) {
    return (
      <aside className="hidden lg:flex w-80 bg-[#141414] border-l border-neutral-800/80 flex-col items-center justify-center p-6 text-center text-neutral-500 font-sans text-xs h-[calc(100vh-3.5rem)] shrink-0 select-none">
        <Sliders className="w-8 h-8 stroke-[1.2] mb-2 text-neutral-600" />
        <p className="font-serif text-sm text-neutral-400">No item selected.</p>
        <p className="text-[11px] text-neutral-600 mt-1">
          Select a photograph from the Library to inspect EXIF metadata and editorial controls.
        </p>
      </aside>
    );
  }

  const [title, setTitle] = useState(photo.title || "");
  const [caption, setCaption] = useState(photo.caption || "");
  const [story, setStory] = useState(photo.story || "");
  const [location, setLocation] = useState(photo.location || "");
  const [country, setCountry] = useState(photo.country || "");
  const [camera, setCamera] = useState(photo.camera || "");
  const [lens, setLens] = useState(photo.lens || "");
  const [focalLength, setFocalLength] = useState(photo.focalLength || "");
  const [aperture, setAperture] = useState(photo.aperture || "");
  const [shutterSpeed, setShutterSpeed] = useState(photo.shutterSpeed || "");
  const [iso, setIso] = useState(photo.iso || "");
  const [date, setDate] = useState(photo.date || "");
  const [time, setTime] = useState(photo.time || "");
  const [status, setStatus] = useState<"draft" | "published" | "archived" | "trash">(photo.status || "draft");
  const [rating, setRating] = useState<number>(photo.rating || 0);
  const [flag, setFlag] = useState<"pick" | "reject" | "none">(photo.flag || "none");
  const [colorLabel, setColorLabel] = useState<string>(photo.colorLabel || "none");
  const [favorite, setFavorite] = useState<boolean>(!!photo.favorite);
  const [collectionsInput, setCollectionsInput] = useState((photo.collections || []).join(", "));
  const [tagsInput, setTagsInput] = useState((photo.tags || []).join(", "));
  const [slug, setSlug] = useState(photo.slug || "");

  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiMessage, setAiMessage] = useState<string | null>(null);

  // Sync state when photo prop changes
  useEffect(() => {
    setTitle(photo.title || "");
    setCaption(photo.caption || "");
    setStory(photo.story || "");
    setLocation(photo.location || "");
    setCountry(photo.country || "");
    setCamera(photo.camera || "");
    setLens(photo.lens || "");
    setFocalLength(photo.focalLength || "");
    setAperture(photo.aperture || "");
    setShutterSpeed(photo.shutterSpeed || "");
    setIso(photo.iso || "");
    setDate(photo.date || "");
    setTime(photo.time || "");
    setStatus(photo.status || "draft");
    setRating(photo.rating || 0);
    setFlag(photo.flag || "none");
    setColorLabel(photo.colorLabel || "none");
    setFavorite(!!photo.favorite);
    setCollectionsInput((photo.collections || []).join(", "));
    setTagsInput((photo.tags || []).join(", "));
    setSlug(photo.slug || "");
    setAiMessage(null);
  }, [photo.id]);

  const handleSave = () => {
    const updatedCollections = collectionsInput
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean);

    const updatedTags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)
      .map((t) => (t.startsWith("#") ? t : `#${t}`));

    const updated: Photo = {
      ...photo,
      title,
      caption,
      story,
      location,
      country,
      camera,
      lens,
      focalLength,
      aperture,
      shutterSpeed,
      iso,
      date,
      time,
      status,
      rating,
      flag,
      colorLabel: colorLabel as any,
      favorite,
      collections: updatedCollections,
      tags: updatedTags,
      slug: slug || `photo-${(title || "untitled").toLowerCase().replace(/[^a-z0-0]+/g, "-")}`
    };

    onUpdatePhoto(updated);
  };

  const handleAiSuggestMetadata = async () => {
    setIsAiLoading(true);
    setAiMessage(null);
    try {
      const res = await onTriggerAiSuggest(photo, "suggest_metadata");
      if (res && res.result) {
        setAiMessage("AI suggestions generated successfully.");
        // If JSON response
        try {
          const parsed = JSON.parse(res.result);
          if (parsed.title) setTitle(parsed.title);
          if (parsed.story) setStory(parsed.story);
          if (parsed.tags) setTagsInput(parsed.tags.join(", "));
          if (parsed.collections) setCollectionsInput(parsed.collections.join(", "));
        } catch (e) {
          // Plain text suggestion
          setStory((prev) => (prev ? `${prev}\n\n[AI Suggestion]: ${res.result}` : res.result));
        }
      }
    } catch (err) {
      setAiMessage("Failed to invoke AI Assistant.");
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-neutral-950/80 backdrop-blur-xs flex flex-col justify-end lg:bg-transparent lg:static lg:z-auto">
      <aside className="w-full lg:w-88 bg-[#141414] border-t lg:border-t-0 border-l-0 lg:border-l border-neutral-800/80 flex flex-col shrink-0 select-none font-sans text-xs max-h-[85vh] lg:max-h-none h-[85vh] lg:h-[calc(100vh-3.5rem)] overflow-y-auto custom-scrollbar rounded-t-2xl lg:rounded-none shadow-2xl lg:shadow-none">
        {/* Mobile Drag Handle */}
        <div className="lg:hidden w-full flex items-center justify-center pt-2.5 pb-1 bg-[#181818] rounded-t-2xl">
          <div className="w-12 h-1 bg-neutral-700 rounded-full" />
        </div>
      {/* Inspector Header */}
      <div className="p-3.5 border-b border-neutral-800/80 bg-[#181818] flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-400 font-bold bg-neutral-900 border border-neutral-800 px-2 py-0.5 rounded-xs">
            Inspector
          </span>
          <span className="font-mono text-[10px] text-neutral-500 truncate max-w-36">
            {photo.id}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenPublishModal(photo)}
            className="bg-emerald-950/90 hover:bg-emerald-900 text-emerald-300 border border-emerald-800/60 font-mono text-[10px] uppercase font-bold px-2.5 py-1 rounded-xs transition-colors cursor-pointer"
          >
            Publish Flow
          </button>
          <button onClick={onClose} className="text-neutral-500 hover:text-neutral-200 p-1 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Hero Thumbnail Preview */}
      <div className="p-4 border-b border-neutral-800/60 bg-[#111111]">
        <div className="relative aspect-4/3 bg-neutral-950 border border-neutral-800/80 rounded-xs overflow-hidden group">
          <img
            src={photo.webPreviewUrl || photo.thumbnailUrl || photo.originalUrl || photo.url}
            alt={photo.title || "Selected photo"}
            className="w-full h-full object-contain"
            onError={(e) => {
              const target = e.currentTarget;
              if (photo.originalUrl && target.src !== photo.originalUrl) {
                target.src = photo.originalUrl;
              } else if (photo.url && target.src !== photo.url) {
                target.src = photo.url;
              }
            }}
          />
        </div>

        <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-neutral-400">
          <span>{photo.dimensions || "High Resolution"}</span>
          <span className="text-neutral-600">•</span>
          <span>{photo.colorProfile || "sRGB"}</span>
        </div>
      </div>

      {/* Editorial Rating & Flag Bar */}
      <div className="p-3.5 border-b border-neutral-800/60 bg-[#161616] flex items-center justify-between">
        {/* Rating Stars */}
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => {
                const newRating = rating === star ? 0 : star;
                setRating(newRating);
                onUpdatePhoto({ ...photo, rating: newRating });
              }}
              className={`p-0.5 cursor-pointer ${
                star <= rating ? "text-amber-400" : "text-neutral-700 hover:text-neutral-500"
              }`}
            >
              <Star className="w-3.5 h-3.5 fill-current" />
            </button>
          ))}
        </div>

        {/* Flag Pick / Reject */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              const newFlag = flag === "pick" ? "none" : "pick";
              setFlag(newFlag);
              onUpdatePhoto({ ...photo, flag: newFlag });
            }}
            className={`p-1 rounded cursor-pointer ${
              flag === "pick" ? "bg-emerald-950 text-emerald-300 border border-emerald-800" : "text-neutral-600 hover:text-neutral-400"
            }`}
            title="Pick"
          >
            <Flag className="w-3.5 h-3.5 fill-current text-emerald-400" />
          </button>

          <button
            onClick={() => {
              const newFlag = flag === "reject" ? "none" : "reject";
              setFlag(newFlag);
              onUpdatePhoto({ ...photo, flag: newFlag });
            }}
            className={`p-1 rounded cursor-pointer ${
              flag === "reject" ? "bg-red-950 text-red-300 border border-red-800" : "text-neutral-600 hover:text-neutral-400"
            }`}
            title="Reject"
          >
            <Flag className="w-3.5 h-3.5 fill-current text-red-400" />
          </button>
        </div>

        {/* Color Labels */}
        <div className="flex items-center gap-1">
          {(["red", "yellow", "green", "blue", "purple"] as const).map((color) => {
            const bgMap: Record<string, string> = {
              red: "bg-red-500",
              yellow: "bg-amber-400",
              green: "bg-emerald-500",
              blue: "bg-blue-500",
              purple: "bg-purple-500"
            };
            const isSelected = colorLabel === color;
            return (
              <button
                key={color}
                onClick={() => {
                  const newColor = colorLabel === color ? "none" : color;
                  setColorLabel(newColor);
                  onUpdatePhoto({ ...photo, colorLabel: newColor as any });
                }}
                className={`w-3 h-3 rounded-full ${bgMap[color]} transition-transform cursor-pointer ${
                  isSelected ? "ring-2 ring-white scale-110" : "opacity-60 hover:opacity-100"
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* EXIF Metadata Section (Authentic - Left blank if missing) */}
      <div className="p-4 border-b border-neutral-800/60 flex flex-col gap-2.5">
        <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-500 font-semibold">
          EXIF File Metadata
        </span>

        <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-neutral-300 bg-neutral-900/80 p-3 border border-neutral-800/80 rounded-xs">
          <div>
            <span className="text-neutral-500 block text-[9px] uppercase">Camera</span>
            <span>{camera || "—"}</span>
          </div>
          <div>
            <span className="text-neutral-500 block text-[9px] uppercase">Lens</span>
            <span>{lens || "—"}</span>
          </div>
          <div>
            <span className="text-neutral-500 block text-[9px] uppercase">Focal Length</span>
            <span>{focalLength || "—"}</span>
          </div>
          <div>
            <span className="text-neutral-500 block text-[9px] uppercase">Aperture</span>
            <span>{aperture || "—"}</span>
          </div>
          <div>
            <span className="text-neutral-500 block text-[9px] uppercase">Shutter</span>
            <span>{shutterSpeed || "—"}</span>
          </div>
          <div>
            <span className="text-neutral-500 block text-[9px] uppercase">ISO</span>
            <span>{iso || "—"}</span>
          </div>
          <div>
            <span className="text-neutral-500 block text-[9px] uppercase">Date / Time</span>
            <span>{date || "—"} {time || ""}</span>
          </div>
          <div>
            <span className="text-neutral-500 block text-[9px] uppercase">Location</span>
            <span>{location || "—"}</span>
          </div>
        </div>
      </div>

      {/* AI Assistant Quick Trigger */}
      <div className="p-3.5 border-b border-neutral-800/60 bg-[#171717] flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-amber-300 font-mono text-[10px] uppercase font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Editorial Assistant</span>
          </div>
          <button
            onClick={handleAiSuggestMetadata}
            disabled={isAiLoading}
            className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-200 border border-amber-500/30 text-[10px] font-mono uppercase px-2.5 py-1 rounded-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            {isAiLoading ? "Processing..." : "Suggest Tags & Story"}
          </button>
        </div>

        {aiMessage && (
          <p className="font-mono text-[10px] text-amber-200/90 bg-amber-950/20 border border-amber-900/30 p-2 rounded-xs">
            {aiMessage}
          </p>
        )}
      </div>

      {/* Editable Editorial Metadata Section */}
      <div className="p-4 flex flex-col gap-4">
        <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-500 font-semibold">
          Editorial Curation
        </span>

        {/* Title */}
        <div className="flex flex-col gap-1">
          <label className="font-mono text-[10px] uppercase text-neutral-400">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleSave}
            placeholder="Title of photograph..."
            className="w-full bg-[#1C1C1C] border border-neutral-800 text-xs p-2 text-neutral-100 focus:outline-none focus:border-neutral-500 font-serif"
          />
        </div>

        {/* Observation / Story */}
        <div className="flex flex-col gap-1">
          <label className="font-mono text-[10px] uppercase text-neutral-400">
            Observation / Story
          </label>
          <textarea
            rows={4}
            value={story}
            onChange={(e) => setStory(e.target.value)}
            onBlur={handleSave}
            placeholder="Detailed narrative or field notes about this moment..."
            className="w-full bg-[#1C1C1C] border border-neutral-800 text-xs p-2.5 text-neutral-200 focus:outline-none focus:border-neutral-500 font-sans leading-relaxed custom-scrollbar"
          />
        </div>

        {/* Location & Country */}
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col gap-1">
            <label className="font-mono text-[10px] uppercase text-neutral-400">City / Place</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onBlur={handleSave}
              placeholder="Kyoto, Dalat..."
              className="w-full bg-[#1C1C1C] border border-neutral-800 text-xs p-2 text-neutral-200 focus:outline-none focus:border-neutral-500 font-sans"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-mono text-[10px] uppercase text-neutral-400">Country</label>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              onBlur={handleSave}
              placeholder="Japan, Vietnam..."
              className="w-full bg-[#1C1C1C] border border-neutral-800 text-xs p-2 text-neutral-200 focus:outline-none focus:border-neutral-500 font-sans"
            />
          </div>
        </div>

        {/* Collections */}
        <div className="flex flex-col gap-1">
          <label className="font-mono text-[10px] uppercase text-neutral-400">
            Collections (comma-separated)
          </label>
          <input
            type="text"
            value={collectionsInput}
            onChange={(e) => setCollectionsInput(e.target.value)}
            onBlur={handleSave}
            placeholder="Japan, Street, Film, Morning"
            className="w-full bg-[#1C1C1C] border border-neutral-800 text-xs p-2 text-neutral-200 focus:outline-none focus:border-neutral-500 font-sans"
          />
        </div>

        {/* Tags */}
        <div className="flex flex-col gap-1">
          <label className="font-mono text-[10px] uppercase text-neutral-400">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            onBlur={handleSave}
            placeholder="#Kyoto, #Street, #35mm"
            className="w-full bg-[#1C1C1C] border border-neutral-800 text-xs p-2 text-neutral-200 focus:outline-none focus:border-neutral-500 font-mono"
          />
        </div>

        {/* Status */}
        <div className="flex flex-col gap-1">
          <label className="font-mono text-[10px] uppercase text-neutral-400">Publication Status</label>
          <select
            value={status}
            onChange={(e) => {
              const newStatus = e.target.value as any;
              setStatus(newStatus);
              onUpdatePhoto({ ...photo, status: newStatus });
            }}
            className="w-full bg-[#1C1C1C] border border-neutral-800 text-xs p-2 text-neutral-200 focus:outline-none focus:border-neutral-500 font-mono"
          >
            <option value="draft">Draft (Private)</option>
            <option value="published">Published (Public Galleria)</option>
            <option value="archived">Archived</option>
            <option value="trash">Trash</option>
          </select>
        </div>

        {/* Slug */}
        <div className="flex flex-col gap-1">
          <label className="font-mono text-[10px] uppercase text-neutral-400">URL Slug</label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            onBlur={handleSave}
            placeholder="photo-kyoto-morning-fog"
            className="w-full bg-[#1C1C1C] border border-neutral-800 text-xs p-2 text-neutral-300 focus:outline-none focus:border-neutral-500 font-mono text-[11px]"
          />
        </div>

        {/* Actions Bar */}
        <div className="mt-4 pt-4 border-t border-neutral-800/80 flex items-center justify-between">
          <button
            onClick={() => onDeletePhoto(photo.id)}
            className="flex items-center gap-1.5 text-red-400 hover:text-red-300 font-mono text-[11px] cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Photo</span>
          </button>

          <button
            onClick={handleSave}
            className="bg-neutral-100 hover:bg-white text-neutral-950 font-mono text-xs uppercase tracking-wider px-4 py-2 font-bold transition-colors cursor-pointer"
          >
            Save Changes
          </button>
        </div>
      </div>
    </aside>
  </div>
  );
}
