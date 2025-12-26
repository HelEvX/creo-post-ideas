```
CREO-POST-IDEAS/
├── .vscode/              # VS Code editor settings
├── dist/                 # Production build output directory
├── docs/                 # Project documentation and notes
├── node_modules/         # Project dependencies
│
├── public/
│   ├── brands/
│   │   ├── .starter.json # Template for new brands
│   │   ├── groomer.json  # Brand tokens for "Groomer"
│   │   └── ...           # Other brand JSON files
│   ├── highlights/
│   │   ├── groomer.svg   # Logo SVG for "Groomer"
│   │   └── ...           # Other brand SVGs
│   └── favicon.svg       # Application favicon
│
├── src/
│   ├── components/
│   │   ├── brand/
│   │   │   ├── BrandLogo.vue
│   │   │   ├── BrandPicker.vue
│   │   │   └── BrandWatermark.vue
│   │   │
│   │   ├── controls/
│   │   │   ├── BackgroundToggle.vue
│   │   │   ├── ContentTypePanel.vue
│   │   │   ├── ControlsPanel.vue
│   │   │   ├── FormatSelector.vue
│   │   │   ├── MobileSettingsAccordion.vue
│   │   │   └── RecipeShuffle.vue
│   │   │
│   │   ├── preview/
│   │   │   ├── MainPreview.vue
│   │   │   ├── MockupWrapper.vue
│   │   │   ├── MockupRenderer.vue
│   │   │   └── StyleInspectorPanel.vue
│   │   │
│   │   ├── mockup/
│   │   │   ├── PostTextBlock.vue
│   │   │   ├── PostWrapper.vue
│   │   │   ├── SafeZoneOverlay.vue
│   │   │   └── SocialPostMockup.vue
│   │   │
│   │   ├── post-types/
│   │   │   ├── FallbackPost.vue
│   │   │   ├── InfoPost.vue
│   │   │   ├── IntroPost.vue
│   │   │   ├── HeadlinePost.vue
│   │   │   ├── QuotePost.vue
│   │   │   ├── ProductPost.vue
│   │   │   └── ParagraphPost.vue
│   │   │
│   │   └── InstagramGrid.vue
│   │
│   ├── data/
│   │   └── recipes.js         # Defines the style "Recipes" (Bold, Subtle, etc.)
│   │
│   ├── utils/
│   │   └── colorBlender.js    # Generates tints and shades for color scales
│   │   └── colorLogic.js      # Ensures perceptual contrast for text on bg
│   │
│   ├── App.vue                # Main application component and layout
│   ├── main.js                # Application entry point
│   ├── index.html             # root index for Vite
│   └── ...                    # automatic files
│
├── .eslintrc.js          # ESLint configuration
├── .gitignore            # Files and folders to ignore in Git
├── babel.config.js       # Babel configuration
├── index.html            # Main HTML file for the SPA
├── jsconfig.json         # JavaScript language service configuration
├── package-lock.json     # Exact dependency versions
├── package.json          # Project metadata and dependencies
├── project-tree.md
├── README.md
└── vite.config.js        # Vite build tool configuration

-----------------------------------------

MainPreview.vue structure (flattened)

.app-main-shell
└─ .row.main-preview-row
   └─ .main-preview__content
      └─ <MockupWrapper :size>
         └─ <MockupRenderer :size>
            └─ <SocialPostMockup :size>
               └─ <PostWrapper :size>
                  ├─ background layers
                  │  ├─ plain color
                  │  ├─ pattern
                  │  ├─ large logo        (conditional)
                  │  ├─ blurry photo      (conditional)
                  │  └─ photo overlay     (only with image)
                  ├─ SafeZoneOverlay
                  ├─ post content
                  │  └─ post canvas
                  │     ├─ safe           (Important information)
                  │     │  └─ <slot />    (InfoPost, IntroPost, etc.)
                  │     └─ free           (Decorative elements)
                  │        └─ <slot />    (InfoPost, IntroPost, etc.)
                  └─ watermark

```
