<!-- 面试申请管理 -->
<template>
  <div class="application" @click="closeTopic">
    <el-container class="container" style="border: 1px solid #eee">
      <el-header class="header" style="text-align: right; font-size: 15px">
        <div class="title">邀请列表管理({{total}})</div>
        <el-button type="primary" @click="download" :disabled="!canDownloadData" v-if="AdminShow == 0 || AdminShow == 2 || AdminShow == 1 || AdminShow == 4 || AdminShow == 5">导出</el-button>
      </el-header>
      <el-main width="200px">
        <!--筛选-->
        <div class="selectionBox" @keyup.enter="onSubmit">
          <el-form ref="form" :model="form" :inline="true">
            <div style="overflow: hidden;">
              <el-form-item>
                <el-input type="text" placeholder="请输入内容" v-model="form.content" class="inputSelect">
                  <el-select
                    class="selectTitle"
                    v-model="form.searchType"
                    slot="prepend"
                    placeholder="请选择"
                    @change="changeProvince"
                  >
                    <el-option label="面试ID" value="id"></el-option>
                    <el-option label="求职者" value="jobhunter"></el-option>
                    <el-option label="面试官" value="recruiter"></el-option>
                    <el-option label="职位" value="position"></el-option>
                    <!--<el-option label="公司名称" value="company"></el-option>-->
                  </el-select>
                </el-input>
              </el-form-item>

              <el-form-item label="公司名称">
                <el-input v-model="form.companyName" placeholder="请输公司名字"></el-input>
              </el-form-item>

              <el-form-item label="状态">
                <el-select
                  class="selectState"
                  v-model="form.status"
                  placeholder="全部状态"
                  @change="changeProvince"
                >
                  <el-option
                    v-for="item in stutusList"
                    :key="item.status"
                    :label="item.desc"
                    :value="item.status"
                  ></el-option>
                </el-select>
                <el-select
                  v-if="showSecond"
                  class="selectState"
                  v-model="form.last_status"
                  placeholder="全部状态"
                >
                  <el-option
                    v-for="item in reasonList"
                    :key="item.status"
                    :label="item.desc"
                    :value="item.status"
                  ></el-option>
                </el-select>
              </el-form-item>
            </div>
            <div style="overflow: hidden;">
              <el-form-item label="确认约面时间">
                <el-date-picker
                  v-model="form.appointmentConfirmTimeStart"
                  :picker-options="pickerOptionsStart"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  type="datetime"
                  placeholder="请选择开始时间">
                </el-date-picker>
                -
                <el-date-picker
                  v-model="form.appointmentConfirmTimeEnd"
                  :picker-options="pickerOptionsEnd"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  type="datetime"
                  placeholder="请选择结束时间">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="职位类别">
                <el-cascader
                  ref="cascader"
                  placeholder="职位类别"
                  :options="options"
                  filterable
                  change-on-select
                  :props="positionManage"
                  @change="type"
                ></el-cascader>
              </el-form-item>
              <el-form-item label="城市">
                <el-select
                  v-model="form.areaId"
                  filterable
                  placeholder="请输入城市名">
                  <el-option
                    v-for="(item, index) in cityLists"
                    :key="index"
                    :label="item.title"
                    :value="item.areaId">
                  </el-option>
                </el-select>
              </el-form-item>
               <el-form-item label="邀约时间">
                <el-date-picker
                  v-model="form.createStartTime"
                  :picker-options="pickerOptionsStart"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  type="datetime"
                  placeholder="请选择开始时间">
                </el-date-picker>
                -
                <el-date-picker
                  v-model="form.createEndTime"
                  :picker-options="pickerOptionsEnd"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  type="datetime"
                  placeholder="请选择结束时间">
                </el-date-picker>
              </el-form-item>
            </div>
            <el-form-item class="btn">
              <el-button type="primary" @click="onSubmit">查询</el-button>
              <el-button @click.stop="resetForm('form')">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
        <!--筛选-->
      </el-main>
      <list
        :fields="fields"
        :list="list"
        :total="total"
        :page="Number(form.page)"
        :page-count="pageCount"
        :rowspan="3"
        @page-change="handlePageChange"
      >
        <template slot-scope="props" slot="columns">
          <!-- 求职者信息 -->
          <div class="jobhunter" v-if="props.scope.column.property === 'jobhunterInfo'">
            <div class="name">
              <span
                @click.stop="showResume(props.scope.row)"
              >{{props.scope.row.jobhunterInfo.realname}}</span>
              <span
                style="display: inline-block;max-width: 200px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;color: #282828;font-weight: normal;"
                v-if="props.scope.row.jobhunterInfo.lastPosition"
              >· {{props.scope.row.jobhunterInfo.lastPosition}}</span>
            </div>
            <div
              class="info"
              v-if="props.scope.row.jobhunterInfo.lastCompanyName || props.scope.row.jobhunterInfo.lastPosition"
            >
              <span>{{props.scope.row.jobhunterInfo.lastCompanyName}}</span>
            </div>
            <div class="btn">
              <span
                @click.stop="creatLink($event, props.scope.row.jobhunterInfo.uid, props.scope.$index, 2)"
              >扫码看简历</span>
              <span
                @click.stop="showPhone($event, props.scope.row.jobhunterInfo.mobile)"
                v-if="AdminShow!==3&&AdminShow!==4"
              >联系用户</span>
            </div>
          </div>
          <!-- 状态 -->
          <div class="jobhunter" v-else-if="props.scope.column.property === 'statusDesc'">
            <div class="name arrow" v-if="props.scope.row.status !== 51">
              <i
                class="icon iconfont iconjiantouzuo"
                v-if="props.scope.row.status === 12 || props.scope.row.status === 31 || props.scope.row.status === 52"
              ></i>
              <i class="icon iconfont iconjiantou" v-else></i>
            </div>
            <div class="info status">{{props.scope.row.statusDesc}}</div>
            <span
              class="disContents"
              v-if="props.scope.row.status===52"
              @click.stop="sayResult(props.scope.row.interviewId)"
            >原因</span>
            <div class="btn time">{{props.scope.row.updatedAtTime * 1000 | date}}</div>
          </div>
          <!-- 面试官信息 -->
          <div class="jobhunter" v-else-if="props.scope.column.property === 'recruiterInfo'">
            <div class="name">
              <span
                style="font-weight: bold;display: inline-block; max-width: 120px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;"
              >{{props.scope.row.recruiterInfo.realname}}</span>
              <span
                style="display: inline-block; max-width: 200px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;color:#282828; font-weight: normal;"
              >· {{props.scope.row.recruiterInfo.position}}</span>
            </div>
            <div class="info" v-if="props.scope.row.recruiterInfo.companyName">
              <span>{{props.scope.row.recruiterInfo.companyName}}</span>
            </div>
            <div class="btn">
              <span
                @click.stop="creatLink($event, props.scope.row.recruiterInfo.uid, props.scope.$index, 1)"
              >扫码看主页</span>
              <span
                @click.stop="showPhone($event, props.scope.row.recruiterInfo.mobile)"
                v-if="AdminShow!==3&&AdminShow!==4"
              >联系用户</span>
            </div>
          </div>
          <!-- 约面信息 -->
          <div class="jobhunter" v-else-if="props.scope.column.property === 'interviewInfo'">
            <div class="name" v-if="props.scope.row.positionName">
              职位：
              <span
                class="btn positionName"
                @click.stop="toPath(props.scope.row.positionId)"
              >{{props.scope.row.positionName}}</span>
              <span
                style="display: inline-block;color:#282828;font-weight: normal;"
              >{{props.scope.row.emolument}}</span>
              <span
                class="btn positionName"
                @click.stop="creatLink($event, props.scope.row.positionId, props.scope.$index, 3)"
              >扫码看职位</span>
            </div>
            <div class="name" v-else>
              <span>职位：直接约面</span>
            </div>
            <div
              class="info"
              v-if="props.scope.row.sourceType === 1"
              @mousemove="showAddress($event, props.scope.row.address)"
              @mouseout="debounce(100)"
            >
              <span>地址：{{props.scope.row.address || '未设置面试地址'}}</span>
            </div>
            <div>面试形式：{{props.scope.row.sourceTypeDesc}}</div>
            <div
              class="btn"
              v-if="props.scope.row.arrangementInfo && props.scope.row.arrangementInfo.appointmentTime"
            >面试时间：{{props.scope.row.arrangementInfo.appointmentTime *1000 | date}}</div>
          </div>
          <div class="jobhunter" v-else-if="props.scope.column.property === 'adminInfo'">
            {{props.scope.row.adminInfo.realname || ''}}
          </div>
          <template v-else>
            <span
              :class="{'row-delete': props.scope.row.status !== 1}"
            >{{props.scope.row[props.scope.column.property]}}</span>
          </template>
        </template>
      </list>
    </el-container>
    <!--电话号码展示框-->
    <div class="phone" ref="mobile">
      <span>{{mobile}}</span>

      <img class="phoneBg" src="../../../assets/number_bg.png" />
    </div>
    <!--小程序码展示框-->
    <div class="qrCode" ref="qrCode">
      <img class="bg" src="../../../assets/code_bg.png" />
      <div
        style="height: 100%;display: flex; align-items: center;flex-direction: column;justify-content: center;"
        v-if="!qrCode"
      >
        <img style="height: 38px;width: 38px;" src="../../../assets/loading.gif" />
        <div class="txt">正在加载中…</div>
      </div>
      <div v-else>
        <img class="Qr" :src="qrCode" />
        <div class="txt">微信扫码，打开小程序查看</div>
      </div>
    </div>
    <!--地址弹窗-->
    <div class="addressBox" ref="address">{{address}}</div>
    <el-dialog title="不合适原因" :visible.sync="centerDialogVisible" width="30%" center>
      <span>{{reason}}</span>
    </el-dialog>
    <resume-popup :resumeId="resumeId" :isShow="isShow" @showCallback="showCallback" ref="resume"></resume-popup>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import {
  getInviteListApi,
  getRecruiterCodeUrlApi,
  getResumeCodeUrlApi,
  getPositionCodeUrlApi,
  getInterviewComment,
  getInviteInterviewStatusType,
  getNotSuitTypeList
} from 'API/interview'
import List from '@/components/list'
import resumePopup from 'COMPONENTS/resumePopup/resumePopup.vue'
import { getLabelPositionListApi } from 'API/position'
import { getAddressListsApi } from 'API/company'
import { getAccessToken } from 'API/cacheService'
import { API_ROOT } from 'API/index.js'
@Component({
  name: 'invite',
  components: {
    List,
    resumePopup
  },
  watch: {
    'form.areaId': {
      handler (areaId) {
        if (areaId) {
          let item = this.cityLists.find(field => field.areaId === areaId)
          if (!item) return
          this.form.areaId = item.areaId
          this.form.areaName = item.title
        }
      },
      immediate: true
    }
  }
})
export default class invite extends Vue {
  canDownloadData = true
  timeout = null; // 防抖
  total = 0;
  resumeId = ''; // 当前简历id
  isShow = false;
  centerDialogVisible = false; /* 控制不合适原因 */
  fields = [
    {
      prop: 'interviewId',
      label: '面试ID',
      minWidth: '8%'
      //    width: 100
    },
    {
      prop: 'jobhunterInfo',
      label: '求职者信息',
      minWidth: '25%',
      //    width: 300,
      align: 'left'
    },
    {
      prop: 'statusDesc',
      label: '状态',
      minWidth: '20%'
      //    width: 200
    },
    {
      prop: 'recruiterInfo',
      label: '面试官信息',
      minWidth: '25%',
      //    width: 300,
      align: 'left'
    },
    {
      prop: 'adminInfo',
      label: '跟进销售',
      minWidth: '25%',
      //    width: 300,
      align: 'left'
    },
    {
      prop: 'interviewInfo',
      label: '约面信息',
      minWidth: '31%',
      //    width: 500,
      align: 'left'
    }
  ];
  form = {
    searchType: 'id',
    content: '',
    status: '',
    last_status: '',
    companyName: '',
    page: 1,
    count: 20,
    appointmentConfirmTimeStart: undefined,
    appointmentConfirmTimeEnd: undefined,
    createEndTime: undefined,
    createStartTime: undefined,
    positionLabel: '',
    areaName: '',
    areaId: ''
  };
  loading = false
  reason = '';
  list = [];
  pageCount = 0; // 请求回的数据共几页
  mobile = ''; // 当前查看的手机号码
  qrCode = '';
  address = ''; // 当前弹窗地址
  AdminShow = '';
  stutusList = [];
  showSecond = false;
  reasonList = [];
  options = [];
  positionManage = {
    value: 'labelId',
    label: 'name',
    children: 'children'
  }; // 职位类别的配置
  cityLists = [];
  getAddressLists () {
    return getAddressListsApi({ level: 3 }).then(res => (this.cityLists = res.data.data))
  }
  get pickerOptionsStart () {
    let _this = this
    return {
      disabledDate (time) {
        let endDateVal = _this.form.appointmentConfirmTimeEnd
        if (endDateVal) {
          return Date.parse(time) > Date.parse(new Date(endDateVal))
        }
      }
    }
  }
  get pickerOptionsEnd () {
    let _this = this
    return {
      disabledDate (time) {
        let beginDateVal = _this.form.appointmentConfirmTimeStart
        if (beginDateVal) {
          return Date.parse(time) < Date.parse(new Date(beginDateVal))
        }
      }
    }
  }
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
  type (e) {
    this.form.positionLabel = e[e.length - 1]
  }
  remoteMethod (query) {
    this.loading = true
  }
  created () {
    this.AdminShow = +sessionStorage.getItem('AdminShow')
    this.init()
    this.getInviteInterviewStatusType()
    this.ManageList()
    this.getAddressLists()
  }
  getInviteInterviewStatusType () {
    getInviteInterviewStatusType().then(res => {
      this.stutusList = res.data.data
    })
  }
  showCallback (val) {
    this.isShow = false
  }
  toPath (id) {
    window.open(`/manage/positionManage/positionAuditDetail?id=${id}`, '_blank')
  }
  /* 说出不合适原因 */
  sayResult (interviewId) {
    getInterviewComment(interviewId).then(res => {
      this.reason = res.data.data.reason
      this.centerDialogVisible = true
    })
  }
  init () {
    let query = this.$route.query
    let form = Object.assign(this.form, query)
    this.form = form
    this.form.areaId = Number(this.form.areaId)
    this.form = Object.assign(this.form, this.$route.query)
    if (!this.form.areaId) this.form.areaId = ''
    this.getInterviewList()
  }

