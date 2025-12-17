<template>
  <div class="app-main-shell">
    <FormatSelector :modelValue="selectedSize" @update:size="selectedSize = $event" />

    <div class="row main-preview-row">
      <!-- SIDEBAR -->
      <div class="col-12 col-3xl-2 col-xl-4 main-preview__sidebar">
        <ContentTypePanel
          :selected="selectedPostType"
          :tone="backgroundTone"
          :selectedMode="backgroundMode"
          :mockupBgContext="mockupBgContext"
          @select="onContentTypeSelect"
          @update-tone="
            backgroundTone = $event;
            emit('update-tone', $event);
          "
          @update-mode="
            backgroundMode = $event;
            emit('update-mode', $event);
          " />
      </div>

      <!-- PREVIEW -->
      <div class="col-12 col-3xl-8 col-xl-8 main-preview__content">
        <MockupWrapper :size="selectedSize">
          <MockupRenderer
            :size="selectedSize"
            :postType="selectedPostType"
            :postData="activePostData"
            :designProps="{
              backgroundClass: backgroundClass,
              backgroundTone: backgroundTone,
              brandLogo: brandLogo,
              usePhoto: backgroundMode === 'image',
              photoSrc: photoSrc,
              showCornerShapes: backgroundMode !== 'logo',
            }"
            :bgContext="mockupBgContext" />
        </MockupWrapper>
      </div>

      <div class="col-12 col-3xl-2 col-xxl-12 main-preview__styles">
        <h6>Stijlkenmerken</h6>
        <div class="title-font">{title font name}</div>
        <div class="body-font">{body font name}</div>
        <div class="content-type-panel__divider"></div>
        <div class="main-preview__styles__swatches">
          <div class="main-preview__styles__swatch"></div>
          <div class="main-preview__styles__swatch"></div>
          <div class="main-preview__styles__swatch"></div>
          <div class="main-preview__styles__swatch"></div>
          <div class="main-preview__styles__swatch"></div>
          <div class="main-preview__styles__swatch"></div>
          <div class="main-preview__styles__swatch"></div>
        </div>
        <div class="content-type-panel__divider"></div>
        <div class="main-preview__styles__corners"></div>
        <div class="main-preview__styles__shadows"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

import ContentTypePanel from "../controls/ContentTypePanel.vue";
import FormatSelector from "../controls/FormatSelector.vue";
import MockupWrapper from "../preview/MockupWrapper.vue";
import MockupRenderer from "../preview/MockupRenderer.vue";

import stockImage from "@/assets/img/stockphoto.webp";
// import { getTextModeForBackground } from "@/utils/colorLogic.js";

const emit = defineEmits(["update-tone", "update-mode"]);

const { brandTokens } = defineProps({
  brandTokens: Object,
});

/* --------------------------------------------
   POST TYPE STATE
--------------------------------------------- */
const selectedPostType = ref("info");
const activePostData = ref({});

/* --------------------------------------------
   BACKGROUND STATE (tone + mode)
--------------------------------------------- */
const backgroundTone = ref("primary"); // "primary" | "secondary"
const backgroundMode = ref("none"); // "none" | "logo" | "pattern" | "image"

const selectedSize = ref("portrait");
const photoSrc = ref(stockImage);

/* --------------------------------------------
   POST CONTENT
--------------------------------------------- */
const postContent = {
  info: {
    headline: "Welkom",
    body: "Gebruik het linkerpaneel om je posts uit te testen. Je vindt de verzameling stijlkenmerken in het rechterpaneel.",
  },
  headline: {
    headline: "Win tijd door je processen te automatiseren.",
    subtitle: "Ontdek hoe we jouw bedrijf kunnen ondersteunen.",
    icon: "/icons/chart-up.svg",
  },
  intro: {
    title: "Welkom bij Creo!",
    body: "We bouwen digitale ervaringen die merken versterken en teams efficiënter maken.",
  },
  quote: {
    quote: "De beste software is diegene die je nooit in de weg zit.",
    author: "Sarah De Smet, Project Manager",
  },
  product: {
    name: "Creo Dashboard Suite",
    description: "Een krachtige tool voor inzicht, automatisatie en workflowbeheer.",
    image: "/images/product-example.webp",
    price: "€49 / maand",
  },
  paragraph: {
    title: "Over onze werkwijze",
    body: "Ons team werkt nauw samen met klanten om digitale oplossingen te creëren die echt impact maken.",
  },
};

