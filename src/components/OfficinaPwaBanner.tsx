import React, { useState, useEffect } from "react";
import { Download, WifiOff, CheckCircle2, X } from "lucide-react";

export default function OfficinaPwaBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [showBanner, setShowBanner] = useState(true);

  useEffect(() => {
    // Check if running in standalone mode (installed as PWA)
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;

    if (isStandalone) {
      setIsInstalled(true);
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    // Online/Offline events
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setIsInstalled(true);
      setIsInstallable(false);
    }
    setDeferredPrompt(null);
  };

  return (
    <>
      {/* Offline Alert Strip */}
      {isOffline && (
        <div className="bg-amber-950/90 text-amber-200 border-b border-amber-800/80 px-4 py-2 text-xs font-mono flex items-center justify-between">
          <div className="flex items-center gap-2">
            <WifiOff className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>L'Officina Operating System running in offline local mode. Drafts auto-queued.</span>
          </div>
          <span className="text-[10px] bg-amber-900/60 px-2 py-0.5 rounded uppercase">
            Offline Mode
          </span>
        </div>
      )}

      {/* PWA Install Promo Banner (When installable and not in standalone) */}
      {isInstallable && !isInstalled && showBanner && (
        <div className="bg-[#1A1A1A] border-b border-neutral-800 px-4 py-2.5 text-xs font-mono flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-6 h-6 bg-neutral-100 text-neutral-950 rounded flex items-center justify-center font-bold text-xs shrink-0">
              L
            </div>
            <div className="flex flex-col truncate">
              <span className="text-neutral-100 font-medium truncate">
                Install L'Officina PWA
              </span>
              <span className="text-[10px] text-neutral-400 truncate">
                Standalone creative workspace for iOS & Android
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleInstallClick}
              className="bg-neutral-100 hover:bg-white text-neutral-950 px-3 py-1 rounded text-[11px] font-medium flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Install
            </button>
            <button
              onClick={() => setShowBanner(false)}
              className="p-1 text-neutral-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
