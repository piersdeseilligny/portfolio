<template>
  <img
    v-if="responsiveData.src || customSrc"
    :src="customSrc || responsiveData.src"
    :srcset="customSrcset || responsiveData.srcset"
    :sizes="sizes"
    :alt="alt"
    :width="width || responsiveData.width || undefined"
    :height="height || responsiveData.height || undefined"
    :loading="loading"
    :decoding="decoding"
    :fetchpriority="fetchpriority"
    :class="imgClass"
    :style="imgStyle"
    @load="$emit('load', $event)"
    @error="$emit('error', $event)"
  />
</template>

<script>
export default {
  name: 'ResponsiveImage',
  props: {
    image: {
      type: Object,
      default: null,
    },
    alt: {
      type: String,
      default: '',
    },
    sizes: {
      type: String,
      default: '100vw',
    },
    width: {
      type: [Number, String],
      default: null,
    },
    height: {
      type: [Number, String],
      default: null,
    },
    loading: {
      type: String,
      default: 'lazy',
    },
    decoding: {
      type: String,
      default: 'async',
    },
    fetchpriority: {
      type: String,
      default: null,
    },
    imgClass: {
      type: [String, Object, Array],
      default: '',
    },
    imgStyle: {
      type: [String, Object],
      default: '',
    },
    customSrc: {
      type: String,
      default: '',
    },
    customSrcset: {
      type: String,
      default: '',
    },
  },
  computed: {
    responsiveData() {
      if (!this.image) {
        return { src: '', srcset: '', width: 0, height: 0, aspectRatio: 1 };
      }
      return this.$responsiveAsset(this.image);
    },
  },
};
</script>

