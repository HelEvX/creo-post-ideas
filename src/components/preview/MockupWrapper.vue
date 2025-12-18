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

.mockup-bounds {
  padding: var(--space-25);
}

@media (min-width: 1600px) {
  .mockup-bounds {
    border-left: var(--ui-panel-border-soft);
    border-right: var(--ui-panel-border-soft);
  }
}

@media (min-width: 768px) and (max-width: 1599px) {
  .mockup-bounds {
    border-top: var(--ui-panel-border-soft);
    border-bottom: var(--ui-panel-border-soft);
  }
}
</style>