  /* 获取列表数据 */
  getInterviewList () {
    // 默认搜索条件
    let params = {
      page: this.form.page,
      count: this.form.count
    }
    // 已经有下拉筛选
    if (this.form.searchType && this.form.content) {
      params = Object.assign(params, { searchType: this.form.searchType, content: this.form.content })
    }
    // 已经存在公司名筛选
    if (this.form.companyName && this.form.companyName.trim()) {
      params = Object.assign(params, { companyName: this.form.companyName })
    }
    // 已经选择一级状态
    if (this.form.status) {
      params = Object.assign(params, { status: this.form.status })
    }
    // 已经选择二级状态
    if (this.form.last_status) {
      params = Object.assign(params, { last_status: this.form.last_status })
    }
    // 已经选择职位类型
    if (this.form.positionLabel) {
      params = Object.assign(params, { positionLabel: this.form.positionLabel })
    }
    // 已经选择时间
    if ((this.form.appointmentConfirmTimeStart && !this.form.appointmentConfirmTimeEnd) || (!this.form.appointmentConfirmTimeStart && this.form.appointmentConfirmTimeEnd)) {
      this.$message({ message: '确认面试时间必需选择区间时间', type: 'warning' })
      return
    } else {
      if (this.form.appointmentConfirmTimeStart && this.form.appointmentConfirmTimeEnd) {
        params = Object.assign(params, { appointmentConfirmTimeStart: this.form.appointmentConfirmTimeStart, appointmentConfirmTimeEnd: this.form.appointmentConfirmTimeEnd })
      }
    }
    // 邀约时间
    if ((this.form.createStartTime && !this.form.createEndTime) || (!this.form.createStartTime && this.form.createEndTime)) {
      this.$message({ message: '邀约时间必需选择区间时间', type: 'warning' })
      return
    } else {
      if (this.form.createStartTime && this.form.createEndTime) {
        params = Object.assign(params, { createStartTime: this.form.createStartTime, createEndTime: this.form.createEndTime })
      }
    }
    // 已经选择城市
    if (this.form.areaId) {
      params = Object.assign(params, { areaId: this.form.areaId })
    }
    getInviteListApi(params).then(res => {
      this.list = res.data.data
      this.total = res.data.meta.total
      this.pageCount = res.data.meta.lastPage
      this.$router.push({
        query: {
          ...params
        }
      })
    })
  }

