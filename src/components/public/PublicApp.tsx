import React, { useState } from "react";
import { AnimatePresence } from "motion/react";
import { Photo, JournalEntry, Project, DailyEntry, PageLayout, HeroConfig } from "../../types";

import PublicHeader from "./PublicHeader";
import PublicFooter from "./PublicFooter";
import PublicHomeView from "./PublicHomeView";
import PublicJournalView from "./PublicJournalView";
import PublicWorkshopView from "./PublicWorkshopView";
import PublicGalleriaView from "./PublicGalleriaView";
import PublicDailyView from "./PublicDailyView";
import PublicMapView from "./PublicMapView";
import PublicTimelineView from "./PublicTimelineView";
import PublicAboutView from "./PublicAboutView";
import PublicSearchModal from "./PublicSearchModal";
import PublicDetailModal from "./PublicDetailModal";
import Public404View from "./Public404View";
import PublicPageRenderer from "./PublicPageRenderer";

interface PublicAppProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  photos: Photo[];
  journals: JournalEntry[];
  projects: Project[];
  dailyEntries: DailyEntry[];
  pages: PageLayout[];
  heroConfig: HeroConfig;
  onOpenOfficina: () => void;
}

export default function PublicApp({
  currentTab,
  setCurrentTab,
  photos,
  journals,
  projects,
  dailyEntries,
  pages,
  heroConfig,
  onOpenOfficina
}: PublicAppProps) {
  const [searchModalOpen, setSearchModalOpen] = useState<boolean>(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [selectedJournal, setSelectedJournal] = useState<JournalEntry | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-neutral-200 selection:bg-neutral-800 selection:text-white flex flex-col font-sans">
      {/* Public Header */}
      <PublicHeader
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenSearch={() => setSearchModalOpen(true)}
        onOpenOfficina={onOpenOfficina}
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
        onOpenOfficina={onOpenOfficina}
      />
    </div>
  );
}
