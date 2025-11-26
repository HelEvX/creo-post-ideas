# Voorbeeld-ig: Your Brand's Social Style Visualizer

![Voorbeeld-ig Logo](src/assets/img/logo-inverse.svg)

A dynamic brand visualization tool developed as a value-add for [Creo Websolutions](https://www.creowebsolutions.be/) clients. This application helps solopreneurs and small businesses maintain brand consistency by providing a "pre-editing guidance" experience. It allows users to visualize how their website's design tokens (colors, fonts, styles) can be applied to various social media post formats in a safe, interactive playground.

---

## 🚀 Core Philosophy & Features

This tool is a strategic sparring partner, not a graphic editor. It empowers non-technical users to make confident, on-brand design decisions _before_ they open an editor like Canva.

- **Dynamic Brand Theming:** The entire UI, including the tool's own logo, instantly adapts to the selected client's brand palette loaded from a simple JSON file.
- **Recipe-Based Styling:** Users can shuffle through pre-defined "Recipes" (e.g., Balanced, Bold, Inverted) which apply curated, brand-aligned styles to the post mockup.
- **Live Mockup Preview:** Visualize brand styles on different social media formats (Square, Story, etc.) and content layouts (Quote, Promo, etc.).
- **Interactive Playground:** A sandboxed area where users can safely tweak colors using a "Measuring Spoon" (stepped slider) and see the immediate impact on text and elements.
- **Real-Time Contrast Checking:** An always-on-display WCAG contrast checker provides instant, plain-language feedback (e.g., "Easy to Read," "Needs Attention") as the user experiments with color combinations.
- **Educational "Info Mode":** User-triggered annotations appear over the mockup, explaining the "why" behind certain design choices and providing best-practice tips.
- **Component-Based & Scalable:** Built on a robust Vue 3 architecture that is easy to maintain and expand with new formats, recipes, or features.

---

## 🧱 Tech Stack

| Tool/Technology           | Purpose                                                 |
| ------------------------- | ------------------------------------------------------- |
| **Vue 3 (Vite)**          | Core frontend framework for a fast, modern SPA          |
| **JavaScript (ES6+)**     | Application logic, state management, and interactivity  |
| **CSS Custom Properties** | The engine for dynamic, real-time theming and recipes   |
| **Figma Dev Mode**        | Accelerating the design-to-code process for components  |
| **GitHub Copilot**        | AI-assisted code generation and autocompletion          |
| **ChatGPT (Codex-Max)**   | AI-powered pair programming and strategic code guidance |

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
