// -------------------------------------------
// CREO POST IDEAS — Color Composition Recipes
// These do NOT define new colors.
// They only remap existing palette tokens
// to different visual roles (background, text, accent).
// -------------------------------------------

export const recipes = [
  {
    id: "classic-balance",
    title: "Classic Balance",
    description:
      "Neutral background with strong text contrast and subtle accent highlights.",
    roles: {
      "nav-bg": "var(--secondary-400)",
      "hero-bg": "var(--primary-300)",
      "section-bg": "var(--neutral-100)",
      "alt-section-bg": "var(--secondary-300)",
      "footer-bg": "var(--secondary-400)",
      background: "var(--color-background)",
      text: "var(--color-text)",
      accent: "var(--color-primary)",
    },
    typography: "regular",
    layout: "two-col",
  },
  {
    id: "accent-forward",
    title: "Accent Forward",
    description:
      "Accent color takes the lead for backgrounds; inverted text for emphasis.",
    roles: {
      "nav-bg": "var(--secondary-400)",
      "hero-bg": "var(--primary-300)",
      "section-bg": "var(--neutral-100)",
      "alt-section-bg": "var(--secondary-300)",
      "footer-bg": "var(--secondary-400)",
      background: "var(--color-background)",
      text: "var(--color-text)",
      accent: "var(--color-primary)",
    },
    typography: "bold",
    layout: "full-bleed",
  },
  {
    id: "muted-minimal",
    title: "Muted Minimal",
    description:
      "Soft neutral surfaces and understated tones for a calm aesthetic.",
    roles: {
      "nav-bg": "var(--secondary-400)",
      "hero-bg": "var(--primary-300)",
      "section-bg": "var(--neutral-100)",
      "alt-section-bg": "var(--secondary-300)",
      "footer-bg": "var(--secondary-400)",
      background: "var(--color-background)",
      text: "var(--color-text)",
      accent: "var(--color-primary)",
    },
    typography: "light",
    layout: "centered",
  },
];
