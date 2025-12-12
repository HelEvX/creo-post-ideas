<template>
  <div class="fallback-post">
    <PostTextBlock
      headlineText="Content type ontbreekt"
      bodyText="Selecteer een posttype in het linkerpaneel."
      textAlign="center" />
  </div>
</template>

<script setup>
import PostTextBlock from "../mockup/PostTextBlock.vue";
</script>

<style>
.fallback-post {
  color: inherit;
}
</style>
