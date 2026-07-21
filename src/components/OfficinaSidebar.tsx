import React, { useState } from "react";
import {
  Grid,
  FileText,
  Globe,
  Archive,
  Trash2,
  FolderOpen,
  Hash,
  BookOpen,
  Wrench,
  Calendar,
  Settings,
  Plus,
  ChevronDown,
  ChevronRight,
  Star,
  Check,
  Layout,
  Image
} from "lucide-react";

export type SidebarViewMode =
  | "library"
  | "drafts"
  | "published"
  | "archived"
  | "trash"
  | "collection"
  | "tag"
  | "journal"
  | "workshop"
  | "daily"
  | "site_builder"
  | "hero_manager"
  | "settings";

interface OfficinaSidebarProps {
  activeView: SidebarViewMode;
  onViewChange: (view: SidebarViewMode) => void;
  selectedCollection: string | null;
  onSelectCollection: (collection: string | null) => void;
  selectedTag: string | null;
  onSelectTag: (tag: string | null) => void;
  collectionsList: string[];
  tagsList: string[];
  counts: {
    library: number;
    drafts: number;
    published: number;
    archived: number;
    trash: number;
    journal: number;
    workshop: number;
  };
  onCreateCollection: (name: string) => void;
}

export default function OfficinaSidebar({
  activeView,
  onViewChange,
  selectedCollection,
  onSelectCollection,
  selectedTag,
  onSelectTag,
  collectionsList,
  tagsList,
  counts,
  onCreateCollection
}: OfficinaSidebarProps) {
  const [isCollectionsOpen, setIsCollectionsOpen] = useState(true);
  const [isTagsOpen, setIsTagsOpen] = useState(true);
  const [isAddingCollection, setIsAddingCollection] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");

  const handleAddCollectionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCollectionName.trim()) {
      onCreateCollection(newCollectionName.trim());
      onSelectCollection(newCollectionName.trim());
      onViewChange("collection");
      setNewCollectionName("");
      setIsAddingCollection(false);
    }
  };

  return (
    <aside className="w-60 bg-[#121212] border-r border-neutral-800/80 flex flex-col shrink-0 select-none text-neutral-300 font-sans text-xs h-[calc(100vh-3.5rem)] overflow-y-auto custom-scrollbar">
      {/* Primary Section */}
      <div className="p-3 border-b border-neutral-800/60 flex flex-col gap-0.5">
        <span className="px-2 py-1 font-mono text-[9px] uppercase tracking-widest text-neutral-500 font-semibold">
          Archive
        </span>

        <button
          onClick={() => {
            onSelectCollection(null);
            onSelectTag(null);
            onViewChange("library");
          }}
          className={`w-[calc(100%-0.25rem)] text-left px-2 py-1.5 rounded flex items-center justify-between transition-colors cursor-pointer ${
            activeView === "library" && !selectedCollection && !selectedTag
              ? "bg-neutral-800 text-neutral-100 font-medium"
              : "hover:bg-neutral-900/80 text-neutral-400 hover:text-neutral-200"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Grid className="w-3.5 h-3.5 text-neutral-400" />
            <span>Library</span>
          </div>
          <span className="font-mono text-[10px] text-neutral-500">{counts.library}</span>
        </button>

        <button
          onClick={() => {
            onSelectCollection(null);
            onSelectTag(null);
            onViewChange("drafts");
          }}
          className={`w-[calc(100%-0.25rem)] text-left px-2 py-1.5 rounded flex items-center justify-between transition-colors cursor-pointer ${
            activeView === "drafts"
              ? "bg-neutral-800 text-amber-200 font-medium"
              : "hover:bg-neutral-900/80 text-neutral-400 hover:text-neutral-200"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <FileText className="w-3.5 h-3.5 text-amber-400/80" />
            <span>Drafts</span>
          </div>
          <span className="font-mono text-[10px] text-amber-400/80 font-semibold">
            {counts.drafts}
          </span>
        </button>

        <button
          onClick={() => {
            onSelectCollection(null);
            onSelectTag(null);
            onViewChange("published");
          }}
          className={`w-[calc(100%-0.25rem)] text-left px-2 py-1.5 rounded flex items-center justify-between transition-colors cursor-pointer ${
            activeView === "published"
              ? "bg-neutral-800 text-emerald-200 font-medium"
              : "hover:bg-neutral-900/80 text-neutral-400 hover:text-neutral-200"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Globe className="w-3.5 h-3.5 text-emerald-400/80" />
            <span>Published</span>
          </div>
          <span className="font-mono text-[10px] text-neutral-500">{counts.published}</span>
        </button>

        <button
          onClick={() => {
            onSelectCollection(null);
            onSelectTag(null);
            onViewChange("archived");
          }}
          className={`w-[calc(100%-0.25rem)] text-left px-2 py-1.5 rounded flex items-center justify-between transition-colors cursor-pointer ${
            activeView === "archived"
              ? "bg-neutral-800 text-neutral-100 font-medium"
              : "hover:bg-neutral-900/80 text-neutral-400 hover:text-neutral-200"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Archive className="w-3.5 h-3.5 text-neutral-400" />
            <span>Archive</span>
          </div>
          <span className="font-mono text-[10px] text-neutral-500">{counts.archived}</span>
        </button>

        <button
          onClick={() => {
            onSelectCollection(null);
            onSelectTag(null);
            onViewChange("trash");
          }}
          className={`w-[calc(100%-0.25rem)] text-left px-2 py-1.5 rounded flex items-center justify-between transition-colors cursor-pointer ${
            activeView === "trash"
              ? "bg-neutral-800 text-red-300 font-medium"
              : "hover:bg-neutral-900/80 text-neutral-400 hover:text-neutral-200"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Trash2 className="w-3.5 h-3.5 text-neutral-500" />
            <span>Trash</span>
          </div>
          <span className="font-mono text-[10px] text-neutral-500">{counts.trash}</span>
        </button>
      </div>

      {/* Editorial Workspaces Section */}
      <div className="p-3 border-b border-neutral-800/60 flex flex-col gap-0.5">
        <span className="px-2 py-1 font-mono text-[9px] uppercase tracking-widest text-neutral-500 font-semibold">
          Workspaces
        </span>

        <button
          onClick={() => {
            onSelectCollection(null);
            onSelectTag(null);
            onViewChange("journal");
          }}
          className={`w-[calc(100%-0.25rem)] text-left px-2 py-1.5 rounded flex items-center justify-between transition-colors cursor-pointer ${
            activeView === "journal"
              ? "bg-neutral-800 text-neutral-100 font-medium"
              : "hover:bg-neutral-900/80 text-neutral-400 hover:text-neutral-200"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-3.5 h-3.5 text-neutral-400" />
            <span>Journal</span>
          </div>
          <span className="font-mono text-[10px] text-neutral-500">{counts.journal}</span>
        </button>

        <button
          onClick={() => {
            onSelectCollection(null);
            onSelectTag(null);
            onViewChange("workshop");
          }}
          className={`w-[calc(100%-0.25rem)] text-left px-2 py-1.5 rounded flex items-center justify-between transition-colors cursor-pointer ${
            activeView === "workshop"
              ? "bg-neutral-800 text-neutral-100 font-medium"
              : "hover:bg-neutral-900/80 text-neutral-400 hover:text-neutral-200"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Wrench className="w-3.5 h-3.5 text-neutral-400" />
            <span>Workshop</span>
          </div>
          <span className="font-mono text-[10px] text-neutral-500">{counts.workshop}</span>
        </button>

        <button
          onClick={() => {
            onSelectCollection(null);
            onSelectTag(null);
            onViewChange("daily");
          }}
          className={`w-[calc(100%-0.25rem)] text-left px-2 py-1.5 rounded flex items-center justify-between transition-colors cursor-pointer ${
            activeView === "daily"
              ? "bg-neutral-800 text-neutral-100 font-medium"
              : "hover:bg-neutral-900/80 text-neutral-400 hover:text-neutral-200"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Calendar className="w-3.5 h-3.5 text-neutral-400" />
            <span>Daily Log</span>
          </div>
          <span className="font-mono text-[10px] text-amber-400 font-semibold">Today</span>
        </button>

        {/* Site Builder & Hero Manager Curation Tools */}
        <span className="px-2 pt-3 py-1 font-mono text-[9px] uppercase tracking-widest text-neutral-500 font-semibold border-t border-neutral-800/40 mt-1">
          Curation & Layout
        </span>

        <button
          onClick={() => {
            onSelectCollection(null);
            onSelectTag(null);
            onViewChange("site_builder");
          }}
          className={`w-[calc(100%-0.25rem)] text-left px-2 py-1.5 rounded flex items-center justify-between transition-colors cursor-pointer ${
            activeView === "site_builder"
              ? "bg-neutral-800 text-amber-200 font-medium"
              : "hover:bg-neutral-900/80 text-neutral-400 hover:text-neutral-200"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Layout className="w-3.5 h-3.5 text-amber-400" />
            <span>Site Builder</span>
          </div>
          <span className="font-mono text-[9px] bg-amber-950/80 text-amber-400 px-1.5 py-0.5 rounded border border-amber-900/50 uppercase font-mono font-bold">
            OS Editor
          </span>
        </button>

        <button
          onClick={() => {
            onSelectCollection(null);
            onSelectTag(null);
            onViewChange("hero_manager");
          }}
          className={`w-[calc(100%-0.25rem)] text-left px-2 py-1.5 rounded flex items-center justify-between transition-colors cursor-pointer ${
            activeView === "hero_manager"
              ? "bg-neutral-800 text-emerald-200 font-medium"
              : "hover:bg-neutral-900/80 text-neutral-400 hover:text-neutral-200"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Image className="w-3.5 h-3.5 text-emerald-400" />
            <span>Hero Manager</span>
          </div>
          <span className="font-mono text-[9px] bg-emerald-950/80 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-900/50 uppercase font-mono font-bold">
            Live
          </span>
        </button>
      </div>

      {/* Collections Section */}
      <div className="p-3 border-b border-neutral-800/60 flex flex-col gap-1">
        <div className="flex items-center justify-between px-2 py-1">
          <button
            onClick={() => setIsCollectionsOpen(!isCollectionsOpen)}
            className="flex items-center gap-1.5 text-neutral-500 hover:text-neutral-300 font-mono text-[9px] uppercase tracking-widest font-semibold cursor-pointer"
          >
            {isCollectionsOpen ? (
              <ChevronDown className="w-3 h-3" />
            ) : (
              <ChevronRight className="w-3 h-3" />
            )}
            <span>Collections</span>
          </button>
          <button
            onClick={() => setIsAddingCollection(true)}
            className="text-neutral-500 hover:text-neutral-200 p-0.5 cursor-pointer"
            title="Create Collection"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {isAddingCollection && (
          <form onSubmit={handleAddCollectionSubmit} className="px-2 my-1 flex gap-1">
            <input
              type="text"
              autoFocus
              value={newCollectionName}
              onChange={(e) => setNewCollectionName(e.target.value)}
              placeholder="Collection name..."
              className="w-full bg-[#1A1A1A] border border-neutral-700 text-xs px-2 py-1 text-neutral-200 focus:outline-none focus:border-neutral-500"
            />
            <button
              type="submit"
              className="bg-neutral-200 text-neutral-950 px-2 py-1 text-[10px] font-mono uppercase font-bold"
            >
              Add
            </button>
          </form>
        )}

        {isCollectionsOpen && (
          <div className="flex flex-col gap-0.5 pl-1">
            {collectionsList.map((col) => {
              const isSelected = activeView === "collection" && selectedCollection === col;
              return (
                <button
                  key={col}
                  onClick={() => {
                    onSelectTag(null);
                    onSelectCollection(col);
                    onViewChange("collection");
                  }}
                  className={`w-full text-left px-2 py-1 rounded flex items-center justify-between transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-neutral-800 text-neutral-100 font-medium"
                      : "hover:bg-neutral-900/80 text-neutral-400 hover:text-neutral-200"
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <FolderOpen className="w-3 h-3 text-neutral-500 shrink-0" />
                    <span className="truncate">{col}</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Tags Section */}
      <div className="p-3 border-b border-neutral-800/60 flex flex-col gap-1">
        <button
          onClick={() => setIsTagsOpen(!isTagsOpen)}
          className="flex items-center gap-1.5 px-2 py-1 text-neutral-500 hover:text-neutral-300 font-mono text-[9px] uppercase tracking-widest font-semibold cursor-pointer"
        >
          {isTagsOpen ? (
            <ChevronDown className="w-3 h-3" />
          ) : (
            <ChevronRight className="w-3 h-3" />
          )}
          <span>Tags ({tagsList.length})</span>
        </button>

        {isTagsOpen && (
          <div className="flex flex-wrap gap-1 px-2 py-1 max-h-48 overflow-y-auto">
            {tagsList.map((tag) => {
              const isSelected = activeView === "tag" && selectedTag === tag;
              return (
                <button
                  key={tag}
                  onClick={() => {
                    onSelectCollection(null);
                    onSelectTag(tag);
                    onViewChange("tag");
                  }}
                  className={`font-mono text-[10px] px-2 py-0.5 rounded-sm transition-colors cursor-pointer border ${
                    isSelected
                      ? "bg-neutral-100 text-neutral-950 border-neutral-100 font-semibold"
                      : "bg-neutral-900/60 text-neutral-400 border-neutral-800 hover:border-neutral-700 hover:text-neutral-200"
                  }`}
                >
                  {tag.startsWith("#") ? tag : `#${tag}`}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer Settings */}
      <div className="mt-auto p-3 border-t border-neutral-800/80">
        <button
          onClick={() => {
            onSelectCollection(null);
            onSelectTag(null);
            onViewChange("settings");
          }}
          className={`w-full text-left px-2 py-1.5 rounded flex items-center gap-2.5 transition-colors cursor-pointer ${
            activeView === "settings"
              ? "bg-neutral-800 text-neutral-100 font-medium"
              : "hover:bg-neutral-900/80 text-neutral-400 hover:text-neutral-200"
          }`}
        >
          <Settings className="w-3.5 h-3.5 text-neutral-400" />
          <span>System Settings</span>
        </button>
      </div>
    </aside>
  );
}
