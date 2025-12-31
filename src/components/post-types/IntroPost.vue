<template>
  <div class="intro-post">
    <PostTextBlock :headlineText="headline" :bodyText="body" textAlign="left" />
  </div>
</template>

<script setup>
import PostTextBlock from "../mockup/PostTextBlock.vue";

const { headline, body } = defineProps({
  headline: String,
  body: String,
});
</script>

<style>
.intro-post {
  color: inherit;
}
</style>
