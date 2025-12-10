<template>
  <a class="logo" href="#">
    <!-- DEFAULT LOGO (unchanged except for variable fills) -->
    <svg
      v-if="!useInverse"
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      viewBox="0 0 400 120"
      class="brandlogo-svg">
      <rect x="14.9" y="15.9" width="89.2" height="89.2" fill="var(--color-border-dark)" />

      <g id="squares">
        <!-- <rect
          x="62.1"
          y="9.4"
          width="22.8"
          height="22.8"
          transform="translate(-1.8 33.8) rotate(-25.6)"
          fill="var(--ui-nav-bg)" /> -->
        <rect
          x="8.5"
          y="35.1"
          width="22.8"
          height="22.8"
          transform="translate(-18.2 13.1) rotate(-25.6)"
          fill="var(--color-primary)" />
        <rect
          x="35.3"
          y="22.3"
          width="22.8"
          height="22.8"
          transform="translate(-10 23.5) rotate(-25.6)"
          fill="var(--color-secondary-lighter)" />
        <rect
          x="21.3"
          y="62"
          width="22.8"
          height="22.8"
          transform="translate(-28.5 21.3) rotate(-25.6)"
          fill="var(--color-primary-lighter)" />
        <rect
          x="48.1"
          y="49.1"
          width="22.8"
          height="22.8"
          transform="translate(-20.3 31.7) rotate(-25.6)"
          fill="var(--ui-nav-bg)" />
        <rect
          x="75"
          y="36.3"
          width="22.8"
          height="22.8"
          transform="translate(-12.1 42) rotate(-25.6)"
          fill="var(--color-primary)" />
        <rect
          x="34.2"
          y="88.8"
          width="22.8"
          height="22.8"
          transform="translate(-38.8 29.5) rotate(-25.6)"
          fill="var(--color-secondary-lighter)" />
        <rect
          x="61"
          y="75.9"
          width="22.8"
          height="22.8"
          transform="translate(-30.6 39.9) rotate(-25.6)"
          fill="var(--color-primary-light)" />
        <rect
          x="87.8"
          y="63.1"
          width="22.8"
          height="22.8"
          transform="translate(-22.4 50.2) rotate(-25.6)"
          fill="var(--color-secondary)" />
      </g>

      <path
        d="M335.1,82.8c-1.7,2.1-6.3,6.5-14.3,6.5-13.1,0-24.7-11-24.7-26.6s11.5-26.6,24.7-26.6,15.3,7.9,15.3,7.9v-6.6h11.9v51.1c0,17.6-13,25.4-27.3,25.4s-24-9.6-24-9.6l7.3-9.8s7.1,7.5,16.8,7.5,14.4-5.5,14.4-13v-6.1ZM335.1,70.3v-15.2s-3.6-7.1-12.1-7.1-13.9,6.3-13.9,14.6,5.2,14.6,13.9,14.6,12.1-7.1,12.1-7.1Z"
        fill="var(--color-border-dark)" />
      <path d="M285.1,88h-12.8v-42.7l12.8-6.1v48.8Z" fill="var(--color-border-dark)" />
      <path
        d="M248.8,85c0-2.4,1.9-4.3,4.3-4.3s4.3,1.9,4.3,4.3-1.9,4.3-4.3,4.3-4.3-1.9-4.3-4.3Z"
        fill="var(--color-border-dark)" />
      <path
        d="M196.1,88h-5V7.2h5.5v39.8c1.3-1.9,6.5-9,17.6-9s24.3,10.5,24.3,25.6-10.7,25.6-24.3,25.6-18.1-9.5-18.1-9.5v8.2ZM196.6,53.8v19.7s4.9,10.4,17.5,10.4,18.5-8.9,18.5-20.2-7.6-20.2-18.5-20.2-17.5,10.4-17.5,10.4Z"
        fill="var(--color-border-dark)" />
      <path d="M132.6,39.3h6l18.5,39.2,18.5-39.2h5.8l-24.4,50.9-24.4-50.9Z" fill="var(--color-border-dark)" />
      <rect
        x="266.3"
        y="9.4"
        width="22.8"
        height="22.8"
        transform="translate(18.3 122.1) rotate(-25.6)"
        fill="var(--color-border-dark)" />
    </svg>

    <!-- INVERSE LOGO (unchanged except for variable fills) -->
    <svg
      v-else
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      viewBox="0 0 400 120"
      class="brandlogo-svg">
      <rect x="14.9" y="15.9" width="89.2" height="89.2" fill="var(--color-surface)" />

      <g id="squares">
        <!-- <rect
          x="62.1"
          y="9.4"
          width="22.8"
          height="22.8"
          transform="translate(-1.8 33.8) rotate(-25.6)"
          fill="var(--ui-nav-bg)" /> -->
        <rect
          x="8.5"
          y="35.1"
          width="22.8"
          height="22.8"
          transform="translate(-18.2 13.1) rotate(-25.6)"
          fill="var(--color-primary-light)" />
        <rect
          x="35.3"
          y="22.3"
          width="22.8"
          height="22.8"
          transform="translate(-10 23.5) rotate(-25.6)"
          fill="var(--color-primary-dark)" />
        <rect
          x="21.3"
          y="62"
          width="22.8"
          height="22.8"
          transform="translate(-28.5 21.3) rotate(-25.6)"
          fill="var(--color-secondary)" />
        <rect
          x="48.1"
          y="49.1"
          width="22.8"
          height="22.8"
          transform="translate(-20.3 31.7) rotate(-25.6)"
          fill="var(--ui-nav-bg)" />
        <rect
          x="75"
          y="36.3"
          width="22.8"
          height="22.8"
          transform="translate(-12.1 42) rotate(-25.6)"
          fill="var(--color-secondary-lighter)" />
        <rect
          x="34.2"
          y="88.8"
          width="22.8"
          height="22.8"
          transform="translate(-38.8 29.5) rotate(-25.6)"
          fill="var(--color-secondary-lighter)" />
        <rect
          x="61"
          y="75.9"
          width="22.8"
          height="22.8"
          transform="translate(-30.6 39.9) rotate(-25.6)"
          fill="var(--color-primary-dark)" />
        <rect
          x="87.8"
          y="63.1"
          width="22.8"
          height="22.8"
          transform="translate(-22.4 50.2) rotate(-25.6)"
          fill="var(--color-primary-lighter)" />
      </g>

      <path
        d="M335.1,82.8c-1.7,2.1-6.3,6.5-14.3,6.5-13.1,0-24.7-11-24.7-26.6s11.5-26.6,24.7-26.6,15.3,7.9,15.3,7.9v-6.6h11.9v51.1c0,17.6-13,25.4-27.3,25.4s-24-9.6-24-9.6l7.3-9.8s7.1,7.5,16.8,7.5,14.4-5.5,14.4-13v-6.1ZM335.1,70.3v-15.2s-3.6-7.1-12.1-7.1-13.9,6.3-13.9,14.6,5.2,14.6,13.9,14.6,12.1-7.1,12.1-7.1Z"
        fill="var(--color-surface)" />
      <path d="M285.1,88h-12.8v-42.7l12.8-6.1v48.8Z" fill="var(--color-surface)" />
      <path
        d="M248.8,85c0-2.4,1.9-4.3,4.3-4.3s4.3,1.9,4.3,4.3-1.9,4.3-4.3,4.3-4.3-1.9-4.3-4.3Z"
        fill="var(--color-surface)" />
      <path
        d="M196.1,88h-5V7.2h5.5v39.8c1.3-1.9,6.5-9,17.6-9s24.3,10.5,24.3,25.6-10.7,25.6-24.3,25.6-18.1-9.5-18.1-9.5v8.2ZM196.6,53.8v19.7s4.9,10.4,17.5,10.4,18.5-8.9,18.5-20.2-7.6-20.2-18.5-20.2-17.5,10.4-17.5,10.4Z"
        fill="var(--color-surface)" />
      <path d="M132.6,39.3h6l18.5,39.2,18.5-39.2h5.8l-24.4,50.9-24.4-50.9Z" fill="var(--color-surface)" />
      <rect
        x="266.3"
        y="9.4"
        width="22.8"
        height="22.8"
        transform="translate(18.3 122.1) rotate(-25.6)"
        fill="var(--color-surface)" />
    </svg>
  </a>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from "vue";
