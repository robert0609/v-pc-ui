<template>
  <div :style="{ 'background-image': `url(${innerSrc})` }"></div>
</template>

<script>
import imageLoader from './imageLoader';
import $ from 'v-utility';

export default {
  name: 'background-image',
  data() {
    return {
      innerSrc: '',
      guid: '',
    };
  },
  props: {
		src: {
			type: String,
			default: ''
		}
  },
  watch: {
    src(newValue) {
      let currentGuid = $.guid();
      this.guid = currentGuid;
      imageLoader.loadPromise(newValue).then(() => {
        if (this.guid === currentGuid) {
          this.innerSrc = newValue;
          this.$emit('load');
        }
      }).catch(() => {
        if (this.guid === currentGuid) {
          this.innerSrc = newValue;
          this.$emit('error');
        }
      });
    }
  },
	mounted() {
    this.init();
	},
	activated() {
    this.init();
  },
  methods: {
    init() {
      let currentGuid = $.guid();
      this.guid = currentGuid;
      imageLoader.loadPromise(this.src).then(() => {
        if (this.guid === currentGuid) {
          this.innerSrc = this.src;
          this.$emit('load');
        }
      }).catch(() => {
        if (this.guid === currentGuid) {
          this.innerSrc = this.src;
          this.$emit('error');
        }
      });
    }
  }
};
</script>
