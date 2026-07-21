import React from "react";
import { Search, Upload, Bot, ArrowLeft, Lock, RefreshCw, Layers } from "lucide-react";

interface OfficinaTopBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenImport: () => void;
  onToggleAi: () => void;
  isAiOpen: boolean;
  onReturnToPublic: () => void;
  onLockWorkspace: () => void;
  totalPhotosCount: number;
  draftsCount: number;
}

export default function OfficinaTopBar({
  searchQuery,
  onSearchChange,
  onOpenImport,
  onToggleAi,
  isAiOpen,
  onReturnToPublic,
  onLockWorkspace,
  totalPhotosCount,
  draftsCount
}: OfficinaTopBarProps) {
  return (
    <header className="h-14 bg-[#141414] border-b border-neutral-800/80 px-3 md:px-4 flex items-center justify-between shrink-0 select-none z-30 pt-[env(safe-area-inset-top)]">
      {/* Brand & System Status */}
      <div className="flex items-center gap-2 md:gap-4 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 bg-neutral-100 rounded-full animate-pulse" />
          <span className="font-serif text-base md:text-lg tracking-tight text-neutral-100 font-semibold">
            L'Officina
          </span>
          <span className="hidden sm:inline font-mono text-[9px] uppercase tracking-widest text-neutral-500 bg-neutral-900 border border-neutral-800 px-2 py-0.5 rounded-sm">
            v2.0 PWA
          </span>
        </div>

        <div className="hidden lg:flex items-center gap-3 border-l border-neutral-800/80 pl-4 text-[11px] font-mono text-neutral-400">
          <span>{totalPhotosCount.toLocaleString()} items</span>
          <span className="text-neutral-700">•</span>
          <span className="text-amber-400/90">{draftsCount} drafts</span>
        </div>
      </div>

      {/* Instant Global Search */}
      <div className="flex-1 max-w-xs md:max-w-md mx-2 md:mx-6 relative">
        <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search items..."
          className="w-full bg-[#1A1A1A] border border-neutral-800 text-xs pl-8 pr-3 py-1.5 rounded-md text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:border-neutral-600 font-sans transition-colors"
        />
      </div>

      {/* Top Bar Controls */}
      <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
        <button
          onClick={onOpenImport}
          className="flex items-center gap-1 bg-neutral-100 hover:bg-white text-neutral-950 px-2.5 md:px-3 py-1.5 text-xs font-mono uppercase tracking-wider font-medium rounded transition-colors cursor-pointer"
        >
          <Upload className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Import</span>
        </button>

        <button
          onClick={onToggleAi}
          className={`flex items-center gap-1 border px-2.5 md:px-3 py-1.5 text-xs font-mono uppercase tracking-wider rounded transition-colors cursor-pointer ${
            isAiOpen
              ? "bg-amber-500/10 border-amber-500/40 text-amber-300"
              : "border-neutral-800 hover:border-neutral-700 text-neutral-300 bg-neutral-900/60"
          }`}
          title="AI Editorial Assistant"
        >
          <Bot className="w-3.5 h-3.5" />
          <span className="hidden md:inline">AI</span>
        </button>

        <button
          onClick={onReturnToPublic}
          className="hidden sm:flex items-center gap-1 text-xs font-mono text-neutral-400 hover:text-neutral-200 px-2 py-1.5 transition-colors cursor-pointer"
          title="Return to Public Archive"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span className="hidden lg:inline">Public</span>
        </button>

        <button
          onClick={onLockWorkspace}
          className="text-neutral-500 hover:text-neutral-300 p-1.5 transition-colors cursor-pointer"
          title="Lock L'Officina Workspace"
        >
          <Lock className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
}
