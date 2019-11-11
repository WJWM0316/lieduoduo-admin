<!--招聘官管理-->
<template>
  <div class="recruiter_list" @click.stop="closeTopic">
    <el-container class="container" style="border: 1px solid #eee">
      <el-header class="header" style="text-align: right; font-size: 15px">
        <div class="title">招聘官管理({{total}})</div>
        <el-button @click.stop="addUser" class="btn-limit-width">+ 添加用户</el-button>
      </el-header>
      <el-main>
        <!--筛选-->
        <div class="selectionBox" @keyup.enter="onSubmit">
          <el-form ref="form" :model="form" label-width="80px" validate="validate">
            <!-- 筛选条件1 -->
            <div class="content">
              <el-input
                type="text"
                placeholder="请输入内容"
                v-model="form.keyword1"
                class="inputSelect"
              >
                <el-select
                  class="selectTitle"
                  v-model="form.searchType1"
                  slot="prepend"
                  placeholder="请选择"
                  @change="changeType1"
                >
                  <el-option
                    v-for="item in keyword"
                    :key="item.label"
                    :label="item.label"
                    :value="item.value"
                    v-show="form.searchType2 !== item.value"
                  ></el-option>
                </el-select>
              </el-input>
            </div>
            <!-- 筛选条件2 -->
            <div class="content">
              <el-input
                type="text"
                placeholder="请输入内容"
                v-model="form.keyword2"
                class="inputSelect"
              >
                <el-select
                  class="selectTitle"
                  v-model="form.searchType2"
                  slot="prepend"
                  placeholder="请选择"
                  @change="changeType2"
                >
                  <el-option
                    v-for="item in keyword"
                    :key="item.label"
                    :label="item.label"
                    :value="item.value"
                    v-show="form.searchType1 !== item.value"
                  ></el-option>
                </el-select>
              </el-input>
            </div>

            <el-form-item class="time" label="创建时间" prop="createTimeStart" label-width="100px">
              <el-col :span="11">
                <el-date-picker
                  type="date"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd"
                  v-model="form.createTimeStart"
                  style="width: 100%;"
                ></el-date-picker>
              </el-col>
              <el-col class="line" :span="1">—</el-col>
              <el-col :span="11">
                <el-date-picker
                  type="date"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd"
                  v-model="form.createTimeEnd"
                  style="width: 100%;"
                ></el-date-picker>
              </el-col>
            </el-form-item>

            <el-form-item class="state" label="身份类型" prop="role">
              <el-select
                class="selectState"
                v-model="form.role"
                placeholder="全部状态"
                @change="changeProvince"
              >
                <el-option label="全部" value="99"></el-option>
                <!-- <el-option label="无身份" value="0"></el-option> -->
                <el-option label="招聘官" value="2"></el-option>
                <el-option label="管理员" value="3"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item
              class="state"
              label="发布职位权益"
              label-width="120px"
              prop="createPositionRight"
            >
              <el-select
                class="selectState"
                v-model="form.createPositionRight"
                placeholder="全部状态"
                @change="changeProvince"
              >
                <el-option label="全部" value="99"></el-option>
                <el-option label="无" value="-1"></el-option>
                <el-option label="否" value="0"></el-option>
                <el-option label="是" value="1"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item class="state" label="身份认证状态" label-width="120px" prop="idAuth">
              <el-select
                class="selectState"
                v-model="form.idAuth"
                placeholder="全部状态"
                @change="changeProvince"
              >
                <el-option label="全部" value="99"></el-option>
                <el-option label="未提交" value="-1"></el-option>
                <el-option label="待审核" value="0"></el-option>
                <el-option label="已通过" value="1"></el-option>
                <el-option label="未通过" value="2"></el-option>
              </el-select>
            </el-form-item>
            <!-- 跟进人筛选 -->
            <el-form-item class="area" label="跟进人" prop="admin_uid" label-width="70px">
              <el-select v-model="form.admin_uid" placeholder="请选择" style="margin-right: 10px;">
                <el-option label="全部" value></el-option>
                <el-option label="无" value="0"></el-option>
                <el-option
                  v-for="item in salerLis"
                  :key="item.id"
                  :label="item.realname"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>

            <!-- 职位类别 -->
            <el-form-item label="职位类别">
              <el-cascader
                ref="cascader"
                placeholder="职位类别"
                :options="options"
                filterable
                change-on-select
                :clearable="clearable"
                :props="positionManage"
                @change="type"
              ></el-cascader>
            </el-form-item>

            <!-- 职务名称 -->
          <el-form-item label="职务名称">
            <el-input placeholder="请输入职务名称" v-model="form.position"></el-input>
          </el-form-item>

            <el-form-item class="btn">
              <el-button @click.stop="onSubmit" style="color: white !important" type="primary">查询</el-button>
              <el-button @click.stop="resetForm('form')">重置</el-button>
            </el-form-item>
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
              v-if="props.scope.column.property === 'id'"
            >
              <div>
                <span class="check" @click.stop="check(props.scope.row.uid)">查看</span>
              </div>
              <div
                style="width: 100%; cursor: pointer; color: #652791;"
                @click.stop="creatLink($event, props.scope.row, props.scope.$index)"
              >小程序码</div>
              <div v-if="props.scope.row.isRapidlyRecruiter === 0" class="check" @click="checkRecruitment(props.scope.row.uid)">添加到24h招聘官</div>
            </div>
            <!-- 序号 -->
            <div class="btn-container" v-else-if="props.scope.column.property === 'index'">
              <div>
                <span>{{props.scope.$index +1}}</span>
              </div>
            </div>
            <!-- 个人信息 -->
            <div v-else-if="props.scope.column.property === 'name'">
              <p>{{props.scope.row.name}}</p>
              <p v-if="props.scope.row.position !== ''">{{props.scope.row.position}}</p>
            </div>
            <!-- 用户ID -->
            <div class="btn-container" v-else-if="props.scope.column.property === 'uid'">
              <span>{{props.scope.row.uid}}</span>
            </div>
            <!-- 所属公司 -->
            <div
              class="btn-container companyName"
              v-else-if="props.scope.column.property === 'companyName'"
            >
              <div v-if="props.scope.row.isRecruiter">
                <span
                  class="toCompany"
                  @click.stop="toCompany(props.scope.row.companyId)"
                >{{props.scope.row[props.scope.column.property]}}</span>
                <p v-if="props.scope.row.isAdmin === 1">管理员</p>
                <p v-else>招聘官</p>
              </div>
            </div>
            <!-- 发布职位权益 -->
            <div
              class="btn-container"
              v-else-if="props.scope.column.property === 'createPositionRight'"
            >
              <div>
                <span v-if="props.scope.row.createPositionRight === 0">否</span>
                <span
                  v-else-if="props.scope.row.createPositionRight === 1 && props.scope.row.companyId"
                >是</span>
                <span v-else>---</span>
              </div>
            </div>
            <!-- 跟进人 -->
            <div
              class="btn-container"
              v-else-if="props.scope.column.property === 'adminName'"
              style="justify-content: flex-start;"
            >
              <span style="text-align: left;">
                <span v-if="props.scope.row.adminUid">{{props.scope.row.adminName}}</span>
                <span v-else class="btn" @click.stop="toEditAdminName(props.scope.row.uid)">添加跟进人</span>
              </span>
            </div>
            <!-- 身份认证状态 -->
            <div class="btn-container" v-else-if="props.scope.column.property === 'identityAuth'">
              <div>
                <span v-if="props.scope.row.identityAuthStatus === 0">待审核</span>
                <span v-else-if="props.scope.row.identityAuthStatus === 1">已通过</span>
                <span v-else-if="props.scope.row.identityAuthStatus === 2">未通过</span>
                <span v-else>未提交</span>
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
                  <i class="el-icon-warning" style="color: #E6A23C;"></i>
                </span>
                <span
                  :class="{'row-delete': props.scope.row.status !== 1}"
                  v-show="props.scope.row[props.scope.column.property] === 0"
                >
                  <span v-if="props.scope.column.property === 'status'">
                    待审核
                    <i class="el-icon-warning" style="color: #E6A23C;"></i>
                  </span>
                  <span v-else>
                    已提交
                    <i class="el-icon-warning" style="color: #E6A23C;"></i>
                  </span>
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
    <!--小程序码展示框-->
    <div class="qrCode" ref="qrCode">
      <img class="bg" src="../../assets/code_bg.png" />
      <div
        style="height: 100%;display: flex; align-items: center;flex-direction: column;justify-content: center;"
        v-if="!qrCode"
      >
        <img style="height: 38px;width: 38px;" src="../../assets/loading.gif" />
        <div class="txt">正在加载中…</div>
      </div>
      <div v-else>
        <img class="Qr" :src="qrCode" />
        <div class="txt">微信扫码，打开小程序查看</div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import List from '@/components/list'
