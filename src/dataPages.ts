import { PageLayout, HeroConfig } from "./types";

export const initialHeroConfig: HeroConfig = {
  sourceType: "pinned_images",
  sourceValue: "",
  displayMode: "pinned_rotation",
  transitionStyle: "invisible_dissolve",
  transitionIntervalSeconds: 12,
  pinnedPhotoIds: ["photo-1", "photo-2", "photo-3", "photo-4", "photo-5", "photo-6"],
  excludedPhotoIds: [],
  showMetadataOverlay: true,
  metadataFields: {
    location: true,
    country: true,
    collection: true,
    camera: true,
    date: true,
    project: true,
    journal: true
  },
  crops: {
    desktop: "center 40%",
    tablet: "center center",
    mobile: "center center"
  }
};

export const initialPages: PageLayout[] = [
  {
    id: "page-home",
    slug: "home",
    title: "Homepage Exhibition",
    description: "Main front door to the living digital archive.",
    status: "published",
    updatedAt: new Date().toISOString(),
    components: [
      {
        id: "comp-hero-1",
        type: "hero",
        title: "Documenting life through photography, engineering, writing and observation.",
        subtitle: "LIVING DIGITAL ARCHIVE • FRANKIE",
        content: "byFRNK is not a portfolio or gallery. It is a long-term personal archive built to record observations of light, physical assemblies from the workshop, field essays, and daily moments in one connected space.",
        layoutConfig: {
          containerWidth: "full",
          background: "pitch",
          spacing: "spacious"
        },
        visibleDevices: { desktop: true, tablet: true, mobile: true }
      },
      {
        id: "comp-manifesto-1",
        type: "manifesto",
        title: "The Discipline of Subtraction",
        subtitle: "VALUES & PHILOSOPHY",
        content: "When we remove the visual noise, we create silence. And silence allows people to notice details—the texture of concrete after rain, the soft grain of film, the weight of an idea. We choose to build a quiet place.",
        author: "Frankie",
        layoutConfig: {
          containerWidth: "medium",
          background: "dark",
          alignment: "left"
        },
        visibleDevices: { desktop: true, tablet: true, mobile: true }
      },
      {
        id: "comp-journal-1",
        type: "featured_journal",
        title: "Latest Journal Entry",
        subtitle: "THOUGHTS & ESSAYS",
        selectedJournalIds: ["journal-1", "journal-2"],
        layoutConfig: {
          containerWidth: "wide",
          background: "default"
        },
        visibleDevices: { desktop: true, tablet: true, mobile: true }
      },
      {
        id: "comp-project-1",
        type: "featured_project",
        title: "Featured Workshop Project",
        subtitle: "PRACTICAL ENGINEERING",
        selectedProjectIds: ["project-1", "project-2"],
        layoutConfig: {
          containerWidth: "wide",
          background: "dark"
        },
        visibleDevices: { desktop: true, tablet: true, mobile: true }
      },
      {
        id: "comp-gallery-1",
        type: "gallery",
        title: "Curated Exhibition",
        subtitle: "PHOTOGRAPHY",
        sourceCollection: "All",
        layoutConfig: {
          containerWidth: "wide",
          columns: 3
        },
        visibleDevices: { desktop: true, tablet: true, mobile: true }
      },
      {
        id: "comp-map-1",
        type: "map",
        title: "Explore by Location",
        subtitle: "GEOGRAPHIC INDEX",
        content: "Browse photographs, journals, and workshop notes mapped geographically across Kyoto, Saigon, Tokyo, Toronto, and Dalat.",
        layoutConfig: {
          containerWidth: "wide"
        },
        visibleDevices: { desktop: true, tablet: true, mobile: true }
      },
      {
        id: "comp-timeline-1",
        type: "timeline",
        title: "Life Timeline Archive",
        subtitle: "CHRONOLOGICAL ERA",
        content: "Navigate the digital archive chronologically by years and life eras rather than arbitrary upload dates.",
        layoutConfig: {
          containerWidth: "wide"
        },
        visibleDevices: { desktop: true, tablet: true, mobile: true }
      }
    ],
    versions: [
      {
        id: "v-initial-1",
        timestamp: new Date().toISOString(),
        label: "Initial Editorial Assembly",
        components: []
      }
    ]
  },
  {
    id: "page-galleria",
    slug: "galleria",
    title: "Galleria",
    description: "Full photography exhibition & collections.",
    status: "published",
    updatedAt: new Date().toISOString(),
    components: [
      {
        id: "comp-gal-text",
        type: "editorial_text",
        title: "The Photography Archive",
        subtitle: "GALLERIA EXHIBITION",
        content: "Observations captured on mechanical rangefinders and high-resolution sensors. Every photograph is preserved with camera EXIF metadata, lens specs, and field locations.",
        layoutConfig: { containerWidth: "medium", alignment: "left" },
        visibleDevices: { desktop: true, tablet: true, mobile: true }
      },
      {
        id: "comp-gal-featured",
        type: "featured_collection",
        title: "Curated Collections",
        subtitle: "THEMATIC BUNDLES",
        layoutConfig: { containerWidth: "wide" },
        visibleDevices: { desktop: true, tablet: true, mobile: true }
      },
      {
        id: "comp-gal-grid",
        type: "gallery",
        title: "All Photographs",
        sourceCollection: "All",
        layoutConfig: { containerWidth: "wide", columns: 3 },
        visibleDevices: { desktop: true, tablet: true, mobile: true }
      }
    ],
    versions: []
  },
  {
    id: "page-journal",
    slug: "journal",
    title: "Journal",
    description: "Essays, philosophy, and reflections.",
    status: "published",
    updatedAt: new Date().toISOString(),
    components: [
      {
        id: "comp-jou-text",
        type: "editorial_text",
        title: "Journal & Field Essays",
        subtitle: "WRITING & PHILOSOPHY",
        content: "Long-form writing on subtraction, longevity, mechanical engineering, and quiet observation.",
        layoutConfig: { containerWidth: "medium", alignment: "left" },
        visibleDevices: { desktop: true, tablet: true, mobile: true }
      },
      {
        id: "comp-jou-feat",
        type: "featured_journal",
        title: "Published Essays",
        selectedJournalIds: ["journal-1", "journal-2"],
        layoutConfig: { containerWidth: "wide" },
        visibleDevices: { desktop: true, tablet: true, mobile: true }
      }
    ],
    versions: []
  },
  {
    id: "page-workshop",
    slug: "workshop",
    title: "Workshop",
    description: "Engineering notebook, restorations, and blueprints.",
    status: "published",
    updatedAt: new Date().toISOString(),
    components: [
      {
        id: "comp-work-text",
        type: "editorial_text",
        title: "The Workshop Notebook",
        subtitle: "ENGINEERING & RESTORATION",
        content: "Physical machine restorations, custom parts machining, tool calibrations, and lessons learned in the studio.",
        layoutConfig: { containerWidth: "medium", alignment: "left" },
        visibleDevices: { desktop: true, tablet: true, mobile: true }
      },
      {
        id: "comp-work-feat",
        type: "featured_project",
        title: "Project Blueprints",
        selectedProjectIds: ["project-1", "project-2"],
        layoutConfig: { containerWidth: "wide" },
        visibleDevices: { desktop: true, tablet: true, mobile: true }
      }
    ],
    versions: []
  },
  {
    id: "page-about",
    slug: "about",
    title: "About",
    description: "Statement of purpose, colophon, and manifesto.",
    status: "published",
    updatedAt: new Date().toISOString(),
    components: [
      {
        id: "comp-about-man",
        type: "manifesto",
        title: "About byFRNK",
        subtitle: "OPERATING SYSTEM FOR CURATION",
        content: "byFRNK is a living personal archive built to outlast ephemeral platforms. Designed with silence, craftsmanship, and structural endurance in mind.",
        author: "Frankie",
        layoutConfig: { containerWidth: "medium", background: "dark" },
        visibleDevices: { desktop: true, tablet: true, mobile: true }
      },
      {
        id: "comp-about-colophon",
        type: "editorial_text",
        title: "Colophon & System Specs",
        content: "Built with React, Vite, Express, and L'Officina OS v2.0. Typeset in Playfair Display, Plus Jakarta Sans, and JetBrains Mono.",
        layoutConfig: { containerWidth: "medium" },
        visibleDevices: { desktop: true, tablet: true, mobile: true }
      }
    ],
    versions: []
  },
  {
    id: "page-daily",
    slug: "daily",
    title: "Daily Log",
    description: "Micro-observations, weather, and studio notes.",
    status: "published",
    updatedAt: new Date().toISOString(),
    components: [
      {
        id: "comp-daily-text",
        type: "editorial_text",
        title: "Daily Observation Stream",
        subtitle: "MICRO-MOMENTS",
        content: "Real-time records of weather, focus moods, coffee, book passages, and workshop thoughts.",
        layoutConfig: { containerWidth: "medium" },
        visibleDevices: { desktop: true, tablet: true, mobile: true }
      }
    ],
    versions: []
  }
];
