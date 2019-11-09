<!--  -->
<template>
  <div class="recommendList">
    <lyout-content
      :leftcontent="leftcontent"
      :isShowbtn="true"
      ref="methods"
      @handlePageChange="handlePageChange"
      @handertableHeight="handertableHeight"
    >
      <el-button class="class" slot="text" @click.stop="toTabBlock">新建推荐单</el-button>
      <div class="formSumbit" slot="formContent">
        <div class="formReasult">
          <el-form ref="form" :model="form" class="form">
            <div class="searchTab">
              <el-input
                type="text"
                placeholder="请输入内容"
                v-model="form.commonKey1"
                class="inputSelect"
              >
                <el-select
                  size="medium"
                  class="selectTitle"
                  v-model="searchType.key1"
                  slot="prepend"
                  placeholder="公司名"
                  @change="checkType(searchType.key1)"
                >
                  <el-option label="公司名" value="company"></el-option>
                  <el-option label="批次" value="listId"></el-option>
                  <el-option label="职位发布者" value="recruiter"></el-option>
                  <el-option label="推荐职位" value="position"></el-option>
                </el-select>
              </el-input>
            </div>
            <div class="searchTab">
              <el-input
                type="text"
                placeholder="请输入内容"
                v-model="form.commonKey2"
                class="inputSelect"
              >
                <el-select
                  size="medium"
                  class="selectTitle"
                  v-model="searchType.key2"
                  slot="prepend"
                  placeholder="推荐职位"
                  @change="checkType(searchType.key1)"
                >
                  <el-option label="推荐职位" value="position"></el-option>
                  <el-option label="公司名" value="company"></el-option>
                  <el-option label="批次" value="listId"></el-option>
                  <el-option label="职位发布者" value="recruiter"></el-option>
                </el-select>
              </el-input>
            </div>
            <!-- <div class="searchTab">
              <el-input
                type="text"
                placeholder="推荐职位"
                v-model="searchType.keyword1"
                class="inputSelect"
              >
                <el-select
                  size="medium"
                  class="selectTitle"
                  v-model="searchType.condition1"
                  slot="prepend"
                  placeholder="推荐职位"
                >
                  <el-option
                    label="公司名"
                    value="keyword"
                    v-show="searchType.condition2 !== 'keyword'"
                  ></el-option>
                  <el-option
                    label="招聘官"
                    value="keyword"
                    v-show="searchType.condition2 !== 'keyword'"
                  ></el-option>
                  <el-option
                    label="推荐职位"
                    value="keyword"
                    v-show="searchType.condition2 !== 'keyword'"
                    class="optionStyle"
                  ></el-option>
                  <el-option label="批次" value="mobile" v-show="searchType.condition2 !== 'mobile'"></el-option>
                </el-select>
              </el-input>
            </div>-->
            <el-form-item label="推荐人" prop="advisorUid" class="formItem">
              <el-select class="select" v-model="form.advisorUid" placeholder="请选择">
                <el-option
                  :label="item.realname"
                  :value="item.id"
                  v-for="item in userList"
                  :key="item.id"
                >{{item.realname}}</el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="time" label="创建时间" prop="startTime" label-width="100px">
              <el-col :span="11">
                <el-date-picker
                  type="date"
                  placeholder="选择日期"
                  v-model="form.startTime"
                  value-format="yyyy-MM-dd"
                  style="width: 142px;"
                ></el-date-picker>
              </el-col>
              <el-col class="line" :span="1">—</el-col>
              <el-col :span="11">
                <el-date-picker
                  type="date"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd"
                  v-model="form.endTime"
                  style="width: 142px;"
                ></el-date-picker>
              </el-col>
            </el-form-item>
            <!--用于代替清除结束时间-->
            <el-form-item label-width="1px" label prop="endTime"></el-form-item>
            <div class="BtnList">
              <el-form-item class="btn">
                <el-button type="primary" @click.stop="getData(1)">查询</el-button>
                <el-button @click.stop="resetForm('form')">重置</el-button>
              </el-form-item>
            </div>
          </el-form>
        </div>
      </div>
      <div class="resumeList" id="scroll" slot="dataList">
        <el-table
          :max-height="tableHeight"
          highlight-current-row
          :data="tableData"
          style="width: 100%"
        >
          <el-table-column prop="id" label="批次" width="150"></el-table-column>
          <el-table-column prop="createdTimeDesc" label="创建时间" width="120"></el-table-column>
          <el-table-column prop="recruiterName" label="职位发布者" width="120"></el-table-column>
          <el-table-column prop="companyName" label="推荐公司" width="300"></el-table-column>
          <el-table-column prop="positionName" label="推荐职位" width="300">
            <template slot-scope="scope">
              <p
                class="positionName"
              >{{scope.row.positionId}}|{{scope.row.positionName}}|{{scope.row.emolumentMin}}K~{{scope.row.emolumentMax}}K|{{scope.row.areaName}}</p>
            </template>
          </el-table-column>
          <el-table-column prop="succeedNum" label="推荐成功" width="170"></el-table-column>
          <el-table-column prop="failNum" label="推荐失败" width="170"></el-table-column>
          <el-table-column prop="advisorName" label="推荐负责人" width="170"></el-table-column>

          <el-table-column fixed="right" label="操作" width="100">
            <template slot-scope="scope">
              <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </lyout-content>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import lyoutContent from 'COMPONENTS/LayoutWrapper/content.vue'
