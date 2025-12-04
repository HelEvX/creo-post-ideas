<template>
  <div class="mockup-bounds" :class="`format--${size}`">
    <div class="mockup-slot">
      <slot />
    </div>
  </div>
</template>

<script setup>
defineProps({
  size: { type: String, required: true },
});
</script>

<style scoped>
.mockup-bounds {
  width: 100%;
  max-width: 100%;
  padding: 2rem 0;

  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.mockup-slot {
  width: 100%;
  display: flex;
  justify-content: center;
}
</style>
