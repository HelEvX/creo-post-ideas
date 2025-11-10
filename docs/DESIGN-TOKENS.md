DESIGN TOKENS — Creo Post Ideas Tool

Reference for the design system used in the “Creo Post Ideas” tool
(Base theme: Creo Websolutions 2025)

NEEDS UPDATE

1. Color Tokens

All colors are defined in :root inside src/assets/global.css.
Values are expressed as CSS Custom Properties (variables).

| Token           | Hex       | Description                             |
| --------------- | --------- | --------------------------------------- |
| `--primary-900` | `#035a43` | Deep green – used for dark accents      |
| `--primary-800` | `#04815f` | Medium-dark tone                        |
| `--primary-700` | `#048c68` | Secondary green                         |
| `--primary-600` | `#048e69` | Green midtone                           |
| `--primary-500` | `#05a47b` | Supportive tint                         |
| `--primary-400` | `#05b184` | Medium UI accent                        |
| `--primary-300` | `#05b384` | **Main UI button color**                |
| `--primary-200` | `#06d6a0` | **Logo color** (too bright for main UI) |
| `--primary-100` | `#61fbd3` | Light accent                            |

| Token             | Hex       | Description                             |
| ----------------- | --------- | --------------------------------------- |
| `--secondary-900` | `#00090a` | Deepest background tone                 |
| `--secondary-800` | `#001214` | **Main title text color**               |
| `--secondary-700` | `#001417` | Slightly lighter dark                   |
| `--secondary-600` | `#001b1f` | Mid-dark neutral                        |
| `--secondary-500` | `#00262c` | Support dark                            |
| `--secondary-400` | `#00363d` | Dark teal                               |
| `--secondary-300` | `#004852` | **Main background color (footer, nav)** |
| `--secondary-200` | `#006c7a` | Highlight teal                          |

| Token           | Hex       | Description                                     |
| --------------- | --------- | ----------------------------------------------- |
| `--neutral-900` | `#293233` | Dark text on light backgrounds                  |
| `--neutral-800` | `#2f383a` | Dark grey                                       |
| `--neutral-700` | `#404d4f` | Muted grey                                      |
| `--neutral-600` | `#596566` | **Body text color**                             |
| `--neutral-500` | `#8c9495` | Subtle text, icons                              |
| `--neutral-400` | `#a8a8a8` | Borders, lines                                  |
| `--neutral-300` | `#cfcfcf` | Divider color                                   |
| `--neutral-200` | `#d9dcdc` | Light divider                                   |
| `--neutral-150` | `#dfdae3` | Light background shade                          |
| `--neutral-125` | `#e5e1e9` | Subtle background                               |
| `--neutral-100` | `#f8f7f9` | **Surface color**                               |
| `--neutral-0`   | `#ffffff` | **Main background** / reversed text on dark BGs |

UI aliases

| Alias                    | Value                  | Purpose                      |
| ------------------------ | ---------------------- | ---------------------------- |
| `--color-primary`        | `var(--primary-300)`   | Main button + accent color   |
| `--color-primary-bright` | `var(--primary-200)`   | Highlighted or hover states  |
| `--color-accent`         | `var(--primary-200)`   | Accent color                 |
| `--color-background`     | `var(--neutral-0)`     | Default background           |
| `--color-surface`        | `var(--neutral-100)`   | Surface elements             |
| `--color-text`           | `var(--neutral-600)`   | Body text                    |
| `--color-title`          | `var(--secondary-800)` | Headings and hero text       |
| `--color-inverse-text`   | `var(--neutral-0)`     | Text on dark backgrounds     |
| `--color-footer-bg`      | `var(--secondary-300)` | Footer and navbar background |

2. Typography Tokens

| Token          | Value                               | Notes               |
| -------------- | ----------------------------------- | ------------------- |
| `--font-title` | `"europa", "Work Sans", sans-serif` | Adobe Font (Europa) |
| `--font-body`  | `"Work Sans", sans-serif`           | Google Font         |

Font sizes (Desktop baseline: 10px = 1rem)

| Token          | Size            | Use                    |
| -------------- | --------------- | ---------------------- |
| `--fs-hero`    | `6rem` (60px)   | Hero titles            |
| `--fs-h1`      | `5rem` (50px)   | Page titles            |
| `--fs-h2`      | `4rem` (40px)   | Section headings       |
| `--fs-h3`      | `3rem` (30px)   | Subsection headings    |
| `--fs-h4`      | `2.4rem` (24px) | Smaller headings       |
| `--fs-h5`      | `2rem` (20px)   | UI labels              |
| `--fs-h6`      | `1.8rem` (18px) | Tiny headings          |
| `--fs-body-lg` | `1.8rem` (18px) | Large text             |
| `--fs-body`    | `1.6rem` (16px) | Default paragraph text |
| `--fs-body-sm` | `1.5rem` (15px) | Small UI text          |
| `--fs-body-xs` | `1.3rem` (13px) | Notes, legal text      |

Line heights

| Token          | Value | Use                    |
| -------------- | ----- | ---------------------- |
| `--lh-display` | `1.3` | Very large titles      |
| `--lh-heading` | `1.5` | Medium to small titles |
| `--lh-body`    | `1.7` | Body text              |

3. Spacing System

Scale uses 10px = 1rem increments (Creo framework standard).

| Token         | Value    | Pixels |
| ------------- | -------- | ------ |
| `--space-10`  | `1rem`   | 10px   |
| `--space-20`  | `2rem`   | 20px   |
| `--space-30`  | `3rem`   | 30px   |
| `--space-40`  | `4rem`   | 40px   |
| `--space-50`  | `5rem`   | 50px   |
| `--space-75`  | `7.5rem` | 75px   |
| `--space-100` | `10rem`  | 100px  |

4. Grid System

Adapted from Creo’s internal Bootstrap-based framework.

- Max content width: 1650 px
- Padding: 25 px each side (→ 1600 px usable content width)
- Wide sections (hero): 1700 px max width
- Columns: 12
- Gutter width: 50 px (25 px per side)
- Responsive scaling: standard 768px breakpoint for medium devices
- Special constraint: “blog text” or long copy limited to 900 px width

Example column classes available in App.vue styles:

| Class     | Width  |
| --------- | ------ |
| `.col-12` | 100%   |
| `.col-6`  | 50%    |
| `.col-4`  | 33.33% |
| `.col-3`  | 25%    |

Utility classes:

- row.center – centers content horizontally
- row.between – space-between columns
- align-center – vertical centering
- right – right-aligned text

5. Shadows, Borders, Radius

| Token         | Value    | Description             |
| ------------- | -------- | ----------------------- |
| `--radius-sm` | `0.4rem` | Small elements (inputs) |
| `--radius-md` | `0.6rem` | Buttons, cards          |
| `--radius-lg` | `1rem`   | Large surfaces          |

6. Notes for Developers

- All colors and typography are managed via CSS variables (global.css). Avoid hardcoding hex values; use var(--token) instead.
- Custom themes for clients override the same tokens dynamically via BrandTokens.vue.
- Responsive scaling for smaller viewports is handled automatically by the Creo framework (not yet implemented in this MVP).
- Default port: 8081 (defined in vite.config.js).
- Baseline: 10px = 1rem grid.
