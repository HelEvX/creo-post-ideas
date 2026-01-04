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
    title: "Lichtgewicht",
    description: "Lichter en minder contrast",
    roles: {
      // NAV / FOOTER
      "--ui-nav-bg": ["primaryLight", 1],
      "--ui-footer-bg": ["primaryLight", 1],

      // SECTIONS
      "--ui-section-bg": ["neutral", 0],
      "--ui-alt-section-bg": ["primaryLight", 0],

      // BRAND BACKGROUNDS
      "--ui-primary-bg": ["primaryLight", 5],
      "--ui-secondary-bg": ["secondaryLight", 4],

      // PANELS
      "--ui-panel-bg": ["neutral", 0],
      "--ui-alt-panel-bg": ["neutral", 2],

      // TEXT
      "--color-title": ["neutral", 8],
      "--color-text": ["neutral", 7],

      // SHADOW (strength)
      "--shadow-alpha": [0],

      // BORDER (strength)
      "--border-alpha": [2],
    },
  },
  // ======================================================
  // 2. BOLD
  // ======================================================
  {
    id: "bold",
    title: "Uitgesproken",
    description: "Donkere kleuren, meer contrast",
    roles: {
      // NAV / FOOTER
      "--ui-nav-bg": ["primaryDark", 5],
      "--ui-footer-bg": ["primaryDark", 6],

      // SECTIONS
      "--ui-section-bg": ["neutral", 1],
      "--ui-alt-section-bg": ["primaryLight", 1],

      // BRAND BACKGROUNDS
      "--ui-primary-bg": ["primary", 7],
      "--ui-secondary-bg": ["secondary", 7],

      // PANELS
      "--ui-panel-bg": ["secondaryLight", 2],
      "--ui-alt-panel-bg": ["primaryDark", 4],

      // TEXT
      "--color-title": ["neutral", 11],
      "--color-text": ["neutral", 9],

      // SHADOW
      "--shadow-alpha": [7],

      // borders
      "--color-border-card": [6],
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
      "--ui-alt-section-bg": ["primaryDark", 0],

      // BRAND BACKGROUNDS
      "--ui-primary-bg": ["primaryDark", 2],
      "--ui-secondary-bg": ["secondaryDark", 2],

      // PANELS
      "--ui-panel-bg": ["neutral", 2],
      "--ui-alt-panel-bg": ["primaryDark", 1],

      // TEXT
      "--color-title": ["neutral", 9],
      "--color-text": ["neutral", 8],

      // SHADOW (strength)
      "--shadow-alpha": [0],

      // BORDER (strength)
      "--border-alpha": [0],
    },
  },
  // ======================================================
  // 4. VIBRANT
  // ======================================================
  {
    id: "vibrant",
    title: "Feestelijk",
    description: "Meer verschillende kleuren",
    roles: {
      // NAV / FOOTER
      "--ui-nav-bg": ["primary", 6],
      "--ui-footer-bg": ["secondary", 6],

      // SECTIONS
      "--ui-section-bg": ["neutral", 0],
      "--ui-alt-section-bg": ["primaryDark", 0],

      // BRAND BACKGROUNDS
      "--ui-primary-bg": ["primary", 6],
      "--ui-secondary-bg": ["secondary", 4],

      // PANELS
      "--ui-panel-bg": ["primaryDark", 2],
      "--ui-alt-panel-bg": ["primary", 4],

      // TEXT
      "--color-title": ["primary", 7],
      "--color-text": ["neutral", 9],

      // SHADOW (strength)
      "--shadow-alpha": [7],

      // BORDER (strength)
      "--border-alpha": [7],
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
      "--ui-primary-bg": ["primary", 3],
      "--ui-secondary-bg": ["secondary", 3],

      // PANELS
      "--ui-panel-bg": ["neutral", 0],
      "--ui-alt-panel-bg": ["neutral", 1],

      // TEXT
      "--color-title": ["neutral", 8],
      "--color-text": ["neutral", 7],

      // SHADOW (strength)
      "--shadow-alpha": [1],

      // BORDER (strength)
      "--border-alpha": [2],
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
      "--ui-secondary-bg": ["secondaryDark", 7],

      // PANELS
      "--ui-panel-bg": ["neutral", 9],
      "--ui-alt-panel-bg": ["neutral", 8],

      // TEXT
      "--color-title": ["neutral", 11],
      "--color-text": ["neutral", 9],

      // SHADOW (strength)
      "--shadow-alpha": [8],

      // BORDER (strength)
      "--border-alpha": [8],
    },
  },
];
