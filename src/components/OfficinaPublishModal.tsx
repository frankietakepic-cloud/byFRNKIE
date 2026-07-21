import React, { useState } from "react";
import { Photo } from "../types";
import { X, Globe, CheckCircle2, ShieldCheck, Share2, Send, Instagram, Mail, Twitter, Linkedin, Layers } from "lucide-react";

interface OfficinaPublishModalProps {
  photo: Photo | null;
  onClose: () => void;
  onConfirmPublish: (photo: Photo) => void;
}

export default function OfficinaPublishModal({
  photo,
  onClose,
  onConfirmPublish
}: OfficinaPublishModalProps) {
  if (!photo) return null;

  const [slug, setSlug] = useState(
    photo.slug || `photo-${(photo.title || "untitled").toLowerCase().replace(/[^a-z0-9]+/g, "-")}`
  );
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Multi-channel publishing pipeline destinations
  const [destinations, setDestinations] = useState<{ [key: string]: boolean }>({
    byfrnk: true,
    newsletter: true,
    instagram: false,
    threads: false,
    linkedin: false,
    pinterest: false,
    twitter: false,
    medium: false,
  });

  const toggleDestination = (key: string) => {
    setDestinations((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handlePublish = () => {
    setIsPublishing(true);
    setTimeout(() => {
      const updated: Photo = {
        ...photo,
        status: "published",
        slug,
        publishedDate: new Date().toISOString()
      };
      onConfirmPublish(updated);
      setIsPublishing(false);
      setIsSuccess(true);
    }, 800);
  };

  const selectedCount = Object.values(destinations).filter(Boolean).length;

  return (
    <div className="fixed inset-0 bg-neutral-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 select-none font-sans">
      <div className="bg-[#1A1A1A] border border-neutral-800 w-full max-w-xl rounded-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 bg-[#141414] border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-emerald-400" />
            <h3 className="font-serif text-base md:text-lg text-neutral-100 font-medium">
              Multi-Destination Publishing Pipeline
            </h3>
          </div>
          <button onClick={onClose} className="text-neutral-500 hover:text-neutral-200 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 flex flex-col items-center text-center gap-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 stroke-[1.5]" />
            <h4 className="font-serif text-2xl text-neutral-100">Dispatched Across Pipeline</h4>
            <p className="text-xs text-neutral-400 max-w-md">
              The photograph has been published to byFRNK Galleria and dispatched to {selectedCount} active distribution channels.
            </p>
            <div className="bg-neutral-900 border border-neutral-800 p-3 rounded font-mono text-xs text-emerald-300 w-full max-w-md text-center">
              https://byfrnk.archive/{slug}
            </div>
            <button
              onClick={onClose}
              className="mt-2 bg-neutral-100 text-neutral-950 font-mono text-xs uppercase font-bold px-6 py-2.5 rounded-md cursor-pointer"
            >
              Return to L'Officina OS
            </button>
          </div>
        ) : (
          <div className="p-5 md:p-6 flex flex-col gap-5 overflow-y-auto">
            {/* Live Preview Card */}
            <div className="flex gap-4 bg-neutral-900/80 p-3.5 border border-neutral-800 rounded-lg">
              <img
                src={photo.url}
                alt={photo.title}
                className="w-20 h-20 object-cover rounded border border-neutral-800 shrink-0"
              />
              <div className="flex flex-col justify-center gap-1 font-sans">
                <h4 className="font-serif text-sm font-medium text-neutral-100">{photo.title || "Untitled Photograph"}</h4>
                <p className="text-xs text-neutral-400 line-clamp-2">{photo.caption || photo.story || "No caption added."}</p>
                <div className="flex items-center gap-2 font-mono text-[10px] text-neutral-500 mt-0.5">
                  <span>{photo.camera || "Unspecified Camera"}</span>
                  <span>•</span>
                  <span>{photo.location || "Studio"}</span>
                </div>
              </div>
            </div>

            {/* Publishing Pipeline Destination Toggles */}
            <div className="space-y-2">
              <span className="block font-mono text-[10px] uppercase text-neutral-400 tracking-wider">
                Distribution Destinations ({selectedCount} Selected)
              </span>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => toggleDestination("byfrnk")}
                  className={`p-2.5 rounded-lg border text-left flex items-center justify-between transition-colors cursor-pointer ${
                    destinations.byfrnk
                      ? "bg-emerald-950/40 border-emerald-800/80 text-emerald-200"
                      : "bg-neutral-900/40 border-neutral-800 text-neutral-500"
                  }`}
                >
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <Globe className="w-4 h-4 text-emerald-400" />
                    <span className="font-medium">byFRNK Galleria</span>
                  </div>
                  <span className="text-[10px] uppercase font-mono text-emerald-400 font-bold">Primary</span>
                </button>

                <button
                  onClick={() => toggleDestination("newsletter")}
                  className={`p-2.5 rounded-lg border text-left flex items-center justify-between transition-colors cursor-pointer ${
                    destinations.newsletter
                      ? "bg-amber-950/40 border-amber-800/80 text-amber-200"
                      : "bg-neutral-900/40 border-neutral-800 text-neutral-500"
                  }`}
                >
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <Mail className="w-4 h-4 text-amber-400" />
                    <span>Editorial Dispatch</span>
                  </div>
                  <input type="checkbox" checked={destinations.newsletter} readOnly className="accent-amber-400" />
                </button>

                <button
                  onClick={() => toggleDestination("instagram")}
                  className={`p-2.5 rounded-lg border text-left flex items-center justify-between transition-colors cursor-pointer ${
                    destinations.instagram
                      ? "bg-pink-950/40 border-pink-800/80 text-pink-200"
                      : "bg-neutral-900/40 border-neutral-800 text-neutral-500"
                  }`}
                >
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <Instagram className="w-4 h-4 text-pink-400" />
                    <span>Instagram</span>
                  </div>
                  <input type="checkbox" checked={destinations.instagram} readOnly className="accent-pink-400" />
                </button>

                <button
                  onClick={() => toggleDestination("threads")}
                  className={`p-2.5 rounded-lg border text-left flex items-center justify-between transition-colors cursor-pointer ${
                    destinations.threads
                      ? "bg-purple-950/40 border-purple-800/80 text-purple-200"
                      : "bg-neutral-900/40 border-neutral-800 text-neutral-500"
                  }`}
                >
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <Share2 className="w-4 h-4 text-purple-400" />
                    <span>Threads</span>
                  </div>
                  <input type="checkbox" checked={destinations.threads} readOnly className="accent-purple-400" />
                </button>

                <button
                  onClick={() => toggleDestination("linkedin")}
                  className={`p-2.5 rounded-lg border text-left flex items-center justify-between transition-colors cursor-pointer ${
                    destinations.linkedin
                      ? "bg-blue-950/40 border-blue-800/80 text-blue-200"
                      : "bg-neutral-900/40 border-neutral-800 text-neutral-500"
                  }`}
                >
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <Linkedin className="w-4 h-4 text-blue-400" />
                    <span>LinkedIn</span>
                  </div>
                  <input type="checkbox" checked={destinations.linkedin} readOnly className="accent-blue-400" />
                </button>

                <button
                  onClick={() => toggleDestination("twitter")}
                  className={`p-2.5 rounded-lg border text-left flex items-center justify-between transition-colors cursor-pointer ${
                    destinations.twitter
                      ? "bg-sky-950/40 border-sky-800/80 text-sky-200"
                      : "bg-neutral-900/40 border-neutral-800 text-neutral-500"
                  }`}
                >
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <Twitter className="w-4 h-4 text-sky-400" />
                    <span>X / Twitter</span>
                  </div>
                  <input type="checkbox" checked={destinations.twitter} readOnly className="accent-sky-400" />
                </button>
              </div>
            </div>

            {/* Pre-flight Verification Checklist */}
            <div className="flex flex-col gap-1.5 bg-[#141414] p-3.5 border border-neutral-800/80 rounded-lg font-mono text-xs">
              <span className="text-[10px] uppercase text-neutral-500 font-bold mb-1">Pre-Flight Pipeline Checks</span>
              <div className="flex items-center gap-2 text-neutral-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>High Resolution Render Ready (300DPI)</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>EXIF Metadata Embedded</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Rating Filter Verified: {photo.rating || 0} / 5 Stars</span>
              </div>
            </div>

            {/* Slug Input */}
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[10px] uppercase text-neutral-400">Public Permalink Slug</label>
              <div className="flex items-center bg-[#222] border border-neutral-700 text-xs text-neutral-300 px-3 py-2 font-mono rounded-md">
                <span className="text-neutral-500">byfrnk.archive/</span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="bg-transparent flex-1 focus:outline-none text-neutral-100"
                />
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-3 border-t border-neutral-800/80 flex justify-end gap-3 font-mono text-xs uppercase">
              <button onClick={onClose} className="px-4 py-2 text-neutral-400 hover:text-neutral-200 cursor-pointer">
                Cancel
              </button>
              <button
                onClick={handlePublish}
                disabled={isPublishing}
                className="bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold px-5 py-2.5 rounded-md transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                {isPublishing ? "Publishing..." : "Dispatch to Pipeline"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
