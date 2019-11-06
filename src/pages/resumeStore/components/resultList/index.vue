<!--  -->
<template>
  <div class="Pop">
    <div class="PopForm" @click.stop="isShowForm" v-if="isShowForm">
      <div class="allRusule">
        <p class="title">{{title}}</p>
        <div class="resumeNums">
          <span>成功:{{successNum}}份</span>
          <span>失败:{{failNum}}份</span>
        </div>
        <div class="resultList">
          <el-table height="400" max-height="400" :data="tableData" style="width: 100%">
            <el-table-column align="center" prop="date" label="简历编号" width="380"></el-table-column>
            <el-table-column align="center" prop="name" label="求职者" width="380"></el-table-column>
            <el-table-column align="center" prop="address" label="原因说明" width="380"></el-table-column>
          </el-table>
        </div>
        <div class="okBtn">
          <el-button @click.stop="$route.go(-1)">好的</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
  name: 'PopForm',
  prop: {
    // 标题
    title: {
      type: String
    },
    // 成功数
    successNum: {
      type: Number
    },
    // 失败数
    failNum: {
      type: Number
    },
    // 数组
    tableData: {
      type: Array
    }
  }
})
export default class PopForm extends Vue {
  isShowForm = false;
  isShowForm () {}
}
</script>
<style lang='less' scoped>
@import "./index.less";
</style>
