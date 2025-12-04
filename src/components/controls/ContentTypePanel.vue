<template>
  <aside class="content-type-panel">
    <div class="content-type-panel__title">Content type</div>

    <div class="content-type-panel__buttons">
      <button
        v-for="type in types"
        :key="type.id"
        type="button"
        :class="['content-type-panel__btn', selected === type.id ? 'btn-primary btn-active' : 'btn-inactive']"
        @click="select(type.id)">
        {{ type.label }}
      </button>
    </div>
  </aside>
</template>

<script setup>
const emit = defineEmits(["select"]);

const { selected } = defineProps({
  selected: { type: String, default: "headline" },
});

const types = [
  { id: "info", label: "Info" },
  { id: "headline", label: "Headline" },
  { id: "intro", label: "Intro" },
  { id: "quote", label: "Quote" },
  { id: "product", label: "Product" },
  { id: "paragraph", label: "Paragraph" },
];

function select(id) {
  emit("select", id);
}
</script>

<style scoped>
.content-type-panel {
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

.content-type-panel__btn {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  padding: var(--space-10) var(--space-20);
}
</style>
