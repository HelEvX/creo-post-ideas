<template>
  <div class="quote-post">
    <PostTextBlock :headlineText="quote" :bodyText="author" textAlign="left" />
  </div>
</template>

<script setup>
import PostTextBlock from "../mockup/PostTextBlock.vue";

const { quote, author } = defineProps({
  quote: String,
  author: String,
});
</script>

<style>
.quote-post {
  color: var(--dynamic-text);
}
</style>
