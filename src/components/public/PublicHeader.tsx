import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Compass, Clock, BookOpen, Wrench, Camera, Sun, Layers, User, Lock, Menu, X } from "lucide-react";

interface PublicHeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenSearch: () => void;
  onOpenOfficina: () => void;
}

export default function PublicHeader({
  currentTab,
  setCurrentTab,
  onOpenSearch,
  onOpenOfficina
}: PublicHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const tabs = [
    { id: "home", label: "Home" },
    { id: "journal", label: "Journal" },
    { id: "workshop", label: "Workshop" },
    { id: "galleria", label: "Galleria" },
    { id: "daily", label: "Daily" },
    { id: "map", label: "Places" },
    { id: "timeline", label: "Timeline" },
    { id: "about", label: "Manifesto" }
  ];

  // Close mobile menu when tab changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [currentTab]);

  return (
    <header className="sticky top-0 z-40 bg-[#0d0d0d]/90 backdrop-blur-md border-b border-neutral-900/80 px-4 md:px-8 py-3.5 pt-[calc(0.875rem+env(safe-area-inset-top))]">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Identity */}
        <div 
          className="cursor-pointer group flex items-baseline gap-1 select-none"
          onClick={() => setCurrentTab("home")}
        >
          <span className="font-serif italic text-base md:text-lg text-neutral-400 group-hover:text-neutral-100 transition-colors">
            by
          </span>
          <span className="font-serif tracking-[0.25em] font-medium text-xl md:text-2xl text-neutral-100 group-hover:text-white uppercase transition-colors">
            FRNK
          </span>
          <span className="hidden sm:inline font-mono text-[9px] text-neutral-600 tracking-widest uppercase ml-2 border-l border-neutral-800 pl-2">
            Living Digital Archive
          </span>
        </div>

        {/* Desktop Editorial Navigation */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
          {tabs.map((tab) => {
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className="relative font-mono text-[10px] tracking-[0.2em] uppercase transition-colors py-1 cursor-pointer text-neutral-400 hover:text-neutral-100"
              >
                <span className={isActive ? "text-neutral-100 font-semibold" : ""}>
                  {tab.label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="activeHeaderTab"
                    className="absolute -bottom-1 left-0 right-0 h-[1px] bg-neutral-200"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Top Right Tools: Search & Curator Access */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 bg-[#161616] hover:bg-[#1f1f1f] border border-neutral-800 hover:border-neutral-700 text-neutral-300 px-3 py-1.5 rounded text-xs font-mono transition-colors cursor-pointer"
            title="Search Archive (⌘K)"
          >
            <Search className="w-3.5 h-3.5 text-neutral-400" />
            <span className="hidden md:inline text-[11px] text-neutral-400">Search archive...</span>
            <kbd className="hidden sm:inline-block font-mono text-[9px] text-neutral-500 bg-neutral-800 px-1.5 py-0.5 rounded border border-neutral-700/60 ml-1">
              ⌘K
            </kbd>
          </button>

          <button
            onClick={onOpenOfficina}
            className="hidden sm:flex items-center gap-1.5 text-neutral-500 hover:text-neutral-300 p-1.5 font-mono text-[10px] uppercase tracking-wider transition-colors cursor-pointer"
            title="Curator Login (L'Officina OS)"
          >
            <Lock className="w-3 h-3 text-amber-500/70" />
            <span className="hidden xl:inline">L'Officina</span>
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-neutral-400 hover:text-neutral-100 focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-[#121212] border-b border-neutral-800 mt-3 pt-3 pb-5 px-2 flex flex-col gap-1 overflow-hidden"
          >
            <div className="grid grid-cols-2 gap-1.5 font-mono text-xs uppercase tracking-wider">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setCurrentTab(tab.id)}
                  className={`p-2.5 rounded text-left transition-colors cursor-pointer ${
                    currentTab === tab.id
                      ? "bg-neutral-800 text-neutral-100 font-bold"
                      : "text-neutral-400 hover:bg-neutral-900 hover:text-neutral-200"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="pt-3 mt-2 border-t border-neutral-900 flex justify-between items-center px-2">
              <button
                onClick={onOpenOfficina}
                className="flex items-center gap-2 text-amber-400 text-xs font-mono uppercase tracking-wider p-2 bg-amber-950/30 border border-amber-900/40 rounded w-full justify-center"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Enter L'Officina Curator OS</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
