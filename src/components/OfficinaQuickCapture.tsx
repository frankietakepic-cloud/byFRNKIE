import React, { useState, useRef } from "react";
import { Plus, Camera, PenTool, Cpu, Calendar, Mic, X, Image as ImageIcon, Sparkles, Check, Square } from "lucide-react";
import { Photo, JournalEntry, Project, DailyEntry, QuickCaptureType } from "../types";

interface OfficinaQuickCaptureProps {
  onPhotoUploaded: (photo: Photo) => void;
  onJournalCreated: (journal: JournalEntry) => void;
  onProjectCreated: (project: Project) => void;
  onDailyCreated: (daily: DailyEntry) => void;
  authToken?: string | null;
}

export default function OfficinaQuickCapture({
  onPhotoUploaded,
  onJournalCreated,
  onProjectCreated,
  onDailyCreated,
}: OfficinaQuickCaptureProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<QuickCaptureType>("photo");

  // Quick Photo State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [photoTitle, setPhotoTitle] = useState("");
  const [photoLocation, setPhotoLocation] = useState("Studio L'Officina");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Quick Journal State
  const [journalTitle, setJournalTitle] = useState("");
  const [journalCategory, setJournalCategory] = useState("Essays");
  const [journalContent, setJournalContent] = useState("");

  // Quick Project State
  const [projectTitle, setProjectTitle] = useState("");
  const [projectCategory, setProjectCategory] = useState("Engineering");
  const [projectDesc, setProjectDesc] = useState("");

  // Quick Daily State
  const [dailyNote, setDailyNote] = useState("");
  const [dailyMood, setDailyMood] = useState("Observational");
  const [dailyWeather, setDailyWeather] = useState("28°C · Clear Sky");

  // Voice Note Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioTranscript, setAudioTranscript] = useState("");
  const recordingTimerRef = useRef<any>(null);

  const toggleModal = () => {
    setIsOpen(!isOpen);
    if (!isOpen && typeof window !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(15);
      } catch {}
    }
  };

  // Handle File Select
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      if (!photoTitle) {
        setPhotoTitle(file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "));
      }
    }
  };

  // Quick Photo Submit
  const handleSavePhoto = () => {
    const newPhoto: Photo = {
      id: `photo-${Date.now()}`,
      url: previewUrl || "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1200&auto=format&fit=crop",
      title: photoTitle.trim() || "Untitled Capture",
      caption: "Quick capture draft imported directly into L'Officina ledger.",
      date: new Date().toISOString().split("T")[0],
      location: photoLocation || "Studio L'Officina",
      status: "draft",
      camera: "Mobile Sensor / Quick Capture",
      lens: "24mm Equivalent",
      tags: ["#QuickCapture", "#Draft"],
      rating: 0,
      flag: "none"
    };

    onPhotoUploaded(newPhoto);
    resetAndClose();
  };

  // Quick Journal Submit
  const handleSaveJournal = () => {
    if (!journalTitle.trim() && !journalContent.trim()) return;

    const newJournal: JournalEntry = {
      id: `journal-${Date.now()}`,
      title: journalTitle.trim() || "Untitled Observation",
      category: journalCategory,
      date: new Date().toISOString().split("T")[0],
      content: journalContent.trim(),
      status: "draft",
      tags: ["#Draft", "#QuickCapture"],
      wordCount: journalContent.trim().split(/\s+/).filter(Boolean).length,
      readingTime: Math.ceil(journalContent.trim().split(/\s+/).filter(Boolean).length / 200) || 1
    };

    onJournalCreated(newJournal);
    resetAndClose();
  };

  // Quick Project Submit
  const handleSaveProject = () => {
    if (!projectTitle.trim()) return;

    const newProject: Project = {
      id: `project-${Date.now()}`,
      title: projectTitle.trim(),
      category: projectCategory,
      status: "concept",
      description: projectDesc.trim() || "Newly initialized workshop project draft.",
      process: "Initial ideation and physical parameter setup.",
      outcome: "Draft concept under refinement.",
      imageUrl: "https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?q=80&w=1200&auto=format&fit=crop"
    };

    onProjectCreated(newProject);
    resetAndClose();
  };

  // Quick Daily Submit
  const handleSaveDaily = () => {
    if (!dailyNote.trim() && !audioTranscript) return;

    const newDaily: DailyEntry = {
      id: `daily-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      location: photoLocation || "Studio L'Officina",
      weather: dailyWeather,
      focusMood: dailyMood,
      content: dailyNote.trim() || audioTranscript || "Daily observation logged.",
      audioTranscript: audioTranscript || undefined,
      tags: ["#Daily", "#Log"]
    };

    onDailyCreated(newDaily);
    resetAndClose();
  };

  // Voice Recording Toggle
  const startRecording = () => {
    setIsRecording(true);
    setRecordingSeconds(0);
    setAudioTranscript("");

    recordingTimerRef.current = setInterval(() => {
      setRecordingSeconds((prev) => prev + 1);
    }, 1000);

    // Simulate real-time dictation
    setTimeout(() => {
      setAudioTranscript("Voice note dictation: Observational light test in workshop. Note camera shutter tension feels smooth after cleaning.");
    }, 2500);
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
  };

  const resetAndClose = () => {
    setIsOpen(false);
    setPhotoTitle("");
    setPreviewUrl(null);
    setJournalTitle("");
    setJournalContent("");
    setProjectTitle("");
    setProjectDesc("");
    setDailyNote("");
    setAudioTranscript("");
    setIsRecording(false);
    if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={toggleModal}
        aria-label="Quick Capture"
        className="fixed bottom-20 right-5 md:bottom-8 md:right-8 z-50 w-14 h-14 bg-neutral-100 hover:bg-white text-neutral-950 rounded-full flex items-center justify-center shadow-2xl transition-all hover:scale-105 active:scale-95 cursor-pointer group border border-neutral-300"
      >
        <Plus className={`w-6 h-6 transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`} />
        <span className="sr-only">Quick Capture</span>
      </button>

      {/* Quick Capture Sheet / Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-neutral-950/80 backdrop-blur-sm flex flex-col justify-end md:justify-center items-center p-0 md:p-4 animate-in fade-in duration-200">
          <div className="w-full md:max-w-xl bg-[#181818] border border-neutral-800 rounded-t-2xl md:rounded-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            {/* Header bar */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-800/80 bg-[#141414]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="font-serif text-sm font-medium tracking-wide text-neutral-100">
                  Quick Capture
                </span>
                <span className="font-mono text-[9px] uppercase tracking-widest bg-neutral-800 px-2 py-0.5 text-neutral-400">
                  Instant Ledger
                </span>
              </div>
              <button
                onClick={resetAndClose}
                className="p-1 text-neutral-400 hover:text-white rounded-md cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Selector Tabs */}
            <div className="flex items-center justify-around border-b border-neutral-800/80 bg-[#161616] p-1 text-xs font-mono">
              <button
                onClick={() => setActiveTab("photo")}
                className={`flex-1 py-2 flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  activeTab === "photo"
                    ? "text-neutral-100 border-b-2 border-neutral-200 font-semibold"
                    : "text-neutral-500 hover:text-neutral-300"
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Photo</span>
              </button>

              <button
                onClick={() => setActiveTab("journal")}
                className={`flex-1 py-2 flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  activeTab === "journal"
                    ? "text-neutral-100 border-b-2 border-neutral-200 font-semibold"
                    : "text-neutral-500 hover:text-neutral-300"
                }`}
              >
                <PenTool className="w-3.5 h-3.5" />
                <span>Journal</span>
              </button>

              <button
                onClick={() => setActiveTab("project")}
                className={`flex-1 py-2 flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  activeTab === "project"
                    ? "text-neutral-100 border-b-2 border-neutral-200 font-semibold"
                    : "text-neutral-500 hover:text-neutral-300"
                }`}
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>Project</span>
              </button>

              <button
                onClick={() => setActiveTab("daily")}
                className={`flex-1 py-2 flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  activeTab === "daily"
                    ? "text-neutral-100 border-b-2 border-neutral-200 font-semibold"
                    : "text-neutral-500 hover:text-neutral-300"
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Daily</span>
              </button>

              <button
                onClick={() => setActiveTab("voice")}
                className={`flex-1 py-2 flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  activeTab === "voice"
                    ? "text-neutral-100 border-b-2 border-neutral-200 font-semibold"
                    : "text-neutral-500 hover:text-neutral-300"
                }`}
              >
                <Mic className="w-3.5 h-3.5" />
                <span>Voice</span>
              </button>
            </div>

            {/* Tab Body */}
            <div className="p-5 overflow-y-auto space-y-4 flex-1">
              {/* PHOTO CAPTURE */}
              {activeTab === "photo" && (
                <div className="space-y-4">
                  {/* File Pickers */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => cameraInputRef.current?.click()}
                      className="flex flex-col items-center justify-center gap-2 p-4 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-lg text-neutral-300 hover:text-white transition-colors cursor-pointer text-center"
                    >
                      <Camera className="w-6 h-6 text-amber-400" />
                      <span className="font-mono text-xs font-medium">Camera Shot</span>
                      <span className="text-[10px] text-neutral-500">Capture with camera</span>
                    </button>

                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex flex-col items-center justify-center gap-2 p-4 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-lg text-neutral-300 hover:text-white transition-colors cursor-pointer text-center"
                    >
                      <ImageIcon className="w-6 h-6 text-emerald-400" />
                      <span className="font-mono text-xs font-medium">From Gallery</span>
                      <span className="text-[10px] text-neutral-500">Select image files</span>
                    </button>
                  </div>

                  <input
                    ref={cameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  {previewUrl && (
                    <div className="relative rounded-lg overflow-hidden border border-neutral-800 bg-neutral-900 aspect-video flex items-center justify-center">
                      <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        onClick={() => setPreviewUrl(null)}
                        className="absolute top-2 right-2 bg-black/70 p-1 rounded-full text-white cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1">
                      Photo Title
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Kyoto Shadow at Dusk"
                      value={photoTitle}
                      onChange={(e) => setPhotoTitle(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-md px-3 py-2 text-sm text-neutral-100 focus:outline-none focus:border-neutral-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1">
                      Location Stamp
                    </label>
                    <input
                      type="text"
                      value={photoLocation}
                      onChange={(e) => setPhotoLocation(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-md px-3 py-2 text-sm text-neutral-100 focus:outline-none focus:border-neutral-600"
                    />
                  </div>

                  <button
                    onClick={handleSavePhoto}
                    className="w-full py-2.5 bg-neutral-100 hover:bg-white text-neutral-950 font-mono text-xs font-medium uppercase tracking-wider rounded-md transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    Save Photo Draft
                  </button>
                </div>
              )}

              {/* JOURNAL CAPTURE */}
              {activeTab === "journal" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      placeholder="Essay or note title..."
                      value={journalTitle}
                      onChange={(e) => setJournalTitle(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-md px-3 py-2 text-sm text-neutral-100 focus:outline-none focus:border-neutral-600"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1">
                        Category
                      </label>
                      <select
                        value={journalCategory}
                        onChange={(e) => setJournalCategory(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-md px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-neutral-600"
                      >
                        <option value="Essays">Essays</option>
                        <option value="Photography">Photography</option>
                        <option value="Engineering">Engineering</option>
                        <option value="Design">Design</option>
                        <option value="Philosophy">Philosophy</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1">
                        Initial Status
                      </label>
                      <input
                        type="text"
                        disabled
                        value="Draft Ledger"
                        className="w-full bg-neutral-900/50 border border-neutral-800/50 rounded-md px-3 py-2 text-xs text-neutral-500 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1">
                      Content / Note
                    </label>
                    <textarea
                      rows={5}
                      placeholder="Write your thought, observation, or draft paragraph..."
                      value={journalContent}
                      onChange={(e) => setJournalContent(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-md p-3 text-sm text-neutral-100 focus:outline-none focus:border-neutral-600 font-serif leading-relaxed resize-none"
                    />
                  </div>

                  <button
                    onClick={handleSaveJournal}
                    className="w-full py-2.5 bg-neutral-100 hover:bg-white text-neutral-950 font-mono text-xs font-medium uppercase tracking-wider rounded-md transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    Save Journal Entry
                  </button>
                </div>
              )}

              {/* PROJECT CAPTURE */}
              {activeTab === "project" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1">
                      Project Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Mechanical Watch Restoration"
                      value={projectTitle}
                      onChange={(e) => setProjectTitle(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-md px-3 py-2 text-sm text-neutral-100 focus:outline-none focus:border-neutral-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1">
                      Category
                    </label>
                    <select
                      value={projectCategory}
                      onChange={(e) => setProjectCategory(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-md px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-neutral-600"
                    >
                      <option value="Engineering">Engineering</option>
                      <option value="Restoration">Restoration</option>
                      <option value="Photography">Photography</option>
                      <option value="Editorial">Editorial</option>
                      <option value="Software">Software</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1">
                      Concept Brief / Purpose
                    </label>
                    <textarea
                      rows={4}
                      placeholder="What is the objective or mechanical goal of this project?"
                      value={projectDesc}
                      onChange={(e) => setProjectDesc(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-md p-3 text-xs text-neutral-100 focus:outline-none focus:border-neutral-600 resize-none"
                    />
                  </div>

                  <button
                    onClick={handleSaveProject}
                    className="w-full py-2.5 bg-neutral-100 hover:bg-white text-neutral-950 font-mono text-xs font-medium uppercase tracking-wider rounded-md transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    Initialize Workshop Project
                  </button>
                </div>
              )}

              {/* DAILY OBSERVATION CAPTURE */}
              {activeTab === "daily" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs font-mono text-neutral-400 bg-neutral-900/60 p-2.5 rounded-md border border-neutral-800">
                    <span>{new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</span>
                    <span>{dailyWeather}</span>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1">
                      Observation Note
                    </label>
                    <textarea
                      rows={4}
                      placeholder="What caught your eye today? Light, sound, mechanic, or thought..."
                      value={dailyNote}
                      onChange={(e) => setDailyNote(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-md p-3 text-xs text-neutral-100 focus:outline-none focus:border-neutral-600 font-serif leading-relaxed resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1">
                        Focus State
                      </label>
                      <select
                        value={dailyMood}
                        onChange={(e) => setDailyMood(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-md px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-neutral-600"
                      >
                        <option value="Observational">Observational</option>
                        <option value="Deep Focus">Deep Focus</option>
                        <option value="Quiet">Quiet</option>
                        <option value="Workshop">Workshop</option>
                        <option value="Restoration">Restoration</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1">
                        Weather Stamp
                      </label>
                      <input
                        type="text"
                        value={dailyWeather}
                        onChange={(e) => setDailyWeather(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-md px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-neutral-600"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleSaveDaily}
                    className="w-full py-2.5 bg-neutral-100 hover:bg-white text-neutral-950 font-mono text-xs font-medium uppercase tracking-wider rounded-md transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    Log Daily Observation
                  </button>
                </div>
              )}

              {/* VOICE NOTE CAPTURE */}
              {activeTab === "voice" && (
                <div className="space-y-4 py-2 text-center">
                  <div className="p-6 bg-neutral-900/60 rounded-xl border border-neutral-800 flex flex-col items-center justify-center gap-4">
                    {!isRecording ? (
                      <button
                        onClick={startRecording}
                        className="w-16 h-16 bg-red-900/30 hover:bg-red-900/50 text-red-400 border border-red-800/80 rounded-full flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95"
                      >
                        <Mic className="w-8 h-8" />
                      </button>
                    ) : (
                      <button
                        onClick={stopRecording}
                        className="w-16 h-16 bg-red-600 text-white rounded-full flex items-center justify-center transition-all cursor-pointer animate-pulse"
                      >
                        <Square className="w-6 h-6 fill-white" />
                      </button>
                    )}

                    <div className="flex flex-col items-center">
                      <span className="font-mono text-xs font-medium text-neutral-200">
                        {isRecording ? "Recording Voice Memo..." : "Tap to record audio note"}
                      </span>
                      <span className="font-mono text-sm text-amber-400 mt-1">
                        00:{recordingSeconds < 10 ? `0${recordingSeconds}` : recordingSeconds}
                      </span>
                    </div>

                    {isRecording && (
                      <div className="flex items-center gap-1 h-6">
                        <span className="w-1 bg-red-500 h-3 animate-bounce" />
                        <span className="w-1 bg-red-500 h-6 animate-bounce delay-100" />
                        <span className="w-1 bg-red-500 h-4 animate-bounce delay-200" />
                        <span className="w-1 bg-red-500 h-5 animate-bounce delay-150" />
                      </div>
                    )}
                  </div>

                  {audioTranscript && (
                    <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-md text-left">
                      <span className="block text-[9px] font-mono text-amber-400 uppercase tracking-widest mb-1">
                        Live Auto-Transcript
                      </span>
                      <p className="text-xs text-neutral-200 font-serif italic">
                        "{audioTranscript}"
                      </p>
                    </div>
                  )}

                  <button
                    onClick={handleSaveDaily}
                    disabled={!audioTranscript && !isRecording}
                    className="w-full py-2.5 bg-neutral-100 hover:bg-white text-neutral-950 font-mono text-xs font-medium uppercase tracking-wider rounded-md transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-40"
                  >
                    <Check className="w-4 h-4" />
                    Save Voice Log to Daily Ledger
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