import { getUserListApi } from 'API/recruiter'
import { getRecruiterCodeUrlApi } from 'API/interview'
import { getSalerListApi } from 'API/common'
import { getLabelPositionListApi } from 'API/position'
@Component({
  name: 'userList',
  components: {
    List
  },
  watch: {
    'form.searchType1': {
      handler (newV, oldV) {
        this.form.keyword1 = ''
        this.form[oldV] = ''
      },
      immediate: true
    },
    'form.searchType2': {
      handler (newV, oldV) {
        this.form.keyword2 = ''
        this.form[oldV] = ''
      },
      immediate: true
    }
  }
})
export default class user extends Vue {
  total = 0;
  pageCount = 0;
  qrCode = '';
  salerLis = []; // 跟进人销售名单
  AdminShow = ''; // 权限字段，限制搜索
  options = [] // 职位标签列表
  clearable = true
  positionManage = {
    value: 'labelId',
    label: 'name',
    children: 'children'
  }; // 职位类别的配置

  form = {
    admin_uid: '', // 跟进人
    keyword: '',
    status: '',
    auth_status: '',
    createTimeStart: '',
    createTimeEnd: '',
    role: '99',
    createPositionRight: '99', // 发布职位权益
    idAuth: '99',
    companyName: '',
    mobile: '',
    name: '',
    page: 1,
    count: 20,
    searchType1: 'companyName',
    searchType2: 'userName',
    keyword1: '',
    keyword2: '',
    type: '',
    position: ''
  };
  /* 搜索关键字 */
  keyword = [
    { label: '公司名字', value: 'companyName' },
    { label: '手机号', value: 'mobile' },
    { label: '人名', value: 'userName' },
    { label: '用户ID', value: 'uid' }
  ];
  fields = [
    {
      prop: 'index',
      label: '序号',
      width: 80
    },
    {
      prop: 'name',
      label: '个人信息',
      width: 100
    },
    {
      prop: 'uid',
      label: '用户ID',
      width: 100
    },
    {
      prop: 'companyName',
      label: '所属公司',
      align: 'left',
      width: 300
    },
    {
      prop: 'createPositionRight',
      label: '发布职位权益',
      width: 150
    },
    {
      prop: 'adminName',
      label: '跟进人',
      width: 150
    },
    {
      prop: 'identityAuth',
      label: '身份认证状态',
      width: 220
    },
    {
      prop: 'createdAt',
      label: '创建时间'
    },
    {
      prop: 'id',
      fixed: 'right',
      width: 150,
      label: '操作'
    }
  ];
  list = [];
  changeType1 (e) {
    console.log(e)
  }
  changeType2 (e) {
    console.log(e)
  }
  /* 添加用户 */
  addUser () {
    sessionStorage.setItem('up_router', this.$route.path)
    this.$route.meta.scrollY = window.scrollY
    this.$router.push({ path: '/user/addUser' })
  }
  changeProvince (e) {}
  toCompany (companyId) {
    this.$router.push({ path: `/index/companyInfo?id=${companyId}` })
  }
  onSubmit (e) {
    this.form.page = 1
    this.getRecruiterList()
  }
  // 获取销售人员名单
  async getSalerList () {
    let res = await getSalerListApi({ pageCount: 50 })
    this.salerLis = res.data.data
  }
  // 添加跟进人
  toEditAdminName (uid) {
    this.$route.meta.scrollY = window.scrollY
    this.$router.push({
      path: `/user/userInfo/${uid}`,
      query: { isEditAdminName: true }
    })
  }

