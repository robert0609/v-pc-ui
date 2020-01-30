<template>
  <div class="v-calendar">
    <div class="v-calendar-btn">
      <div class="v-calendar-btn__prev" :class="{ 'diabled': !enablePrevMonth }" @click="handlePrevMonth">&lt;</div>
      <div class="v-calendar-btn__next" :class="{ 'diabled': !enableNextMonth }" @click="handleNextMonth">&gt;</div>
    </div>
    <div class="v-calendar-container" ref="calendarContainer">
      <template v-for="(monthList, year) in displayMonth">
        <template v-for="(dayInfo, month) in monthList">
          <section :key="year + '-' + month" class="v-calendar-month" v-show="dayInfo.monthIndex >= visableStartMonthIndex && dayInfo.monthIndex < visableStartMonthIndex + visableMonthCount">
            <div class="v-calendar-month_title">{{dayInfo['title']}}</div>
            <div class="v-calendar-weekday">
              <div class="v-calendar-weekday__item">日</div>
              <div class="v-calendar-weekday__item">一</div>
              <div class="v-calendar-weekday__item">二</div>
              <div class="v-calendar-weekday__item">三</div>
              <div class="v-calendar-weekday__item">四</div>
              <div class="v-calendar-weekday__item">五</div>
              <div class="v-calendar-weekday__item">六</div>
            </div>
            <div class="v-calendar-days">
              <div class="v-calendar-days__item disabled" v-for="day in dayInfo.startPaddingWeekCount" :key="'startPaddingWeekCount_' + day">
              </div>
              <div class="v-calendar-days__item" :class="dayInfo[day].domStatus" v-for="day in dayInfo.dayCount" :key="day" @click="handleSelect(dayInfo[day])" :ref="`${year}-${month}-${day}`">
                {{getDayDisplayText(Number(year), Number(month), Number(day))}}
                <span class="v-calendar-days__status">{{hasInventory ? (dayInfo[day].price > 0 ? dayInfo[day].price : '/') : ''}}</span>
              </div>
              <div class="v-calendar-days__item disabled" v-for="day in dayInfo.endPaddingWeekCount" :key="'endPaddingWeekCount_' + day">
              </div>
            </div>
          </section>
        </template>
      </template>
    </div>
  </div>
</template>

<script>
import $, { browser } from 'v-utility';
import toast from '../v-message';
import dateManager from '../common/dateManager';

/**
 * inventory库存对象需要实现getInventory方法，该方法接收一个Date类型参数，返回一个对象，该对象包含两个属性：status(Boolean：表示是否该天可订), price(Number：该天积分价格)
 * rule校验规则对象，每个属性的值是一个function，接受两个参数，分别是选择的开始日期和结束日期，该function如果返回false表示校验失败，如果不返回或者返回其他类型任意值，视为校验通过
 */
