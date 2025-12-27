// -------------------------------------------
// Color Composition Recipes
// This file defines the "recipes" or color compositions for the Recipe Shuffle feature

// Scale orientation guidelines
// Corrected for colorBlender.js orientation (0 = lightest, 10 = darkest)

// | UI Role                     | Typical Index | Notes                               |
// | --------------------------- | ------------- | ----------------------------------- |
// | Card / panel backgrounds    | 0–2           | Light end of neutral or brand color |
// | Titles & body text          | 7–10          | Dark or mid-dark tones              |
// | Accents / captions          | 4–7           | Midrange brand colors               |

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
  // 1. BALANCED
  // ======================================================
  {
    id: "balanced",
    title: "Balans",
    description: "Alle kleuren, matig contrast",
    roles: {
      // nav & footer
      "--ui-nav-bg": ["secondary", 3],
      "--ui-footer-bg": ["primary", 3],

      // base bg
      "--ui-section-bg": ["neutral", 0],
      "--ui-alt-section-bg": ["neutral", 1],

      // panels or cards
      "--ui-panel-bg": ["neutral", 1],

      // typography
      "--color-title": ["neutral", 8],
      "--color-text": ["neutral", 7],

      // brand bg
      "--ui-primary-bg": ["primary", 4],
      "--ui-secondary-bg": ["secondary", 4],

      // accent source
      "--dynamic-accent": ["primary", 6],

      // shadow strength
      "--ui-shadow-alpha": ["neutral", 5],
    },
  },
  // ======================================================
  // 2. BOLD
  // ======================================================
  {
    id: "bold",
    title: "Hevig",
    description: "Uitgesproken kleuren, meer contrast",
    roles: {
      // nav & footer
      "--ui-nav-bg": ["primaryDark", 9],
      "--ui-footer-bg": ["primaryDark", 9],

      // base bg
      "--ui-section-bg": ["neutral", 2],
      "--ui-alt-section-bg": ["primaryLight", 3],

      // panels or cards
      "--ui-panel-bg": ["neutral", 1],
      "--ui-alt-panel-bg": ["primaryDark", 8],

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
    },
  },
  // ======================================================
  // 3. SUBTLE
  // ======================================================
  {
    id: "subtle",
    title: "Subtiel",
    description: "Zachte kleuren, minder contrast",
    roles: {
      // nav & footer
      "--ui-nav-bg": ["primaryLight", 2],
      "--ui-footer-bg": ["primaryLight", 2],

      // base bg
      "--ui-section-bg": ["neutral", 0],
      "--ui-alt-section-bg": ["neutral", 1],

      // panels or cards
      "--ui-panel-bg": ["neutral", 0],
      "--ui-alt-panel-bg": ["primaryLight", 1],

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
    },
  },
  // ======================================================
  // 4. VIBRANT
  // ======================================================
  {
    id: "vibrant",
    title: "Kleurrijk",
    description: "Meer verschillende kleuren",
    roles: {
      // nav & footer
      "--ui-nav-bg": ["secondary", 7],
      "--ui-footer-bg": ["secondary", 7],

      // base bg
      "--ui-section-bg": ["neutral", 0],
      "--ui-alt-section-bg": ["secondaryLight", 3],

      // panels or cards
      "--ui-panel-bg": ["neutral", 0],
      "--ui-alt-panel-bg": ["secondary", 6],

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
    },
  },
  // ======================================================
  // 5. INVERTED
  // ======================================================
  {
    id: "inverted",
    title: "Licht uit",
    description: "Donkere achtergrond, lichte kleuren",
    roles: {
      // nav & footer
      "--ui-nav-bg": ["primary", 0],
      "--ui-footer-bg": ["primary", 0],

      // base bg
      "--ui-section-bg": ["neutral", 9],
      "--ui-alt-section-bg": ["neutral", 8],

      // panels or cards
      "--ui-panel-bg": ["neutral", 9],

      // brand bg
      "--ui-primary-bg": ["primary", 0],
      "--ui-secondary-bg": ["secondary", 0],

      // accent source
      "--dynamic-accent": ["primary", 0],

      // shadow strength
      "--ui-shadow-alpha": ["neutral", 8],

      // reverse borders
      "--color-border-medium": ["neutral", 4],
      "--color-border-light": ["neutral", 7],
    },
  },
  // ======================================================
  // 6. MINIMALIST
  // ======================================================
  {
    id: "minimalist",
    title: "Minimaal",
    description: "Zeer neutraal, weinig kleur",
    roles: {
      // nav & footer
      "--ui-nav-bg": ["neutral", 0],
      "--ui-footer-bg": ["neutral", 0],

      // base bg
      "--ui-section-bg": ["neutral", 0],
      "--ui-alt-section-bg": ["neutral", 1],

      // panels or cards
      "--ui-panel-bg": ["neutral", 0],
      "--ui-alt-panel-bg": ["neutral", 1],

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
    },
  },
];
