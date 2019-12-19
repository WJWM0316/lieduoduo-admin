<!--招聘官管理-->
<template>
  <div class="recruiter_list">
    <el-container class="container" style="border: 1px solid #eee">
      <el-header class="header" style="text-align: right; font-size: 15px">
        <div class="title">
          <span class="s-title" @click="backto('1')" v-if="$route.query.level >= '1'">一级类别</span>
          <span v-if="$route.query.level >= '2'" style="padding:0 10px">></span>
          <span class="s-title" @click="backto('2')" v-if="$route.query.level >= '2'">二级类别</span>
          <span v-if="$route.query.level >= '3'" style="padding:0 10px">></span>
          <span class="s-title" @click="backto('3')" v-if="$route.query.level >= '3'">三级类别</span>
          </div>
        <el-button @click.stop="addCategory" class="btn-limit-width">新增{{$route.query.level === '1' ? '一' : $route.query.level === '2' ? '二' : '三' }}级分类</el-button>
      </el-header>
      <el-main>
        <!--筛选-->
        <div class="selectionBox" @keyup.enter="onSubmit">
          <el-form ref="form" label-width="80px" validate="validate">
             <el-input v-model="form.name" placeholder="搜索品类名称"></el-input>
             <el-button @click.stop="onSubmit" style="color: white !important" type="primary">搜索</el-button>
          </el-form>
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
              <div v-if="$route.query.level === '1'">
                <span class="check" @click.stop="check(props.scope.row.id, 2)">查看二级</span>
              </div>
              <div v-if="$route.query.level === '2'">
                <span class="check" @click.stop="check(props.scope.row.id, 3)">查看三级</span>
              </div>
              <div
                style="width: 100%; cursor: pointer; color: #652791;"
                @click.stop="editcategory(props.scope.row.id)"
              >编辑</div>
              <div
                v-if="$route.query.level === '2' || $route.query.level === '3'"
                style="width: 100%; cursor: pointer; color: #652791;"
                @click.stop="copyandmove(props.scope.row.id, $route.query.level)"
              >添加</div>
            </div>
            <!-- 类别名字 -->
            <div
              v-else-if="props.scope.column.property === 'name'"
            >
              <span style="text-align: left;">
                <span>
                  {{props.scope.row.name}}{{props.scope.row.status === 0 ? '（下线）' : '' }}
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
            <!-- 是否热门 -->
            <div
            @click="addtoHot(props.scope.row.id, props.scope.row.isHot)"
              v-else-if="props.scope.column.property === 'isHot'"
            >
              <span style="text-align: left;color:#652791;">
                <span v-if="props.scope.row.isHot">
                  热门
                </span>
                <span v-else style="cursor: pointer;">
                  添加至热门
                </span>
              </span>
            </div>
          </template>
        </list>
      </el-main>
    </el-container>
    <!-- 修改公司名 -->
    <el-dialog
      :close-on-click-modal="false"
      :show-close="false"
      title="调整排序"
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
    <select-position-radio
      style="width: 400px;"
      :title="title"
      :labelitem="labelitem"
      @handlerPosition="surehandler"
      @movePosition="movehandler"
      @cancelhandler="cancel"
      :visible="isshowRadio">
    </select-position-radio>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import List from '@/components/list'
