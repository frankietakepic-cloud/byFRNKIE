import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { RefreshCw } from "lucide-react";
import { Photo, JournalEntry, Project, DailyEntry, PageLayout, HeroConfig } from "./types";
import { initialPhotos, initialJournals, initialProjects, initialDailyEntries } from "./data";
import { initialPages, initialHeroConfig } from "./dataPages";

import PublicHeader from "./components/public/PublicHeader";
import PublicFooter from "./components/public/PublicFooter";
import PublicHomeView from "./components/public/PublicHomeView";
import PublicJournalView from "./components/public/PublicJournalView";
import PublicWorkshopView from "./components/public/PublicWorkshopView";
import PublicGalleriaView from "./components/public/PublicGalleriaView";
import PublicDailyView from "./components/public/PublicDailyView";
import PublicMapView from "./components/public/PublicMapView";
import PublicTimelineView from "./components/public/PublicTimelineView";
import PublicAboutView from "./components/public/PublicAboutView";
import PublicSearchModal from "./components/public/PublicSearchModal";
import PublicDetailModal from "./components/public/PublicDetailModal";
import Public404View from "./components/public/Public404View";
import PublicPageRenderer from "./components/public/PublicPageRenderer";

import OfficinaWorkspace from "./components/OfficinaWorkspace";

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>("home");
  const [photos, setPhotos] = useState<Photo[]>(initialPhotos);
  const [journals, setJournals] = useState<JournalEntry[]>(initialJournals);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [dailyEntries, setDailyEntries] = useState<DailyEntry[]>(initialDailyEntries || []);
  const [pages, setPages] = useState<PageLayout[]>(initialPages);
  const [heroConfig, setHeroConfig] = useState<HeroConfig>(initialHeroConfig);

  // L'Officina Workspace Mode States
  const [isOfficinaMode, setIsOfficinaMode] = useState<boolean>(false);
  const [authToken, setAuthToken] = useState<string | null>(() => sessionStorage.getItem("officina_token"));
  const [passcodeInput, setPasscodeInput] = useState<string>("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);

  // Search Modal & Detail Modal
  const [searchModalOpen, setSearchModalOpen] = useState<boolean>(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [selectedJournal, setSelectedJournal] = useState<JournalEntry | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Detect route path
  useEffect(() => {
    const handleLocationCheck = () => {
      const path = window.location.pathname;
      if (path === "/officina" || path.startsWith("/officina/")) {
        setIsOfficinaMode(true);
      } else {
        setIsOfficinaMode(false);
      }
    };

    handleLocationCheck();
    window.addEventListener("popstate", handleLocationCheck);
    return () => window.removeEventListener("popstate", handleLocationCheck);
  }, []);

  // Fetch from Express API
  const fetchArchiveData = async () => {
    try {
      const [photosRes, journalsRes, projectsRes, dailyRes, pagesRes, heroRes] = await Promise.all([
        fetch("/api/photos"),
        fetch("/api/journals"),
        fetch("/api/projects"),
        fetch("/api/daily"),
        fetch("/api/pages"),
        fetch("/api/hero-config")
      ]);

      if (photosRes.ok) {
        const photosData = await photosRes.json();
        if (photosData.length > 0) setPhotos(photosData);
      }
      if (journalsRes.ok) {
        const journalsData = await journalsRes.json();
        if (journalsData.length > 0) setJournals(journalsData);
      }
      if (projectsRes.ok) {
        const projectsData = await projectsRes.json();
        if (projectsData.length > 0) setProjects(projectsData);
      }
      if (dailyRes.ok) {
        const dailyData = await dailyRes.json();
        if (dailyData.length > 0) setDailyEntries(dailyData);
      }
      if (pagesRes.ok) {
        const pagesData = await pagesRes.json();
        if (Array.isArray(pagesData) && pagesData.length > 0) setPages(pagesData);
      }
      if (heroRes.ok) {
        const heroData = await heroRes.json();
        if (heroData && heroData.sourceType) setHeroConfig(heroData);
      }
    } catch (error) {
      console.warn("Operating with local static memory fallback.", error);
    }
  };

  useEffect(() => {
    fetchArchiveData();
  }, []);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setAuthError(null);
    try {
      const res = await fetch("/api/officina/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode: passcodeInput })
      });
      if (res.ok) {
        const data = await res.json();
        sessionStorage.setItem("officina_token", data.token);
        setAuthToken(data.token);
      } else {
        setAuthError("Passcode incorrect. Access denied to L'Officina.");
      }
    } catch (err) {
      setAuthError("Failed to reach authentication server.");
    } finally {
      setIsAuthenticating(false);
    }
  };

  const openOfficina = () => {
    setIsOfficinaMode(true);
    window.history.pushState({}, "", "/officina");
  };

  if (isOfficinaMode) {
    return (
      <div className="min-h-screen bg-[#121212] text-neutral-100 selection:bg-neutral-800 selection:text-white flex flex-col font-sans">
        {!authToken ? (
          /* AUTH GATE */
          <div className="flex-1 flex items-center justify-center px-6 py-12">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-md border border-neutral-800 bg-[#1A1A1A] p-8 md:p-10 flex flex-col gap-6 rounded-xl shadow-2xl"
            >
              <div className="flex flex-col gap-2 text-center">
                <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-neutral-500">
                  SECURE CURATOR WORKSPACE
                </span>
                <h1 className="font-serif text-3xl text-neutral-200 font-medium">
                  L'Officina OS
                </h1>
                <p className="font-sans text-xs text-neutral-400 font-light">
                  Enter curator credentials to manage the digital archive.
                </p>
              </div>

              <form onSubmit={handleAuthSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[9px] uppercase tracking-wider text-neutral-500">
                    Passcode Access Key
                  </label>
                  <input
                    type="password"
                    required
                    value={passcodeInput}
                    onChange={(e) => setPasscodeInput(e.target.value)}
                    placeholder="••••••••••••••"
                    className="w-full bg-[#222222] border border-neutral-800 text-sm p-3 text-neutral-200 focus:outline-none focus:border-neutral-500 font-mono text-center tracking-widest placeholder:tracking-normal placeholder:font-sans transition-colors duration-200 rounded"
                  />
                </div>

                {authError && (
                  <p className="text-rose-400 font-mono text-[10px] text-center bg-rose-950/30 border border-rose-900/30 p-2.5 rounded">
                    {authError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isAuthenticating}
                  className="w-full bg-neutral-100 text-neutral-950 hover:bg-white text-xs font-mono tracking-widest uppercase py-3 font-semibold transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 rounded"
                >
                  {isAuthenticating ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Authenticating...
                    </>
                  ) : (
                    "Authorize Curator Access"
                  )}
                </button>
              </form>

              <div className="border-t border-neutral-800/60 pt-4 flex justify-between items-center text-[10px] font-mono text-neutral-500">
                <button 
                  onClick={() => {
                    setIsOfficinaMode(false);
                    window.history.pushState({}, "", "/");
                    setCurrentTab("home");
                  }} 
                  className="hover:text-neutral-300 transition-colors cursor-pointer"
                >
                  ← Return to Public Archive
                </button>
                <span>L'Officina OS v2.0</span>
              </div>
            </motion.div>
          </div>
        ) : (
          /* AUTHENTICATED L'OFFICINA v2.0 OPERATING SYSTEM */
          <OfficinaWorkspace
            photos={photos}
            setPhotos={setPhotos}
            journals={journals}
            setJournals={setJournals}
            projects={projects}
            setProjects={setProjects}
            authToken={authToken}
            onReturnToPublic={() => {
              setIsOfficinaMode(false);
              window.history.pushState({}, "", "/");
              setCurrentTab("home");
            }}
            onLockWorkspace={() => {
              sessionStorage.removeItem("officina_token");
              setAuthToken(null);
              setPasscodeInput("");
            }}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-neutral-200 selection:bg-neutral-800 selection:text-white flex flex-col font-sans">
      {/* Public Navigation Header */}
      <PublicHeader
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenSearch={() => setSearchModalOpen(true)}
        onOpenOfficina={openOfficina}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <AnimatePresence mode="wait">
          {(() => {
            const matchedPage = pages.find((p) => p.slug === currentTab || p.id === currentTab);
            if (matchedPage && matchedPage.status === "published" && matchedPage.components.length > 0) {
              return (
                <div key={matchedPage.id}>
                  <PublicPageRenderer
                    page={matchedPage}
                    heroConfig={heroConfig}
                    photos={photos}
                    journals={journals}
                    projects={projects}
                    dailyEntries={dailyEntries}
                    setCurrentTab={setCurrentTab}
                    onSelectPhoto={(p) => setSelectedPhoto(p)}
                    onSelectJournal={(j) => setSelectedJournal(j)}
                    onSelectProject={(pr) => setSelectedProject(pr)}
                  />
                </div>
              );
            }

            if (currentTab === "home") {
              return (
                <div key="home">
                  <PublicHomeView
                    photos={photos}
                    journals={journals}
                    projects={projects}
                    dailyEntries={dailyEntries}
                    setCurrentTab={setCurrentTab}
                    onSelectPhoto={(p) => setSelectedPhoto(p)}
                    onSelectJournal={(j) => setSelectedJournal(j)}
                    onSelectProject={(pr) => setSelectedProject(pr)}
                  />
                </div>
              );
            }

            if (currentTab === "journal") {
              return (
                <div key="journal">
                  <PublicJournalView
                    journals={journals}
                    photos={photos}
                    projects={projects}
                    onSelectJournal={(j) => setSelectedJournal(j)}
                    onSelectPhoto={(p) => setSelectedPhoto(p)}
                    onSelectProject={(pr) => setSelectedProject(pr)}
                  />
                </div>
              );
            }

            if (currentTab === "workshop") {
              return (
                <div key="workshop">
                  <PublicWorkshopView
                    projects={projects}
                    photos={photos}
                    journals={journals}
                    onSelectProject={(pr) => setSelectedProject(pr)}
                    onSelectPhoto={(p) => setSelectedPhoto(p)}
                    onSelectJournal={(j) => setSelectedJournal(j)}
                  />
                </div>
              );
            }

            if (currentTab === "galleria") {
              return (
                <div key="galleria">
                  <PublicGalleriaView
                    photos={photos}
                    journals={journals}
                    projects={projects}
                    onSelectPhoto={(p) => setSelectedPhoto(p)}
                    onSelectJournal={(j) => setSelectedJournal(j)}
                    onSelectProject={(pr) => setSelectedProject(pr)}
                  />
                </div>
              );
            }

            if (currentTab === "daily") {
              return (
                <div key="daily">
                  <PublicDailyView
                    dailyEntries={dailyEntries}
                  />
                </div>
              );
            }

            if (currentTab === "map") {
              return (
                <div key="map">
                  <PublicMapView
                    photos={photos}
                    journals={journals}
                    projects={projects}
                    onSelectPhoto={(p) => setSelectedPhoto(p)}
                    onSelectJournal={(j) => setSelectedJournal(j)}
                    onSelectProject={(pr) => setSelectedProject(pr)}
                  />
                </div>
              );
            }

            if (currentTab === "timeline") {
              return (
                <div key="timeline">
                  <PublicTimelineView
                    photos={photos}
                    journals={journals}
                    projects={projects}
                    onSelectPhoto={(p) => setSelectedPhoto(p)}
                    onSelectJournal={(j) => setSelectedJournal(j)}
                    onSelectProject={(pr) => setSelectedProject(pr)}
                  />
                </div>
              );
            }

            if (currentTab === "about") {
              return <div key="about"><PublicAboutView /></div>;
            }

            return <div key="404"><Public404View onReturnHome={() => setCurrentTab("home")} /></div>;
          })()}
        </AnimatePresence>
      </main>

      {/* Global Search Modal */}
      <PublicSearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        photos={photos}
        journals={journals}
        projects={projects}
        dailyEntries={dailyEntries}
        onSelectPhoto={(p) => setSelectedPhoto(p)}
        onSelectJournal={(j) => setSelectedJournal(j)}
        onSelectProject={(pr) => setSelectedProject(pr)}
      />

      {/* Detail Modal */}
      <PublicDetailModal
        photo={selectedPhoto}
        journal={selectedJournal}
        project={selectedProject}
        onClose={() => {
          setSelectedPhoto(null);
          setSelectedJournal(null);
          setSelectedProject(null);
        }}
        onSelectPhoto={(p) => setSelectedPhoto(p)}
        onSelectJournal={(j) => setSelectedJournal(j)}
        onSelectProject={(pr) => setSelectedProject(pr)}
        allPhotos={photos}
        allJournals={journals}
        allProjects={projects}
      />

      {/* Editorial Footer */}
      <PublicFooter
        setCurrentTab={setCurrentTab}
        onOpenOfficina={openOfficina}
      />
    </div>
  );
}
