import React, { useState } from "react";
import { Photo, JournalEntry } from "../types";
import { Bot, Sparkles, X, Check, Copy, AlertTriangle, Layers, Tag, Eye, RefreshCw, FileText } from "lucide-react";

interface OfficinaAiAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  photos: Photo[];
  activePhoto: Photo | null;
  onTriggerAiAction: (action: string, payload?: any) => Promise<any>;
  onApplySuggestions: (updatedPhoto: Partial<Photo>) => void;
}

export default function OfficinaAiAssistant({
  isOpen,
  onClose,
  photos,
  activePhoto,
  onTriggerAiAction,
  onApplySuggestions
}: OfficinaAiAssistantProps) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<"curation" | "duplicates" | "transcribe">("curation");
  const [isLoading, setIsLoading] = useState(false);
  const [suggestionResult, setSuggestionResult] = useState<any>(null);
  const [handwrittenNoteInput, setHandwrittenNoteInput] = useState("");

  const handleRunAction = async (action: string) => {
    setIsLoading(true);
    setSuggestionResult(null);
    try {
      const res = await onTriggerAiAction(action, { photo: activePhoto });
      if (res) {
        if (action === "detect_duplicates") {
          // Simple client-side + server duplicate check
          const dupes = photos.filter(
            (p) => activePhoto && p.id !== activePhoto.id && (p.title === activePhoto.title || p.url === activePhoto.url)
          );
          setSuggestionResult({
            type: "duplicates",
            message: dupes.length > 0 ? `Found ${dupes.length} potential duplicate(s) in Library.` : "No duplicates detected for this item."
          });
        } else {
          setSuggestionResult({
            type: "metadata",
            raw: res.result || res.suggestion
          });
        }
      }
    } catch (e) {
      setSuggestionResult({ error: "Failed to query AI Assistant." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-[#161616] border-l border-neutral-800 shadow-2xl z-40 flex flex-col font-sans text-xs text-neutral-200">
      {/* Drawer Header */}
      <div className="p-4 bg-[#121212] border-b border-neutral-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-amber-400" />
          <h3 className="font-serif text-base text-neutral-100 font-semibold">AI Editorial Assistant</h3>
        </div>
        <button onClick={onClose} className="text-neutral-500 hover:text-neutral-200 cursor-pointer">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Philosophy Notice */}
      <div className="p-3 bg-amber-950/20 border-b border-amber-900/30 text-[10px] font-mono text-amber-300/90 flex items-center gap-2">
        <Sparkles className="w-3.5 h-3.5 shrink-0" />
        <span>AI only suggests. You hold 100% editorial authority.</span>
      </div>

      {/* Tab Switcher */}
      <div className="flex border-b border-neutral-800 bg-[#141414] font-mono text-[10px] uppercase font-bold">
        <button
          onClick={() => setActiveTab("curation")}
          className={`flex-1 py-2.5 transition-colors cursor-pointer border-b-2 ${
            activeTab === "curation" ? "border-amber-400 text-amber-300 bg-neutral-900" : "border-transparent text-neutral-400 hover:text-neutral-200"
          }`}
        >
          Curation
        </button>
        <button
          onClick={() => setActiveTab("duplicates")}
          className={`flex-1 py-2.5 transition-colors cursor-pointer border-b-2 ${
            activeTab === "duplicates" ? "border-amber-400 text-amber-300 bg-neutral-900" : "border-transparent text-neutral-400 hover:text-neutral-200"
          }`}
        >
          Duplicates
        </button>
        <button
          onClick={() => setActiveTab("transcribe")}
          className={`flex-1 py-2.5 transition-colors cursor-pointer border-b-2 ${
            activeTab === "transcribe" ? "border-amber-400 text-amber-300 bg-neutral-900" : "border-transparent text-neutral-400 hover:text-neutral-200"
          }`}
        >
          Transcribe
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 custom-scrollbar">
        {activeTab === "curation" && (
          <div className="flex flex-col gap-3">
            <span className="font-mono text-[10px] uppercase text-neutral-500 font-bold">
              Active Selection: {activePhoto?.title || activePhoto?.id || "None"}
            </span>

            <button
              onClick={() => handleRunAction("suggest_metadata")}
              disabled={isLoading || !activePhoto}
              className="w-full bg-neutral-800 hover:bg-neutral-700 text-neutral-200 p-2.5 rounded text-left flex items-center justify-between transition-colors cursor-pointer disabled:opacity-50"
            >
              <div className="flex items-center gap-2">
                <Tag className="w-3.5 h-3.5 text-amber-400" />
                <span>Suggest Keywords & Collections</span>
              </div>
              <Sparkles className="w-3 h-3 text-neutral-500" />
            </button>

            <button
              onClick={() => handleRunAction("extract_colors")}
              disabled={isLoading || !activePhoto}
              className="w-full bg-neutral-800 hover:bg-neutral-700 text-neutral-200 p-2.5 rounded text-left flex items-center justify-between transition-colors cursor-pointer disabled:opacity-50"
            >
              <div className="flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                <span>Extract Dominant Color Palette</span>
              </div>
              <Sparkles className="w-3 h-3 text-neutral-500" />
            </button>

            <button
              onClick={() => handleRunAction("detect_blurry")}
              disabled={isLoading || !activePhoto}
              className="w-full bg-neutral-800 hover:bg-neutral-700 text-neutral-200 p-2.5 rounded text-left flex items-center justify-between transition-colors cursor-pointer disabled:opacity-50"
            >
              <div className="flex items-center gap-2">
                <Eye className="w-3.5 h-3.5 text-amber-400" />
                <span>Check Resolution & Sharpness</span>
              </div>
              <Sparkles className="w-3 h-3 text-neutral-500" />
            </button>
          </div>
        )}

        {activeTab === "duplicates" && (
          <div className="flex flex-col gap-3">
            <p className="text-xs text-neutral-400">Scan entire archive (50,000 photos capacity) for exact or near duplicate assets.</p>
            <button
              onClick={() => handleRunAction("detect_duplicates")}
              disabled={isLoading}
              className="bg-neutral-100 hover:bg-white text-neutral-950 font-mono text-xs uppercase font-bold py-2 font-semibold transition-colors cursor-pointer"
            >
              {isLoading ? "Scanning Archive..." : "Scan Duplicate Photos"}
            </button>
          </div>
        )}

        {activeTab === "transcribe" && (
          <div className="flex flex-col gap-3">
            <p className="text-xs text-neutral-400">Transcribe handwritten field notes or notebook scans into clean Markdown.</p>
            <textarea
              rows={4}
              value={handwrittenNoteInput}
              onChange={(e) => setHandwrittenNoteInput(e.target.value)}
              placeholder="Paste raw transcribed text or optical note input..."
              className="bg-neutral-900 border border-neutral-800 p-2.5 text-xs text-neutral-200 font-mono"
            />
            <button
              onClick={() => handleRunAction("transcribe_notes")}
              disabled={isLoading || !handwrittenNoteInput}
              className="bg-neutral-100 hover:bg-white text-neutral-950 font-mono text-xs uppercase font-bold py-2 cursor-pointer disabled:opacity-50"
            >
              Format as Obsidian Markdown
            </button>
          </div>
        )}

        {/* Output Results */}
        {suggestionResult && (
          <div className="mt-4 p-3 bg-neutral-900 border border-neutral-800 rounded flex flex-col gap-2 font-mono text-xs text-neutral-200">
            <span className="text-[9px] uppercase text-amber-400 font-bold">Suggestion Output</span>
            <pre className="text-[11px] whitespace-pre-wrap leading-relaxed text-neutral-300 font-sans">
              {suggestionResult.raw || suggestionResult.message || JSON.stringify(suggestionResult, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
