<template>
  <div class="app-main-shell">
    <FormatSelector
      :modelValue="selectedSize"
      :showSafeZones="showSafeZones"
      @update:size="selectedSize = $event"
      @update:safeZones="showSafeZones = $event" />

    <div class="row main-preview-row">
      <!-- SIDEBAR -->
      <div class="col-12 col-xl-12 col-xxl-2 main-preview__sidebar">
        <ContentTypePanel
          :selected="selectedPostType"
          :tone="backgroundTone"
          :colored="useColoredBackground"
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
          "
          @update-colored="useColoredBackground = $event" />
      </div>

      <!-- PREVIEW -->
      <div class="col-12 col-xl-10 col-xxl-8 main-preview__content">
        <MockupWrapper :size="selectedSize">
          <MockupRenderer
            :key="brandTokens?.slug || 'default'"
            :size="selectedSize"
            :postType="selectedPostType"
            :postData="activePostData"
            :designProps="{
              backgroundClass,
              backgroundTone,
              useColoredBackground,
              brandLogo,
              usePhoto: backgroundMode === 'image',
              photoSrc,
              showCornerShapes: backgroundMode !== 'logo',
            }"
            :showSafeZone="showSafeZones"
            @bg-resolved="resolvedBgColors = $event"
            @update-colored="useColoredBackground = $event"
            @resolved-styles="resolvedStyles = $event" />
        </MockupWrapper>
      </div>

      <div class="col-12 col-xl-2 col-xxl-2 main-preview__styles">
        <StyleInspectorPanel
          :key="brandTokens?.slug || 'default'"
          :titleFont="resolvedStyles?.fonts?.title"
          :bodyFont="resolvedStyles?.fonts?.body"
          :styles="resolvedStyles" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";

import ContentTypePanel from "../controls/ContentTypePanel.vue";
import FormatSelector from "../controls/FormatSelector.vue";
import MockupWrapper from "../preview/MockupWrapper.vue";
import MockupRenderer from "../preview/MockupRenderer.vue";

import stockImage from "@/assets/img/stockphoto.webp";

import StyleInspectorPanel from "../preview/StyleInspectorPanel.vue";

const emit = defineEmits(["update-tone", "update-mode"]);
const resolvedBgColors = ref([]);

const { brandTokens } = defineProps({
  brandTokens: Object,
});

const resolvedStyles = ref(null);

/* --------------------------------------------
   POST TYPE STATE
--------------------------------------------- */
const selectedPostType = ref("info");
const activePostData = ref({});

/* --------------------------------------------
   BACKGROUND STATE (tone + mode)
--------------------------------------------- */
const backgroundTone = ref("primary"); // "primary" | "secondary"
const useColoredBackground = ref(true); // color background ON
const backgroundMode = ref("none"); // "none" | "logo" | "pattern" | "image"

watch(
  backgroundTone,
  (tone) => {
    const root = document.documentElement;

    if (tone === "secondary") {
      root.style.setProperty("--dynamic-accent", "var(--ui-accent-on-secondary)", "important");
    } else {
      root.style.setProperty("--dynamic-accent", "var(--ui-accent-on-primary)", "important");
    }

    window.dispatchEvent(new Event("accent-updated"));
  },
  { immediate: true }
);

// IMAGE

const selectedSize = ref("portrait");
const showSafeZones = ref(false);
const photoSrc = ref(stockImage);

/* --------------------------------------------
   POST CONTENT
--------------------------------------------- */
const postContent = {
  info: {
    headline: "Welkom",
    body: "Kies een kleurrecept uit en controleer het contrast. ",
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

  if (useColoredBackground.value) {
    classes.push(backgroundTone.value === "secondary" ? "bg--plain-secondary" : "bg--plain-primary");
  } else {
    classes.push("bg--plain-neutral");
  }

  if (backgroundMode.value === "pattern") return "bg--pattern pattern-distorted-mesh";
  if (backgroundMode.value === "logo") classes.push("bg--logo");
  if (backgroundMode.value === "image") classes.push("bg--image");

  return classes.join(" ");
});

/* --------------------------------------------
   MOCKUP BACKGROUND CONTEXT
--------------------------------------------- */
const mockupBgContext = computed(() => ({
  bgVars: resolvedBgColors.value.length ? resolvedBgColors.value : ["--ui-section-bg"],
}));

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
  justify-items: center;
}
</style>
