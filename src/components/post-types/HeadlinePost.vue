<template>
  <div class="headline-post">
    <div class="headline-post__icon" v-if="icon">
      <img :src="icon" alt="" />
    </div>

    <PostTextBlock v-if="zone === 'safe'" :headlineText="headline" :bodyText="subtitle" textAlign="left" />
    <div v-else class="quote-post__decor">
      <div class="corner-shape square corner-shape--bl"></div>
      <div class="corner-shape rect corner-shape--br"></div>
    </div>
  </div>
</template>

<script setup>
import PostTextBlock from "../mockup/PostTextBlock.vue";

defineProps({
  headline: String,
  subtitle: String,
  icon: String,
  zone: { type: String, required: true },
});
</script>

<style>
.headline-post {
  color: inherit;
  background: inherit;
}

/* CREO corner triangles */

.corner-shape {
  position: absolute;
  background: currentColor;
  opacity: 0.2;
}

.corner-shape.square {
  height: 40%;
  aspect-ratio: 1 / 1;
  clip-path: polygon(0 0, 100% 100%, 0 100%, 0 0);
}

.corner-shape.rect {
  height: 30%;
  aspect-ratio: 2 / 1;
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
</style>
