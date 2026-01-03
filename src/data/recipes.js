// -------------------------------------------
// Color Recipes – Quick Cheat Sheet
//
// Scale orientation (colorBlender.js):
// 0 = lightest, 5 = brand anchor, 10 = darkest
//
// General guidance:
// - Sections        → 0–1
// - Panels / cards  → 1–3
// - Brand surfaces  → 3–7
// - Accents         → 4–7
// - Body text       → 7–9
// - Titles          → 8–10
// - Dark mode bases → 8–10
//
// Use [scale, index] for dynamic behavior.
// Use CSS vars (e.g. var(--ui-nav-bg)) only to pin exact brand defaults.
// -------------------------------------------

export const recipes = [
  // ======================================================
  // 1. BALANCED
  // ======================================================
  {
    id: "balanced",
    title: "Balans",
    description: "Alle kleuren, matig contrast",
    roles: {
      // NAV / FOOTER
      "--ui-nav-bg": "var(--ui-nav-bg)",
      "--ui-footer-bg": "var(--ui-footer-bg)",

      // SECTIONS
      "--ui-section-bg": ["neutral", 0],
      "--ui-alt-section-bg": ["neutral", 1],

      // BRAND BACKGROUNDS
      "--ui-primary-bg": ["primary", 3],
      "--ui-secondary-bg": ["secondary", 3],

      // PANELS
      "--ui-panel-bg": ["neutral", 2],
      "--ui-alt-panel-bg": ["primaryDark", 5],

      // TEXT
      "--color-title": ["neutral", 10],
      "--color-text": ["neutral", 9],

      // SHADOW
      "--ui-shadow-alpha": ["neutral", 2],

      // borders
      "--color-border-card": ["neutral", 4],
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
      // NAV / FOOTER
      "--ui-nav-bg": ["primary", 7],
      "--ui-footer-bg": ["neutral", 9],

      // SECTIONS
      "--ui-section-bg": ["neutral", 0],
      "--ui-alt-section-bg": ["neutral", 2],

      // BRAND BACKGROUNDS
      "--ui-primary-bg": ["primary", 7],
      "--ui-secondary-bg": ["secondary", 7],

      // PANELS
      "--ui-panel-bg": ["neutral", 3],
      "--ui-alt-panel-bg": ["primaryDark", 7],

      // TERTIARY
      "--color-tertiary": ["secondary", 6],

      // TEXT
      "--color-title": ["neutral", 10],
      "--color-text": ["neutral", 8],

      // SHADOW
      "--ui-shadow-alpha": ["neutral", 4],

      // borders
      "--color-border-medium": ["neutral", 6],
      "--color-border-light": ["neutral", 4],
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
      // NAV / FOOTER
      "--ui-nav-bg": ["neutral", 1],
      "--ui-footer-bg": ["neutral", 2],

      // SECTIONS
      "--ui-section-bg": ["neutral", 0],
      "--ui-alt-section-bg": ["neutral", 1],

      // BRAND BACKGROUNDS
      "--ui-primary-bg": ["primaryLight", 2],
      "--ui-secondary-bg": ["secondaryLight", 2],

      // PANELS
      "--ui-panel-bg": ["neutral", 2],
      "--ui-alt-panel-bg": ["neutral", 3],

      // TERTIARY
      "--color-tertiary": ["primaryLight", 2],

      // TEXT
      "--color-title": ["neutral", 9],
      "--color-text": ["neutral", 8],

      // SHADOW
      "--ui-shadow-alpha": ["neutral", 2],

      // borders
      "--color-border-medium": ["neutral", 4],
      "--color-border-light": ["neutral", 3],
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
      // NAV / FOOTER
      "--ui-nav-bg": ["primary", 6],
      "--ui-footer-bg": ["secondary", 6],

      // SECTIONS
      "--ui-section-bg": ["neutral", 0],
      "--ui-alt-section-bg": ["primary", 0],

      // BRAND BACKGROUNDS
      "--ui-primary-bg": ["primary", 6],
      "--ui-secondary-bg": ["secondary", 6],

      // PANELS
      "--ui-panel-bg": ["primary", 2],
      "--ui-alt-panel-bg": ["primary", 7],

      // TERTIARY
      "--color-tertiary": ["tertiary", 6],

      // TEXT
      "--color-title": ["primary", 7],
      "--color-text": ["neutral", 9],

      // SHADOW
      "--ui-shadow-alpha": ["neutral", 4],

      // borders
      "--color-border-medium": ["primaryDark", 5],
      "--color-border-light": ["primaryLight", 6],
    },
  },

  // ======================================================
  // 5. MINIMALIST
  // ======================================================
  {
    id: "minimalist",
    title: "Minimaal",
    description: "Zeer neutraal, weinig kleur",
    roles: {
      // NAV / FOOTER
      "--ui-nav-bg": ["neutral", 0],
      "--ui-footer-bg": ["neutral", 1],

      // SECTIONS
      "--ui-section-bg": ["neutral", 0],
      "--ui-alt-section-bg": ["neutral", 1],

      // BRAND BACKGROUNDS
      "--ui-primary-bg": ["primaryLight", 1],
      "--ui-secondary-bg": ["secondaryLight", 1],

      // PANELS
      "--ui-panel-bg": ["neutral", 2],
      "--ui-alt-panel-bg": ["neutral", 3],

      // TERTIARY
      "--color-tertiary": ["neutral", 2],

      // TEXT
      "--color-title": ["neutral", 8],
      "--color-text": ["neutral", 7],

      // SHADOW
      "--ui-shadow-alpha": ["neutral", 1],

      // borders
      "--color-border-medium": ["neutral", 2],
      "--color-border-light": ["neutral", 1],
    },
  },

  // ======================================================
  // 6. INVERTED
  // ======================================================
  {
    id: "inverted",
    title: "Licht uit",
    description: "Donkere achtergrond, lichte kleuren",
    roles: {
      // NAV / FOOTER
      "--ui-nav-bg": ["neutral", 10],
      "--ui-footer-bg": ["neutral", 9],

      // SECTIONS
      "--ui-section-bg": ["neutral", 9],
      "--ui-alt-section-bg": ["neutral", 8],

      // BRAND BACKGROUNDS
      "--ui-primary-bg": ["primaryLight", 3],
      "--ui-secondary-bg": ["secondaryLight", 3],

      // PANELS
      "--ui-panel-bg": ["neutral", 8],
      "--ui-alt-panel-bg": ["primaryLight", 4],

      // TERTIARY
      "--color-tertiary": ["secondaryLight", 4],

      // TEXT: AUTOMATIC

      // SHADOW
      "--ui-shadow-alpha": ["neutral", 1],

      // reverse borders
      "--color-border-medium": ["neutral", 4],
      "--color-border-light": ["neutral", 7],
    },
  },
];
