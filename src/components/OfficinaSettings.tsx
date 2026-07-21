import React from "react";
import { Settings, Shield, HardDrive, Key, Check } from "lucide-react";

interface OfficinaSettingsProps {
  totalPhotos: number;
  totalJournals: number;
  totalProjects: number;
}

export default function OfficinaSettings({
  totalPhotos,
  totalJournals,
  totalProjects
}: OfficinaSettingsProps) {
  return (
    <div className="flex-1 bg-[#121212] p-8 overflow-y-auto font-sans text-neutral-200 custom-scrollbar h-[calc(100vh-3.5rem)]">
      <div className="max-w-2xl mx-auto flex flex-col gap-8">
        <div>
          <h2 className="font-serif text-2xl text-neutral-100 font-semibold mb-1">
            L'Officina System Preferences
          </h2>
          <p className="text-xs text-neutral-400">
            Operating system settings for byFRNK single-editor workspace.
          </p>
        </div>

        {/* Lifetime Archive Capacity */}
        <div className="bg-[#161616] border border-neutral-800 p-6 rounded-xs flex flex-col gap-4">
          <div className="flex items-center gap-2 text-neutral-100 font-serif text-base">
            <HardDrive className="w-4 h-4 text-neutral-400" />
            <span>Archive Longevity Metrics</span>
          </div>

          <div className="grid grid-cols-3 gap-4 font-mono text-xs">
            <div className="bg-neutral-900 border border-neutral-800/80 p-3.5 rounded-xs flex flex-col gap-1">
              <span className="text-[10px] text-neutral-500 uppercase">Photographs</span>
              <span className="text-xl font-bold text-neutral-100">{totalPhotos.toLocaleString()}</span>
              <span className="text-[9px] text-neutral-600">Capacity: 50,000</span>
            </div>

            <div className="bg-neutral-900 border border-neutral-800/80 p-3.5 rounded-xs flex flex-col gap-1">
              <span className="text-[10px] text-neutral-500 uppercase">Journals</span>
              <span className="text-xl font-bold text-neutral-100">{totalJournals.toLocaleString()}</span>
              <span className="text-[9px] text-neutral-600">Capacity: 2,000</span>
            </div>

            <div className="bg-neutral-900 border border-neutral-800/80 p-3.5 rounded-xs flex flex-col gap-1">
              <span className="text-[10px] text-neutral-500 uppercase">Projects</span>
              <span className="text-xl font-bold text-neutral-100">{totalProjects.toLocaleString()}</span>
              <span className="text-[9px] text-neutral-600">Capacity: 300</span>
            </div>
          </div>
        </div>

        {/* Passcode Security */}
        <div className="bg-[#161616] border border-neutral-800 p-6 rounded-xs flex flex-col gap-3">
          <div className="flex items-center gap-2 text-neutral-100 font-serif text-base">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>Passcode Access Key</span>
          </div>
          <p className="text-xs text-neutral-400 leading-relaxed">
            The workspace is protected by a single passkey. You can set the <code className="font-mono bg-neutral-900 px-1.5 py-0.5 border border-neutral-800 text-neutral-300">OFFICINA_PASSCODE</code> environment variable in Secrets, or use the default: <code className="font-mono bg-neutral-900 px-1.5 py-0.5 border border-neutral-800 text-amber-300">takecareofthework</code>.
          </p>
        </div>

        {/* Philosophy */}
        <div className="bg-[#161616] border border-neutral-800 p-6 rounded-xs flex flex-col gap-3 font-serif">
          <span className="text-sm text-neutral-300 font-semibold">Core Philosophy</span>
          <p className="text-xs text-neutral-400 leading-relaxed font-sans">
            "Import first. Organize later. Publish last. Nothing is public by default. Everything begins as raw material. The editor decides what deserves preservation."
          </p>
        </div>
      </div>
    </div>
  );
}
