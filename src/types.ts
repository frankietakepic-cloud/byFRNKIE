export interface Photo {
  id: string;
  url: string;
  title: string;
  caption?: string;
  story?: string;
  date?: string;
  time?: string;
  location?: string;
  country?: string;
  camera?: string;
  lens?: string;
  focalLength?: string;
  aperture?: string;
  shutterSpeed?: string;
  iso?: string;
  gps?: string;
  orientation?: string;
  dimensions?: string;
  colorProfile?: string;
  status: "draft" | "published" | "archived" | "trash";
  category?: string;
  collections?: string[];
  tags?: string[];
  rating?: number; // 0-5
  flag?: "pick" | "reject" | "none";
  favorite?: boolean;
  colorLabel?: "red" | "yellow" | "green" | "blue" | "purple" | "none";
  slug?: string;
  publishedDate?: string;
}

export interface JournalEntry {
  id: string;
  title: string;
  slug?: string;
  category: string;
  date: string;
  content: string;
  status?: "draft" | "published" | "archived" | "trash";
  tags?: string[];
  wordCount?: number;
  readingTime?: number;
  revisions?: { id: string; timestamp: string; content: string }[];
  relatedPhotos?: string[];
  relatedProjects?: string[];
}

export interface ProjectTimelineItem {
  date: string;
  note: string;
}

export interface ProjectPartItem {
  item: string;
  cost?: string;
  note?: string;
}

export interface Project {
  id: string;
  title: string;
  slug?: string;
  category: string;
  status?: "concept" | "in_progress" | "complete" | "archival";
  description: string;
  process: string;
  outcome: string;
  imageUrl?: string;
  gallery?: string[];
  timeline?: ProjectTimelineItem[];
  partsList?: ProjectPartItem[];
  totalCost?: string;
  researchNotes?: string;
  lessonsLearned?: string;
  purpose?: string;
  context?: string;
  problem?: string;
  iterations?: string;
  failures?: string;
  relatedJournalIds?: string[];
  relatedPhotoIds?: string[];
  relatedCollections?: string[];
}

export interface DailyEntry {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  location?: string;
  weather?: string;
  focusMood?: string; // e.g., "Deep Focus", "Observational", "Quiet"
  content: string;
  photoUrls?: string[];
  audioTranscript?: string;
  tags?: string[];
}

export type QuickCaptureType = "photo" | "journal" | "project" | "daily" | "voice";

// ==========================================
// SITE BUILDER & PAGE COMPONENT SYSTEM
// ==========================================

export type ComponentType =
  | "hero"
  | "editorial_text"
  | "manifesto"
  | "quote"
  | "image_grid"
  | "featured_collection"
  | "featured_journal"
  | "featured_project"
  | "timeline"
  | "photo_essay"
  | "gallery"
  | "map"
  | "newsletter"
  | "divider";

export interface PageComponentLayoutConfig {
  typography?: "serif" | "sans" | "mono";
  spacing?: "compact" | "medium" | "spacious";
  containerWidth?: "narrow" | "medium" | "wide" | "full";
  background?: "default" | "dark" | "charcoal" | "pitch" | "subtle_border";
  alignment?: "left" | "center" | "right";
  colorTheme?: "monochrome" | "warm_amber" | "emerald" | "muted";
  paddingTopBottom?: "small" | "medium" | "large" | "none";
  showMetadata?: boolean;
  columns?: 1 | 2 | 3 | 4;
}

export interface PageComponent {
  id: string;
  type: ComponentType;
  title?: string;
  subtitle?: string;
  content?: string;
  author?: string;
  sourceCollection?: string;
  sourceTag?: string;
  selectedPhotoIds?: string[];
  selectedJournalIds?: string[];
  selectedProjectIds?: string[];
  layoutConfig?: PageComponentLayoutConfig;
  visibleDevices?: {
    desktop: boolean;
    tablet: boolean;
    mobile: boolean;
  };
}

export type PageStatus = "draft" | "published" | "archived";

export interface PageVersion {
  id: string;
  timestamp: string;
  label: string;
  components: PageComponent[];
}

export interface PageLayout {
  id: string;
  slug: string; // e.g. "home", "galleria", "journal", "workshop", "about", "daily", "404"
  title: string;
  description?: string;
  status: PageStatus;
  updatedAt: string;
  components: PageComponent[];
  versions: PageVersion[];
}

// ==========================================
// HERO MANAGER & LIVE HERO SYSTEM
// ==========================================

export type HeroSourceType =
  | "specific_collection"
  | "specific_tag"
  | "favorites"
  | "homepage_hero"
  | "latest_published"
  | "latest_curated"
  | "pinned_images"
  | "random";

export type HeroDisplayMode =
  | "static"
  | "random"
  | "sequential"
  | "seasonal"
  | "latest_published"
  | "pinned_rotation";

export interface HeroConfig {
  sourceType: HeroSourceType;
  sourceValue?: string; // e.g. "Japan" or "#35mm"
  displayMode: HeroDisplayMode;
  transitionStyle: "invisible_dissolve" | "slow_fade" | "seamless";
  transitionIntervalSeconds: number; // e.g. 12
  pinnedPhotoIds: string[];
  excludedPhotoIds: string[];
  showMetadataOverlay: boolean;
  metadataFields: {
    location: boolean;
    country: boolean;
    collection: boolean;
    camera: boolean;
    date: boolean;
    project: boolean;
    journal: boolean;
  };
  crops?: {
    desktop?: string; // e.g. "center center"
    tablet?: string;
    mobile?: string;
  };
}



