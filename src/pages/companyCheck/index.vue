<!--公司审核管理-->
<template>
  <div class="companyCheck">
    <el-container class="container" style="border: 1px solid #eee">
      <el-header class="app-title header" style="text-align: right; font-size: 15px">
        <div class="title">审核管理({{total}})</div>
        <div class="export"><el-button @click="addCompany" class="btn-limit-width">+ 新建公司</el-button></div>
        <el-button type="primary" @click="download" :disabled="!canDownloadData" v-if="AdminShow == 0 || AdminShow == 2 || AdminShow == 1 || AdminShow == 4 || AdminShow == 5">导出</el-button>
      </el-header>
      <el-main>
        <!--筛选-->
        <div class="selectionBox" @keyup.enter="search">
          <el-form ref="form" :model="form" label-width="80px" validate="validate">
            <el-form-item label="关键词" prop="keyword">
              <el-input v-model="form.keyword" placeholder="请输入提交人/公司全称"></el-input>
            </el-form-item>
            <el-form-item label="申请时间" prop="start" style="margin-left: 10px;">
              <el-col :span="11">
                <el-date-picker
                  type="date"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd"
                  v-model="form.start"
                  style="width: 100%;"
                ></el-date-picker>
              </el-col>
              <el-col class="line" :span="2">—</el-col>
              <el-col :span="11">
                <el-date-picker
                  type="date"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd"
                  v-model="form.end"
                  style="width: 100%;"
                ></el-date-picker>
              </el-col>
            </el-form-item>
            <!--用于代替清除结束时间-->
            <el-form-item label-width="1px" label prop="end"></el-form-item>

            <el-form-item
              label-width="100px"
              label="公司认证状态"
              prop="status"
              style="margin-left: 20px;"
            >
              <el-select v-model="form.status" placeholder="全部状态">
                <el-option label="待审核" value="0"></el-option>
                <el-option label="已通过" value="1"></el-option>
                <el-option label="未通过" value="2"></el-option>
                <el-option label="未提交" value="3"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label-width="100px"
              label="身份认证状态"
              prop="auth_status"
              style="margin-left: 20px;"
            >
              <el-select v-model="form.auth_status" placeholder="全部状态">
                <el-option label="待审核" value="0"></el-option>
                <el-option label="已通过" value="1"></el-option>
                <el-option label="未通过" value="2"></el-option>
                <el-option label="未提交" value="3"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label-width="100px" label="营业执照" prop="is_license">
              <el-select v-model="form.is_license" placeholder="全部状态">
                <el-option label="全部" value></el-option>
                <el-option label="无营业执照" value="0"></el-option>
                <el-option label="有营业执照" value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label-width="90px"
              label="跟进销售"
              prop="admin_uid"
              style="margin-left: 20px;"
            >
              <el-select v-model="form.admin_uid" placeholder="跟进销售">
                <el-option label="全部" value="all" v-if="AdminShow==4"></el-option>
                <el-option label="无" value="0"></el-option>
                <el-option
                  v-for="item in userList"
                  :key="item.id"
                  :label="item.realname"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label-width="90px"
              label="公司来源"
              prop="wherefrom"
              style="margin-left: 20px;">
              <el-select v-model="form.wherefrom" placeholder="公司来源">
                <el-option label="全部" value></el-option>
                <el-option label="后台创建" value="2"></el-option>
                <el-option label="用户创建" value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label-width="90px"
              label="客户等级"
              prop="customer_level"
              style="margin-left: 20px;">
              <el-select v-model="form.customer_level" placeholder="客户等级">
                <el-option :label="item.text" :value="item.value" v-for="item in companyCustomerLevelRange" :key="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="提交时间" prop="start" style="margin-left: 10px;">
              <el-col :span="11">
                <el-date-picker
                  type="date"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd"
                  v-model="form.sstart"
                  style="width: 100%;"
                ></el-date-picker>
              </el-col>
              <el-col class="line" :span="2">—</el-col>
              <el-col :span="11">
                <el-date-picker
                  type="date"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd"
                  v-model="form.send"
                  style="width: 100%;"
                ></el-date-picker>
              </el-col>
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
          @page-change="handlePageChange"
        >
          <template slot-scope="props" slot="columns">
            <!-- 操作列 -->
            <div
              class="btn-container"
              v-if="props.scope.column.property === 'id'"
              style="height: 48px;"
            >
              <div>
                <span class="check" @click="check(props.scope.row[props.scope.column.property])">查看</span>
              </div>
            </div>
            <div class="btn-container" v-else-if="props.scope.column.property === 'customer_level'">
              <el-select
                v-model="list[props.scope.$index].customerVevelValue"
                placeholder="请选择"
                @change="change(props.scope.$index, list[props.scope.$index].customerVevelValue)">
                <el-option
                  v-for="item in props.scope.row[props.scope.column.property]"
                  :key="item.value"
                  :label="item.text"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
            <!-- 序号 -->
            <!--<div class="btn-container" v-else-if="props.scope.column.property === 'index'">
              <div>
                <span>{{props.scope.$index +1}}</span>
              </div>
            </div>-->
            <!-- 提交人 -->
            <div
              class="btn-container"
              v-else-if="props.scope.column.property === 'realName'"
              style="justify-content: flex-start;"
            >
              <span style="text-align: left;">{{props.scope.row[props.scope.column.property]}}</span>
            </div>
            <!-- 跟进销售 -->
            <div
              class="btn-container"
              v-else-if="props.scope.column.property === 'adminName'"
              style="justify-content: flex-start;"
            >
              <span style="text-align: left;">
                <span v-if="props.scope.row.adminUid">{{props.scope.row.adminName}}</span>
                <span v-else class="btn" @click.stop="toEditSaller(props.scope.row.id)">添加跟进销售</span>
              </span>
            </div>
            <!-- 申请信息列 -->
            <div
              class="btn-container"
              v-else-if="props.scope.column.property === 'companyName'"
              style="height: 48px;"
            >
              <div class="companyName">
                <div class="name">{{props.scope.row[props.scope.column.property]}}</div>
                <div class="label">
                  <span
                    class="industry"
                    v-if="props.scope.row.industry!=''"
                  >{{props.scope.row.industry}}</span>
                  <span
                    class="capital"
                    v-if="props.scope.row.financingInfo!=''"
                  >{{props.scope.row.financingInfo}}</span>
                  <span
                    class="extent"
                    v-if="props.scope.row.employeesInfo!=''"
                  >{{props.scope.row.employeesInfo}}</span>
                </div>
              </div>
            </div>
            <!--认证状态-->
            <div
              class="btn-container"
              v-else-if="props.scope.column.property === 'status' || props.scope.column.property === 'authStatus'"
              style="height: 48px;"
            >
              <div>
                <span
                  :class="{'row-delete': props.scope.row.status !== 1}"
                  v-show="!props.scope.row[props.scope.column.property] && props.scope.row[props.scope.column.property] !== 0"
                >
                  未提交
                  <i class="el-icon-error" style="color: #F56C6C;"></i>
                </span>
                <span
                  :class="{'row-delete': props.scope.row.status !== 1}"
                  v-show="props.scope.row[props.scope.column.property] === 0"
                >
                  待审核
                  <i class="el-icon-warning" style="color: #E6A23C;"></i>
                </span>
                <span
                  :class="{'row-delete': props.scope.row.status !== 1}"
                  v-show="props.scope.row[props.scope.column.property] === 1"
                >
                  已通过
                  <i class="el-icon-success" style="color: #67C23A;"></i>
                </span>
                <span
                  :class="{'row-delete': props.scope.row.status !== 1}"
                  v-show="props.scope.row[props.scope.column.property] === 2"
                >
                  未通过
                  <i class="el-icon-error" style="color: #F56C6C;"></i>
                </span>
                <!-- 公司认证状态的未提交 -->
                <span
                  :class="{'row-delete': props.scope.row.status !== 1}"
                  v-show="props.scope.row[props.scope.column.property] === 3"
                >
                  未提交
                  <i class="el-icon-error" style="color: #F56C6C;"></i>
                </span>
              </div>
            </div>
            <template v-else>
              <span
                :class="{'row-delete': props.scope.row.status !== 1}"
              >{{props.scope.row[props.scope.column.property]}}</span>
            </template>
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
import { getSalerListApi, getCompanyCustomerLevelRangeApi } from 'API/common'
import { templistApi, setCompanyCompanyLevelApi } from 'API/company'
import { getAccessToken } from 'API/cacheService'
import { API_ROOT } from 'API/index.js'
@Component({
  name: 'course-list',
  components: {
    List
  }
})
export default class companyCheck extends Vue {
  canDownloadData = true
  toggle = false;
  total = 0; // 筛查结果数量
  pageCount = 0; // 请求回的数据共几页
  AdminShow = ''; // 权限字段，限制搜索
  form = {
    wherefrom: '',
    is_license: '',
    admin_uid: '',
    keyword: '',
    status: '',
    auth_status: '',
    start: '',
    end: '',
    sstart: '',
    send: '',
    page: 1,
    count: 20,
    customer_level: ''
  };
  fields = [
    // {
    //   prop: 'index',
    //   label: '序号',
    //   width: 50
    // },
    {
      prop: 'companyName',
      label: '申请信息',
      width: 400
    },
    {
      prop: 'realName',
      label: '提交人',
      width: 100,
      align: 'left'
    },
    {
      prop: 'customer_level',
      label: '客户等级',
      width: 200,
      align: 'left'
    },
    {
      prop: 'adminName',
      label: '跟进销售',
      width: 200,
      align: 'left'
    },
    {
      prop: 'status',
      label: '公司认证状态',
      width: 200
    },
    {
      prop: 'authStatus',
      label: '身份认证状态',
      width: 200
    },
    {
      prop: 'createdAt',
      label: '申请时间',
      width: 200
    },
    {
      prop: 'id',
      fixed: 'right',
      label: '操作'
    }
  ];
  list = [];
  companyCustomerLevelRange = []
  change (index, value) {
    let item = this.list.find((field, i) => index === i)
    setCompanyCompanyLevelApi({ id: item.id, customerLevel: value })
  }
  /**
   * @Author   小书包
   * @DateTime 2019-07-19
   * @detail   获取跟进销售列表
   * @return   {[type]}   [description]
   */
  getCompanyCustomerLevelRange () {
    getCompanyCustomerLevelRangeApi().then(res => (this.companyCustomerLevelRange = res.data.data))
  }
  onSubmit (e) {
    this.form.page = 1
    this.getTemplist()
  }
  // 搜索公司
  search () {
    this.onSubmit()
  }
  addCompany () {
    this.$router.push({
      path: '/index/createCompany',
      query: {
        isCreated: true,
        from: 'cp'
      }
    })
  }
  check (id) {
    this.$route.meta.scrollY = window.scrollY
    this.$router.push({
      path: '/check/companyCheck/verify',
      query: { id: id }
    })
  }
  /* 翻页 */
  handlePageChange (nowPage) {
    this.$route.meta.scrollY = 0
    window.scrollTo(0, 0)
    this.form.page = nowPage
    this.getTemplist()
  }
  /* 请求审核列表 */
  getTemplist () {
    let params = {
      page: this.form.page,
      count: this.form.count
    }
    if (this.form.keyword) {
      params = Object.assign(params, { keyword: this.form.keyword })
    }
    if ((this.form.start && !this.form.end) || (!this.form.start && this.form.end)) {
      this.$message({ message: '申请时间必须选择开始时间和结束时间', type: 'warning' })
      return
    } else {
      if (this.form.start && this.form.end) {
        params = Object.assign(params, { start: this.form.start, end: this.form.end })
      } else {
        if ((this.form.sstart && !this.form.send) || (!this.form.sstart && this.form.send)) {
          this.$message({ message: '提交时间必须选择开始时间和结束时间', type: 'warning' })
          return
        } else {
          params = Object.assign(params, { start: this.form.sstart, end: this.form.send })
        }
      }
    }
    if (this.form.status) {
      params = Object.assign(params, { status: this.form.status })
    }
    if (this.form.auth_status) {
      params = Object.assign(params, { auth_status: this.form.auth_status })
    }
    if (this.form.admin_uid) {
      params = Object.assign(params, { admin_uid: this.form.admin_uid })
    }
    if (this.form.is_license) {
      params = Object.assign(params, { is_license: this.form.is_license })
    }
    if (this.form.wherefrom) {
      params = Object.assign(params, { wherefrom: this.form.wherefrom })
    }
    if (this.form.customer_level !== '') {
      params = Object.assign(params, { customer_level: this.form.customer_level })
    }
    templistApi(params).then(res => {
      let list = res.data.data
      list.map((field, index) => {
        field.customer_level = [].concat(this.companyCustomerLevelRange)
        field.customerVevelValue = field.customerLevel
      })
      this.list = list
      this.total = res.data.meta.total
      this.pageCount = res.data.meta.lastPage
    })
  }

