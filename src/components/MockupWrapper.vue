<template>
  <div class="mockup-bounds">
    <div class="mockup-slot">
      <slot />
    </div>
  </div>
</template>

<style scoped>
/* Fixed preview canvas */
.mockup-bounds {
  width: 54rem; /* your fixed preview width */
  height: 70rem; /* set a stable canvas height */
  max-width: 100%;
  max-height: 100%;
  overflow: hidden;

  /* Anchor content top-left */
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
}

/* Slot container (no scaling logic here) */
.mockup-slot {
  width: 100%;
  height: 100%;

  /* Allows child to size itself naturally */
  display: block;
}
</style>
