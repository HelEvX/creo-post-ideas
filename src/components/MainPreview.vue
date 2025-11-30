<template>
  <div class="app-main-shell">
    <!-- Format selector -->
    <FormatSelector :modelValue="selectedSize" @update:size="selectedSize = $event" />

    <!-- Main grid -->
    <div class="row main-preview-row">
      <!-- Left sidebar -->
      <div class="col-3 main-preview__sidebar">
        <ContentTypePanel @select="onContentTypeSelect" />
      </div>

      <!-- Preview -->
      <div class="col-9 col-md-12 main-preview__content">
        <div class="row">
          <!-- Center mockup -->
          <div class="col-8 col-lg-12 main-preview__mockup">
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
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import ContentTypePanel from "./ContentTypePanel.vue";
import SocialPostMockup from "./SocialPostMockup.vue";
import FormatSelector from "./FormatSelector.vue";
import MockupWrapper from "./MockupWrapper.vue";

import { ref } from "vue";
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
</script>

<style scoped>
.app-main-shell {
  display: flex;
  flex-direction: column;
  border-radius: var(--radius-lg);
  gap: 2.5rem;
}

.main-preview-row {
  flex-wrap: nowrap;
}
</style>
