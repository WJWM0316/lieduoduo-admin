<!--招聘官管理-->
<template>
  <div class="officerManage">
    <el-container class="container" style="border: 1px solid #eee">
      <el-header class="header" style="text-align: right; font-size: 15px">
        <div class="title">简历敏感词({{total}})</div>
      </el-header>
      <el-main>
        <!--筛选-->
        <div class="selectionBox">
          <el-form ref="form" label-width="90px">
            <el-form-item label="敏感词名称" prop="keyword">
              <el-input v-model="form.name" placeholder="请输入敏感词名称"></el-input>
              <el-button style="margin-left:30px;" type="primary" @click="getsensitivelists">查询</el-button>
            </el-form-item>
            <el-form-item class="btn">
              <el-button type="primary" @click="newlyBuild">新建</el-button>
            </el-form-item>
          </el-form>
        </div>
        <!--筛选-->
        <list
          :fields="fields"
          :list="list"
          :total="total"
          :page="form.page"
          :page-count="pageCount"
          @page-change="handlePageChange">
          <template slot-scope="props" slot="columns">
            <!-- 操作列 -->
            <div style="flex-wrap: wrap;" class="btn-container" v-if="props.scope.column.property === 'sensitiveWord'">
              <div>
                {{props.scope.row.sensitiveWord}}
              </div>
            </div>
            <div style="flex-wrap: wrap;" class="btn-container" v-if="props.scope.column.property === 'createdAt'">
              <div>
                {{props.scope.row.createdAt}}
              </div>
            </div>
            <div style="flex-wrap: wrap;" class="btn-container" v-if="props.scope.column.property === 'id'">
              <div>
                <span class="check" @click="editsensitiveWords(props.scope.row)">编辑</span>
              </div>
              <div style="width: 100%; cursor: pointer; color: #652791;" @click.stop="deletesensitiveWords(props.scope.row)">删除</div>
            </div>
          </template>
        </list>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import List from '@/components/list'
import { getsensitivelist, deleteSensitiveApi } from 'API/resumesensitiveWords'
@Component({
  name: 'officerManage',
  components: {
    List
  }
})
export default class officerManage extends Vue {
  total = 0
  pageCount = 0
  form = {
    name: '',
    page: 1,
    count: 20
  }
  fields = [
    {
      prop: 'sensitiveWord',
      label: '简历敏感词名称'
      // width: 150
    },
    {
      prop: 'createdAt',
      label: '创建时间'
      // width: 200
    },
    {
      prop: 'id',
      fixed: 'right',
      // width: 150,
      label: '操作'
    }
  ]
  list = []
  newlyBuild () {
    this.$router.push({
      path: '/resumeStore/resumesensitiveWords/addsensitiveWords'
    })
  }
  editsensitiveWords (data) {
    this.$router.push({
      path: '/resumeStore/resumesensitiveWords/addsensitiveWords',
      query: { id: data.id }
    })
  }
  deletesensitiveWords (data) {
    this.$confirm('删除后将无法恢复', '是否删除该敏感词', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      let data1 = { id: data.id }
      deleteSensitiveApi(data1).then((res) => {
        this.getsensitivelists()
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      })
    }).catch(() => {
      this.$message({
        type: 'info',
        message: '已取消删除'
      })        
    })
  }
  getsensitivelists () {
    getsensitivelist(this.form).then((res) => {
      this.list = res.data.data
      this.total = res.data.meta.total
      this.pageCount = res.data.meta.lastPage
    })
  }
  /* 翻页 */
  handlePageChange (nowPage) {
    this.$route.meta.scrollY = 0
    window.scrollTo(0, 0)
    this.form.page = nowPage
    this.getsensitivelists()
  }
  created () {
    this.getsensitivelists()
  }
}
</script>

<style lang="less" scoped="scoped">
.officerManage{
  /*padding: 22px;*/
  .container{
    min-width: 1000px;
    margin: 22px;
    .header{
      display: flex;
      align-items: center;
      justify-content: space-between;
      .title{
        display: flex;
        align-items: center;
        position: relative;
        font-size: 15px;
        &::before{
          background: #ffe266;
          content: "";
          display: inline-block;
          float: left;
          height: 100%;
          height: 16px;
          margin-right: 10px;
          width: 6px;
        }
      }
      .creatBtn{
        font-size: 15px;
        padding: 12px 20px;
        background-color: #ffe266;
        border-radius: 4px;
      }
    }
  }
  .el-form{
    /* 筛选 */
    .inputSelect{
      float: left;
      margin-left: 10px;
      margin-bottom: 22px;
      width: 400px !important;
      background-color: #FFFFFF;
      .el-select{
        width: 120px;
        margin-top: -2px;
        border: none;
        box-sizing: border-box;
      }
    }
    .el-input{
      width: 200px;
    }
    &::after {
      content: '';
      display: block;
      height: 0;
      clear: both;
    }
  }
  .el-form-item{
    float: left;
  }
  .btn{
    float: right;
    .inquire{
      color: #FFFFFF;
      background-color: #652791;
    }
    span{
      white-space: nowrap;
      user-select:none;
      cursor: pointer;
      line-height: 12px;
      color: #652791;
    }
  }
  .btn-container{
    display: flex;
    align-items: center;
    justify-content: flex-start;
    .check{
      line-height: 48px;
      color: #652791;
      cursor: pointer;
    }
  }
}
.inquire{
  background-color: #652791;
  color: #FFFFFF;
  border-radius: 4px;
}
.qrCode {
  border-radius: 4px;
  color: #652791;
  position: absolute;
  top: -999px;
  left: -999px;
  z-index: 3;
  line-height: 60px;
  .phoneBg {
    display: block;
    position: absolute;
    top: 0;
    left: 5%;
    z-index: -1;
  }
}
.qrCode {
    text-align: center;
    width: 300px;
    height: 300px;
    /*background-color: #CCCCCC;*/
    transform: translateY(-100%) translateX(-50%);
    .Qr{
      width: 200px;
      height: 200px;
      margin-top: 30px;
    }
    .bg{
      width: 100%;
      height: 100%;
      max-width: 100%;
      max-height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      z-index: -1;
    }
    .txt{
      line-height: normal;
      color: #5C565D;
      margin-top: 5px;
    }
  }
</style>
