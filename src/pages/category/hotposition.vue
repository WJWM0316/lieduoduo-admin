<!--招聘官管理-->
<template>
  <div class="recruiter_list">
    <el-container class="container" style="border: 1px solid #eee">
      <el-header class="header" style="text-align: right; font-size: 15px">
        <div class="title">
          <span class="s-title">热门类别</span>
          </div>
        <el-button @click.stop="addhotCategory" class="btn-limit-width">新增热门类别</el-button>
      </el-header>
      <el-main>
        <!--筛选-->
        <div class="selectionBox" @keyup.enter="onSubmit">
          <el-form ref="form" label-width="80px" validate="validate">
             <el-input v-model="form.name" placeholder="搜索品类名称"></el-input>
             <el-button @click.stop="onSubmit" style="color: white !important" type="primary">搜索</el-button>
          </el-form>
          <ul class="hotlist">
          <template v-for="(item, i) in firstlist">
            <li
              :key="i"
              :class="{active: item.cur}"
              @click="tabClick(item)">{{item.name}}</li>
          </template>
          <slot name="add-type-btn"></slot>
        </ul>
        </div>
        <!--筛选-->
        <list
          :fields="fields"
          :list="list"
          :total="total"
          :page="Number(form.page)"
          :page-count="pageCount"
          @page-change="handlePageChange"
        >
          <template slot-scope="props" slot="columns">
            <!-- 操作列 -->
            <div
              style="flex-wrap: wrap;"
              class="btn-container"
              v-if="props.scope.column.property === 'level'"
            >
              <div
                style="width: 100%; cursor: pointer; color: #652791;"
                @click.stop="edithotcategory(props.scope.row.id)"
              >编辑</div>
            </div>
            <!-- 类别名字 -->
            <div
              v-else-if="props.scope.column.property === 'name'"
            >
              <span style="text-align: left;">
                <span>
                  {{props.scope.row.name}}
                  </span>
              </span>
            </div>
            <!-- 类别排序 -->
            <div
            @click="toSetsort(props.scope.row.id, props.scope.row.sort)"
              v-else-if="props.scope.column.property === 'sort'"
            >
              <span style="text-align: left;">
                <span>
                  {{props.scope.row.sort}}
                  </span>
              </span>
            </div>
          </template>
        </list>
      </el-main>
    </el-container>
    <!-- 修改权重 -->
    <el-dialog
      :close-on-click-modal="false"
      :show-close="false"
      title="调整权重"
      :visible.sync="isShowsort"
      width="30%"
      :center="true"
    >
      <el-input v-model="sort" @input="sort = sort.replace(/[^\d]/g,'')"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowsort = false">取 消</el-button>
        <el-button type="primary" @click="saveSort">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import List from '@/components/list'
import SelectPositionRadio from '@/components/selectPositionRadio'
import { hotpositionlabelList, firstpositionlist, editCategoryApi } from 'API/category'
@Component({
  name: 'userList',
  components: {
    List,
    SelectPositionRadio
  }
})
export default class user extends Vue {
  form = {
    page: 1,
    count: 20,
    name: '',
    top_pid: ''
  }
  firstlist = []
  fields = [{
    prop: 'id',
    label: '类别ID',
    width: 400
  },
  {
    prop: 'name',
    label: '热门类别',
    width: 400
  },
  {
    prop: 'sort',
    label: '权重'
  },
  {
    prop: 'level',
    fixed: 'right',
    width: 150,
    label: '操作'
  }]
  sort = ''
  id = ''
  isShowsort = false
  total = 0
  pageCount = 0
  list = []
  gethotlist () {
    hotpositionlabelList(this.form).then((res) => {
      this.list = res.data.data
      this.total = res.data.meta.total
      this.pageCount = res.data.meta.lastPage
    })
  }
  getfirstpositionlist () {
    firstpositionlist().then((res) => {
      let arr = res.data.data
      arr.map((v, k) => {
        v.cur = false
      })
      this.firstlist = arr
      this.firstlist[0].cur = true
      this.form.top_pid = this.firstlist[0].id
      this.gethotlist()
    })
  }
  /* 翻页 */
  handlePageChange (nowPage) {
    this.form.page = nowPage
  }
  // 编辑权重
  toSetsort (id, sort) {
    this.id = id
    this.sort = sort
    this.isShowsort = true
  }
  saveSort () {
    let data = { id: this.id, sort: this.sort }
    editCategoryApi(data).then((res) => {
      this.isShowsort = false
      this.$message({
        message: '编辑成功',
        type: 'success'
      })
      this.getfirstpositionlist()
    })
  }
  tabClick (item) {
    this.form.top_pid = item.id
    this.firstlist.map((v, k) => {
      v.cur = item === v
    })
    this.gethotlist()
  }
  addhotCategory () {
    this.$router.push({ name: 'addhotCategory' })
  }
  edithotcategory (id) {
    this.$router.push({ path: '/addCategory', query: { id: id, isedit: true } })
  }
  onSubmit () {
    this.gethotlist()
  }
  created () {
    this.getfirstpositionlist()
  }
}
</script>

