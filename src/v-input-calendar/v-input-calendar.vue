<template>
  <div>
    <input ref="inputCalendar" :name="id" type="text" :readonly="true" :placeholder="placeholder" @click="handleClick" class="v-search__input" :value="displayDate">
    <span ref="spanNights" @click="handleClick">{{displayNights}}</span>
    <v-calendar ref="rawCalendar" v-show="showCalendar" class="v-search__select" @confirm="handleDateConfirm" @clear="handleDateClear" :startDate="startDate" :endDate="endDate" :inventory="inventory" :rule="rule"></v-calendar>
  </div>
</template>

<script>
import mouse from '../common/mouseManager';
import dateManager from '../common/dateManager';
import { guid } from '../common/guid';
import $ from 'v-utility';

export default {
  name: 'v-input-calendar',
  data() {
    return {
      innerStartDate: null,
      innerEndDate: null,
      showCalendar: false
    };
  },
  props: {
    id: {
      type: String,
      default: `calendar-${guid()}`
    },
    value: {
      type: Object,
      default: () => null
    },
    name: {
      type: String,
      default: '入住/离店日期'
    },
    placeholder: {
      type: String,
      default: '请输入入住/离店日期'
    },
    startDate: {
      type: Date,
      default: undefined
    },
    endDate: {
      type: Date,
      default: undefined
    },
    inventory: {
      type: Object,
      default: null
    },
    rule: {
      type: Object,
      default: null
    }
  },
  computed: {
    hasInventory() {
      return this.inventory !== null;
    },
    displayDate() {
      if (this.innerStartDate === null || this.innerEndDate === null) {
        return '';
      }
      else {
        let { year: sy, month: sm, day: sd } = dateManager.getYMD(this.innerStartDate);
        let { year: ey, month: em, day: ed } = dateManager.getYMD(this.innerEndDate);
        return `${sy}-${sm + 1}-${sd} 至 ${ey}-${em + 1}-${ed}`;
      }
    },
    displayNights() {
      if (this.innerStartDate === null || this.innerEndDate === null) {
        return '';
      }
      else {
        let { ymd: sd } = dateManager.getYMD(this.innerStartDate);
        let { ymd: ed } = dateManager.getYMD(this.innerEndDate);
        return `共${(ed - sd) / 86400000}晚`;
      }
    }
  },
  watch: {
    value(newValue) {
      if (this.valueIsNotEmty(newValue)) {
        this.innerStartDate = newValue.startDate;
        this.innerEndDate = newValue.endDate;
      }
      else {
        this.innerStartDate = null;
        this.innerEndDate = null;
      }
    },
    showCalendar(newValue) {
      if (newValue) {
        this.$nextTick(() => {
          if (this.innerStartDate && this.innerEndDate) {
            this.$refs.rawCalendar.activeSelect(this.innerStartDate, this.innerEndDate);
          }
        });
      }
    }
  },
  mounted() {
    this.init();
  },
  activated() {
    this.init();
  },
  beforeDestroy() {
    this.dispose();
  },
  deactivated() {
    this.dispose();
  },
  methods: {
    init() {
      mouse.onLostFocus([this.$refs.inputCalendar, this.$refs.spanNights, this.$refs.rawCalendar.$el], this.handleBlur);
      if (this.valueIsNotEmty(this.value)) {
        this.innerStartDate = this.value.startDate;
        this.innerEndDate = this.value.endDate;
      }
      else {
        this.innerStartDate = null;
        this.innerEndDate = null;
      }
    },
    dispose() {
      mouse.removeLostFocus([this.$refs.inputCalendar, this.$refs.spanNights, this.$refs.rawCalendar.$el], this.handleBlur);
    },
    handleClick() {
      this.showCalendar = true;
    },
    handleBlur() {
      this.showCalendar = false;
    },
    handleDateConfirm(selectDateList, triggerByActive) {
      if (selectDateList.length === 1) {
        // this.innerStartDate = selectDateList[0].date;
        // this.innerEndDate = null;
        return;
      }
      else {
        this.innerStartDate = selectDateList[0].date;
        this.innerEndDate = selectDateList[selectDateList.length - 1].date;
        if (!triggerByActive) {
          this.showCalendar = false;
        }
        this.$emit('input', {
          startDate: this.innerStartDate,
          endDate: this.innerEndDate
        });
        if (this.hasInventory) {
          this.$emit('dateSelected', {
            selectDateList
          });
        }
      }
    },
    handleDateClear() {
      this.$emit('clear');
    },
    valueIsNotEmty(v) {
      let result = false;
      if (v) {
        if ($.checkType(v.startDate) === $.enumType.eDate && $.checkType(v.endDate) === $.enumType.eDate) {
          result = true;
        }
      }
      return result;
    }
  }
};
</script>
