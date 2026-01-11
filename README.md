# Voorbeeld-ig: Your Brand's Social Style Visualizer

<p>
  <img src="src/assets/img/logo-default-full.svg" width="400" />
</p>

Thank you for checking out Voorbeeld-ig!

Voorbeeld-ig is a brand visualization tool developed as a value-add for [Creo Websolutions](https://www.creowebsolutions.be/) clients, in particular the solopreneur or small business owner subset. This application addresses knowledge gaps about available brand assets when DIY-designing for social media, through a "pre-editing guidance" experience. It allows them to visualize how the color scheme, fonts, corners, borders and shadows from their landing page can be applied in an Instagram post, by showing various combinations in a dynamic canvas.

This is my final Associate's degree project as a Digital Design student at PXL Hogeschool, Hasselt. The one-page app includes a feedback form at the bottom, feel free to shoot me a message.

<!-- ### What's the intent of this document?

- a high-level explanations of the tool's component structure and core features
- a deep-dive into its information architecture and UX-flow
- a summary of the creator's mission statement and design process
- a developer quick-start guide for onboarding new brands quickly and correctly

--- -->

## At a glance

The [Master version](https://voorbeeld-ig.netlify.app/) of this tool includes a dropdown list of clients. Per default, no brand is selected and the mockup preview canvas shows an empty state (grayed-out logo), while the left-hand sidebar simply remains empty. Selecting a client causes the user interface to 'repaint' as shown below.

Demonstration of brand-specific visual updates and interface repaint behavior.

![Brand-specific visual updates and interface repaint](docs/media/brand-repaint.gif)

Client-specific links have a query string (/?brand=client-name) and these pages do not show the dropdown or the empty state. However, UI-repaints still happen when the user browses the various themes within their own brand color palette and corrects text/background pairs with low contrast scores. This is intentional, but alternatively the repaint could be confined to just the mockup by adjusting which CSS variables get triggered.

Demonstration of features for one single brand including canvas navigation, theme repaints and contrast corrections.

![Dashboard demo with control panel actions and dynamic mockup interactions](docs/media/walkthrough.gif)

## Core Philosophy & Features

**Voorbeeld-ig** is built on a robust Vue 3 architecture that is easy to maintain and expand with new formats, recipes, or features.

This tool is a **strategic guidance system**, not a graphic editor. It empowers non-technical users to make confident, on-brand design decisions _before_ they open an editor like Canva. Themes - also called 'recipes' - are predefined in a simple script file and can be easily tweaked. Users can cycle through them with chevron-buttons and there is no technical limit to the number of 'recipes' that can be added, although aesthetically only a number of themes make any practical sense.

In this fist proof-of-concept, 7 themes (the brand default that mimics the website + 6 adaptations or 'moods') have been implemented. Each shows 12 text/background pairs, presented in the mockup in the main canvas. There, a second side-panel allows toggling tones (primary & secondary) and switching to neutral. Together with the option to fix sub-par contrasts per pair, the tool essentially offers hundreds of guaranteed brand-aligned style choices. Even if only a small percentage of combinations appeal to the client, they still have dozens to choose from. Crucially, they can be confident about good readability and effective brand recognition.

To address common cropping issues from post design to grid display, the canvas offers four established Instagram post formats with a safe-zone overlay that can be turned on or off. These 'live' mockups, that immediately adapt to background choices as well as content options, have been constructed in such a way that important text never exceeds the safe margins. Decorative elements however can freely fill up the background, and remind the user that their brand assets can be applied in all sorts of interesting ways. The user can even check this in the section below the canvas. There, the 6 post designs that showcase the text/background combinations and various background treatments (such as patterns and images) are displayed side-by-side in a 'realistic' grid-mockup, 'painted' of course in the active theme.

The color contrast evaluations are mathematical and based on WCAG ratios, but translated into approachable language for a non-technical audience. To ensure UI titles and text have good contrast by default, the system automatically applies text inversion for dark backgrounds.

---

## The Color Recipes

Recipes do not introduce new colors. Instead, they remap existing brand-specific and neutral color scales onto semantic UI roles. A set of scripts prescribe and apply tone and tint blends to reinterpret each default brand palette into different visual moods, without redefining or duplicating brand tokens.

### Semantic Role Mapping

Recipes assign colors exclusively through semantic CSS roles, such as:

- structural backgrounds (`--ui-section-bg`)
- brand surfaces (`--ui-primary-bg`)
- typography (`--color-title`)
- accents (`--color-secondary-dark`)
- depth cues (`--shadow-alpha`)
- border strength (`--border-alpha`)

Brand-defined borders and shadows apply only inside the mockup; UI borders and shadows are never affected by brands or recipes. This is to prevent distortion of dashboard elements and ensures consistency, scalability, and safe extension of the UI.

### Perceptual Color Scales

Each brand color (primary, secondary, tertiary) and the neutral palette is expanded into an 11-step perceptual scale:

- `0` = lightest usable tone
- `5` = original brand anchor
- `10` = darkest usable tone

Scales are generated to preserve hue while asymmetrically modulating lightness and saturation around a fixed anchor, constraining tones to usable bounds. The perceptual shaping comes from asymmetric lightness and saturation curves, rather than uniform step distances. This is a stylistic choice motivated by the observation that washed-out lights, while a decent choice for website section backgrounds, aren't as relevant for brand expression. Likewise, darks are often visually more pleasant when muted. On a HSV color picker 'square', the dot will move towards bottom left or top right in this system.

### Pinning vs Dynamic Behavior

Most roles are assigned dynamically using `[scale, index]` pairs, where index is the numerical value described above.

Brand colors, i.e. a main (primary) and a supporting (secondary) tone, are always defined in the agency's own framework on a 5-step scale although the outer values (`*-lighter`, `*-darker`) are not always used. Each scale centers around the same hue, defining the 'color' as commonly understood (blue, orange). String values that correspond with the source variables (e.g. primaryDark for $primary-dark) prescribe from which scale a color will be picked to paint a text or background in a recipe. That way, we can decide that a neutral light surface in one recipe can turn into a mid-tone primary in another.

Exact brand defaults can be pinned using CSS variables or provided directly by brand tokens. Pinning keeps a value at its base default and prevents it begin remapped (mixed with gray) when a recipe is active.

For example, a recipe might change a semantic color role into a color one step lighter than the defined `primary-dark` default:

`"--ui-primary-bg": ["primaryDark", 4],`

We can pin this variable to the --`primary-dark` default like this:

`"--ui-primary-bg": "var(--color-primary-dark)" `

In the current version pinning is not used because the index 5 already makes sure the brand color stays at default.

### Recipe Intent

Each recipe expresses a different design intent:

- **Balanced** – conservative, brand-faithful, moderate contrast (translated: Lichtjes)
- **Bold** – strong hierarchy and contrast, limited color expansion (translated: Heviger)
- **Subtle** – softer contrast, calm continuity (translated: Subtiel)
- **Vibrant** – expressive use of brand colors (translated: Feestelijk)
- **Minimalist** – neutral-first, minimal color presence (translated: Minimaal)
- **Inverted** – dark canvas with soft, light surfaces (translated: Licht uit)

Because any color can be the default primary color for a brand, it's unavoidable that each brand has at least one ill-fitting recipe. Because of a broadly applicable setup, the system is in fact trying to generalise something that's impossible to generalise. However, because so many options are available, this doesn't have to devaluate the concept. Paying attention to design best-practices (or simply common sense and good judgement) will always remain important.

---

## Dynamic Text, Surface Resolution, and Contrast Safety

**Core rule: text color is never chosen by brand color but always by background polarity.** This project does **not** use static light or dark themes and does **not** assume anything about brand colors. This is because the system must work for any brand color, which can be anything from deep blue to pastel yellow. Readability is purely a contrast issue and can be calculated that way.

UI text colors are resolved **at runtime**, based on the actual background they appear on. The reason is simple: designers should be able to freely change recipes and tones, while the system guarantees readable contrast and predictable behavior.

Contrast evaluation with automatic inversion is implemented for UI text, ensuring readability at all times. This is defined in a **dynamic** text content layer inside `App.vue` and applies to header, footer and sections. On light backgrounds, the brand-specific title and text colors are applied. On dark backgrounds both are rendered white (`#ffffff`). Soft text has an opacity but follows the same rule.

A similar logic is applied on brand-colored surfaces. The variables `--ui-primary-bg` and `--ui-secondary-bg` are evaluated to determine whether they're dark or light, so that text color can be inverted when appropriate. They're used for button fills, but also for the overall mockup background.

### The Three Layers

#### 1. JSON Brand Tokens (Design-time)

Brand tokens describe identity, not behavior. They are already used in a client's website so do not need to be re-invented. There is no logic or contrast decision-making here. Inverted 'white' text is **not** defined. There are no websites in the agency's backlog that use inverted text colors other than `#ffffff`.

- Define brand identity (`color-primary`, `color-secondary`, neutrals, etc.)
- Define `color-title` and `color-text` **for light backgrounds only**, soft-text is derived by applying an opacity value.

#### 2. Surface-Resolved Text Roles (Runtime)

This layer guarantees that the UI remains readable across all brands and modes. It's handled globally in `App.vue -> updateDynamicTextRoles()`.

Each UI surface gets a `${surfaceKey} `:

```
      const surfaces = [
        ["nav", "--ui-nav-bg"],
        ["footer", "--ui-footer-bg"],
        ["section", "--ui-section-bg"],
        ["alt-section", "--ui-alt-section-bg"],
        ["panel", "--ui-panel-bg"],
        ["alt-panel", "--ui-alt-panel-bg"],
        ["primary", "--ui-primary-bg"],
        ["secondary", "--ui-secondary-bg"],
        ["accent", "--ui-accent-bg"],
      ];
```

For each, the system:

1. Reads the **computed background**
2. Detects whether it's light or dark
3. Writes surface-specific roles:

`--text-on-*`\
`--title-on-*`\
`--soft-on-*`\
`--disabled-on-*`\
`--faint-on-*`\
`--caption-on-*`\
`--caption-pri-on-*`\
`--caption-sec-on-*`\
`--overlay-on-*`

These variables are **derived outputs** and must never be hardcoded or set by recipes.

#### 3. Dynamic Routing (Content Layer)

Content never decides contrast. It only consumes resolved roles.

Generic content variables route text to the correct surface:

`--dynamic-text`\
`--dynamic-title`\
`--dynamic-soft`\
`--dynamic-faint`\
`--dynamic-disabled`\
`--dynamic-footer`\
`--dynamic-nav`

These variables only consume resolved roles. Whenever dynamic roles are used, provided the surface key matches the variable assigned to the background selector, the contrast will be correct. For example, the hero section subtitle gets the brand-defined text color (at 75% opacity) because in `global.css` we define, in cascading order:

```
/* dark-on-light text colors */
--black-75: rgba(0, 0, 0, 0.75);
--color-soft: var(--black-75);
--ui-soft-on-light: var(--color-soft);

/* inverted text colors */
--white-85: rgba(255, 255, 255, 0.85);
--color-soft-inverse: var(--white-85);
--ui-soft-on-dark: var(--color-soft-inverse);

/* the dynamic variable */
--dynamic-soft: var(--ui-soft-on-light);
```

And in `App.vue` we declare these scoped styles:

```
.hero {
  background: var(--ui-section-bg);
}

p.hero-subtitle {
  color: var(--dynamic-soft);
}
```

for which we define these constants in `updateDynamicTextRoles`:

```
const softDark = getVar("--color-soft");
const softLight = getVar("--color-soft-inverse");
```

making it possible to invert when necessary:

```
if (mode === "dark") {
    root.style.setProperty(`--soft-on-${surfaceKey}`, softDark);

} else {
    root.style.setProperty(`--soft-on-${surfaceKey}`, softLight);
}
```

### Mockup Overrides

Inside the social post preview, `SocialPostMockup.vue` introduces a **local override layer**.

#### Dynamic text on mockup backgrounds

Dynamic text roles (`--dynamic-*`) respond to the overall mockup background, which is controlled with a tone toggle (primary|secondary) and a checkbox (color|neutral). The dark/light switching behavior is the same as for the `section` key.

#### Other text

The accent block in the mockup design takes the opposite background from the tone toggle but follows the same rule: dark on light, white on dark (with opacity each time).

The two other surfaces, called 'panel' and 'alt-panel', can be any color (as defined in the JSON file) and are independent from the tone toggle.

A dynamic variable is not defined in `App.vue` for these combinations because they're scoped to the mockup (`.post-content`). The surface key must be specified in `const mockupVars`:

```
"--caption-pri-on-alt-panel": "",
"--caption-sec-on-panel": "",
"--caption-on-accent": "",
```

The caption is set to primary for the card on the left and secondary for the one on the right in the `InfoPost.vue` component, but this is arbitrary and can be swapped, changed or overridden in other post designs.

The isolation of mockup-only surface resolutions from global UI logic is intentional. This setup allows the contrast checker to evaluate and fix **exactly what is rendered**, without affecting the UI or brand tokens. Without this isolation, fix actions were unreliable and often even ignored.

### Contrast Checker

The contrast checker validates **rendered reality**, not tokens. It:

- reads computed colors from the DOM
- scores contrast per rendered surface
- applies incremental fixes when the user triggers this

Contrast fixes:

- may adjust either background or foreground roles when doing so improves contrast
- do not alter brand tokens
- can overwrite UI role variables at :root (e.g. `--ui-primary-bg`), which affects the full UI

UI structure stays stable by design. Brand-specific decoration tokens (shadow and borders) are isolated to the mockup only to prevent button distortion, whereas surface tokens are allowed to change to create a distinct 'color-wash' experience. This feature was inspired by color palette generator tools, widely available online.

#### Text/Background Pairs

There are 12 text/background pairs listed. Each show title, text and caption color against a different surface:

- Rows 1-3: the mockup background
- Rows 4-6 and 7-9: the left and right mockup 'cards', respectively
- Rows 10-12: the accent block ('opposite' toggle color)

The 'dynamic system' does not evaluate contrast for mockup card captions. For many brands, the labels for rows 4 and 7 will therefore read 'fail' straight away.

#### Fixing Recipes

A fix button is integrated directly into the contrast checker. If a color combination fails accessibility standards, the user can trigger an incremental repair step. The system evaluates whether adjusting the background or the foreground improves contrast most and applies the better option. This behavior is consistent across all surfaces and text roles.

Some brands have a 'difficult' color palette, even though their website frontend has been carefully designed by the agency. The brand default might already label certain pairs as a 'fail'. But most often, bad contrasts only start occurring in the recipes. In any case, contrasts can always be fixed even though the resulting colors may not be as aesthetically pleasing.

Because backgrounds have more than one text element, one fix will affect more than one pair. The choice whether or not to correct, or which pair to favor, is up to the user and depends on the post design they're looking at.

### Button Hover and Active States

Buttons get the same background fill as the mockup background but do **not** respond to the tone toggle, to avoid confusion. The variable is the same:

- Backgrounds:

  - Primary → `--ui-primary-bg`
  - Secondary → `--ui-secondary-bg`

- Text:
  - Primary → `--text-on-primary`
  - Secondary → `--text-on-secondary`

Because `text-on-*` is surface-resolved, buttons stay readable across all brands and all recipes, including the 'inverted' mode.

Hover and active behavior is based on **UI background polarity**, not brand color:

- Light UI → darken on hover
- Dark UI → lighten on hover

This guarantees subtle, readable hover states even in inverted recipes.

### Style Inspector Output

The Style Inspector lists **only resolved, rendered colors**, not raw brand tokens.

- Colors are collected from the consolidated visual context emitted by `SocialPostMockup.vue`
- Only surfaces and text roles that are **actively rendered** in the current mockup are included
- Switching recipes, tones, or mockup variants changes the exported color set accordingly

The inspector reflects visual reality after all dynamic resolution and overrides have been applied.

In the current MVP, the color list does not shrink when switching designs. All resolved colors remain listed, even if some elements are not rendered in the active mockup. This is a known limitation and intentionally left unresolved for stability.

### Non-Negotiable Rules

If any of these are broken, contrast bugs will appear:

1. Never hardcode text colors on colored surfaces
2. Never assume brand colors are light or dark
3. Never bypass `updateDynamicTextRoles()`
4. Never write directly to `dynamic-*`
5. Never let recipes define text polarity

### Take-Home Message

- Brands define identity
- Recipes define mood
- Surfaces decide readability
- Contrast is enforced at runtime (some exceptions)

---

## Event-Driven Recalculation

**(!) Important Implementation Note**

The application relies on **global custom events** to trigger recomputation of derived visual state. This is intentional and safe in the current scope, but it is important to understand the trade-offs.

### Events in Use

The following events are dispatched and listened to across components:

- `brand-updated`
- `palette-updated`
- `accent-updated`
- `dynamic-text-updated`
- `mockup-visuals-updated`

They trigger recomputation of:

- surface-resolved text roles
- dynamic content roles
- mockup content roles
- hover / active polarity
- contrast checker evaluation

The system has no single reactive store for visual state. Instead, all correctness is derived from **computed CSS values** after the browser has resolved styles.

Using events allows:

- safe recomputation after CSS variables change
- decoupling between brand loading, recipes, contrast checking, and UI
- idempotent recalculation without cached assumptions

Functions like `updateDynamicTextRoles()` and `scheduleContrastUpdate()` are written to be safe when called multiple times.

### Known Trade-Off

Some events trigger overlapping recomputation paths. In practice, the same derived state may be recalculated more than once during:

- brand loading
- recipe switching
- contrast fixing

This works because:

- recomputation is idempotent
- execution is deferred via `nextTick`
- all logic reads **computed CSS**, not intermediate state

This is acceptable for an MVP (or POC) because:

- The system is deterministic once the browser has completed layout
- No race conditions exist in the current feature set
- Visual correctness is guaranteed even if recalculation happens twice

### Caution for Future Changes

This pattern **scales poorly** if significantly more async inputs are added (e.g. image loading, animations, persistence).

If extending the system:

- avoid adding new global events casually
- avoid introducing logic that depends on event order
- prefer recomputing derived state in one place where possible

This is a **conscious architectural choice**, not an oversight. It prioritizes correctness, decoupling and safety under CSS-driven theming, over minimal recomputation.

Do not refactor this without a clear replacement model.

---

## Mockup Architecture Overview (How the Preview System Fits Together)

The preview pipeline is deliberately layered. Each component has a single responsibility, which keeps layout logic, rendering logic, and visual composition cleanly separated.

### Preview Component Stack

```
<MainPreview>
 └─ <MockupWrapper :size>
    └─ <MockupRenderer :size>
       └─ <SocialPostMockup :size>
          └─ <PostWrapper :size>
             └─ .post-wrapper (DOM)
```

For a more detailed tree, see `\docs\project-tree.md`.

### Responsibilities per Layer

**`MockupWrapper`**
UI-level layout container for the dashboard.

- Controls perceived width of the mockup in the preview column
- Handles responsive behavior between formats (story vs landscape)
- Does not know anything about aspect ratios or post internals

**`MockupRenderer`**
Orchestration layer.

- Selects which post type component to render
- Resolves background color variables
- Emits resolved visual styles for the style inspector
- Passes state and props downward

**`SocialPostMockup`**
Visual composition of a post mockup.

- Renders the full background stack (solid color, pattern, large logo, image)
- Applies platform safe zones (feed and story)
- Handles content stacking, scaling, and watermark placement
- Applies safe-area CSS variables per format
- Resolves **mockup-scoped text and caption roles** based on actual rendered backgrounds
- Emits a consolidated snapshot of all active mockup colors for the style inspector and export panel

This component has explicit awareness of mockup-only surfaces (panel, alt-panel, accent).
Text and caption colors inside the mockup are resolved locally to guarantee correct contrast evaluation and fixability.

**`PostWrapper`**
Canvas contract.

- Enforces the correct aspect ratio (1:1, 4:5, 9:16, 16:9)
- Clips overflow
- Guarantees a predictable mockup canvas

**`.post-wrapper`**
The actual DOM element created by `PostWrapper`.

### Key Design Rules

- Aspect ratio logic exists **only** in `PostWrapper`
- Responsive sizing logic exists **only** in `MockupWrapper`
- Visual composition exists **only** in `SocialPostMockup`
- No layout breakpoints leak into mockup visuals

This separation is intentional and avoids the most common failure mode of preview tools: mixing dashboard layout concerns with mockup rendering logic.

If something looks wrong:

- width or scaling issue → check `MockupWrapper`
- wrong format ratio → check `PostWrapper`
- visual overlap / safe zones / backgrounds → check `SocialPostMockup`
- wrong content or styles → check `MockupRenderer`

This structure is safe to extend with new formats, new platforms, or additional overlays without refactoring existing logic.

---

## Tech Stack

| Tool/Technology                      | Purpose                                   |
| :----------------------------------- | :---------------------------------------- |
| **Vue 3 (Vite)**                     | Core frontend framework.                  |
| **JavaScript (ES6+)**                | Application logic and interactivity.      |
| **CSS Custom Properties**            | Engine for the dynamic theming system.    |
| **Figma**                            | UI/UX design and component specification. |
| **AI-Assisted Development**          | AI strategy for accelerated development.  |
| &nbsp;&nbsp;↳ **ChatGPT-5.1 (chat)** | Code setup, refactoring & bug fixes       |

---

## Manual Brand Onboarding

Default brand palettes are loaded from a simple JSON configuration file in `\public\brands\`.

### Filename and slug

After copying the starter JSON file, it's very important to (re)name the file correctly to reference the new client. This filename will be used as slug throughout the project:

`` await fetch(`/brands/${slug}.json`); ``

The brand can be added to the ` BrandPicker.vue` template so it appears in the dropdown. The value must be the same name as the JSON file.

`\public\brands\client.json`

`<option value="client">The Client's Name</option>`

### JSON contents

#### 1. IDs

The brand ID isn't currently used as a string anywhere in the project and may be entered with or without spaces, special characters, or aliases of the brand name.

#### 2. Fonts

Care should be taken to reference font-families correctly. Adobe fonts will need to be relinked to the agency's own Typekit.

`"font-title"` \
`"font-body"`

Most websites use only two fonts, but more can be added. In that case, these alternates need to be called in the UI for specific brands only. Make sure to adjust font-weight for fonts with a limited axis. For example in the main component `App.vue`, one brand has a decorative title font including a tertiary color:

```
html.brand--steviala .hero-title {
    font-family: var(--font-title-alt);
    font-weight: 400;
    --dynamic-title: var(--color-tertiary);
}
```

#### 3. Brand Colors

For each brand, the primary and secondary color set should be copied as-is (in hex notation) from the agency's own code. For example:

`"color-primary": "#12739b",`\
`"color-primary-dark": "#0e5a79",`

To accurately mimic the website, the JSON lists three surface colors. Variable names here do not match the agency's own system but they refer to standard semantic roles which makes them easy to understand:

- `"color-surface"`: a large surface color that (usually) isn't `#ffffff`. Some very colorful brands excepted, this will most likely be an off-white like `#f4f4f4`.
- `"color-panel" `: used in the main side panel in the tool's own UI, on client websites this is likely an accented background color, commonly used in call-to-action banners.
- `"color-card" `: the background color that sets product cards apart from their backgrounds, quite often `#ffffff`.

These colors affect the entire UI but play an important part in the mockups as well.

Lastly, colors for headers and footers, title and body text colors, and utility colors (used for the contrast score labels in the system) should be completed.

The system is unreliable when colors are left blank, duplicating values is advised if there's no match but this should be rare.

#### 4. Borders and Shadows

Both borders and shadows are booleans. When `true`, the styles list in the right-hand side panel will show them as a swatch.

Borders colors are always semi-transparent black (or white on dark backgrounds) for aesthetic reasons. Few Creo websites use borders, but border radiuses are common. It's important to use `cqw` units for both, to make sure the borders scale inside the mockup. A 1:1 mapping is a reasonable enough approximation (1rem ~ 1cqw).

Shadows can be colored by entering `rbg` values. All relevant values can be entered as well: offset, blur and alpha (strength). The reference for these can be shadows used on the client websites for product cards, for example.

#### 5. Instagram Data

The correct SVG and WEBP filenames, and the website URL, must be entered here:

```
 "ig": {
    "avatar": "wijkraadrunkst.webp",
    ...
    "url": "https://www.client.be",
    "highlightIcon": "client-small.svg"
    ...
 }
```

SVGs must be added to the correct folders:

| Filename                           | Usage                                     |
| :--------------------------------- | :---------------------------------------- |
| public/logo-bg/client.svg          | mockup background (large + pattern)       |
| public/highlights/client-small.svg | highlight icons, watermark, external link |
| src/assets/avatars/client.webp     | profile picture                           |

Some brand configurations include reference URLs to password-protected staging sites. These links are used by the author during design and development to compare visual decisions. They are not part of the tool’s functional scope and are not expected to be accessible to reviewers.

All other data is entirely optional and can be copied from an existing Instagram account, made up, or left blank.

## SVG treatment

Vectorized logos play an important part in the mockup design.

### SVG file naming

SVGs are derived using the same name as the JSON file in `MainPreview.vue`:

```
const brandLogoSmall = computed(() => {
  if (!props.brandTokens?.slug) return null;
  return `/highlights/${props.brandTokens.slug}-small.svg`;
});

const brandLogo = computed(() => {
  if (!props.brandTokens?.slug) return null;
  return `/logo-bg/${props.brandTokens.slug}.svg`;
});

```

Inconsistent naming will result in broken file links.

### SVG Cleanup

The `client.svg` must be prepared in a specific way to ensure reliable recoloring. This can be done in Illustrator or in the IDE.

- Single `<svg>` with a valid `viewBox`
- Paths only and all shapes expanded (no compound shapes)
- No inline `fill` or `stroke` values
- No `<style>` blocks or embedded CSS
- No gradients, filters, masks, or `<defs>`
- No opacity on paths or groups

These SVGs rely on `currentColor`. Actual color is injected via the CSS variable `--mockup-decor` and adapts to the mockup's background color, which the user can manipulate using a toggle and a checkbox. Cleaning the svg from inline styles helps to avoid runtime mutations.

This treatment is not necessary for `client-small.svg`. These logos keep their original color(s) on light backgrounds and switch to white on dark backgrounds.

---

## Project Setup

This project is built using **Vite**. The following commands are relevant.

### Prerequisites

- Node.js (v18.x or higher recommended)
- npm

### Installation

```bash
# Clone the repository and navigate into the directory
git clone [your-repo-url]
cd voorbeeldig

# Install dependencies
npm install
```

### Development

```bash
# Run the app in development mode with hot-reloading
npm run dev
```

### Production Build

```bash
# Compiles and minifies the application for production
npm run build
```

---

## 📎Credits

Instagram grid layout based on work by georgewpark:
https://github.com/georgewpark/Instagram-Profile-Layout
