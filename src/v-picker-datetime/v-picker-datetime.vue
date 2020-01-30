<template>
  <div class="v-picker-datetime">
    <v-input-select ref="selectYear" v-model="year" :readonly="readonly" :rule="rule" name="年" :options="years" placeholder="" @invalid="handleInvalid"></v-input-select><div class="v-picker-datetime__dd">年</div>
    <v-input-select ref="selectMonth" v-model="month" :readonly="readonly" :rule="rule" name="月" :options="months" placeholder="" @invalid="handleInvalid"></v-input-select><div class="v-picker-datetime__dd">月</div>
    <v-input-select ref="selectDay" v-model="day" :readonly="readonly" :rule="rule" name="日" :options="days" placeholder="" @invalid="handleInvalid"></v-input-select><div class="v-picker-datetime__dd">日</div>
    <div class="v-select__tips" v-if="!!errorMessage">{{errorMessage}}</div>
  </div>
</template>

<script>
import dateManager from '../common/dateManager';

function endDate() {
  let y = new Date().getFullYear();
  let date = new Date(y + 11, 0, 1);
  date.setSeconds(date.getSeconds() - 1);
  return date;
}

function checkRange(s, e) {
  if (e.getTime() - s.getTime() <= 0) {
    throw new Error('Select date range is error!');
  }
}

export default {
  name: 'v-picker-datetime',
  data() {
    return {
      year: null,
      month: null,
      day: null,
      errorMessage: ''
    };
  },
  props: {
    value: {
      type: Date,
      default: () => new Date()
    },
    readonly: {
      type: Boolean,
      default: false
    },
    range: {
      type: Object,
      default: () => {
        return {
          start: new Date(1970, 0, 1),
          end: endDate()
        };
      }
    },
    require: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    rule() {
      if (this.require) {
        return 'required';
      } else {
        return '';
      }
    },
    startYear() {
      return this.range.start.getFullYear();
    },
    startMonth() {
      return this.range.start.getMonth();
    },
    startDay() {
      return this.range.start.getDate();
    },
    endYear() {
      return this.range.end.getFullYear();
    },
    endMonth() {
      return this.range.end.getMonth();
    },
    endDay() {
      return this.range.end.getDate();
    },
    years() {
      this.year = null;
      this.errorMessage = '';

      checkRange(this.range.start, this.range.end);
      let result = [];
      let sy = this.range.start.getFullYear();
      let ey = this.range.end.getFullYear();
      while (sy <= ey) {
        result.push({
          value: sy,
          text: sy.toString()
        });
        ++sy;
      }
      return result;
    },
    months() {
      this.month = null;
      this.errorMessage = '';

      if (this.year) {
        checkRange(this.range.start, this.range.end);
        let result = [];
        for (let m = 0; m < 12; ++m) {
          if (this.year === this.startYear && m < this.startMonth) {
            continue;
          }
          if (this.year === this.endYear && m > this.endMonth) {
            break;
          }
          result.push({
            value: m,
            text: (m + 1).toString()
          });
        }
        return result;
      }
    },
    days() {
      this.day = null;
      this.errorMessage = '';
      if (this.year && this.month !== null && this.month !== undefined) {
        checkRange(this.range.start, this.range.end);
        let result = [];
        for (
          let d = 0;
          d < dateManager.getDayCount(this.year, this.month);
          ++d
        ) {
          if (this.year === this.startYear && this.month === this.startMonth && (d + 1) < this.startDay) {
            continue;
          }
          if (this.year === this.endYear && this.month === this.endMonth && (d + 1) > this.endDay) {
            break;
          }
          result.push({
            value: d + 1,
            text: (d + 1).toString()
          });
        }
        return result;
      }
    }
  },
  watch: {
    day(newValue) {
      if (newValue) {
        this.errorMessage = '';
        this.$emit('input', new Date(this.year, this.month, this.day));
      }
    },
    value(newValue) {
      this.setCurrentDate(newValue);
    }
  },
  mounted() {
    this.init();
  },
  activated() {
    this.init();
  },
  methods: {
    init() {
      this.setCurrentDate(this.value);
    },
    setCurrentDate(date) {
      if (!date) {
        return;
      }
      if (date - this.range.start < 0 || date - this.range.end > 0) {
        return;
      }
      this.year = date.getFullYear();
      this.$nextTick(() => {
        this.month = date.getMonth();
        this.$nextTick(() => {
          this.day = date.getDate();
        });
      });
    },
    async checkInput() {
      await this.$refs.selectYear.getValidResult();
      await this.$refs.selectMonth.getValidResult();
      await this.$refs.selectDay.getValidResult();
    },
    getValidResult() {
      return this.checkInput();
    },
    alert(message) {
      setTimeout(() => {
        this.errorMessage = message;
      }, 0);
    },
    handleInvalid(e) {
      e.cancelDefault();
      this.errorMessage = e.message;
      this.$emit('invalid', {
        message: e.message,
        cancelDefault: () => {
          this.errorMessage = '';
        }
      });
    }
  }
};
</script>

<style lang="scss">
@import "../static/style/fn.scss";
.v-picker-datetime{
  display: flex;
  position: relative;
  .v-input-select{
    flex: 0 0 auto;
    width: 90px;
  }
  &__dd{
    display: block;
    line-height: 38px;
    margin: 0 10px;
    line-height: 38px;
  }
  .v-select__tips{
    position: absolute;
    left: 0;
    top: 38px;
    margin-top: 5px;
    font-size: 12px;
    line-height: 14px;
    color: $colorWarn;
    white-space: nowrap;
  }
}
</style>
