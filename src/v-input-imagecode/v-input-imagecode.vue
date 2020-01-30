<template>
  <div class="v-input-imagecode">
    <v-input class="v-input-imagecode__input" ref="inputImagecode" :id="id" :value="value" :rule="'required|regex:^[\\dA-Za-z]{4}$'" name="图形验证码" placeholder="请输入图形验证码" @input="handleInput" @invalid="handleInvalid"></v-input>
    <div class="v-input-imagecode__img">
      <img :src="innerImageUrl" @click="handleReloadImagecode">
    </div>
  </div>
</template>

<script>
import vInput from '../v-input/v-input.vue';
import { guid } from '../common/guid';

function getImagecodeUrl(url) {
  return url + '?r=' + (new Date()).getTime();
}

export default {
  name: 'v-input-imagecode',
  data() {
    return {
      innerImageUrl: ''
    };
  },
  props: {
    id: {
      type: String,
      default: `imagecode-${guid()}`
    },
    value: {
      type: String,
      default: ''
    },
    imageUrl: {
      type: String,
      required: true
    }
  },
  components: {
    'v-input': vInput
  },
  mounted() {
    this.innerImageUrl = getImagecodeUrl(this.imageUrl);
  },
  methods: {
    getValidResult() {
      return this.$refs.inputImagecode.getValidResult();
    },
    addValidateCallback(cbValid) {
      this.$refs.inputImagecode.addValidateCallback(cbValid);
    },
    alert(message) {
      this.$refs.inputImagecode.alert(message);
    },
    handleInput(value) {
      this.$emit('input', value);
    },
    handleReloadImagecode() {
      this.innerImageUrl = getImagecodeUrl(this.imageUrl);
      this.$refs.inputImagecode.handleClear();
    },
    handleInvalid(e) {
      this.$emit('invalid', e);
    }
  }
};
</script>

<style lang="scss">
@import "../static/style/fn.scss";
.v-input-imagecode{
  display: flex;
  &__input{
    flex: 1 1 auto;
  }
  &__img{
    margin-left: 10px;
    height: 38px;
    width: 120px;
    img{
      height: 100%;
      width: auto;
    }
    &:hover{
      opacity: .8;
      cursor: pointer;
    }
  }
}
</style>
