<template>
  <div class="v-btn" :class="classes"  @click="handleClick">
    <i class="v-btn__loading" v-if="showLoading"></i>
    <slot>按钮</slot>
  </div>
</template>

<script>
export default {
  name: 'v-button',
  data() {
    return {
      showLoading: false
    };
  },
  props: {
    type: {
      type: String,
      default: 'default'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    enableLoading: {
      type: Boolean,
      default: false
    },
    mini: {
      type: Boolean,
      default: false
    },
    gapPadding: {
      type: Boolean,
      default: false
    },
    typeStyle: {
      type: String,
      default: 'primary'
    }
  },
  methods: {
    handleClick(event) {
      if (this.disabled || this.showLoading) {
        return;
      }
      if (this.enableLoading) {
        this.showLoading = true;
      }
      this.$emit('click', {
        hideLoading: () => {
          this.showLoading = false;
        },
        event
      });
    }
  },
  computed: {
    classes() {
      return [
        `v-btn__${this.typeStyle}`,
        {
          'disable': this.disabled,
          'mini': this.mini,
          'gap' : this.gapPadding,
        },
        {
          'handling': this.showLoading
        }
      ];
    }
  }
};

</script>

<style lang="scss">
@import '../static/style/fn';
.v-btn {
	font-size: 16px;
  font-weight: 300;
  line-height: 36px;
  white-space: nowrap;
	text-align: center;
  border: 0;
  border-radius: 0;
  cursor: pointer;
  user-select: none;
  &.mini{
    font-size: 14px;
    line-height: 28px;
  }
  &.gap{
    padding: 0 30px;
  }

  &.disable{
    cursor: default;
  }

  // 主按钮
  &__primary {
    color: #FFF;
    border: 1px solid $colorPrimary;
    background: $colorPrimary;
    &:hover{
      border-color: $colorActive;
      background: $colorActive;
    }
    &.disable{
      border-color: $colorDisable;
      background: $colorDisable;
    }
  }

  // 镂空按钮
	&__default {
    color: $colorPrimary;
    border: 1px solid $colorPrimary;
		&:hover{
      border-color: $colorActive;
    }
    &.disable{
      border-color: $colorDisable;
    }
  }

	// &__primary {
  //   cursor: default;
  //   background: $colorDisable;
  //   &:hover{
  //     background: $colorDisable;
  //     background: $colorDisable;
  //   }
  // }

  // &.handling{
  //   opacity: $colorOpacityButtonActive;
  // }
	// .v-loading-spinner{
	// 	margin-top: -2px;
	// }
}


.v-btn__loading {
  width: 20px;
  height: 20px;
  display: inline-block;
  vertical-align: middle;
  &::before {
    content: "";
    width: 100%;
    height: 100%;
    display: block;
    animation: weuiLoading 1s steps(12, end) infinite;
    background: transparent url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHBhdGggZmlsbD0ibm9uZSIgZD0iTTAgMGgxMDB2MTAwSDB6Ii8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjRTlFOUU5IiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTMwKSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iIzk4OTY5NyIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgzMCAxMDUuOTggNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjOUI5OTlBIiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKDYwIDc1Ljk4IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0EzQTFBMiIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSg5MCA2NSA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNBQkE5QUEiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoMTIwIDU4LjY2IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0IyQjJCMiIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgxNTAgNTQuMDIgNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjQkFCOEI5IiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKDE4MCA1MCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNDMkMwQzEiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTE1MCA0NS45OCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNDQkNCQ0IiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTEyMCA0MS4zNCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNEMkQyRDIiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTkwIDM1IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0RBREFEQSIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgtNjAgMjQuMDIgNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjRTJFMkUyIiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKC0zMCAtNS45OCA2NSkiLz48L3N2Zz4=) no-repeat;
    background-size: 100%;
  }
}

@-webkit-keyframes weuiLoading {
  0% {
    transform: rotate3d(0, 0, 1, 0deg);
  }
  100% {
    transform: rotate3d(0, 0, 1, 360deg);
  }
}

@keyframes weuiLoading {
  0% {
    transform: rotate3d(0, 0, 1, 0deg);
  }
  100% {
    transform: rotate3d(0, 0, 1, 360deg);
  }
}

</style>
