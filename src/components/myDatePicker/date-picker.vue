<template>
  <div class="calendar">
    <div class="calendar__header">
      <!-- 年份选择器 start-->
      <template v-if="currentType === 'year'">
        <i class="el-icon-arrow-left" @click="__preMonth"></i>
        <div class="header__title">
          <span @click="changeType('year')">{{__getRangeYears()[0]}}年</span> -
          <span @click="changeType('month')">{{__getRangeYears()[9]}}年</span>
        </div>
        <i class="el-icon-arrow-right" @click="__nextMonth"></i>
      </template>
      <!-- 年份选择器 end-->
      <!-- 月份选择器 start-->
      <template v-if="currentType === 'month'">
        <i class="el-icon-arrow-left" @click="__preMonth"></i>
        <div class="header__title">{{selectedYear}}年</div>
        <i class="el-icon-arrow-right" @click="__nextMonth"></i>
      </template>
      <!-- 月份选择器 end-->
      <!-- 日期选择器 start-->
      <template v-if="currentType === 'day'">
        <i class="el-icon-arrow-left" @click="__preMonth"></i>
        <div class="header__title">
<!--           <span @click="changeType('year')">{{selectedYear}}年</span>
          <span @click="changeType('month')">{{selectedMonth + 1}}月</span> -->
          <span>{{selectedYear}}年</span>
          <span>{{selectedMonth + 1}}月</span>
        </div>
        <i class="el-icon-arrow-right" @click="__nextMonth"></i>
      </template>
      <!-- 日期选择器 end-->
    </div>
    <div class="calendar__main">
      <!-- 年选择器 start-->
      <template v-if="currentType === 'year'">
        <div
          class="main__block__year"
          @click="__clickYear(yearItem)"
          v-for="yearItem in __getRangeYears()"
          :key="yearItem"> {{ yearItem }}年
        </div>
      </template>
      <!-- 年选择器 end-->
      <!-- 月选择器 start-->
      <template v-if="currentType === 'month'">
        <div
          class="main__block__month"
          @click="__clickMonth(monthItem)"
          v-for="monthItem in __getRangeMonths()"
          :key="monthItem"> {{ monthItem + 1 }}月
        </div>
      </template>
      <!-- 月选择器 end-->
      <!-- 日期选择器 start-->
      <template v-if="currentType === 'day'">
        <div class="main__block-head" v-for="(item, index) in calendarHeader" :key="index"> {{item}} </div>
        <div
          class="main__block__day"
          :class="`${item.type !== 'normal' ? 'gray' : ''} ${item.content === selectedDate && item.type === 'normal' ? 'today' : ''}`"
          @click="__clickDay(item)"
          v-html="replaceItemHtml(item, index)"
          v-for="(item, index) in __getRangeDays(selectedYear)[selectedMonth]"
          :key="item.type + item.content + `${index}`"> {{item.content}}
        </div>
      </template>
      <!-- 日期选择器 end-->
    </div>
  </div>
