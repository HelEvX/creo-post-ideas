<template>
  <div class="app-main-shell">
    <FormatSelector
      :modelValue="selectedSize"
      :showSafeZones="showSafeZones"
      @update:size="selectedSize = $event"
      @update:safeZones="showSafeZones = $event" />

    <div class="row main-preview-row">
      <!-- SIDEBAR / MOBILE CONTROLS -->
      <div class="col-12 col-lg-10 col-xxl-2 main-preview__sidebar">
        <ContentTypePanel
          v-if="!isMobile"
          :selected="selectedPostType"
          :tone="backgroundTone"
          :colored="colored"
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
          @update-colored="
            useColoredBackground = $event;
            emit('update-colored', $event);
          " />

        <MobileSettingsAccordion
          v-else
          :selectedPostType="selectedPostType"
          :backgroundTone="backgroundTone"
          :backgroundMode="backgroundMode"
          :colored="useColoredBackground"
          @select="onContentTypeSelect"
          @update-tone="
            backgroundTone = $event;
            emit('update-tone', $event);
          "
          @update-mode="
            backgroundMode = $event;
            emit('update-mode', $event);
          "
          @update-colored="
            useColoredBackground = $event;
            emit('update-colored', $event);
          " />
      </div>

      <!-- PREVIEW -->
      <div class="col-12 col-lg-10 col-xl-10 col-xxl-8 main-preview__content">
        <MockupWrapper :size="selectedSize">
          <MockupRenderer
            :key="brandTokens?.slug || 'default'"
            :size="selectedSize"
            :postType="selectedPostType"
            :postData="activePostData"
            :backgroundClass="backgroundClass"
            :backgroundTone="backgroundTone"
            :useColoredBackground="useColoredBackground"
            :brandLogo="brandLogo"
            :usePhoto="backgroundMode === 'image'"
            :photoSrc="photoSrc"
            :showSafeZone="showSafeZones"
            @bg-resolved="resolvedBgColors = $event"
            @resolved-styles="resolvedStyles = $event" />
        </MockupWrapper>
      </div>

      <div class="col-12 col-lg-2 main-preview__styles">
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
import MobileSettingsAccordion from "../controls/MobileSettingsAccordion.vue";

import FormatSelector from "../controls/FormatSelector.vue";
import MockupWrapper from "../preview/MockupWrapper.vue";
import MockupRenderer from "../preview/MockupRenderer.vue";

import stockImage from "@/assets/img/stockphoto.webp";

import StyleInspectorPanel from "../preview/StyleInspectorPanel.vue";

const emit = defineEmits(["update-tone", "update-mode", "update-colored"]);
const resolvedBgColors = ref([]);

const props = defineProps({
  brandTokens: Object,
  colored: {
    type: Boolean,
    default: true,
  },
});

const useColoredBackground = ref(props.colored);

watch(
  () => props.colored,
  (v) => {
    useColoredBackground.value = v;
  }
);

const resolvedStyles = ref(null);

const isMobile = ref(false);

function updateViewport() {
  isMobile.value = window.innerWidth < 1400;
}

updateViewport();
window.addEventListener("resize", updateViewport);

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
    body: "Blader door de stijlengalerij en controleer het contrast. ",
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
    quote: "We zijn super tevreden met de samenwerking en het resultaat was fantastisch!",
    author: "Sarah De Smet",
    authorName: "Sarah De Smet",
    authorRole: "Project Manager",
    avatar: "/avatars/sarah.webp",
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

  if (!useColoredBackground.value) {
    classes.push("bg--plain-neutral");
  } else {
    classes.push(backgroundTone.value === "secondary" ? "bg--plain-secondary" : "bg--plain-primary");
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
  bgVars: !useColoredBackground.value
    ? ["--ui-alt-section-bg"]
    : resolvedBgColors.value.length
    ? resolvedBgColors.value
    : ["--ui-section-bg"],
}));

/* --------------------------------------------
   COMPUTED: Logo background URL
--------------------------------------------- */
const brandLogo = computed(() => {
  if (backgroundMode.value !== "logo") return null;
  if (!props.brandTokens?.slug) return null;
  return `/highlights/${props.brandTokens.slug}.svg`;
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

.main-preview__content {
  padding-top: var(--space-10);
}

@media (min-width: 1400px) {
  .main-preview__content {
    padding-left: 0;
    padding-right: 0;
  }
}

@media (max-width: 1399px) {
  .main-preview__sidebar {
    margin-bottom: var(--space-25);
  }
}
</style>