/* --------------------------------------------
   COMPUTED: CSS background class
--------------------------------------------- */
const backgroundClass = computed(() => {
  const classes = [];
  classes.push(backgroundTone.value === "secondary" ? "bg--plain-secondary" : "bg--plain-primary");

  if (backgroundMode.value === "pattern") return "bg--pattern pattern-distorted-mesh";
  if (backgroundMode.value === "logo") classes.push("bg--logo");
  if (backgroundMode.value === "image") classes.push("bg--image");

  return classes.join(" ");
});

/* --------------------------------------------
   MOCKUP BACKGROUND CONTEXT
--------------------------------------------- */
const mockupBgContext = computed(() => {
  if (backgroundMode.value === "pattern") {
    return {
      type: "pattern",
      tone: backgroundTone.value,
      bgVars:
        backgroundTone.value === "secondary"
          ? ["--color-secondary", "--color-secondary-dark"]
          : ["--color-primary", "--color-primary-dark"],
    };
  }

  if (backgroundMode.value === "image") {
    return {
      type: "image",
      tone: backgroundTone.value,
      bgVars: backgroundTone.value === "secondary" ? ["--color-secondary"] : ["--color-primary"],
    };
  }

  return {
    type: "color",
    tone: backgroundTone.value,
    bgVars: backgroundTone.value === "secondary" ? ["--color-secondary"] : ["--color-primary"],
  };
});

/* --------------------------------------------
   COMPUTED: Logo background URL
--------------------------------------------- */
const brandLogo = computed(() => {
  if (backgroundMode.value !== "logo") return null;
  if (!brandTokens?.slug) return null;
  return `/src/assets/highlights/${brandTokens.slug}.svg`;
});

/* --------------------------------------------
   INIT
--------------------------------------------- */
activePostData.value = postContent.info;

/* --------------------------------------------
   EVENT HANDLERS
--------------------------------------------- */
function onContentTypeSelect(type) {
  selectedPostType.value = type;
  activePostData.value = postContent[type];
}
</script>

<style scoped>
.app-main-shell {
  display: flex;
  flex-direction: column;
  border-radius: var(--radius-lg);
  gap: var(--space-25);
}

.main-preview-row {
  align-items: flex-start;
  flex-wrap: wrap;
}

.main-preview__sidebar {
  margin-bottom: var(--space-40);
  text-align: center;
}

.main-preview__content {
  margin-left: 0;
}

.main-preview__styles {
  padding-right: 0;
}

.main-preview__styles h6 {
  text-align: center;
}

.main-preview__styles .title-font {
  font-family: var(--font-title);
  font-weight: var(--fw-title);
  margin-bottom: var(--space-20);
}

.main-preview__styles__swatches {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  gap: 1rem;
}

.main-preview__styles__swatch {
  width: 100%;
  height: 4rem;
  border-radius: var(--radius-sm);
}

.main-preview__styles__swatches div {
  background: var(--color-disabled-bg);
}

.main-preview__styles__swatches div:first-child {
  background: var(--color-primary);
}

.main-preview__styles__swatches div:nth-child(2) {
  background: var(--color-primary-dark);
}

.main-preview__styles__corners {
  height: 5rem;
  width: 5rem;
  border-left: var(--ui-swatch-border);
  border-top: var(--ui-swatch-border);
  border-radius: var(--radius-lg) 0 0 0;
  margin: 2rem 3rem 3rem 2rem;
}

.main-preview__styles__shadows {
  height: 6rem;
  width: 6rem;
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow);
  margin: 2rem;
}

.content-type-panel__divider {
  height: 1px;
  width: auto;
  background: var(--color-border-light);
  margin: var(--space-20) var(--space-30) var(--space-40);
}

@media (min-width: 992px) {
  .main-preview__sidebar {
    margin-bottom: 0;
  }

  .main-preview__content {
    margin-left: -2.5rem;
    border-left: var(--ui-panel-border-soft);
    border-right: var(--ui-panel-border-soft);
  }

  .main-preview__styles {
    padding-left: 2.5rem;
  }
}

@media (max-width: 991px) and (min-width: 768px) {
  .main-preview__sidebar {
    margin-bottom: var(--space-40);
  }
}

@media (max-width: 767px) {
  .main-preview__styles__title {
    margin-top: var(--space-20);
  }
}
</style>
