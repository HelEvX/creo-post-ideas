```
CREO-POST-IDEAS/
├── .vscode/              # VS Code editor settings
├── dist/                 # Production build output directory
├── docs/                 # Project documentation and notes
├── node_modules/         # Project dependencies
├── public/
│   ├── brands/
│   │   ├── .starter.json # Template for new brands
│   │   ├── groomer.json  # Brand tokens for "Groomer"
│   │   └── ...           # Other brand JSON files
│   └── favicon.ico       # Application favicon
├── src/
│   ├── assets/
│   │   └── img/
│   │       ├── logo-default.svg
│   │       └── logo-inverse.svg
│   ├── components/
│   │   ├── BrandGallery.vue
│   │   ├── BrandLogo.vue
│   │   ├── BrandPicker.vue
│   │   ├── ContentTypePanel.vue
│   │   ├── ControlsPanel.vue  # The main left sidebar ("Recipe Hub")
│   │   ├── HelloWorld.vue     # Default Vue component (can be removed)
│   │   ├── MainPreview.vue
│   │   └── RecipeShuffle.vue
│   ├── data/
│   │   └── recipes.js         # Defines the style "Recipes" (Bold, Subtle, etc.)
│   ├── utils/
│   │   └── colorBlender.js    # Generates tints and shades for color scales
│   ├── App.vue                # Main application component and layout
│   ├── global.css             # Global styles and CSS variables
│   └── main.js                # Application entry point
├── .eslintrc.js          # ESLint configuration
├── .gitignore            # Files and folders to ignore in Git
├── babel.config.js       # Babel configuration
├── index.html            # Main HTML file for the SPA
├── jsconfig.json         # JavaScript language service configuration
├── package-lock.json     # Exact dependency versions
├── package.json          # Project metadata and dependencies
├── README.md             # This file
└── vite.config.js        # Vite build tool configuration
```