  /* 展示手机 */
  showPhone (e, mobile) {
    if (this.timeout !== null) clearTimeout(this.timeout)
    this.mobile = mobile || '用户未绑定手机'
    this.$nextTick(() => {
      this.$refs['mobile'].style.display = 'block'
      this.$refs['mobile'].style.left = e.clientX + 'px'
      this.$refs['mobile'].style.top = e.clientY + window.scrollY + 'px'
    })
  }
  showResume (row) {
    if (this.AdminShow === 3 || this.AdminShow === 4) {
      this.$message({
        message: '用户暂无权限'
      })
    } else {
      this.resumeId = String(row.jobhunterInfo.uid)
      this.isShow = true
      this.$nextTick(() => {
        let AdminShow = +sessionStorage.getItem('AdminShow')
        this.$refs['resume'].testingAdmin(AdminShow)
        this.$refs['resume'].getResume()
        this.$refs['resume'].showMark()
        this.$refs['resume'].initResume()
        this.$refs['resume'].operating(this.resumeId, {
          action: '查看',
          desc: '简历'
        })
      })
    }
  }
  /* 展示地址 */
  showAddress (e, address) {
    if (this.timeout !== null) clearTimeout(this.timeout)
    this.address = address
    this.$nextTick(() => {
      this.$refs['address'].style.display = 'block'
      this.$refs['address'].style.left = e.clientX + 'px'
      this.$refs['address'].style.top = e.clientY + 20 + window.scrollY + 'px'
    })
  }
  hideAdress () {
    this.address = ''
    this.$nextTick(() => {
      this.$refs['address'].style.display = 'none'
    })
  }

