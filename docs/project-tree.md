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
│   │   │   ├── ContrastChecker.vue
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
│   │   │   ├── PostBackground.vue
│   │   │   ├── PostWatermark.vue
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
├── README.md
└── vite.config.js         # Vite build tool configuration

-----------------------------------------------------------------------------------

MainPreview.vue structure

Main shell                                # the preview zone for the mockup
└─ <MockupWrapper>                        # displays mockup in the selected format
   └─ <MockupRenderer>                    # renders contents on selected background
      └─ <SocialPostMockup>               # contains mockup contents
         └─ <PostWrapper>                 # protects aspect ratios and safe margins
            ├─ <PostBackground>           # conditional background layers
            │  ├─ plain color             # always visible underneath
            │  ├─ pattern                 # logo in pattern grid (adaptable)
            │  ├─ large logo              # semi-transparent, offset position
            │  └─ blurry photo            # semi-transparent + blurred
            │
            ├─ <SafeZoneOverlay>          # grid crop-safe areas
            │
            ├─ "post-content"             # the mockup post canvas
            │  ├─ safe                    # content safe from cropping
            │  │  └─ <slot />             # different post content designs
            │  │      └─ <PostTextBlock>  # text content editable in JS file
            │  │
            │  └─ free                    # decorative elements that can spill out
            │     └─ <slot />             # copy of post content designs
            │         └─ "post__decor"    # icons, brand graphics, shapes,...
            │
            └─ <PostWatermark>            # logo watermark in color or white

```
