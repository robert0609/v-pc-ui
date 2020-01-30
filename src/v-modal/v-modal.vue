<template>
  <div>
    <transition>
      <!-- 需要用户处理事务，又不希望跳转页面以致打断工作流程时，可以使用 Modal 在当前页面正中打开一个浮层，承载相应的操作 -->
      <!-- 需配合使用 v-mask 组件 -->
      <div ref="content" class="v-modal" v-if="innerShow">
        <div class="v-modal__close" @click="handleClose"><v-close></v-close></div>
        <div class="v-modal__message" v-html="message"></div>
        <div class="v-modal__desc" v-if="desc">{{desc}}</div>
        <div class="v-modal__btn" v-if="buttonList.length > 0">
          <div class="v-modal__btn_item" v-for="(button, index) in buttonList" :key="index" @click="handleClickButton(button.onClick)">{{button.caption}}</div>
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

export default {
  name: 'v-modal',
  data() {
    return {
      innerShow: false
    };
  },
  props: {
    desc: {
      type: String,
      default: ''
    },
    message: {
      type: String,
      default: ''
    },
    buttons: {
      type: Array,
      default: null
    }
  },
  components: {
    vMask,
    vClose
  },
  computed: {
    buttonList() {
      let results = [];
      if (this.buttons) {
        this.buttons.forEach((elem, index) => {
          let { caption = '', onClick = function() { } } = elem;
          results.push({
            caption,
            onClick,
            isLast: index === this.buttons.length - 1
          });
        });
      }
      return results;
    }
  },
  methods: {
    show() {
      this.innerShow = true;
    },
    zIndex(z) {
      this.$refs.content.style.zIndex = 2 * z + 1001;
      this.$refs.background.setZIndex(2 * z + 1000);
    },
    handleClickButton(userClickHandler) {
      let result = userClickHandler();
      if ($.checkType(result) === $.enumType.eBoolean && !result) {
        return;
      }
      this.innerShow = false;
      this.$emit('closed');
    },
    handleClose() {
      this.innerShow = false;
      this.$emit('closed');
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../static/style/fn.scss";
.v-modal{
  position: fixed;
  top: 48%;
  left: 50%;
  transform: translate(-50%,-50%);
  background: #FFF;
  padding: 34px 20px 40px;
  min-width: 360px;
  box-sizing: border-box;
  font-size: 12px;
  line-height: 18px;
  border-radius: 3px;
  box-shadow: 1px 1px 4px 0 rgba(0,0,0,0.10);
  &__message{
    margin-top: 20px;
    font-size: 16px;
    line-height: 26px;
    text-align: center;
  }
  &__desc{
    margin-top: 20px;
    font-size: 14px;
    line-height: 24px;
    color: $colorDesc;
    text-align: center;
  }
  &__close{
    position: absolute;
    right: 5px;
    top: 5px;
  }
  &__btn{
    margin-top: 30px;
    text-align: center;
    &_item{
      display: inline-block;
      cursor: pointer;
      white-space: nowrap;
      font-size: 16px;
      color: #fff;
      line-height: 36px;
      width: 130px;
      border: 1px solid $colorPrimary;
      background: $colorPrimary;
      &+&{
        margin-left: 20px;
        background: #fff;
        color: $colorPrimary;
      }
    }
  }
}
</style>
