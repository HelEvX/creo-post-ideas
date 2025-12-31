<template>
  <SocialPostMockup
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
import { computed, watch, ref } from "vue";

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
   RESOLVED VISUALS
--------------------------------------------------- */

const resolvedVisuals = ref(null);

function onResolvedVisuals(payload) {
  resolvedVisuals.value = payload;
}

const resolvedStyles = computed(() => {
  if (!resolvedVisuals.value) return null;

  const cs = getComputedStyle(document.documentElement);

  return {
    ...resolvedVisuals.value,
    fonts: {
      title: cs.getPropertyValue("--font-title").trim().split(",")[0],
      body: cs.getPropertyValue("--font-body").trim().split(",")[0],
    },
  };
});

watch(
  resolvedStyles,
  (val) => {
    if (!val) return;
    emit("resolved-styles", val);
  },
  { immediate: true }
);
</script>
