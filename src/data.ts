import { Photo, JournalEntry, Project } from "./types";

export const initialPhotos: Photo[] = [
  {
    id: "photo-1",
    url: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1200&auto=format&fit=crop",
    title: "Kyoto Morning Fog",
    caption: "Waking up before the city. Morning fog rolling slowly over the wooden roofs of Higashiyama. A moment of complete silence before the first coffee.",
    date: "2026-11-12",
    location: "Kyoto, Japan",
    camera: "Mechanical Rangefinder",
    lens: "35mm Prime Focal Length",
    aperture: "f/4.0",
    shutterSpeed: "1/60s",
    iso: "400",
    status: "published"
  },
  {
    id: "photo-2",
    url: "https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?q=80&w=1200&auto=format&fit=crop",
    title: "Vespa LX 150 Restored",
    caption: "A project of patience. Restored to a deep satin charcoal color. The sound of a clean engine idling in a quiet courtyard.",
    date: "2026-04-05",
    location: "Toronto, Canada",
    camera: "High-Resolution Sensor",
    lens: "50mm Standard Prime",
    aperture: "f/2.0",
    shutterSpeed: "1/250s",
    iso: "100",
    status: "published"
  },
  {
    id: "photo-3",
    url: "https://images.unsplash.com/photo-1472289065668-ce650ac443d2?q=80&w=1200&auto=format&fit=crop",
    title: "Late Autumn Coffee",
    caption: "Light falling on an oak desk. A notebook filled over many years, an old brass fountain pen, and the scent of rain outside.",
    date: "2025-10-24",
    location: "Dalat, Vietnam",
    camera: "Mechanical Rangefinder",
    lens: "28mm Wide Prime",
    aperture: "f/2.8",
    shutterSpeed: "1/30s",
    iso: "800",
    status: "published"
  },
  {
    id: "photo-4",
    url: "https://images.unsplash.com/photo-1543783207-ec64e4d95325?q=80&w=1200&auto=format&fit=crop",
    title: "Saigon Alleyway Light",
    caption: "A narrow passage in District 3. The yellow glow of a single sodium bulb reflecting off damp, textured concrete walls and potted palms. Rain has just stopped.",
    date: "2026-03-10",
    location: "Saigon, Vietnam",
    camera: "Mechanical Rangefinder",
    lens: "28mm Wide Prime",
    aperture: "f/2.0",
    shutterSpeed: "1/15s",
    iso: "1600",
    status: "published"
  },
  {
    id: "photo-5",
    url: "https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?q=80&w=1200&auto=format&fit=crop",
    title: "Calibration and Assembly",
    caption: "Measuring thread tolerances on a custom stainless steel spacer. The tactile weight of an old mechanical micrometer. Precision is a form of respect for the material.",
    date: "2026-05-24",
    location: "Toronto Workshop",
    camera: "High-Resolution Sensor",
    lens: "50mm Standard Prime",
    aperture: "f/4.0",
    shutterSpeed: "1/125s",
    iso: "200",
    status: "published"
  },
  {
    id: "photo-6",
    url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop",
    title: "Concrete and Shadow",
    caption: "A study in architectural honesty. The flat texture of cast-in-place concrete meeting a single diagonal beam of midday sun. Silence framed by structural geometry.",
    date: "2026-11-05",
    location: "Osaka, Japan",
    camera: "Mechanical Rangefinder",
    lens: "35mm Prime Focal Length",
    aperture: "f/5.6",
    shutterSpeed: "1/250s",
    iso: "100",
    status: "published"
  }
];

export const initialJournals: JournalEntry[] = [
  {
    id: "journal-1",
    title: "The Discipline of Subtraction",
    category: "Philosophy",
    date: "2026-07-20",
    content: `The internet has become increasingly efficient at capturing attention, but increasingly poor at creating meaningful experiences. Most digital spaces are designed to maximize clicks, engagement, and conversion. Every interface competes for attention.

Minimalism is not the absence of things; it is the removal of everything unnecessary. In designing byFRNK, every visual element must justify its existence. Whitespace is not empty space; it is breathing room.

When we remove the visual noise, we create silence. And silence allows people to notice details—the texture of concrete after rain, the soft grain of film, the weight of an idea. We choose to build a quiet place.`
  },
  {
    id: "journal-2",
    title: "Kyoto: A Lesson in Longevity",
    category: "Observation",
    date: "2026-05-18",
    content: `Kyoto rewards those who choose to stay, not those who rush through. Walking down a wet stone alley in Higashiyama at 6:30 AM, you see traditional craftsmanship living seamlessly beside modern thinking. 

Buildings here are designed to age with dignity. Wood becomes deeper, stone becomes smoother, and copper turns to beautiful green. Time is not an obstacle; it is an ingredient. 

This is how we must build software. Not for seasons, but for decades. Choosing stability over novelty, and consistency over trends.`
  }
];