  type (e) {
    this.form.type = e[e.length - 1]
  }
  // 搜索地址
  search () {
    this.onSubmit()
  }
  /* 重置筛选 */
  resetForm (name) {
    this.form = {
      admin_uid: '', // 跟进人
      keyword: '',
      status: '',
      auth_status: '',
      createTimeStart: '',
      createTimeEnd: '',
      role: '99',
      createPositionRight: '99', // 发布职位权益
      idAuth: '99',
      companyName: '',
      mobile: '',
      name: '',
      page: 1,
      count: 20,
      searchType1: 'companyName',
      searchType2: 'userName',
      keyword1: '',
      keyword2: '',
      position: ''
    }
    this.$refs[name].resetFields()
    this.getRecruiterList()
    this.$refs.cascader.inputValue = ''
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

  /* 请求招聘官审核列表 */
  getRecruiterList (newForm) {
    this.form[this.form.searchType1] = this.form.keyword1
    this.form[this.form.searchType2] = this.form.keyword2
    let params = {
      page: this.form.page,
      count: this.form.count
    }
    if (this.form.admin_uid) {
      params = Object.assign(params, { admin_uid: this.form.admin_uid })
    }
    if (this.form.keyword) {
      params = Object.assign(params, { keyword: this.form.keyword })
    }
    if (this.form.status) {
      params = Object.assign(params, { status: this.form.status })
    }
    if (this.form.auth_status) {
      params = Object.assign(params, { auth_status: this.form.auth_status })
    }
    if (this.form.role === '99') {
      params = Object.assign(params, { role: '2,3' })
    } else {
      params = Object.assign(params, { role: this.form.role })
    }
    if (this.form.createPositionRight) {
      params = Object.assign(params, { createPositionRight: this.form.createPositionRight })
    }
    if (this.form.idAuth) {
      params = Object.assign(params, { idAuth: this.form.idAuth })
    }
    if (this.form.companyName) {
      params = Object.assign(params, { companyName: this.form.companyName })
    }
    if (this.form.mobile) {
      params = Object.assign(params, { mobile: this.form.mobile })
    }
    if (this.form.name) {
      params = Object.assign(params, { name: this.form.name })
    }
    if (this.form.userName) {
      params = Object.assign(params, { userName: this.form.userName })
    }
    if ((this.form.createTimeStart && !this.form.createTimeEnd) || (!this.form.createTimeStart && this.form.createTimeEnd)) {
      this.$message({ message: '必须选择一个时间区间', type: 'warning' })
    } else {
      if (this.form.createTimeStart && this.form.createTimeEnd) {
        params = Object.assign(params, { createTimeStart: this.form.createTimeStart, createTimeEnd: this.form.createTimeEnd })
      }
    }
    // 已经选择职位类别
    if (this.form.type) {
      params = Object.assign(params, { positionTypeId: this.form.type })
    }
    // 已经选择职位类别
    if (this.form.position) {
      params = Object.assign(params, { position: this.form.position })
    }
    getUserListApi(params).then(res => {
      this.list = res.data.data
      this.total = res.data.meta.total
      this.pageCount = res.data.meta.lastPage
      if (this.form.searchType1 && this.form[this.form.searchType1]) {
        params = Object.assign(params, { searchType1: this.form.searchType1, [this.form.searchType1]: this.form[this.form.searchType1] })
      }
      if (this.form.searchType2 && this.form[this.form.searchType2]) {
        params = Object.assign(params, { searchType2: this.form.searchType2, [this.form.searchType2]: this.form[this.form.searchType2] })
      }
      // this.$router.push({
      //   query: {
      //     ...params
      //   }
      // })
    })
  }
  /* 翻页 */
  handlePageChange (nowPage) {
    this.form.page = nowPage
    this.getRecruiterList()
  }
  /* 查看相应的招聘官审核详情 */
  check (id) {
    this.$route.meta.scrollY = window.scrollY
    this.$router.push({
      path: `/user/recruiterInfo/${id}`,
      query: {
        isEditAdminName: false
      }
    })
  }
  // 将招聘官添加到24h招聘官
  checkRecruitment (id) {
    id = id + ''
    this.$router.push({
      name: '24h_recruiter_add',
      query: {
        recruiter_uid: id
      }
    })
  }
  /* 生成职位详情小程序码 */
  async creatLink (e, data, index) {
    this.qrCode = ''
    if (data.isRecruiter !== 1) {
      this.$refs['qrCode'].style.display = 'none'
      this.$message.error(`该用户不是招聘官,暂无招聘官主页`)
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
  /* 关闭二维码弹窗 */
  // hiddenQr () {
  //  this.$nextTick(() => {
  //    this.$refs['qrCode'].style.display = 'none'
  //  })
  // }
  /* 关闭浮窗 */
  closeTopic () {
    this.$nextTick(() => {
      this.$refs['qrCode'].style.display = 'none'
    })
  }

  created () {
    this.AdminShow = +sessionStorage.getItem('AdminShow')
    this.getSalerList()
    this.form = Object.assign(this.form, this.$route.query)
    this.form.admin_uid = Number(this.form.admin_uid) > 0 ? Number(this.form.admin_uid) : ''
    this.form.keyword1 = this.$route.query.companyName
    if (this.form.role === '2,3') this.form.role = '99'
    this.getRecruiterList()
    this.ManageList()
  }
}
</script>

<style lang="less" scoped>
.recruiter_list {
  /*padding: 22px;*/
  .el-container{
    margin: 0 !important;
  }
  .el-main{
    padding: 0;
  }
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
    padding: 20px;
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
