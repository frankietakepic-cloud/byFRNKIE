import { motion } from "motion/react";

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export default function Header({ currentTab, setCurrentTab }: HeaderProps) {
  const tabs = [
    { id: "home", label: "Home" },
    { id: "galleria", label: "Galleria" },
    { id: "journal", label: "Journal" },
    { id: "projects", label: "Workshop" },
    { id: "about", label: "Colophon" }
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0A0908]/90 backdrop-blur-md border-b border-neutral-900 px-6 py-4">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Brand Logo - Designed with cinematic spacing */}
        <div 
          className="cursor-pointer group flex items-baseline gap-1"
          onClick={() => setCurrentTab("home")}
        >
          <span className="font-serif italic text-lg tracking-tight text-neutral-400 transition-colors duration-300 group-hover:text-white">
            by
          </span>
          <span className="font-serif tracking-[0.25em] font-medium text-2xl text-neutral-100 transition-colors duration-300 group-hover:text-white uppercase">
            FRNK
          </span>
        </div>

        {/* Quiet Editorial Navigation */}
        <nav className="flex items-center gap-6 sm:gap-8">
          {tabs.map((tab) => {
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className="relative font-mono text-[10px] tracking-[0.2em] uppercase transition-colors duration-300 py-1.5 cursor-pointer text-neutral-400 hover:text-white"
              >
                <span className={isActive ? "text-neutral-100 font-semibold" : ""}>
                  {tab.label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="activeHeaderTab"
                    className="absolute bottom-0 left-0 right-0 h-[1px] bg-neutral-300"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
