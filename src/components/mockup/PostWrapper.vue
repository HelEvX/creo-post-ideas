<template>
  <div class="post-wrapper" :style="{ '--mockup-aspect': aspectRatio }">
    <slot />
  </div>
</template>

<script setup>
defineProps({
  aspectRatio: {
    type: String,
    required: true,
  },
});
</script>

<style scoped>
.post-wrapper {
  position: relative;
  width: 100%;
  height: auto;
  aspect-ratio: var(--mockup-aspect);
  max-width: 100%;
  max-height: 100%;
  overflow: hidden;
  box-shadow: var(--shadow);
  --mockup-width: 100%;
}

/* responsive width by format, now on the wrapper */
.size--landscape.post-wrapper {
  width: 100%;
}

.size--square.post-wrapper,
.size--portrait.post-wrapper {
  width: calc(100% / 1920 * 1350);
}

.size--story.post-wrapper {
  width: calc(100% / 1920 * 1080);
}

@media (max-width: 991px) {
  .size--square.post-wrapper,
  .size--portrait.post-wrapper,
  .size--story.post-wrapper,
  .size--landscape.post-wrapper {
    width: 100%;
  }
}
</style>
