<template>
  <div v-if="brandLogoSmall" class="post-watermark" :style="watermarkStyle"></div>
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

/* ----------------------------------------------
   HELPERS
---------------------------------------------- */

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

function resolveWatermarkColor(root) {
  const bg = resolveFirstBg(props.bgColors);
  if (!bg) return root.getPropertyValue("--ui-alt-section-bg").trim();

  const dark = root.getPropertyValue("--color-text").trim();
  const light = root.getPropertyValue("--color-text-inverse").trim();

  const mode = getTextModeForBackground(bg, dark, light);

  // light background → dark watermark
  if (mode === "dark") {
    return root.getPropertyValue("--color-primary-dark").trim() || root.getPropertyValue("--color-text").trim();
  }

  // dark background → light watermark
  return (
    root.getPropertyValue("--color-primary-lighter").trim() || root.getPropertyValue("--color-text-inverse").trim()
  );
}

/* ----------------------------------------------
   STYLE COMPUTATION
---------------------------------------------- */

const watermarkStyle = computed(() => {
  if (!props.brandLogoSmall) return null;

  const url = new URL(props.brandLogoSmall, import.meta.url).href;
  const root = getRootStyle();
  const color = resolveWatermarkColor(root);

  return {
    WebkitMaskImage: `url(${url})`,
    maskImage: `url(${url})`,
    WebkitMaskRepeat: "no-repeat",
    maskRepeat: "no-repeat",
    WebkitMaskPosition: "center",
    maskPosition: "center",
    WebkitMaskSize: "contain",
    maskSize: "contain",
    backgroundColor: color,
  };
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
}
</style>
