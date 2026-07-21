import React from "react";
import { motion } from "motion/react";
import { Wrench, CheckCircle2, AlertTriangle, Layers, ArrowRight, DollarSign, ListChecks } from "lucide-react";
import { Project, Photo, JournalEntry } from "../../types";

interface PublicWorkshopViewProps {
  projects: Project[];
  photos: Photo[];
  journals: JournalEntry[];
  onSelectProject: (project: Project) => void;
  onSelectPhoto: (photo: Photo) => void;
  onSelectJournal: (journal: JournalEntry) => void;
}

export default function PublicWorkshopView({
  projects,
  photos,
  journals,
  onSelectProject,
  onSelectPhoto,
  onSelectJournal
}: PublicWorkshopViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col gap-12 font-sans max-w-5xl mx-auto selection:bg-neutral-800 selection:text-white"
    >
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-neutral-900 pb-8">
        <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-neutral-500">
          THE ENGINEER'S NOTEBOOK
        </span>
        <h1 className="font-serif text-3xl md:text-5xl text-neutral-100 font-normal tracking-tight">
          Workshop Projects
        </h1>
        <p className="font-sans text-xs md:text-sm text-neutral-400 font-light max-w-xl leading-relaxed">
          Workshop documents the process, not only finished work. Here we record ideas, experiments, mistakes, iterations, failures, and hard-earned engineering lessons.
        </p>
      </div>

      {/* Projects Grid */}
      <div className="flex flex-col gap-12">
        {projects.map((project) => {
          return (
            <div
              key={project.id}
              onClick={() => onSelectProject(project)}
              className="bg-[#141414] hover:bg-[#161616] border border-neutral-800 hover:border-neutral-700 rounded-xl p-6 md:p-10 transition-all cursor-pointer flex flex-col gap-8 group"
            >
              {/* Main Top Row */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                <div className="md:col-span-5 aspect-[4/3] rounded-lg overflow-hidden bg-neutral-900 border border-neutral-800">
                  <img
                    src={project.imageUrl || "https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?q=80&w=1200&auto=format&fit=crop"}
                    alt={project.title}
                    className="w-full h-full object-cover grayscale-[15%] group-hover:scale-105 transition-transform duration-700"
                  />
                </div>

                <div className="md:col-span-7 flex flex-col gap-4">
                  <div className="flex items-center gap-3 font-mono text-[10px] uppercase text-neutral-500">
                    <span className="bg-amber-950/40 border border-amber-900/40 text-amber-300 px-2.5 py-0.5 rounded font-bold">
                      {project.category}
                    </span>
                    <span>•</span>
                    <span className="text-emerald-400 font-bold">{project.status || "Complete"}</span>
                  </div>

                  <h2 className="font-serif text-2xl md:text-3xl text-neutral-100 font-medium group-hover:text-white transition-colors">
                    {project.title}
                  </h2>

                  <p className="font-sans text-xs md:text-sm text-neutral-300 font-light leading-relaxed">
                    {project.description}
                  </p>

                  {/* Purpose & Context */}
                  {project.purpose && (
                    <div className="bg-[#101010] p-4 rounded border border-neutral-800/80 font-sans text-xs text-neutral-400 space-y-1">
                      <span className="font-mono text-[9px] uppercase tracking-wider text-neutral-500 font-bold block">
                        Core Purpose:
                      </span>
                      <p>{project.purpose}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Engineering Notebook Breakdown Sections */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-neutral-800/80 font-sans text-xs">
                {/* Process & Iterations */}
                <div className="flex flex-col gap-2 bg-[#121212] p-4 rounded-lg border border-neutral-850">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1.5">
                    <Wrench className="w-3.5 h-3.5" />
                    <span>Process & Iterations</span>
                  </span>
                  <p className="text-neutral-300 font-light leading-relaxed">
                    {project.process}
                  </p>
                </div>

                {/* Failures & Lessons Learned */}
                <div className="flex flex-col gap-2 bg-[#121212] p-4 rounded-lg border border-neutral-850">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-rose-400 font-bold flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Failures & Lessons Learned</span>
                  </span>
                  <p className="text-neutral-300 font-light leading-relaxed">
                    {project.failures || project.lessonsLearned || "Thorough testing required before final assembly."}
                  </p>
                </div>
              </div>

              {/* Bottom Footer Action */}
              <div className="flex items-center justify-between pt-2 font-mono text-xs text-neutral-400">
                <span className="text-[10px] text-neutral-500 uppercase">
                  Click to open full engineer notebook & parts list
                </span>
                <span className="text-amber-400 group-hover:underline flex items-center gap-1">
                  Examine Blueprint <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
