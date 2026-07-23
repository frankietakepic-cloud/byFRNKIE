# byFRNK Domain Model
## The Knowledge Architecture & Semantic Constitution

**Publisher:** byFRNK  
**Document Version:** 3.0.0  
**Scope:** Universal Semantic Architecture, Entity Relationships, Ownership Rules, & Knowledge Graph Philosophy  

---

## 1. Rule Zero & Architectural Philosophy

### 1.1 The Primacy of Knowledge Over Technology
Technology is temporary; knowledge is permanent. Software frameworks, database engines, cloud runtimes, and user interfaces will shift and be replaced over decades. The knowledge model behind *byFRNK* is built to endure past React, Express, SQL, NoSQL, graph databases, or AI. It defines the semantic structure of an archive meant to survive fifty years without losing context, meaning, or relationships.

### 1.2 Why Archives Fail
Traditional photo managers and file systems fail because they rely on **folder-first thinking** and **siloed storage**:
* **Folder Sinks:** A photograph trapped in `/2023/Japan/Day1` is isolated from the project on Japanese Zen Architecture, the essay on Wabi-sabi, the lens profile of a 35mm Summicron, or the memory of a rainy morning in Kyoto.
* **Loss of Context:** File systems preserve bytes, but strip away intent, atmospheric conditions, spatial journeys, emotional resonance, and narrative connection.
* **Siloed Metadata:** When metadata lives only inside EXIF headers or single application databases, moving or reorganizing assets creates broken links, orphaned files, and semantic decay.

### 1.3 Memory as a Semantic Network
Memory in human cognition does not exist as isolated folders—it is an interconnected, multi-dimensional neural web. A single photograph triggers memories of a place (*Kyoto*), a time (*Autumn 2024*), a person (*Aiko*), an emotion (*Serenity*), a physical object (*An aged brass teapot*), a project (*The Silence of Craft*), and a journal entry (*Notes on Cedar and Rain*). 

*byFRNK* models this reality as a **Knowledge Graph**, where entities are nodes and relationships are explicit, non-destructive edges that preserve multidirectional meaning.

```
                  [ JOURNAL: Notes on Cedar ]
                                |
                        (Narrative Context)
                                v
  [ PLACE: Kyoto ] ----> [ PHOTO: Rain on Roof ] <---- [ PROJECT: Silence of Craft ]
        |                       |                                    |
  (Coordinates)         (Spatial Record)                    (Curated Collection)
        v                       v                                    v
  [ MAP: Kansai ]      [ CAMERA: Leica M10-R ]               [ TAG: Wabi-Sabi ]
```

---

## 2. Core Entities of the Archive Universe

Every entity inside *byFRNK* represents a distinct semantic node with clear purpose, boundary, and existence rules.

### 2.1 The Core Master Entities

#### Archive
* **What it is:** The singular, bounded universe containing all creative assets, stories, memories, and metadata within *byFRNK*.
* **Why it exists:** To establish the universal scope of truth and preservation.
* **Ownership & Boundary:** The Archive owns everything, but is owned by no entity. It is the root container of human memory for byFRNK.

#### Photo (Master Photograph)
* **What it is:** The immutable semantic identity of a single captured frame or photographic moment.
* **Why it exists:** To represent the artistic and historic artifact independent of how or where it is rendered.
* **Ownership:** A Photo owns its metadata, EXIF parameters, captions, stories, ratings, and flags. A Photo is NEVER owned by a Project, Collection, Tag, or Folder. A Photo exists freely in the Archive regardless of visual grouping.

#### Original File & Derivatives
* **Original File:** The untouchable master raw/digital negative bytes (`.RAW`, `.DNG`, `.CR3`, `.NEF`, `.JPG`) stored in cold preservation.
* **Derivatives (Preview, Thumbnail, Blur Placeholder):** Rendered representations optimized for display speed, web viewports, and color fidelity.
* **Rule:** Derivatives may be regenerated, deleted, or replaced at any time. The Original File and the semantic Photo entity remain immutable.

#### Metadata & EXIF
* **Metadata:** The human-curated and AI-assisted attributes (Title, Story, Caption, Rating, Flags, Color Palette, Visibility, Status).
* **EXIF:** The hardware-captured physical record (Camera Body, Lens, Focal Length, Aperture, Shutter Speed, ISO, White Balance, GPS Coordinates, Timestamp).
* **Rule:** Every Photo owns exactly one primary Metadata record and EXIF profile. No two Photos share a single Metadata object.

