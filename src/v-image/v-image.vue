<template>
  <div class="v-img">
    <background-image class="v-img_inner" :style="{ width: width + 'px', height: height + 'px' }" v-if="useBackgroundImage" ref="innerImage" :src="innerSrc" @load="handleLoad" @error="handleError"></background-image>
    <img v-else ref="innerImage" :src="innerSrc" @load="handleLoad" @error="handleError">
  </div>
</template>

<script>
import lazyManager from './lazyManager';
import backgroundImage from './background-image.vue';

function getCurrentScrollTop() {
	let scrollTop = document.documentElement.scrollTop;
	if (scrollTop == 0) {
		scrollTop = document.body.scrollTop;
	}
	return scrollTop;
}

function getRec(elem) {
	let rec = elem.getBoundingClientRect();
	let scrollTop = getCurrentScrollTop();
	return {
		top: scrollTop + rec.top,
		bottom: scrollTop + rec.bottom
	};
}

export default {
	name: 'v-image',
	data() {
		return {
			innerSrc: this.defaultImageUrl,
			top: -1,
			bottom: -1
		};
  },
  components: {
    backgroundImage
  },
	props: {
		src: {
			type: String,
			default: ''
		},
		defaultImageUrl: {
			type: String,
			default: ''
		},
		lazyMode: {
			type: Boolean,
			default: false
    },
    useBackgroundImage: {
      type: Boolean,
      default: false
    },
    width: {
      type: Number,
      default: 400
    },
    height: {
      type: Number,
      default: 300
    }
  },
  watch: {
    src(newValue) {
      if (this.lazyMode) {
        return;
      }
      this.innerSrc = newValue ? encodeURI(newValue) : '';
    }
  },
	methods: {
		handleLoad() {
			//如果加载的是默认的图片则跳过处理
			if (this.innerSrc === this.defaultImageUrl) {
				return;
			}
			if (this.lazyMode) {
				//图片加载成功之后便移除lazy监控列表
				lazyManager.unwatch(this);
			}
		},
		handleError() {
			//如果加载的是默认的图片则跳过处理
			if (this.innerSrc === this.defaultImageUrl) {
				return;
			}
			if (this.lazyMode) {
				//图片加载成功之后便移除lazy监控列表
				lazyManager.unwatch(this);
			}
			this.innerSrc = this.defaultImageUrl;
		},
		load() {
			if (this.lazyMode) {
				this.innerSrc = this.src ? encodeURI(this.src) : '';
			}
    },
    init() {
      if (this.lazyMode) {
        ({ top: this.top, bottom: this.bottom } = getRec(this.useBackgroundImage ? this.$refs.innerImage.$el : this.$refs.innerImage));
        lazyManager.watch(this);
      }
      else {
        this.innerSrc = this.src ? encodeURI(this.src) : '';
      }
    },
    dispose() {
      if (this.lazyMode) {
        lazyManager.unwatch(this);
      }
    }
	},
	mounted() {
    this.init();
	},
	activated() {
    this.init();
	},
	deactivated() {
    this.dispose();
	},
	beforeDestroy() {
    this.dispose();
	}
};
</script>

<style lang="scss">
.v-img{
  &_inner{
    background: transparent no-repeat center center;
    background-size: cover;
  }
}
</style>
