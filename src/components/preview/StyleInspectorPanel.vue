<template>
  <aside class="main-preview__styles">
    <h6>Stijlkenmerken</h6>

    <div class="main-preview__styles__container">
      <div class="styles__fonts">
        <div class="title-font">{{ titleFont }}</div>
        <div class="body-font">{{ bodyFont }}</div>
      </div>

      <div class="content-type-panel__divider"></div>

      <div class="main-preview__styles__swatches">
        <div
          v-for="(color, index) in swatches"
          :key="index"
          class="main-preview__styles__swatch"
          :style="{ background: color }" />
      </div>

      <div class="content-type-panel__divider"></div>

      <div class="main-preview__styles__corners"></div>
      <div class="main-preview__styles__shadows"></div>
    </div>
  </aside>
</template>

<script setup>
defineProps({
  titleFont: String,
  bodyFont: String,
  swatches: {
    type: Array,
    default: () => [],
  },
});
</script>

<style scoped>
.main-preview__styles {
  padding-right: 0;
}

.main-preview__styles h6 {
  text-align: center;
}

.main-preview__styles__container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.content-type-panel__divider {
  height: 1px;
  width: auto;
  background: var(--color-border-light);
  margin: var(--space-20) var(--space-30) var(--space-30);
}

.title-font {
  font-family: var(--font-title);
  font-weight: var(--fw-title);
  margin-bottom: var(--space-20);
}

.main-preview__styles__swatches {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.main-preview__styles__swatch {
  width: 100%;
  height: 4rem;
  border-radius: var(--radius-sm);
}

.main-preview__styles__corners {
  height: 5rem;
  width: 5rem;
  border-left: var(--ui-swatch-border);
  border-top: var(--ui-swatch-border);
  border-radius: var(--radius-lg) 0 0 0;
  margin: 2rem 3rem 3rem 2rem;
}

.main-preview__styles__shadows {
  height: 6rem;
  width: 6rem;
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow);
  margin: 2rem;
}

@media (max-width: 1599px) {
  .main-preview__styles__container {
    flex-direction: row;
    height: 100%;
  }
  .content-type-panel__divider {
    width: 1px;
    height: auto;
  }
  .main-preview__styles__swatches {
    flex-direction: row;
    gap: 1rem;
  }
  .main-preview__styles__swatch {
    height: 100%;
    width: 4rem;
  }
}
</style>
