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

Scales are generated to preserve hue while carefully modulating lightness and saturation, preventing washed-out light colors and overly saturated dark tones.

### Semantic Role Mapping

Recipes assign colors exclusively through **semantic CSS roles** such as:

- structural backgrounds (`--ui-section-bg`, `--ui-panel-bg`)
- brand surfaces (`--ui-primary-bg`, `--ui-secondary-bg`)
- typography (`--color-title`, `--color-text`)
- accents and borders (`--color-tertiary`, border tokens)
- depth cues (`--ui-shadow-alpha`)

This ensures consistency, scalability, and safe extension of the UI.

### Pinning vs Dynamic Behavior

Most roles are assigned dynamically using `[scale, index]` pairs.  
Exact brand defaults can be pinned using CSS variables (e.g. `var(--ui-nav-bg)`), typically for navigation, footers, or safety-critical cases such as dark mode.

Pinning is intentionally limited to avoid freezing the system into static layouts.

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
Visual composition of a post.

- Background stack (color, pattern, image, overlay)
- Safe zone overlay (feed + story)
- Content stacking and watermark
- Applies safe-area CSS variables per format

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

## 🧱 Tech Stack

| Tool/Technology                        | Purpose                                       |
| :------------------------------------- | :-------------------------------------------- |
| **Vue 3 (Vite)**                       | Core frontend framework.                      |
| **JavaScript (ES6+)**                  | Application logic and interactivity.          |
| **CSS Custom Properties**              | Engine for the dynamic theming system.        |
| **Figma**                              | UI/UX design and component specification.     |
| **AI-Assisted Development**            | Dual-AI strategy for accelerated development. |
| &nbsp;&nbsp;&nbsp;↳ **ChatGPT**        | High-level strategy and code refactoring.     |
| &nbsp;&nbsp;&nbsp;↳ **GitHub Copilot** | In-editor code completion.                    |

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
