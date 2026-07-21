import React, { useState } from "react";
import { DailyEntry } from "../types";
import { Sun, MapPin, Mic, Plus, Trash2, Tag, Calendar, Sparkles } from "lucide-react";

interface OfficinaDailyProps {
  dailyEntries: DailyEntry[];
  onSaveDaily: (entry: DailyEntry) => void;
  onDeleteDaily: (id: string) => void;
}

export default function OfficinaDaily({
  dailyEntries,
  onSaveDaily,
  onDeleteDaily,
}: OfficinaDailyProps) {
  const [activeEntryId, setActiveEntryId] = useState<string | null>(
    dailyEntries.length > 0 ? dailyEntries[0].id : null
  );

  const [isEditing, setIsEditing] = useState(false);
  const [contentInput, setContentInput] = useState("");
  const [locationInput, setLocationInput] = useState("Studio L'Officina, Saigon");
  const [weatherInput, setWeatherInput] = useState("28°C · Morning Rain");
  const [moodInput, setMoodInput] = useState("Observational");
  const [tagsInput, setTagsInput] = useState("#Daily, #Observation");

  const activeEntry = dailyEntries.find((e) => e.id === activeEntryId) || null;

  const handleStartNew = () => {
    setIsEditing(true);
    setActiveEntryId(null);
    setContentInput("");
    setLocationInput("Studio L'Officina, Saigon");
    setWeatherInput("28°C · Morning Rain");
    setMoodInput("Observational");
    setTagsInput("#Daily, #Studio");
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contentInput.trim()) return;

    const newEntry: DailyEntry = {
      id: `daily-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      location: locationInput,
      weather: weatherInput,
      focusMood: moodInput,
      content: contentInput.trim(),
      tags: tagsInput.split(",").map((t) => t.trim()).filter(Boolean)
    };

    onSaveDaily(newEntry);
    setIsEditing(false);
    setActiveEntryId(newEntry.id);
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row bg-[#121212] overflow-hidden">
      {/* Daily Entries Timeline (Left Column on Desktop, Top Section on Mobile) */}
      <div className="w-full md:w-80 border-r border-neutral-800/80 bg-[#151515] flex flex-col h-full overflow-hidden">
        {/* Timeline Header */}
        <div className="p-4 border-b border-neutral-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-400" />
            <span className="font-serif text-sm font-medium text-neutral-100">
              Daily Ledger
            </span>
            <span className="font-mono text-[9px] text-neutral-500 bg-neutral-800 px-1.5 py-0.5 rounded">
              {dailyEntries.length}
            </span>
          </div>

          <button
            onClick={handleStartNew}
            className="p-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-md transition-colors cursor-pointer flex items-center gap-1 font-mono text-[10px] uppercase"
          >
            <Plus className="w-3.5 h-3.5" />
            Log
          </button>
        </div>

        {/* List of Entries */}
        <div className="flex-1 overflow-y-auto divide-y divide-neutral-800/50">
          {dailyEntries.length === 0 ? (
            <div className="p-8 text-center text-neutral-500 font-mono text-xs">
              No daily observations logged yet.
            </div>
          ) : (
            dailyEntries.map((entry) => {
              const isSelected = entry.id === activeEntryId && !isEditing;
              return (
                <div
                  key={entry.id}
                  onClick={() => {
                    setActiveEntryId(entry.id);
                    setIsEditing(false);
                  }}
                  className={`p-4 transition-colors cursor-pointer border-l-2 ${
                    isSelected
                      ? "bg-neutral-800/60 border-amber-400 text-neutral-100"
                      : "border-transparent text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/40"
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                    <span className="text-amber-400/90 font-semibold">{entry.date}</span>
                    <span className="text-neutral-500">{entry.time}</span>
                  </div>

                  <p className="font-serif text-xs leading-relaxed line-clamp-2 text-neutral-200">
                    {entry.content}
                  </p>

                  <div className="mt-2 flex items-center justify-between text-[9px] font-mono text-neutral-500">
                    <span className="flex items-center gap-1 truncate max-w-[140px]">
                      <MapPin className="w-3 h-3 text-neutral-600 shrink-0" />
                      {entry.location || "Studio"}
                    </span>
                    {entry.focusMood && (
                      <span className="bg-neutral-800/80 px-1.5 py-0.5 text-neutral-400">
                        {entry.focusMood}
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Entry Detail / Form view */}
      <div className="flex-1 flex flex-col h-full overflow-y-auto bg-[#121212] p-6 md:p-10">
        {isEditing ? (
          /* New Daily Entry Form */
          <form onSubmit={handleCreateSubmit} className="max-w-2xl mx-auto w-full space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h2 className="font-serif text-lg font-medium text-neutral-100">
                  New Daily Observation
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="font-mono text-xs text-neutral-500 hover:text-neutral-300"
              >
                Cancel
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-mono text-[10px] uppercase text-neutral-400 mb-1">
                  Location Stamp
                </label>
                <input
                  type="text"
                  value={locationInput}
                  onChange={(e) => setLocationInput(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-neutral-600"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase text-neutral-400 mb-1">
                  Weather Condition
                </label>
                <input
                  type="text"
                  value={weatherInput}
                  onChange={(e) => setWeatherInput(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-neutral-600"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase text-neutral-400 mb-1">
                  Focus State
                </label>
                <input
                  type="text"
                  value={moodInput}
                  onChange={(e) => setMoodInput(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-neutral-600"
                />
              </div>
            </div>

            <div>
              <label className="block font-mono text-[10px] uppercase text-neutral-400 mb-1">
                Observation Text
              </label>
              <textarea
                rows={8}
                placeholder="Record today's quiet details, light observations, workshop updates, or philosophical thoughts..."
                value={contentInput}
                onChange={(e) => setContentInput(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded p-4 text-sm text-neutral-100 font-serif leading-relaxed focus:outline-none focus:border-neutral-600 resize-none"
              />
            </div>

            <div>
              <label className="block font-mono text-[10px] uppercase text-neutral-400 mb-1">
                Tags (Comma-separated)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-neutral-600"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-neutral-100 hover:bg-white text-neutral-950 font-mono text-xs uppercase tracking-wider font-semibold rounded transition-colors cursor-pointer"
            >
              Commit Observation to Ledger
            </button>
          </form>
        ) : activeEntry ? (
          /* Active Entry View */
          <div className="max-w-2xl mx-auto w-full space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-800/80 pb-4">
              <div>
                <span className="font-mono text-xs text-amber-400 tracking-wider">
                  {activeEntry.date} · {activeEntry.time}
                </span>
                <h1 className="font-serif text-2xl font-medium text-neutral-100 mt-1">
                  Daily Observation
                </h1>
              </div>

              <button
                onClick={() => onDeleteDaily(activeEntry.id)}
                className="p-2 text-neutral-500 hover:text-red-400 transition-colors rounded cursor-pointer"
                title="Delete Entry"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Environmental Metadata Pills */}
            <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-neutral-400 bg-neutral-900/50 p-3 rounded-lg border border-neutral-800/80">
              {activeEntry.location && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>{activeEntry.location}</span>
                </div>
              )}
              {activeEntry.weather && (
                <div className="flex items-center gap-1.5 border-l border-neutral-800 pl-3">
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>{activeEntry.weather}</span>
                </div>
              )}
              {activeEntry.focusMood && (
                <div className="flex items-center gap-1.5 border-l border-neutral-800 pl-3">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>{activeEntry.focusMood}</span>
                </div>
              )}
            </div>

            {/* Content Body */}
            <div className="prose prose-invert max-w-none font-serif text-neutral-200 text-base leading-relaxed whitespace-pre-wrap py-2">
              {activeEntry.content}
            </div>

            {/* Audio Transcript snippet if exists */}
            {activeEntry.audioTranscript && (
              <div className="p-4 bg-neutral-900/80 border border-neutral-800 rounded-lg flex items-start gap-3">
                <Mic className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="block font-mono text-[9px] uppercase text-amber-400 tracking-widest mb-1">
                    Voice Note Transcript
                  </span>
                  <p className="font-serif text-xs text-neutral-300 italic">
                    {activeEntry.audioTranscript}
                  </p>
                </div>
              </div>
            )}

            {/* Photo Attachment preview if exists */}
            {activeEntry.photoUrls && activeEntry.photoUrls.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {activeEntry.photoUrls.map((url, idx) => (
                  <div key={idx} className="aspect-video rounded-lg overflow-hidden border border-neutral-800">
                    <img src={url} alt="Attached photo" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}

            {/* Tags list */}
            {activeEntry.tags && activeEntry.tags.length > 0 && (
              <div className="flex items-center gap-2 pt-4 border-t border-neutral-800/80 text-xs font-mono text-neutral-500">
                <Tag className="w-3.5 h-3.5 text-neutral-600" />
                {activeEntry.tags.map((tag, idx) => (
                  <span key={idx} className="bg-neutral-800 px-2 py-0.5 rounded text-neutral-300">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center flex-1 text-center text-neutral-500 font-mono text-xs gap-3">
            <Calendar className="w-8 h-8 text-neutral-700" />
            <p>Select a daily entry or log a new observation.</p>
          </div>
        )}
      </div>
    </div>
  );
}