import { getLabelPositionListApi } from 'API/position'
import SelectPositionRadio from '@/components/selectPositionRadio'
import { getCategoryApi, editCategoryApi, positionlabelList, copylabelList } from 'API/category'
@Component({
  name: 'userList',
  watch: {
    '$route.query.level': function (n) {
      if (!n) {
        this.list = []
        this.form.pid = ''
        this.getfirstlist()
        this.$router.push({ name: 'categoryList', query: { level: '1' } })
      } else {
        this.init()
      }
    }
  },
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
    pid: ''
  };
  labellist = []
  listid = ''
  labelitem = []
  isshowRadio = false
  title = '请选择一级类别'
  formradio = {
    position_name: '', // 职位名称
    type: '', // 职位类型
    positionTypeName: ''
  };
  sort = ''
  id = ''
  isShowsort = false
  total = 0;
  level = 'level1';
  pageCount = 0;
  fields = [];
  list = [];
  // 新增分类
  addCategory () {
    this.$router.push({ path: '/addCategory', query: { level: this.$route.query.level } })
  }
  // 编辑分类
  editcategory (id) {
    this.$router.push({ path: '/addCategory', query: { level: this.$route.query.level, id: id } })
  }
  // 列表的添加移动复制操作
  copyandmove (listid, num) {
    this.listid = listid
    this.labelitem = []
    this.isshowRadio = true
    this.labellist.map((v, k) => {
      this.labelitem.push({ name: v.name, labelid: v.id })
    })
  }
  selectedPosition (item) {
    this.formradio.positionTypeName = item.name
  }
  // 复制
  surehandler (id) {
    if (!id) {
      this.$message({
        message: '请至少选择一个类别哦',
        type: 'warning'
      })
    } else {
      let data = { id: this.listid, to_pid: id }
      copylabelList(data).then((res) => {
        this.$message({
          message: '复制成功',
          type: 'success'
        })
        this.isshowRadio = false
        this.init()
      })
    }
  }
  // 移动
  movehandler (id) {
    let data = { id: this.listid, to_pid: id }
    editCategoryApi(data).then((res) => {
      this.isShowsort = false
      this.$message({
        message: '移动成功',
        type: 'success'
      })
      this.isshowRadio = false
      this.init()
    })
  }
  cancel () {
    this.isshowRadio = false
  }
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
      this.getfirstlist()
    })
  }
  /* 翻页 */
  handlePageChange (nowPage) {
    this.form.page = nowPage
  }
  getlabellist () {
    positionlabelList().then((res) => {
      this.labellist = res.data.data
    })
  }
  addtoHot (id, isHot) {
    if (isHot) {
      this.$confirm('是否将该类别从热门类别中移除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let data = { id: id, is_hot: 0 }
        editCategoryApi(data).then((res) => {
          this.$message({
            message: '移动成功',
            type: 'success'
          })
          this.init()
        })
      })
    } else {
      this.$confirm('是否将该类别添加至热门?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let data = { id: id, is_hot: 1 }
        editCategoryApi(data).then((res) => {
          this.$message({
            message: '添加成功',
            type: 'success'
          })
          this.init()
        })
      })
    }
  }
  // 点击标题的几级分类
  backto (num) {
    if (this.$route.query.level === num) {
      return false
    } else if (num === '2' || num === '3') {
      this.list = []
      if (this.$route.query.secodeid) {
        this.form.pid = this.$route.query.secodeid
      } else {
        this.form.pid = this.$route.query.id
      }
      this.getfirstlist()
      this.$router.push({ name: 'categoryList', query: { level: num, id: this.form.pid } })
    } else {
      this.list = []
      this.form.pid = ''
      this.getfirstlist()
      this.$router.push({ name: 'categoryList', query: { level: num } })
    }
  }
  // 查看分类
  check (id, num) {
    this.list = []
    if (num === 2) {
      this.form.pid = id
      this.getfirstlist()
      this.$router.push({ name: 'categoryList', query: { level: '2', id: id } })
    } else {
      this.form.pid = id
      this.getfirstlist()
      this.$router.push({ name: 'categoryList', query: { level: '3', id: id, secodeid: this.$route.query.id } })
    }
  }
  // 搜索
  onSubmit () {
    this.getfirstlist()
  }
  // 职位类别标签获取
  ManageList () {
    getLabelPositionListApi().then(res => {
      this.options = res.data.data
      this.options.forEach(item => {
        item.children.forEach(item1 => {
          item1.children.forEach(item2 => {
            let result = JSON.stringify(item2.children)
            if (result === '[]') delete item2.children
          })
        })
      })
    })
  }
  getfirstlist () {
    getCategoryApi(this.form).then((res) => {
      this.list = res.data.data
      this.total = res.data.meta.total
      this.pageCount = res.data.meta.lastPage
    })
  }
  init () {
    if (!this.$route.query.level || this.$route.query.level === '1') {
      this.list = []
      this.form.pid = ''
      this.$router.push({ name: 'categoryList', query: { level: '1' } })
      this.fields = [{
        prop: 'id',
        label: '品类ID',
        width: 400
      },
      {
        prop: 'name',
        label: '一级类别',
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
    } else {
      this.list = []
      this.form.pid = this.$route.query.id
      this.fields = [{
        prop: 'id',
        label: '品类ID',
        width: 400
      },
      {
        prop: 'name',
        label: '一级类别',
        width: 400
      },
      {
        prop: 'sort',
        label: '权重',
        width: 400
      },
      {
        prop: 'isHot',
        label: '热门'
      },
      {
        prop: 'level',
        fixed: 'right',
        width: 150,
        label: '操作'
      }]
    }
    this.getfirstlist()
  }

  created () {
    this.init()
    this.ManageList()
    this.getlabellist()
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
</style>
