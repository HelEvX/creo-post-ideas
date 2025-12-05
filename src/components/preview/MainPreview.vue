<template>
  <div class="app-main-shell">
    <FormatSelector :modelValue="selectedSize" @update:size="selectedSize = $event" />

    <div class="row main-preview-row">
      <!-- SIDEBAR -->
      <div class="col-12 col-lg-2 main-preview__sidebar">
        <ContentTypePanel
          :selected="selectedPostType"
          :tone="backgroundTone"
          :selectedMode="backgroundMode"
          @select="onContentTypeSelect"
          @update-tone="backgroundTone = $event"
          @update-mode="backgroundMode = $event" />
      </div>

      <!-- PREVIEW -->
      <div class="col-12 col-lg-8 main-preview__content">
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
            }" />
        </MockupWrapper>
      </div>

      <div class="col-12 col-lg-2 main-preview__styles">
        <div class="main-preview__styles__title">Current Style</div>
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
    headline: "Welkom bij je creatieve playground!",
    body: "Gebruik het linkerpaneel om verschillende posttypes te testen en te bekijken hoe ze eruit zien.",
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

  // base plain background (tone)
  classes.push(backgroundTone.value === "secondary" ? "bg--plain-secondary" : "bg--plain-primary");

  // pattern mode
  if (backgroundMode.value === "pattern") return "bg--pattern pattern-distorted-mesh";

  // logo mode
  if (backgroundMode.value === "logo") {
    classes.push("bg--logo");
  }

  // image mode
  if (backgroundMode.value === "image") {
    classes.push("bg--image");
  }

  return classes.join(" ");
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
}

.main-preview__content {
  margin-left: 0;
}

.main-preview__styles {
  padding-right: 0;
}

.main-preview__styles__title {
  font-size: var(--fs-body-xs);
  font-weight: 700;
  margin-bottom: var(--space-30);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--ui-caption);
}

@media (min-width: 992px) {
  .main-preview-row {
    flex-wrap: nowrap;
  }

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
