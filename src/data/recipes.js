// -------------------------------------------
// Color Composition Recipes
// This file defines the "recipes" or color compositions for the Recipe Shuffle feature

// Scale orientation guidelines
// Corrected for colorBlender.js orientation (0 = lightest, 10 = darkest)

// | UI Role                     | Typical Index | Notes                               |
// | --------------------------- | ------------- | ----------------------------------- |
// | Section / panel backgrounds | 0–2           | Light end of neutral or brand color |
// | Text, captions, headings    | 7–10          | Dark or mid-dark tones              |
// | Accents / links             | 4–7           | Midrange brand colors               |
// | Borders / dividers          | 3–5           | Mid neutrals                        |

// Pinning ratio guidelines
// To create a pinned exact brand default for some role in a given recipe, write a --color-* CSS variable as used in global.css

// | Recipe     | Brand-pinned ratio                  | Notes                                         |
// | ---------- | ----------------------------------- | --------------------------------------------- |
// | Balanced   | ~20% (only hero/nav/footer)         | Everything else recipe-based                  |
// | Bold       | ~10% (mostly dynamic)               | contrast-driven                               |
// | Subtle     | ~20% (header/footer brand anchored) | calm consistency                              |
// | Vibrant    | ~15%                                | more colorful but flexible                    |
// | Inverted   | ~25% (hero/footer inverted pair)    | pins needed for inverse text safety           |
// | Minimalist | ~30%                                | white/neutral base, text pinned to brand tone |

// -------------------------------------------
// Updated for semantic + UI role system (global.css)

