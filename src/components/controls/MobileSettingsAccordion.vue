<template>
  <div class="mobile-settings-accordion">
    <!-- Accordion Trigger -->
    <button type="button" class="btn-neutral accordion-trigger" @click="toggleAccordion">
      <h6>Instellingen Aanpassen</h6>
      <span class="chevron" :class="{ open: isAccordionOpen }"><i class="fa-solid fa-caret-down"></i></span>
    </button>

    <!-- Accordion Panel -->
    <div class="accordion-panel" :class="{ open: isAccordionOpen }">
      <div class="accordion-surface">
        <!-- Tabs -->
        <div class="tabs">
          <button
            type="button"
            :class="activeTab === 'inhoud' ? 'btn-primary' : 'btn-inactive'"
            @click="activeTab = 'inhoud'">
            Inhoud
          </button>
          <button
            type="button"
            :class="activeTab === 'achtergrond' ? 'btn-primary' : 'btn-inactive'"
            @click="activeTab = 'achtergrond'">
            Achtergrond
          </button>
        </div>

        <!-- Tab Content -->
        <aside class="content-type-panel">
          <!-- Inhoud -->
          <div v-if="activeTab === 'inhoud'" class="content-type-panel__content">
            <div class="content-type-panel__buttons">
              <button
                v-for="type in types"
                :key="type.id"
                type="button"
                :class="[
                  'content-type-panel__btn',
                  props.selectedPostType === type.id ? 'btn-primary btn-active' : 'btn-inactive',
                ]"
                :aria-label="type.label"
                @click="emit('select', type.id)">
                <i :class="type.icon" aria-hidden="true"></i>
              </button>
            </div>
          </div>

          <!-- Achtergrond -->
          <div v-if="activeTab === 'achtergrond'" class="content-type-panel__bg">
            <div class="content-type-panel__bg__toggle-section">
              <label class="colored-check">
                <input
                  type="checkbox"
                  class="colored-check__input"
                  :checked="colored"
                  @change="emit('update-colored', $event.target.checked)" />
                <span>Kleurrijk</span>
              </label>

              <BackgroundToggle :tone="backgroundTone" @change="emit('update-tone', $event)" />
            </div>
            <div class="content-type-panel__bg__button-row">
              <button
                v-for="mode in modes"
                :key="mode.id"
                type="button"
                :class="[
                  'content-type-panel__btn',
                  backgroundMode === mode.id ? 'btn-primary btn-active' : 'btn-inactive',
                ]"
                :aria-label="mode.label"
                @click="emit('update-mode', mode.id)">
                <i :class="mode.icon" aria-hidden="true"></i>
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import BackgroundToggle from "./BackgroundToggle.vue";

const props = defineProps({
  selectedPostType: String,
  backgroundTone: String,
  backgroundMode: String,
  colored: Boolean,
});

const emit = defineEmits(["select", "update-tone", "update-mode", "update-colored"]);

const isAccordionOpen = ref(false);
const activeTab = ref("inhoud");

function toggleAccordion() {
  isAccordionOpen.value = !isAccordionOpen.value;
}

const types = ref([
  { id: "info", label: "Info", icon: "fa-solid fa-circle-info" },
  { id: "headline", label: "Titel", icon: "fa-solid fa-heading" },
  { id: "intro", label: "Intro", icon: "fa-solid fa-door-open" },
  { id: "quote", label: "Quote", icon: "fa-solid fa-quote-right" },
  { id: "product", label: "Product", icon: "fa-solid fa-box" },
  { id: "paragraph", label: "Paragraaf", icon: "fa-solid fa-align-left" },
]);

const modes = ref([
  { id: "none", label: "Effen", icon: "fa-solid fa-square" },
  { id: "logo", label: "Logo", icon: "fa-solid fa-copyright" },
  { id: "pattern", label: "Patroon", icon: "fa-solid fa-border-all" },
  { id: "image", label: "Afbeelding", icon: "fa-solid fa-image" },
]);
</script>

<style scoped>
.btn-neutral.accordion-trigger {
  border-radius: var(--radius-md) var(--radius-md) 0 0;
}
.mobile-settings-accordion {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0;
  height: auto;
}

.accordion-panel {
  overflow: hidden;
  max-height: 0;
  opacity: 0;
  transition: var(--transition-default);
}

.accordion-panel.open {
  max-height: 1000px;
  opacity: 1;
}

.accordion-surface {
  background: var(--ui-alt-section-bg);
  border: var(--ui-panel-border-soft);
  border-top: 0;
  border-radius: 0 0 var(--radius-md) var(--radius-md);
  padding: var(--space-10);
  display: flex;
  flex-direction: column;
  gap: var(--space-10);
}

.accordion-trigger {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.accordion-trigger h6 {
  margin: 0;
}

.chevron {
  transition: var(--transition-default);
}

.chevron.open {
  transform: rotate(180deg);
}

.tabs {
  display: flex;
  gap: 0;
  margin-bottom: var(--space-10);
}

.tabs button {
  flex: 1;
}

.tabs button:first-child {
  border-radius: var(--radius-sm) 0 0 var(--radius-sm);
}
.tabs button:last-child {
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
}

.content-type-panel {
  display: flex;
  justify-content: center;
}

.content-type-panel__bg {
  width: 100%;
  display: flex;
  gap: var(--space-25);
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}

.content-type-panel__bg__toggle-section {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  gap: var(--space-10);
  justify-content: center;
}

.content-type-panel__bg__button-row,
.content-type-panel__buttons {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  gap: var(--space-10);
  justify-content: center;
}

.content-type-panel__btn i {
  font-size: var(--fs-body);
  line-height: 1;
}

/* ===============================
   COLORED CHECKBOX — NATIVE
   =============================== */

.bg-toggle-section {
  margin: var(--space-20) auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
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
  accent-color: var(--ui-accent-hover);
}
</style>