export const initialProjects: Project[] = [
  {
    id: "project-1",
    title: "Vespa LX 150 Restoration",
    category: "Mechanical Work",
    description: "Taking apart, maintaining, and restoring a classic Vespa LX 150 to complete mechanical and aesthetic reliability.",
    process: "The machine had accumulated scratches, dust, and rust over several years of storage. We dismantled it entirely in our workshop, cleaning every gear, replacing worn seals, and sandblasting the frame to bare steel before applying a clean, satin charcoal finish. The goal was to preserve the motorcycle's heritage while ensuring reliable modern operation.",
    outcome: "A quiet, highly reliable commuter vehicle that feels beautiful to ride and age-appropriate to look at.",
    imageUrl: "https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?q=80&w=1200&auto=format&fit=crop",
    purpose: "To restore a stored Vespa LX 150 to complete mechanical and aesthetic reliability, focusing on physical durability and simplicity rather than cosmetic perfection or over-modernization.",
    context: "The vehicle had been left in a damp garage in Saigon for over three years. Humidity and lack of use had corroded several aluminum components, seized the front caliper, and degraded the fuel system.",
    problem: "The carburetor was gummed with stale fuel residue, the fuel lines were cracked, the front brake master cylinder was seized, and rust had pitted the lower floorboard seam.",
    iterations: "We initially attempted to clean the original fuel petcock, but it leaked under vacuum test.",
    failures: "During reassembly, the threads on the exhaust manifold stud sheared due to past fatigue. We had to drill out the stud and tap a new thread to M8, which delayed the assembly by two days.",
    lessonsLearned: "Never rely on original rubber gaskets or aged vacuum lines after years of storage—proactive replacement saves hours of diagnostic troubleshooting later."
  },
  {
    id: "project-2",
    title: "Dalat Autumn Field Notes",
    category: "Photography",
    description: "A continuous observation of morning light and mountain dew in the highlands.",
    process: "Using a single mechanical camera and 35mm film, we spent ten days waking up before sunrise. We did not chase dramatic angles; instead, we sat in silence, observing how the fog slowly cleared over pine forests.",
    outcome: "A published collection of twelve quiet black-and-white prints preserving Dalat's atmospheric serenity.",
    imageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1200&auto=format&fit=crop",
    purpose: "To document the quiet transition of morning light across the agricultural valleys of Dalat, using a mechanical rangefinder and monochrome medium speed film.",
    context: "Ten days spent in the central highlands of Vietnam during late October, where the morning mist creates temporary, high-contrast layers over pine hills and greenhouses.",
    problem: "Fog dissipates within forty minutes of sunrise, leaving extremely harsh high-altitude light. Developing film on-site without a dedicated darkroom risks dust contamination due to the dry highland wind.",
    iterations: "Attempted using a yellow contrast filter on day three, but it darkened the shadow valleys too aggressively under low-angle mist.",
    failures: "Two rolls of film suffered from minor fogging along the lead edge due to a worn light seal on the camera's take-up chamber.",
    lessonsLearned: "Mechanical cameras require physical inspection under direct sunlight before any intensive field trip—microscopic gaps in old foam seals can ruin days of quiet patience."
  }
];

export const initialDailyEntries = [
  {
    id: "daily-1",
    date: "2026-07-21",
    time: "07:15",
    location: "Studio L'Officina, Saigon",
    weather: "28°C · Morning Rain",
    focusMood: "Observational",
    content: "Light coming through the east shutter at 7:15 AM. The warm glow on the oak workbench makes the raw camera metal look almost golden. Developing a batch of 35mm Tri-X today.",
    tags: ["#Studio", "#Light", "#Film"],
    photoUrls: ["https://images.unsplash.com/photo-1472289065668-ce650ac443d2?q=80&w=800&auto=format&fit=crop"]
  },
  {
    id: "daily-2",
    date: "2026-07-20",
    time: "18:40",
    location: "District 3, Saigon",
    weather: "31°C · Sunset Clear",
    focusMood: "Deep Focus",
    content: "Finished tuning the carburetor on the LX 150. Idle speed stabilized at 1,400 RPM. Took a short test ride through the quiet back alleys of District 3. Everything feels tight, mechanical, and predictable.",
    tags: ["#Workshop", "#Vespa", "#Mechanical"],
    audioTranscript: "Voice Note: Carburetor main jet adjusted from #105 to #108. Acceleration response is smooth now."
  },
  {
    id: "daily-3",
    date: "2026-07-19",
    time: "10:30",
    location: "Higashiyama, Kyoto",
    weather: "22°C · Overcast",
    focusMood: "Quiet",
    content: "Recorded notes for the upcoming journal entry on quiet tools. The difference between a tool that demands your attention and one that seamlessly extends your mind.",
    tags: ["#Journal", "#Philosophy"]
  }
];

