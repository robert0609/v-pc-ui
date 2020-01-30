<template>
  <div class="v-input-select">
    <div class="v-input-select__hd">
      <v-input ref="selectedOption" :rule="rule" :readonly="!enableInput" :value="text" :name="name" :placeholder="placeholder" @click.native="handleToggleOptions" @invalid="handleInvalid" @input="handleInput" @keyup="handleKeyup"></v-input>
      <div class="v-input-select__hd_arrow" ref="arrow" :class="{ 'is-show': showOptions }" @click="handleToggleOptions"></div>
    </div>
    <transition>
      <div class="v-input-select__list" ref="optionList" v-show="showOptions" @mouseenter="handleMouseEnterOptionList">
        <div class="v-input-select__list_item" v-for="(item, index) in filterOptions" :class="{'v-input-select__list_active': index === currentSelectOptionIndex}" :key="item.value" @click="handleSelect(item)">{{item.text}}</div>
      </div>
    </transition>
  </div>
</template>

<script>
import mouse from '../common/mouseManager';
import vInput from '../v-input/v-input.vue';

export default {
  name: 'v-input-select',
  data() {
    return {
      showOptions: false,
      innerInputText: '',
      currentSelectOptionIndex: -1
    };
  },
  props: {
    name: {
      type: String,
      default: '[fieldname]'
    },
    value: {
      type: Number,
      default: -1
    },
    options: {
      type: Array,
      default: () => []
    },
    rule: {
      type: [String, Object],
      default: ''
    },
    readonly: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: ''
    },
    enableInput: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    text() {
      let option = this.options.find(item => item.value === this.value);
      if (option) {
        return option.text;
      }
      else {
        return '';
      }
    },
    filterOptions() {
      if (this.enableInput && this.innerInputText) {
        let options = this.options.filter(elem => elem.text.includes(this.innerInputText));
        return options;
      }
      else {
        return this.options;
      }
    }
  },
  watch: {
    showOptions(newValue) {
      if (!newValue) {
        this.currentSelectOptionIndex = -1;
      }
    }
  },
  mounted() {
    mouse.onLostFocus([this.$refs.selectedOption.$el.querySelector('input'), this.$refs.arrow, this.$refs.optionList], this.handleBlur);
  },
  beforeDestroy() {
    mouse.removeLostFocus([this.$refs.selectedOption.$el.querySelector('input'), this.$refs.arrow, this.$refs.optionList], this.handleBlur);
  },
  methods: {
    getValidResult() {
      return this.$refs.selectedOption.getValidResult();
    },
    addValidateCallback(cbValid) {
      this.$refs.selectedOption.addValidateCallback(cbValid);
    },
    alert(message) {
      this.$refs.selectedOption.alert(message);
    },
    handleToggleOptions() {
      if (this.readonly) {
        return;
      }
      if (this.$refs.selectedOption.hasFocus()) {
        this.showOptions = true;
      }
      else {
        this.showOptions = !this.showOptions;
      }
    },
    handleSelect(item) {
      this.$emit('input', item.value);
      this.showOptions = false;
    },
    handleBlur() {
      this.showOptions = false;
      this.getValidResult().catch(error => {});
    },
    handleInvalid(e) {
      this.$emit('invalid', e);
    },
    handleInput(text) {
      this.innerInputText = text;
    },
    handleKeyup(e) {
      switch (e.key) {
        case 'ArrowDown':
          if (this.currentSelectOptionIndex < this.filterOptions.length) {
            ++this.currentSelectOptionIndex;
          }
          break;
        case 'ArrowUp':
          if (this.currentSelectOptionIndex > -1) {
            --this.currentSelectOptionIndex;
          }
          break;
        case 'Enter':
          if (this.currentSelectOptionIndex > -1 && this.currentSelectOptionIndex < this.filterOptions.length) {
            let item = this.filterOptions[this.currentSelectOptionIndex];
            this.handleSelect(item);
          }
          break;
      }
    },
    handleMouseEnterOptionList() {
      this.currentSelectOptionIndex = -1;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../static/style/fn.scss";
.v-input-select{
  position: relative;
  user-select: none;
  &__hd{
    position: relative;
    .v-input__input{
      cursor: pointer;
    }
    &_arrow{
      position: absolute;
      right: 10px;
      top: 50%;
      margin-top: -3px;
      width: 10px;
      height: 7px;
      transition: transform .3s;
      &::after{
        content: "";
        position: absolute;
        left: 1px;
        top: -3px;
        width: 10*1.4/2*1px;
        height: 10*1.4/2*1px;
        border-left: 1px solid;
        border-bottom: 1px solid;
        transform: rotate(-45deg);
      }
      &.is-show{
        transform: rotate(180deg)
      }
    }
  }
  &__list{
    position: absolute;
    top: 38px;
    left: 1px;
    right: 1px;
    background: #FFFFFF;
    max-height: 400px;
    overflow-y: auto;
    box-shadow: 0 2px 4px 0 rgba(0,0,0,0.14);
    z-index: 6;
    &_item{
      line-height: 30px;
      padding: 0 15px;
      &:hover{
        background: $colorAreaBlack;
        color: $colorPrimary;
        cursor: pointer;
      }
    }
    &_active{
      background: $colorAreaBlack;
      color: $colorPrimary;
      cursor: pointer;
    }
  }
}
</style>
<style lang="scss">
.v-input-select .v-input__input{
  cursor: pointer;
}
</style>
