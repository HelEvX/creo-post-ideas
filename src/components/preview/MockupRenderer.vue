<template>
  <SocialPostMockup
    ref="mockupRef"
    :bgColors="resolvedBgColors"
    :size="size"
    :backgroundClass="backgroundClass"
    :backgroundTone="backgroundTone"
    :brandLogo="brandLogo"
    :usePhoto="usePhoto"
    :photoSrc="photoSrc"
    :showSafeZone="showSafeZone"
    :postType="postType"
    @resolved-visuals="onResolvedVisuals">
    <template #safe>
      <component :is="currentPostComponent" v-bind="postData" zone="safe" />
    </template>

    <template #free>
      <component :is="currentPostComponent" v-bind="postData" zone="free" />
    </template>
  </SocialPostMockup>
</template>

<script setup>
import { computed, watch, ref, nextTick, onMounted, onBeforeUnmount } from "vue";

import SocialPostMockup from "../mockup/SocialPostMockup.vue";

import InfoPost from "../post-types/InfoPost.vue";
import HeadlinePost from "../post-types/HeadlinePost.vue";
import IntroPost from "../post-types/IntroPost.vue";
import QuotePost from "../post-types/QuotePost.vue";
import ProductPost from "../post-types/ProductPost.vue";
import ParagraphPost from "../post-types/ParagraphPost.vue";
import FallbackPost from "../post-types/FallbackPost.vue";

const props = defineProps({
  size: String,
  postType: String,
  postData: Object,
  backgroundClass: String,
  backgroundTone: String,
  useColoredBackground: Boolean,
  brandLogo: String,
  usePhoto: Boolean,
  photoSrc: String,
  showSafeZone: Boolean,
});

const postMap = {
  info: InfoPost,
  headline: HeadlinePost,
  intro: IntroPost,
  quote: QuotePost,
  product: ProductPost,
  paragraph: ParagraphPost,
};

const currentPostComponent = computed(() => {
  return postMap[props.postType] || FallbackPost;
});

const emit = defineEmits(["bg-resolved", "resolved-styles"]);

/* -------------------------------------------------
   PATTERN COLOR MAP (old grid version)
--------------------------------------------------- */

const patternColorMap = {
  "pattern-distorted-mesh": {
    primary: ["--color-primary", "--color-primary-dark"],
    secondary: ["--color-secondary", "--color-secondary-dark"],
  },
  "pattern-geometric-flowers": {
    primary: ["--color-primary-darker", "--color-primary-dark", "--color-primary-light", "--color-primary"],
    secondary: ["--color-secondary-darker", "--color-secondary-dark", "--color-secondary-light", "--color-secondary"],
  },
  "pattern-rhombus-stripes": {
    primary: ["--color-primary", "--color-primary-dark"],
    secondary: ["--color-secondary", "--color-secondary-dark"],
  },
  "pattern-nested-diamond": {
    primary: ["--color-primary-dark", "--color-primary-light", "--color-primary"],
    secondary: ["--color-secondary-dark", "--color-secondary-light", "--color-secondary"],
  },
  "pattern-wavy": {
    primary: ["--color-primary-light", "--color-primary-dark"],
    secondary: ["--color-secondary-light", "--color-secondary-dark"],
  },
  "pattern-folded-zigzag": {
    primary: ["--color-primary", "--color-primary-lighter", "--color-primary-dark"],
    secondary: ["--color-secondary", "--color-secondary-lighter", "--color-secondary-dark"],
  },
};

/* -------------------------------------------------
   BACKGROUND COLOR
--------------------------------------------------- */

const NEUTRAL_BG_VAR = "--ui-alt-section-bg";

function getMockupBgColors(backgroundClass) {
  if (!props.useColoredBackground) {
    return [NEUTRAL_BG_VAR];
  }

  if (!backgroundClass) return [NEUTRAL_BG_VAR];

  const parts = backgroundClass.split(" ");
  const tone = props.backgroundTone === "secondary" ? "secondary" : "primary";

  for (const p of parts) {
    if (patternColorMap[p]) {
      return patternColorMap[p][tone];
    }
  }

  if (parts.includes("bg--plain-primary")) return ["--ui-primary-bg"];
  if (parts.includes("bg--plain-secondary")) return ["--ui-secondary-bg"];

  return [NEUTRAL_BG_VAR];
}