export default {
  name: 'v-calendar',
  data() {
    return {
      selectStartDate: null,
      selectEndDate: null,
      visableStartMonthIndex: 0,
      visableMonthCount: 2,
      totalMonthCount: 0
    };
  },
  props: {
    startDate: {
      type: Date,
      default: () => dateManager.getYMD(new Date()).ymd
    },
    endDate: {
      type: Date,
      default: () => dateManager.addYear(new Date(), 1)
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
    rangeStartDate() {
      return dateManager.getYMD(this.startDate).ymd;
    },
    rangeEndDate() {
      return dateManager.getYMD(this.endDate).ymd;
    },
    totalRangeDayCount() {
      return (this.rangeEndDate - this.rangeStartDate) / (1000 * 3600 * 24);
    },
    enableNextMonth() {
      return this.visableStartMonthIndex < this.totalMonthCount - this.visableMonthCount;
    },
    enablePrevMonth() {
      return this.visableStartMonthIndex > 0;
    },
    displayMonth() {
      let { year: sy, month: sm } = dateManager.getYMD(this.rangeStartDate);
      let { year: ey, month: em, day: ed } = dateManager.getYMD(this.rangeEndDate);
      let [loopYear, loopMonth] = [sy, sm];
      let monthIndex = -1;
      let result = {};
      while (loopYear < ey || (loopYear === ey && loopMonth <= em)) {
        let dayCount = dateManager.getDayCount(loopYear, loopMonth);
        result[loopYear] = result[loopYear] || {};
        result[loopYear][loopMonth] = result[loopYear][loopMonth] || {};
        for (let i = 1; i <= dayCount; ++i) {
          let loopDate = new Date(loopYear, loopMonth, i);
          let canSelect = loopDate - this.rangeStartDate >= 0 && this.rangeEndDate - loopDate >= 0;
          let isSelectStart = false, isSelectRange = false, isSelectEnd = false;
          if (this.selectStartDate) {
            isSelectStart = loopDate - this.selectStartDate === 0;
            if (this.selectEndDate) {
              isSelectRange = loopDate - this.selectStartDate > 0 && loopDate - this.selectEndDate < 0;
              isSelectEnd = loopDate - this.selectEndDate === 0;
            }
          }
          //如果设置了库存数据，获取价格和可订状态
          let inv = this.hasInventory ? this.inventory.getInventory(loopDate) : null;
          result[loopYear][loopMonth][i] = {
            domStatus: {
              'disabled': !canSelect || (inv && !inv.status),
              'select-start': isSelectStart,
              'select-end': isSelectEnd,
              'select-range': isSelectRange
            },
            date: loopDate,
            canSelect,
            status: inv ? inv.status : true,
            price: inv ? inv.price : 0
          };
        }
        ++monthIndex;
        result[loopYear][loopMonth]['monthIndex'] = monthIndex;
        result[loopYear][loopMonth]['title'] = `${loopYear}年${loopMonth + 1}月`;
        result[loopYear][loopMonth]['dayCount'] = dayCount;
        result[loopYear][loopMonth]['startPaddingWeekCount'] = (new Date(loopYear, loopMonth, 1)).getDay();
        result[loopYear][loopMonth]['endPaddingWeekCount'] = 6 - (new Date(loopYear, loopMonth, dayCount)).getDay();
        //+1 month
        ++loopMonth;
        if (loopMonth > 11) {
          ++loopYear;
          loopMonth = 0;
        }
      }
			/**
			 * 如果设置了库存对象，则需要判断可选范围的最后一天日期的可订状态，因为如果是可订状态，则截止日期要延长一天，以备用户恰好选择了可选范围最后一天作为入住日期；
			 * 如果可选范围最后一天恰好是一个月的最后一天，则截止日期延长一个月；
			 */
      let dayCount = dateManager.getDayCount(ey, em);
      let dayInfo = result[ey][em][ed];
      if (ed === dayCount && dayInfo.status) {
        dayCount = dateManager.getDayCount(loopYear, loopMonth);
        result[loopYear] = result[loopYear] || {};
        result[loopYear][loopMonth] = result[loopYear][loopMonth] || {};
        for (let i = 1; i <= dayCount; ++i) {
          let loopDate = new Date(loopYear, loopMonth, i);
          let isSelectStart = false, isSelectRange = false, isSelectEnd = false;
          if (this.selectStartDate) {
            isSelectStart = loopDate - this.selectStartDate === 0;
            if (this.selectEndDate) {
              isSelectRange = loopDate - this.selectStartDate > 0 && loopDate - this.selectEndDate < 0;
              isSelectEnd = loopDate - this.selectEndDate === 0;
            }
          }
          result[loopYear][loopMonth][i] = {
            domStatus: {
              'disabled': true,
              'select-start': isSelectStart,
              'select-end': isSelectEnd,
              'select-range': isSelectRange
            },
            date: loopDate,
            canSelect: false,
            status: false,
            price: 0
          };
        }
        ++monthIndex;
        result[loopYear][loopMonth]['monthIndex'] = monthIndex;
        result[loopYear][loopMonth]['title'] = `${loopYear}年${loopMonth + 1}月`;
        result[loopYear][loopMonth]['dayCount'] = dayCount;
        result[loopYear][loopMonth]['startPaddingWeekCount'] = (new Date(loopYear, loopMonth, 1)).getDay();
        result[loopYear][loopMonth]['endPaddingWeekCount'] = 6 - (new Date(loopYear, loopMonth, dayCount)).getDay();
      }

      this.totalMonthCount = monthIndex + 1;

      return result;
    }
  },
  mounted() {
    this.checkProps();
  },
  activated() {
    this.checkProps();
  },
  methods: {
    checkProps() {
      if (this.startDate - this.endDate >= 0) {
        throw new Error('startDate could not be bigger than endDate!');
      }
    },
    activeSelect(activeStartDate, activeEndDate) {
      if ($.checkType(activeStartDate) !== $.enumType.eDate) {
        throw new Error('activeStartDate must be Date type!');
      }
      if ($.checkType(activeEndDate) !== $.enumType.eDate) {
        throw new Error('activeEndDate must be Date type!');
      }
      if (activeStartDate - activeEndDate >= 0) {
        throw new Error('activeStartDate could not be bigger than activeEndDate!');
      }
      this.resetSelect();
      let sdateInfo = dateManager.getYMD(activeStartDate);
      this.selectStartDate = sdateInfo.ymd;
      let { year, month, day } = dateManager.getYMD(activeEndDate);
      this.handleSelect(this.displayMonth[year][month][day], true);
      let { year: sy, month: sm } = sdateInfo;
      this.visableStartMonthIndex = this.displayMonth[sy][sm].monthIndex;
    },
    resetSelect() {
      this.selectStartDate = null;
      this.selectEndDate = null;
      this.$emit('clear');
    },
    getDayDisplayText(year, month, day) {
      let { year: ty, month: tm, day: td, ymd: today } = dateManager.getYMD(new Date());
      let span = (new Date(year, month, day)) - today;
      if (span === 0) {
        return '今天';
      }
      else if (span === 86400000) {
        return '明天';
      }
      else {
        return day;
      }
    },
    handleSelect(dateInfo, triggerByActive = false) {
      let selectDate = dateInfo.date;
      let currentSelectStartDate = this.selectStartDate, currentSelectEndDate = this.selectEndDate;
      if ($.checkType(currentSelectStartDate) === $.enumType.eDate && $.checkType(currentSelectEndDate) !== $.enumType.eDate) {
        let compare = currentSelectStartDate - selectDate;
        if (compare > 0) {
          currentSelectEndDate = currentSelectStartDate;
          currentSelectStartDate = selectDate;
        }
        else if (compare < 0) {
          currentSelectEndDate = selectDate;
        }
        else {
          return;
        }
      }
      else {
        //第一次选择日期的情况
        currentSelectStartDate = selectDate;
        currentSelectEndDate = null;
      }

      if (currentSelectEndDate) {
        //第二次选择日期的情况，构建返回选择日历数组的对象数据，包括日期库存价格；同时校验下本次所选的日期范围是否全部可订，离店日期不属于日期范围，可以落在点击范围之外或者不可订状态的日期上
        let { year: sy, month: sm, day: sd } = dateManager.getYMD(currentSelectStartDate);
        let { year: ey, month: em, day: ed } = dateManager.getYMD(currentSelectEndDate);
        let [loopYear, loopMonth, loopDay] = [sy, sm, sd];
        let validate = true;
        let selectDateList = [];
        while (loopYear < ey || (loopYear === ey && loopMonth < em) || (loopYear === ey && loopMonth === em && loopDay < ed)) {
          let dayInfo = this.displayMonth[loopYear][loopMonth][loopDay];
          validate = dayInfo.canSelect && dayInfo.status;
          if (!validate) {
            break;
          }
          selectDateList.push(dayInfo);
          ++loopDay;
          ({ year: loopYear, month: loopMonth, day: loopDay } = dateManager.getYMD(new Date(loopYear, loopMonth, loopDay)));
        }
        if (!validate) {
          toast.show({
            message: '抱歉您选择日期段暂不可订，请重新选择。'
          });
          this.resetSelect();
          return;
        }
        selectDateList.push(this.displayMonth[loopYear][loopMonth][loopDay]);
        //遍历rule对象，进行规则校验
        if (this.rule) {
          for (let key in this.rule) {
            let fn = this.rule[key];
            if ($.checkType(fn) === $.enumType.eFunction) {
              let b = fn.call(this, currentSelectStartDate, currentSelectEndDate);
              if ($.checkType(b) === $.enumType.eBoolean && !b) {
                this.resetSelect();
                return;
              }
            }
          }
        }

        this.selectStartDate = currentSelectStartDate;
        this.selectEndDate = currentSelectEndDate;
        this.$emit('confirm', selectDateList.map((elem, index) => {
          return {
            date: elem.date,
            status: elem.status,
            price: index === selectDateList.length - 1 ? 0 : elem.price
          };
        }), triggerByActive);
      }
      else {
        //第一次选择日期的情况，只有在canSelect为true(即：处于可以点击的范围之内)且status为true(可订状态)的情况下才能选中
        let { year: sy, month: sm, day: sd } = dateManager.getYMD(currentSelectStartDate);
        let dayInfo = this.displayMonth[sy][sm][sd];
        if (dayInfo.canSelect && dayInfo.status) {
          this.selectStartDate = currentSelectStartDate;
          this.selectEndDate = null;
          this.$emit('confirm', [dayInfo].map(elem => {
            return {
              date: elem.date,
              status: elem.status,
              price: elem.price
            };
          }), triggerByActive);
        }
      }
    },
    handleNextMonth() {
      if (this.enableNextMonth) {
        this.visableStartMonthIndex += 1;
      }
    },
    handlePrevMonth() {
      if (this.enablePrevMonth) {
        this.visableStartMonthIndex -= 1;
      }
    }
  }
};
</script>


<style lang="scss">
@import '../static/style/fn';
.v-calendar {
  background: #fff;
  border-radius: 0 0 2px 2px;
  width: 615px;
  padding: 10px 20px 20px;
  box-sizing: border-box;
  position: relative;

  &-btn{
    &__prev,&__next{
      position: absolute;
      top: 13px;
      width: 9px;
      height: 9px;
      padding: 5px 10px;
      color: transparent;
      background: no-repeat center center;
      background-size: 9px;
      cursor: pointer;
      &.diabled{
        display: none;
      }
    }
    &__prev{
      left: 10px;
      background-image: url(./src/calendar_prev.png);
    }
    &__next{
      right: 10px;
      background-image: url(./src/calendar_next.png);
    }
  }

  &-container{
    overflow: hidden;
    margin-left: -15px;
  }
  &-month {
    float: left;
    width: 280px;
    margin-left: 15px;
    &_title{
      font-size: 16px;
      line-height: 26px;
      margin-bottom: 10px;
      text-align: center;
    }
  }

  &-weekday {
    display: flex;
    &__item {
      flex: 1 1 auto;
      width: 0;
      font-size: 14px;
      line-height: 30px;
      color: $colorTitle;
      text-align: center;
      background: #F7F7F7;
      &:first-child,&:last-child{
        color: $colorPrimary;
      }
    }
  }

  &-days {
    overflow: hidden;

    &__status {
      display: block;
      color: $colorPrimary;
    }

    &__item {
      float: left;
      width: 100/7*1%;
      font-size: 14px;
      line-height: 18px;
      height: 40px;
      color: $colorTitle;
      text-align: center;
      position: relative;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      justify-content: center;

      &:active {
        background: $colorBgActive;
      }

      &.disabled {
        color: $colorDisable;
        background: transparent;
        .v-calendar-days__status {
          color: $colorDisable;
        }
      }

      &.select-start,
      &.select-end{
        color: $colorPrimary;
        background: $colorTitle;
      }
      &.select-range {
        color: $colorPrimary;
        background: #F7F7F7;
      }
    }
  }
}
</style>
