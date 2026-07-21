import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Layout,
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  Copy,
  Eye,
  Settings,
  Monitor,
  Tablet,
  Smartphone,
  Save,
  Check,
  RefreshCw,
  History,
  Sparkles,
  Layers,
  Globe,
  FileText,
  Sliders,
  Type,
  Maximize2,
  Grid,
  ChevronRight,
  X
} from "lucide-react";
import {
  PageLayout,
  PageComponent,
  ComponentType,
  Photo,
  JournalEntry,
  Project,
  PageComponentLayoutConfig
} from "../../types";

interface SiteBuilderWorkspaceProps {
  pages: PageLayout[];
  onSavePage: (page: PageLayout) => Promise<void>;
  onCreatePage: (title: string, slug: string) => Promise<PageLayout>;
  onDeletePage: (id: string) => Promise<void>;
  photos: Photo[];
  journals: JournalEntry[];
  projects: Project[];
}

const AVAILABLE_COMPONENTS: { type: ComponentType; label: string; description: string; icon: string }[] = [
  { type: "hero", label: "Live Hero Frame", description: "Connected live window into archive photography", icon: "Image" },
  { type: "editorial_text", label: "Editorial Text Block", description: "Prose paragraph with dropcaps and typography controls", icon: "Type" },
  { type: "manifesto", label: "Manifesto & Philosophy", description: "Dark highlighted block for core principles", icon: "Sparkles" },
  { type: "quote", label: "Block Quote", description: "Large serif pull quote", icon: "Quote" },
  { type: "image_grid", label: "Curated Image Grid", description: "Custom photo selection grid", icon: "Grid" },
  { type: "featured_collection", label: "Featured Collection", description: "Highlights curated photo bundles", icon: "Layers" },
  { type: "featured_journal", label: "Featured Journal Essay", description: "Card displaying latest essay with footnotes", icon: "FileText" },
  { type: "featured_project", label: "Featured Workshop Project", description: "Card displaying engineering project blueprint", icon: "Wrench" },
  { type: "timeline", label: "Timeline & Eras", description: "Chronological milestone timeline", icon: "Calendar" },
  { type: "gallery", label: "Live Archive Gallery", description: "Full photography collection feed", icon: "Globe" },
  { type: "map", label: "Geographic Teaser", description: "Location index card", icon: "Compass" },
  { type: "divider", label: "Architectural Divider", description: "Subtle border line separator", icon: "Minus" }
];

