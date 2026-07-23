# L'Officina Creative Operating System v3.0
## The Interaction Bible & Human Interface Guidelines

**Publisher:** byFRNK  
**Document Version:** 3.0.0  
**Scope:** Universal Interaction Specification & Ergonomic Design System  

---

## 1. Axioms of Interaction

In *L'Officina*, interaction is treated not as a trigger for software routines, but as an ergonomic conversation between the curator and their work. Every pixel motion, hover curve, and keystroke must embody five foundational axioms:

1. **Direct Manipulation:** Items in the archive behave as tangible physical artifacts. Dragging, reordering, tagging, and selecting feel immediate, with zero input lag or unexpected state mutations.
2. **Spatial Continuity:** Panels do not abruptly pop into existence. Modules expand, dock, and slide using fluid physics (`cubic-bezier(0.16, 1, 0.3, 1)`). The curator's spatial awareness is never disoriented.
3. **Optimistic & Reversible:** Every destructive or transformative edit occurs instantly on screen with a background retry queue and an accessible 8-second undo toast buffer (`Cmd+Z`). Action is privileged over confirmation modals.
4. **Typographic & Visual Calm:** Controls are invisible until relevant. Indicators do not scream; visual accents utilize low-saturation warm ambers, cool graphites, and subtle glassmorphic blurs (`backdrop-blur-md`).
5. **Zero Modals for Workspace Tasks:** Work is never blocked by intrusive modal dialogs during curation. The Inspector panel, Command Palette, and Inline Editors maintain contextual visibility at all times.

---

## 2. Keyboard Navigation & Command Architecture

The keyboard is the primary tool for high-velocity curation. All keyboard shortcuts are global unless focused inside an active text input or story editor.

### 2.1 Universal Shortcuts
| Key Combo | Action | Scope | Behavioral Description |
| :--- | :--- | :--- | :--- |
| `Cmd + K` / `Ctrl + K` | Toggle Command Palette | Global | Opens fuzzy finder overlay with search, quick commands, and navigational jumps. |
| `Cmd + Z` | Undo Last Action | Global | Reverts the last state mutation (flag, rating, publish state, batch metadata edit). |
| `Shift + Cmd + Z` | Redo Action | Global | Replaces the previously reverted state mutation. |
| `Cmd + B` | Toggle Navigation Sidebar | Workspace | Smoothly docks/undocks the left navigation sidebar (240ms ease-out). |
| `I` | Toggle Inspector Panel | Workspace | Opens/closes the right hand metadata, EXIF, and AI inspector. |
| `F` | Toggle Focus Mode (Loupe) | Workspace | Hides all UI chrome, leaving only the focused image centered on dark canvas. |
| `Esc` | Universal Dismissal | Global | Deselects active items, closes popovers, cancels drag operation, or exits Focus Mode. |
| `?` | Keyboard Shortcut Map | Global | Displays keymap overlay for instant reference. |

### 2.2 Grid & Library Navigation
| Key Combo | Action | Behavioral Description |
| :--- | :--- | :--- |
| `Arrow Keys` (`←` `→` `↑` `↓`) | Spatial Focus Movement | Navigates item cursor through grid cells smoothly. |
| `J` / `K` | Next / Previous Item | Lightroom-standard linear sequential step forward (`K`) or backward (`J`). |
| `Spacebar` | Quick Look / Loupe Toggle | Toggles 100% full-frame preview overlay without leaving grid context. |
| `1` – `5` | Set Star Rating (1–5 Stars) | Assigns star rating to active item(s). Pressing same number clears rating. |
| `0` | Clear Star Rating | Resets rating to 0 stars. |
| `6` – `9` | Apply Color Labels | `6`: Red, `7`: Yellow, `8`: Green, `9`: Blue. Toggle behavior. |
| `P` | Pick Flag | Flags active item as "Picked" (Amber accent badge). |
| `X` | Reject Flag | Flags active item as "Rejected" (Muted red strike-through badge). |
| `U` | Unflag | Clears Pick / Reject flag state. |
| `Cmd + A` | Select All | Selects all items in current view context. |
| `Cmd + D` | Deselect All | Clears current item selection. |

---

## 3. Cursor & Pointer Behaviors

Pointer interactions mirror physical desk organization: items can be picked up, stacked, previewed, and adjusted with high tactile precision.

### 3.1 Hover Dynamics
* **Hover Intent Delay:** Hover feedback initiates after a **120ms Intent Window** to eliminate visual flickering during fast cursor passes.
* **Card Highlight:** Subtle 1px border shift from `border-neutral-800/80` to `border-neutral-600/60` paired with a micro-scale transition (`scale-[1.01]`, 180ms ease-out).
* **Metadata Overlay:** Hovering over an asset card smoothly fades in quick action icons (Quick Capture, Pick Flag, Selection Checkbox) with `opacity-100` transition.

