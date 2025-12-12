<template>
  <div class="post-text-block" :style="{ textAlign }">
    <h2 class="post-text-block__headline">
      {{ headlineText }}
    </h2>
    <p class="post-text-block__body">
      {{ bodyText }}
    </p>
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
.post-text-block {
  display: block;
  width: 100%;
  color: inherit;
}

.post-text-block__headline {
  margin: 0 0 1rem 0;
  font-size: var(--fs-h2);
  line-height: var(--lh-heading);
  color: inherit;
}

.post-text-block__body {
  font-size: var(--fs-body-lg);
  line-height: var(--lh-body);
  color: inherit;
}
</style>
