import React, { useState } from "react";
import { Send, CheckCircle2, Lock, ArrowUpRight, Globe, Compass } from "lucide-react";

interface PublicFooterProps {
  setCurrentTab: (tab: string) => void;
  onOpenOfficina: () => void;
}

export default function PublicFooter({ setCurrentTab, onOpenOfficina }: PublicFooterProps) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="bg-[#0a0a0a] border-t border-neutral-900 text-neutral-400 font-sans mt-24">
      {/* Occasional Letters Section */}
      <div className="max-w-6xl mx-auto px-6 py-16 border-b border-neutral-900/80">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-7 flex flex-col gap-3">
            <span className="font-mono text-[10px] tracking-[0.25em] text-neutral-500 uppercase">
              Occasional Letters
            </span>
            <h3 className="font-serif text-2xl md:text-3xl text-neutral-100 font-medium tracking-tight">
              Thoughts from the archive.
            </h3>
            <p className="font-sans text-xs md:text-sm text-neutral-400 font-light max-w-lg leading-relaxed">
              Sent rarely when a project finishes, an essay is completed, or a field study is published. No algorithms, no marketing promotions, no spam.
            </p>
          </div>

          <div className="md:col-span-5 flex flex-col gap-3">
            {subscribed ? (
              <div className="bg-emerald-950/30 border border-emerald-900/40 p-4 rounded-lg flex items-center gap-3 text-emerald-300 font-mono text-xs">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>You have been added to the occasional correspondence dispatch.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@domain.com"
                  className="bg-[#141414] border border-neutral-800 text-xs px-3.5 py-2.5 text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:border-neutral-600 font-mono rounded flex-1"
                />
                <button
                  type="submit"
                  className="bg-neutral-100 hover:bg-white text-neutral-950 font-mono text-xs uppercase font-bold tracking-wider px-5 py-2.5 rounded transition-colors cursor-pointer shrink-0"
                >
                  Join Correspondence
                </button>
              </form>
            )}
            <span className="font-mono text-[9px] text-neutral-600">
              Respectful email cadence • Unsubscribe anytime with one click
            </span>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Directory */}
      <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-12 gap-12 text-xs font-sans">
        {/* Brand Column */}
        <div className="md:col-span-4 flex flex-col gap-4">
          <div 
            className="cursor-pointer flex items-baseline gap-1"
            onClick={() => setCurrentTab("home")}
          >
            <span className="font-serif italic text-lg text-neutral-400">by</span>
            <span className="font-serif tracking-[0.25em] font-medium text-2xl text-neutral-100 uppercase">
              FRNK
            </span>
          </div>
          <p className="font-serif italic text-neutral-400 text-sm leading-relaxed font-light">
            "A living digital archive documenting one person's life through photography, engineering, writing and observation."
          </p>
          <div className="font-mono text-[10px] text-neutral-600 uppercase tracking-wider pt-2">
            Architected for longevity (2026–2046)
          </div>
        </div>

        {/* Primary Views */}
        <div className="md:col-span-3 flex flex-col gap-3 font-mono text-[11px]">
          <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold mb-1">
            Archive Order
          </span>
          <button onClick={() => setCurrentTab("about")} className="text-left text-neutral-400 hover:text-neutral-100 transition-colors">
            I. Person & Manifesto
          </button>
          <button onClick={() => setCurrentTab("journal")} className="text-left text-neutral-400 hover:text-neutral-100 transition-colors">
            II. Thoughts & Essays
          </button>
          <button onClick={() => setCurrentTab("workshop")} className="text-left text-neutral-400 hover:text-neutral-100 transition-colors">
            III. Workshop Projects
          </button>
          <button onClick={() => setCurrentTab("galleria")} className="text-left text-neutral-400 hover:text-neutral-100 transition-colors">
            IV. Photography Galleria
          </button>
          <button onClick={() => setCurrentTab("daily")} className="text-left text-neutral-400 hover:text-neutral-100 transition-colors">
            V. Daily Observations
          </button>
        </div>

        {/* Index & Places */}
        <div className="md:col-span-3 flex flex-col gap-3 font-mono text-[11px]">
          <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold mb-1">
            Geographic Index
          </span>
          <button onClick={() => setCurrentTab("map")} className="text-left text-neutral-400 hover:text-neutral-100 transition-colors">
            Kyoto, Japan
          </button>
          <button onClick={() => setCurrentTab("map")} className="text-left text-neutral-400 hover:text-neutral-100 transition-colors">
            Saigon, Vietnam
          </button>
          <button onClick={() => setCurrentTab("map")} className="text-left text-neutral-400 hover:text-neutral-100 transition-colors">
            Toronto, Canada
          </button>
          <button onClick={() => setCurrentTab("map")} className="text-left text-neutral-400 hover:text-neutral-100 transition-colors">
            Dalat, Vietnam
          </button>
          <button onClick={() => setCurrentTab("map")} className="text-left text-neutral-400 hover:text-neutral-100 transition-colors">
            Osaka, Japan
          </button>
        </div>

        {/* System & Curator */}
        <div className="md:col-span-2 flex flex-col gap-3 font-mono text-[11px]">
          <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold mb-1">
            Navigation
          </span>
          <button onClick={() => setCurrentTab("timeline")} className="text-left text-neutral-400 hover:text-neutral-100 transition-colors">
            Life Timeline
          </button>
          <button onClick={() => setCurrentTab("map")} className="text-left text-neutral-400 hover:text-neutral-100 transition-colors">
            Geographic Map
          </button>
          <button onClick={onOpenOfficina} className="text-left text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1.5 mt-2">
            <Lock className="w-3 h-3" />
            <span>L'Officina OS</span>
          </button>
        </div>
      </div>

      {/* Sub-Footer */}
      <div className="border-t border-neutral-900/60 py-6 px-6 max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[10px] text-neutral-600">
        <div>
          © {new Date().getFullYear()} byFRNK. All rights reserved. Quiet, intentional software.
        </div>
        <div className="flex items-center gap-4">
          <span>Dark Mode Identity</span>
          <span>•</span>
          <button onClick={onOpenOfficina} className="hover:text-neutral-400 transition-colors">
            Curator Access
          </button>
        </div>
      </div>
    </footer>
  );
}