### 3.2 Selection Mechanics
* **Single Click:** Selects target asset, focuses item in Inspector, and highlights border with amber selection ring (`ring-1 ring-amber-500/50`).
* **Shift + Click (Range Selection):** Selects all assets between previously active selection anchor and clicked target.
* **Cmd + Click / Ctrl + Click (Multi-Toggle):** Toggles individual asset selection state without clearing existing selection pool.
* **Double Click:** Enters deep item view (Loupe/Editor/Story Mode for Journal entries).

### 3.3 Drag & Drop Engine
* **Drag Initiation:** Holding mouse down and moving > 5px creates a floating drag card bundle showing thumbnail stack and live selection counter badge (`N items`).
* **Drop Zones:** Valid drop targets (Collections, Projects, Trash, Export Queue) highlight with glowing amber borders and subtle scaling (`scale-[1.02]`).
* **Drop Execution:** Releasing assets triggers an atomic operation. The drag ghost animates toward target drop icon and shrinks to zero scale before committing update.

---

## 4. Spatial Physics & Shell Architecture

*L'Officina* utilizes a three-column responsive grid framework that preserves context across screen dimensions.

```
+-----------------------------------------------------------------------------------+
|  L'OFFICINA OS TOP BAR (Status, Global Search, Workspace Switcher, Sync Indicator) |
+------------------+------------------------------------------+---------------------+
| LEFT SIDEBAR     | MAIN CREATIVE CANVAS                     | RIGHT INSPECTOR     |
| (Nav, Library,   | (Grid, Loupe, Story Editor,              | (EXIF, Metadata,    |
|  Collections,    |  Site Builder, Timeline, Map)            |  AI Assistant,      |
|  Projects)       |                                          |  Publishing Panel)  |
| Width: 240px     | Flexible Fluid Container                 | Width: 320px        |
+------------------+------------------------------------------+---------------------+
| BOTTOM NAVIGATION & ACTION STATUS BAR (Upload Queue, Quick Capture, Shortcuts)    |
+-----------------------------------------------------------------------------------+
```

### 4.1 Panel Docking & Un-docking
* Panels push adjacent layout modules rather than overlaying them, ensuring zero content obstruction.
* Panel state toggles transition over **240ms** using `cubic-bezier(0.16, 1, 0.3, 1)`.

---

## 5. Micro-Interactions & Animation Language

Motion in *L'Officina* serves a cognitive purpose: indicating state changes, directional velocity, and operational continuity.

* **Entrance Animations:** Fade + Slide-Up (`opacity: 0 -> 1`, `translateY: 8px -> 0px`, 200ms duration).
* **Exit Animations:** Fade + Scale-Down (`opacity: 1 -> 0`, `scale: 1 -> 0.96`, 150ms duration).
* **State Toggle Micro-Interactions:** Pick/Reject buttons spring gently (`scale: 1 -> 1.2 -> 1.0`, 220ms spring cubic-bezier).

---

## 6. States of Being: System Feedback & Resilience

### 6.1 Empty States
Empty states are designed as quiet, welcoming invitations rather than dead ends:
* Clear editorial icon/illustration with soft contrast (`text-neutral-600`).
* Expressive title (e.g., *"No photographs in this collection yet"*).
* Actionable guidance button (e.g., *"Import Assets"* or *"Drag photos here"*).

### 6.2 Loading & Waiting Experience
* **Skeleton Loaders:** Content boxes feature warm pulse shimmer placeholders matching exact aspect ratios.
* **Progressive Image Loading:** SmartImage engine renders blur placeholders (`blur-md scale-105`) before cross-fading to high-resolution web previews upon decode completion.
* **Background Processing Bar:** Uploads and AI tags run asynchronously in the bottom status bar without blocking active curation.

### 6.3 Error & Exception Recovery
* **Non-Blocking Toasts:** System notices appear in bottom-right anchor. Errors include clear human-readable messages and instant `"Retry"` or `"Dismiss"` action controls.
* **Atomic Rollbacks:** If an API endpoint fails, local React state instantly reverts with smooth transition and toast notice (*"Failed to update metadata. Reverted."*).

---

## 7. The 10 Laws of L'Officina Interaction

1. **Never block the curator with modal dialogs for routine operations.**
2. **Every state mutation must be reversible via `Cmd+Z` within 8 seconds.**
3. **Hover states must carry an intent delay to preserve visual serenity.**
4. **Drag operations must physically represent item counts and target feedback.**
5. **Image loading must transition progressively without layout shifts (CLS = 0).**
6. **The Inspector panel is persistent context, never a popover.**
7. **Deleting a collection or project never deletes underlying master photographs.**
8. **Text labels in controls must sit on a single line and scale gracefully.**
9. **Keyboard shortcuts must operate universally across all curation modules.**
10. **The archive software must remain invisible behind the beauty of the work.**

---
*Signed and sealed for byFRNK — L'Officina OS v3.0 Core Specification.*
