# Voorbeeld-ig: Your Brand's Social Style Visualizer

<p>
  <img src="src/assets/img/logo-default-full.svg" width="400" />
</p>

Thank you for checking out Voorbeeld-ig!

Voorbeeld-ig is a brand visualization tool developed as a value-add for [Creo Websolutions](https://www.creowebsolutions.be/) clients, in particular the solopreneur or small business owner subset. This application addresses knowledge gaps about available brand assets when DIY-designing for social media, through a "pre-editing guidance" experience. It allows them to visualize how the color scheme, fonts, corners, borders and shadows from their landing page can be applied in an Instagram post, by showing various combinations in a dynamic canvas.

This is my final Associate's degree project as a Digital Design student at PXL Hogeschool, Hasselt. The one-page app includes a feedback form at the bottom, feel free to shoot me a message.

<!-- ### What's the intent of this document?

- a high-level explanations of the tool's component structure and core features
- a deep-dive into its information architecture and UX-flow
- a summary of the creator's mission statement and design process
- a developer quick-start guide for onboarding new brands quickly and correctly

--- -->

## At a glance

The [Master version](https://voorbeeld-ig.netlify.app/) of this tool includes a dropdown list of clients. Per default, no brand is selected and the mockup preview canvas shows an empty state (greyed-out logo), while the left-hand sidebar simply remains empty. Selecting a client causes the user interface to 'repaint' as shown below.

Demonstration of brand-specific visual updates and interface repaint behaviour.

https://github.com/HelEvX/creo-post-ideas/blob/main/docs/media/brand-repaint.mp4

Client-specific links have a query string (/?brand=client-name) and these pages do not show the dropdown or the empty state. However, UI-repaints still happen when the user browses the various themes within their own brand color palette and corrects text/background pairs with low contrast scores. This is intentional, but alternatively the repaint could be confined to just the mockup by adjusting which CSS variables get triggered.

Demonstration of features for one single brand including canvas navigation, theme repaints and contrast corrections.

https://github.com/HelEvX/creo-post-ideas/blob/main/docs/media/walkthrough.mp4

## Core Philosophy & Features

This tool is a **strategic guidance system**, not a graphic editor. It empowers non-technical users to make confident, on-brand design decisions _before_ they open an editor like Canva. Themes - also called 'recipes' - are predefined in a simple script file and can be easily tweaked. Users can cycle through them with chevron-buttons and there is no technical limit to the number of 'recipes' that can be added, although aesthetically only a number of themes make any practical sense.

In this fist proof-of-concept, 7 themes (the brand default that mimics the website + 6 adaptations or 'moods') have been implemented. Each shows 12 text/background pairs, presented in the mockup in the main canvas. There, a second side-panel allows toggling tones (primary & secondary) and switching to neutral. Together with the option to fix sub-par contrasts per pair, the tool essentially offers hundreds of guaranteed brand-aligned style choices. Even if only a small percentage of combinations appeal to the client, they still have dozens to choose from. Crucially, they can be confident about good readability and effective brand recognition.

To address common cropping issues from post design to grid display, the canvas offers four established Instagram post formats with a safe-zone overlay that can be turned on or off. These 'live' mockups, that immediately adapt to background choices as well as content options, have been constructed in such a way that important text never exceeds the safe margins. Decorative elements however can freely fill up the background, and remind the user that their brand assets can be applied in all sorts of interesting ways. The user can even check this in the section below the canvas. There, the 6 post designs that showcase the text/background combinations and various background treatments (such as patterns and images) are displayed side-by-side in a 'realistic' grid-mockup, 'painted' of course in the active theme.

The color contrast evaluations are mathematical and based on WCAG ratios, but translated into approachable language for a non-technical audience. To prevent too many fails at default, the system already supports automatic text inversion for dark background colors, turning dark into white on load. Interestingly, carefully judged adaptations had to be made to account for perceived mistakes, since WCAG math has a tendency to force dark text on mid-tone reds and greens.

---

- **Interactive Contrast Repair:** A "Fix" button is integrated directly into the contrast checker. If a color combination fails accessibility standards, the user can trigger an incremental repair step. The system evaluates whether adjusting the background or the foreground improves contrast most and applies the better option. This behavior is consistent across all surfaces and text roles.
- **Component-Based & Scalable:** Built on a robust Vue 3 architecture that is easy to maintain and expand with new formats, recipes, or features.
- **Easy manual onboarding:** Default brand palettes are loaded from a simple JSON configuration file. Logo SVGs need some manual checks or preparations, which are detailed below.

---

## The Color Recipes (Dynamic Theme Engine)

Recipes do not introduce new colors. Instead, they remap existing brand-specific and neutral color scales onto semantic UI roles. A set of scripts prescribe and apply tone and tint blends to reinterpret each default brand palette into different visual moods, without redefining or duplicating brand tokens.

### Perceptual Color Scales

Each brand color (primary, secondary, tertiary) and the neutral palette is expanded into an 11-step perceptual scale:

- `0` = lightest usable tone
- `5` = original brand anchor
- `10` = darkest usable tone

Scales are generated to preserve hue while asymmetrically modulating lightness and saturation around a fixed anchor, constraining tones to usable bounds. The perceptual shaping comes from asymmetric lightness and saturation curves, rather than uniform step distances. This is a stylistic choice motivated by the observation that washed-out lights, while a decent choice for website section backgrounds, aren't as relevant for brand expression. Likewise, darks are often visually more pleasant when muted. On a HSV color picker 'square', the dot will move towards bottom left or top right in this system.

Brand colors, which are already defined by the agency on a 5-step scale in the client's website CSS up by default (although not always explicitly used), can be either primary or secondary. In all except edge-cases that means each has a more or less fixed hue. String values that correspond with the existing system (primaryDark for $primary-dark, and so on) prescribe from which color set the new 'blend' will be picked. That way, the script may determine that a neutral light surface in recipe 1 can turn into a mid-tone primary in recipe 2.

### Semantic Role Mapping

Recipes assign colors exclusively through semantic CSS roles, such as:

- structural backgrounds (`--ui-section-bg`)
- brand surfaces (`--ui-primary-bg`)
- typography (`--color-title`)
- accents (`--color-secondary-dark`)
- depth cues (`--shadow-alpha`)
- border strength (`--border-alpha`)

Brand-defined borders and shadows apply only inside the mockup; UI borders and shadows are never affected by brands or recipes. This is to prevent distortion of dashboard elements and ensures consistency, scalability, and safe extension of the UI.

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

## Dynamic Text, Surface Resolution, and Contrast Safety

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
`--soft-on-*`  
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
- Scores worst-case contrast per rendered surface
- Applies incremental fixes locally inside the mockup
- May adjust either background or foreground roles when doing so improves contrast
- Never modifies brand tokens or global UI roles

UI structure stays stable by design. Only mockup-only decoration tokens (shadow and border) are isolated from recipes and fixes.
Core surface tokens (color-surface, color-panel, color-card and derived ui-\* backgrounds) are allowed to change, intentionally.

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

## Event-Driven Recalculation (Important Implementation Note)

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

## Architecture Overview (How the Preview System Fits Together)

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

## SVG Logo Preparation

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

## Protected URLs

Some brand configurations include reference URLs to password-protected staging sites. These links are used by the author during design and development to compare visual decisions. They are not part of the tool’s functional scope and are not expected to be accessible to reviewers.

---

## Tech Stack

| Tool/Technology                      | Purpose                                   |
| :----------------------------------- | :---------------------------------------- |
| **Vue 3 (Vite)**                     | Core frontend framework.                  |
| **JavaScript (ES6+)**                | Application logic and interactivity.      |
| **CSS Custom Properties**            | Engine for the dynamic theming system.    |
| **Figma**                            | UI/UX design and component specification. |
| **AI-Assisted Development**          | AI strategy for accelerated development.  |
| &nbsp;&nbsp;↳ **ChatGPT-5.1 (chat)** | Code setup, refactoring & bug fixes       |

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
