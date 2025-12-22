<template>
  <aside class="content-type-panel">
    <div>
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

    <div class="panel-alt">
      <label class="colored-check">
        <h6>Kleurrijk</h6>
        <input
          type="checkbox"
          class="colored-check__input"
          :checked="colored"
          @change="emit('update-colored', $event.target.checked)" />
      </label>

      <BackgroundToggle :tone="tone" @change="emit('update-tone', $event)" />
    </div>

    <div>
      <h6>Achtergrond</h6>

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
  { id: "intro", label: "Intro" },
  { id: "quote", label: "Quote" },
  { id: "product", label: "Product" },
  { id: "paragraph", label: "Paragraaf" },
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

@media (min-width: 768px) and (max-width: 1399px) {
  .content-type-panel {
    flex-direction: row;
    align-items: flex-start;
  }

  .content-type-panel__buttons {
    flex-direction: row;
    flex-wrap: wrap;
  }

  .panel-alt {
    border-left: var(--ui-panel-border-soft);
    border-right: var(--ui-panel-border-soft);
    padding: 0 var(--space-20);
  }
}

.content-type-panel__btn {
  display: inline-flex;
  justify-content: stretch;
  padding: var(--space-10) var(--space-20);
}

/* ===============================
   COLORED CHECKBOX — NATIVE
   =============================== */

.colored-check {
  display: flex;
  flex-direction: row;
  justify-content: left;
  gap: var(--space-10);
  margin: var(--space-10) 0 var(--space-20) 0;
}

.colored-check h6 {
  margin: 0;
  text-align: left;
}

/* native checkbox, themed */
.colored-check__input {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: var(--ui-accent-hover);
}
</style>
