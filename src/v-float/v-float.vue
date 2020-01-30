<template>
  <div class="v-float">
    <div ref="anchorContent" class="v-float__hd" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
      <slot></slot>
    </div>
    <div ref="floatContent" class="v-float__bd" :class="{ [arrowDirection]: true }" v-if="showFloat" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
      <div class="v-float__bd_box">
        <div class="v-float__bd_arrow" ref="arrow" :direction="arrowDirection"></div>
        <slot name="float"></slot>
      </div>
    </div>
  </div>
</template>

<script>
import screenManager from '../common/screenManager';

const arrowDirection = {
  top: 'top',
  bottom: 'bottom',
  left: 'left',
  right: 'right'
};

export default {
  name: 'v-float',
  data() {
    return {
      showFloat: false,
      arrowDirection: arrowDirection.top
    };
  },
  props: {
    fixedDirection: {
      type: String,
      default: ''
    }
  },
  watch: {
    showFloat(newVal) {
      if (newVal) {
        this.locateFloat();
      }
    }
  },
  methods: {
    handleMouseEnter() {
      this.showFloat = true;
    },
    handleMouseLeave() {
      this.showFloat = false;
    },
    locateFloat() {
      this.$nextTick(() => {
        let anchorRectangle = screenManager.getRectangle(this.$refs.anchorContent, true);
        let floatRectangle = screenManager.getRectangle(this.$refs.floatContent, true);
        let viewPort = screenManager.viewPort;
        let scrollTop = screenManager.scrollTop;
        let scrollLeft = screenManager.scrollLeft;

        let fitLeft = 0, fitTop = 0;
        if (this.fixedDirection) {
          //固定方向的场景
          switch (this.fixedDirection) {
            case arrowDirection.bottom:
              fitTop = floatRectangle.height + anchorRectangle.height;
              this.arrowDirection = arrowDirection.bottom;
              break;
            case arrowDirection.top:
              fitTop = 0;
              this.arrowDirection = arrowDirection.top;
              break;
            case arrowDirection.left:
              fitLeft = 0 - anchorRectangle.width;
              this.arrowDirection = arrowDirection.left;
              break;
            case arrowDirection.right:
              fitLeft = floatRectangle.width;
              this.arrowDirection = arrowDirection.right;
              break;
            default:
              console.log('fixedDirection is invalid!');
              break;
          }
        }
        else {
          if (floatRectangle.bottom > viewPort.height + scrollTop) {
            fitTop = floatRectangle.height + anchorRectangle.height;
            this.arrowDirection = arrowDirection.bottom;
          }
          else {
            fitTop = 0;
            this.arrowDirection = arrowDirection.top;
          }
        }

        if (this.arrowDirection === arrowDirection.bottom || this.arrowDirection === arrowDirection.top) {
          if (floatRectangle.right > viewPort.width + scrollLeft) {
            fitLeft = floatRectangle.right - viewPort.width - scrollLeft;
            this.$refs.arrow.style.left = (anchorRectangle.left + 30 - (floatRectangle.left - fitLeft)) + 'px';
          }
          else {
            fitLeft = 0;
            this.$refs.arrow.style.left = '30px';
          }

          this.$refs.floatContent.style.top = (this.$refs.floatContent.offsetTop - fitTop) + 'px';
          this.$refs.floatContent.style.left = (this.$refs.floatContent.offsetLeft - fitLeft) + 'px';
        }
        else {
          if (floatRectangle.bottom > viewPort.height + scrollTop) {
            fitTop = floatRectangle.bottom - viewPort.height - scrollTop;
            this.$refs.arrow.style.top = (anchorRectangle.top - (floatRectangle.top - fitTop) + anchorRectangle.height / 2) + 'px';
          }
          else {
            fitTop = anchorRectangle.height;
            this.$refs.arrow.style.top = anchorRectangle.height / 2  + 'px';
          }

          this.$refs.floatContent.style.top = (this.$refs.floatContent.offsetTop - fitTop) + 'px';
          this.$refs.floatContent.style.left = (this.$refs.floatContent.offsetLeft - fitLeft) + 'px';
        }
        // console.log({
        //   anchorRectangle,
        //   floatRectangle,
        //   fitLeft,
        //   fitTop,
        //   viewPort,
        //   scrollTop
        // });
      });
    }
  }
};
</script>

<style scoped lang="scss">
@import '../static/style/fn';
.v-float{
  position: relative;
  &__hd{
    cursor: default;
  }
  &__bd{
    position: absolute;
    z-index: 6;
    &.top{
      padding-top: 11px;
    }
    &.bottom{
      padding-bottom: 11px;
    }
    &.left{
      padding-left: 11px;
    }
    &.right{
      padding-right: 11px;
    }
    &_box{
      background: #FFFFFF;
      box-shadow: $boxDialogShadow;
      position: relative;
      // min-width: 60px;
      // min-height: 60px;
    }
    &_arrow{
      position: absolute;
      content: "";
      width: 19px;
      height: 11px;
      background: url("./src/icon_float_arrow.png") no-repeat center;
      background-size: 19px;
      &[direction="top"]{
        top: -11px;
        left: 30px;
      }
      &[direction="bottom"]{
        bottom: -11px;
        left: 30px;
        transform: rotate(180deg);
      }
      &[direction="left"]{
        left: -15px;
        top: 30px;
        transform: rotate(-90deg);
      }
      &[direction="right"]{
        right: -15px;
        top: 30px;
        transform: rotate(90deg);
      }
    }
  }
}
</style>
