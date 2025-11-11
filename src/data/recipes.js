// -------------------------------------------
// CREO POST IDEAS — Color Composition Recipes
// Updated for semantic + UI role system
// This file defines the "recipes" or color compositions for the social media post mockups.
// The keys here must correspond to the --post-* CSS variables used in SocialPostMockup.vue

// A “recipe” chooses which scale and index drives each UI token.
// Index range is 0..10 (11-step scale). 0 lighter, 10 darker.
// To create a pinned exact brand default for some role in a given recipe, write a variable such as "var(--color-panel)"
// -------------------------------------------

export const recipes = [
  {
    id: "balanced",
    title: "Balanced",
    description: "Neutral background, readable body, brand-tinted accents.",
    roles: {
      "--ui-section-bg": ["neutral", 1],
      "--ui-alt-section-bg": ["neutral", 0],
      "--ui-panel-bg": ["neutral", 2],

      "--ui-text": ["neutral", 9],
      "--ui-soft": ["neutral", 6],
      "--ui-caption": ["neutral", 7],
      "--ui-heading": ["neutral", 9],
      "--ui-heading-alt": ["neutral", 10],

      "--ui-accent": ["primary", 7],
      "--ui-accent-hover": ["primaryDark", 7],
      "--ui-link": ["primary", 7],
      "--ui-link-hover": ["primaryDark", 8],
      "--ui-link-on-dark": ["primaryLight", 5],
      "--ui-link-on-dark-hover": ["primaryLight", 6],

      "--ui-nav-bg": ["neutral", 2],
      "--ui-hero-bg": ["neutral", 3],
      "--ui-footer-bg": ["neutral", 4],

      "--ui-panel-border": ["neutral", 4],
      "--ui-panel-border-soft": ["neutral", 3],
      "--ui-alt-panel-bg": ["neutral", 9],
      "--ui-alt-panel-border": ["neutral", 7],
      "--ui-color-border": ["neutral", 5],
    },
    fontStyle: { "--font-weight-title": "600", "--font-weight-body": "400" },
  },

  {
    id: "bold",
    title: "Bold",
    description: "High contrast, strong brand accents.",
    roles: {
      "--ui-section-bg": ["neutral", 0],
      "--ui-alt-section-bg": ["neutral", 10],
      "--ui-panel-bg": ["neutral", 1],

      "--ui-text": ["neutral", 10],
      "--ui-soft": ["neutral", 7],
      "--ui-caption": ["neutral", 8],
      "--ui-heading": ["neutral", 10],
      "--ui-heading-alt": ["neutral", 10],

      "--ui-accent": ["secondary", 8],
      "--ui-accent-hover": ["secondaryDark", 8],
      "--ui-link": ["primary", 8],
      "--ui-link-hover": ["primaryDark", 9],
      "--ui-link-on-dark": ["primaryLight", 6],
      "--ui-link-on-dark-hover": ["primaryLight", 7],

      "--ui-nav-bg": ["neutral", 10],
      "--ui-hero-bg": ["primaryDark", 9],
      "--ui-footer-bg": ["neutral", 10],

      "--ui-panel-border": ["neutral", 4],
      "--ui-panel-border-soft": ["neutral", 3],
      "--ui-alt-panel-bg": ["primaryDark", 9],
      "--ui-alt-panel-border": ["neutral", 6],
      "--ui-color-border": ["neutral", 5],
    },
    fontStyle: { "--font-weight-title": "700", "--font-weight-body": "500" },
  },

  {
    id: "subtle",
    title: "Subtle",
    description: "Soft contrasts, gentle accents.",
    roles: {
      "--ui-section-bg": ["neutral", 1],
      "--ui-alt-section-bg": ["neutral", 2],
      "--ui-panel-bg": ["neutral", 0],

      "--ui-text": ["neutral", 8],
      "--ui-soft": ["neutral", 6],
      "--ui-caption": ["neutral", 5],
      "--ui-heading": ["neutral", 8],
      "--ui-heading-alt": ["neutral", 9],

      "--ui-accent": ["primaryLight", 6],
      "--ui-accent-hover": ["primary", 6],
      "--ui-link": ["secondaryLight", 6],
      "--ui-link-hover": ["secondary", 6],
      "--ui-link-on-dark": ["primaryLight", 5],
      "--ui-link-on-dark-hover": ["primaryLight", 6],

      "--ui-nav-bg": ["neutral", 10],
      "--ui-hero-bg": ["neutral", 10],
      "--ui-footer-bg": ["neutral", 10],

      "--ui-panel-border": ["neutral", 3],
      "--ui-panel-border-soft": ["neutral", 2],
      "--ui-alt-panel-bg": ["neutral", 9],
      "--ui-alt-panel-border": ["neutral", 7],
      "--ui-color-border": ["neutral", 4],
    },
    fontStyle: { "--font-weight-title": "500", "--font-weight-body": "400" },
  },
];
