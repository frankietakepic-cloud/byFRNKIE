import React, { useState, useMemo, useEffect } from "react";
import { API_URL } from "../lib/api";
import { Photo, JournalEntry, Project, DailyEntry, PageLayout, HeroConfig } from "../types";
import { initialDailyEntries } from "../data";
import { initialPages, initialHeroConfig } from "../dataPages";
import OfficinaTopBar from "./OfficinaTopBar";
import OfficinaSidebar, { SidebarViewMode } from "./OfficinaSidebar";
import OfficinaLibrary from "./OfficinaLibrary";
import OfficinaInspector from "./OfficinaInspector";
import OfficinaJournal from "./OfficinaJournal";
import OfficinaWorkshop from "./OfficinaWorkshop";
import OfficinaDaily from "./OfficinaDaily";
import OfficinaSettings from "./OfficinaSettings";
import SiteBuilderWorkspace from "./officina/SiteBuilderWorkspace";
import HeroManagerWorkspace from "./officina/HeroManagerWorkspace";
import OfficinaPublishModal from "./OfficinaPublishModal";
import OfficinaAiAssistant from "./OfficinaAiAssistant";
import OfficinaBottomNav from "./OfficinaBottomNav";
import OfficinaQuickCapture from "./OfficinaQuickCapture";
import OfficinaPwaBanner from "./OfficinaPwaBanner";
import UploadForm from "./UploadForm";

interface OfficinaWorkspaceProps {
  photos: Photo[];
  setPhotos: React.Dispatch<React.SetStateAction<Photo[]>>;
  journals: JournalEntry[];
  setJournals: React.Dispatch<React.SetStateAction<JournalEntry[]>>;
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  authToken: string | null;
  onReturnToPublic: () => void;
  onLockWorkspace: () => void;
}

