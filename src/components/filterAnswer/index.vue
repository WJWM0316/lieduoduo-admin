<!--  -->
<template>
  <div class="filterAnswer">
    <div class="workHistroy">
      <span class="Title">{{labelName}}:</span>
      <div class="select" :class="isCheck==true?'show':''" @click.stop="showSelect">
        <div class="checkList" v-if="nowCheckList.length>0">
          <span class="itemCheck" v-for="(item,index) in nowCheckList" :key="index">{{item.value}}</span>
          <!-- <span v-if="moreQuqery">+{{nowCheckList.length-1}}</span> -->
        </div>
        <div class="selectPop" v-if="startSelect">
          <p class="selectTitle">简历完整度筛选</p>
          <div class="selectBorder">
            <div class="radioOnly row" @click.stop="noReason()">
              <div class="border">
                <span :class="noreason==1?'focus':''"></span>
              </div>
              <span class="Reason">不限条件</span>
            </div>
            <p class="line">可勾选多个必需有的简历信息进行筛选</p>

            <div class="checkList">
              <div class="radioOnly row" style="margin-bottom:10px;" @click.stop="allreason">
                <div class="border">
                  <span :class="noreason==0?'focus':''"></span>
                </div>
                <span class="Reason">全部条件</span>
              </div>
              <div
                class="radioOnly row"
                v-for="(city,index) in cities"
                :key="index"
                @click.stop="checkReason(index)"
              >
                <div class="border">
                  <span :class="city.status?'focus':''"></span>
                </div>
                <span class="Reason">{{city.value}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
  name: 'filterAnswer',
  props: {
    /* 搜索label */
    labelName: {
      type: String
    }
  }
})
export default class filterAnswer extends Vue {
  noreason = 1; /* 是否不限条件 */
  checkObj = {};
  /* 以上参数 */
  choiceKeys = {};
  isCheck = false;
  startSelect = false; /* 显示筛选框 */
  allCheckList = []; /* 全选中 */
  nowCheckList = [
    {
      labelId: '0',
      value: '不限条件',
      status: false
    }
  ]; /* 当前选中 */
  allCheck = [];
  checkAll = false;
  isIndeterminate = false;
  checkedCities = []; /* 默认选中 */
  moreQuqery = 1;
  cityOptions = [
    {
      labelId: 'completeExpect',
      value: '求职意向',
      status: false
    },
    {
      labelId: 'completeCareer',
      value: '工作经历',
      status: false
    },
    {
      labelId: 'completeEducation',
      value: '教育经历',
      status: false
    },
    {
      labelId: 'completeProject',
      value: '项目经历',
      status: false
    },
    {
      labelId: 'completeMoreIntro',
      value: '更多介绍',
      status: false
    },
    {
      labelId: 'completeResumeAttach',
      value: '简历附件',
      status: false
    }
  ];
  cities = this.cityOptions;
  /* 不限条件 */
  /* type  勾选全部 还是不限 */
  /*  */
  /* 全部条件 */
  allreason () {
    this.nowCheckList = []
    this.noreason = 0
    this.cities.map(item => (item.status = true))
    this.nowCheckList = [...this.cities]
    this.nowCheckList.map(item => item.labelId).join(',')
    let checkObj = {}
    this.cities.forEach(item => {
      if (item.status) {
        checkObj[item.labelId] = 1
      }
    })
    this.$emit('returnKeys', checkObj)
  }
  /* 不限条件 */
  noReason () {
    this.nowCheckList = []
    this.noreason = 1
    this.cities.map(item => (item.status = false))
    this.nowCheckList.push({
      labelId: '0',
      status: false,
      value: '不限条件'
    })
  }
  delateArr (index) {
    for (let i = 0; i < this.nowCheckList.length; i++) {
      if (this.cities[index].labelId === this.nowCheckList[i].labelId) {
        // let delateobj = this.nowCheckList[i]
        this.nowCheckList.splice(i, 1)
      }
    }
  }
  /* 单选 */
  checkReason (index) {
    this.cities[index].status = !this.cities[index].status
    console.log(this.nowCheckList)
    for (let i = 0; i < this.nowCheckList.length; i++) {
      if (this.nowCheckList[i].labelId === '0') {
        console.log(this.nowCheckList[i])
        this.nowCheckList.splice(i, 1)
      }
    }
    if (this.cities[index].status) {
      this.noreason = 3
      this.nowCheckList.push(this.cities[index])
    } else {
      this.noreason = 3
      this.delateArr(index)
    }

    let checkObj = {}
    this.cities.forEach(item => {
      if (item.status) {
        checkObj[item.labelId] = 1
      }
    })
    this.$emit('returnKeys', checkObj)
  }
  /* 单选 */
  removeAarry (_arr, _obj) {
    console.log('fsddfsfs')
    var length = _arr.length
    for (var i = 0; i < length; i++) {
      if (_arr[i] === _obj) {
        if (i === 0) {
          _arr.shift() // 删除并返回数组的第一个元素
          return _arr
        } else if (i === length - 1) {
          _arr.pop() // 删除并返回数组的最后一个元素
          return _arr
        } else {
          _arr.splice(i, 1) // 删除下标为i的元素
          console.log(_arr)
          return _arr
        }
      }
    }
  }
  /*  */
  /* 清空状态 */
  resetCheck () {
    for (let i = 0; i < this.cities.length; i++) {
      this.cities[i].status = false
    }
  }
  // 显示
  showSelect () {
    this.startSelect = true
    // this.resetCheck();
  }
  // 关闭
  closeSelect () {
    this.startSelect = false
  }
}
</script>
<style lang='less' scoped>
@import "./index.less";
</style>
