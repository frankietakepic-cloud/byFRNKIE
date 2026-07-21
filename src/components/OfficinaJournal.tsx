import React, { useState, useEffect, useMemo } from "react";
import { JournalEntry, Photo, Project } from "../types";
import {
  BookOpen,
  Plus,
  FileText,
  Clock,
  Eye,
  Edit3,
  Save,
  Trash2,
  Globe,
  Sparkles,
  Search,
  History,
  X,
  Check,
  Link2,
  Code,
  Heading,
  Bold,
  Italic,
  Quote,
  Image as ImageIcon
} from "lucide-react";

interface OfficinaJournalProps {
  journals: JournalEntry[];
  photos: Photo[];
  projects: Project[];
  onSaveJournal: (journal: JournalEntry) => void;
  onDeleteJournal: (id: string) => void;
}

export default function OfficinaJournal({
  journals,
  photos,
  projects,
  onSaveJournal,
  onDeleteJournal
}: OfficinaJournalProps) {
  const [selectedJournalId, setSelectedJournalId] = useState<string | null>(
    journals.length > 0 ? journals[0].id : null
  );

  // Active journal state
  const activeJournal = useMemo(() => {
    return journals.find((j) => j.id === selectedJournalId) || null;
  }, [journals, selectedJournalId]);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Philosophy");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<"draft" | "published" | "archived">("draft");
  const [viewMode, setViewMode] = useState<"split" | "edit" | "preview">("split");
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);
  const [showRevisions, setShowRevisions] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Revisions store
  const [revisions, setRevisions] = useState<{ id: string; timestamp: string; content: string }[]>([]);

  // Load selected journal into editor
  useEffect(() => {
    if (activeJournal) {
      setTitle(activeJournal.title || "");
      setCategory(activeJournal.category || "Philosophy");
      setContent(activeJournal.content || "");
      setStatus(activeJournal.status || "published");
      setRevisions(activeJournal.revisions || []);
      setLastSavedTime("Synced");
    } else {
      setTitle("");
      setCategory("Philosophy");
      setContent("");
      setStatus("draft");
      setRevisions([]);
      setLastSavedTime(null);
    }
  }, [selectedJournalId]);

  // Word count & reading time
  const wordCount = useMemo(() => {
    if (!content.trim()) return 0;
    return content.trim().split(/\s+/).length;
  }, [content]);

  const readingTime = useMemo(() => {
    const mins = Math.ceil(wordCount / 200);
    return mins <= 1 ? "1 min read" : `${mins} min read`;
  }, [wordCount]);

  // Autosave simulation
  const handleAutoSave = () => {
    if (!title.trim() && !content.trim()) return;

    const timestamp = new Date().toISOString();
    const journalId = selectedJournalId || `journal-${Date.now()}`;

    const newRevision = {
      id: `rev-${Date.now()}`,
      timestamp,
      content
    };

    const updatedRevisions = [newRevision, ...revisions].slice(0, 10);

    const updated: JournalEntry = {
      id: journalId,
      title: title || "Untitled Observation",
      category,
      date: activeJournal?.date || new Date().toISOString().split("T")[0],
      content,
      status,
      wordCount,
      readingTime: parseInt(readingTime, 10) || 1,
      revisions: updatedRevisions
    };

    onSaveJournal(updated);
    setRevisions(updatedRevisions);
    if (!selectedJournalId) {
      setSelectedJournalId(journalId);
    }
    setLastSavedTime("Just now");
  };

  const handleCreateNew = () => {
    setSelectedJournalId(null);
    setTitle("New Observation");
    setCategory("Philosophy");
    setContent("# New Journal Entry\n\nBegin writing here...");
    setStatus("draft");
    setRevisions([]);
  };

  const insertMarkdownSyntax = (prefix: string, suffix: string = "") => {
    setContent((prev) => `${prev}\n${prefix}sample text${suffix}\n`);
  };

  const filteredJournals = useMemo(() => {
    if (!searchTerm.trim()) return journals;
    const term = searchTerm.toLowerCase();
    return journals.filter(
      (j) => j.title.toLowerCase().includes(term) || j.content.toLowerCase().includes(term) || j.category.toLowerCase().includes(term)
    );
  }, [journals, searchTerm]);

  return (
    <div className="flex-1 flex bg-[#121212] h-[calc(100vh-3.5rem)] overflow-hidden font-sans">
      {/* Journal Directory Sidebar */}
      <div className="w-64 bg-[#141414] border-r border-neutral-800/80 flex flex-col shrink-0 text-xs font-sans">
        <div className="p-3 border-b border-neutral-800/80 bg-[#171717] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-3.5 h-3.5 text-neutral-400" />
            <span className="font-serif font-semibold text-neutral-200">Journal Entries</span>
          </div>
          <button
            onClick={handleCreateNew}
            className="flex items-center gap-1 bg-neutral-100 hover:bg-white text-neutral-950 font-mono text-[10px] uppercase font-bold px-2 py-1 rounded-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3 h-3" />
            <span>New</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-2 border-b border-neutral-800/60 relative">
          <Search className="w-3 h-3 absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search entries..."
            className="w-full bg-[#1A1A1A] border border-neutral-800 text-[11px] pl-7 pr-2 py-1 text-neutral-200 focus:outline-none focus:border-neutral-600 font-sans"
          />
        </div>

        {/* Journal Entries List */}
        <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1 custom-scrollbar">
          {filteredJournals.map((j) => {
            const isSelected = j.id === selectedJournalId;
            return (
              <button
                key={j.id}
                onClick={() => setSelectedJournalId(j.id)}
                className={`w-full text-left p-2.5 rounded transition-colors cursor-pointer flex flex-col gap-1 border ${
                  isSelected
                    ? "bg-neutral-800 border-neutral-700 text-neutral-100 font-medium"
                    : "border-transparent hover:bg-neutral-900/80 text-neutral-400 hover:text-neutral-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-serif text-xs truncate max-w-36 text-neutral-200">{j.title}</span>
                  {j.status === "draft" && (
                    <span className="font-mono text-[8px] uppercase bg-amber-500/80 text-neutral-950 px-1 font-extrabold rounded-xs">
                      Draft
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between font-mono text-[9px] text-neutral-500">
                  <span>{j.category}</span>
                  <span>{j.date}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Writing Canvas */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#121212]">
        {/* Editor Toolbar */}
        <div className="px-5 py-2.5 bg-[#161616] border-b border-neutral-800/80 flex flex-wrap items-center justify-between gap-3 shrink-0 font-mono text-xs">
          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded p-0.5 text-[10px]">
              <button
                onClick={() => setViewMode("edit")}
                className={`px-2.5 py-1 rounded-xs transition-colors cursor-pointer ${
                  viewMode === "edit" ? "bg-neutral-800 text-neutral-100 font-bold" : "text-neutral-400 hover:text-neutral-200"
                }`}
              >
                Write
              </button>
              <button
                onClick={() => setViewMode("split")}
                className={`px-2.5 py-1 rounded-xs transition-colors cursor-pointer ${
                  viewMode === "split" ? "bg-neutral-800 text-neutral-100 font-bold" : "text-neutral-400 hover:text-neutral-200"
                }`}
              >
                Split
              </button>
              <button
                onClick={() => setViewMode("preview")}
                className={`px-2.5 py-1 rounded-xs transition-colors cursor-pointer ${
                  viewMode === "preview" ? "bg-neutral-800 text-neutral-100 font-bold" : "text-neutral-400 hover:text-neutral-200"
                }`}
              >
                Preview
              </button>
            </div>

            {/* Formatting Tools */}
            <div className="hidden md:flex items-center gap-1 border-l border-neutral-800 pl-3">
              <button onClick={() => insertMarkdownSyntax("# ")} className="p-1 hover:bg-neutral-800 rounded text-neutral-400 hover:text-neutral-200" title="Heading">
                <Heading className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => insertMarkdownSyntax("**", "**")} className="p-1 hover:bg-neutral-800 rounded text-neutral-400 hover:text-neutral-200" title="Bold">
                <Bold className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => insertMarkdownSyntax("*", "*")} className="p-1 hover:bg-neutral-800 rounded text-neutral-400 hover:text-neutral-200" title="Italic">
                <Italic className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => insertMarkdownSyntax("> ")} className="p-1 hover:bg-neutral-800 rounded text-neutral-400 hover:text-neutral-200" title="Quote">
                <Quote className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => insertMarkdownSyntax("```\n", "\n```")} className="p-1 hover:bg-neutral-800 rounded text-neutral-400 hover:text-neutral-200" title="Code Block">
                <Code className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Revisions History Drawer Trigger */}
            <button
              onClick={() => setShowRevisions(!showRevisions)}
              className="flex items-center gap-1.5 text-neutral-400 hover:text-neutral-200 text-[11px] cursor-pointer"
            >
              <History className="w-3.5 h-3.5" />
              <span>Revisions ({revisions.length})</span>
            </button>

            {/* Status Selector */}
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="bg-neutral-900 border border-neutral-800 text-[11px] px-2 py-1 text-neutral-200 focus:outline-none focus:border-neutral-600 font-mono"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>

            {/* Save Button */}
            <button
              onClick={handleAutoSave}
              className="bg-neutral-100 hover:bg-white text-neutral-950 font-mono text-[11px] uppercase font-bold px-3 py-1 rounded-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Entry</span>
            </button>
          </div>
        </div>

        {/* Word Count & Status Bar */}
        <div className="px-5 py-1.5 bg-[#141414] border-b border-neutral-800/60 flex items-center justify-between text-[10px] font-mono text-neutral-500 shrink-0">
          <div className="flex items-center gap-3">
            <span>{wordCount} Words</span>
            <span>•</span>
            <span>{readingTime}</span>
            {lastSavedTime && (
              <>
                <span>•</span>
                <span className="text-emerald-400/90">Autosaved ({lastSavedTime})</span>
              </>
            )}
          </div>
          <span>Obsidian-Style Markdown OS</span>
        </div>

        {/* Workspace Canvas (Split / Edit / Preview) */}
        <div className="flex-1 flex overflow-hidden relative">
          {/* Editor Input Area */}
          {(viewMode === "edit" || viewMode === "split") && (
            <div className={`flex-1 flex flex-col p-6 bg-[#121212] overflow-y-auto ${viewMode === "split" ? "border-r border-neutral-800/80" : ""}`}>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Entry Title..."
                className="w-full bg-transparent font-serif text-2xl text-neutral-100 mb-4 focus:outline-none border-b border-neutral-800/60 pb-2"
              />

              <div className="flex items-center gap-4 mb-4">
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Category (e.g. Philosophy, Craft)"
                  className="bg-neutral-900 border border-neutral-800 text-xs px-2.5 py-1 text-neutral-300 font-mono"
                />
              </div>

              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your observation in Markdown..."
                className="w-full flex-1 bg-transparent text-sm text-neutral-200 focus:outline-none font-sans leading-relaxed resize-none custom-scrollbar"
              />
            </div>
          )}

          {/* Live Preview Area */}
          {(viewMode === "preview" || viewMode === "split") && (
            <div className="flex-1 p-8 bg-[#101010] overflow-y-auto custom-scrollbar">
              <article className="prose prose-invert max-w-2xl mx-auto">
                <h1 className="font-serif text-3xl text-neutral-100 mb-2">{title || "Untitled Entry"}</h1>
                <div className="flex items-center gap-3 font-mono text-xs text-neutral-500 border-b border-neutral-800 pb-4 mb-6">
                  <span>{category}</span>
                  <span>•</span>
                  <span>{readingTime}</span>
                </div>

                <div className="text-sm leading-relaxed text-neutral-300 space-y-4 font-sans whitespace-pre-wrap">
                  {content || "Nothing written yet..."}
                </div>
              </article>
            </div>
          )}

          {/* Revisions Drawer */}
          {showRevisions && (
            <div className="w-72 bg-[#161616] border-l border-neutral-800 p-4 flex flex-col gap-3 font-mono text-xs z-20">
              <div className="flex justify-between items-center border-b border-neutral-800 pb-2">
                <span className="font-bold text-neutral-200">Revision History</span>
                <button onClick={() => setShowRevisions(false)} className="text-neutral-500 hover:text-neutral-300">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {revisions.length === 0 ? (
                <p className="text-[11px] text-neutral-500">No revisions recorded yet.</p>
              ) : (
                <div className="flex flex-col gap-2 overflow-y-auto max-h-[calc(100vh-10rem)]">
                  {revisions.map((rev, idx) => (
                    <button
                      key={rev.id}
                      onClick={() => setContent(rev.content)}
                      className="p-2.5 bg-neutral-900 border border-neutral-800 hover:border-neutral-600 rounded text-left transition-colors cursor-pointer flex flex-col gap-1"
                    >
                      <span className="text-[10px] text-neutral-400 font-bold">
                        Revision {revisions.length - idx}
                      </span>
                      <span className="text-[9px] text-neutral-500">{new Date(rev.timestamp).toLocaleTimeString()}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
