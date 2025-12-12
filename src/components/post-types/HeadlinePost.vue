<template>
  <div class="headline-post">
    <div class="headline-post__icon" v-if="icon">
      <img :src="icon" alt="" />
    </div>

    <PostTextBlock :headlineText="headline" :bodyText="subtitle" textAlign="left" />
  </div>
</template>

<script setup>
import PostTextBlock from "../mockup/PostTextBlock.vue";

defineProps({
  headline: String,
  subtitle: String,
  icon: String,
});
</script>

<style>
.headline-post {
  color: inherit;
}
</style>