export const recipes = [
  // ======================================================
  // 1. BALANCED — Professional, reliable default
  // ======================================================
  {
    id: "balanced",
    title: "Balanced",
    description: "Professional and reliable default.",
    roles: {
      "--color-background": ["neutral", 0], // default: white

      "--color-surface": ["neutral", 1], // default: neutral-50
      "--color-panel": ["neutral", 1], // default: neutral-200
      "--color-panel-alt": ["neutral", 2], // default: neutral-700

      "--color-title": ["neutral", 8], // default: branded
      "--color-text": ["neutral", 7], // default: branded
      "--color-text-soft": ["neutral", 5], // default: branded

      "--color-title-alt": ["tertiary", 5], // default: color-tertiary
      "--color-caption": ["primary", 6], // default: color-primary-dark
      "--color-caption-inverse": ["primary", 4], // default: color-primary-lighter
      "--color-caption-alt": ["tertiary", 6], // default: color-tertiary

      "--ui-primary-bg": ["primary", 2], // default: color-primary
      "--ui-secondary-bg": ["secondary", 2], // default: color-secondary
      "--ui-accent-on-primary": ["primary", 8], // default: color-secondary
      "--ui-accent-on-secondary": ["secondary", 8], // default: color-primary

      // schadows -- only change alpha value?
      "--black-25": "rgba(0,0,0,0.05)",
      "--black-50": "rgba(0,0,0,0.15)",
      "--black-75": "rgba(0,0,0,0.30)",

      // opacity
      "--opacity-panel": ["0.6"], // default: 1
      "--opacity-alt-panel": ["0.6"], // default: 1
    },
  },
  // ======================================================
  // 2. BOLD — High contrast, confident, energetic
  // ======================================================
  {
    id: "bold",
    title: "Bold",
    description: "High contrast, confident, and energetic.",
    roles: {
      "--ui-nav-bg": ["primaryDark", 9],
      "--ui-footer-bg": ["primaryDark", 9],

      "--ui-section-bg": ["neutral", 2],
      "--ui-alt-section-bg": ["primaryLight", 3],

      "--ui-panel-bg": ["neutral", 1],
      "--ui-panel-border": ["primary", 6],
      "--ui-panel-border-soft": ["neutral", 2],

      "--ui-alt-panel-bg": ["primaryDark", 8],
      "--ui-alt-panel-border": ["primaryDark", 7],

      "--ui-accent": ["secondaryDark", 8],
      "--ui-accent-hover": ["secondaryDark", 9],
      "--ui-accent-active": ["secondaryDark", 10],

      "--ui-link": ["secondaryDark", 8],
      "--ui-link-hover": ["secondaryDark", 9],
      "--ui-link-on-dark": ["secondaryLight", 4],
      "--ui-link-on-dark-hover": ["secondaryLight", 3],

      "--ui-heading": ["primaryLight", 0],
      "--ui-heading-alt": ["secondary", 8],
      "--ui-caption": ["neutral", 7],

      "--ui-shadow": "rgba(0,0,0,0.18)",

      "--ig-tile-bg": ["primary", 1],
      "--ig-tile-fg": ["primary", 7],
    },
  },
  // ======================================================
  // 3. SUBTLE — Soft, calm, and approachable
  // ======================================================
  {
    id: "subtle",
    title: "Subtle",
    description: "Soft, calm, and friendly.",
    roles: {
      "--ui-nav-bg": ["primaryLight", 2],
      "--ui-footer-bg": ["primaryLight", 2],

      "--ui-section-bg": ["neutral", 0],
      "--ui-alt-section-bg": ["neutral", 1],

      "--ui-panel-bg": ["neutral", 0],
      "--ui-panel-border": ["neutral", 2],
      "--ui-panel-border-soft": ["neutral", 1],

      "--ui-alt-panel-bg": ["primaryLight", 1],
      "--ui-alt-panel-border": ["primaryLight", 2],

      "--ui-accent": ["secondaryLight", 3],
      "--ui-accent-hover": ["secondaryLight", 4],
      "--ui-accent-active": ["secondaryLight", 5],

      "--ui-link": ["primaryLight", 3],
      "--ui-link-hover": ["primaryLight", 4],
      "--ui-link-on-dark": ["primary", 2],
      "--ui-link-on-dark-hover": ["primary", 3],

      "--ui-heading": ["primary", 6],
      "--ui-heading-alt": ["primary", 7],
      "--ui-caption": ["neutral", 6],

      "--ui-shadow": "rgba(0,0,0,0.05)",

      "--ig-tile-bg": ["primary", 1],
      "--ig-tile-fg": ["primary", 7],
    },
  },
  // ======================================================
  // 4. VIBRANT — Colorful, optimistic, and engaging
  // ======================================================
  {
    id: "vibrant",
    title: "Vibrant",
    description: "Colorful, optimistic, expressive.",
    roles: {
      "--ui-nav-bg": ["secondary", 7],
      "--ui-footer-bg": ["secondary", 7],

      "--ui-section-bg": ["neutral", 0],
      "--ui-alt-section-bg": ["secondaryLight", 3],

      "--ui-panel-bg": ["neutral", 0],
      "--ui-panel-border": ["secondary", 5],
      "--ui-panel-border-soft": ["secondaryLight", 2],

      "--ui-alt-panel-bg": ["secondary", 6],
      "--ui-alt-panel-border": ["secondary", 5],

      "--ui-accent": ["primary", 6],
      "--ui-accent-hover": ["primary", 7],
      "--ui-accent-active": ["primary", 8],

      "--ui-link": ["primary", 6],
      "--ui-link-hover": ["primary", 7],
      "--ui-link-on-dark": ["primaryLight", 3],
      "--ui-link-on-dark-hover": ["primaryLight", 2],

      "--ui-heading": ["primary", 7],
      "--ui-heading-alt": ["secondary", 8],
      "--ui-caption": ["neutral", 7],

      "--ui-shadow": "rgba(0,0,0,0.12)",

      "--ig-tile-bg": ["primary", 1],
      "--ig-tile-fg": ["primary", 7],
    },
  },
  // ======================================================
  // 5. INVERTED — Modern, premium, and dramatic
  // ======================================================
  {
    id: "inverted",
    title: "Inverted",
    description: "Modern, dramatic, high-impact.",
    roles: {
      "--ui-nav-bg": ["neutral", 10],
      "--ui-footer-bg": ["neutral", 10],

      "--ui-section-bg": ["neutral", 9],
      "--ui-alt-section-bg": ["neutral", 8],

      "--ui-panel-bg": ["neutral", 9],
      "--ui-panel-border": ["neutral", 7],
      "--ui-panel-border-soft": ["neutral", 8],

      "--ui-alt-panel-bg": ["neutral", 8],
      "--ui-alt-panel-border": ["neutral", 7],

      "--ui-accent": ["primaryLight", 3],
      "--ui-accent-hover": ["primaryLight", 4],
      "--ui-accent-active": ["primaryLight", 5],

      "--ui-link": ["secondaryLight", 3],
      "--ui-link-hover": ["secondaryLight", 2],
      "--ui-link-on-dark": ["primaryLight", 3],
      "--ui-link-on-dark-hover": ["primaryLight", 2],

      "--ui-heading": ["primaryLight", 0],
      "--ui-heading-alt": ["secondaryLight", 2],
      "--ui-caption": ["neutral", 2],

      "--ui-shadow": "rgba(0,0,0,0.30)",

      "--ig-tile-bg": ["primary", 1],
      "--ig-tile-fg": ["primary", 7],
    },
  },
  // ======================================================
  // 6. MINIMALIST — Elegant, calm, and confident
  // ======================================================
  {
    id: "minimalist",
    title: "Minimalist",
    description: "Clean, airy, elegant, lots of space.",
    roles: {
      "--ui-nav-bg": ["neutral", 0],
      "--ui-footer-bg": ["neutral", 0],

      "--ui-section-bg": ["neutral", 0],
      "--ui-alt-section-bg": ["neutral", 1],

      "--ui-panel-bg": ["neutral", 0],
      "--ui-panel-border": ["neutral", 2],
      "--ui-panel-border-soft": ["neutral", 1],

      "--ui-alt-panel-bg": ["neutral", 1],
      "--ui-alt-panel-border": ["neutral", 2],

      "--ui-accent": ["primary", 5],
      "--ui-accent-hover": ["primary", 6],
      "--ui-accent-active": ["primary", 7],

      "--ui-link": ["primary", 5],
      "--ui-link-hover": ["primary", 6],
      "--ui-link-on-dark": ["primary", 2],
      "--ui-link-on-dark-hover": ["primary", 3],

      "--ui-heading": ["neutral", 9],
      "--ui-heading-alt": ["neutral", 8],
      "--ui-caption": ["neutral", 7],

      "--ui-shadow": "rgba(0,0,0,0.04)",

      "--ig-tile-bg": ["primary", 1],
      "--ig-tile-fg": ["primary", 7],
    },
  },
];
