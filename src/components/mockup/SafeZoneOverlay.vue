<template>
  <div class="safe-zone-overlay" aria-hidden="true">
    <div class="unsafe top"></div>
    <div class="unsafe bottom"></div>
    <div class="unsafe left"></div>
    <div class="unsafe right"></div>
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

.unsafe {
  position: absolute;
  background: var(--white-50);
}

/* top */
.unsafe.top {
  top: 0;
  left: 0;
  right: 0;
  height: var(--safe-top);
  border-bottom: calc(2px * var(--safe-top-enabled)) dotted var(--white);
}

/* bottom */
.unsafe.bottom {
  bottom: 0;
  left: 0;
  right: 0;
  height: var(--safe-bottom);
  border-top: calc(2px * var(--safe-bottom-enabled)) dotted var(--white);
}

/* left */
.unsafe.left {
  top: 0;
  bottom: 0;
  left: 0;
  width: var(--safe-left);
  border-right: calc(2px * var(--safe-left-enabled)) dotted var(--white);
}

/* right */
.unsafe.right {
  top: 0;
  bottom: 0;
  right: 0;
  width: var(--safe-right);
  border-left: calc(2px * var(--safe-right-enabled)) dotted var(--white);
}
</style>
