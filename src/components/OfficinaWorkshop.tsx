import React, { useState, useMemo } from "react";
import { Project, Photo, JournalEntry, ProjectTimelineItem, ProjectPartItem } from "../types";
import {
  Wrench,
  Plus,
  Save,
  Trash2,
  Calendar,
  DollarSign,
  Layers,
  Image as ImageIcon,
  BookOpen,
  X,
  Check,
  ChevronRight,
  Sparkles
} from "lucide-react";

interface OfficinaWorkshopProps {
  projects: Project[];
  photos: Photo[];
  journals: JournalEntry[];
  onSaveProject: (project: Project) => void;
  onDeleteProject: (id: string) => void;
  onOpenLibraryPicker: (onSelect: (photo: Photo) => void) => void;
}

export default function OfficinaWorkshop({
  projects,
  photos,
  journals,
  onSaveProject,
  onDeleteProject,
  onOpenLibraryPicker
}: OfficinaWorkshopProps) {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    projects.length > 0 ? projects[0].id : null
  );

  const activeProject = useMemo(() => {
    return projects.find((p) => p.id === selectedProjectId) || null;
  }, [projects, selectedProjectId]);

  // Form states
  const [title, setTitle] = useState(activeProject?.title || "");
  const [category, setCategory] = useState(activeProject?.category || "Workshop");
  const [status, setStatus] = useState<"concept" | "in_progress" | "complete" | "archival">(
    activeProject?.status || "complete"
  );
  const [description, setDescription] = useState(activeProject?.description || "");
  const [processNotes, setProcessNotes] = useState(activeProject?.process || "");
  const [outcome, setOutcome] = useState(activeProject?.outcome || "");
  const [imageUrl, setImageUrl] = useState(activeProject?.imageUrl || "");
  const [researchNotes, setResearchNotes] = useState(activeProject?.researchNotes || "");
  const [lessonsLearned, setLessonsLearned] = useState(activeProject?.lessonsLearned || "");
  const [totalCost, setTotalCost] = useState(activeProject?.totalCost || "");

  // Arrays
  const [timeline, setTimeline] = useState<ProjectTimelineItem[]>(activeProject?.timeline || []);
  const [partsList, setPartsList] = useState<ProjectPartItem[]>(activeProject?.partsList || []);
  const [gallery, setGallery] = useState<string[]>(activeProject?.gallery || []);

  // Sync state when selected project changes
  React.useEffect(() => {
    if (activeProject) {
      setTitle(activeProject.title || "");
      setCategory(activeProject.category || "Workshop");
      setStatus(activeProject.status || "complete");
      setDescription(activeProject.description || "");
      setProcessNotes(activeProject.process || "");
      setOutcome(activeProject.outcome || "");
      setImageUrl(activeProject.imageUrl || "");
      setResearchNotes(activeProject.researchNotes || "");
      setLessonsLearned(activeProject.lessonsLearned || "");
      setTotalCost(activeProject.totalCost || "");
      setTimeline(activeProject.timeline || []);
      setPartsList(activeProject.partsList || []);
      setGallery(activeProject.gallery || []);
    }
  }, [selectedProjectId]);

  const handleSave = () => {
    const projId = selectedProjectId || `project-${Date.now()}`;
    const updated: Project = {
      id: projId,
      title: title || "Untitled Project",
      category,
      status,
      description,
      process: processNotes,
      outcome,
      imageUrl: imageUrl || "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1200&auto=format&fit=crop",
      timeline,
      partsList,
      totalCost,
      researchNotes,
      lessonsLearned,
      gallery
    };

    onSaveProject(updated);
    if (!selectedProjectId) setSelectedProjectId(projId);
  };

  const handleAddTimelineItem = () => {
    setTimeline((prev) => [
      ...prev,
      { date: new Date().toISOString().split("T")[0], note: "Project milestone update..." }
    ]);
  };

  const handleAddPartItem = () => {
    setPartsList((prev) => [...prev, { item: "Custom Stainless Spacer", cost: "$45.00", note: "316 Metal" }]);
  };

  const handleCreateNewProject = () => {
    setSelectedProjectId(null);
    setTitle("New Workshop Engineering Project");
    setCategory("Engineering");
    setStatus("concept");
    setDescription("Concept phase overview...");
    setProcessNotes("Engineering process steps...");
    setOutcome("Expected outcome...");
    setImageUrl("");
    setResearchNotes("");
    setLessonsLearned("");
    setTotalCost("$0.00");
    setTimeline([]);
    setPartsList([]);
    setGallery([]);
  };

  return (
    <div className="flex-1 flex bg-[#121212] h-[calc(100vh-3.5rem)] overflow-hidden font-sans">
      {/* Sidebar Directory */}
      <div className="w-64 bg-[#141414] border-r border-neutral-800/80 flex flex-col shrink-0 text-xs font-sans">
        <div className="p-3 border-b border-neutral-800/80 bg-[#171717] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wrench className="w-3.5 h-3.5 text-neutral-400" />
            <span className="font-serif font-semibold text-neutral-200">Workshop Projects</span>
          </div>
          <button
            onClick={handleCreateNewProject}
            className="bg-neutral-100 hover:bg-white text-neutral-950 font-mono text-[10px] uppercase font-bold px-2 py-1 rounded-xs transition-colors cursor-pointer flex items-center gap-1"
          >
            <Plus className="w-3 h-3" />
            <span>New</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1 custom-scrollbar">
          {projects.map((p) => {
            const isSelected = p.id === selectedProjectId;
            return (
              <button
                key={p.id}
                onClick={() => setSelectedProjectId(p.id)}
                className={`w-full text-left p-2.5 rounded transition-colors cursor-pointer flex flex-col gap-1 border ${
                  isSelected
                    ? "bg-neutral-800 border-neutral-700 text-neutral-100 font-medium"
                    : "border-transparent hover:bg-neutral-900/80 text-neutral-400 hover:text-neutral-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-serif text-xs truncate max-w-36 text-neutral-200">{p.title}</span>
                  <span className="font-mono text-[8px] uppercase px-1.5 py-0.5 font-bold rounded-xs bg-neutral-900 border border-neutral-800 text-neutral-400">
                    {p.status || "Active"}
                  </span>
                </div>
                <span className="font-mono text-[9px] text-neutral-500">{p.category}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Project Canvas */}
      <div className="flex-1 flex flex-col h-full overflow-y-auto bg-[#121212] custom-scrollbar">
        {/* Header Action Bar */}
        <div className="px-6 py-3 bg-[#161616] border-b border-neutral-800/80 flex items-center justify-between shrink-0 font-mono text-xs">
          <div className="flex items-center gap-3">
            <span className="text-neutral-400 uppercase font-bold">Project Workspace</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="bg-neutral-900 border border-neutral-800 text-[11px] px-2.5 py-1 text-neutral-200 focus:outline-none"
            >
              <option value="concept">Concept</option>
              <option value="in_progress">In Progress</option>
              <option value="complete">Complete</option>
              <option value="archival">Archival</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            {selectedProjectId && (
              <button
                onClick={() => onDeleteProject(selectedProjectId)}
                className="text-red-400 hover:text-red-300 px-3 py-1 text-xs transition-colors cursor-pointer"
              >
                Delete
              </button>
            )}
            <button
              onClick={handleSave}
              className="bg-neutral-100 hover:bg-white text-neutral-950 font-mono text-xs uppercase font-bold px-4 py-1.5 rounded-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Project</span>
            </button>
          </div>
        </div>

        {/* Project Content Form */}
        <div className="p-8 max-w-4xl mx-auto w-full flex flex-col gap-6">
          {/* Banner Image */}
          <div className="relative aspect-21/9 bg-neutral-950 border border-neutral-800 rounded overflow-hidden group">
            {imageUrl ? (
              <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-neutral-600 font-mono text-xs">
                <ImageIcon className="w-8 h-8 mb-2 stroke-[1.2]" />
                <span>No Banner Image Selected</span>
              </div>
            )}
            <button
              onClick={() => {
                onOpenLibraryPicker((photo) => {
                  setImageUrl(photo.url);
                });
              }}
              className="absolute bottom-3 right-3 bg-neutral-900/90 hover:bg-neutral-800 text-neutral-200 border border-neutral-700 px-3 py-1.5 font-mono text-[10px] uppercase font-bold rounded-xs transition-colors cursor-pointer"
            >
              Select Banner from Library
            </button>
          </div>

          {/* Title & Category */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 flex flex-col gap-1">
              <label className="font-mono text-[10px] uppercase text-neutral-400">Project Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title..."
                className="w-full bg-[#1A1A1A] border border-neutral-800 text-xl font-serif p-2.5 text-neutral-100 focus:outline-none focus:border-neutral-600"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-mono text-[10px] uppercase text-neutral-400">Category</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Category..."
                className="w-full bg-[#1A1A1A] border border-neutral-800 text-xs p-3 text-neutral-200 focus:outline-none focus:border-neutral-600 font-mono"
              />
            </div>
          </div>

          {/* Story & Overview */}
          <div className="flex flex-col gap-1">
            <label className="font-mono text-[10px] uppercase text-neutral-400">Overview / Purpose</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Why this project was undertaken..."
              className="w-full bg-[#1A1A1A] border border-neutral-800 text-xs p-3 text-neutral-200 focus:outline-none focus:border-neutral-600 font-sans leading-relaxed"
            />
          </div>

          {/* Process Notes (Markdown) */}
          <div className="flex flex-col gap-1">
            <label className="font-mono text-[10px] uppercase text-neutral-400">Process & Execution Log</label>
            <textarea
              rows={6}
              value={processNotes}
              onChange={(e) => setProcessNotes(e.target.value)}
              placeholder="Step by step engineering process log..."
              className="w-full bg-[#1A1A1A] border border-neutral-800 text-xs p-3 text-neutral-200 focus:outline-none focus:border-neutral-600 font-mono leading-relaxed"
            />
          </div>

          {/* Timeline & Parts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Timeline Log */}
            <div className="bg-[#161616] border border-neutral-800 p-4 rounded-xs flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                <span className="font-mono text-[10px] uppercase font-bold text-neutral-300">Timeline Log</span>
                <button
                  onClick={handleAddTimelineItem}
                  className="text-neutral-400 hover:text-neutral-200 font-mono text-[10px] uppercase underline cursor-pointer"
                >
                  + Add Item
                </button>
              </div>

              {timeline.map((item, idx) => (
                <div key={idx} className="flex gap-2 text-xs">
                  <input
                    type="date"
                    value={item.date}
                    onChange={(e) => {
                      const updated = [...timeline];
                      updated[idx].date = e.target.value;
                      setTimeline(updated);
                    }}
                    className="bg-neutral-900 border border-neutral-800 text-[10px] p-1 font-mono text-neutral-300"
                  />
                  <input
                    type="text"
                    value={item.note}
                    onChange={(e) => {
                      const updated = [...timeline];
                      updated[idx].note = e.target.value;
                      setTimeline(updated);
                    }}
                    className="flex-1 bg-neutral-900 border border-neutral-800 text-xs p-1 text-neutral-200"
                  />
                </div>
              ))}
            </div>

            {/* Parts List & Cost */}
            <div className="bg-[#161616] border border-neutral-800 p-4 rounded-xs flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                <span className="font-mono text-[10px] uppercase font-bold text-neutral-300">Parts List & Cost</span>
                <button
                  onClick={handleAddPartItem}
                  className="text-neutral-400 hover:text-neutral-200 font-mono text-[10px] uppercase underline cursor-pointer"
                >
                  + Add Part
                </button>
              </div>

              {partsList.map((part, idx) => (
                <div key={idx} className="flex gap-2 text-xs">
                  <input
                    type="text"
                    value={part.item}
                    onChange={(e) => {
                      const updated = [...partsList];
                      updated[idx].item = e.target.value;
                      setPartsList(updated);
                    }}
                    placeholder="Part Name"
                    className="flex-1 bg-neutral-900 border border-neutral-800 text-xs p-1 text-neutral-200"
                  />
                  <input
                    type="text"
                    value={part.cost || ""}
                    onChange={(e) => {
                      const updated = [...partsList];
                      updated[idx].cost = e.target.value;
                      setPartsList(updated);
                    }}
                    placeholder="$ Cost"
                    className="w-20 bg-neutral-900 border border-neutral-800 text-xs p-1 text-neutral-300 font-mono"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Research Notes & Lessons Learned */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="font-mono text-[10px] uppercase text-neutral-400">Research Notes</label>
              <textarea
                rows={4}
                value={researchNotes}
                onChange={(e) => setResearchNotes(e.target.value)}
                placeholder="Tolerances, specs, reference literature..."
                className="w-full bg-[#1A1A1A] border border-neutral-800 text-xs p-3 text-neutral-200 focus:outline-none focus:border-neutral-600 font-mono"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-mono text-[10px] uppercase text-neutral-400">Lessons Learned</label>
              <textarea
                rows={4}
                value={lessonsLearned}
                onChange={(e) => setLessonsLearned(e.target.value)}
                placeholder="What worked, what failed, design revisions..."
                className="w-full bg-[#1A1A1A] border border-neutral-800 text-xs p-3 text-neutral-200 focus:outline-none focus:border-neutral-600 font-mono"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
