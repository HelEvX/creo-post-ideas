<template>
  <div class="mockup-bounds">
    <div class="mockup-scale">
      <slot />
    </div>
  </div>
</template>

<script setup></script>

<style scoped>
/* Fixed bounding box */
.mockup-bounds {
  width: 54rem;
  max-width: 54rem;
  max-height: 110rem;
  height: auto;
  margin: 0 auto;

  display: flex;
  justify-content: center;
  align-items: center;

  /* Prevent scaled content from overflowing */
  overflow: hidden;

  /* This wrapper NEVER scales */
  transform: none;
  transform-origin: top center;
}

/* This element scales like a PNG */
.mockup-scale {
  width: 100%;
  height: 100%;
  transform-origin: top center;
}

/* ==========================
   RESPONSIVE SCALING
   ========================== */

/* Desktop large */
@media (min-width: 1400px) {
  .mockup-scale {
    transform: scale(1);
  }
}

/* Desktop medium */
@media (max-width: 1399px) and (min-width: 1200px) {
  .mockup-scale {
    transform: scale(0.9);
  }
}

/* Desktop small */
@media (max-width: 1199px) and (min-width: 992px) {
  .mockup-scale {
    transform: scale(0.8);
  }
}

/* Tablets */
@media (max-width: 991px) and (min-width: 768px) {
  .mockup-scale {
    transform: scale(0.7);
  }
}

/* Mobile */
@media (max-width: 767px) {
  /* Remove fixed bounding box restrictions */
  .mockup-bounds {
    max-width: 100%;
    max-height: none;
  }

  /* Disable scaling on small screens */
  .mockup-scale {
    transform: none;
  }
}
</style>
