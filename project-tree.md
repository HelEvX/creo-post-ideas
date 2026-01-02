```
CREO-POST-IDEAS/
├── .vscode/                  # VS Code editor settings
├── dist/                     # Production build output directory
├── docs/                     # Project documentation and notes
├── node_modules/             # Project dependencies
│
├── public/
│   ├── brands/
│   │   ├── .starter.json     # Template for new brands
│   │   ├── groomer.json      # Brand tokens for "Groomer"
│   │   └── ...               # Other brand JSON files
│   ├── highlights/
│   │   └── ...               # Small logo versions for watermarks and highlights (SVG)
│   ├── logo-bg/
│   │   └── ...               # Full logo versions - cleaned - for large logo backgrounds (SVG)
│   ├── images/               # Mockup images
│   └── favicon.svg           # Application favicon
│
├── src/
│   ├── assets/
│   │   ├── avatars/          # .webp logos for IG grid
│   │   ├── img/              # .webp bg image for mockup
│   │   ├── global.css        # global styles
│   │   └── patterns.css      # pattern designs
│   │
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
│   │   ├── InstagramGrid.vue
│   │   └── InstagramMockupTile.vue
│   │
│   ├── data/
│   │   ├── postContent.js     # Defines the main mockup content
│   │   └── recipes.js         # Defines the style "Recipes" (Bold, Subtle, etc.)
│   │
│   ├── utils/
│   │   └── colorBlender.js    # Generates tints and shades for color scales
│   │   └── colorLogic.js      # Ensures perceptual contrast for text on bg
│   │
│   ├── App.vue                # Main application component and layout
│   └── main.js                # Application entry point
│
├── .eslintrc.js           # ESLint configuration
├── .gitignore             # Files and folders to ignore in Git
├── babel.config.js        # Babel configuration
├── index.html             # root index for Vite
├── jsconfig.json          # JavaScript language service configuration
├── package-lock.json      # Exact dependency versions
├── package.json           # Project metadata and dependencies
├── project-tree.md
├── README.md
└── vite.config.js         # Vite build tool configuration

-----------------------------------------------------------------------------------

MainPreview.vue structure (flattened)

.app-main-shell                  # the preview zone for the mockup
└─ <MockupWrapper>               # displays the mockup in the selected format
   └─ <MockupRenderer>           # renders the mockup contents on selected background
      └─ <SocialPostMockup>      # contains mockup contents
         └─ <PostWrapper>        # protects mockup aspect ratios and safe margins
            ├─ background layers # conditional backgrounds
            │  ├─ plain color
            │  ├─ pattern
            │  ├─ large logo
            │  ├─ blurry photo
            │  └─ photo overlay  # only with image
            ├─ SafeZoneOverlay   # keeps important content in grid crop-safe areas
            ├─ post content
            │  └─ post canvas
            │     ├─ safe        # contents that goes inside the safe area
            │     │  └─ <slot /> # different post content designs
            │     └─ free        # decorative elements that can spill out
            │        └─ <slot /> # copy of post content designs
            └─ watermark

```