import { getContrastRatio } from "../../utils/colorBlender.js";

const props = defineProps({
  brandTokens: { type: Object, default: null },

  // background to test against
  navBgVar: { type: String, default: "--ui-nav-bg" },

  // dark text system (default)
  darkTextVar: { type: String, default: "--color-text" },

  // light text system (white)
  lightTextVar: { type: String, default: "--color-text-inverse" },
});

const useInverse = ref(false);

function readCSSVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function updateVariant() {
  const bg = readCSSVar(props.navBgVar);
  const darkText = readCSSVar(props.darkTextVar);
  const lightText = readCSSVar(props.lightTextVar);

  if (!bg || !darkText || !lightText) {
    useInverse.value = false;
    return;
  }

  const cDark = getContrastRatio(darkText, bg);
  const cLight = getContrastRatio(lightText, bg);

  // if white text reads better → use inverse logo
  useInverse.value = cLight >= cDark;
}

watch(() => props.brandTokens, updateVariant, { immediate: true });

function handlePaletteUpdated() {
  updateVariant();
}

onMounted(() => {
  updateVariant();
  window.addEventListener("palette-updated", handlePaletteUpdated);
});

onBeforeUnmount(() => {
  window.removeEventListener("palette-updated", handlePaletteUpdated);
});
</script>

<style scoped>
.brandlogo-svg {
  display: block;
  height: 6rem;
  width: auto;
  margin: 0 auto;
}

@media (min-width: 768px) {
  .brandlogo-svg {
    height: 10rem;
  }
}
</style>
