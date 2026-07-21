import React from "react";
import { Grid, PenTool, Cpu, Calendar, Sliders } from "lucide-react";
import { SidebarViewMode } from "./OfficinaSidebar";

interface OfficinaBottomNavProps {
  activeView: SidebarViewMode;
  onViewChange: (view: SidebarViewMode) => void;
  unreadDraftsCount?: number;
}

export default function OfficinaBottomNav({
  activeView,
  onViewChange,
  unreadDraftsCount = 0,
}: OfficinaBottomNavProps) {
  const navItems: { id: SidebarViewMode; label: string; icon: React.ElementType; badge?: number }[] = [
    { id: "library", label: "Library", icon: Grid },
    { id: "journal", label: "Journal", icon: PenTool },
    { id: "workshop", label: "Workshop", icon: Cpu },
    { id: "daily", label: "Daily", icon: Calendar },
    { id: "settings", label: "Settings", icon: Sliders },
  ];

  const handleSelect = (id: SidebarViewMode) => {
    // Haptic feedback trigger on mobile if supported
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(12);
      } catch {
        // ignore
      }
    }
    onViewChange(id);
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#161616]/95 backdrop-blur-md border-t border-neutral-800/80 px-2 py-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))]">
      <div className="grid grid-cols-5 items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            activeView === item.id ||
            (item.id === "library" &&
              ["drafts", "published", "archived", "trash", "collection", "tag"].includes(activeView));

          return (
            <button
              key={item.id}
              onClick={() => handleSelect(item.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-lg transition-all relative cursor-pointer active:scale-95 ${
                isActive
                  ? "text-neutral-100 font-medium"
                  : "text-neutral-500 hover:text-neutral-300"
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? "scale-110 text-white" : ""}`} />
                {item.id === "library" && unreadDraftsCount > 0 && (
                  <span className="absolute -top-1 -right-1.5 w-2 h-2 bg-amber-500 rounded-full" />
                )}
              </div>
              <span className={`text-[10px] font-mono tracking-tight mt-1 transition-opacity ${isActive ? "opacity-100 text-neutral-200 font-semibold" : "opacity-70"}`}>
                {item.label}
              </span>

              {isActive && (
                <span className="absolute -bottom-1.5 w-5 h-0.5 bg-neutral-200 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
