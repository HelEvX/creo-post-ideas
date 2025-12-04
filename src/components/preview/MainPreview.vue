<template>
  <div class="app-main-shell">
    <!-- Format selector -->
    <FormatSelector :modelValue="selectedSize" @update:size="selectedSize = $event" />

    <!-- Main grid -->
    <div class="row main-preview-row">
      <!-- Left sidebar -->
      <div class="col-12 col-lg-2 main-preview__sidebar">
        <ContentTypePanel :selected="selectedPostType" @select="onContentTypeSelect" />
      </div>

      <!-- Preview -->
      <div class="col-12 col-lg-8 main-preview__content">
        <MockupWrapper :size="selectedSize">
          <MockupRenderer
            :size="selectedSize"
            :postType="selectedPostType"
            :postData="activePostData"
            :designProps="{
              backgroundType: selectedBackground,
              usePhoto: usePhoto,
              photoSrc: photoSrc,
              showBrand: true,
              showCornerShapes: true,
              shapesSrc: shapesSrc,
            }" />
        </MockupWrapper>
      </div>

      <!-- Notes (future use) -->
      <div class="col-12 col-lg-2 main-preview__styles">
        <div class="main-preview__styles__title">Current Style</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

import ContentTypePanel from "../controls/ContentTypePanel.vue";
import FormatSelector from "../controls/FormatSelector.vue";
import MockupWrapper from "../preview/MockupWrapper.vue";
import MockupRenderer from "../preview/MockupRenderer.vue";
// import HeadlinePost from "../post-types/HeadlinePost.vue";

import stockImage from "@/assets/img/stockphoto.webp";

const selectedPostType = ref("info");

const activePostData = ref({});

const selectedSize = ref("portrait");
const selectedBackground = ref("midnight-dark");

const photoSrc = ref(stockImage);
const usePhoto = ref(true);

const shapesSrc = "/src/assets/img/shapes0.svg";

const postContent = {
  info: {
    headline: "Welkom bij je creatieve playground!",
    body: "Gebruik het linkerpaneel om verschillende posttypes te testen en te bekijken hoe ze eruit zien.",
  },

  headline: {
    headline: "Win tijd door je processen te automatiseren.",
    subtitle: "Ontdek hoe we jouw bedrijf kunnen ondersteunen.",
    icon: "/icons/chart-up.svg",
  },

  intro: {
    title: "Welkom bij Creo!",
    body: "We bouwen digitale ervaringen die merken versterken en teams efficiënter maken.",
  },

  quote: {
    quote: "De beste software is diegene die je nooit in de weg zit.",
    author: "Sarah De Smet, Project Manager",
  },

  product: {
    name: "Creo Dashboard Suite",
    description: "Een krachtige tool voor inzicht, automatisatie en workflowbeheer.",
    image: "/images/product-example.webp",
    price: "€49 / maand",
  },

  paragraph: {
    title: "Over onze werkwijze",
    body: "Ons team werkt nauw samen met klanten om digitale oplossingen te creëren die echt impact maken.",
  },
};

activePostData.value = postContent.headline;

function onContentTypeSelect(type) {
  selectedPostType.value = type;
  activePostData.value = postContent[type];
}
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
.main-preview__styles {
  padding: 2.5rem;
}

.main-preview__styles__title {
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

  .main-preview__styles {
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
  .main-preview__styles__title {
    margin-top: var(--space-20);
  }
}
</style>
