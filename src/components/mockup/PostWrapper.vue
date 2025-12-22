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
  width: 100%;
  max-width: 100%;
  overflow: hidden;
}

/* landscape fills width */
.size--landscape.post-wrapper {
  width: 100%;
}

/* all vertical formats share perceived width */
.size--square.post-wrapper,
.size--portrait.post-wrapper,
.size--story.post-wrapper {
  width: min(100%, calc(100vh * (1080 / 1920)));
}

/* mobile */
@media (max-width: 991px) {
  .post-wrapper {
    width: 100%;
  }
}
</style>
