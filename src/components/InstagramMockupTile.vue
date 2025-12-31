<!-- Always in portrait mode: 4/5 cropped to 3/4 -->

<template>
  <div class="ig-mockup-tile ig-mockup-tile--grid">
    <MockupRenderer
      size="portrait"
      :postType="config.postType"
      :postData="postContent[config.postType]"
      :backgroundClass="config.backgroundClass"
      :backgroundTone="config.backgroundTone"
      :useColoredBackground="config.useColoredBackground"
      :brandLogo="brandLogo"
      :usePhoto="config.usePhoto || false"
      :photoSrc="config.photoSrc || null"
      :showSafeZone="false" />
  </div>
</template>

<script setup>
import MockupRenderer from "@/components/preview/MockupRenderer.vue";
import { postContent } from "@/data/postContent";
import { computed } from "vue";

const props = defineProps({
  config: Object,
});

const brandLogo = computed(() => props.config?.brandLogo ?? null);
</script>

<style scoped>
.ig-mockup-tile {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;

  /* center without stretching */
  display: flex;
  align-items: center;
  justify-content: center;
}

/*
  Instagram-style COVER crop:
  - mockup is 4:5 (0.8)
  - tile is 3:4 (0.75)
  - scale = (4/3) / (5/4) = 16/15 ≈ 1.0667
*/
.ig-mockup-tile :deep(.post-wrapper) {
  transform: scale(1.067);
  transform-origin: center center;
}

.ig-mockup-tile--grid .post-bg__logo :deep(svg) {
  transform: translate(0, 0) scale(1.1);
  opacity: 0.25;
}
</style>
