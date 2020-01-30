<template>
  <transition @after-enter="handleAfterEnter" @after-leave="handleAfterLeave" name="">
    <div ref="content" class="v-message" v-show="show" type="">{{message}}</div>
  </transition>
</template>

<script>
export default {
  name: 'v-message',
  data() {
    return {
      show: false
    };
  },
  props: {
    message: {
      type: String,
      default: ''
    },
    duration: {
      type: Number,
      default: 3000
    }
  },
  methods: {
    display() {
      if (this.show) {
        return;
      }
      this.show = true;
    },
    zIndex(z) {
      this.$refs.content.style.zIndex = 2 * z + 1001;
    },
    handleAfterEnter() {
      setTimeout(() => {
        this.show = false;
      }, this.duration);
    },
    handleAfterLeave() {
      this.$emit('hidden');
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../static/style/fn.scss";
.v-message{
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  background: #FFF;
  padding: 20px 30px 20px 62px;
  box-sizing: border-box;
  min-width: 280px;
  font-size: 14px;
  line-height: 26px;
  border-radius: 3px;
  box-shadow: $boxDialogShadow;
  &::before{
    content: "";
    position: absolute;
    left: 30px;
    top: 22px;
    width: 22px;
    height: 22px;
    background: url(./src/icon_warning.png) no-repeat center;
    background-size: 22px;
  }
  &[type="success"]::before{
    background-image: url(./src/icon_success.png);
  }
  &[type="error"]::before{
    background-image: url(./src/icon_error.png);
  }
}

.v-fade-enter-active,
.v-fade-leave-active {
  transition: transform .3s;
  // transform: translate(-50%,-100%);
}

.v-fade-enter,
.v-fade-leave-to {
  transform: translate(-50%,120px);
}
</style>
