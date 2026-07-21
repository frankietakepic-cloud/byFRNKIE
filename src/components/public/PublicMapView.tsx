import React, { useState } from "react";
import { motion } from "motion/react";
import { Compass, MapPin, Camera, BookOpen, Wrench, ArrowRight } from "lucide-react";
import { Photo, JournalEntry, Project } from "../../types";

interface PublicMapViewProps {
  photos: Photo[];
  journals: JournalEntry[];
  projects: Project[];
  onSelectPhoto: (photo: Photo) => void;
  onSelectJournal: (journal: JournalEntry) => void;
  onSelectProject: (project: Project) => void;
}

export default function PublicMapView({
  photos,
  journals,
  projects,
  onSelectPhoto,
  onSelectJournal,
  onSelectProject
}: PublicMapViewProps) {
  const cities = [
    { name: "Kyoto", country: "Japan", lat: "35.0116° N", lng: "135.7681° E", desc: "Higashiyama wooden roofs, early morning mist, stone temples, rangefinder photography." },
    { name: "Saigon", country: "Vietnam", lat: "10.8231° N", lng: "106.6297° E", desc: "Narrow alleyway sodium lights, District 3, monsoon rains, motorcycle mechanics." },
    { name: "Toronto", country: "Canada", lat: "43.6532° N", lng: "79.3832° W", desc: "Workshop assembly, mechanical tool calibration, Vespa restoration, winter studio." },
    { name: "Dalat", country: "Vietnam", lat: "11.9404° N", lng: "108.4583° E", desc: "Highland pine fog, morning drip coffee, mountain trails, black and white film studies." },
    { name: "Osaka", country: "Japan", lat: "34.6937° N", lng: "135.5023° E", desc: "Architectural concrete studies, geometric shadow, urban geometry, night observations." }
  ];

  const [selectedCity, setSelectedCity] = useState<string>("Kyoto");

  const cityPhotos = photos.filter((p) => p.location?.toLowerCase().includes(selectedCity.toLowerCase()));
  const cityJournals = journals.filter((j) => j.content.toLowerCase().includes(selectedCity.toLowerCase()));
  const cityProjects = projects.filter((pr) => pr.description.toLowerCase().includes(selectedCity.toLowerCase()) || pr.process.toLowerCase().includes(selectedCity.toLowerCase()));

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col gap-12 font-sans max-w-6xl mx-auto selection:bg-neutral-800 selection:text-white"
    >
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-neutral-900 pb-8">
        <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-neutral-500 flex items-center gap-2">
          <Compass className="w-3.5 h-3.5 text-emerald-400" />
          <span>GEOGRAPHIC ARCHIVE</span>
        </span>
        <h1 className="font-serif text-3xl md:text-5xl text-neutral-100 font-normal tracking-tight">
          Places & Coordinates
        </h1>
        <p className="font-sans text-xs md:text-sm text-neutral-400 font-light max-w-xl leading-relaxed">
          Every photograph, workshop note, and journal reflection is anchored to a physical place. Select a coordinate cluster to examine entries bound to that location.
        </p>

        {/* City Cluster Selector Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-4">
          {cities.map((city) => {
            const isActive = selectedCity === city.name;
            return (
              <button
                key={city.name}
                onClick={() => setSelectedCity(city.name)}
                className={`p-3.5 rounded-lg border text-left transition-all cursor-pointer flex flex-col gap-1 font-mono ${
                  isActive
                    ? "bg-emerald-950/40 border-emerald-800 text-emerald-200"
                    : "bg-[#141414] border-neutral-800 text-neutral-400 hover:text-neutral-200 hover:border-neutral-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-sans text-neutral-100">{city.name}</span>
                  <MapPin className={`w-3.5 h-3.5 ${isActive ? "text-emerald-400" : "text-neutral-600"}`} />
                </div>
                <span className="text-[9px] uppercase text-neutral-500">{city.country}</span>
                <span className="text-[8px] text-neutral-600">{city.lat}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected City Detail & Items */}
      <div className="flex flex-col gap-8">
        <div className="bg-[#141414] border border-neutral-800 p-6 rounded-xl flex flex-col gap-3 font-sans">
          <div className="flex items-center justify-between font-mono text-xs text-emerald-400">
            <span className="uppercase tracking-widest font-bold">Location Cluster: {selectedCity}</span>
            <span>{cityPhotos.length} Photos • {cityJournals.length} Essays • {cityProjects.length} Projects</span>
          </div>
          <p className="text-xs md:text-sm text-neutral-300 font-light leading-relaxed">
            {cities.find((c) => c.name === selectedCity)?.desc}
          </p>
        </div>

        {/* City Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cityPhotos.map((photo) => (
            <div
              key={photo.id}
              onClick={() => onSelectPhoto(photo)}
              className="bg-[#141414] border border-neutral-800 rounded-xl overflow-hidden hover:border-neutral-700 transition-all cursor-pointer flex flex-col group"
            >
              <div className="aspect-[4/3] bg-neutral-900 overflow-hidden relative">
                <img
                  src={photo.url}
                  alt={photo.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 grayscale-[10%]"
                />
                <div className="absolute top-3 left-3 bg-neutral-950/80 backdrop-blur-md border border-neutral-800 px-2.5 py-0.5 rounded font-mono text-[9px] text-emerald-300">
                  PHOTOGRAPH
                </div>
              </div>

              <div className="p-4 flex flex-col gap-2 font-sans">
                <h4 className="font-serif text-base text-neutral-100 font-medium group-hover:text-white">
                  {photo.title}
                </h4>
                <p className="text-xs text-neutral-400 font-light line-clamp-2">
                  {photo.caption}
                </p>
              </div>
            </div>
          ))}

          {cityJournals.map((j) => (
            <div
              key={j.id}
              onClick={() => onSelectJournal(j)}
              className="bg-[#141414] border border-neutral-800 p-5 rounded-xl hover:border-neutral-700 transition-all cursor-pointer flex flex-col justify-between gap-4 font-sans group"
            >
              <div className="flex flex-col gap-2">
                <span className="font-mono text-[9px] uppercase tracking-wider text-amber-400">
                  ESSAY // {j.category}
                </span>
                <h4 className="font-serif text-lg text-neutral-100 font-medium group-hover:text-white">
                  {j.title}
                </h4>
                <p className="text-xs text-neutral-400 font-light line-clamp-3">
                  {j.content}
                </p>
              </div>
              <span className="font-mono text-xs text-amber-400 group-hover:underline">Read Essay →</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
