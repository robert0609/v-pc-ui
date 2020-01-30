<template>
  <div class="v-sticky">
    <div ref="adsorbSpace" v-show="showSpace"></div>
    <div ref="adsorbPadding" v-show="showAdsorbPadding"></div>
    <div ref="adsorbSection" :class="{fixed: fixedTop}">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import screenManager from '../common/screenManager';

export default {
  name: 'v-adsorb',
  data() {
    return {
      top: 0,
      fixedTop: false,
      isGottenTop: false,
      endFixBottom: 0,
      isGottenBottom: false,
      showAdsorbPadding: false
    };
  },
  props: {
    endFixTopElementId: {
      type: String,
      default: null
    }
  },
  computed: {
    showSpace() {
      return this.fixedTop;
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
      this.top = this.getTop();
      this.endFixBottom = this.getEndFixBottom();
      screenManager.loopAnimationFrame(() => {
        this.top = this.getTop();
        this.endFixBottom = this.getEndFixBottom();
        let invalidEndBottom = this.endFixBottom <= this.top;
        if (invalidEndBottom) {
          // console.log('endFixTopElement bottom is invalid');
        }
        let scrollTop = screenManager.scrollTop;
        let scrollBottom = screenManager.scrollBottom;
        if (scrollTop > this.top) {
          if (invalidEndBottom || scrollBottom < this.endFixBottom) {
            this.showAdsorbPadding = false;
            // this.$refs.adsorbSection.style.top = (scrollTop - this.top) + 'px';
            this.fixedTop = true;
            this.$emit('toggle', {
              fixed: this.fixedTop
            });
          }
          else {
            if (this.showAdsorbPadding) {
              return;
            }
            this.showAdsorbPadding = true;
            this.$refs.adsorbPadding.style.height = (this.endFixBottom - this.top - document.documentElement.clientHeight) + 'px';
            // this.$refs.adsorbSection.style.top = '0px';
            this.fixedTop = false;
            this.$emit('toggle', {
              fixed: this.fixedTop
            });
          }
        }
        else {
          this.showAdsorbPadding = false;
          // this.$refs.adsorbSection.style.top = '0px';
          this.fixedTop = false;
          this.$emit('toggle', {
            fixed: this.fixedTop
          });
        }
      });
    },
    reset() {
      this.isGottenTop = false;
      this.isGottenBottom = false;
      this.top = this.getTop();
      this.endFixBottom = this.getEndFixBottom();
    },
    getTop() {
      if (this.isGottenTop) {
        return this.top;
      }
      let elem = this.$refs.adsorbSection;
      if (elem.offsetWidth === 0 && elem.offsetHeight === 0 && elem.offsetTop === 0 && elem.offsetLeft === 0) {
        return this.top;
      }
      this.isGottenTop = true;
      let { top, width, height } = screenManager.getRectangle(elem, true);
      this.$refs.adsorbSpace.style.width = width + 'px';
      this.$refs.adsorbSpace.style.height = height + 'px';
      return top;
    },
    getEndFixBottom() {
      if (this.isGottenBottom) {
        return this.endFixBottom;
      }
      if (!this.endFixTopElementId) {
        return this.endFixBottom;
      }
      let elem = document.getElementById(this.endFixTopElementId);
      if (elem.offsetWidth === 0 && elem.offsetHeight === 0 && elem.offsetTop === 0 && elem.offsetLeft === 0) {
        return this.endFixBottom;
      }
      this.isGottenBottom = true;
      let { top } = screenManager.getRectangle(elem, true);
      return top;
    }
  }
};
</script>

<style scoped>
.fixed {
  position: fixed;
  top: 0;
}
</style>
