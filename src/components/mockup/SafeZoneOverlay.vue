<template>
  <div class="safe-zone-overlay" aria-hidden="true">
    <div class="safe-zone-rect"></div>
  </div>
</template>

<script setup>
defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
});
</script>

<style scoped>
.safe-zone-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 20;
}

.safe-zone-overlay::after {
  content: "Safe zone";
  position: absolute;
  top: calc(var(--safe-top) - 1.5rem);
  left: var(--safe-left);
  font-size: 0.75rem;
  opacity: 0.7;
}

.safe-zone-rect {
  position: absolute;
  top: var(--safe-top);
  right: var(--safe-right);
  bottom: var(--safe-bottom);
  left: var(--safe-left);

  outline: 2px dashed rgba(255, 255, 255, 0.7);
  background: rgba(255, 255, 255, 0.08);
}
</style>