  /* 清除列表选项 */
  resetForm (name) {
    this.form.sstart = undefined
    this.form.send = undefined
    this.$refs[name].resetFields()
  }
  /* 去选择跟进销售 */
  toEditSaller (id) {
    this.$route.meta.scrollY = window.scrollY
    this.$router.push({
      path: `/check/companyCheck/${id}`,
      query: { isEditSaller: true }
    })
  }
  created () {
    this.userList()
    this.AdminShow = +sessionStorage.getItem('AdminShow')
    this.getTemplist()
    this.getCompanyCustomerLevelRange()
  }
  userList () {
    getSalerListApi().then(res => {
      this.userList = res.data.data
    })
  }
  download () {
    this.$confirm('是否导出该列表数据?', '提示', {
      confirmButtonText: '是',
      cancelButtonText: '否',
      type: 'warning'
    }).then(() => {
      let date = new Date()
      let downloadName = `公司审核管理-${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}.xlsx`
      let url = `${API_ROOT}/company/templist?isExport=1`

      if (this.form.keyword) {
        url += `&keyword=${this.form.keyword}`
      }

      if ((this.form.start && !this.form.end) || (!this.form.start && this.form.end)) {
        this.$message({ message: '申请时间必须选择开始时间和结束时间', type: 'warning' })
      } else {
        if (this.form.start && this.form.end) {
          url += `&start=${this.form.start}&end=${this.form.end}`
        }
      }
      if (this.form.sstart && this.form.send) {
        url += `&start=${this.form.sstart}&end=${this.form.send}`
      }
      if (this.form.status) {
        url += `&status=${this.form.status}`
      }
      if (this.form.auth_status) {
        url += `&auth_status=${this.form.auth_status}`
      }
      if (this.form.admin_uid) {
        url += `&admin_uid=${this.form.admin_uid}`
      }
      if (this.form.is_license) {
        url += `&is_license=${this.form.is_license}`
      }
      if (this.form.wherefrom) {
        url += `&wherefrom=${this.form.wherefrom}`
      }
      if (this.form.customer_level !== '') {
        url += `&customer_level=${this.form.customer_level}`
      }
      url = url.replace(/\s*/g, '')
      let xmlResquest = new XMLHttpRequest()
      xmlResquest.open('get', url, true)
      xmlResquest.setRequestHeader('Content-type', 'application/json')
      xmlResquest.setRequestHeader('Authorization-Admin', getAccessToken())
      xmlResquest.responseType = 'blob'
      this.canDownloadData = false
      xmlResquest.onload = () => {
        let content = xmlResquest.response
        let link = document.createElement('a')
        let blob = new Blob([content])
        link.download = downloadName
        link.style.display = 'none'
        link.href = URL.createObjectURL(blob)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        this.canDownloadData = true
      }
      xmlResquest.send()
    }).catch(() => {
      this.$message({
        type: 'info',
        message: '已取消导出'
      })
    })
  }
}
</script>

