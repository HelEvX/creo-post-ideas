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
│   └── favicon.svg       # Application favicon
│
├── src/
│   ├── components/
│   │   ├── brand/
│   │   │   ├── BrandGallery.vue
│   │   │   ├── BrandLogo.vue
│   │   │   ├── BrandPicker.vue
│   │   │   └── BrandWatermark.vue
│   │   │
│   │   ├── controls/
│   │   │   ├── ControlsPanel.vue
│   │   │   ├── ContentTypePanel.vue
│   │   │   ├── FormatSelector.vue
│   │   │   └── RecipeShuffle.vue
│   │   │
│   │   ├── preview/
│   │   │   ├── MainPreview.vue
│   │   │   ├── MockupWrapper.vue
│   │   │   └── MockupRenderer.vue        # new
│   │   │
│   │   ├── mockup/
│   │   │   ├── SocialPostMockup.vue
│   │   │   ├── PostWrapper.vue           # new
│   │   │   ├── PostHeader.vue            # new
│   │   │   ├── PostMedia.vue             # new
│   │   │   ├── PostTextBlock.vue         # new
│   │   │   └── PostFooter.vue            # new
│   │   │
│   │   └── post-types/
│   │       ├── IntroPost.vue             # new
│   │       ├── QuotePost.vue             # new
│   │       ├── ProductPost.vue           # new
│   │       └── ParagraphPost.vue         # new
│   │
│   ├── data/
│   │   └── recipes.js         # Defines the style "Recipes" (Bold, Subtle, etc.)
│   ├── external/
│   │   └── instagram-layout/
│   │       │── css/
│   │       │   ├── styles.css # inspiration for the instagram grid layout
│   │       │   └── reset.css
│   │       └── index.html
│   ├── utils/
│   │   └── colorBlender.js    # Generates tints and shades for color scales
│   ├── App.vue                # Main application component and layout
│   ├── main.js                # Application entry point
│   ├── index.html             # root index for Vite
│   └── ...                    # automatic files
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
```
