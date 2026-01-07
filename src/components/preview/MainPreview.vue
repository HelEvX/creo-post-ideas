<template>
  <div class="app-main-shell">
    <FormatSelector
      :modelValue="selectedSize"
      :showSafeZones="showSafeZones"
      @update:size="selectedSize = $event"
      @update:safeZones="showSafeZones = $event" />

    <div class="row main-preview-row">
      <!-- SIDEBAR / MOBILE CONTROLS -->
      <div class="col-12 col-lg-10 col-xxl-2 main-preview__sidebar">
        <ContentTypePanel
          v-if="!isMobile"
          :selected="selectedPostType"
          :tone="backgroundTone"
          :colored="colored"
          :selectedMode="backgroundMode"
          :mockupBgContext="mockupBgContext"
          @select="onContentTypeSelect"
          @update-tone="
            backgroundTone = $event;
            emit('update-tone', $event);
          "
          @update-mode="
            backgroundMode = $event;
            emit('update-mode', $event);
          "
          @update-colored="
            useColoredBackground = $event;
            emit('update-colored', $event);
          " />

        <MobileSettingsAccordion
          v-else
          :selectedPostType="selectedPostType"
          :backgroundTone="backgroundTone"
          :backgroundMode="backgroundMode"
          :colored="useColoredBackground"
          @select="onContentTypeSelect"
          @update-tone="
            backgroundTone = $event;
            emit('update-tone', $event);
          "
          @update-mode="
            backgroundMode = $event;
            emit('update-mode', $event);
          "
          @update-colored="
            useColoredBackground = $event;
            emit('update-colored', $event);
          " />
      </div>

      <!-- PREVIEW -->
      <div class="col-12 col-lg-10 col-xl-10 col-xxl-8 main-preview__content">
        <MockupWrapper :size="selectedSize">
          <div class="mockup-stage">
            <!-- EMPTY STATE -->
            <div v-if="!mockupReady" class="mockup-empty-state">
              <img src="@/assets/img/logo-disabled.svg" alt="disabled logo" />
              <p>Instagram post mockups verschijnen hier.</p>
            </div>

            <!-- MOCKUP -->
            <MockupRenderer
              v-if="mockupReady"
              :key="mockupKey"
              :size="selectedSize"
              :postType="selectedPostType"
              :postData="activePostData"
              :backgroundClass="backgroundClass"
              :backgroundTone="backgroundTone"
              :useColoredBackground="useColoredBackground"
              :brandLogo="brandLogo"
              :usePhoto="backgroundMode === 'image'"
              :photoSrc="photoSrc"
              :brandLogoSmall="brandLogoSmall"
              :showSafeZone="showSafeZones"
              @bg-resolved="resolvedBgColors = $event"
              @resolved-styles="resolvedStyles = $event" />
          </div>
        </MockupWrapper>
      </div>

      <div class="col-12 col-lg-2 main-preview__styles" v-if="mockupReady && resolvedStyles">
        <StyleInspectorPanel
          :key="
            [
              brandTokens?.slug || 'default',
              selectedSize,
              selectedPostType,
              backgroundTone,
              backgroundMode,
              useColoredBackground,
            ].join('|')
          "
          :titleFont="resolvedStyles?.fonts?.title"
          :bodyFont="resolvedStyles?.fonts?.body"
          :styles="resolvedStyles" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from "vue";

import ContentTypePanel from "../controls/ContentTypePanel.vue";
import MobileSettingsAccordion from "../controls/MobileSettingsAccordion.vue";

import FormatSelector from "../controls/FormatSelector.vue";
import MockupWrapper from "../preview/MockupWrapper.vue";
import MockupRenderer from "../preview/MockupRenderer.vue";
import StyleInspectorPanel from "../preview/StyleInspectorPanel.vue";

import stockImage from "@/assets/img/stockphoto.webp";
import { postContent } from "@/data/postContent";

/* --------------------------------------------
   EMITS + PROPS
--------------------------------------------- */

const emit = defineEmits(["update-tone", "update-mode", "update-colored"]);

