<template>
  <div class="app-main-shell">
    <!-- Format selector -->
    <FormatSelector :modelValue="selectedSize" @update:size="selectedSize = $event" />

    <!-- Main grid -->
    <div class="row main-preview-row">
      <!-- Left sidebar -->
      <div class="col-12 col-lg-3 main-preview__sidebar">
        <ContentTypePanel @select="onContentTypeSelect" />
      </div>

      <!-- Preview -->
      <div class="col-12 col-lg-6 main-preview__content">
        <MockupWrapper>
          <SocialPostMockup
            :size="selectedSize"
            :backgroundType="selectedBackground"
            :usePhoto="usePhoto"
            :photoSrc="photoSrc"
            :showBrand="true"
            :showCornerShapes="true"
            :showLabel="true"
            :labelSize="selectedLabelSize"
            :labelColor="selectedLabelColor"
            :labelIcon="true"
            :showQuote="showQuote"
            :brandText="brandText"
            :labelText="labelText"
            :title="titleText"
            :subtitle="subtitleText"
            :quote="quoteText"
            :shapesSrc="shapesSrc" />
        </MockupWrapper>
      </div>

      <!-- Notes (future use) -->
      <div class="col-12 col-lg-3 main-preview__notes">
        <div class="main-preview__notes__title">notes</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

import ContentTypePanel from "./ContentTypePanel.vue";
import SocialPostMockup from "./SocialPostMockup.vue";
import FormatSelector from "./FormatSelector.vue";
import MockupWrapper from "./MockupWrapper.vue";

import stockImage from "@/assets/img/stockphoto.webp";

const selectedSize = ref("portrait");
const selectedBackground = ref("midnight-dark");

const selectedLabelSize = ref("large");
const selectedLabelColor = ref("green");

const showQuote = ref(false);

const brandText = ref("Brand text");
const labelText = ref("Label text");
const titleText = ref("Lorem ipsum dolor sit amet consectetur.");
const subtitleText = ref("Lorem ipsum dolor sit amet consectetur.");
const quoteText = ref("This is a quote.");

const photoSrc = ref(stockImage);
const usePhoto = ref(true);

const shapesSrc = "/src/assets/img/shapes0.svg";

// placeholder for future behavior
// function onContentTypeSelect(type) {
//   console.log("content type selected:", type);
// }
</script>

<style scoped>
/* =======================================================
   BASE LAYOUT STYLES (unchanged behavior)
   ======================================================= */

.app-main-shell {
  display: flex;
  flex-direction: column;
  border-radius: var(--radius-lg);
  gap: var(--space-25);
}

/* The main row container */
.main-preview-row {
  align-items: flex-start; /* ensures columns align top on desktop */
  flex-wrap: wrap; /* allows stacking on smaller screens */
}

/* SIDEBAR */
.main-preview__sidebar {
  margin-bottom: var(--space-40); /* spacing when stacked */
}

/* PREVIEW COLUMN */
.main-preview__content {
  margin-left: 0; /* reset mobile spacing */
}

/* NOTES */
.main-preview__notes {
  padding: 2.5rem;
}

.main-preview__notes__title {
  font-size: var(--fs-body-xs);
  font-weight: 700;
  margin-bottom: var(--space-30);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--ui-caption);
}

/* =======================================================
   DESKTOP ≥ 992px (lg breakpoint)
   ======================================================= */

@media (min-width: 992px) {
  .main-preview-row {
    flex-wrap: nowrap; /* no stacking on desktop */
  }

  .main-preview__sidebar {
    margin-bottom: 0; /* sidebar aligns with preview */
  }

  .main-preview__content {
    margin-left: -2.5rem; /* align preview with notes, compensates grid padding */
    border-left: var(--ui-panel-border-soft);
    border-right: var(--ui-panel-border-soft);
  }

  .main-preview__notes {
    padding-left: 2.5rem;
  }
}

/* =======================================================
   TABLETS 768px – 991px (md breakpoint)
   ======================================================= */

@media (max-width: 991px) and (min-width: 768px) {
  .main-preview__sidebar {
    margin-bottom: var(--space-40);
  }

  .main-preview__mockup {
    margin-bottom: var(--space-40);
  }
}

/* =======================================================
   MOBILE < 768px
   ======================================================= */

@media (max-width: 767px) {
  .main-preview__notes__title {
    margin-top: var(--space-20);
  }
}
</style>
