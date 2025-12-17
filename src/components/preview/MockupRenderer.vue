<template>
  <SocialPostMockup
    :bgColors="resolvedBgColors"
    :size="size"
    :backgroundClass="designProps.backgroundClass"
    :backgroundTone="designProps.backgroundTone"
    :brandLogo="designProps.brandLogo"
    :usePhoto="designProps.usePhoto"
    :photoSrc="designProps.photoSrc"
    :showCornerShapes="designProps.showCornerShapes">
    <component :is="currentPostComponent" v-bind="postData" />
  </SocialPostMockup>
</template>

<script setup>
import { computed, watch } from "vue";

import SocialPostMockup from "../mockup/SocialPostMockup.vue";

import InfoPost from "../post-types/InfoPost.vue";
import HeadlinePost from "../post-types/HeadlinePost.vue";
import IntroPost from "../post-types/IntroPost.vue";
import QuotePost from "../post-types/QuotePost.vue";
import ProductPost from "../post-types/ProductPost.vue";
import ParagraphPost from "../post-types/ParagraphPost.vue";
import FallbackPost from "../post-types/FallbackPost.vue";

const { size, postType, postData, designProps } = defineProps({
  size: String,
  postType: String,
  postData: Object,
  designProps: Object,
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
  return postMap[postType] || FallbackPost;
});

const emit = defineEmits(["bg-resolved"]);

/* -------------------------------------------------
   PATTERN COLOR MAP — NOW SUPPORTS SECONDARY MODE
--------------------------------------------------- */

const patternColorMap = {
  "pattern-distorted-mesh": {
    primary: ["--color-primary", "--color-primary-dark"],
    secondary: ["--color-secondary", "--color-secondary-dark"],
  },
  "pattern-geometric-flowers": {
    primary: ["--color-primary", "--color-primary-light"],
    secondary: ["--color-secondary", "--color-secondary-light"],
  },
  "pattern-nested-diamond": {
    primary: ["--color-primary", "--color-primary-dark"],
    secondary: ["--color-secondary", "--color-secondary-dark"],
  },
  "pattern-wavy": {
    primary: ["--color-primary", "--color-primary-light"],
    secondary: ["--color-secondary", "--color-secondary-light"],
  },
};

/* -------------------------------------------------
   BACKGROUND COLOR RESOLUTION
--------------------------------------------------- */

const NEUTRAL_BG_VAR = "--ui-alt-section-bg";

function getMockupBgColors(backgroundClass) {
  if (!backgroundClass) return [NEUTRAL_BG_VAR];

  const parts = backgroundClass.split(" ");
  const tone = designProps.backgroundTone === "secondary" ? "secondary" : "primary";

  for (const p of parts) {
    if (patternColorMap[p]) {
      return patternColorMap[p][tone];
    }
  }

  // plain backgrounds
  if (!designProps.useColoredBackground) {
    return [NEUTRAL_BG_VAR];
  }

  if (parts.includes("bg--plain-primary")) return ["--color-primary"];
  if (parts.includes("bg--plain-secondary")) return ["--color-secondary"];

  // default fallback
  return [NEUTRAL_BG_VAR];
}

const resolvedBgColors = computed(() => getMockupBgColors(designProps.backgroundClass));

watch(
  resolvedBgColors,
  (bgVars) => {
    emit("bg-resolved", bgVars);
  },
  { immediate: true }
);
</script>