export default function SiteBuilderWorkspace({
  pages,
  onSavePage,
  onCreatePage,
  onDeletePage,
  photos,
  journals,
  projects
}: SiteBuilderWorkspaceProps) {
  const [selectedPageId, setSelectedPageId] = useState<string>(pages[0]?.id || "page-home");
  const [activeDevice, setActiveDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [editingComponent, setEditingComponent] = useState<PageComponent | null>(null);
  const [showComponentLibrary, setShowComponentLibrary] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [showNewPageModal, setShowNewPageModal] = useState(false);
  const [newPageTitle, setNewPageTitle] = useState("");
  const [newPageSlug, setNewPageSlug] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const activePage = pages.find((p) => p.id === selectedPageId || p.slug === selectedPageId) || pages[0];

  const handleUpdateActivePage = async (updatedPage: PageLayout) => {
    setIsSaving(true);
    try {
      await onSavePage(updatedPage);
      setSaveMessage("Saved Page");
      setTimeout(() => setSaveMessage(""), 2000);
    } catch (err) {
      console.error("Save page error", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddComponent = (type: ComponentType) => {
    if (!activePage) return;
    const newComp: PageComponent = {
      id: `comp-${Date.now()}`,
      type,
      title: type === "hero" ? "Living Archive Window" : `New ${type.replace(/_/g, " ")}`,
      content: "Enter editorial content or summary here...",
      layoutConfig: {
        containerWidth: "wide",
        background: "default",
        typography: "serif",
        alignment: "left"
      },
      visibleDevices: { desktop: true, tablet: true, mobile: true }
    };

    const updatedComponents = [...activePage.components, newComp];
    const updatedPage: PageLayout = {
      ...activePage,
      components: updatedComponents,
      updatedAt: new Date().toISOString()
    };

    handleUpdateActivePage(updatedPage);
    setShowComponentLibrary(false);
    setEditingComponent(newComp);
  };

  const handleMoveComponent = (index: number, direction: "up" | "down") => {
    if (!activePage) return;
    const newComponents = [...activePage.components];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newComponents.length) return;

    const temp = newComponents[index];
    newComponents[index] = newComponents[targetIndex];
    newComponents[targetIndex] = temp;

    handleUpdateActivePage({ ...activePage, components: newComponents });
  };

  const handleDeleteComponent = (id: string) => {
    if (!activePage) return;
    const filtered = activePage.components.filter((c) => c.id !== id);
    handleUpdateActivePage({ ...activePage, components: filtered });
    if (editingComponent?.id === id) setEditingComponent(null);
  };

  const handleDuplicateComponent = (comp: PageComponent) => {
    if (!activePage) return;
    const dup: PageComponent = {
      ...comp,
      id: `comp-${Date.now()}`,
      title: `${comp.title || "Component"} (Copy)`
    };
    handleUpdateActivePage({
      ...activePage,
      components: [...activePage.components, dup]
    });
  };

  const handleSaveComponentEdit = () => {
    if (!activePage || !editingComponent) return;
    const updatedComps = activePage.components.map((c) =>
      c.id === editingComponent.id ? editingComponent : c
    );
    handleUpdateActivePage({ ...activePage, components: updatedComps });
    setEditingComponent(null);
  };

  const handleCreateNewPage = async () => {
    if (!newPageTitle.trim()) return;
    try {
      const created = await onCreatePage(newPageTitle, newPageSlug);
      setSelectedPageId(created.id);
      setShowNewPageModal(false);
      setNewPageTitle("");
      setNewPageSlug("");
    } catch (err) {
      console.error("Create page error", err);
    }
  };

  const handlePublishPage = async () => {
    if (!activePage) return;
    const newVersion = {
      id: `v-${Date.now()}`,
      timestamp: new Date().toISOString(),
      label: `Published v${(activePage.versions?.length || 0) + 1}`,
      components: activePage.components
    };

    const updatedPage: PageLayout = {
      ...activePage,
      status: "published",
      updatedAt: new Date().toISOString(),
      versions: [newVersion, ...(activePage.versions || [])]
    };

    handleUpdateActivePage(updatedPage);
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-[#111111] text-neutral-100 font-sans selection:bg-neutral-800">
      {/* SIDEBAR 1: PAGE LIST & WORKSPACE NAVIGATION */}
      <div className="w-full md:w-64 border-r border-neutral-800/80 flex flex-col bg-[#141414] shrink-0">
        <div className="p-4 border-b border-neutral-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layout className="w-4 h-4 text-amber-400" />
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-200">
              Site Builder Pages
            </span>
          </div>
          <button
            onClick={() => setShowNewPageModal(true)}
            className="p-1 text-neutral-400 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded transition-colors cursor-pointer"
            title="Create New Page"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1 custom-scrollbar">
          {pages.map((p) => {
            const isSelected = p.id === selectedPageId || p.slug === selectedPageId;
            return (
              <button
                key={p.id}
                onClick={() => {
                  setSelectedPageId(p.id);
                  setEditingComponent(null);
                }}
                className={`w-full text-left px-3 py-2.5 rounded text-xs flex items-center justify-between transition-colors cursor-pointer ${
                  isSelected
                    ? "bg-neutral-800 text-neutral-100 font-medium border border-neutral-700/80"
                    : "hover:bg-neutral-900/80 text-neutral-400 hover:text-neutral-200"
                }`}
              >
                <div className="flex flex-col gap-0.5 truncate">
                  <span className="font-serif text-sm font-normal text-neutral-200 truncate">{p.title}</span>
                  <span className="font-mono text-[9px] text-neutral-500">/{p.slug}</span>
                </div>

                <span
                  className={`font-mono text-[8px] uppercase px-1.5 py-0.5 rounded font-bold ${
                    p.status === "published"
                      ? "bg-emerald-950 text-emerald-400 border border-emerald-900/50"
                      : "bg-amber-950 text-amber-400 border border-amber-900/50"
                  }`}
                >
                  {p.status}
                </span>
              </button>
            );
          })}
        </div>

        <div className="p-3 border-t border-neutral-800/80 font-mono text-[10px] text-neutral-500 flex flex-col gap-1">
          <span>L'Officina Site Engine</span>
          <span className="text-neutral-400 text-[9px]">Archive → Page Builder → Renderer</span>
        </div>
      </div>

      {/* MIDDLE COLUMN: LAYOUT CANVAS & REORDERING CONTROLS */}
      <div className="w-full md:w-[420px] border-r border-neutral-800/80 flex flex-col bg-[#161616] shrink-0 overflow-hidden">
        {/* Page Bar */}
        <div className="p-4 border-b border-neutral-800/80 flex items-center justify-between bg-[#141414]">
          <div className="flex flex-col">
            <h2 className="font-serif text-lg font-medium text-neutral-100">
              {activePage?.title || "Page Layout"}
            </h2>
            <span className="font-mono text-[10px] text-neutral-400">
              {activePage?.components?.length || 0} Components
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowComponentLibrary(true)}
              className="bg-amber-400 hover:bg-amber-300 text-neutral-950 px-3 py-1.5 rounded font-mono text-[10px] uppercase font-bold tracking-wider flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Component
            </button>
            <button
              onClick={handlePublishPage}
              disabled={isSaving}
              className="bg-emerald-950 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 px-3 py-1.5 rounded font-mono text-[10px] uppercase font-bold tracking-wider flex items-center gap-1 cursor-pointer transition-colors"
            >
              Publish
            </button>
          </div>
        </div>

        {/* Components List Drag & Reorder Column */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 custom-scrollbar">
          {activePage?.components?.map((comp, index) => {
            const isEditing = editingComponent?.id === comp.id;
            return (
              <div
                key={comp.id}
                className={`p-3 rounded-lg border transition-all flex flex-col gap-2 ${
                  isEditing
                    ? "bg-neutral-800 border-amber-500/80 shadow-lg"
                    : "bg-[#1C1C1C] border-neutral-800/90 hover:border-neutral-700"
                }`}
              >
                <div className="flex items-center justify-between font-mono text-[10px]">
                  <span className="bg-neutral-900 text-amber-400 px-2 py-0.5 rounded border border-neutral-800 uppercase font-bold">
                    {comp.type.replace(/_/g, " ")}
                  </span>

                  <div className="flex items-center gap-1 text-neutral-400">
                    <button
                      onClick={() => handleMoveComponent(index, "up")}
                      disabled={index === 0}
                      className="p-1 hover:text-white disabled:opacity-30 cursor-pointer"
                      title="Move Up"
                    >
                      <MoveUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleMoveComponent(index, "down")}
                      disabled={index === (activePage.components.length - 1)}
                      className="p-1 hover:text-white disabled:opacity-30 cursor-pointer"
                      title="Move Down"
                    >
                      <MoveDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDuplicateComponent(comp)}
                      className="p-1 hover:text-amber-400 cursor-pointer"
                      title="Duplicate Component"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteComponent(comp.id)}
                      className="p-1 hover:text-rose-400 cursor-pointer"
                      title="Delete Component"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <h4 className="font-serif text-sm font-medium text-neutral-200">
                    {comp.title || "Untitled Component"}
                  </h4>
                  {comp.subtitle && (
                    <span className="font-mono text-[9px] uppercase text-neutral-400">
                      {comp.subtitle}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => setEditingComponent(comp)}
                  className="w-full mt-1 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 py-1.5 px-3 rounded font-mono text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer border border-neutral-800"
                >
                  <Settings className="w-3 h-3 text-amber-400" />
                  <span>Configure Properties</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT COLUMN: RESPONSIVE PREVIEW & COMPONENT PROPERTY DRAWER */}
      <div className="flex-1 flex flex-col bg-[#0d0d0d] overflow-hidden relative">
        {/* Device Switcher Header */}
        <div className="p-4 border-b border-neutral-800/80 flex items-center justify-between bg-[#121212]">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-bold">
              CANVAS SIMULATOR:
            </span>
            <span className="font-serif text-sm text-neutral-200">{activePage?.title}</span>
          </div>

          <div className="flex items-center gap-2 bg-[#1A1A1A] p-1 border border-neutral-800 rounded">
            <button
              onClick={() => setActiveDevice("desktop")}
              className={`px-3 py-1 font-mono text-[10px] uppercase rounded transition-colors flex items-center gap-1 cursor-pointer ${
                activeDevice === "desktop"
                  ? "bg-neutral-200 text-neutral-950 font-bold"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              Desktop
            </button>
            <button
              onClick={() => setActiveDevice("tablet")}
              className={`px-3 py-1 font-mono text-[10px] uppercase rounded transition-colors flex items-center gap-1 cursor-pointer ${
                activeDevice === "tablet"
                  ? "bg-neutral-200 text-neutral-950 font-bold"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <Tablet className="w-3.5 h-3.5" />
              Tablet (768px)
            </button>
            <button
              onClick={() => setActiveDevice("mobile")}
              className={`px-3 py-1 font-mono text-[10px] uppercase rounded transition-colors flex items-center gap-1 cursor-pointer ${
                activeDevice === "mobile"
                  ? "bg-neutral-200 text-neutral-950 font-bold"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              Mobile (375px)
            </button>
          </div>
        </div>

        {/* Interactive Responsive Canvas Frame */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 flex justify-center custom-scrollbar">
          <div
            className={`transition-all duration-300 w-full bg-[#141414] border border-neutral-800 rounded-2xl p-6 md:p-10 shadow-2xl flex flex-col gap-12 ${
              activeDevice === "desktop"
                ? "max-w-5xl"
                : activeDevice === "tablet"
                ? "max-w-2xl"
                : "max-w-sm"
            }`}
          >
            {activePage?.components?.map((comp) => (
              <div
                key={comp.id}
                onClick={() => setEditingComponent(comp)}
                className={`p-4 rounded-xl border transition-all cursor-pointer relative group ${
                  editingComponent?.id === comp.id
                    ? "border-amber-400 bg-amber-950/10"
                    : "border-neutral-800/80 hover:border-neutral-700 bg-neutral-950/40"
                }`}
              >
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-neutral-900 border border-neutral-700 text-neutral-300 px-2 py-0.5 rounded font-mono text-[9px] uppercase">
                  Click to Edit
                </div>

                {comp.type === "hero" && (
                  <div className="flex flex-col gap-4">
                    <span className="font-mono text-[10px] uppercase text-emerald-400 tracking-wider font-bold">
                      {comp.subtitle || "LIVING ARCHIVE HERO"}
                    </span>
                    <h2 className="font-serif text-3xl font-medium leading-tight">
                      {comp.title || "Documenting life through photography..."}
                    </h2>
                    <div className="aspect-[16/8] w-full bg-neutral-900 rounded-lg overflow-hidden relative border border-neutral-800">
                      <img
                        src={photos[0]?.url || "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1200"}
                        alt="Hero"
                        className="w-full h-full object-cover grayscale-[15%]"
                      />
                    </div>
                  </div>
                )}

                {comp.type === "editorial_text" && (
                  <div className="flex flex-col gap-2 max-w-2xl">
                    {comp.subtitle && (
                      <span className="font-mono text-[10px] uppercase text-neutral-500 tracking-wider">
                        {comp.subtitle}
                      </span>
                    )}
                    <h3 className="font-serif text-2xl text-neutral-100 font-medium">{comp.title}</h3>
                    <p className="font-sans text-xs md:text-sm text-neutral-400 leading-relaxed">
                      {comp.content}
                    </p>
                  </div>
                )}

                {comp.type === "manifesto" && (
                  <div className="p-6 bg-[#181818] border border-neutral-800 rounded-xl flex flex-col gap-3">
                    <span className="font-mono text-[10px] uppercase text-amber-400 tracking-wider font-bold">
                      {comp.subtitle || "PHILOSOPHY"}
                    </span>
                    <h3 className="font-serif text-xl text-neutral-100 font-medium">{comp.title}</h3>
                    <p className="font-serif text-sm text-neutral-300 italic leading-relaxed">
                      "{comp.content}"
                    </p>
                    {comp.author && (
                      <span className="font-mono text-[10px] text-neutral-500 text-right">— {comp.author}</span>
                    )}
                  </div>
                )}

                {comp.type === "gallery" && (
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-serif text-xl text-neutral-100 font-medium">{comp.title || "Gallery"}</h3>
                      <span className="font-mono text-[10px] text-neutral-500 uppercase">{comp.sourceCollection || "All"}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {photos.slice(0, 3).map((p) => (
                        <div key={p.id} className="aspect-[4/3] bg-neutral-900 rounded overflow-hidden">
                          <img src={p.url} alt={p.title} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {comp.type !== "hero" && comp.type !== "editorial_text" && comp.type !== "manifesto" && comp.type !== "gallery" && (
                  <div className="flex flex-col gap-2">
                    <span className="font-mono text-[9px] uppercase text-amber-400 font-bold">{comp.type}</span>
                    <h4 className="font-serif text-lg text-neutral-200">{comp.title}</h4>
                    <p className="font-sans text-xs text-neutral-400">{comp.content}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* SIDE SHEET DRAWER FOR EDITING SELECTED COMPONENT PROPERTIES */}
        <AnimatePresence>
          {editingComponent && (
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-y-0 right-0 w-full md:w-[450px] bg-[#181818] border-l border-neutral-800 shadow-2xl z-30 flex flex-col p-6 overflow-y-auto custom-scrollbar gap-6"
            >
              <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
                <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4 text-amber-400" />
                  <span className="font-mono text-[10px] uppercase tracking-wider font-bold text-neutral-200">
                    Component Inspector
                  </span>
                </div>
                <button
                  onClick={() => setEditingComponent(null)}
                  className="p-1 text-neutral-400 hover:text-white bg-neutral-800 rounded cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form Controls */}
              <div className="flex flex-col gap-4 font-sans text-xs">
                <div className="flex flex-col gap-1">
                  <label className="font-mono text-[10px] uppercase text-neutral-400 font-bold">Title</label>
                  <input
                    type="text"
                    value={editingComponent.title || ""}
                    onChange={(e) =>
                      setEditingComponent((prev) => prev && { ...prev, title: e.target.value })
                    }
                    className="bg-[#121212] border border-neutral-800 p-2.5 rounded text-neutral-200 focus:outline-none focus:border-amber-400/80"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-mono text-[10px] uppercase text-neutral-400 font-bold">Subtitle / Eyebrow</label>
                  <input
                    type="text"
                    value={editingComponent.subtitle || ""}
                    onChange={(e) =>
                      setEditingComponent((prev) => prev && { ...prev, subtitle: e.target.value })
                    }
                    className="bg-[#121212] border border-neutral-800 p-2.5 rounded text-neutral-200 focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-mono text-[10px] uppercase text-neutral-400 font-bold">Content Prose</label>
                  <textarea
                    rows={4}
                    value={editingComponent.content || ""}
                    onChange={(e) =>
                      setEditingComponent((prev) => prev && { ...prev, content: e.target.value })
                    }
                    className="bg-[#121212] border border-neutral-800 p-2.5 rounded text-neutral-200 focus:outline-none custom-scrollbar"
                  />
                </div>

                {editingComponent.type === "manifesto" && (
                  <div className="flex flex-col gap-1">
                    <label className="font-mono text-[10px] uppercase text-neutral-400 font-bold">Author Line</label>
                    <input
                      type="text"
                      value={editingComponent.author || ""}
                      onChange={(e) =>
                        setEditingComponent((prev) => prev && { ...prev, author: e.target.value })
                      }
                      className="bg-[#121212] border border-neutral-800 p-2.5 rounded text-neutral-200"
                    />
                  </div>
                )}

                {/* Layout Config */}
                <div className="flex flex-col gap-3 border-t border-neutral-800 pt-4">
                  <span className="font-mono text-[10px] uppercase text-amber-400 font-bold">
                    Layout Configuration
                  </span>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="font-mono text-[9px] uppercase text-neutral-500">Width</label>
                      <select
                        value={editingComponent.layoutConfig?.containerWidth || "wide"}
                        onChange={(e) =>
                          setEditingComponent(
                            (prev) =>
                              prev && {
                                ...prev,
                                layoutConfig: {
                                  ...prev.layoutConfig,
                                  containerWidth: e.target.value as any
                                }
                              }
                          )
                        }
                        className="bg-[#121212] border border-neutral-800 p-2 rounded text-neutral-200 text-xs"
                      >
                        <option value="narrow font-medium">Narrow (Reading)</option>
                        <option value="medium">Medium</option>
                        <option value="wide">Wide</option>
                        <option value="full">Full Bleed</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="font-mono text-[9px] uppercase text-neutral-500">Background</label>
                      <select
                        value={editingComponent.layoutConfig?.background || "default"}
                        onChange={(e) =>
                          setEditingComponent(
                            (prev) =>
                              prev && {
                                ...prev,
                                layoutConfig: {
                                  ...prev.layoutConfig,
                                  background: e.target.value as any
                                }
                              }
                          )
                        }
                        className="bg-[#121212] border border-neutral-800 p-2 rounded text-neutral-200 text-xs"
                      >
                        <option value="default">Default Transparent</option>
                        <option value="dark">Dark Charcoal</option>
                        <option value="pitch">Pure Pitch Black</option>
                      </select>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleSaveComponentEdit}
                  className="mt-4 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-mono text-xs uppercase font-bold py-2.5 rounded transition-colors cursor-pointer"
                >
                  Save Properties
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MODAL: COMPONENT LIBRARY SELECTOR */}
        <AnimatePresence>
          {showComponentLibrary && (
            <div className="fixed inset-0 bg-neutral-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[#181818] border border-neutral-800 rounded-xl max-w-xl w-full p-6 flex flex-col gap-6 shadow-2xl"
              >
                <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                  <div className="flex flex-col">
                    <h3 className="font-serif text-xl font-medium text-neutral-100">
                      Editorial Component Library
                    </h3>
                    <span className="font-mono text-[10px] text-neutral-400">
                      Choose a component block to insert into the page layout
                    </span>
                  </div>
                  <button
                    onClick={() => setShowComponentLibrary(false)}
                    className="p-1 text-neutral-400 hover:text-white cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto custom-scrollbar pr-1">
                  {AVAILABLE_COMPONENTS.map((item) => (
                    <button
                      key={item.type}
                      onClick={() => handleAddComponent(item.type)}
                      className="text-left p-3.5 bg-[#121212] hover:bg-neutral-800 border border-neutral-800 hover:border-amber-400/60 rounded-lg flex flex-col gap-1.5 transition-all cursor-pointer group"
                    >
                      <span className="font-mono text-[9px] uppercase tracking-wider text-amber-400 font-bold group-hover:underline">
                        + {item.label}
                      </span>
                      <p className="font-sans text-xs text-neutral-400 font-light leading-relaxed">
                        {item.description}
                      </p>
                    </button>
                  ))}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* MODAL: CREATE NEW PAGE */}
        <AnimatePresence>
          {showNewPageModal && (
            <div className="fixed inset-0 bg-neutral-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[#181818] border border-neutral-800 rounded-xl max-w-md w-full p-6 flex flex-col gap-6 shadow-2xl"
              >
                <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                  <h3 className="font-serif text-xl font-medium text-neutral-100">
                    Create New Archive Page
                  </h3>
                  <button
                    onClick={() => setShowNewPageModal(false)}
                    className="p-1 text-neutral-400 hover:text-white cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex flex-col gap-4 font-sans text-xs">
                  <div className="flex flex-col gap-1">
                    <label className="font-mono text-[10px] uppercase text-neutral-400 font-bold">Page Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Field Observations 2026"
                      value={newPageTitle}
                      onChange={(e) => setNewPageTitle(e.target.value)}
                      className="bg-[#121212] border border-neutral-800 p-2.5 rounded text-neutral-200 focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-mono text-[10px] uppercase text-neutral-400 font-bold">URL Slug</label>
                    <input
                      type="text"
                      placeholder="field-observations"
                      value={newPageSlug}
                      onChange={(e) => setNewPageSlug(e.target.value)}
                      className="bg-[#121212] border border-neutral-800 p-2.5 rounded text-neutral-200 focus:outline-none"
                    />
                  </div>

                  <button
                    onClick={handleCreateNewPage}
                    disabled={!newPageTitle.trim()}
                    className="mt-2 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-mono text-xs uppercase font-bold py-2.5 rounded transition-colors cursor-pointer disabled:opacity-50"
                  >
                    Create Page
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
