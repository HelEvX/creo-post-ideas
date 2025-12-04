<template>
  <div class="format-selector-bar">
    <button
      v-for="f in formats"
      :key="f.id"
      type="button"
      :class="['format-selector-bar__btn', f.id === modelValue ? 'btn-secondary btn-active' : 'btn-inactive']"
      @click="select(f.id)">
      <span class="format-selector-bar__icon"><i :class="f.icon"></i></span>
      <span>{{ f.label }}</span>
    </button>
  </div>
</template>

<script setup>
defineProps({
  modelValue: { type: String, default: "portrait" },
});

const emit = defineEmits(["update:size"]);

const formats = [
  { id: "square", label: "Square", icon: "fa-solid fa-square" },
  { id: "landscape", label: "Landscape", icon: "fa-regular fa-image" },
  { id: "portrait", label: "Portrait", icon: "fa-solid fa-image-portrait" },
  { id: "story", label: "Story", icon: "fa-regular fa-id-badge" },
  // { id: "cover", label: "Banner", icon: "fa-solid fa-panorama" },
];

function select(id) {
  emit("update:size", id);
}
</script>

<style scoped>
.format-selector-bar {
  display: flex;
  justify-content: center;
  gap: 1.6rem;
  padding: var(--space-5) 0;
  background: var(--ui-alt-section-bg);
  border: var(--ui-panel-border-soft);
  border-radius: var(--radius-md);
  /* box-shadow: var(--shadow); */
}

.format-selector-bar__btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  max-width: 12rem;
  padding: var(--space-10) var(--space-20);
}

.format-selector-bar__icon i {
  font-size: 1.6rem;
  line-height: 1;
}
</style>
