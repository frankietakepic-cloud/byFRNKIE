import { motion } from "motion/react";
import { MapPin, Calendar, Camera } from "lucide-react";
import { Photo } from "../types";

interface PhotoCardProps {
  key?: string;
  photo: Photo;
  onClick: () => void;
}

export default function PhotoCard({ photo, onClick }: PhotoCardProps) {
  return (
    <motion.div
      layout
      onClick={onClick}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="cursor-pointer group flex flex-col gap-4 bg-transparent rounded-none transition-all duration-300"
    >
      {/* Aspect Ratio Container for Photo */}
      <div className="overflow-hidden bg-[#121110] relative aspect-[4/3] w-full border border-neutral-900/60">
        <img
          src={photo.thumbnailUrl || photo.webPreviewUrl || photo.url}
          alt={photo.title}
          referrerPolicy="no-referrer"
          className="object-cover w-full h-full grayscale-[15%] group-hover:grayscale-0 group-hover:scale-[1.015] transition-all duration-1000 ease-[0.16, 1, 0.3, 1]"
        />
      </div>

      {/* Info/Metadata row */}
      <div className="flex flex-col gap-1.5 px-1">
        <h3 className="font-serif text-lg text-neutral-100 group-hover:text-white transition-colors duration-200">
          {photo.title}
        </h3>
        
        <p className="font-sans text-xs text-neutral-400 line-clamp-2 leading-relaxed font-light">
          {photo.caption}
        </p>

        {/* Small tags footer */}
        <div className="flex items-center gap-4 pt-2.5 border-t border-neutral-900 mt-1.5 font-mono text-[9px] tracking-wider text-neutral-500">
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3 text-neutral-600" />
            {photo.location}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-neutral-600" />
            {photo.date}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
