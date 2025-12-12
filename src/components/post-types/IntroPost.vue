<template>
  <div class="intro-post">
    <PostTextBlock :headlineText="title" :bodyText="body" textAlign="left" />
  </div>
</template>

<script setup>
import PostTextBlock from "../mockup/PostTextBlock.vue";

const { title, body } = defineProps({
  title: String,
  body: String,
});
</script>

<style>
.intro-post {
  color: inherit;
}
</style>
