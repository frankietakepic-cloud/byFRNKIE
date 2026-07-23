import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { RefreshCw } from "lucide-react";
import { Photo, JournalEntry, Project, DailyEntry, PageLayout, HeroConfig } from "./types";
import { initialPhotos, initialJournals, initialProjects, initialDailyEntries } from "./data";
import { initialPages, initialHeroConfig } from "./dataPages";
import { apiService } from "./services/api";

import PublicApp from "./components/public/PublicApp";
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

  // Sync client-side SPA route with location path
  useEffect(() => {
    const handleLocationCheck = () => {
      const path = window.location.pathname;
      if (path === "/officina" || path.startsWith("/officina/")) {
        setIsOfficinaMode(true);
      } else {
        setIsOfficinaMode(false);
        const cleanPath = path.replace(/^\//, "");
        if (cleanPath) {
          setCurrentTab(cleanPath);
        } else {
          setCurrentTab("home");
        }
      }
    };

    handleLocationCheck();
    window.addEventListener("popstate", handleLocationCheck);
    return () => window.removeEventListener("popstate", handleLocationCheck);
  }, []);

  // Fetch initial archive state from REST API
  useEffect(() => {
    let isMounted = true;
    const loadArchiveData = async () => {
      try {
        const [photosData, journalsData, projectsData, dailyData, pagesData, heroData] =
          await Promise.all([
            apiService.getPhotos().catch(() => initialPhotos),
            apiService.getJournals().catch(() => initialJournals),
            apiService.getProjects().catch(() => initialProjects),
            apiService.getDailyEntries().catch(() => initialDailyEntries),
            apiService.getPages().catch(() => initialPages),
            apiService.getHeroConfig().catch(() => initialHeroConfig)
          ]);

        if (!isMounted) return;

        if (photosData && photosData.length > 0) setPhotos(photosData);
        if (journalsData && journalsData.length > 0) setJournals(journalsData);
        if (projectsData && projectsData.length > 0) setProjects(projectsData);
        if (dailyData && dailyData.length > 0) setDailyEntries(dailyData);
        if (pagesData && Array.isArray(pagesData) && pagesData.length > 0) setPages(pagesData);
        if (heroData && heroData.sourceType) setHeroConfig(heroData);
      } catch (error) {
        console.warn("Operating with local static memory fallback.", error);
      }
    };

    loadArchiveData();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
    const newPath = tab === "home" ? "/" : `/${tab}`;
    if (window.location.pathname !== newPath) {
      window.history.pushState({}, "", newPath);
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setAuthError(null);
    try {
      const res = await apiService.authenticatePasscode(passcodeInput.trim());
      if (res.success && res.token) {
        sessionStorage.setItem("officina_token", res.token);
        setAuthToken(res.token);
      } else {
        setAuthError("Invalid credentials.");
      }
    } catch (err: any) {
      setAuthError(err.message || "Failed to reach authentication server.");
    } finally {
      setIsAuthenticating(false);
    }
  };

  const openOfficina = () => {
    setIsOfficinaMode(true);
    if (!window.location.pathname.startsWith("/officina")) {
      window.history.pushState({}, "", "/officina");
    }
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
                  <div className="flex justify-between items-center">
                    <label className="font-mono text-[9px] uppercase tracking-wider text-neutral-500">
                      Passcode Access Key
                    </label>
                  </div>
                  <input
                    type="password"
                    required
                    value={passcodeInput}
                    onChange={(e) => setPasscodeInput(e.target.value)}
                    placeholder="Enter passcode"
                    className="w-full bg-[#222222] border border-neutral-800 text-sm p-3 text-neutral-200 focus:outline-none focus:border-neutral-500 font-mono text-center tracking-wider placeholder:tracking-normal placeholder:font-sans transition-colors duration-200 rounded"
                  />
                  <span className="font-mono text-[10px] text-neutral-500 text-center">
                    Authorized curators only.
                  </span>
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
    <PublicApp
      currentTab={currentTab}
      setCurrentTab={handleTabChange}
      photos={photos}
      journals={journals}
      projects={projects}
      dailyEntries={dailyEntries}
      pages={pages}
      heroConfig={heroConfig}
      onOpenOfficina={openOfficina}
    />
  );
}
