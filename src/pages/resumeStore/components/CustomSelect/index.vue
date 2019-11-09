<!--  -->
<template>
  <div class="CustomSelect">
    <div class="workHistroy">
      <span class="Title">{{selectName}}:</span>
      <div class="select" :class="isCheck==true?'show':''" @click.stop="showSelect">
        <span class="placeholder">{{checkTime}}</span>
        <div class="selectList" v-if="isCheck">
          <div
            class="selectItem"
            v-for="(item,index) in selectList"
            :key="index"
            @click.stop="choice(item,index)"
          >
            <span>{{item.text}}</span>
          </div>
          <div class="CustomExperience">
            <span class="Custom">{{typeName}}</span>
            <div class="Section">
              <input type="Number" placeholder="0" :value="workExpLower" id="minYear">
              <span>-</span>
              <input type="Number" :value="workExpUpper" placeholder="99" id="maxYear">
            </div>
          </div>
          <div class="sumbitBtn" @click.stop="choice()">确定</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
  name: 'CustomSelect',
  props: {
    /* 类型 */
    SubpType: {
      type: String
    },
    /* 自定义名字 */
    typeName: {
      type: String
    },
    /* 搜索label */
    selectName: {
      type: String
    },
    /* 自定义选择列表 */

    selectList: {
      type: Array,
      default: () => []
    }
  }
})
export default class CustomSelect extends Vue {
  workExpLower = ''; // 最小年限
  workExpUpper = ''; // 最大年限
  isStudent = ''; // 在校生、无工作经验。无工作经验时，该值为1，否则为0。该值为1时，忽略工作经验
  checkTime = '请选择';
  isCheck = false;

  // 显示
  showSelect () {
    this.isCheck = true
  }
  // 隐藏
  closeSelect () {
    this.isCheck = false
  }
  // 初始化

  clearValue () {
    this.checkTime = '请选择'
  }
  choice (item, index) {
    let obj = {
      SubpType: this.SubpType,
      isStudent: undefined,
      min: '',
      max: '',
      value: ''
    }

    if (item === undefined) {
      /* 自定义 字段 */
      this.workExpLower = document.getElementById('minYear').value
      this.workExpUpper = document.getElementById('maxYear').value
      if (/\d/.test(this.workExpLower) && /\d/.test(this.workExpUpper)) {
        if (+this.workExpUpper > +this.workExpLower) {
          this.checkTime = `${this.workExpLower}~${this.workExpUpper}`
          obj.isStudent = ''
          obj.min = this.workExpLower
          obj.max = this.workExpUpper
          obj.value = `${obj.min}-${obj.max}`
        }
      }
    } else if (item.isSection) {
      /* 点击了有价格区间的item */
      obj.isStudent = undefined
      obj.min = item.min
      obj.max = item.max
      obj.value = `${obj.min}-${obj.max}`
    } else if (!item.isSection) {
      /*   特殊字段处理， 如 无   不限 */
      if (this.SubpType === 'work') {
        if (item.text === '不限') {
          obj.isStudent = 0
          obj.value = `不限`
        } else if (item.text === '无限制') {
          obj.isStudent = 1
          obj.value = `无限制`
        } else if (item.text === '无经验') {
          obj.isStudent = 1
          obj.value = `无经验`
        }
      } else {
        if (item.text === '不限') {
          obj.value = `不限`
        } else if (item.text === '无限制') {
          obj.value = `无限制`
        }
      }
    }
    this.closeSelect()
    this.isCheck = false
    this.$emit('callback', obj)
  }
}
</script>
<style lang="less" scoped>
@import "./index.less";
</style>;
