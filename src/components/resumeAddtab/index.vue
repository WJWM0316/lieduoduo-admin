<!--  -->
<template>
  <div class="resumeAddTab">
    <!-- 标签添加组件 -->
    <div class="addTab" v-if="showAddResumeTab">
      <div class="addConttent">
        <div class="TabHeader">
          <span>标签</span>
          <i class="el-icon-circle-close" @click.stop="showAddResumeTab=false"></i>
        </div>
        <div class="SearchInput">
          <div class="row">
            <el-input
              type="text"
              placeholder="请输入自定义标签"
              v-model="diyTabName"
              maxlength="12"
              show-word-limit
            ></el-input>
            <el-button class="adding" type="primary" @click.stop="addTab">添加</el-button>
          </div>

          <div class="nowCheckTabList">
            <p class="nowCheck">已选择({{nowCheckListTab.length}} /15)</p>
            <div
              :class="item.status?'focusItem':'tabItem'"
              v-for="(item,index) in nowCheckListTab"
              :key="index"
            >
              <span>{{item.labelName}}</span>
              <i class="el-icon-circle-close" @click.stop="delateTab(index)"></i>
            </div>
          </div>
        </div>
        <div class="tabStore">
          <p>标签库</p>
          <div class="tabList" id="Tab_Store">
            <div
              v-for="(item,index) in tabList"
              :key="index"
              :class="item.status?'focusItem':'tabItem'"
              @click.stop="choiceTab(index)"
            >
              <span>{{item.name}}</span>
            </div>
          </div>
        </div>
        <div class="resumeTabBtn">
          <el-button type="primary" @click="checkTab()">确定</el-button>
          <el-button @click.stop="showAddResumeTab=false">取消</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import {
  resumelist,
  createLabel,
  confgiLabel,
  removeAllLabel
} from 'API/resumeStore.js'

@Component({
  name: 'resumeAddTab',
  props: {
    /* 用户id */
    uid: {
      type: Number,
      default: 0
    },
    /* 当前选择标签数组 */
    nowCheckListTab: {
      type: Array,
      default: () => []
    }
  }
})
export default class resumeAddtab extends Vue {
  diyTabName = ''; /* 自定义标签 */
  showAddResumeTab = false; /* 是否显示select */
  tabList = []; /* 标签库 */
  returnStr = '';
  labelStorePage = {
    page: 1,
    count: 100,
    haveData: 1
  };
  showSelect () {
    this.showAddResumeTab = true
    this.$nextTick(() => {
      const el = document.getElementById('Tab_Store')
      el.addEventListener('scroll', this.handleScroll)
    })
  }
  handleScroll (e) {
    const el = document.getElementById('Tab_Store')
    const offsetHeight = el.offsetHeight
    const scrollTop = el.scrollTop
    const scrollHeight = el.scrollHeight
    if (scrollTop + offsetHeight === scrollHeight) {
      this.Tabresumelist()
    }
  }
  closeSelect () {
    this.showAddResumeTab = false
    const el = document.getElementById('TabStore')
    el.removeEventListener('scroll', this.handleScroll)
  }
  Tabresumelist () {
    if (this.labelStorePage.haveData) {
      resumelist({ count: 100, page: this.labelStorePage.page }).then(res => {
        this.tabList = [...this.tabList, ...res.data.data]
        let labelIdList = this.nowCheckListTab.map(field => field.labelId)
        this.labelStorePage.haveData = res.data.meta.haveData
        this.labelStorePage.page++
        this.tabList.map(
          field =>
            (field.status = !!labelIdList.includes(field.id))
        )
      })
    }
  }
  /* 确认给简历打标签 */
  checkTab () {
    if (this.nowCheckListTab.length === 0) {
      removeAllLabel(this.uid).then(res => {
        this.showAddResumeTab = false
        this.$emit('CallbackDetail')
      })
    } else {
      console.log(this.nowCheckListTab)
      let labelIds = this.nowCheckListTab.map(item => item.labelId).join(',')
      confgiLabel(this.uid, { labelIds }).then(res => {
        console.log(res)
        this.showAddResumeTab = false
        this.$emit('CallbackDetail')
      })
    }
  }
  /* 删除已选择的标签 */
  delateTab (index) {
    this.resetStoreStatus(index)
    this.nowCheckListTab.splice(index, 1)
  }
  /* 重置标签库 */
  resetStoreStatus (index) {
    for (let i = 0; i < this.tabList.length; i++) {
      if (this.nowCheckListTab[index].labelId === this.tabList[i].id) {
        this.tabList[i].status = false
      }
    }
  }
  /* 新增标签 */
  addTab () {
    console.log(this.diyTabName)
    createLabel({ name: this.diyTabName }).then(res => {
      this.Tabresumelist()
      this.$message({
        message: '添加成功',
        type: 'success'
      })
    })
  }
  /* 选择标签 */
  choiceTab (index) {
    let isCheck = this.nowCheckListTab.filter(
      item => item.name === this.tabList[index].name
    )
    if (isCheck.length > 0) return
    if (this.nowCheckListTab.length >= 15) return
    if (!this.tabList[index].status) {
      let param = {
        status: !this.tabList[index].status,
        labelName: this.tabList[index].name,
        labelId: this.tabList[index].id
      }
      this.$nextTick(() => {
        this.tabList[index].status = true
        this.nowCheckListTab.push(param)
      })
    } else {
      this.$nextTick(() => {
        this.tabList[index].status = false
      })
    }
  }

  created () {
    // this.Tabresumelist();
  }
}
</script>
<style lang='less' scoped>
@import "./index.less";
</style>
