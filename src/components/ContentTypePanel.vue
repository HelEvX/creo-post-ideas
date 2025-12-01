<template>
  <aside class="content-type-panel">
    <div class="content-type-panel__title">Choose content type</div>

    <div class="content-type-panel__buttons">
      <button type="button" @click="select('intro')">Intro</button>

      <button type="button" @click="select('review')">Quote</button>

      <button type="button" @click="select('something-else')">Product</button>

      <button type="button" @click="select('other')">Paragraph</button>
    </div>
  </aside>
</template>

<script setup>
const emit = defineEmits(["select"]);

function select(type) {
  emit("select", type);
}
</script>

<style>
.content-type-panel {
  /* background: var(--ui-panel-bg); */
  /* border-radius: var(--radius-md); */
  padding: 2.5rem;
  margin-left: -2.5rem;
}

.content-type-panel__title {
  font-size: var(--fs-body-xs);
  font-weight: 700;
  margin-bottom: var(--space-30);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--ui-caption);
}

.content-type-panel__buttons {
  display: flex;
  flex-direction: column;
  gap: var(--space-10);
}
</style>
