<template>
  <div class="headline-post">
    <PostTextBlock
      v-if="zone === 'safe'"
      :captionText="caption"
      :captionIcon="icon"
      :headlineText="headline"
      :subtitleText="subtitle"
      textAlign="left" />
    <div v-if="zone === 'safe'" class="arrow-wrapper">
      <div class="arrow"></div>
    </div>
    <div v-else class="post__decor">
      <div class="corner-shape corner-shape--bl"></div>
      <div class="corner-shape corner-shape--br"></div>
      <div class="corner-shape corner-shape--tl"></div>
      <div class="corner-shape corner-shape--tr"></div>
    </div>
  </div>
</template>

<script setup>
import PostTextBlock from "../mockup/PostTextBlock.vue";

defineProps({
  caption: String,
  headline: String,
  subtitle: String,
  icon: String,
  zone: { type: String, required: true },
});
</script>

<style scoped>
.headline-post {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.headline-post .post-text-block {
  height: 100%;
  justify-content: center;
}

/* arrow */
.arrow-wrapper {
  position: relative;
  flex: 0 1 30%;
}
.arrow {
  position: absolute;
  left: 50%;
  top: 0;
  width: 80%;
  height: auto;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
}

/* shaft */
.arrow::before {
  content: "";
  position: absolute;
  width: 100%;
  height: 0.67cqw;
  background: var(--dynamic-text);
}

/* arrowhead */
.arrow::after {
  content: "";
  position: absolute;
  right: 0;
  width: 3cqw;
  height: 3cqw;
  border-right: 0.8cqw solid var(--dynamic-text);
  border-bottom: 0.8cqw solid var(--dynamic-text);
  transform: rotate(-45deg);
}

.size--landscape .arrow::before {
  height: 0.5cqw;
}

.size--landscape .arrow::after {
  width: 3cqw;
  height: 3cqw;
  border-width: 0.5cqw;
}

/* FREE ZONE positioning */

.post__decor {
  position: relative;
  height: 100%;
  width: 100%;
}

/* CREO corner triangles */

.corner-shape {
  position: absolute;
  background: currentColor;
  opacity: var(--pattern-opacity);
  clip-path: polygon(0 0, 100% 100%, 0 100%, 0 0);
}

.corner-shape--tl {
  top: 0;
  left: 0;
  transform: scaleY(-1);
}
.corner-shape--tr {
  top: 0;
  right: 0;
  transform: scale(-1, -1);
}
.corner-shape--bl {
  bottom: 0;
  left: 0;
}
.corner-shape--br {
  bottom: 0;
  right: 0;
  transform: scaleX(-1);
}

/* ------------------ */
/* per-post triangles */
/* ------------------ */

/* portrait */
.size--portrait .corner-shape--bl {
  aspect-ratio: 1 / 1;
  height: 40%;
}
.size--portrait .corner-shape--br {
  aspect-ratio: 5 / 4;
  height: 50%;
}

/* square */
.size--square .corner-shape--bl {
  aspect-ratio: 1 / 1;
  height: 40%;
}
.size--square .corner-shape--br {
  aspect-ratio: 4 / 3;
  height: 60%;
}

/* landscape */
.size--landscape .corner-shape--bl {
  aspect-ratio: 4 / 3;
  height: 60%;
}
.size--landscape .corner-shape--tl {
  aspect-ratio: 2 / 3;
  height: 70%;
}
.size--landscape .corner-shape--tr {
  aspect-ratio: 4 / 5;
  height: 60%;
}
.size--landscape .corner-shape--br {
  aspect-ratio: 1 / 1;
  height: 50%;
}

/* story */
.size--story .corner-shape--bl {
  aspect-ratio: 1 / 1;
  height: 40%;
}
.size--story .corner-shape--br {
  aspect-ratio: 4 / 3;
  height: 50%;
}
</style>
