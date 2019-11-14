<!--招聘官管理-->
<template>
  <div class="officerManage" @click="closeTopic">
    <el-container class="container" style="border: 1px solid #eee">
      <el-header class="header" style="text-align: right; font-size: 15px">
        <div class="title">招聘官管理({{total}})</div>
      </el-header>
      <el-main>
        <!--筛选-->
        <div class="selectionBox" @keyup.enter="search">
          <el-form ref="form" :model="form" label-width="80px" validate="validate">
            <div class="content">
              <el-input type='text' placeholder="请输入内容" v-model="searchType.keyword1" class="inputSelect">
                <el-select class="selectTitle" v-model="searchType.condition1" slot="prepend" placeholder="请选择">
                  <el-option v-for="item in keyword" :key="item.label" :label="item.label" :value="item.value" v-show="searchType.condition2 !== item.value"></el-option>
                </el-select>
              </el-input>
            </div>
            <div class="content">
              <el-input type='text' placeholder="请输入内容" v-model="searchType.keyword2" class="inputSelect">
                <el-select class="selectTitle" v-model="searchType.condition2" slot="prepend" placeholder="请选择">
                  <el-option v-for="item in keyword" :key="item.label" :label="item.label" :value="item.value" v-show="searchType.condition1 !== item.value"></el-option>
                </el-select>
              </el-input>
            </div>
            <el-form-item label="申请时间" prop="start">
              <el-col :span="11">
                <el-date-picker type="date" placeholder="选择日期" value-format="yyyy-MM-dd" v-model="form.start" style="width: 100%;"></el-date-picker>
              </el-col>
              <el-col class="line" :span="2">-</el-col>
              <el-col :span="11">
                <el-date-picker type="date" placeholder="选择日期" value-format="yyyy-MM-dd" v-model="form.end" style="width: 100%;"></el-date-picker>
              </el-col>
            </el-form-item>

            <!--用于代替清除结束时间-->
            <el-form-item label-width="1px" label="" prop="end">
            </el-form-item>

            <el-form-item label-width="120px" label="加入审核状态" prop="status">
              <el-select v-model="form.status" placeholder="全部状态">
                <el-option label="管理员-审核中" value="0"></el-option>
                <el-option label="管理员-审核通过" value="1"></el-option>
                <el-option label="管理员-审核失败" value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label-width="120px" label="身份认证状态" prop="auth_status">
              <el-select v-model="form.auth_status" placeholder="全部状态 ">
                <el-option label="待审核" value="0"></el-option>
                <el-option label="已通过" value="1"></el-option>
                <el-option label="未通过" value="2"></el-option>
                <el-option label="未提交" value="-1"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label-width="120px" label="身份审核模式" prop="audit_mode">
              <el-select v-model="form.audit_mode" placeholder="全部状态 ">
                <el-option label="自动" value="1"></el-option>
                <el-option label="人工" value="2"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item class="btn">
              <el-button type="primary" @click="onSubmit">查询</el-button>
              <el-button @click.stop="resetForm('form')">重置</el-button>
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
            <div style="flex-wrap: wrap;" class="btn-container" v-if="props.scope.column.property === 'id'">
              <div>
                <span class="check" @click="check(props.scope.row[props.scope.column.property])">查看</span>
              </div>
              <div style="width: 100%; cursor: pointer; color: #652791;" @click.stop="creatLink($event, props.scope.row, props.scope.$index)">查看招聘官</div>
            </div>
            <!-- 序号 -->
            <div class="btn-container" v-else-if="props.scope.column.property === 'index'">
              <div>
                <span>{{props.scope.$index +1}}</span>
              </div>
            </div>
            <!-- 审核模式 -->
            <div class="btn-container" v-else-if="props.scope.column.property === 'auditMode'" style="height: 48px;">
              <span v-show="props.scope.row.auditMode === 1">
                自动
              </span>
              <span v-show="props.scope.row.auditMode === 2">
                人工
              </span>
            </div>
            <!--身份认证状态-->
            <div class="btn-container" v-else-if="props.scope.column.property === 'authStatus'" style="height: 48px;">
              <div>
                <span v-show="props.scope.row.authStatus === -1">
                  未提交 <i class="el-icon-warning" style="color: #E6A23C;"></i>
                </span>
                <span v-show="props.scope.row.authStatus === 0">
                  <span>待审核 <i class="el-icon-warning" style="color: #E6A23C;"></i></span>
                </span>
                <span v-show="props.scope.row.authStatus === 1">
                  已通过 <i class="el-icon-success" style="color: #67C23A;"></i>
                </span>
                <span v-show="props.scope.row.authStatus === 2">
                  未通过 <i class="el-icon-error" style="color: #F56C6C;"></i>
                </span>
              </div>
            </div>
            <template v-else><span :class="{'row-delete': props.scope.row.status !== 1}">{{props.scope.row[props.scope.column.property]}}</span></template>
          </template>
        </list>
      </el-main>
    </el-container>
    <!--小程序码展示框-->
    <div class="qrCode" ref="qrCode">
      <img class="bg" src="../../assets/code_bg.png"/>
      <div style="height: 100%;display: flex; align-items: center;flex-direction: column;justify-content: center;" v-if="!qrCode">
        <img style="height: 38px;width: 38px;" src="../../assets/loading.gif"/>
        <div class="txt">正在加载中…</div>
      </div>
      <div v-else>
        <img class="Qr" :src="qrCode"/>
        <div class="txt">微信扫码，打开小程序查看</div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import List from '@/components/list'