#### Journal & Essay
* **What it is:** A written narrative piece—ranging from short field notes to long-form philosophical essays.
* **Why it exists:** To give voice, prose, and intellectual depth to spatial and temporal experiences.
* **Relationships:** A Journal references Photos, Places, Journeys, Quotes, and References. A Journal does not own Photos; it embeds references to them.

#### Project
* **What it is:** A curated, bounded body of work created with intent (e.g., *"The Silence of Craft"* or *"Monochrome Tokyo"*).
* **Why it exists:** To group imagery, text, and field notes into a cohesive published statement.
* **Rule:** Projects are virtual overlays. Adding a Photo to a Project creates an association, not a duplicate file. Removing a Photo from a Project leaves the Photo intact in the Archive.

#### Collection & Smart Collection
* **Collection:** A manual, curated grouping of Photos gathered for a specific viewing, review, or publication context.
* **Smart Collection:** A dynamic, query-driven view that aggregates assets automatically based on semantic rules (e.g., `Camera == Leica M10-R AND Rating >= 4 AND Year == 2024`).

#### Place, Geography & Map
* **Place:** A specific geographic landmark, sanctuary, town, or street corner (e.g., *Gion, Kyoto*).
* **Country, City, Region:** Hierarchical geographic nodes that organize Places.
* **Map / Journey:** A spatial trail or itinerary connecting multiple Places across a defined timeframe (e.g., *14 Days Across Kansai*).

#### Memory & Time
* **Memory:** An emotional or historical event node that bridges specific Photos, Places, People, and Journals together into a temporal moment.
* **Time Dimensions:**
  * **Capture Time:** The exact physical moment light hit the sensor.
  * **Editorial Time:** The moment the story was written or curated.
  * **Publication Time:** The moment the work entered the public archive.
  * **Rediscovery Time:** Subsequent moments when past assets are surfaced and recontextualized.

#### Person, Role & Object
* **Person:** An individual captured in a photograph, mentioned in a journal, or collaborating on a project (e.g., Subject, Curator, Artist).
* **Object:** A key physical item documented within a Photo or Journal (e.g., *A 1968 Leica M4, An Aged Ceramic Bowl*).

#### Tag, Theme, Mood & Palette
* **Tag / Keyword:** Granular semantic labels (e.g., `Architectural`, `Rain`, `Night`).
* **Theme & Mood:** Higher-level atmospheric classifications (e.g., `Solitude`, `Melancholy`, `Wabi-Sabi`).
* **Color Palette:** Extracted dominant hex values, chroma weight, and tonal distribution.

---

## 3. Universal Entity Relationship & Ownership Rules

### 3.1 Strict Ownership Axioms
1. **The Photo is Sovereign:** A Photo exists independently of all organizational wrappers. Deleting a Project, Collection, Journey, Tag, or Journal NEVER deletes the underlying Photo.
2. **One-Way Metadata Ownership:** A Photo owns its Metadata. Metadata never owns a Photo.
3. **Virtual Groupings:** Projects and Collections contain *references* to Photos. They never copy or own the Photo entity.
4. **Geography is Decoupled:** A Place exists even if zero Photos have been taken there yet. A Photo may exist without GPS or Place references.

### 3.2 Cardinality & Relationship Matrix

| Source Entity | Relationship | Target Entity | Cardinality | Semantic Description |
| :--- | :--- | :--- | :--- | :--- |
| **Archive** | contains | **Photo** | `1 : N` | Root container for all master photographs. |
| **Photo** | owns | **Metadata** | `1 : 1` | Photo holds exclusive title, story, and status. |
| **Photo** | owns | **EXIF** | `1 : 1` | Photo holds physical hardware capture record. |
| **Photo** | references | **Place** | `N : 1` | Multiple photos can be captured at one Place. |
| **Project** | aggregates | **Photo** | `N : M` | Projects reference many Photos; Photos appear in many Projects. |
| **Collection** | groups | **Photo** | `N : M` | Virtual curated list referencing Photos. |
| **Journal** | embeds | **Photo** | `N : M` | Narrative prose referencing Photo nodes. |
| **Journey** | connects | **Place** | `1 : N` | Spatial trail spanning multiple geographic Places. |
| **Memory** | links | **Person / Place** | `N : M` | Human event node tying people and locations together. |

---

## 4. Lifecycle & State Machine Architecture

Every item in *byFRNK* follows a validated, linear state machine transition to ensure zero broken, orphan, or unverified content enters the public domain.