const resolvedBgColors = computed(() => getMockupBgColors(props.backgroundClass));

watch(
  resolvedBgColors,
  (bgVars) => {
    emit("bg-resolved", bgVars);
  },
  { immediate: true }
);

/* -------------------------------------------------
   RESOLVED VISUALS + ACTIVE MOCKUP VARS
--------------------------------------------------- */

const mockupRef = ref(null);
const resolvedVisuals = ref(null);
const isMounted = ref(false);

function getPostContentEl() {
  const rootEl = mockupRef.value && mockupRef.value.$el ? mockupRef.value.$el : null;
  if (!rootEl) return null;
  return rootEl.querySelector(".post-content");
}

function readVarFromEl(el, name) {
  if (!el) return "";
  return getComputedStyle(el).getPropertyValue(name).trim();
}

function buildResolvedStyles() {
  if (!resolvedVisuals.value) return null;

  const root = getComputedStyle(document.documentElement);

  const titleFont = root.getPropertyValue("--font-title").trim();
  const bodyFont = root.getPropertyValue("--font-body").trim();

  const postEl = getPostContentEl();

  const mockupTitle = readVarFromEl(postEl, "--dynamic-title");
  const mockupBody = readVarFromEl(postEl, "--dynamic-text");
  const mockupSoft = readVarFromEl(postEl, "--dynamic-soft");

  const titleOnPanel = readVarFromEl(postEl, "--title-on-panel");
  const textOnPanel = readVarFromEl(postEl, "--text-on-panel");
  const captionOnPanel = readVarFromEl(postEl, "--caption-on-panel");

  const titleOnAltPanel = readVarFromEl(postEl, "--title-on-alt-panel");
  const textOnAltPanel = readVarFromEl(postEl, "--text-on-alt-panel");
  const captionOnAltPanel = readVarFromEl(postEl, "--caption-on-alt-panel");

  const titleOnAccent = readVarFromEl(postEl, "--title-on-accent");
  const textOnAccent = readVarFromEl(postEl, "--text-on-accent");
  const captionOnAccent = readVarFromEl(postEl, "--caption-on-accent");

  return {
    ...resolvedVisuals.value,
    fonts: {
      title: titleFont.split(",")[0],
      body: bodyFont.split(",")[0],
    },
    text: {
      mockup: {
        title: mockupTitle,
        body: mockupBody,
        soft: mockupSoft,
      },
      panel: {
        title: titleOnPanel,
        body: textOnPanel,
        caption: captionOnPanel,
      },
      altPanel: {
        title: titleOnAltPanel,
        body: textOnAltPanel,
        caption: captionOnAltPanel,
      },
      accent: {
        title: titleOnAccent,
        body: textOnAccent,
        caption: captionOnAccent,
      },
    },
  };
}

function onResolvedVisuals(payload) {
  resolvedVisuals.value = payload;
  scheduleEmitResolvedStyles();
}

async function scheduleEmitResolvedStyles() {
  if (!isMounted.value) return;

  // wait for Vue to flush + browser to paint so .post-content exists and CSS vars are applied
  await nextTick();
  await new Promise((r) => requestAnimationFrame(r));

  const postEl = getPostContentEl();
  if (!postEl) return;

  const val = buildResolvedStyles();
  if (!val) return;

  emit("resolved-styles", val);
}

watch(
  () => [
    props.size,
    props.postType,
    props.postData,
    props.backgroundClass,
    props.backgroundTone,
    props.useColoredBackground,
    props.usePhoto,
    props.photoSrc,
    props.showSafeZone,
  ],
  () => {
    scheduleEmitResolvedStyles();
  },
  { deep: true, immediate: false }
);

function onDynamicVarsUpdated() {
  scheduleEmitResolvedStyles();
}

onMounted(() => {
  isMounted.value = true;
  scheduleEmitResolvedStyles();

  window.addEventListener("dynamic-text-updated", onDynamicVarsUpdated);
  window.addEventListener("accent-updated", onDynamicVarsUpdated);
  window.addEventListener("palette-updated", onDynamicVarsUpdated);
});

onBeforeUnmount(() => {
  window.removeEventListener("dynamic-text-updated", onDynamicVarsUpdated);
  window.removeEventListener("accent-updated", onDynamicVarsUpdated);
  window.removeEventListener("palette-updated", onDynamicVarsUpdated);
});
</script>
