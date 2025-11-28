<script setup>
defineProps({
  modelValue: { type: String, default: "portrait" },
});

const emit = defineEmits(["update:size"]);

const formats = [
  { id: "square", label: "Square", icon: "▢" },
  { id: "landscape", label: "Landscape", icon: "▭" },
  { id: "portrait", label: "Portrait", icon: "▯" },
  { id: "story", label: "Story", icon: "▭" },
  { id: "cover", label: "Banner", icon: "▭" },
];

function select(id) {
  emit("update:size", id);
}
</script>

<template>
  <div class="format-selector-bar">
    <button
      v-for="f in formats"
      :key="f.id"
      type="button"
      class="format-selector-bar__btn"
      :class="{ active: f.id === modelValue }"
      @click="select(f.id)">
      <span class="format-selector-bar__icon">{{ f.icon }}</span>
      <span>{{ f.label }}</span>
    </button>
  </div>
</template>