<style lang="less" scoped>
.recruiter_list {
  .container {
    min-width: 1000px;
    margin: 22px;
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .title {
        display: flex;
        align-items: center;
        position: relative;
        font-size: 15px;
        color: #606266;
        &::before {
          background: #ffe266;
          content: "";
          display: inline-block;
          float: left;
          height: 100%;
          height: 16px;
          margin-right: 10px;
          width: 6px;
        }
        .s-title{
          cursor: pointer;
          &:hover{
            color: #000;
          }
        }
      }
      .creatBtn {
        font-size: 15px;
        padding: 12px 20px;
        background-color: #ffe266;
        border-radius: 4px;
      }
    }
  }
  .selectionBox{
  }
  .el-form {
    .el-input {
      width: 200px;
      float: left;
      margin-right: 10px;
    }
    &::after {
      content: "";
      display: block;
      height: 0;
      clear: both;
    }
  }
  .el-form-item,
  .content {
    margin-bottom: 22px;
    margin-left: 5px;
    float: left;
  }
  .btn {
    float: right;
    .inquire {
      color: #ffffff;
      background-color: #652791;
    }
    span {
      white-space: nowrap;
      user-select: none;
      cursor: pointer;
      line-height: 12px;
      color: #652791;
    }
  }
  .btn-container {
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    .check {
      line-height: 48px;
      color: #652791;
      cursor: pointer;
    }
  }
  .companyName {
    justify-content: flex-start;
    text-align: left;
    .toCompany {
      color: #652791;
      cursor: pointer;
    }
  }
  .name-column{
    flex-direction: column;
  }
}
.btn-container {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  .check {
    line-height: 48px;
    color: #652791;
    cursor: pointer;
  }
  .btn {
    color: #652791;
    cursor: pointer;
  }
}
.inquire {
  background-color: #652791;
  color: #ffffff;
  border-radius: 4px;
}
.qrCode {
  text-align: center;
  width: 300px;
  height: 300px;
  border-radius: 4px;
  transform: translateY(-90%) translateX(-20%);
  color: #652791;
  position: absolute;
  top: -999px;
  left: -999px;
  z-index: 3;
  line-height: 60px;
  text-align: center;
  .phoneBg {
    display: block;
    position: absolute;
    top: 0;
    left: 5%;
    z-index: -1;
  }
}
.qrCode {
  width: 300px;
  height: 300px;
  /*background-color: #CCCCCC;*/
  transform: translateY(-100%) translateX(-50%);
  .Qr {
    width: 200px;
    height: 200px;
    margin-top: 30px;
  }
  .bg {
    width: 100%;
    height: 100%;
    max-width: 100%;
    max-height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
  }
  .txt {
    line-height: normal;
    color: #5c565d;
    margin-top: 5px;
  }
}
/* 筛选 */
.inputSelect {
  width: 400px !important;
  background-color: #ffffff;
  .el-select {
    width: 120px;
    margin-top: -2px;
    border: none;
    box-sizing: border-box;
  }
}
.hotlist{
  margin-top: 20px;
  li{
    display: inline-block;
    background-color: #f4f4f5;
    display: inline-block;
    padding: 12px 15px;
    font-size: 12px;
    border-radius: 2px;
    color: #909399;
    margin-bottom: 10px;
    cursor: pointer;
    transition: opacity 400ms, background 400ms, color 400ms;
  }
  li+li {
    margin-left: 6px;
  }
  li:hover,.active {
    background-color: #3e294d;
    color: white;
  }
  li:hover {
    opacity: 0.9;
  }
  .active{
    pointer-events: none;
  }
}
</style>
