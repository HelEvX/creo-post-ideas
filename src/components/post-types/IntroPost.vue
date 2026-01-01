<template>
  <div class="intro-post">
    <PostTextBlock
      v-if="zone === 'safe'"
      :captionText="caption"
      :headlineText="headline"
      :subtitleText="subtitle"
      :bodyText="body"
      textAlign="center"
      bodyAlign="left" />
    <div v-else class="quote-post__decor"></div>
  </div>
</template>

<script setup>
import PostTextBlock from "../mockup/PostTextBlock.vue";

const { caption, headline, body } = defineProps({
  caption: String,
  headline: String,
  subtitle: String,
  body: String,
  zone: { type: String, required: true },
});
</script>

<style></style>
