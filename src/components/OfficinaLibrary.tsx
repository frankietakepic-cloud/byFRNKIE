import React, { useState, useMemo } from "react";
import { Photo } from "../types";
import {
  Grid,
  List,
  Star,
  Check,
  Flag,
  Tag,
  FolderOpen,
  SlidersHorizontal,
  Trash2,
  Globe,
  FileText,
  Archive,
  Download,
  Copy,
  Plus,
  X,
  Upload,
  AlertCircle
} from "lucide-react";

interface OfficinaLibraryProps {
  photos: Photo[];
  selectedPhotoIds: string[];
  onSelectPhotoToggle: (id: string, isMulti: boolean) => void;
  onSelectAllPhotos: () => void;
  onClearSelection: () => void;
  onUpdatePhoto: (photo: Photo) => void;
  onBulkUpdate: (updates: Partial<Photo>) => void;
  onBulkDelete: () => void;
  activePhotoId: string | null;
  onPhotoClick: (photo: Photo) => void;
  activeViewTitle: string;
  onOpenImport: () => void;
}

export default function OfficinaLibrary({
  photos,
  selectedPhotoIds,
  onSelectPhotoToggle,
  onSelectAllPhotos,
  onClearSelection,
  onUpdatePhoto,
  onBulkUpdate,
  onBulkDelete,
  activePhotoId,
  onPhotoClick,
  activeViewTitle,
  onOpenImport
}: OfficinaLibraryProps) {
  const [gridSize, setGridSize] = useState<"sm" | "md" | "lg">("md");
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [flagFilter, setFlagFilter] = useState<"pick" | "reject" | null>(null);
  const [colorFilter, setColorFilter] = useState<string | null>(null);
  const [favoriteOnly, setFavoriteOnly] = useState(false);

  // Bulk edit inputs
  const [showBulkTagModal, setShowBulkTagModal] = useState(false);
  const [bulkTagInput, setBulkTagInput] = useState("");
  const [showBulkCollectionModal, setShowBulkCollectionModal] = useState(false);
  const [bulkCollectionInput, setBulkCollectionInput] = useState("");

  // Filtered photos
  const filteredPhotos = useMemo(() => {
    return photos.filter((p) => {
      if (ratingFilter !== null && (p.rating || 0) < ratingFilter) return false;
      if (flagFilter !== null && p.flag !== flagFilter) return false;
      if (colorFilter !== null && p.colorLabel !== colorFilter) return false;
      if (favoriteOnly && !p.favorite) return false;
      return true;
    });
  }, [photos, ratingFilter, flagFilter, colorFilter, favoriteOnly]);

  const allSelected = filteredPhotos.length > 0 && selectedPhotoIds.length === filteredPhotos.length;

  const handleApplyBulkTags = () => {
    if (bulkTagInput.trim()) {
      const tagsToAdd = bulkTagInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
        .map((t) => (t.startsWith("#") ? t : `#${t}`));

      selectedPhotoIds.forEach((id) => {
        const p = photos.find((x) => x.id === id);
        if (p) {
          const currentTags = p.tags || [];
          const combined = Array.from(new Set([...currentTags, ...tagsToAdd]));
          onUpdatePhoto({ ...p, tags: combined });
        }
      });
      setBulkTagInput("");
      setShowBulkTagModal(false);
    }
  };

  const handleApplyBulkCollections = () => {
    if (bulkCollectionInput.trim()) {
      const colsToAdd = bulkCollectionInput
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean);

      selectedPhotoIds.forEach((id) => {
        const p = photos.find((x) => x.id === id);
        if (p) {
          const currentCols = p.collections || [];
          const combined = Array.from(new Set([...currentCols, ...colsToAdd]));
          onUpdatePhoto({ ...p, collections: combined });
        }
      });
      setBulkCollectionInput("");
      setShowBulkCollectionModal(false);
    }
  };

  const handleExportSelected = () => {
    const selected = photos.filter((p) => selectedPhotoIds.includes(p.id));
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(selected, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `byFRNK-archive-export-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="flex-1 flex flex-col bg-[#121212] h-full overflow-hidden font-sans">
      {/* Library Filter & Control Header */}
      <div className="px-5 py-3 border-b border-neutral-800/80 bg-[#161616] flex flex-wrap items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-4">
          <h2 className="font-serif text-lg text-neutral-100 font-semibold tracking-tight">
            {activeViewTitle}
          </h2>
          <span className="font-mono text-[11px] text-neutral-500 bg-neutral-900 border border-neutral-800 px-2.5 py-0.5 rounded-full">
            {filteredPhotos.length} items
          </span>
        </div>

        {/* Filters & Grid size */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Pick / Reject Flags */}
          <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded p-0.5">
            <button
              onClick={() => setFlagFilter(flagFilter === "pick" ? null : "pick")}
              className={`px-2 py-1 text-[10px] font-mono rounded-xs transition-colors cursor-pointer flex items-center gap-1 ${
                flagFilter === "pick"
                  ? "bg-emerald-950 text-emerald-300 border border-emerald-800/50"
                  : "text-neutral-400 hover:text-neutral-200"
              }`}
              title="Filter Picked"
            >
              <Flag className="w-3 h-3 text-emerald-400" />
              <span>Picks</span>
            </button>
            <button
              onClick={() => setFlagFilter(flagFilter === "reject" ? null : "reject")}
              className={`px-2 py-1 text-[10px] font-mono rounded-xs transition-colors cursor-pointer flex items-center gap-1 ${
                flagFilter === "reject"
                  ? "bg-red-950 text-red-300 border border-red-800/50"
                  : "text-neutral-400 hover:text-neutral-200"
              }`}
              title="Filter Rejected"
            >
              <Flag className="w-3 h-3 text-red-400" />
              <span>Rejects</span>
            </button>
          </div>

          {/* Color Labels */}
          <div className="flex items-center gap-1 bg-neutral-900 border border-neutral-800 px-2 py-1 rounded">
            {(["red", "yellow", "green", "blue", "purple"] as const).map((color) => {
              const bgMap: Record<string, string> = {
                red: "bg-red-500",
                yellow: "bg-amber-400",
                green: "bg-emerald-500",
                blue: "bg-blue-500",
                purple: "bg-purple-500"
              };
              const isSelected = colorFilter === color;
              return (
                <button
                  key={color}
                  onClick={() => setColorFilter(colorFilter === color ? null : color)}
                  className={`w-3.5 h-3.5 rounded-full ${bgMap[color]} transition-transform cursor-pointer ${
                    isSelected ? "ring-2 ring-white ring-offset-1 ring-offset-neutral-900 scale-110" : "opacity-70 hover:opacity-100"
                  }`}
                  title={`Filter ${color}`}
                />
              );
            })}
          </div>

          {/* Rating Stars Filter */}
          <div className="flex items-center gap-0.5 bg-neutral-900 border border-neutral-800 px-2 py-1 rounded">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRatingFilter(ratingFilter === star ? null : star)}
                className={`p-0.5 cursor-pointer ${
                  ratingFilter !== null && star <= ratingFilter
                    ? "text-amber-400"
                    : "text-neutral-600 hover:text-neutral-400"
                }`}
              >
                <Star className="w-3 h-3 fill-current" />
              </button>
            ))}
          </div>

          {/* Grid Size Toggle */}
          <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded p-0.5 text-neutral-400">
            {(["sm", "md", "lg"] as const).map((size) => (
              <button
                key={size}
                onClick={() => setGridSize(size)}
                className={`px-2 py-0.5 font-mono text-[10px] uppercase rounded-xs transition-colors cursor-pointer ${
                  gridSize === size ? "bg-neutral-800 text-neutral-100 font-bold" : "hover:text-neutral-200"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bulk Operations Toolbar */}
      {selectedPhotoIds.length > 0 && (
        <div className="px-5 py-2.5 bg-neutral-900 border-b border-neutral-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-neutral-200 z-20">
          <div className="flex items-center gap-3">
            <span className="bg-neutral-800 px-2.5 py-1 rounded border border-neutral-700 font-bold text-neutral-100">
              {selectedPhotoIds.length} Selected
            </span>
            <button
              onClick={onClearSelection}
              className="text-neutral-400 hover:text-neutral-200 underline text-[11px] cursor-pointer"
            >
              Clear Selection
            </button>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => onBulkUpdate({ status: "published" })}
              className="flex items-center gap-1.5 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-800/60 px-2.5 py-1 rounded transition-colors cursor-pointer"
            >
              <Globe className="w-3 h-3" />
              <span>Publish</span>
            </button>

            <button
              onClick={() => onBulkUpdate({ status: "draft" })}
              className="flex items-center gap-1.5 bg-amber-950/80 hover:bg-amber-900 text-amber-300 border border-amber-800/60 px-2.5 py-1 rounded transition-colors cursor-pointer"
            >
              <FileText className="w-3 h-3" />
              <span>Set Draft</span>
            </button>

            <button
              onClick={() => setShowBulkTagModal(true)}
              className="flex items-center gap-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 px-2.5 py-1 rounded transition-colors cursor-pointer"
            >
              <Tag className="w-3 h-3 text-neutral-400" />
              <span>Add Tags</span>
            </button>

            <button
              onClick={() => setShowBulkCollectionModal(true)}
              className="flex items-center gap-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 px-2.5 py-1 rounded transition-colors cursor-pointer"
            >
              <FolderOpen className="w-3 h-3 text-neutral-400" />
              <span>Add Collection</span>
            </button>

            <button
              onClick={handleExportSelected}
              className="flex items-center gap-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 px-2.5 py-1 rounded transition-colors cursor-pointer"
            >
              <Download className="w-3 h-3 text-neutral-400" />
              <span>Export</span>
            </button>

            <button
              onClick={onBulkDelete}
              className="flex items-center gap-1.5 bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-800/60 px-2.5 py-1 rounded transition-colors cursor-pointer"
            >
              <Trash2 className="w-3 h-3" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      )}

      {/* Grid Container */}
      <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
        {filteredPhotos.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center py-16 px-4">
            <AlertCircle className="w-10 h-10 text-neutral-600 mb-3 stroke-[1.5]" />
            <h3 className="font-serif text-xl text-neutral-300 mb-1">
              No items match this archive view.
            </h3>
            <p className="text-xs text-neutral-500 max-w-sm mb-6">
              Import raw photographs or adjust your rating and tag filters.
            </p>
            <button
              onClick={onOpenImport}
              className="bg-neutral-100 hover:bg-white text-neutral-950 font-mono text-xs uppercase tracking-wider px-4 py-2 font-semibold transition-colors cursor-pointer"
            >
              Import Raw Media
            </button>
          </div>
        ) : (
          <div
            className={`grid gap-4 transition-all ${
              gridSize === "sm"
                ? "grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8"
                : gridSize === "md"
                ? "grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
                : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
            }`}
          >
            {filteredPhotos.map((photo) => {
              const isSelected = selectedPhotoIds.includes(photo.id);
              const isActive = activePhotoId === photo.id;

              const colorBgMap: Record<string, string> = {
                red: "bg-red-500",
                yellow: "bg-amber-400",
                green: "bg-emerald-500",
                blue: "bg-blue-500",
                purple: "bg-purple-500"
              };

              const defaultFallback = "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800&auto=format&fit=crop";
              const assignedSrc = photo.thumbnailUrl || photo.webPreviewUrl || photo.originalUrl || photo.url || defaultFallback;

              return (
                <div
                  key={photo.id}
                  data-id={photo.id}
                  data-key={photo.id}
                  onClick={(e) => {
                    if (e.shiftKey || e.ctrlKey || e.metaKey) {
                      onSelectPhotoToggle(photo.id, true);
                    } else {
                      onPhotoClick(photo);
                    }
                  }}
                  className={`group relative bg-[#181818] border transition-all cursor-pointer overflow-hidden flex flex-col ${
                    isActive
                      ? "border-neutral-100 ring-1 ring-neutral-100"
                      : isSelected
                      ? "border-amber-500/80 bg-amber-950/10"
                      : "border-neutral-800/80 hover:border-neutral-600"
                  }`}
                >
                  {/* Thumbnail Image Container */}
                  <div className="relative aspect-4/3 bg-neutral-950 overflow-hidden">
                    <img
                      src={assignedSrc}
                      alt={photo.title || "Archive photo"}
                      data-id={photo.id}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                      onError={(e) => {
                        const img = e.currentTarget;
                        const fallback1 = photo.webPreviewUrl || photo.originalUrl || photo.url || defaultFallback;
                        const fallback2 = photo.originalUrl || photo.url || defaultFallback;
                        if (img.src !== fallback1) {
                          img.src = fallback1;
                        } else if (img.src !== fallback2) {
                          img.src = fallback2;
                        } else if (img.src !== defaultFallback) {
                          img.src = defaultFallback;
                        }
                      }}
                    />

                    {/* Checkbox overlay */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectPhotoToggle(photo.id, true);
                      }}
                      className={`absolute top-2 left-2 w-5 h-5 rounded-xs flex items-center justify-center transition-opacity cursor-pointer border ${
                        isSelected
                          ? "bg-amber-500 border-amber-400 text-neutral-950"
                          : "bg-neutral-900/80 border-neutral-700 text-transparent group-hover:text-neutral-500 hover:border-neutral-400"
                      }`}
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </button>

                    {/* Status Badge */}
                    <div className="absolute top-2 right-2 flex items-center gap-1">
                      {photo.status === "draft" && (
                        <span className="bg-amber-500/90 text-neutral-950 font-mono text-[9px] uppercase px-1.5 py-0.5 font-extrabold tracking-wider rounded-xs">
                          Draft
                        </span>
                      )}
                      {photo.flag === "pick" && (
                        <span className="bg-emerald-500 text-neutral-950 p-0.5 rounded-xs">
                          <Flag className="w-2.5 h-2.5 fill-current" />
                        </span>
                      )}
                      {photo.flag === "reject" && (
                        <span className="bg-red-500 text-white p-0.5 rounded-xs">
                          <Flag className="w-2.5 h-2.5 fill-current" />
                        </span>
                      )}
                    </div>

                    {/* Color Label indicator */}
                    {photo.colorLabel && photo.colorLabel !== "none" && (
                      <div
                        className={`absolute bottom-2 left-2 w-2.5 h-2.5 rounded-full ${colorBgMap[photo.colorLabel]}`}
                      />
                    )}
                  </div>

                  {/* Card Metadata Footer */}
                  <div className="p-2.5 flex flex-col gap-1 bg-[#161616]">
                    <div className="flex items-center justify-between">
                      <h4 className="font-sans text-xs text-neutral-200 font-medium truncate pr-2">
                        {photo.title || "Untitled"}
                      </h4>

                      {/* Rating stars */}
                      {(photo.rating || 0) > 0 && (
                        <div className="flex items-center text-amber-400 shrink-0">
                          <Star className="w-2.5 h-2.5 fill-current" />
                          <span className="font-mono text-[10px] ml-0.5 font-bold">
                            {photo.rating}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between font-mono text-[10px] text-neutral-500">
                      <span className="truncate">{photo.camera || photo.location || photo.date}</span>
                      <span>{photo.aperture || photo.iso}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bulk Tag Modal */}
      {showBulkTagModal && (
        <div className="fixed inset-0 bg-neutral-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-[#1A1A1A] border border-neutral-800 p-6 w-full max-w-md flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h3 className="font-serif text-lg text-neutral-100">Add Tags to Selected</h3>
              <button onClick={() => setShowBulkTagModal(false)} className="text-neutral-500 hover:text-neutral-300">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-neutral-400">
              Comma-separated list of tags (e.g. #Kyoto, #Street, #35mm).
            </p>
            <input
              type="text"
              value={bulkTagInput}
              onChange={(e) => setBulkTagInput(e.target.value)}
              placeholder="#Kyoto, #Street, #Leica"
              className="bg-[#222222] border border-neutral-700 text-xs p-2.5 text-neutral-100 focus:outline-none focus:border-neutral-500"
            />
            <div className="flex justify-end gap-2 font-mono text-xs uppercase">
              <button onClick={() => setShowBulkTagModal(false)} className="px-3 py-1.5 text-neutral-400 hover:text-neutral-200">
                Cancel
              </button>
              <button onClick={handleApplyBulkTags} className="bg-neutral-100 text-neutral-950 px-4 py-1.5 font-bold">
                Apply Tags
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Collection Modal */}
      {showBulkCollectionModal && (
        <div className="fixed inset-0 bg-neutral-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-[#1A1A1A] border border-neutral-800 p-6 w-full max-w-md flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h3 className="font-serif text-lg text-neutral-100">Add Collections</h3>
              <button onClick={() => setShowBulkCollectionModal(false)} className="text-neutral-500 hover:text-neutral-300">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-neutral-400">
              Assign selected items to collections (e.g. Japan, Architecture, Morning).
            </p>
            <input
              type="text"
              value={bulkCollectionInput}
              onChange={(e) => setBulkCollectionInput(e.target.value)}
              placeholder="Japan, Street, Film"
              className="bg-[#222222] border border-neutral-700 text-xs p-2.5 text-neutral-100 focus:outline-none focus:border-neutral-500"
            />
            <div className="flex justify-end gap-2 font-mono text-xs uppercase">
              <button onClick={() => setShowBulkCollectionModal(false)} className="px-3 py-1.5 text-neutral-400 hover:text-neutral-200">
                Cancel
              </button>
              <button onClick={handleApplyBulkCollections} className="bg-neutral-100 text-neutral-950 px-4 py-1.5 font-bold">
                Assign Collections
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
