<template>
  <div class="format-selector-bar">
    <div class="safe-div">
      <label class="safezone-toggle">
        <input type="checkbox" :checked="showSafeZones" @change="emit('update:safeZones', $event.target.checked)" />
        Marges
      </label>
    </div>

    <div class="format-selector-bar__buttons">
      <button
        v-for="f in formats"
        :key="f.id"
        type="button"
        :class="['format-selector-bar__btn', f.id === modelValue ? 'btn-secondary btn-active' : 'btn-inactive']"
        @click="select(f.id)">
        <span class="format-selector-bar__icon"><i :class="f.icon"></i></span>
        <span class="format-selector-bar__label">{{ f.label }}</span>
      </button>
    </div>

    <div class="empty-div"></div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: { type: String, default: "portrait" },
  showSafeZones: { type: Boolean, default: false },
});

const emit = defineEmits(["update:size", "update:safeZones"]);

const formats = [
  { id: "portrait", label: "Portrait", icon: "fa-solid fa-image-portrait" },
  { id: "square", label: "Square", icon: "fa-solid fa-square" },
  { id: "landscape", label: "Landscape", icon: "fa-regular fa-image" },
  { id: "story", label: "Story", icon: "fa-regular fa-id-badge" },
];

function select(id) {
  emit("update:size", id);
}
</script>

<style scoped>
.format-selector-bar {
  display: flex;
  justify-content: space-between;
  padding: var(--space-5);
  background: var(--ui-alt-section-bg);
  border: var(--ui-panel-border-soft);
  border-radius: var(--radius-md);
}
.format-selector-bar__buttons {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--space-10);
  flex: 1 1 80%;
}

.safe-div,
.empty-div {
  flex: 1 0 10%;
}

@media (max-width: 430px) {
  .empty-div {
    display: none;
  }
}

.format-selector-bar__btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  max-width: 12rem;
}

@media (max-width: 767.98px) {
  .format-selector-bar__btn {
    max-width: 6rem;
    padding: 0;
  }
  .format-selector-bar__label {
    display: none;
  }
}

.format-selector-bar__icon i {
  font-size: var(--fs-body);
  line-height: 1;
}

.safezone-toggle {
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: flex-end;
  gap: var(--space-10);
  text-align: center;
  color: inherit;
  opacity: 0.8;
  padding: var(--space-10);
  font-size: var(--fs-body-xxs);
  line-height: 1;
  margin: 0;
}

.safezone-toggle input {
  cursor: pointer;
  height: 2rem;
  width: auto;
  accent-color: var(--ui-accent-hover);
}
</style>
