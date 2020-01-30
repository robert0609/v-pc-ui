<template>
  <div>
    <slot name="title"></slot>
    <div class="v-input">
      <input class="v-input__input" ref="innerInput" v-model="innerValue" v-if="type.toLowerCase() === 'text'" type="text" v-validate="rule" :readonly="readonly" :disabled="disabled" :data-vv-as="name" :name="id" :placeholder="placeholder" @focus="handleFocus" @blur="handleBlur" @keyup="handleKeyup">

      <input class="v-input__input" ref="innerInput" v-model="innerValue" v-if="type.toLowerCase() === 'password'" type="password" v-validate="rule" :readonly="readonly" :disabled="disabled" :data-vv-as="name" :name="id" :placeholder="placeholder" @focus="handleFocus" @blur="handleBlur" @keyup="handleKeyup">

      <!--由于vee-validate在版本2.0.0-rc.7之后的版本中，confirmed校验要求比较的两个field存在与同一个vm组件中，因此这里增加一个隐藏field用来缓存比较的字段数据-->
      <input v-model="confirmedTargetField.value" v-if="type.toLowerCase() === 'confirmedpassword'" type="hidden" :name="confirmedTargetField.id">
      <input class="v-input__input" ref="innerInput" v-model="innerValue" v-if="type.toLowerCase() === 'confirmedpassword'" type="password" v-validate="`required|confirmed:${confirmedTargetField.id}`" :readonly="readonly" :disabled="disabled" :data-vv-as="name" :name="id" :placeholder="placeholder" @focus="handleFocus" @blur="handleBlur" @keyup="handleKeyup">

      <input class="v-input__input" ref="innerInput" v-model="innerValue" v-if="type.toLowerCase() === 'tel'" type="tel" v-validate="rule" :readonly="readonly" :disabled="disabled" :data-vv-as="name" :name="id" :placeholder="placeholder" @focus="handleFocus" @blur="handleBlur" @keyup="handleKeyup">

      <input class="v-input__input" ref="innerInput" v-model="innerValue" v-if="type.toLowerCase() === 'hidden'" type="hidden" v-validate="rule" :readonly="readonly" :disabled="disabled" :data-vv-as="name" :name="id">

      <!-- <div class="v-input__reset">X</div> -->
      <template v-if="enablePasswordShowHide && type.toLowerCase() === 'password'">
        <div class="v-input__visable" v-show="!passwordDisplayStatus" @click="handleShowPassword">显示</div>
        <div class="v-input__visable is-hidden" v-show="passwordDisplayStatus" @click="handleHidePassword">隐藏</div>
      </template>
      <div class="v-input__tips" v-if="!!errorMessage && type.toLowerCase() !== 'hidden'">{{errorMessage}}</div>
    </div>
  </div>
</template>

<script>
import { guid } from '../common/guid';
import $ from 'v-utility';

export default {
  name: 'v-input',
  data() {
    return {
      innerValue: this.value,
      innerHasFocus: false,
      errorMessage: '',
      passwordDisplayStatus: false,
      validateCallbackList: [],
      confirmedTargetField: {
        value: '',
        id: `hidden-${guid()}`
      }
    };
  },
  props: {
    id: {
      type: String,
      default: `input-${guid()}`
    },
    name: {
      type: String,
      default: '[fieldname]'
    },
    value: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'text',
      validator: value => ['text', 'password', 'confirmedpassword', 'tel', 'hidden'].findIndex(v => v === value.toLowerCase()) > -1
    },
    placeholder: {
      type: String,
      default: ''
    },
    rule: {
      type: [String, Object],
      default: ''
    },
    readonly: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    enablePasswordShowHide: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    value() {
      this.innerValue = this.value;
    },
    innerValue() {
      this.$emit('input', this.innerValue);
      this.errorMessage = '';
    }
  },
  methods: {
    async getValidResult() {
      let result = await this.$validator.validateAll();
      if (result) {
        this.errorMessage = '';
      }
      else {
        let validResult = this.errors.all();
        this.errorMessage = validResult[0];
        this.$emit('invalid', {
          message: validResult[0],
          cancelDefault: () => {
            this.errorMessage = '';
          }
        });
        throw {
          validResult,
          message: validResult[0]
        };
      }

      //处理自定义的校验
      try {
        await Promise.all(this.validateCallbackList.map(elem => {
          let prom = elem.call();
          if (prom instanceof Promise) {
            return prom;
          }
          else {
            return Promise.resolve();
          }
        }));
        this.errorMessage = '';
      }
      catch (ex) {
        this.errorMessage = ex.message;
        this.$emit('invalid', {
          message: ex.message,
          cancelDefault: () => {
            this.errorMessage = '';
          }
        });
        throw {
          message: ex.message
        };
      }
    },
    addValidateCallback(cbValid) {
      if ($.checkType(cbValid) === $.enumType.eFunction) {
        this.validateCallbackList.push(cbValid);
      }
    },
    alert(message) {
      setTimeout(() => {
        this.errorMessage = message;
      }, 0);
    },
    handleClear() {
      this.innerValue = '';
    },
    handleFocus() {
      if (this.readonly) {
        return;
      }
      this.innerHasFocus = true;
      this.$emit('focus');
    },
    handleBlur() {
      if (this.readonly) {
        return;
      }
      this.innerHasFocus = false;
      this.$emit('blur');
      this.getValidResult().catch(error => {});
    },
    handleShowPassword() {
      this.$refs.innerInput.type = 'text';
      this.passwordDisplayStatus = true;
      this.$emit('showPassword');
    },
    handleHidePassword() {
      this.$refs.innerInput.type = 'password';
      this.passwordDisplayStatus = false;
      this.$emit('hidePassword');
    },
    setConfirmedTarget(targetValue) {
      this.confirmedTargetField.value = targetValue;
    },
    hasFocus() {
      return this.innerHasFocus;
    },
    handleKeyup(e) {
      this.$emit('keyup', e);
    }
  }
};
</script>


<style lang="scss">
@import "../static/style/fn.scss";
.v-input {
  position: relative;
  margin-bottom: 25px;
  &__title{
    line-height: 16px;
    margin-bottom: 10px;
  }
  &__input {
    display: block;
    width: 100%;
    box-sizing: border-box;
    padding: 10px 15px;
    height: 38px;
    border: 1px solid $colorBorder;
    outline: none;
    font-size: inherit;
    color: inherit;
    background: transparent;
    &:focus{
      border-color: $colorPrimary;
    }
    &[disabled="disabled"]{
      background: $colorBorder;
      user-select: none;
    }
    &[type="password"]{
      padding-right: 48px;
    }
    &.error{
      border-color: $colorWarn;
    }
  }
  &__reset {
    position: absolute;
    top: 50%;
    right: 15px;
    margin-top: -9px;
    width: 18px;
    height: 18px;
    color: transparent;
    background: url("./static/img/close_icon.png") no-repeat center center;
    background-size: contain;
    cursor: pointer;
  }
  &__tips{
    position: absolute;
    margin-top: 5px;
    font-size: 12px;
    line-height: 14px;
    color: $colorWarn;
    white-space: nowrap;
  }
  &__visable{
    position: absolute;
    right: 15px;
    width: 20px;
    height: 20px;
    top: 9px;
    color: transparent;
    font-size: 0;
    background: url(./static/img/icon_password_visable.png) no-repeat center center;
    background-size: contain;
    cursor: pointer;
    &.is-hidden{
      background-image: url(./static/img/icon_password_invisible.png);
    }
  }
}
</style>
