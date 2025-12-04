<template>
  <SocialPostMockup :size="size" v-bind="designProps">
    <component :is="currentPost" v-bind="postData" />
  </SocialPostMockup>
</template>

<script setup>
import { computed } from "vue";

import SocialPostMockup from "../mockup/SocialPostMockup.vue";

import InfoPost from "../post-types/InfoPost.vue";
import HeadlinePost from "../post-types/HeadlinePost.vue";
import IntroPost from "../post-types/IntroPost.vue";
import QuotePost from "../post-types/QuotePost.vue";
import ProductPost from "../post-types/ProductPost.vue";
import ParagraphPost from "../post-types/ParagraphPost.vue";
import FallbackPost from "../post-types/FallbackPost.vue";

const { size, postType, postData, designProps } = defineProps({
  size: String,
  postType: String,
  postData: Object,
  designProps: Object,
});

const postMap = {
  info: InfoPost,
  headline: HeadlinePost,
  intro: IntroPost,
  quote: QuotePost,
  product: ProductPost,
  paragraph: ParagraphPost,
};

const currentPost = computed(() => postMap[postType] || FallbackPost);
</script>
