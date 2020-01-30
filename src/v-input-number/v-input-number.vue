<template>
  <div class="v-input-number">
    <div class="v-input-number__minus" :class="{ disabled: value <= min }" @click="handleDecrease">-</div>
    <input class="v-input-number__input" type="text" disabled :value="value">
    <div class="v-input-number__plus" :class="{ disabled: value >= max }" @click="handleIncrease">+</div>
  </div>
</template>

<script>
export default {
  name: 'v-input-number',
  props: {
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 100
    },
    value: {
      type: Number,
      default: 0
    }
  },
  mounted() {
    this.check();
  },
  activated() {
    this.check();
  },
  methods: {
    check() {
      if (this.value < this.min || this.value > this.max) {
        throw new Error('Invalid value, exceeded range!');
      }
    },
    handleIncrease() {
      let newValue = this.value + 1;
      if (newValue > this.max) {
        newValue = this.max;
      }
      this.$emit('input', newValue);
    },
    handleDecrease() {
      let newValue = this.value - 1;
      if (newValue < this.min) {
        newValue = this.min;
      }
      this.$emit('input', newValue);
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../static/style/fn';
.v-input-number {
  display: flex;
  align-items: center;
  &__input {
    display: block;
    flex: 1 1 auto;
    width: 0;
    min-width: 2em;
    margin: 0 10px;
    font-size: 18px;
    color: $colorTitle;
    text-align: center;
    &,&:disabled {
      opacity: 1;
      -webkit-text-fill-color: $colorTitle;
    }
  }
  &__minus,
  &__plus {
    flex: 0 0 auto;
    width: 26px;
    height: 26px;
    background: no-repeat center center;
    background-size: 32px;
    font-size: 0;
    color: transparent;
    border: 1px solid $colorPrimary;
    position: relative;
    cursor: pointer;
    &::before,&::after{
      content: "";
      position: absolute;
      left: 9px;
      top: 12px;
      width: 8px;
      height: 2px;
      background: $colorPrimary;
    }

    &.disabled {
      cursor: default;
      border-color: $colorDisable;
      &::before,&::after{
        background: $colorDisable;
      }
    }
  }
  &__minus {
   &::after{
      display: none;
    }
  }
  &__plus {
    &::after{
      transform: rotate(90deg)
    }
  }
}
</style>