</template>
<script>
export default {
  props: {
    replaceItemHtml : {
      type : Function
    }
  },
  data() {
    return {
      calendarHeader: ['日', '一', '二', '三', '四', '五', '六'],
      selectedYear: new Date().getFullYear(),
      selectedMonth: new Date().getMonth(),
      selectedDate: new Date().getDate(),
      currentType: 'day'
    };
  },
  methods: {
    __getRangeYears() {
      let years = []
      let base = String(this.selectedYear).slice(0,3)
      for(let i = 0; i <= 9; i++) {
        years.push(Number(String(this.selectedYear).slice(0,3) + i))
      }
      return years
    },
    __getRangeMonths() {
      let months = []
      for(let i = 0; i <= 11; i++) {
        months.push(i)
      }
      return months
    },
    __getRangeDays(year) {
      let daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      let nextYear = this.selectedYear + 1
      let beforeYear = this.selectedYear - 1
      if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
        daysInMonth[1] = 29;
      }
      let daysPreMonth = [].concat(daysInMonth);
      daysPreMonth.unshift(daysPreMonth.pop());
      let addDaysFromPreMonth = new Array(12).fill(null).map((item, index) => {
        let day = new Date(year, index, 1).getDay();
        if (day === 0) {
          return 6;
        } else {
          return day - 1;
        }
      });
      let total_calendar_list = new Array(12)
        .fill([])
        .map((month, monthIndex) => {
          let addDays = addDaysFromPreMonth[monthIndex] + 1,
            daysCount = daysInMonth[monthIndex],
            daysCountPre = daysPreMonth[monthIndex],
            monthDate = []
          if (addDays >= 7) {
            addDays = addDays - 7;
          }
          for (; addDays > 0; addDays--) {
            let obj = {
              content: daysCountPre--,
              type: 'pre',
              date: `${ beforeYear }-${this.selectedMonth + 1 < 10 ? '0' + (this.selectedMonth + 1) : this.selectedMonth + 1}-${daysCountPre < 10 ? '0' + daysCountPre : daysCountPre}`
            };
            monthDate.unshift(obj);
          }
          for (let i = 0; i < daysCount; ) {
            let obj = {
              content: ++i,
              type: 'normal',
              date: `${this.selectedYear}-${this.selectedMonth + 1 < 10 ? '0' + (this.selectedMonth + 1) : this.selectedMonth + 1}-${i < 10 ? '0' + i : i}`
            };
            monthDate.push(obj);
          }
          if (monthDate.length > 35) {
            for (let i = 42 - monthDate.length, j = 0; j < i; ) {
              let obj = {
                content: ++j,
                type: 'next',
                date: `${ nextYear }-${new Date().getMonth() + 1 >= 12 ? `01` : new Date().getMonth() + 1}-${j < 10 ? '0' + j : j}`
              };
              monthDate.push(obj);
            }
          } else {
            for (let i = 35 - monthDate.length, j = 0; j < i; ) {
              let obj = {
                content: ++j,
                type: 'next',
                date: `${ nextYear }-${new Date().getMonth() + 1 >= 12 ? `01` : new Date().getMonth() + 1}-${j < 10 ? '0' + j : j}`
              };
              monthDate.push(obj);
            }
          }
          return monthDate;
        });
      return total_calendar_list;
    },
    __clickDay(item) {
      if(item.type === 'next') {
        this.selectedYear++
        this.selectedMonth = 0
      } else if(item.type === 'pre') {
        this.selectedYear--
        this.selectedMonth = 11
      } else {
        // this.selectedDate = Number(item.content)
      }
      this.selectedDate = Number(item.content)
      this.$emit('changeDay', item)
    },
    __clickYear(year) {
      this.selectedYear = year
      this.currentType = 'month'
    },
    __clickMonth(month) {
      this.selectedMonth = Number(month)
      this.currentType = 'day'
      this.__getRangeDays(this.selectedYear)
    },
    __preMonth() {
      if (this.selectedMonth === 0) {
        this.selectedYear = this.selectedYear - 1
        this.selectedMonth = 11
        this.selectedDate = 1
      } else {
        this.selectedMonth = this.selectedMonth - 1
        this.selectedDate = 1
      }
      this.$emit('change', {
        time: `${this.selectedYear}-${this.selectedMonth + 1 < 10 ? '0' + (this.selectedMonth + 1) : this.selectedMonth + 1}-${this.selectedDate < 10 ? '0' + this.selectedDate : this.selectedDate}`
      })
    },
    __nextMonth() {
      if (this.selectedMonth === 11) {
        this.selectedYear = this.selectedYear + 1
        this.selectedMonth = 0
        this.selectedDate = 1
      } else {
        this.selectedMonth = this.selectedMonth + 1
        this.selectedDate = 1
      }
      this.$emit('change', {
        time: `${this.selectedYear}-${this.selectedMonth + 1 < 10 ? '0' + (this.selectedMonth + 1) : this.selectedMonth + 1}-${this.selectedDate < 10 ? '0' + this.selectedDate : this.selectedDate}`
      })
    },
    __changeYear() {},
    __changeMonth() {},
    changeType(type) {
      this.currentType = type
    }
  }
};
</script>

<style lang="scss">
.calendar {
  padding: 15px;
  width: 270px;
  border-radius: 4px;
  background-color: white;
  box-shadow: 0 0 10px rgba(208, 208, 208, 0.5);
  .el-icon-arrow-left{
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
  }
  .el-icon-arrow-right{
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
  }
  .calendar__header {
    color: #2c3135;
    font-size: 16px;
    line-height: 22px;
    text-align: center;
    position: relative;
    width: 100%;
    .header__title {
      font-size: 16px;
      letter-spacing: 1px;
      display: inline;
      vertical-align: middle;
      text-align: center;
    }
    span{
      cursor: pointer;
    }
  }
  .calendar__main {
    width: 100%;
    display: flex;
    /*justify-content: space-around;*/
    flex-wrap: wrap;
    padding-top: 19px;
    .main__block__day {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      font-size: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #666666;
      background-color: #fff;
      flex-shrink: 0;
      box-shadow: 0;
      position: relative;
      transition: 0.5s all;
      cursor: pointer;
      position: relative;
    }
    .main__block__year {
      width: 67px;
      height: 67px;
      border-radius: 50%;
      font-size: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #666666;
      background-color: #fff;
      flex-shrink: 0;
      box-shadow: 0;
      position: relative;
      transition: 0.5s all;
      cursor: pointer;
      position: relative;
    }
    .main__block__month {
      width: 67px;
      height: 67px;
      border-radius: 50%;
      font-size: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #666666;
      background-color: #fff;
      flex-shrink: 0;
      box-shadow: 0;
      position: relative;
      transition: 0.5s all;
      cursor: pointer;
      position: relative;
    }
    span{
      width: 15px;
      height: 15px;
      position: absolute;
      bottom: 0;
      right: 0;
      color: white;
      border-radius: 50%;
      text-align: center;
      line-height: 16px;
    }
    .yellow{
      background: #FF6600;
    }
    .red {
      background: red;
    }
    .purple {
      background: rgba(128, 0, 128, 1);
    }
    .gray {
      color: #c0c4cc;
    }
    .today {
      color: #3e294d;
      font-weight: bolder;
    }
    .main__block-head {
      width: 38px;
      height: 38px;
      border-radius: 2px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      color: #7f8fa4;
      background-color: #fff;
      flex-shrink: 0;
    }
  }
}
</style>