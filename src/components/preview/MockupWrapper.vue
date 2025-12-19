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
.mockup-slot {
  justify-items: center;
}
</style>
