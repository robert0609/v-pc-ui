<template>
  <div class="v-input-password">
    <v-input :class="className" class="" ref="inputPassword" type="password" :value="value" :rule="{ rules: { required: true, regex: /^[\da-zA-Z]{6,20}$/} }" :id="id" :name="name" :placeholder="placeholder" @input="handleInput" @invalid="handleInvalid" @showPassword="handleShowPassword" @hidePassword="handleHidePassword">
      <div slot="title">
        <slot name="title-password"></slot>
      </div>
    </v-input>

    <v-input :class="className" class="v-input-password__input" v-if="enableConfirmCheck" ref="inputPasswordAgain" type="confirmedPassword" v-model="passwordAgainValue" @invalid="handleInvalid" name="确认密码" placeholder="请再次输入密码">
      <div slot="title">
        <slot name="title-confirm"></slot>
      </div>
    </v-input>

  </div>
</template>

<script>
import vInput from '../v-input/v-input.vue';
import { guid } from '../common/guid';

export default {
  name: 'v-input-password',
  data() {
    return {
      passwordAgainValue: ''
    };
  },
  props: {
    id: {
      type: String,
      default: `password-${guid()}`
    },
    value: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: '请输入长度为6-20位字母或数字'
    },
    enableConfirmCheck: {
      type: Boolean,
      default: false
    },
    name: {
      type: String,
      default: '密码'
    },
    className: {
      type: String,
      default: ''
    }
  },
  components: {
    'v-input': vInput
  },
  watch: {
    enableConfirmCheck(newValue) {
      if (newValue) {
        this.$nextTick(() => {
          this.$refs.inputPasswordAgain.setConfirmedTarget(this.value);
        });
      }
    }
  },
  methods: {
    getValidResult() {
      return this.checkInput();
    },
    addValidateCallback(cbValid) {
      this.$refs.inputPassword.addValidateCallback(cbValid);
    },
    alert(message) {
      this.$refs.inputPassword.alert(message);
    },
    reset() {
      this.$emit('input', '');
      if (this.enableConfirmCheck) {
        this.passwordAgainValue = '';
      }
    },
    async checkInput() {
      await this.$refs.inputPassword.getValidResult();
      if (this.enableConfirmCheck) {
        await this.$refs.inputPasswordAgain.getValidResult();
      }
    },
    handleInput(value) {
      if (this.enableConfirmCheck) {
        this.$refs.inputPasswordAgain.setConfirmedTarget(value);
      }
      this.$emit('input', value);
    },
    handleShowPassword() {
      if (this.enableConfirmCheck) {
        this.$refs.inputPasswordAgain.handleShowPassword();
      }
    },
    handleHidePassword() {
      if (this.enableConfirmCheck) {
        this.$refs.inputPasswordAgain.handleHidePassword();
      }
    },
    handleInvalid(e) {
      this.$emit('invalid', e);
    }
  }
};
</script>

<style lang="scss">
@import "../static/style/fn.scss";
.v-input-password {
  position: relative;
  .v-input__input{
    padding-right: 30px;
  }
  .v-input__reset{
    right: 48px;
  }
}
</style>
