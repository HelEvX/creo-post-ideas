<template>
  <img
    v-if="src"
    class="post-watermark"
    :class="{ 'is-inverted': forceWhite }"
    :src="src"
    alt=""
    aria-hidden="true"
    draggable="false" />
</template>

<script setup>
import { computed } from "vue";
import { getTextModeForBackground } from "@/utils/colorLogic.js";

const props = defineProps({
  brandLogoSmall: String,
  bgColors: {
    type: Array,
    default: () => [],
  },
});

function getRootStyle() {
  return getComputedStyle(document.documentElement);
}

function resolveFirstBg(vars) {
  const root = getRootStyle();
  for (const v of vars || []) {
    const val = root.getPropertyValue(v).trim();
    if (val) return val;
  }
  return null;
}

const forceWhite = computed(() => {
  const root = getRootStyle();
  const bg = resolveFirstBg(props.bgColors);
  if (!bg) return false;

  const dark = root.getPropertyValue("--color-text").trim();
  const light = root.getPropertyValue("--color-text-inverse").trim();

  // dark background → white logo
  return getTextModeForBackground(bg, dark, light) === "light";
});

const src = computed(() => {
  if (!props.brandLogoSmall) return null;
  return props.brandLogoSmall.startsWith("/")
    ? props.brandLogoSmall
    : new URL(props.brandLogoSmall, import.meta.url).href;
});
</script>

<style scoped>
.post-watermark {
  position: absolute;
  right: 4cqw;
  bottom: 4cqw;
  width: 10cqw;
  height: 10cqw;
  opacity: 0.6;
  pointer-events: none;
  user-select: none;
}

/* binary fallback */
.post-watermark.is-inverted {
  filter: brightness(0) invert(1);
}
</style>