  /* 生成小程序码 */
  async creatLink (e, uid, index, type) {
    this.qrCode = ''
    // 是否已经加载过二维码
    if (this.list[index].qrCode && type === 1) {
      this.qrCode = this.list[index].qrCode
      this.$nextTick(() => {
        this.$refs['qrCode'].style.display = 'block'
        this.$refs['qrCode'].style.left = e.clientX + 'px'
        this.$refs['qrCode'].style.top = e.clientY + window.scrollY + 'px'
      })
      return
    } else if (this.list[index].resumeQrCode && type === 2) {
      this.qrCode = this.list[index].resumeQrCode
      this.$nextTick(() => {
        this.$refs['qrCode'].style.display = 'block'
        this.$refs['qrCode'].style.left = e.clientX + 'px'
        this.$refs['qrCode'].style.top = e.clientY + window.scrollY + 'px'
      })
      return
    } else if (this.list[index].jobQrCode && type === 3) {
      this.qrCode = this.list[index].jobQrCode
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
    let res = await this.getQr(type, uid)
    if (type === 1) {
      this.qrCode = res.data.data.qrCodeUrl
      this.list[index].qrCode = res.data.data.qrCodeUrl
    } else if (type === 2) {
      this.qrCode = res.data.data.qrCodeUrl
      this.list[index].resumeQrCode = res.data.data.qrCodeUrl
    } else {
      this.qrCode = res.data.data.qrCodeUrl
      this.list[index].jobQrCode = res.data.data.qrCodeUrl
    }
  }

  /* 生成二维码 */
  getQr (type, uid) {
    switch (type) {
      case 1:
        return getRecruiterCodeUrlApi({ id: uid })
      case 2:
        return getResumeCodeUrlApi({ id: uid })
      case 3:
        if (uid === 0) return
        return getPositionCodeUrlApi({ id: uid })
    }
  }

  hiddenQr () {
    this.$nextTick(() => {
      this.$refs['qrCode'].style.display = 'none'
    })
  }

  hiddenPhone () {
    this.$nextTick(() => {
      this.$refs['mobile'].style.display = 'none'
    })
  }
  /* 关闭浮窗 */
  closeTopic () {
    this.$nextTick(() => {
      this.qrCode = ''
      this.$refs['mobile'].style.display = 'none'
      this.$refs['qrCode'].style.display = 'none'
    })
  }

  /* 查询 */
  onSubmit () {
    this.form.page = 1
    this.getInterviewList()
  }
  /* 选择变更 */
  changeProvince (e) {
    if (e === 52) {
      this.getNotSuitTypeList()
      this.showSecond = true
    } else {
      this.showSecond = false
    }
  }
  getNotSuitTypeList () {
    getNotSuitTypeList().then(res => {
      this.reasonList = res.data.data
    })
  }

  /* 清除列表选项 */
  resetForm (name) {
    this.$refs[name].resetFields()
    this.form = {
      searchType: 'id',
      content: '',
      status: '',
      last_status: '',
      companyName: '',
      page: 1,
      count: 20,
      appointmentConfirmTimeStart: undefined,
      appointmentConfirmTimeEnd: undefined,
      sappointmentConfirmTimeStart: undefined,
      sappointmentConfirmTimeEnd: undefined,
      positionLabel: '',
      cityName: '',
      areaId: ''
    }
    this.$refs.cascader.inputValue = ''
    this.getInterviewList()
  }

  /* 翻页 */
  handlePageChange (nowPage) {
    this.$route.meta.scrollY = 0
    window.scrollTo(0, 0)
    this.form.page = nowPage
    this.getInterviewList()
  }
  /* 防抖 */
  debounce (wait) {
    let that = this
    if (this.timeout !== null) clearTimeout(that.timeout)
    this.timeout = setTimeout(that.hideAdress, wait)
  }
  download () {
    this.$confirm('是否导出该列表数据？', '提示', {
      confirmButtonText: '是',
      cancelButtonText: '否',
      type: 'warning'
    }).then(() => {
      let date = new Date()
      let downloadName = `邀约列表-${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}.xlsx`
      let url = `${API_ROOT}/interview/invite?isExport=1`
      // 已经有下拉筛选
      if (this.form.searchType && this.form.content) {
        url += `&searchType=${this.form.searchType}&content=${this.form.content}`
      }
      // 已经存在公司名筛选
      if (this.form.companyName && this.form.companyName.trim()) {
        url += `&companyName=${this.form.companyName}`
      }
      // 已经选择一级状态
      if (this.form.status) {
        url += `&status=${this.form.status}`
      }
      // 已经选择二级状态
      if (this.form.last_status) {
        url += `&last_status=${this.form.last_status}`
      }
      // 已经选择职位类型
      if (this.form.positionLabel) {
        url += `&positionLabel=${this.form.positionLabel}`
      }
      // 已经选择时间
      if (this.form.appointmentConfirmTimeStart && this.form.appointmentConfirmTimeEnd) {
        url += `&appointmentConfirmTimeStart=${this.form.appointmentConfirmTimeStart}&appointmentConfirmTimeEnd=${this.form.appointmentConfirmTimeEnd}`
      }
      if (this.form.createStartTime && this.form.createEndTime) {
        url += `&createStartTime=${this.form.createStartTime}&createEndTime=${this.form.createEndTime}`
      }
      // 已经选择城市
      if (this.form.areaId) {
        url += `&areaId=${this.form.areaId}`
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
@import "./index.less";
.application {
  text-align: unset;
  .container {
    min-width: 1000px;
    margin: 22px;
  }
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
      font-size: 14px;
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
  /* 按钮 */
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
  .selectState {
    float: left;
  }
  .jobhunter {
    position: relative;
    .name,
    .info,
    .btn {
      color: #282828;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      text-align: left;
    }
    .arrow,
    .status,
    .time {
      text-align: start;
      justify-content: flex-start;
    }
    .status {
      font-weight: 500;
      color: #282828;
    }
    .time {
      color: #929292;
      font-weight: 400;
      font-size: 14px;
    }
    .name {
      height: 22px;
      display: flex;
      .btn {
        white-space: nowrap;
        user-select: none;
        cursor: pointer;
        color: #652791;
      }
      .positionName {
        display: inline-block;
        max-width: 200px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
      &.arrow {
        color: #bcbcbc;
      }
    }
    span {
      margin-right: 10px;
    }
    .btn {
      float: none;
      position: relative;
      font-size: 15px;
    }
    .mobile {
      display: inline-block;
      background-color: #ffffff;
      color: #652791;
      position: absolute;
      top: 0;
      left: 0;
    }
  }
  .phone,
  .qrCode {
    text-align: center;
    width: 150px;
    height: 75px;
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
  /* 地址弹窗  */
  .addressBox {
    text-align: left;
    position: absolute;
    padding: 6px 8px;
    line-height: 20px;
    max-width: 300px;
    transform: translateX(-50%);
    top: 0;
    left: 0;
    color: #354048;
    background-color: #f8f8f8;
    box-shadow: 0px 6px 8px 0px rgba(0, 0, 0, 0.24);
    border: 1px solid rgba(237, 237, 237, 1);
    z-index: 999;
  }
}
</style>
