// -------------------------------------------
// CREO POST IDEAS — Color Composition Recipes
// Updated for semantic + UI role system
// -------------------------------------------

export const recipes = [
  {
    id: "classic-balance",
    title: "Classic Balance",
    description: "Neutral background with strong text contrast and subtle accent highlights.",
    roles: {
      "--ui-nav-bg": "var(--color-header-bg)",
      "--ui-hero-bg": "var(--color-primary)",
      "--ui-section-bg": "var(--color-background)",
      "--ui-alt-section-bg": "var(--color-surface)",
      "--ui-footer-bg": "var(--color-footer-bg)",
      "--ui-background": "var(--color-background)",
      "--ui-text": "var(--color-text)",
      "--ui-accent": "var(--color-primary)",
    },
    typography: "regular",
    layout: "two-col",
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
      "--ui-background": "var(--color-background)",
      "--ui-text": "var(--color-text)",
      "--ui-accent": "var(--color-primary-bright)",
    },
    typography: "bold",
    layout: "full-bleed",
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
      "--ui-background": "var(--color-background)",
      "--ui-text": "var(--color-text)",
      "--ui-accent": "var(--color-muted)",
    },
    typography: "light",
    layout: "centered",
  },
];