import { getRecruiterListApi } from 'API/recruiter'
import { getRecruiterCodeUrlApi } from 'API/interview'
@Component({
  name: 'officerManage',
  components: {
    List
  }
})
export default class officerManage extends Vue {
  total = 0
  pageCount = 0
  qrCode = ''
  form = {
    keyword: '',
    status: '',
    auth_status: '',
    start: '',
    end: '',
    mobile: '',
    company_name: '',
    real_name: '',
    audit_mode: '',
    page: 1,
    count: 20
  }
  searchType = {
    condition1: 'company_name',
    condition2: 'mobile',
    keyword1: '',
    keyword2: ''
  }
  /* 搜索关键字 */
  keyword = [
    { label: '公司名字', value: 'company_name' },
    { label: '手机号', value: 'mobile' },
    { label: '人名', value: 'real_name' }
  ]
  fields = [
    {
      prop: 'index',
      label: '序号'
      // width: 60
    },
    {
      prop: 'realName',
      label: '申请信息'
      // width: 150
    },
    {
      prop: 'userEmail',
      label: '邮箱'
      // width: 220
    },
    {
      prop: 'userPosition',
      label: '公司职务'
      // width: 150
    },
    {
      prop: 'companyName',
      label: '加入公司'
      // width: 220
    },
    {
      prop: 'statusDesc',
      label: '加入审核状态'
      // width: 150
    },
    {
      prop: 'authStatus',
      label: '身份认证状态'
      // width: 150
    },
    {
      prop: 'auditMode',
      label: '身份审核模式'
      // width: 150
    },
    {
      prop: 'createdAt',
      label: '申请时间'
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
  onSubmit (e) {
    this.form.page = 1
    let searchCondition = {}
    if (this.searchType.condition1 && this.searchType.keyword1) searchCondition[this.searchType.condition1] = this.searchType.keyword1
    if (this.searchType.condition2 && this.searchType.keyword2) searchCondition[this.searchType.condition2] = this.searchType.keyword2
    let searchForm = Object.assign({}, this.form, searchCondition)
    if (searchForm.start !== '' && searchForm.end === '') {
      this.$message({
        message: '申请时间必须选择开始时间和结束时间',
        type: 'warning'
      })
      return
    } else if (searchForm.start === '' && searchForm.end !== '') {
      this.$message({
        message: '申请时间必须选择开始时间和结束时间',
        type: 'warning'
      })
      return
    }
    this.getRecruiterList(searchForm)
  }
  // 搜索地址
  search () {
    this.onSubmit()
  }
  /* 重置筛选 */
  resetForm (name) {
    this.searchType = {
      condition1: 'company_name',
      condition2: 'mobile',
      keyword1: '',
      keyword2: ''
    }
    this.$refs[name].resetFields()
  }
  /* 请求招聘官审核列表 */
  getRecruiterList (newForm) {
    getRecruiterListApi(newForm || this.form).then(res => {
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
    this.getRecruiterList()
  }
  /* 查看相应的招聘官审核详情 */
  check (id) {
    this.$route.meta.scrollY = window.scrollY
    this.$router.push({
      path: '/check/recruitmentOfficer/reviewDetails',
      query: { id: id }
    })
  }
  /* 生成职位详情小程序码 */
  async creatLink (e, data, index) {
    this.qrCode = ''
    if (data.status !== 1) {
      this.$message.error(`招聘官未通过审核,暂无招聘官页`)
      return
    }
    // 是否已经加载过二维码
    if (this.list[index].qrCode) {
      this.qrCode = this.list[index].qrCode
      this.$nextTick(() => {
        this.$refs['qrCode'].style.display = 'block'
        this.$refs['qrCode'].style.left = e.clientX + 'px'
        this.$refs['qrCode'].style.top = e.clientY + window.scrollY + 'px'
      })
      return
    }

    this.$nextTick(() => {
      this.$refs['qrCode'].style.display = 'block'
      this.$refs['qrCode'].style.left = e.clientX + 'px'
      this.$refs['qrCode'].style.top = e.clientY + window.scrollY + 'px'
    })
    let res = await this.getQr(data.uid)
    this.qrCode = res.data.data.qrCodeUrl
    this.list[index].qrCode = res.data.data.qrCodeUrl
  }

  /* 生成二维码 */
  getQr (id) {
    return getRecruiterCodeUrlApi({ id: id })
  }
  /* 关闭浮窗 */
  closeTopic () {
    this.$nextTick(() => {
      this.$refs['qrCode'].style.display = 'none'
    })
  }

  created () {
    this.getRecruiterList()
  }
  activated () {
    let that = this
    setTimeout(function () {
      window.scrollTo(0, that.$route.meta.scrollY)
    }, 300)
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