export default function OfficinaWorkspace({
  photos,
  setPhotos,
  journals,
  setJournals,
  projects,
  setProjects,
  authToken,
  onReturnToPublic,
  onLockWorkspace
}: OfficinaWorkspaceProps) {
  // Navigation & View States
  const [activeViewMode, setActiveViewMode] = useState<SidebarViewMode>("library");
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Daily Entries State
  const [dailyEntries, setDailyEntries] = useState<DailyEntry[]>(initialDailyEntries);

  // Pages & Hero Config State for Site Builder & Hero Manager
  const [pages, setPages] = useState<PageLayout[]>(initialPages);
  const [heroConfig, setHeroConfig] = useState<HeroConfig>(initialHeroConfig);

  useEffect(() => {
    fetch(`${API_URL}/api/pages`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setPages(data);
      })
      .catch((err) => console.warn("Pages API fallback.", err));

    fetch(`${API_URL}/api/hero-config`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.sourceType) setHeroConfig(data);
      })
      .catch((err) => console.warn("Hero config API fallback.", err));
  }, []);

  // Photo Selection States
  const [selectedPhotoIds, setSelectedPhotoIds] = useState<string[]>([]);
  const [activePhotoId, setActivePhotoId] = useState<string | null>(photos.length > 0 ? photos[0].id : null);

  // Modals & Panels
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [publishingPhoto, setPublishingPhoto] = useState<Photo | null>(null);

  // PWA Shortcuts & Share Target Handler
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const action = urlParams.get("action");
      const isShare = urlParams.get("share");

      if (action === "import-photos" || isShare) {
        setIsImportOpen(true);
      } else if (action === "new-journal") {
        setActiveViewMode("journal");
      } else if (action === "daily") {
        setActiveViewMode("daily");
      } else if (action === "workshop") {
        setActiveViewMode("workshop");
      }
    }
  }, []);

  // Custom Collections list
  const [customCollections, setCustomCollections] = useState<string[]>([
    "Japan",
    "Vietnam",
    "Architecture",
    "Travel",
    "Morning",
    "Film",
    "Street",
    "Workshop",
    "Minimalism",
    "Favorites",
    "Portfolio",
    "Book"
  ]);

  // Derived lists
  const collectionsList = useMemo(() => {
    const fromPhotos = photos.flatMap((p) => p.collections || []);
    return Array.from(new Set([...customCollections, ...fromPhotos])).sort();
  }, [photos, customCollections]);

  const tagsList = useMemo(() => {
    const fromPhotos = photos.flatMap((p) => p.tags || []);
    const defaults = ["#Kyoto", "#Saigon", "#Street", "#35mm", "#Leica", "#Minimalism", "#Architecture", "#Concrete"];
    return Array.from(new Set([...defaults, ...fromPhotos])).sort();
  }, [photos]);

  // Active Photo reference
  const activePhoto = useMemo(() => {
    return photos.find((p) => p.id === activePhotoId) || null;
  }, [photos, activePhotoId]);

  // Counts
  const counts = useMemo(() => {
    return {
      library: photos.filter((p) => p.status !== "trash").length,
      drafts: photos.filter((p) => p.status === "draft").length,
      published: photos.filter((p) => p.status === "published").length,
      archived: photos.filter((p) => p.status === "archived").length,
      trash: photos.filter((p) => p.status === "trash").length,
      journal: journals.length,
      workshop: projects.length
    };
  }, [photos, journals, projects]);

  // Filtered Photos for current view & search
  const viewFilteredPhotos = useMemo(() => {
    let list = photos;

    if (activeViewMode === "drafts") {
      list = list.filter((p) => p.status === "draft");
    } else if (activeViewMode === "published") {
      list = list.filter((p) => p.status === "published");
    } else if (activeViewMode === "archived") {
      list = list.filter((p) => p.status === "archived");
    } else if (activeViewMode === "trash") {
      list = list.filter((p) => p.status === "trash");
    } else if (activeViewMode === "collection" && selectedCollection) {
      list = list.filter((p) => (p.collections || []).includes(selectedCollection));
    } else if (activeViewMode === "tag" && selectedTag) {
      list = list.filter((p) => (p.tags || []).includes(selectedTag));
    } else if (activeViewMode === "library") {
      list = list.filter((p) => p.status !== "trash");
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((p) => {
        return (
          p.title?.toLowerCase().includes(q) ||
          p.caption?.toLowerCase().includes(q) ||
          p.location?.toLowerCase().includes(q) ||
          p.camera?.toLowerCase().includes(q) ||
          p.lens?.toLowerCase().includes(q) ||
          p.date?.includes(q) ||
          (p.tags || []).some((t) => t.toLowerCase().includes(q)) ||
          (p.collections || []).some((c) => c.toLowerCase().includes(q))
        );
      });
    }

    return list;
  }, [photos, activeViewMode, selectedCollection, selectedTag, searchQuery]);

  // Handlers for Photo Updates (Syncs with Express server or local memory)
  const handleUpdatePhoto = async (updatedPhoto: Photo) => {
    setPhotos((prev) => prev.map((p) => (p.id === updatedPhoto.id ? updatedPhoto : p)));

    try {
      await fetch(`${API_URL}/api/photos/${updatedPhoto.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken || "takecareofthework"}`
        },
        body: JSON.stringify(updatedPhoto)
      });
    } catch (err) {
      console.warn("Express API update silent sync.", err);
    }
  };

  const handleBulkUpdatePhotos = async (updates: Partial<Photo>) => {
    setPhotos((prev) =>
      prev.map((p) => {
        if (selectedPhotoIds.includes(p.id)) {
          return { ...p, ...updates };
        }
        return p;
      })
    );

    const updatedArray = photos.map((p) => {
      if (selectedPhotoIds.includes(p.id)) {
        return { ...p, ...updates };
      }
      return p;
    });

    try {
      await fetch(`${API_URL}/api/photos`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken || "takecareofthework"}`
        },
        body: JSON.stringify({ photos: updatedArray })
      });
    } catch (err) {
      console.warn("Express API bulk update sync.", err);
    }
  };

  const handleDeletePhoto = async (photoId: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== photoId));
    if (activePhotoId === photoId) setActivePhotoId(null);
    setSelectedPhotoIds((prev) => prev.filter((id) => id !== photoId));

    try {
      await fetch(`${API_URL}/api/photos/${photoId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authToken || "takecareofthework"}`
        }
      });
    } catch (err) {
      console.warn("Express API delete sync.", err);
    }
  };

  const handleBulkDelete = () => {
    selectedPhotoIds.forEach((id) => handleDeletePhoto(id));
    setSelectedPhotoIds([]);
  };

  // Handlers for Journal
  const handleSaveJournal = async (journal: JournalEntry) => {
    setJournals((prev) => {
      const idx = prev.findIndex((j) => j.id === journal.id);
      if (idx !== -1) {
        const copy = [...prev];
        copy[idx] = journal;
        return copy;
      }
      return [journal, ...prev];
    });

    try {
      const exists = journals.some((j) => j.id === journal.id);
      const url = exists ? `${API_URL}/api/journals/${journal.id}` : `${API_URL}/api/journals`;
      const method = exists ? "PUT" : "POST";

      await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken || "takecareofthework"}`
        },
        body: JSON.stringify(journal)
      });
    } catch (err) {
      console.warn("Express API journal save sync.", err);
    }
  };

  const handleDeleteJournal = async (id: string) => {
    setJournals((prev) => prev.filter((j) => j.id !== id));
    try {
      await fetch(`${API_URL}/api/journals/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authToken || "takecareofthework"}`
        }
      });
    } catch (err) {
      console.warn("Express API journal delete sync.", err);
    }
  };

  // Handlers for Projects
  const handleSaveProject = async (project: Project) => {
    setProjects((prev) => {
      const idx = prev.findIndex((p) => p.id === project.id);
      if (idx !== -1) {
        const copy = [...prev];
        copy[idx] = project;
        return copy;
      }
      return [project, ...prev];
    });

    try {
      const exists = projects.some((p) => p.id === project.id);
      const url = exists ? `${API_URL}/api/projects/${project.id}` : `${API_URL}/api/projects`;
      const method = exists ? "PUT" : "POST";

      await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken || "takecareofthework"}`
        },
        body: JSON.stringify(project)
      });
    } catch (err) {
      console.warn("Express API project save sync.", err);
    }
  };

  const handleDeleteProject = async (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    try {
      await fetch(`${API_URL}/api/projects/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authToken || "takecareofthework"}`
        }
      });
    } catch (err) {
      console.warn("Express API project delete sync.", err);
    }
  };

  // Handlers for Daily Entries
  const handleSaveDaily = (entry: DailyEntry) => {
    setDailyEntries((prev) => {
      const idx = prev.findIndex((e) => e.id === entry.id);
      if (idx !== -1) {
        const copy = [...prev];
        copy[idx] = entry;
        return copy;
      }
      return [entry, ...prev];
    });
  };

  const handleDeleteDaily = (id: string) => {
    setDailyEntries((prev) => prev.filter((e) => e.id !== id));
  };

  // Handlers for Pages (Site Builder) & Hero Manager
  const handleSavePage = async (page: PageLayout) => {
    setPages((prev) => {
      const idx = prev.findIndex((p) => p.id === page.id || p.slug === page.slug);
      if (idx !== -1) {
        const copy = [...prev];
        copy[idx] = page;
        return copy;
      }
      return [...prev, page];
    });

    try {
      await fetch(`${API_URL}/api/pages/${page.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken || "takecareofthework"}`
        },
        body: JSON.stringify(page)
      });
    } catch (err) {
      console.warn("Express API page save error", err);
    }
  };

  const handleCreatePage = async (title: string, slug: string): Promise<PageLayout> => {
    const timestamp = Date.now();
    const newPage: PageLayout = {
      id: `page-${timestamp}`,
      slug: slug || `page-${timestamp}`,
      title,
      status: "draft",
      updatedAt: new Date().toISOString(),
      components: [],
      versions: []
    };

    setPages((prev) => [...prev, newPage]);

    try {
      const res = await fetch(`${API_URL}/api/pages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken || "takecareofthework"}`
        },
        body: JSON.stringify({ title, slug })
      });
      const created = await res.json();
      if (created && created.id) {
        setPages((prev) => prev.map((p) => (p.id === newPage.id ? created : p)));
        return created;
      }
    } catch (err) {
      console.warn("Express API page create error", err);
    }
    return newPage;
  };

  const handleDeletePage = async (id: string) => {
    setPages((prev) => prev.filter((p) => p.id !== id));
    try {
      await fetch(`${API_URL}/api/pages/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authToken || "takecareofthework"}`
        }
      });
    } catch (err) {
      console.warn("Express API page delete error", err);
    }
  };

  const handleUpdateHeroConfig = async (config: HeroConfig) => {
    setHeroConfig(config);
    try {
      await fetch(`${API_URL}/api/hero-config`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken || "takecareofthework"}`
        },
        body: JSON.stringify(config)
      });
    } catch (err) {
      console.warn("Express API hero config update error", err);
    }
  };

  // Trigger AI Action
  const handleTriggerAiAction = async (action: string, payload?: any) => {
    try {
      const res = await fetch(`${API_URL}/api/officina/ai-suggest`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken || "takecareofthework"}`
        },
        body: JSON.stringify({ action, photo: payload?.photo || activePhoto, prompt: payload?.prompt })
      });
      return await res.json();
    } catch (err) {
      console.error("AI Assistant request error:", err);
      return { suggestion: "AI Assistant server offline." };
    }
  };

  // Selection toggle helper
  const handleSelectPhotoToggle = (id: string, isMulti: boolean) => {
    if (isMulti) {
      setSelectedPhotoIds((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      );
    } else {
      setSelectedPhotoIds([id]);
    }
  };

  const activeViewTitle = useMemo(() => {
    if (activeViewMode === "library") return "Library";
    if (activeViewMode === "drafts") return "Drafts";
    if (activeViewMode === "published") return "Published";
    if (activeViewMode === "archived") return "Archived";
    if (activeViewMode === "trash") return "Trash";
    if (activeViewMode === "collection") return `Collection: ${selectedCollection || "All"}`;
    if (activeViewMode === "tag") return `Tag: ${selectedTag || "All"}`;
    if (activeViewMode === "journal") return "Journal Workspace";
    if (activeViewMode === "workshop") return "Workshop Projects";
    if (activeViewMode === "daily") return "Daily Observation Log";
    if (activeViewMode === "settings") return "System Settings";
    return "Library";
  }, [activeViewMode, selectedCollection, selectedTag]);

  return (
    <div className="min-h-screen bg-[#121212] text-neutral-100 flex flex-col font-sans selection:bg-neutral-800 selection:text-white overflow-hidden relative">
      {/* PWA Install & Offline Status Banner */}
      <OfficinaPwaBanner />

      {/* Top Bar */}
      <OfficinaTopBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenImport={() => setIsImportOpen(true)}
        onToggleAi={() => setIsAiOpen(!isAiOpen)}
        isAiOpen={isAiOpen}
        onReturnToPublic={onReturnToPublic}
        onLockWorkspace={onLockWorkspace}
        totalPhotosCount={counts.library}
        draftsCount={counts.drafts}
      />

      {/* Main OS Body: Sidebar + Main Content Workspace + Metadata Inspector */}
      <div className="flex-1 flex overflow-hidden pb-16 md:pb-0">
        {/* Left Sidebar (Desktop & Tablet) */}
        <div className="hidden md:block shrink-0">
          <OfficinaSidebar
            activeView={activeViewMode}
            onViewChange={setActiveViewMode}
            selectedCollection={selectedCollection}
            onSelectCollection={setSelectedCollection}
            selectedTag={selectedTag}
            onSelectTag={setSelectedTag}
            collectionsList={collectionsList}
            tagsList={tagsList}
            counts={counts}
            onCreateCollection={(name) => setCustomCollections((prev) => [...prev, name])}
          />
        </div>

        {/* Dynamic Center Workspace */}
        <main className="flex-1 flex overflow-hidden">
          {["library", "drafts", "published", "archived", "trash", "collection", "tag"].includes(
            activeViewMode
          ) && (
            <OfficinaLibrary
              photos={viewFilteredPhotos}
              selectedPhotoIds={selectedPhotoIds}
              onSelectPhotoToggle={handleSelectPhotoToggle}
              onSelectAllPhotos={() => setSelectedPhotoIds(viewFilteredPhotos.map((p) => p.id))}
              onClearSelection={() => setSelectedPhotoIds([])}
              onUpdatePhoto={handleUpdatePhoto}
              onBulkUpdate={handleBulkUpdatePhotos}
              onBulkDelete={handleBulkDelete}
              activePhotoId={activePhotoId}
              onPhotoClick={(photo) => setActivePhotoId(photo.id)}
              activeViewTitle={activeViewTitle}
              onOpenImport={() => setIsImportOpen(true)}
            />
          )}

          {activeViewMode === "journal" && (
            <OfficinaJournal
              journals={journals}
              photos={photos}
              projects={projects}
              onSaveJournal={handleSaveJournal}
              onDeleteJournal={handleDeleteJournal}
            />
          )}

          {activeViewMode === "workshop" && (
            <OfficinaWorkshop
              projects={projects}
              photos={photos}
              journals={journals}
              onSaveProject={handleSaveProject}
              onDeleteProject={handleDeleteProject}
              onOpenLibraryPicker={(onSelect) => {
                if (photos.length > 0) onSelect(photos[0]);
              }}
            />
          )}

          {activeViewMode === "daily" && (
            <OfficinaDaily
              dailyEntries={dailyEntries}
              onSaveDaily={handleSaveDaily}
              onDeleteDaily={handleDeleteDaily}
            />
          )}

          {activeViewMode === "site_builder" && (
            <SiteBuilderWorkspace
              pages={pages}
              onSavePage={handleSavePage}
              onCreatePage={handleCreatePage}
              onDeletePage={handleDeletePage}
              photos={photos}
              journals={journals}
              projects={projects}
            />
          )}

          {activeViewMode === "hero_manager" && (
            <HeroManagerWorkspace
              photos={photos}
              heroConfig={heroConfig}
              onUpdateHeroConfig={handleUpdateHeroConfig}
              collectionsList={collectionsList}
              tagsList={tagsList}
            />
          )}

          {activeViewMode === "settings" && (
            <OfficinaSettings
              totalPhotos={counts.library}
              totalJournals={counts.journal}
              totalProjects={counts.workshop}
            />
          )}
        </main>

        {/* Right Metadata Inspector (Shown when photo selected in library views) */}
        {["library", "drafts", "published", "archived", "trash", "collection", "tag"].includes(
          activeViewMode
        ) && (
          <OfficinaInspector
            photo={activePhoto}
            onClose={() => setActivePhotoId(null)}
            onUpdatePhoto={handleUpdatePhoto}
            onDeletePhoto={handleDeletePhoto}
            onOpenPublishModal={(photo) => setPublishingPhoto(photo)}
            onTriggerAiSuggest={(photo, action) => handleTriggerAiAction(action, { photo })}
            allCollections={collectionsList}
          />
        )}
      </div>

      {/* Global Mobile Bottom Navigation Bar (5 destinations) */}
      <OfficinaBottomNav
        activeView={activeViewMode}
        onViewChange={setActiveViewMode}
        unreadDraftsCount={counts.drafts}
      />

      {/* Global Quick Capture FAB & Modal */}
      <OfficinaQuickCapture
        onPhotoUploaded={(newPhoto) => {
          setPhotos((prev) => [newPhoto, ...prev]);
          setActivePhotoId(newPhoto.id);
          setActiveViewMode("library");
        }}
        onJournalCreated={(newJournal) => {
          handleSaveJournal(newJournal);
          setActiveViewMode("journal");
        }}
        onProjectCreated={(newProject) => {
          handleSaveProject(newProject);
          setActiveViewMode("workshop");
        }}
        onDailyCreated={(newDaily) => {
          handleSaveDaily(newDaily);
          setActiveViewMode("daily");
        }}
        authToken={authToken}
      />

      {/* AI Assistant Drawer */}
      <OfficinaAiAssistant
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
        photos={photos}
        activePhoto={activePhoto}
        onTriggerAiAction={handleTriggerAiAction}
        onApplySuggestions={(updates) => {
          if (activePhoto) {
            handleUpdatePhoto({ ...activePhoto, ...updates });
          }
        }}
      />

      {/* Deliberate Publish Modal */}
      {publishingPhoto && (
        <OfficinaPublishModal
          photo={publishingPhoto}
          onClose={() => setPublishingPhoto(null)}
          onConfirmPublish={(photo) => {
            handleUpdatePhoto(photo);
            setPublishingPhoto(null);
          }}
        />
      )}

      {/* Raw Media Import Modal */}
      {isImportOpen && (
        <div className="fixed inset-0 bg-neutral-950/80 backdrop-blur-xs flex items-center justify-center p-6 z-50 overflow-y-auto">
          <div className="w-full max-w-4xl bg-[#1A1A1A] border border-neutral-800 p-6 relative">
            <button
              onClick={() => setIsImportOpen(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white font-mono text-xs uppercase"
            >
              ✕ Close
            </button>
            <UploadForm
              photos={photos}
              setPhotos={setPhotos}
              journals={journals}
              setJournals={setJournals}
              projects={projects}
              setProjects={setProjects}
              onPhotoUploaded={(newPhoto) => {
                setPhotos((prev) => [newPhoto, ...prev]);
                setActivePhotoId(newPhoto.id);
                setIsImportOpen(false);
              }}
              onJournalPublished={(newJournal) => {
                setJournals((prev) => [newJournal, ...prev]);
                setIsImportOpen(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