import { recommendList, userList } from 'API/resumeStore'
@Component({
  name: 'recommendList',
  prop: '',
  components: {
    lyoutContent
  }
})
export default class recommend extends Vue {
  tableHeight = ''; /* table栏显示高度，需计算 */
  tableData = [];
  key1 = 'companyName';
  page = 1;
  userList = [];
  lastPage = 20;
  form = {
    advisorUid: '',
    commonKey1: '' /* 公共键  批次或者公司名 */,
    startTime: '',
    endTime: '',
    page: 1,
    count: 20
  };
  tableData = [];
  searchType = {
    key1: 'company' /* 第一个搜索条件的默认键 */,
    key2: 'position' /* 第二个搜索条件的默认键 */
  };
  leftcontent = {
    total: 0,
    title: '推荐列表',
    lastPage: '',
    page: 1 // 当前显示页
  };
  toTabBlock () {
    this.$router.push({
      path: '/resumeStore/recommendList/createOrder'
    })
  }
  checkType (e) {
    // 创建键值
    this.form[`${e}`] = ''
  }
  /* 清除列表选项 */
  resetForm (name) {
    this.form.startTime = ''
    this.form.endTime = ''
    this.form.commonKey1 = ''
    this.form.commonKey2 = ''
    this.form.page = 1
    this.form.isJobhunterApply = false
    this.$refs[name].resetFields()
  }
  handertableHeight (e) {
    this.tableHeight = e
  }
  handleClick (row) {
    this.$router.push({
      path: '/resumeStore/recommendList/OrderDetail',
      query: {
        id: row.id
      }
    })
  }
  forEachKeys (form, page) {
    // 基础键，剩余键值对由用户选择
    let param = {
      count: 20,
      page: page,
      endTime: form.endTime,
      startTime: form.startTime,
      advisorUid: this.form.advisorUid
    }
    param[this.searchType.key1] = this.form.commonKey1
    param[this.searchType.key2] = this.form.commonKey2
    return param
  }
  getData (page) {
    if ((this.form.startTime && !this.form.endTime) || (!this.form.startTime && this.form.endTime)) {
      this.$message({ message: '创建时间必需选择区间时间', type: 'warning' })
      return
    }
    let obj = this.forEachKeys(this.form, page)
    recommendList(obj).then(res => {
      this.tableData = res.data.data
      this.leftcontent.lastPage = res.data.meta.lastPage
      this.leftcontent.total = res.data.meta.total
    })
  }
  handlePageChange (nowPage) {
    this.$refs['methods'].scrollZero()
    this.form.page = nowPage
    this.getData(this.form.page)
  }
  created () {
    this.getList().then(() => {
      this.getData(1)
    })
  }
  getList () {
    return userList().then(res => {
      this.userList = res.data.data
    })
  }
}
</script>
<style lang='less' scoped>
@import "./index.less";
</style>
