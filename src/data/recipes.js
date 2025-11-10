// -------------------------------------------
// CREO POST IDEAS — Color Composition Recipes
// Updated for semantic + UI role system
// This file defines the "recipes" or color compositions for the social media post mockups.
// The keys here must correspond to the --post-* CSS variables used in SocialPostMockup.vue

// A “recipe” chooses which scale and index drives each UI token.
// Index range is 0..10 (11-step scale). 0 lighter, 10 darker.
// -------------------------------------------

export const recipes = [
  {
    id: "classic-balance",
    title: "Classic Balance",
    description: "Neutral background with strong text contrast and subtle accent highlights.",
    roles: {
      "--ui-nav-bg": "var(--color-header-bg)",
      "--ui-footer-bg": "var(--color-footer-bg)",
      "--ui-hero-bg": "var(--color-bg)",

      "--ui-text": "var(--color-text)",
      "--ui-soft": "var(--color-text-soft)",
      "--ui-caption": "var(--color-subtitle)",
      "--ui-heading": "var(--color-title)",
      "--ui-heading-alt": "var(--color-title-alt)",

      "--ui-section-bg": "var(--color-background)",
      "--ui-alt-section-bg": "var(--color-surface)",

      "--ui-panel-bg": "var(--color-panel)",
      "--ui-panel-border": "var(--color-border-medium)",
      "--ui-panel-border-soft": "var(--color-border-light)",

      "--ui-alt-panel-bg": "var(--color-panel-alt)",
      "--ui-alt-panel-border": "var(--color-border-dark)",
      "--ui-color-border": "var(--color-overlay)",

      "--ui-accent": "var(--color-primary)",
      "--ui-accent-hover": "var(--color-primary-dark)",

      "--ui-link": "var(--color-primary)",
      "--ui-link-hover": "var(--color-primary-dark)",
      "--ui-link-on-dark": "var(--color-primary-light)",
      "--ui-link-on-dark-hover": "var(--color-primary-lighter)",
    },
    typography: "regular",
  },
  {
    id: "accent-forward",
    title: "Accent Forward",
    description: "Accent color takes the lead for backgrounds; inverted text for emphasis.",
    roles: {
      "--ui-nav-bg": "var(--color-header-bg)",
      "--ui-hero-bg": "var(--color-primary-bright)",
      "--ui-section-bg": "var(--color-surface)",
      "--ui-alt-section-bg": "var(--color-background)",
      "--ui-footer-bg": "var(--color-footer-bg)",
      "--ui-panel-background": "var(--color-background)",
      "--ui-text": "var(--color-text)",
      "--ui-accent": "var(--color-primary-bright)",
    },
    typography: "bold",
  },
  {
    id: "muted-minimal",
    title: "Muted Minimal",
    description: "Soft neutral surfaces and understated tones for a calm aesthetic.",
    roles: {
      "--ui-nav-bg": "var(--color-footer-bg)",
      "--ui-hero-bg": "var(--color-surface)",
      "--ui-section-bg": "var(--color-surface)",
      "--ui-alt-section-bg": "var(--color-background)",
      "--ui-footer-bg": "var(--color-footer-bg)",
      "--ui-panel-background": "var(--color-background)",
      "--ui-text": "var(--color-text)",
      "--ui-accent": "var(--color-muted)",
    },
    typography: "light",
  },
];