const props = defineProps({
  brandTokens: Object,
  colored: {
    type: Boolean,
    default: true,
  },
  brandSelected: {
    type: Boolean,
    default: false,
  },
});

/* --------------------------------------------
   LOCAL STATE
--------------------------------------------- */

const resolvedBgColors = ref([]);
const resolvedStyles = ref(null);

const selectedPostType = ref("info");
const activePostData = ref({});

/* --------------------------------------------
   INIT
--------------------------------------------- */
activePostData.value = postContent.info;

const backgroundTone = ref("primary"); // "primary" | "secondary"
const backgroundMode = ref("none"); // "none" | "logo" | "pattern" | "image"

const selectedSize = ref("portrait");
const showSafeZones = ref(false);

const useColoredBackground = ref(props.colored);
const photoSrc = ref(stockImage);

/* --------------------------------------------
   RESPONSIVE STATE
--------------------------------------------- */

const isMobile = ref(false);

function updateViewport() {
  isMobile.value = window.innerWidth < 1400;
}

updateViewport();
window.addEventListener("resize", updateViewport);

/* --------------------------------------------
   WATCHERS
--------------------------------------------- */

watch(
  () => props.colored,
  (v) => {
    useColoredBackground.value = v;
  }
);

watch(
  () => props.brandTokens,
  async () => {
    await nextTick();
  }
);

/* --------------------------------------------
   DERIVED / COMPUTED STATE
--------------------------------------------- */

const mockupReady = computed(() => props.brandSelected === true);

const mockupKey = computed(() =>
  [props.brandTokens?.slug || "default", backgroundClass.value, selectedPostType.value, selectedSize.value].join("|")
);

const brandLogoSmall = computed(() => {
  if (!props.brandTokens?.slug) return null;
  return `/highlights/${props.brandTokens.slug}-small.svg`;
});

const brandLogo = computed(() => {
  if (!props.brandTokens?.slug) return null;
  return `/logo-bg/${props.brandTokens.slug}.svg`;
});

const backgroundClass = computed(() => {
  const classes = [];

  if (!useColoredBackground.value) {
    classes.push("bg--plain-neutral");
  } else {
    classes.push(backgroundTone.value === "secondary" ? "bg--plain-secondary" : "bg--plain-primary");
  }

  if (backgroundMode.value === "pattern") classes.push("bg--pattern");
  if (backgroundMode.value === "logo") classes.push("bg--logo");
  if (backgroundMode.value === "image") classes.push("bg--image");

  return classes.join(" ");
});

const mockupBgContext = computed(() => ({
  bgVars: !useColoredBackground.value
    ? ["--ui-alt-section-bg"]
    : resolvedBgColors.value.length
    ? resolvedBgColors.value
    : ["--ui-section-bg"],
}));

/* --------------------------------------------
   EVENT HANDLERS
--------------------------------------------- */
function onContentTypeSelect(type) {
  selectedPostType.value = type;
  activePostData.value = postContent[type];
}
</script>

<style scoped>
.mockup-stage {
  position: relative;
  width: 100%;
  height: 100%;
}

.mockup-stage:not(:has(*)) {
  min-height: 600px;
}

.mockup-stage {
  transition: opacity 0.15s ease;
}

.mockup-stage > * {
  transition: opacity 0.15s ease;
}

.app-main-shell {
  display: flex;
  flex-direction: column;
  border-radius: var(--radius-lg);
  gap: var(--space-25);
}

.main-preview__content {
  padding-top: var(--space-10);
}

@media (min-width: 1400px) {
  .main-preview__content {
    padding-left: 0;
    padding-right: 0;
  }
}

@media (max-width: 1399px) {
  .main-preview__sidebar {
    margin-bottom: var(--space-25);
  }
}

.mockup-stage {
  margin: 0 auto;
}

.mockup-empty-state {
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  text-align: center;
}

.mockup-empty-state p {
  font-size: var(--fs-body-sm);
  color: var(--color-disabled);
  margin: 0;
}

.mockup-empty-state img {
  width: 60%;
}
</style>
