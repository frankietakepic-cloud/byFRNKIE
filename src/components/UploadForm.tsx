import React, { useState, useRef } from "react";
import { API_URL } from "../lib/api";
import { 
  UploadCloud, Check, Camera, MapPin, Calendar, 
  BookOpen, Loader2, Edit, Trash2, Plus, ArrowUpRight, 
  Wrench, Layers, Eye, RefreshCw, FolderOpen, 
  ChevronUp, ChevronDown, Tag, Trash, FileText, CheckSquare, Square, Save
} from "lucide-react";
import { Photo, JournalEntry, Project } from "../types";

interface UploadFormProps {
  photos: Photo[];
  setPhotos: React.Dispatch<React.SetStateAction<Photo[]>>;
  journals: JournalEntry[];
  setJournals: React.Dispatch<React.SetStateAction<JournalEntry[]>>;
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  onPhotoUploaded: (photo: Photo) => void;
  onJournalPublished: (journal: JournalEntry) => void;
}

export default function UploadForm({ 
  photos, 
  setPhotos, 
  journals, 
  setJournals, 
  projects, 
  setProjects,
  onPhotoUploaded, 
  onJournalPublished 
}: UploadFormProps) {
  // Navigation for Admin Action Tabs
  const [adminTab, setAdminTab] = useState<"photos" | "journals" | "projects">("photos");
  const [activeForm, setActiveForm] = useState<"photo" | "journal" | "project">("photo");
  
  // PHOTOGRAPHY WORKBENCH SUB-TABS: "all" | "drafts" | "published"
  const [photoFilter, setPhotoFilter] = useState<"all" | "drafts" | "published">("all");

  // Selection states for Bulk Operations
  const [selectedPhotoIds, setSelectedPhotoIds] = useState<string[]>([]);
  const [activePhotoId, setActivePhotoId] = useState<string | null>(null);

  // Active photo local edit state (Metadata Inspector)
  const [inspectorTitle, setInspectorTitle] = useState("");
  const [inspectorCaption, setInspectorCaption] = useState("");
  const [inspectorLocation, setInspectorLocation] = useState("");
  const [inspectorDate, setInspectorDate] = useState("");
  const [inspectorCamera, setInspectorCamera] = useState("");
  const [inspectorLens, setInspectorLens] = useState("");
  const [inspectorAperture, setInspectorAperture] = useState("");
  const [inspectorShutter, setInspectorShutter] = useState("");
  const [inspectorIso, setInspectorIso] = useState("");
  const [inspectorCategory, setInspectorCategory] = useState("");
  const [inspectorStatus, setInspectorStatus] = useState<"draft" | "published">("draft");
  const [isInspectorSaving, setIsInspectorSaving] = useState(false);

  // Multi-file upload states
  const [isImporting, setIsImporting] = useState(false);
  const [importCount, setImportCount] = useState(0);
  const [importTotal, setImportTotal] = useState(0);

  // NEW Journal states
  const [journalTitle, setJournalTitle] = useState("");
  const [journalCategory, setJournalCategory] = useState("Philosophy");
  const [journalContent, setJournalContent] = useState("");
  const [journalDate, setJournalDate] = useState(new Date().toISOString().split("T")[0]);
  const [isJournalPublishing, setIsJournalPublishing] = useState(false);
  const [journalSuccess, setJournalSuccess] = useState(false);

  // NEW Project states
  const [projectTitle, setProjectTitle] = useState("");
  const [projectCategory, setProjectCategory] = useState("Engineering");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectProcess, setProjectProcess] = useState("");
  const [projectOutcome, setProjectOutcome] = useState("");
  const [projectBase64, setProjectBase64] = useState<string | null>(null);
  const [isProjectPublishing, setIsProjectPublishing] = useState(false);
  const [projectSuccess, setProjectSuccess] = useState(false);

  // EDITING States (Modals / Overlays for Journals / Projects)
  const [editingJournal, setEditingJournal] = useState<JournalEntry | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Replacement media states
  const [editProjectBase64, setEditProjectBase64] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const projectFileInputRef = useRef<HTMLInputElement>(null);
  const editProjectFileInputRef = useRef<HTMLInputElement>(null);

  // File drag & drop states for Photo Import
  const [dragActive, setDragActive] = useState(false);

  // Load selected photo into Inspector
  const handleLoadInspector = (photo: Photo) => {
    setActivePhotoId(photo.id);
    setInspectorTitle(photo.title || "");
    setInspectorCaption(photo.caption || "");
    setInspectorLocation(photo.location || "");
    setInspectorDate(photo.date || "");
    setInspectorCamera(photo.camera || "");
    setInspectorLens(photo.lens || "");
    setInspectorAperture(photo.aperture || "");
    setInspectorShutter(photo.shutterSpeed || "");
    setInspectorIso(photo.iso || "");
    setInspectorCategory(photo.category || "");
    setInspectorStatus(photo.status || "draft");
  };

  const getAuthHeaders = () => {
    const token = sessionStorage.getItem("officina_token") || "";
    return {
      "Content-Type": "application/json",
      ...(token ? { "Authorization": `Bearer ${token}` } : {})
    };
  };

  // MULTIPLE PHOTO IMPORT HANDLER
  const handleMultipleFilesImport = async (files: FileList) => {
    if (files.length === 0) return;
    setIsImporting(true);
    setImportTotal(files.length);
    setImportCount(0);

    const uploadedPhotos: Photo[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith("image/")) continue;

      setImportCount(i + 1);

      // Read file to base64
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(file);
      });

      try {
        const response = await fetch(`${API_URL}/api/photos`, {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({
            imageBase64: base64,
            title: "", // Do not invent title
            caption: "", // Do not invent caption
            location: "", // Do not invent location
            date: new Date().toISOString().split("T")[0], // Keep current date as file upload moment
            camera: "", // Do not invent camera
            lens: "", // Do not invent lens
            aperture: "",
            shutterSpeed: "",
            iso: "",
            status: "draft", // Defaults to Draft, Not Published
            category: ""
          })
        });

        if (response.ok) {
          const newPhoto = await response.json();
          uploadedPhotos.push(newPhoto);
          setPhotos(prev => [newPhoto, ...prev]);
        }
      } catch (err) {
        console.error("Failed to import photo:", file.name, err);
      }
    }

    setIsImporting(false);
    setImportTotal(0);
    setImportCount(0);

    if (uploadedPhotos.length > 0) {
      // Auto-focus on the first imported photo
      handleLoadInspector(uploadedPhotos[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleMultipleFilesImport(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleMultipleFilesImport(e.target.files);
    }
  };

  // PERSIST INDIVIDUAL PHOTO METADATA CHANGES FROM INSPECTOR
  const handleSaveInspector = async () => {
    if (!activePhotoId) return;
    setIsInspectorSaving(true);

    try {
      const response = await fetch(`${API_URL}/api/photos/${activePhotoId}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          title: inspectorTitle,
          caption: inspectorCaption,
          location: inspectorLocation,
          date: inspectorDate,
          camera: inspectorCamera,
          lens: inspectorLens,
          aperture: inspectorAperture,
          shutterSpeed: inspectorShutter,
          iso: inspectorIso,
          category: inspectorCategory,
          status: inspectorStatus
        })
      });

      if (response.ok) {
        const updatedPhoto = await response.json();
        setPhotos(prev => prev.map(p => p.id === updatedPhoto.id ? updatedPhoto : p));
        
        // Flash visual confirmation
        const saveIndicator = document.getElementById("save-indicator");
        if (saveIndicator) {
          saveIndicator.classList.remove("opacity-0");
          setTimeout(() => saveIndicator.classList.add("opacity-0"), 1500);
        }
      } else {
        alert("Failed to update photo metadata on the server.");
      }
    } catch (error) {
      console.error("Error saving photo metadata:", error);
      alert("Failed to reach server. Operating on local state fallback.");
      // Fallback local update
      setPhotos(prev => prev.map(p => p.id === activePhotoId ? {
        ...p,
        title: inspectorTitle,
        caption: inspectorCaption,
        location: inspectorLocation,
        date: inspectorDate,
        camera: inspectorCamera,
        lens: inspectorLens,
        aperture: inspectorAperture,
        shutterSpeed: inspectorShutter,
        iso: inspectorIso,
        category: inspectorCategory,
        status: inspectorStatus
      } : p));
    } finally {
      setIsInspectorSaving(false);
    }
  };

  // BULK OPERATION: SAVE COMPLETE ARRAY TO SERVER (REORDERS, STATUSES, TAGS)
  const savePhotosArrayToServer = async (newPhotosArray: Photo[]) => {
    try {
      const response = await fetch(`${API_URL}/api/photos`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ photos: newPhotosArray })
      });
      if (response.ok) {
        const resData = await response.json();
        if (resData.photos) {
          setPhotos(resData.photos);
        } else {
          setPhotos(newPhotosArray);
        }
      } else {
        setPhotos(newPhotosArray);
      }
    } catch (err) {
      console.error("Failed to persist photos state:", err);
      setPhotos(newPhotosArray);
    }
  };

  // BULK PUBLISH
  const handleBulkPublish = async () => {
    if (selectedPhotoIds.length === 0) return;
    const updatedPhotos = photos.map(p => 
      selectedPhotoIds.includes(p.id) ? { ...p, status: "published" as const } : p
    );
    await savePhotosArrayToServer(updatedPhotos);
    setSelectedPhotoIds([]);
    // Update active inspector if changed
    if (activePhotoId && selectedPhotoIds.includes(activePhotoId)) {
      setInspectorStatus("published");
    }
  };

  // BULK DRAFT (UNPUBLISH)
  const handleBulkUnpublish = async () => {
    if (selectedPhotoIds.length === 0) return;
    const updatedPhotos = photos.map(p => 
      selectedPhotoIds.includes(p.id) ? { ...p, status: "draft" as const } : p
    );
    await savePhotosArrayToServer(updatedPhotos);
    setSelectedPhotoIds([]);
    if (activePhotoId && selectedPhotoIds.includes(activePhotoId)) {
      setInspectorStatus("draft");
    }
  };

  // BULK DELETE
  const handleBulkDelete = async () => {
    if (selectedPhotoIds.length === 0) return;
    if (!confirm(`Are you sure you want to delete the ${selectedPhotoIds.length} selected photographs?`)) return;

    const remainingPhotos = photos.filter(p => !selectedPhotoIds.includes(p.id));
    await savePhotosArrayToServer(remainingPhotos);
    setSelectedPhotoIds([]);
    if (activePhotoId && selectedPhotoIds.includes(activePhotoId)) {
      setActivePhotoId(null);
    }
  };

  // BULK TAG / CATEGORY
  const handleBulkTag = async () => {
    if (selectedPhotoIds.length === 0) return;
    const tag = prompt("Enter category / tag to assign to all selected photos:");
    if (tag === null) return; // cancelled

    const updatedPhotos = photos.map(p => 
      selectedPhotoIds.includes(p.id) ? { ...p, category: tag } : p
    );
    await savePhotosArrayToServer(updatedPhotos);
    setSelectedPhotoIds([]);
    if (activePhotoId && selectedPhotoIds.includes(activePhotoId)) {
      setInspectorCategory(tag);
    }
  };

  // BULK RENAME SEQUENTIALLY
  const handleBulkRename = async () => {
    if (selectedPhotoIds.length === 0) return;
    const baseTitle = prompt("Enter base sequential title (e.g. Higashiyama morning):");
    if (!baseTitle) return;

    let index = 1;
    const updatedPhotos = photos.map(p => {
      if (selectedPhotoIds.includes(p.id)) {
        const itemTitle = `${baseTitle} - ${index}`;
        index++;
        return { ...p, title: itemTitle };
      }
      return p;
    });

    await savePhotosArrayToServer(updatedPhotos);
    setSelectedPhotoIds([]);
    if (activePhotoId && selectedPhotoIds.includes(activePhotoId)) {
      const idxInSelection = selectedPhotoIds.indexOf(activePhotoId);
      if (idxInSelection !== -1) {
        setInspectorTitle(`${baseTitle} - ${idxInSelection + 1}`);
      }
    }
  };

  // BULK REORDER: TO TOP
  const handleBulkMoveToTop = async () => {
    if (selectedPhotoIds.length === 0) return;
    const selected = photos.filter(p => selectedPhotoIds.includes(p.id));
    const unselected = photos.filter(p => !selectedPhotoIds.includes(p.id));
    const reordered = [...selected, ...unselected];
    await savePhotosArrayToServer(reordered);
    setSelectedPhotoIds([]);
  };

  // BULK REORDER: TO BOTTOM
  const handleBulkMoveToBottom = async () => {
    if (selectedPhotoIds.length === 0) return;
    const selected = photos.filter(p => selectedPhotoIds.includes(p.id));
    const unselected = photos.filter(p => !selectedPhotoIds.includes(p.id));
    const reordered = [...unselected, ...selected];
    await savePhotosArrayToServer(reordered);
    setSelectedPhotoIds([]);
  };

  // SINGLE ITEM REORDER: UP
  const handleMovePhotoUp = async (id: string) => {
    const idx = photos.findIndex(p => p.id === id);
    if (idx <= 0) return; // Already at top

    const updated = [...photos];
    // Swap
    const temp = updated[idx];
    updated[idx] = updated[idx - 1];
    updated[idx - 1] = temp;

    await savePhotosArrayToServer(updated);
  };

  // SINGLE ITEM REORDER: DOWN
  const handleMovePhotoDown = async (id: string) => {
    const idx = photos.findIndex(p => p.id === id);
    if (idx === -1 || idx === photos.length - 1) return; // Already at bottom

    const updated = [...photos];
    const temp = updated[idx];
    updated[idx] = updated[idx + 1];
    updated[idx + 1] = temp;

    await savePhotosArrayToServer(updated);
  };

  // JOURNAL: SUBMIT NEW
  const handleJournalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!journalTitle || !journalContent) {
      alert("Please fill in all journal fields.");
      return;
    }

    setIsJournalPublishing(true);
    try {
      const response = await fetch(`${API_URL}/api/journals`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          title: journalTitle,
          category: journalCategory,
          content: journalContent,
          date: journalDate
        })
      });

      if (response.ok) {
        const newJournal = await response.json();
        setJournals(prev => [newJournal, ...prev]);
        setJournalSuccess(true);
        setTimeout(() => {
          setJournalSuccess(false);
          setJournalTitle("");
          setJournalContent("");
        }, 3000);
      } else {
        const err = await response.json();
        alert(err.error || "Failed to publish journal entry");
      }
    } catch (error) {
      console.error("Error publishing journal:", error);
      alert("Failed to reach server. Saved in local state.");
      const mockJournal: JournalEntry = {
        id: `local-journal-${Date.now()}`,
        title: journalTitle,
        category: journalCategory,
        date: journalDate,
        content: journalContent
      };
      onJournalPublished(mockJournal);
      setJournalSuccess(true);
      setTimeout(() => {
        setJournalSuccess(false);
        setJournalTitle("");
        setJournalContent("");
      }, 3000);
    } finally {
      setIsJournalPublishing(false);
    }
  };

  // JOURNAL: UPDATE EXISTING
  const handleJournalUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingJournal) return;

    try {
      const response = await fetch(`${API_URL}/api/journals/${editingJournal.id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          title: editingJournal.title,
          category: editingJournal.category,
          content: editingJournal.content,
          date: editingJournal.date
        })
      });

      if (response.ok) {
        const updatedJournal = await response.json();
        setJournals(prev => prev.map(j => j.id === updatedJournal.id ? updatedJournal : j));
        setEditingJournal(null);
        alert("Journal entry updated successfully.");
      } else {
        const err = await response.json();
        alert(err.error || "Failed to update journal");
      }
    } catch (error) {
      console.error("Error updating journal:", error);
      setJournals(prev => prev.map(j => j.id === editingJournal.id ? editingJournal : j));
      setEditingJournal(null);
      alert("Updated local state fallback.");
    }
  };

  // JOURNAL: DELETE
  const handleJournalDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this journal entry from the Archive?")) return;

    try {
      const response = await fetch(`${API_URL}/api/journals/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders()
      });

      if (response.ok) {
        setJournals(prev => prev.filter(j => j.id !== id));
        alert("Journal entry deleted successfully.");
      } else {
        const err = await response.json();
        alert(err.error || "Failed to delete journal");
      }
    } catch (error) {
      console.error("Error deleting journal:", error);
      setJournals(prev => prev.filter(j => j.id !== id));
      alert("Deleted from local state fallback.");
    }
  };

  // PROJECT: SUBMIT NEW
  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectTitle || !projectDescription || !projectProcess || !projectOutcome) {
      alert("Please fill in all project fields.");
      return;
    }

    setIsProjectPublishing(true);
    try {
      const response = await fetch(`${API_URL}/api/projects`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          title: projectTitle,
          category: projectCategory,
          description: projectDescription,
          process: projectProcess,
          outcome: projectOutcome,
          imageBase64: projectBase64
        })
      });

      if (response.ok) {
        const newProject = await response.json();
        setProjects(prev => [newProject, ...prev]);
        setProjectSuccess(true);
        setTimeout(() => {
          setProjectSuccess(false);
          setProjectTitle("");
          setProjectDescription("");
          setProjectProcess("");
          setProjectOutcome("");
          setProjectBase64(null);
        }, 3000);
      } else {
        const err = await response.json();
        alert(err.error || "Failed to save project");
      }
    } catch (error) {
      console.error("Error saving project:", error);
      const mockProject: Project = {
        id: `local-project-${Date.now()}`,
        title: projectTitle,
        category: projectCategory,
        description: projectDescription,
        process: projectProcess,
        outcome: projectOutcome,
        imageUrl: projectBase64 || "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1200&auto=format&fit=crop"
      };
      setProjects(prev => [mockProject, ...prev]);
      setProjectSuccess(true);
      setTimeout(() => {
        setProjectSuccess(false);
        setProjectTitle("");
        setProjectDescription("");
        setProjectProcess("");
        setProjectOutcome("");
        setProjectBase64(null);
      }, 3000);
    } finally {
      setIsProjectPublishing(false);
    }
  };

  // PROJECT: UPDATE EXISTING
  const handleProjectUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    try {
      const response = await fetch(`${API_URL}/api/projects/${editingProject.id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          title: editingProject.title,
          category: editingProject.category,
          description: editingProject.description,
          process: editingProject.process,
          outcome: editingProject.outcome,
          imageBase64: editProjectBase64 || undefined
        })
      });

      if (response.ok) {
        const updatedProject = await response.json();
        setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
        setEditingProject(null);
        setEditProjectBase64(null);
        alert("Project updated successfully.");
      } else {
        const err = await response.json();
        alert(err.error || "Failed to update project");
      }
    } catch (error) {
      console.error("Error updating project:", error);
      const updatedLocal: Project = {
        ...editingProject,
        imageUrl: editProjectBase64 || editingProject.imageUrl || ""
      };
      setProjects(prev => prev.map(p => p.id === updatedLocal.id ? updatedLocal : p));
      setEditingProject(null);
      setEditProjectBase64(null);
      alert("Updated local state fallback.");
    }
  };

  // PROJECT: DELETE
  const handleProjectDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      const response = await fetch(`${API_URL}/api/projects/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders()
      });

      if (response.ok) {
        setProjects(prev => prev.filter(p => p.id !== id));
        alert("Project deleted successfully.");
      } else {
        const err = await response.json();
        alert(err.error || "Failed to delete project");
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      setProjects(prev => prev.filter(p => p.id !== id));
      alert("Deleted from local state fallback.");
    }
  };

  // Toggle selection for photo
  const toggleSelectPhoto = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid activating the inspector
    setSelectedPhotoIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = (filteredPhotos: Photo[]) => {
    const filteredIds = filteredPhotos.map(p => p.id);
    const allSelected = filteredIds.every(id => selectedPhotoIds.includes(id));
    if (allSelected) {
      // Unselect all filtered
      setSelectedPhotoIds(prev => prev.filter(id => !filteredIds.includes(id)));
    } else {
      // Select all filtered
      setSelectedPhotoIds(prev => {
        const union = new Set([...prev, ...filteredIds]);
        return Array.from(union);
      });
    }
  };

  // Filter photos array for render
  const filteredPhotos = photos.filter(p => {
    if (photoFilter === "drafts") return p.status === "draft";
    if (photoFilter === "published") return p.status === "published" || p.status === undefined;
    return true; // "all"
  });

  return (
    <div className="w-full flex flex-col gap-6 bg-[#161616] border border-neutral-800 p-4 sm:p-6 text-neutral-200">
      
      {/* Top Navigation Row */}
      <div className="flex flex-wrap border-b border-neutral-800 pb-3 gap-4 justify-between items-center">
        <div className="flex gap-4">
          <button
            onClick={() => setAdminTab("photos")}
            className={`font-mono text-[10px] tracking-widest uppercase pb-1 flex items-center gap-1.5 border-b-2 transition-all duration-200 ${
              adminTab === "photos"
                ? "text-neutral-100 border-neutral-400 font-semibold"
                : "text-neutral-500 border-transparent hover:text-neutral-300"
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            L'Officina Photography Desk
          </button>

          <button
            onClick={() => setAdminTab("journals")}
            className={`font-mono text-[10px] tracking-widest uppercase pb-1 flex items-center gap-1.5 border-b-2 transition-all duration-200 ${
              adminTab === "journals"
                ? "text-neutral-100 border-neutral-400 font-semibold"
                : "text-neutral-500 border-transparent hover:text-neutral-300"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Manage Journal
          </button>

          <button
            onClick={() => setAdminTab("projects")}
            className={`font-mono text-[10px] tracking-widest uppercase pb-1 flex items-center gap-1.5 border-b-2 transition-all duration-200 ${
              adminTab === "projects"
                ? "text-neutral-100 border-neutral-400 font-semibold"
                : "text-neutral-500 border-transparent hover:text-neutral-300"
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            Manage Projects
          </button>
        </div>

        <div className="font-mono text-[9px] text-neutral-400 bg-neutral-900 px-2 py-0.5 border border-neutral-800 flex items-center gap-1">
          <Check className="w-2.5 h-2.5 text-emerald-500" /> Professional Workbench Active
        </div>
      </div>

      {/* ========================================================
          1. PHOTOGRAPHY DESK (LIGHTROOM LIGHT ARCHITECTURE)
          ======================================================== */}
      {adminTab === "photos" && (
        <div className="flex flex-col gap-6">
          
          {/* Sub Row: Drag and Drop Import Zone (Import raw photographs) */}
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border border-dashed p-6 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center min-h-[120px] bg-neutral-950/40 relative group ${
              dragActive ? "border-neutral-200 bg-neutral-900/60" : "border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900/10"
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
              multiple
            />
            {isImporting ? (
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
                <span className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest">
                  Importing Photograph {importCount} of {importTotal}...
                </span>
                <p className="font-sans text-[11px] text-neutral-500">Creating temporary draft entries automatically</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <UploadCloud className="w-6 h-6 text-neutral-500 group-hover:text-neutral-300 transition-colors" />
                <p className="font-serif text-sm text-neutral-300">
                  Drag & Drop one or multiple photographs to import them as Drafts
                </p>
                <p className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest">
                  Click to select files (Supports bulk raw upload) // Status: Draft, Not Published
                </p>
              </div>
            )}
          </div>

          {/* Lightroom Two-Column Workbench Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* COLUMN 1: GRID & CONTROLS (col-span-8) */}
            <div className="lg:col-span-8 flex flex-col gap-4">
              
              {/* Grid Sub-header: Filters & Selection operations */}
              <div className="flex flex-wrap items-center justify-between gap-4 bg-neutral-950/60 border border-neutral-800 p-2 sm:px-4">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-neutral-500">
                    Filter View:
                  </span>
                  <div className="flex bg-neutral-900 p-0.5 border border-neutral-800 text-[9px] font-mono">
                    <button
                      onClick={() => setPhotoFilter("all")}
                      className={`px-2.5 py-1 uppercase tracking-wider transition-colors ${
                        photoFilter === "all" ? "bg-neutral-800 text-neutral-100 font-semibold" : "text-neutral-500 hover:text-neutral-300"
                      }`}
                    >
                      All ({photos.length})
                    </button>
                    <button
                      onClick={() => {
                        setPhotoFilter("drafts");
                        setSelectedPhotoIds([]);
                      }}
                      className={`px-2.5 py-1 uppercase tracking-wider transition-colors flex items-center gap-1 ${
                        photoFilter === "drafts" ? "bg-neutral-800 text-neutral-100 font-semibold" : "text-neutral-500 hover:text-neutral-300"
                      }`}
                    >
                      Drafts ({photos.filter(p => p.status === "draft").length})
                    </button>
                    <button
                      onClick={() => {
                        setPhotoFilter("published");
                        setSelectedPhotoIds([]);
                      }}
                      className={`px-2.5 py-1 uppercase tracking-wider transition-colors flex items-center gap-1 ${
                        photoFilter === "published" ? "bg-neutral-800 text-neutral-100 font-semibold" : "text-neutral-500 hover:text-neutral-300"
                      }`}
                    >
                      Published ({photos.filter(p => p.status === "published" || p.status === undefined).length})
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleSelectAll(filteredPhotos)}
                    className="font-mono text-[9px] uppercase text-neutral-400 hover:text-neutral-200 transition-colors flex items-center gap-1"
                  >
                    {filteredPhotos.every(p => selectedPhotoIds.includes(p.id)) && filteredPhotos.length > 0 ? (
                      <><CheckSquare className="w-3.5 h-3.5" /> Clear Select</>
                    ) : (
                      <><Square className="w-3.5 h-3.5" /> Select All Current</>
                    )}
                  </button>
                </div>
              </div>

              {/* Bulk Actions Panel (Triggers if one or more is selected) */}
              {selectedPhotoIds.length > 0 && (
                <div className="bg-neutral-900/95 border border-neutral-800 p-3 flex flex-col gap-2.5 animate-fade-in shadow-xl">
                  <div className="flex items-center justify-between border-b border-neutral-800 pb-1.5">
                    <span className="font-mono text-[10px] uppercase text-neutral-300 font-semibold flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-neutral-400" />
                      Bulk Editorial Operations ({selectedPhotoIds.length} items selected)
                    </span>
                    <button
                      onClick={() => setSelectedPhotoIds([])}
                      className="font-mono text-[9px] uppercase text-red-400 hover:text-red-300 transition-colors"
                    >
                      Cancel selection
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={handleBulkPublish}
                      className="px-2.5 py-1 bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-900/60 text-emerald-400 font-mono text-[9px] uppercase tracking-wider transition-colors"
                    >
                      Publish to Galleria
                    </button>
                    <button
                      onClick={handleBulkUnpublish}
                      className="px-2.5 py-1 bg-amber-950/40 hover:bg-amber-900/60 border border-amber-900/60 text-amber-400 font-mono text-[9px] uppercase tracking-wider transition-colors"
                    >
                      Revert to Draft
                    </button>
                    <button
                      onClick={handleBulkTag}
                      className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-300 font-mono text-[9px] uppercase tracking-wider transition-colors"
                    >
                      Tag / Category
                    </button>
                    <button
                      onClick={handleBulkRename}
                      className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-300 font-mono text-[9px] uppercase tracking-wider transition-colors"
                    >
                      Sequence Rename
                    </button>
                    <button
                      onClick={handleBulkMoveToTop}
                      className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-300 font-mono text-[9px] uppercase tracking-wider transition-colors flex items-center gap-1"
                    >
                      <ChevronUp className="w-3 h-3" /> Move to Top
                    </button>
                    <button
                      onClick={handleBulkMoveToBottom}
                      className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-300 font-mono text-[9px] uppercase tracking-wider transition-colors flex items-center gap-1"
                    >
                      <ChevronDown className="w-3 h-3" /> Move to Bottom
                    </button>
                    <button
                      onClick={handleBulkDelete}
                      className="px-2.5 py-1 bg-red-950/40 hover:bg-red-900/60 border border-red-900/60 text-red-400 font-mono text-[9px] uppercase tracking-wider transition-colors"
                    >
                      Delete Forever
                    </button>
                  </div>
                </div>
              )}

              {/* The Grid of Thumbnails */}
              {filteredPhotos.length === 0 ? (
                <div className="border border-neutral-800/60 py-12 px-6 text-center text-neutral-500 font-sans text-xs">
                  No photographs found matching current filters.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {filteredPhotos.map((photo, index) => {
                    const isSelected = selectedPhotoIds.includes(photo.id);
                    const isActive = activePhotoId === photo.id;

                    return (
                      <div
                        key={photo.id}
                        onClick={() => handleLoadInspector(photo)}
                        className={`group border p-1.5 transition-all duration-300 relative cursor-pointer flex flex-col justify-between ${
                          isActive 
                            ? "bg-neutral-800 border-neutral-400" 
                            : isSelected 
                            ? "bg-neutral-900/80 border-neutral-700" 
                            : "bg-neutral-950/60 border-neutral-900 hover:border-neutral-800"
                        }`}
                      >
                        {/* Custom selection box overlay */}
                        <button
                          onClick={(e) => toggleSelectPhoto(photo.id, e)}
                          className="absolute top-2.5 left-2.5 z-10 p-1 bg-black/80 hover:bg-black transition-colors border border-neutral-800 text-neutral-400 hover:text-white"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-3.5 h-3.5 text-neutral-200" />
                          ) : (
                            <Square className="w-3.5 h-3.5 text-neutral-500" />
                          )}
                        </button>

                        {/* Top corner ordering and status metadata tags */}
                        <div className="absolute top-2.5 right-2.5 z-10 flex gap-1 items-center">
                          {photo.status === "draft" ? (
                            <span className="font-mono text-[8px] bg-amber-950/90 border border-amber-900 text-amber-300 px-1 py-0.5 font-bold uppercase tracking-wider">
                              Draft
                            </span>
                          ) : (
                            <span className="font-mono text-[8px] bg-emerald-950/90 border border-emerald-900 text-emerald-300 px-1 py-0.5 font-bold uppercase tracking-wider">
                              Published
                            </span>
                          )}
                        </div>

                        {/* Main Media thumbnail */}
                        <div className="aspect-[4/3] w-full overflow-hidden bg-black border border-neutral-900 mb-2">
                          <img
                            src={photo.url}
                            alt={photo.title || "Observation"}
                            className="w-full h-full object-cover grayscale-[10%] group-hover:grayscale-0 transition-all duration-500"
                          />
                        </div>

                        {/* Caption details and titles */}
                        <div className="flex flex-col gap-1 min-w-0 px-0.5 pb-1">
                          <h4 className="font-serif text-[11px] font-medium text-neutral-200 truncate leading-snug">
                            {photo.title || <span className="text-neutral-600 italic">Untitled photograph</span>}
                          </h4>
                          
                          <div className="flex items-center justify-between text-[8px] font-mono text-neutral-500">
                            <span className="truncate max-w-[80px]">
                              {photo.category ? `#${photo.category}` : <span className="text-neutral-700 italic">No tag</span>}
                            </span>
                            <span className="text-neutral-600">No. {photos.indexOf(photo) + 1}</span>
                          </div>
                        </div>

                        {/* Reordering micro controls appearing on hover */}
                        <div className="absolute inset-x-0 bottom-0 bg-black/90 p-1 border-t border-neutral-800 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                          <span className="font-mono text-[8px] text-neutral-500 uppercase tracking-widest pl-1">
                            Sequence controls:
                          </span>
                          <div className="flex gap-1">
                            <button
                              disabled={photos.indexOf(photo) === 0}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMovePhotoUp(photo.id);
                              }}
                              className="p-1 text-neutral-400 hover:text-white border border-neutral-800 hover:bg-neutral-800 cursor-pointer disabled:opacity-30"
                              title="Move sequence backward"
                            >
                              <ChevronUp className="w-3 h-3" />
                            </button>
                            <button
                              disabled={photos.indexOf(photo) === photos.length - 1}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMovePhotoDown(photo.id);
                              }}
                              className="p-1 text-neutral-400 hover:text-white border border-neutral-800 hover:bg-neutral-800 cursor-pointer disabled:opacity-30"
                              title="Move sequence forward"
                            >
                              <ChevronDown className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* COLUMN 2: LIGHTROOM METADATA INSPECTOR (col-span-4) */}
            <div className="lg:col-span-4 flex flex-col gap-4 sticky top-20">
              <div className="bg-neutral-950/85 border border-neutral-800 p-4 flex flex-col gap-4">
                
                {/* Inspector Header */}
                <div className="border-b border-neutral-800 pb-2 flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-400 font-semibold flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" />
                    Metadata Inspector
                  </span>
                  
                  {/* Save feedback indicator */}
                  <span 
                    id="save-indicator" 
                    className="font-mono text-[8px] uppercase tracking-widest text-emerald-400 opacity-0 transition-opacity duration-300"
                  >
                    ✓ Saved
                  </span>
                </div>

                {activePhotoId ? (
                  <div className="flex flex-col gap-4">
                    {/* Active preview block */}
                    {(() => {
                      const activePhoto = photos.find(p => p.id === activePhotoId);
                      if (!activePhoto) return null;

                      return (
                        <div className="flex gap-3 items-center border-b border-neutral-900 pb-3">
                          <img src={activePhoto.url} className="w-12 h-12 object-cover border border-neutral-800" alt="" />
                          <div className="min-w-0">
                            <span className="font-mono text-[8px] text-neutral-500 uppercase block tracking-wider">
                              ACTIVE ARCHIVE ITEM
                            </span>
                            <span className="font-serif text-[11px] text-neutral-300 truncate block">
                              {activePhoto.id}
                            </span>
                          </div>
                        </div>
                      );
                    })()}

                    {/* Metadata fields */}
                    <div className="flex flex-col gap-3">
                      <div>
                        <label className="block font-mono text-[9px] uppercase tracking-wider text-neutral-500 mb-1">
                          Publication Status
                        </label>
                        <select
                          value={inspectorStatus}
                          onChange={(e) => setInspectorStatus(e.target.value as "draft" | "published")}
                          className="w-full bg-neutral-900 border border-neutral-800 px-2 py-1.5 text-xs font-mono text-neutral-200 focus:outline-none focus:border-neutral-500 rounded-none"
                        >
                          <option value="draft">Draft (Private in Officina)</option>
                          <option value="published">Published (Live in Galleria)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-mono text-[9px] uppercase tracking-wider text-neutral-500 mb-1">
                          Photo Title
                        </label>
                        <input
                          type="text"
                          value={inspectorTitle}
                          onChange={(e) => setInspectorTitle(e.target.value)}
                          placeholder="Leave blank if undocumented"
                          className="w-full bg-neutral-900 border border-neutral-800 px-2 py-1.5 text-xs text-neutral-100 focus:outline-none focus:border-neutral-500 rounded-none"
                        />
                      </div>

                      <div>
                        <label className="block font-mono text-[9px] uppercase tracking-wider text-neutral-500 mb-1">
                          Category / Tag
                        </label>
                        <input
                          type="text"
                          value={inspectorCategory}
                          onChange={(e) => setInspectorCategory(e.target.value)}
                          placeholder="e.g. Kyoto, Materials"
                          className="w-full bg-neutral-900 border border-neutral-800 px-2 py-1.5 text-xs text-neutral-100 focus:outline-none focus:border-neutral-500 rounded-none font-mono"
                        />
                      </div>

                      <div>
                        <label className="block font-mono text-[9px] uppercase tracking-wider text-neutral-500 mb-1">
                          Observations / Storytelling Caption
                        </label>
                        <textarea
                          value={inspectorCaption}
                          onChange={(e) => setInspectorCaption(e.target.value)}
                          rows={3}
                          placeholder="Write honest caption. Simple prose, no fiction."
                          className="w-full bg-neutral-900 border border-neutral-800 px-2 py-1.5 text-xs text-neutral-200 focus:outline-none focus:border-neutral-500 rounded-none resize-none leading-relaxed"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block font-mono text-[9px] uppercase tracking-wider text-neutral-500 mb-1">
                            Location
                          </label>
                          <input
                            type="text"
                            value={inspectorLocation}
                            onChange={(e) => setInspectorLocation(e.target.value)}
                            placeholder="e.g. Kyoto, Japan"
                            className="w-full bg-neutral-900 border border-neutral-800 px-2 py-1.5 text-xs text-neutral-100 focus:outline-none focus:border-neutral-500 rounded-none"
                          />
                        </div>
                        <div>
                          <label className="block font-mono text-[9px] uppercase tracking-wider text-neutral-500 mb-1">
                            Observation Date
                          </label>
                          <input
                            type="date"
                            value={inspectorDate}
                            onChange={(e) => setInspectorDate(e.target.value)}
                            className="w-full bg-neutral-900 border border-neutral-800 px-2 py-1.5 text-xs text-neutral-100 focus:outline-none focus:border-neutral-500 rounded-none font-mono text-center"
                          />
                        </div>
                      </div>

                      <div className="border border-neutral-800 bg-neutral-900/40 p-3 mt-1">
                        <span className="block font-serif italic text-[11px] text-neutral-400 mb-2 border-b border-neutral-800 pb-1">
                          Technical parameters (Hardware specs)
                        </span>
                        <div className="grid grid-cols-2 gap-2 font-mono text-[10px]">
                          <div>
                            <span className="text-neutral-500 text-[8px] uppercase tracking-wider block mb-0.5">Camera Body</span>
                            <input
                              type="text"
                              value={inspectorCamera}
                              onChange={(e) => setInspectorCamera(e.target.value)}
                              placeholder="e.g. Mechanical"
                              className="w-full bg-neutral-950 border border-neutral-800 px-1.5 py-1 text-[10px] focus:outline-none focus:border-neutral-500"
                            />
                          </div>
                          <div>
                            <span className="text-neutral-500 text-[8px] uppercase tracking-wider block mb-0.5">Lens Model</span>
                            <input
                              type="text"
                              value={inspectorLens}
                              onChange={(e) => setInspectorLens(e.target.value)}
                              placeholder="e.g. 35mm f/2"
                              className="w-full bg-neutral-950 border border-neutral-800 px-1.5 py-1 text-[10px] focus:outline-none focus:border-neutral-500"
                            />
                          </div>
                          <div>
                            <span className="text-neutral-500 text-[8px] uppercase tracking-wider block mb-0.5">Aperture</span>
                            <input
                              type="text"
                              value={inspectorAperture}
                              onChange={(e) => setInspectorAperture(e.target.value)}
                              placeholder="e.g. f/2.8"
                              className="w-full bg-neutral-950 border border-neutral-800 px-1.5 py-1 text-[10px] focus:outline-none"
                            />
                          </div>
                          <div>
                            <span className="text-neutral-500 text-[8px] uppercase tracking-wider block mb-0.5">Shutter Speed</span>
                            <input
                              type="text"
                              value={inspectorShutter}
                              onChange={(e) => setInspectorShutter(e.target.value)}
                              placeholder="e.g. 1/125s"
                              className="w-full bg-neutral-950 border border-neutral-800 px-1.5 py-1 text-[10px] focus:outline-none"
                            />
                          </div>
                          <div className="col-span-2">
                            <span className="text-neutral-500 text-[8px] uppercase tracking-wider block mb-0.5">ISO Rating</span>
                            <input
                              type="text"
                              value={inspectorIso}
                              onChange={(e) => setInspectorIso(e.target.value)}
                              placeholder="e.g. 400"
                              className="w-full bg-neutral-950 border border-neutral-800 px-1.5 py-1 text-[10px] focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleSaveInspector}
                      disabled={isInspectorSaving}
                      className="w-full mt-2 font-mono text-[10px] py-2.5 tracking-widest uppercase border border-neutral-300 bg-neutral-200 text-neutral-950 hover:bg-white transition-colors duration-200 cursor-pointer flex items-center justify-center gap-1.5 font-bold"
                    >
                      {isInspectorSaving ? (
                        <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving changes...</>
                      ) : (
                        <><Save className="w-3.5 h-3.5" /> Apply Metadata</>
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="py-8 text-center text-neutral-500 font-sans text-xs">
                    No photograph currently loaded in the inspector.<br />
                    <span className="font-mono text-[9px] text-neutral-600 uppercase block mt-2">
                      Click any photo thumbnail to inspect & edit its metadata
                    </span>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ========================================================
          2. MANAGE JOURNAL TAB
          ======================================================== */}
      {adminTab === "journals" && (
        <div className="flex flex-col gap-6">
          
          {/* Form and List switch */}
          <div className="flex bg-neutral-950 p-1 border border-neutral-800">
            <button
              onClick={() => setActiveForm("journal")}
              className={`flex-1 font-mono text-[10px] py-1.5 tracking-wider uppercase transition-all duration-200 ${
                activeForm === "journal" ? "bg-neutral-850 text-neutral-100 font-semibold border border-neutral-700" : "text-neutral-400 hover:text-neutral-200"
              }`}
            >
              Write New Journal Entry
            </button>
            <button
              onClick={() => setActiveForm("photo")} // Borrow active form to show listed index
              className={`flex-1 font-mono text-[10px] py-1.5 tracking-wider uppercase transition-all duration-200 ${
                activeForm === "photo" ? "bg-neutral-850 text-neutral-100 font-semibold border border-neutral-700" : "text-neutral-400 hover:text-neutral-200"
              }`}
            >
              All Written Entries ({journals.length})
            </button>
          </div>

          {activeForm === "journal" ? (
            <form onSubmit={handleJournalSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block font-mono text-[9px] uppercase tracking-wider text-neutral-500 mb-1">
                    Journal Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={journalTitle}
                    onChange={(e) => setJournalTitle(e.target.value)}
                    placeholder="e.g., The Quiet Discipline of Subtraction"
                    className="w-full bg-neutral-950 border border-neutral-800 px-3 py-2 text-sm focus:outline-none focus:border-neutral-500 text-neutral-200"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-[9px] uppercase tracking-wider text-neutral-500 mb-1">
                      Category
                    </label>
                    <select
                      value={journalCategory}
                      onChange={(e) => setJournalCategory(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 px-3 py-2 text-sm focus:outline-none focus:border-neutral-500 text-neutral-200"
                    >
                      <option value="Philosophy">Philosophy</option>
                      <option value="Observation">Observation</option>
                      <option value="Process">Process</option>
                      <option value="Travel">Travel</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-mono text-[9px] uppercase tracking-wider text-neutral-500 mb-1">
                      <Calendar className="w-3 h-3 inline mr-1 text-neutral-500" /> Date
                    </label>
                    <input
                      type="date"
                      value={journalDate}
                      onChange={(e) => setJournalDate(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 px-3 py-2 text-sm focus:outline-none focus:border-neutral-500 text-neutral-200 font-mono text-center"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-[9px] uppercase tracking-wider text-neutral-500 mb-1">
                    Reflections & Writing *
                  </label>
                  <textarea
                    required
                    value={journalContent}
                    onChange={(e) => setJournalContent(e.target.value)}
                    rows={8}
                    placeholder="Write honestly. Simple, precise, and thoughtful language..."
                    className="w-full bg-neutral-950 border border-neutral-800 px-3 py-3 text-sm focus:outline-none focus:border-neutral-500 text-neutral-200 resize-none leading-relaxed"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isJournalPublishing || !journalTitle || !journalContent || journalSuccess}
                className={`w-full font-serif text-xs tracking-widest uppercase py-3 border cursor-pointer transition-all duration-300 flex items-center justify-center gap-2 ${
                  journalSuccess
                    ? "bg-emerald-950 text-emerald-400 border-emerald-900"
                    : "bg-neutral-200 hover:bg-white text-neutral-950 border-neutral-300"
                }`}
              >
                {isJournalPublishing ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Publishing...</>
                ) : journalSuccess ? (
                  <><Check className="w-4 h-4" /> Published to Journal</>
                ) : (
                  "Publish Entry to Journal"
                )}
              </button>
            </form>
          ) : (
            <div className="flex flex-col gap-3">
              {journals.map((entry) => (
                <div 
                  key={entry.id}
                  className="flex items-center justify-between border border-neutral-800 bg-neutral-950/40 p-3.5 hover:bg-neutral-900/30 transition-colors gap-4"
                >
                  <div className="min-w-0">
                    <h4 className="font-serif text-sm font-medium text-neutral-200 truncate">{entry.title}</h4>
                    <span className="font-mono text-[9px] text-neutral-500 block flex items-center gap-2 mt-0.5">
                      <span className="bg-neutral-900 border border-neutral-800 px-1 py-0.5">{entry.category}</span>
                      <span>{entry.date}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setEditingJournal(entry)}
                      className="p-1.5 border border-neutral-800 hover:bg-neutral-800 hover:text-white transition-all text-neutral-400 flex items-center gap-1 font-mono text-[9px] uppercase cursor-pointer"
                    >
                      <Edit className="w-3 h-3" /> Edit
                    </button>
                    <button
                      onClick={() => handleJournalDelete(entry.id)}
                      className="p-1.5 border border-red-900/30 hover:bg-red-950 hover:text-red-400 hover:border-red-900 transition-all text-red-500 flex items-center gap-1 font-mono text-[9px] uppercase cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          3. MANAGE PROJECTS TAB
          ======================================================== */}
      {adminTab === "projects" && (
        <div className="flex flex-col gap-6">
          
          {/* Sub switcher */}
          <div className="flex bg-neutral-950 p-1 border border-neutral-800">
            <button
              onClick={() => setActiveForm("project")}
              className={`flex-1 font-mono text-[10px] py-1.5 tracking-wider uppercase transition-all duration-200 ${
                activeForm === "project" ? "bg-neutral-850 text-neutral-100 font-semibold border border-neutral-700" : "text-neutral-400 hover:text-neutral-200"
              }`}
            >
              Add New Workshop Project
            </button>
            <button
              onClick={() => setActiveForm("photo")}
              className={`flex-1 font-mono text-[10px] py-1.5 tracking-wider uppercase transition-all duration-200 ${
                activeForm === "photo" ? "bg-neutral-850 text-neutral-100 font-semibold border border-neutral-700" : "text-neutral-400 hover:text-neutral-200"
              }`}
            >
              All Workshop Ledgers ({projects.length})
            </button>
          </div>

          {activeForm === "project" ? (
            <form onSubmit={handleProjectSubmit} className="flex flex-col gap-5">
              <div
                onClick={() => projectFileInputRef.current?.click()}
                className={`border border-dashed p-6 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center min-h-[120px] bg-neutral-950/40 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900/10`}
              >
                <input
                  type="file"
                  ref={projectFileInputRef}
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      const reader = new FileReader();
                      reader.onload = (ev) => setProjectBase64(ev.target?.result as string);
                      reader.readAsDataURL(e.target.files[0]);
                    }
                  }}
                  className="hidden"
                  accept="image/*"
                />
                {projectBase64 ? (
                  <div className="flex flex-col items-center gap-3">
                    <img src={projectBase64} alt="Project Curated preview" className="max-h-[100px] object-cover border border-neutral-800" />
                    <span className="font-mono text-[9px] text-emerald-400 bg-emerald-950 px-2 py-0.5 border border-emerald-900">Image loaded</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <UploadCloud className="w-6 h-6 text-neutral-500" />
                    <p className="font-serif text-xs text-neutral-300">Drag & Drop Project banner image (Optional)</p>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-[9px] uppercase tracking-wider text-neutral-500 mb-1">
                      Project Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={projectTitle}
                      onChange={(e) => setProjectTitle(e.target.value)}
                      placeholder="e.g., Vespa Restoration"
                      className="w-full bg-neutral-950 border border-neutral-800 px-3 py-2 text-sm focus:outline-none focus:border-neutral-500 text-neutral-200"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[9px] uppercase tracking-wider text-neutral-500 mb-1">
                      Category *
                    </label>
                    <input
                      type="text"
                      required
                      value={projectCategory}
                      onChange={(e) => setProjectCategory(e.target.value)}
                      placeholder="e.g., Engineering / Workshop"
                      className="w-full bg-neutral-950 border border-neutral-800 px-3 py-2 text-sm focus:outline-none focus:border-neutral-500 text-neutral-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-[9px] uppercase tracking-wider text-neutral-500 mb-1">
                    Short Description *
                  </label>
                  <input
                    type="text"
                    required
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                    placeholder="Short description summarizing why the project matters"
                    className="w-full bg-neutral-950 border border-neutral-800 px-3 py-2 text-sm focus:outline-none focus:border-neutral-500 text-neutral-200"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[9px] uppercase tracking-wider text-neutral-500 mb-1">
                    The Process *
                  </label>
                  <textarea
                    required
                    value={projectProcess}
                    onChange={(e) => setProjectProcess(e.target.value)}
                    rows={4}
                    placeholder="Explain the workflow, step-by-step challenges, and restoration decisions..."
                    className="w-full bg-neutral-950 border border-neutral-800 px-3 py-2 text-sm focus:outline-none focus:border-neutral-500 text-neutral-200 resize-none leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[9px] uppercase tracking-wider text-neutral-500 mb-1">
                    Project Outcome / Achievement *
                  </label>
                  <input
                    type="text"
                    required
                    value={projectOutcome}
                    onChange={(e) => setProjectOutcome(e.target.value)}
                    placeholder="e.g., A fully restored black commuter Vespa ready for decades of road trips."
                    className="w-full bg-neutral-950 border border-neutral-800 px-3 py-2 text-sm focus:outline-none focus:border-neutral-500 text-neutral-200"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isProjectPublishing || projectSuccess}
                className="w-full font-serif text-xs tracking-widest uppercase py-3 border border-neutral-300 bg-neutral-200 text-neutral-950 hover:bg-white transition-all duration-300"
              >
                {isProjectPublishing ? "Publishing..." : projectSuccess ? "Published Successfully" : "Publish Workshop Project"}
              </button>
            </form>
          ) : (
            <div className="flex flex-col gap-3">
              {projects.map((project) => (
                <div 
                  key={project.id}
                  className="flex items-center justify-between border border-neutral-800 bg-neutral-950/40 p-3.5 hover:bg-neutral-900/30 transition-colors gap-4"
                >
                  <div className="min-w-0 flex items-center gap-4">
                    {project.imageUrl && (
                      <img src={project.imageUrl} alt={project.title} className="w-12 h-12 object-cover border border-neutral-800 grayscale" />
                    )}
                    <div className="min-w-0">
                      <h4 className="font-serif text-sm font-medium text-neutral-200 truncate">{project.title}</h4>
                      <span className="font-mono text-[9px] text-neutral-500 block truncate mt-0.5">
                        {project.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        setEditingProject(project);
                        setEditProjectBase64(null);
                      }}
                      className="p-1.5 border border-neutral-800 hover:bg-neutral-800 hover:text-white transition-all text-neutral-400 flex items-center gap-1 font-mono text-[9px] uppercase cursor-pointer"
                    >
                      <Edit className="w-3 h-3" /> Edit
                    </button>
                    <button
                      onClick={() => handleProjectDelete(project.id)}
                      className="p-1.5 border border-red-900/30 hover:bg-red-950 hover:text-red-400 hover:border-red-900 transition-all text-red-500 flex items-center gap-1 font-mono text-[9px] uppercase cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          JOURNAL EDITING OVERLAY MODAL 
          ======================================================== */}
      {editingJournal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="absolute inset-0 cursor-crosshair" onClick={() => setEditingJournal(null)} />
          <div className="relative w-full max-w-xl bg-[#161616] border border-neutral-800 p-6 shadow-2xl z-10 flex flex-col gap-4 text-neutral-200">
            <h3 className="font-serif text-lg border-b border-neutral-800 pb-2 text-neutral-100">
              Edit Journal entry
            </h3>

            <form onSubmit={handleJournalUpdate} className="flex flex-col gap-4">
              <div>
                <label className="block font-mono text-[9px] uppercase tracking-wider text-neutral-500 mb-1">
                  Journal Title *
                </label>
                <input
                  type="text"
                  required
                  value={editingJournal.title}
                  onChange={(e) => setEditingJournal({ ...editingJournal, title: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 px-3 py-1.5 text-sm focus:outline-none focus:border-neutral-500 text-neutral-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-[9px] uppercase tracking-wider text-neutral-500 mb-1">
                    Category
                  </label>
                  <select
                    value={editingJournal.category}
                    onChange={(e) => setEditingJournal({ ...editingJournal, category: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 px-3 py-1.5 text-sm focus:outline-none focus:border-neutral-500 text-neutral-100"
                  >
                    <option value="Philosophy">Philosophy</option>
                    <option value="Observation">Observation</option>
                    <option value="Process">Process</option>
                    <option value="Travel">Travel</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-[9px] uppercase tracking-wider text-neutral-500 mb-1">
                    Date Published
                  </label>
                  <input
                    type="date"
                    value={editingJournal.date}
                    onChange={(e) => setEditingJournal({ ...editingJournal, date: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 px-3 py-1.5 text-sm focus:outline-none focus:border-neutral-500 text-neutral-100 font-mono text-center"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-[9px] uppercase tracking-wider text-neutral-500 mb-1">
                  Reflections & Content *
                </label>
                <textarea
                  required
                  value={editingJournal.content}
                  onChange={(e) => setEditingJournal({ ...editingJournal, content: e.target.value })}
                  rows={8}
                  className="w-full bg-neutral-950 border border-neutral-800 px-3 py-2 text-sm focus:outline-none focus:border-neutral-500 text-neutral-200 resize-none leading-relaxed"
                />
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setEditingJournal(null)}
                  className="px-4 py-2 border border-neutral-800 font-serif text-xs text-neutral-400 hover:bg-neutral-900 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 border border-neutral-300 bg-neutral-200 text-neutral-950 hover:bg-white font-serif text-xs transition-colors font-semibold"
                >
                  Update Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          PROJECT EDITING OVERLAY MODAL 
          ======================================================== */}
      {editingProject && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="absolute inset-0 cursor-crosshair" onClick={() => setEditingProject(null)} />
          <div className="relative w-full max-w-xl bg-[#161616] border border-neutral-800 p-6 shadow-2xl z-10 flex flex-col gap-4 text-neutral-200">
            <h3 className="font-serif text-lg border-b border-neutral-800 pb-2 text-neutral-100">
              Edit Workshop Project
            </h3>

            <form onSubmit={handleProjectUpdate} className="flex flex-col gap-4">
              <div
                onClick={() => editProjectFileInputRef.current?.click()}
                className="border border-dashed border-neutral-850 p-4 text-center cursor-pointer min-h-[100px] flex flex-col items-center justify-center bg-neutral-950/30 hover:border-neutral-700"
              >
                <input
                  type="file"
                  ref={editProjectFileInputRef}
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      const reader = new FileReader();
                      reader.onload = (ev) => setEditProjectBase64(ev.target?.result as string);
                      reader.readAsDataURL(e.target.files[0]);
                    }
                  }}
                  className="hidden"
                  accept="image/*"
                />
                {editProjectBase64 ? (
                  <div className="flex flex-col items-center gap-2">
                    <img src={editProjectBase64} alt="Project preview" className="max-h-[80px] object-cover border border-neutral-800" />
                    <span className="font-mono text-[9px] text-emerald-400 bg-emerald-950 px-1 border border-emerald-900">Replacement loaded</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1">
                    {editingProject.imageUrl && (
                      <img src={editingProject.imageUrl} alt="Current project" className="max-h-[60px] object-cover border border-neutral-800" />
                    )}
                    <span className="font-serif text-xs text-neutral-300">Replace banner image</span>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-mono text-[9px] uppercase tracking-wider text-neutral-500 mb-1">
                      Project Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingProject.title}
                      onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-800 px-3 py-1.5 text-sm focus:outline-none focus:border-neutral-500 text-neutral-100"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[9px] uppercase tracking-wider text-neutral-500 mb-1">
                      Category *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingProject.category}
                      onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-800 px-3 py-1.5 text-sm focus:outline-none focus:border-neutral-500 text-neutral-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-[9px] uppercase tracking-wider text-neutral-500 mb-1">
                    Short Description *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProject.description}
                    onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 px-3 py-1.5 text-sm focus:outline-none focus:border-neutral-500 text-neutral-100"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[9px] uppercase tracking-wider text-neutral-500 mb-1">
                    The Process *
                  </label>
                  <textarea
                    required
                    value={editingProject.process}
                    onChange={(e) => setEditingProject({ ...editingProject, process: e.target.value })}
                    rows={4}
                    className="w-full bg-neutral-950 border border-neutral-800 px-3 py-1.5 text-sm focus:outline-none focus:border-neutral-500 text-neutral-100 resize-none leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[9px] uppercase tracking-wider text-neutral-500 mb-1">
                    Outcome *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProject.outcome}
                    onChange={(e) => setEditingProject({ ...editingProject, outcome: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 px-3 py-1.5 text-sm focus:outline-none focus:border-neutral-500 text-neutral-100"
                  />
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditingProject(null);
                    setEditProjectBase64(null);
                  }}
                  className="px-4 py-2 border border-neutral-800 font-serif text-xs text-neutral-400 hover:bg-neutral-900 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 border border-neutral-300 bg-neutral-200 text-neutral-950 hover:bg-white font-serif text-xs transition-colors font-semibold"
                >
                  Update Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
