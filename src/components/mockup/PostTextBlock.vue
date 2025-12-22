<template>
  <div class="post-text-block" :style="{ textAlign }">
    <div class="post-text-block__headline">
      {{ headlineText }}
    </div>
    <div class="post-text-block__body">
      {{ bodyText }}
    </div>
  </div>
</template>

<script setup>
defineProps({
  headlineText: String,
  bodyText: String,
  textAlign: {
    type: String,
    default: "left",
  },
});
</script>

<style scoped>
.post-text-block__headline {
  font-size: var(--fs-h2);
  line-height: var(--lh-heading);
  color: var(--dynamic-title);
}

.post-text-block__body {
  font-size: var(--fs-body-lg);
  line-height: var(--lh-body);
  color: var(--dynamic-text);
}
</style>
