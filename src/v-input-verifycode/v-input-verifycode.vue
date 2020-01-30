<template>
  <div class="v-input-code">
    <v-input class="v-input-code__input" ref="inputVerifycode" :id="id" :value="value" :rule="'required'" name="短信验证码" placeholder="请输入短信验证码" @input="handleInput" @invalid="handleInvalid"></v-input>
    <div class="v-input-code__btn" v-if="remainSeconds === 0" @click="handleSendVerifycode">获取动态码</div>
    <div class="v-input-code__btn" v-else disabled>{{remainSeconds}}s后重新获取</div>
  </div>
</template>

<script>
import $ from 'v-utility';
import vInput from '../v-input/v-input.vue';
import { guid } from '../common/guid';

function startCountDown(seconds, callbackPerSecond) {
  countDownIntervalId = setInterval(() => {
    --seconds;
    callbackPerSecond({
      remain: seconds
    });
    if (seconds === 0) {
      clearInterval(countDownIntervalId);
      countDownIntervalId = null;
    }
  }, 1000);
}

const totalCountDownSeconds = 60;
let countDownIntervalId = null;

export default {
  name: 'v-input-verifycode',
  data() {
    return {
      remainSeconds: 0
    };
  },
  props: {
    id: {
      type: String,
      default: `verifycode-${guid()}`
    },
    value: {
      type: String,
      default: ''
    }
  },
  components: {
    'v-input': vInput
  },
  mounted() {
  },
  methods: {
    getValidResult() {
      return this.$refs.inputVerifycode.getValidResult();
    },
    addValidateCallback(cbValid) {
      this.$refs.inputVerifycode.addValidateCallback(cbValid);
    },
    alert(message) {
      this.$refs.inputVerifycode.alert(message);
    },
    handleInput(value) {
      this.$emit('input', value);
    },
    handleInvalid(e) {
      this.$emit('invalid', e);
    },
    handleSendVerifycode() {
      this.$emit('sendVerifyCode', {
        returnResult: (result) => {
          if ($.checkType(result) === $.enumType.eBoolean && !result) {
            return;
          }
          this.$emit('input', '');
          this.beginCountDown();
        }
      });
    },
    beginCountDown() {
      if (countDownIntervalId) {
        return;
      }
      this.remainSeconds = totalCountDownSeconds;
      startCountDown(this.remainSeconds, ({ remain }) => {
        this.remainSeconds = remain;
      });
    },
    endCountDown() {
      if (countDownIntervalId) {
        clearInterval(countDownIntervalId);
        countDownIntervalId = null;
        this.remainSeconds = 0;
      }
    }
  }
};
</script>

<style lang="scss">
@import "../static/style/fn.scss";
.v-input-code{
  display: flex;
  &__input{
    flex: 1 1 auto;
  }
  &__btn{
    margin-left: 10px;
    height: 36px;
    font-size: 14px;
    line-height: 36px;
    color: $colorPrimary;
    border: 1px solid $colorPrimary;
    width: 118px;
    white-space: nowrap;
    text-align: center;
    &:hover{
      color: $colorActive;
      border-color: $colorActive;
      cursor: pointer;
    }
    &[disabled]{
      border-color: #ccc;
      color: $colorDisable;
      cursor: default;
    }
  }
}
</style>

