# Voorbeeld-ig: Your Brand's Social Style Visualizer

<p>
  <img src="src/assets/img/logo-inverse-full.svg" width="400" />
</p>

A dynamic brand visualization tool developed as a value-add for [Creo Websolutions](https://www.creowebsolutions.be/) clients. This application helps solopreneurs and small businesses maintain brand consistency by providing a "pre-editing guidance" experience. It allows users to visualize how their website's design tokens can be applied to various social media post formats in a safe, interactive environment.

---

## 🚀 Core Philosophy & Features

This tool is a **strategic guidance system**, not a graphic editor. It empowers non-technical users to make confident, on-brand design decisions _before_ they open an editor like Canva.

- **Dynamic Brand Theming:** The entire UI instantly adapts to the selected client's brand palette, loaded from a simple JSON configuration file.
- **"Smart Shuffle" Recipe Engine:** The core feature. Users cycle through pre-defined, curated "Recipes" that apply brand-aligned styles to the post mockup. The engine guarantees all generated combinations are accessible and on-brand.
- **Live Mockup Preview:** Visualize brand styles on different social media formats (Square, Story, etc.) and for various content types (Quote, Announcement, etc.).
- **Platform Safe Zones:** The preview visualizes Instagram feed and story crop boundaries, clearly indicating which areas of a post risk being cut off or obscured by the platform UI.
- **Real-Time Contrast Guardrails:** An always-visible WCAG contrast checker provides instant, clear feedback on all color pairings in the current recipe.
- **Interactive Contrast Repair:** A "Fix" button is integrated directly into the contrast checker. If a color combination fails accessibility standards, the user can click to have the tool automatically calculate and apply a compliant alternative from the brand's palette.
- **Component-Based & Scalable:** Built on a robust Vue 3 architecture that is easy to maintain and expand with new formats, recipes, or features.

---

## 🎨 Color Recipes System

The application uses a **recipe-based color composition system** to reinterpret a client’s brand palette into different visual moods without redefining or duplicating brand tokens.

Recipes do not introduce new colors. Instead, they remap existing brand and neutral color scales onto semantic UI roles.

### Perceptual Color Scales

Each brand color (primary, secondary, tertiary) and the neutral palette is expanded into an 11-step perceptual scale:

- `0` = lightest usable tone
- `5` = original brand anchor
- `10` = darkest usable tone

Scales are generated to preserve hue while asymmetrically modulating lightness and saturation around a fixed anchor, constraining tones to usable bounds and avoiding washed-out lights or oversaturated darks. This is because near-grey lights are useless for brand expression while over-saturated darks are visually unpleasant for most colors.

Scale generation is anchor-centered and index-based; perceptual shaping comes from asymmetric lightness and saturation curves rather than uniform step distances.

### Semantic Role Mapping

Recipes assign colors exclusively through **semantic CSS roles** such as:

- structural backgrounds (`--ui-section-bg`, `--ui-panel-bg`)
- brand surfaces (`--ui-primary-bg`, `--ui-secondary-bg`)
- typography (`--color-title`, `--color-text`)
- accents (`--color-*-dark`, `--color-tertiary`)
- depth cues (`--shadow-alpha`, mockup-only)
- borders (`--card-border`, mockup-only)

Brand-defined borders and shadows apply only inside the mockup; UI borders and shadows are never affected by brands or recipes.

This ensures consistency, scalability, and safe extension of the UI.

### Pinning vs Dynamic Behavior

Most roles are assigned dynamically using `[scale, index]` pairs.  
Exact brand defaults can be pinned using CSS variables or provided directly by brand tokens. Pinning hard-codes a value and stops it from responding to recipes, tone switches, inverted mode, and contrast logic.

### Recipe Intent

Each recipe expresses a different design intent:

- **Balanced** – conservative, brand-faithful, moderate contrast
- **Bold** – strong hierarchy and contrast, limited color expansion
- **Subtle** – softer contrast, calm continuity
- **Vibrant** – expressive use of brand colors
- **Minimalist** – neutral-first, minimal color presence
- **Inverted** – dark canvas with soft, light surfaces

Accessibility is enforced at runtime through contrast evaluation and repair logic, keeping visual intent and WCAG compliance clearly separated.

---

## 🌓 Dynamic Text, Surface Resolution, and Contrast Safety

This project does **not** use static light or dark themes and does **not** assume anything about brand colors.
All readable text colors are resolved **at runtime**, based on the actual background they appear on.

The goal is simple:
designers can freely change brands, recipes, and tones, while the system guarantees readable contrast and predictable behaviour.

### Core Rule

**Text color is never chosen by brand color.  
Text color is always chosen by background polarity.**

Brand colors can be light or dark.
Readability is determined by contrast, not intent.

### The Three Layers (Do Not Mix These)

#### 1. Brand Tokens (JSON)

Design-time only.

- Define brand identity (`color-primary`, `color-secondary`, neutrals, etc.)
- May define `color-title` and `color-text` **for light backgrounds only**
- No logic
- No contrast decisions
- Never define `text-on-*` or `dynamic-*`

Brand tokens describe identity, not behaviour.

#### 2. Surface-Resolved Text Roles (Runtime)

Handled globally in `App.vue -> updateDynamicTextRoles()`.

For each UI surface:

`nav, footer, section, alt-section, panel, primary, secondary, accent`

The system:

1. Reads the **computed background**
2. Detects whether it is light or dark
3. Writes surface-specific roles:

`--text-on-*`  
`--title-on-*`  
`--text-soft-on-*`  
`--caption-on-*`  
`--disabled-on-*`  
`--overlay-on-*`

These variables are **derived outputs**.
They must never be hardcoded or set by recipes.

This layer guarantees that the UI remains readable across all brands and modes.

#### 3. Dynamic Routing and Mockup Resolution (Content Layer)

Content never decides contrast.
It only consumes resolved roles.

Generic content variables route text to the correct surface:

`--dynamic-text`  
`--dynamic-title`  
`--dynamic-soft`

Inside the social post preview, `SocialPostMockup.vue` introduces a **local override layer**:

- Dynamic text roles (`--dynamic-*`) respond **only** to the overall mockup background
- Panel, alt-panel, and accent captions are resolved **locally**, based on:
  - their own surface background
  - the active tone toggle
  - perceived contrast

These overrides are:

- scoped to the mockup (`.post-content`)
- intentionally isolated from global UI logic
- designed to expose a complete, stable visual context to the contrast checker

This allows the contrast checker to evaluate and fix **exactly what is rendered**, without affecting the UI or brand tokens.

The local override layer adjusts **text and caption roles** only and never redefines surface backgrounds.

### Buttons (Why They Always Work)

- Backgrounds:

  - Primary → `--ui-primary-bg`
  - Secondary → `--ui-secondary-bg`

- Text:

  - Primary → `--text-on-primary`
  - Secondary → `--text-on-secondary`

Because `text-on-*` is surface-resolved, buttons stay readable across:

- All brands
- All recipes
- Inverted mode

No special cases.

### Hover and Active States

Hover behavior is based on **UI background polarity**, not brand color:

- Light UI → darken on hover
- Dark UI → lighten on hover

Controlled via:

```
--btn-mix-hover
--btn-mix-active
```

This guarantees subtle, readable hover states even in inverted recipes.

### Contrast Checker

The contrast checker validates **rendered reality**, not tokens.

- Reads computed colors from the DOM
- Includes mockup-scoped surfaces (panel, alt-panel, accent)
- Scores worst-case contrast per surface
- Never edits `dynamic-*` directly
- Applies fixes locally inside the mockup only

UI tokens, brand identity, and global text roles remain untouched.

### Style Inspector Output

The Style Inspector lists **only resolved, rendered colors**, not raw brand tokens.

- Colors are collected from the consolidated visual context emitted by `SocialPostMockup.vue`
- Only surfaces and text roles that are **actively rendered** in the current mockup are included
- Switching recipes, tones, or mockup variants changes the exported color set accordingly

This is intentional.
The inspector reflects visual reality after all dynamic resolution and overrides have been applied.

In the current MVP, the color list does not shrink when switching designs.
All resolved colors remain listed, even if some elements are not rendered in the active mockup.
This is a known limitation and intentionally left unresolved for stability.

### Non-Negotiable Rules

If any of these are broken, contrast bugs will appear:

1. Never hardcode text colors on colored surfaces
2. Never assume brand colors are light or dark
3. Never bypass `updateDynamicTextRoles()`
4. Never write directly to `dynamic-*`
5. Never let recipes define text polarity

### In One Sentence

**Brands define identity, recipes define mood, surfaces decide readability, and contrast is enforced at runtime.**

---

## ⚠️ Event-Driven Recalculation (Important Implementation Note)

The application relies on **global custom events** to trigger recomputation of derived visual state.  
This is intentional and safe in the current scope, but it is important to understand the trade-offs.

### Events in Use

The following events are dispatched and listened to across components:

- `brand-updated`
- `palette-updated`
- `accent-updated`
- `dynamic-text-updated`

They trigger recomputation of:

- surface-resolved text roles
- dynamic content roles
- hover / active polarity
- contrast checker evaluation

### Why This Exists

The system has **no single reactive store** for visual state.  
Instead, all correctness is derived from **computed CSS values** after the browser has resolved styles.

Using events allows:

- safe recomputation after CSS variables change
- decoupling between brand loading, recipes, contrast checking, and UI
- idempotent recalculation without cached assumptions

Functions like `updateDynamicTextRoles()` and `scheduleContrastUpdate()` are written to be safe when called multiple times.

### Known Trade-Off

Some events trigger overlapping recomputation paths.  
In practice, the same derived state may be recalculated more than once during:

- brand loading
- recipe switching
- contrast fixing

This works because:

- recomputation is idempotent
- execution is deferred via `nextTick`
- all logic reads **computed CSS**, not intermediate state

### Why This Is Acceptable (For Now)

- The system is deterministic once the browser has completed layout
- No race conditions exist in the current feature set
- Visual correctness is guaranteed even if recalculation happens twice

### Caution for Future Changes

This pattern **scales poorly** if significantly more async inputs are added (e.g. image loading, animations, persistence).

If extending the system:

- avoid adding new global events casually
- avoid introducing logic that depends on event order
- prefer recomputing derived state in one place where possible

### Summary

This is a **conscious architectural choice**, not an oversight.

It prioritizes:

- correctness
- decoupling
- safety under CSS-driven theming

over minimal recomputation.

Do not refactor this without a clear replacement model.

---

## 🧩 Architecture Overview (How the Preview System Fits Together)

The preview pipeline is deliberately layered. Each component has a single responsibility, which keeps layout logic, rendering logic, and visual composition cleanly separated.

### Preview Component Stack

```
<MainPreview>
 └─ <MockupWrapper :size>
    └─ <MockupRenderer :size>
       └─ <SocialPostMockup :size>
          └─ <PostWrapper :size>
             └─ .post-wrapper (DOM)
```

### Responsibilities per Layer

**`MockupWrapper`**
UI-level layout container for the dashboard.

- Controls perceived width of the mockup in the preview column
- Handles responsive behaviour between formats (story vs landscape)
- Does not know anything about aspect ratios or post internals

**`MockupRenderer`**
Orchestration layer.

- Selects which post type component to render
- Resolves background color variables
- Emits resolved visual styles for the style inspector
- Passes state and props downward

**`SocialPostMockup`**
Visual composition of a post mockup.

- Renders the full background stack (solid color, pattern, large logo, image)
- Applies platform safe zones (feed and story)
- Handles content stacking, scaling, and watermark placement
- Applies safe-area CSS variables per format
- Resolves **mockup-scoped text and caption roles** based on actual rendered backgrounds
- Emits a consolidated snapshot of all active mockup colors for the style inspector and export panel

This component has explicit awareness of mockup-only surfaces (panel, alt-panel, accent).
Text and caption colors inside the mockup are resolved locally to guarantee correct contrast evaluation and fixability.

**`PostWrapper`**
Canvas contract.

- Enforces the correct aspect ratio (1:1, 4:5, 9:16, 16:9)
- Clips overflow
- Guarantees a predictable mockup canvas

**`.post-wrapper`**
The actual DOM element created by `PostWrapper`.

### Key Design Rules

- Aspect ratio logic exists **only** in `PostWrapper`
- Responsive sizing logic exists **only** in `MockupWrapper`
- Visual composition exists **only** in `SocialPostMockup`
- No layout breakpoints leak into mockup visuals

This separation is intentional and avoids the most common failure mode of preview tools: mixing dashboard layout concerns with mockup rendering logic.

If something looks wrong:

- width or scaling issue → check `MockupWrapper`
- wrong format ratio → check `PostWrapper`
- visual overlap / safe zones / backgrounds → check `SocialPostMockup`
- wrong content or styles → check `MockupRenderer`

This structure is safe to extend with new formats, new platforms, or additional overlays without refactoring existing logic.

---

## 🖼️ SVG Logo Preparation

All SVG logos used inside the mockup (large logo, pattern, watermark) must be prepared in a specific way.

This is required for reliable recoloring, contrast evaluation, and export accuracy.

### Requirements

- Single `<svg>` with a valid `viewBox`
- Paths only (all shapes expanded)
- No inline `fill` or `stroke` values
- No `<style>` blocks or embedded CSS
- No gradients, filters, masks, or `<defs>`
- No opacity on paths or groups

SVGs must rely on `currentColor` for coloring.
Actual color is injected via CSS using mockup variables such as `--mockup-decor`.

### Why This Matters

- Logos must adapt correctly to light and dark backgrounds
- Inverted recipes and contrast fixes must remain accurate
- Runtime SVG mutation is intentionally avoided

All brand SVGs must be cleaned before being added.
This requirement applies to all future brands after handoff.

---

## 🧱 Tech Stack

| Tool/Technology                        | Purpose                                       |
| :------------------------------------- | :-------------------------------------------- |
| **Vue 3 (Vite)**                       | Core frontend framework.                      |
| **JavaScript (ES6+)**                  | Application logic and interactivity.          |
| **CSS Custom Properties**              | Engine for the dynamic theming system.        |
| **Figma**                              | UI/UX design and component specification.     |
| **AI-Assisted Development**            | Dual-AI strategy for accelerated development. |
| &nbsp;&nbsp;&nbsp;↳ **ChatGPT**        | High-level strategy and code refactoring.     |
| &nbsp;&nbsp;&nbsp;↳ **GitHub Copilot** | In-editor code completion (used sparingly).   |

---

## 🛠️ Project Setup

This project is built using **Vite**. The following commands are relevant.

### Prerequisites

- Node.js (v18.x or higher recommended)
- npm

### Installation

```bash
# Clone the repository and navigate into the directory
git clone [your-repo-url]
cd voorbeeldig

# Install dependencies
npm install
```

### Development

```bash
# Run the app in development mode with hot-reloading
npm run dev
```

### Production Build

```bash
# Compiles and minifies the application for production
npm run build
```

---

## 📎Credits

Instagram grid layout based on work by georgewpark:
https://github.com/georgewpark/Instagram-Profile-Layout
