<template>
  <div>
    <transition>
      <!-- 在保留当前页面状态的情况下，告知用户并承载相关操作 -->
      <!-- Dialog 使用与定制性更大的场景，自带关闭按钮，及标题 -->
      <!-- 需配合使用 v-mask 组件 -->
      <div class="v-dialog" ref="content" v-show="innerShow">
        <div class="v-dialog__title">
          <slot name="title"></slot>
        </div>
        <div class="v-dialog__close" @click="handleClose"><v-close></v-close></div>
        <div class="v-dialog__bd">
          <slot></slot>
        </div>
      </div>
    </transition>
    <v-mask ref="background" v-if="innerShow" @click.native="handleClose"></v-mask>
  </div>
</template>

<script>
import $ from 'v-utility';
import vMask from '../v-mask/v-mask';
import vClose from '../v-close/v-close';
import zIndexManager from '../common/zIndexManager';

export default {
  name: 'v-dialog',
  data() {
    return {
      innerShow: false
    };
  },
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  components: {
    vMask,
    vClose
  },
  watch: {
    show(newValue) {
      this.innerShow = newValue;
      if (newValue) {
        zIndexManager.push(this);
      }
      else {
        zIndexManager.remove(this);
      }
    },
    innerShow(newValue) {
      if (newValue) {
        this.$emit('show');
      }
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
      this.innerShow = this.show;
      if (this.show) {
        zIndexManager.push(this);
      }
      else {
        zIndexManager.remove(this);
      }
    },
    handleClose() {
      this.$emit('close');
    },
    zIndex(z) {
      this.$refs.content.style.zIndex = 2 * z + 1001;
      this.$refs.background.setZIndex(2 * z + 1000);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../static/style/fn.scss";
.v-dialog{
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  background: #FFF;
  z-index: 101;
  &__close{
    position: absolute;
    right: 5px;
    top: 5px;
    z-index: 1;
  }
}
</style>
