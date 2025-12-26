<template>
  <div class="post-wrapper" :class="`size--${size}`" :style="{ aspectRatio: aspectMap[size] }">
    <slot />
  </div>
</template>

<script setup>
defineProps({
  size: { type: String, required: true },
});

const aspectMap = {
  square: "1 / 1",
  portrait: "4 / 5",
  story: "9 / 16",
  landscape: "16 / 9",
};
</script>

<style scoped>
.post-wrapper {
  position: relative;
  margin: 0 auto;
  width: 100%;
  max-width: 100%;
  border-radius: var(--radius-sm);
  box-shadow: var(--ui-shadow-sm);
  container-type: inline-size;
}

/* perceptual correction per format */
.size--landscape.post-wrapper {
  --mockup-font-compensation: 1.2;
}
.size--square.post-wrapper {
  --mockup-font-compensation: 2;
}
.size--portrait.post-wrapper {
  --mockup-font-compensation: 2.4;
}
.size--story.post-wrapper {
  --mockup-font-compensation: 2.8;
}

.size--landscape.post-wrapper {
  width: 100%;
}
.size--square.post-wrapper,
.size--portrait.post-wrapper,
.size--story.post-wrapper {
  width: min(100%, calc(100vh * (1080 / 1920)));
}

@media (max-width: 991px) {
  .post-wrapper {
    width: 100%;
  }
}
</style>
