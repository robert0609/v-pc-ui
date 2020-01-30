<template>
  <nav class="v-pagination" v-show="totalPageCount > 1">
    <ul>
      <li class="btn" :class="{ disable: currentPageIndex === firstPageIndex }" @click="handlePrev"></li>
      <template v-if="totalPageCount > 10">
        <li :class="{ 'current': firstPageIndex === currentPageIndex }" @click="handlePageIndex(firstPageIndex)">{{firstPageIndex + 1}}</li>
        <li class="more" v-if="displayIndexRange.displayStartIndex - firstPageIndex > 1">...</li>
        <li v-for="index in (displayIndexRange.displayLastIndex - displayIndexRange.displayStartIndex + 1)" :key="displayIndexRange.displayStartIndex - 1 + index" :class="{ 'current': displayIndexRange.displayStartIndex - 1 + index === currentPageIndex }" @click="handlePageIndex(displayIndexRange.displayStartIndex - 1 + index)">{{displayIndexRange.displayStartIndex + index}}</li>
        <li class="more" v-if="lastPageIndex - displayIndexRange.displayLastIndex > 1">...</li>
        <li :class="{ 'current': lastPageIndex === currentPageIndex }" @click="handlePageIndex(lastPageIndex)">{{lastPageIndex + 1}}</li>
      </template>
      <template v-else>
        <li v-for="index in totalPageCount" :key="index" :class="{ 'current': index - 1 === currentPageIndex }" @click="handlePageIndex(index - 1)">{{index}}</li>
      </template>
      <li class="btn btn-next" :class="{ disable: currentPageIndex === lastPageIndex }" @click="handleNext"></li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'v-paging',
  data() {
    return {
      currentPageIndex: -1
    };
  },
  props: {
    value: {
      type: Number,
      default: 0
    },
    totalPageCount: {
      type: Number,
      default: 100
    }
  },
  computed: {
    displayIndexRange() {
      let s = this.currentPageIndex - 2;
      let e = this.currentPageIndex + 2;
      if (s < this.firstPageIndex) {
        e += this.firstPageIndex - s;
        s = this.firstPageIndex;
      }
      if (e > this.lastPageIndex) {
        s -= e - this.lastPageIndex;
        e = this.lastPageIndex;
      }
      return {
        displayStartIndex: s === this.firstPageIndex ? (s + 1) : s,
        displayLastIndex: e === this.lastPageIndex ? (e - 1) : e
      };
    },
    firstPageIndex() {
      return 0;
    },
    lastPageIndex() {
      return this.totalPageCount - 1;
    }
  },
  mounted() {
    this.init();
  },
  activated() {
    this.init();
  },
  watch: {
    value(newValue) {
      this.setPageIndex(newValue);
    },
    totalPageCount(newValue) {
      if (this.currentPageIndex >= newValue) {
        this.currentPageIndex = newValue - 1;
        this.$emit('input', this.currentPageIndex);
        this.$emit('loadPage', this.currentPageIndex);
      }
    }
  },
  methods: {
    init() {
      this.setPageIndex(this.value);
    },
    setPageIndex(pageIndex) {
      if (pageIndex < this.firstPageIndex || pageIndex > this.lastPageIndex) {
        throw new Error('pageIndex range error!');
      }
      this.currentPageIndex = pageIndex;
    },
    handlePrev() {
      if (this.currentPageIndex === this.firstPageIndex) {
        return;
      }
      this.currentPageIndex -= 1;
      this.$emit('input', this.currentPageIndex);
      this.$emit('loadPage', this.currentPageIndex);
    },
    handleNext() {
      if (this.currentPageIndex === this.lastPageIndex) {
        return;
      }
      this.currentPageIndex += 1;
      this.$emit('input', this.currentPageIndex);
      this.$emit('loadPage', this.currentPageIndex);
    },
    handlePageIndex(pageIndex) {
      if (this.currentPageIndex === pageIndex) {
        return;
      }
      this.currentPageIndex = pageIndex;
      this.$emit('input', this.currentPageIndex);
      this.$emit('loadPage', this.currentPageIndex);
    }
  }
};
</script>

<style lang="scss">
@import "../static/style/fn.scss";
.v-pagination{
  text-align: center;
  user-select: none;
  // margin: 15px 0;
  li{
    display: inline-block;
    margin: 0 1px;
    padding: 0 5px;
    font-size: 14px;
    line-height: 30px;
    text-align: center;
    cursor: pointer;
    &:hover{
      text-decoration: underline;
    }
    &.current{
      color: $colorPrimary;
      cursor: default;
      text-decoration: none;
    }
    &.more{
      color: $colorDefault;
      cursor: default;
      text-decoration: none;
    }
    &.btn{
      margin: 0 10px;
      width: 30px;
      height: 30px;
      padding: 0;
      color: $colorPrimary;
      border: 1px solid;
      vertical-align: middle;
      background: #fff;
      position: relative;
      &:hover{
        color: $colorActive;
      }
      &::before{
        content: "";
        position: absolute;
        top: 10px;
        width: 8px;
        height: 8px;
        left: 13px;
        border-left: 1px solid;
        border-bottom: 1px solid;
        transform: rotate(45deg)
      }
      &-next::before{
        transform: rotate(-135deg);
        left: 8px;
      }
      &.disable{
        color: #CCC;
        cursor: default;
      }
    }
  }
}

</style>
