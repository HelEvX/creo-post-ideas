<template>
  <aside class="content-type-panel">
    <div class="content-type-panel__content">
      <h6>Inhoud</h6>

      <div class="content-type-panel__buttons">
        <button
          v-for="type in types"
          :key="type.id"
          type="button"
          :class="['content-type-panel__btn', selected === type.id ? 'btn-primary btn-active' : 'btn-inactive']"
          @click="emit('select', type.id)">
          {{ type.label }}
        </button>
      </div>
    </div>

    <div class="content-type-panel__bg">
      <h6>Achtergrond</h6>
      <div class="bg-toggle-section">
        <label class="colored-check">
          <input
            type="checkbox"
            class="colored-check__input"
            :checked="colored"
            @change="emit('update-colored', $event.target.checked)" />
          <span>Kleurrijk</span>
        </label>

        <BackgroundToggle :tone="tone" @change="emit('update-tone', $event)" />
      </div>

      <div class="content-type-panel__buttons">
        <button
          v-for="mode in modes"
          :key="mode.id"
          type="button"
          :class="['content-type-panel__btn', selectedMode === mode.id ? 'btn-primary btn-active' : 'btn-inactive']"
          @click="emit('update-mode', mode.id)">
          {{ mode.label }}
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup>
import BackgroundToggle from "./BackgroundToggle.vue";

const emit = defineEmits(["select", "update-tone", "update-mode", "update-colored"]);

const { selected, tone, selectedMode } = defineProps({
  selected: String,
  tone: String, // "primary" | "secondary"
  colored: {
    type: Boolean,
    default: true,
  },
  selectedMode: String, // "none" | "logo" | "pattern" | "image"
});

const types = [
  { id: "info", label: "Info" },
  { id: "headline", label: "Titel" },
  { id: "intro", label: "Lijst" },
  { id: "quote", label: "Quote" },
  { id: "product", label: "Product" },
  { id: "paragraph", label: "Fotoblok" },
];

const modes = [
  { id: "none", label: "Effen" },
  { id: "logo", label: "Logo" },
  { id: "pattern", label: "Patroon" },
  { id: "image", label: "Afbeelding" },
];
</script>

<style scoped>
.content-type-panel {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--space-30);
  text-align: left;
}

.content-type-panel__buttons {
  display: flex;
  flex-direction: column;
  gap: var(--space-10);
}

.content-type-panel__btn {
  justify-content: stretch;
  padding: var(--space-10) var(--space-20);
}

/* ===============================
   COLORED CHECKBOX — NATIVE
   =============================== */

.bg-toggle-section {
  margin: var(--space-20) auto;
  display: flex;
  flex-wrap: wrap;
  /* flex-direction: column; */
  gap: var(--space-10);
}

.colored-check {
  display: flex;
  flex-direction: row;
  justify-content: left;
  align-items: center;
  gap: var(--space-10);
  margin: 0;
}

.colored-check span {
  font-size: var(--fs-body-sm);
  font-weight: 500;
  line-height: var(--lh-heading);
}

/* native checkbox, themed */
.colored-check__input {
  width: 2.4rem;
  height: 2rem;
  cursor: pointer;
  accent-color: var(--color-primary-dark);
}
</style>
