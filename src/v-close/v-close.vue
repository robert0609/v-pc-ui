<template>
  <div class="v-close">X</div>
</template>

<script>
export default {
  name: 'v-close',
  methods: {
    setZIndex(zIndex) {
      this.$refs.background.style.zIndex = zIndex;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../static/style/fn.scss";
// 关闭按钮
.v-close{
  display: inline-block;
  vertical-align: top;
  width: 18px;
  height: 18px;
  padding: 5px;
  font-size: 0;
  color: transparent;
  background: url(./static/close.png) no-repeat center center;
  background-size: 18px;
  transition: transform .3s;
  &:hover{
    opacity: .8;
    cursor: pointer;
    transform: rotate(180deg);
  }
}
</style>