```
[ IMPORT ] ---> [ PROCESSING ] ---> [ READY ] ---> [ DRAFT ]
                                                        |
                                                        v
[ ARCHIVED ] <--- [ PUBLISHED ] <--- [ REVIEW ] <-------+
     |
     v
 [ TRASH ] ---> [ PERMANENTLY DELETED ]
```

### 4.1 Transition Validation Rules
* **Import -> Processing:** File validation, duplicate hash check, and initial disk allocation.
* **Processing -> Ready:** Sharp derivative generation (Web, Thumb, Blur), EXIF extraction, and atomic metadata write.
* **Ready -> Draft:** Asset is available in L'Officina Library for curation, tagging, and story writing.
* **Draft -> Review:** Editorial review state; mandatory title, slug, and minimum 1-star rating or tag validation.
* **Review -> Published:** Asset becomes visible in the public byFRNK ecosystem and search indices.
* **Published -> Archived:** Removed from active public view, but preserved permanently in the Master Archive.
* **Archived -> Trash:** Staged for deletion with 30-day recovery buffer.
* **Trash -> Permanently Deleted:** Cold storage raw files and derivatives purged permanently.

---

## 5. The Knowledge Graph Engine

### 5.1 Why Graph Architecture Rules
Traditional relational databases force strict tables; document databases force nested trees. A Knowledge Graph connects nodes with directional, typed edges:

```
(Photo: #8092) -[:CAPTURED_AT]-> (Place: "Gion, Kyoto")
(Photo: #8092) -[:SHOT_WITH]-> (Lens: "Summicron 35mm")
(Photo: #8092) -[:FEATURED_IN]-> (Project: "Silence of Craft")
(Photo: #8092) -[:ILLUSTRATES]-> (Journal: "Notes on Rain")
(Journal: "Notes on Rain") -[:WRITTEN_IN]-> (Place: "Gion, Kyoto")
```

### 5.2 Multi-Dimensional Discovery & Search
Discovery in *byFRNK* transcends simple text matching. The archive can be queried across complex human dimensions:
* **By Atmosphere:** *"Show photos taken in rain with a monochrome palette during Autumn in Japan."*
* **By Hardware Geometry:** *"Show 35mm photos shot at f/2.0 with ISO 400 in 2024."*
* **By Narrative Context:** *"Find journals that reference places featured in 'The Silence of Craft' project."*
* **By Memory Link:** *"Surface photos featuring Aiko taken in Kyoto five years ago today."*

---

## 6. Future Expansion Capability

The Knowledge Architecture is designed to incorporate future media types without breaking existing semantic relationships:

* **Audio & Field Recordings:** Soundscape nodes attached to Places, Photos, or Journals (`Soundscape: "Rain on Temple Roof.flac"`).
* **3D & Spatial Scans:** LiDAR models of physical architecture linked to Places and Photos.
* **Scanned Analog Artifacts:** Handwritten field logs, travel tickets, and film negative contact sheets attached to Memories and Projects.
* **AI Semantic Vectors:** High-dimensional embeddings enabling conceptual similarity searches (*"Find photos that feel like quiet isolation"*).

---

## 7. Anti-Patterns & Semantic Violations

1. ❌ **Folder-Based Ownership:** Storing photos in physical folder hierarchies that dictate their organizational identity.
2. ❌ **Duplicate Master Assets:** Uploading the same photograph twice for two different projects.
3. ❌ **Orphan Metadata:** Metadata records remaining in storage after a Photo entity is purged.
4. ❌ **Destructive Overwrites:** Overwriting original camera metadata or EXIF during editing.
5. ❌ **Hardcoded UI Categories:** Hardcoding project names, tags, or places directly into interface code.

---

## 8. The 10 Laws of Knowledge Architecture

1. **Every photograph belongs to the Archive; no photograph is owned by a folder.**
2. **Relationships between creative assets are permanent; structural layouts are temporary.**
3. **Context creates value. A photograph without place, time, or intent is incomplete.**
4. **The Original File is sacrosanct and untouchable.**
5. **Projects and Collections are virtual lenses overlaid on the Archive.**
6. **Geography exists independently of imagery.**
7. **Time operates on multiple dimensions: Capture, Editorial, Publication, and Rediscovery.**
8. **Semantic connections must survive changes in software frameworks and database engines.**
9. **No operation shall leave orphan files, broken references, or ambiguous ownership.**
10. **The Knowledge Graph must remain readable, discoverable, and coherent for fifty years.**

---
*Signed and sealed for byFRNK — Domain Architecture & Knowledge Constitution v3.0.*