<style lang="less" scoped="scoped">
.companyCheck {
  .container {
    min-width: 1000px;
    margin: 22px;
    .header {
      .export{
        position: absolute;
        right: 140px;
      }
      .creatBtn {
        font-size: 15px;
        padding: 12px 20px;
        background-color: #ffe266;
        border-radius: 4px;
      }
    }
    .el-form {
      .el-input {
        width: 200px;
      }
      &::after {
        content: "";
        display: block;
        height: 0;
        clear: both;
      }
    }
    .el-form-item {
      float: left;
    }
    .btn {
      span {
        white-space: nowrap;
        user-select: none;
        cursor: pointer;
        line-height: 12px;
        color: #409eff;
      }
    }
    /* 公司申请信息栏样式 */
    .companyName {
      width: 100%;
      display: flex;
      flex-direction: column;
      padding: 0 20px;
      .name {
        font-size: 16px;
        font-weight: bolder;
        width: 300px;
        text-align: left;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        line-height: 30px;
      }
      .label {
        white-space: nowrap;
        text-align: left;
        width: 100%;
        span {
          display: inline-block;
          background-color: #f8f8f8;
          padding: 0 4px;
          border-radius: 3px;
          margin-right: 20px;
        }
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
        color: #409eff;
      }
    }
  }
}
</style>
<style>
.companyCheck .m-list{
  padding-left: 0;
  padding-right: 0;
}
</style>
