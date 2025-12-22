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
