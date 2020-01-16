<!--  -->
<template>
  <div class="invitPro" @click.stop="closeTopic">
    <lyout-content
      :leftcontent="leftcontent"
      ref="methods"
      @handlePageChange="handlePageChange"
      @handertableHeight="handertableHeight"
    >
      <div class="formSumbit" slot="formContent">
        <div class="formReasult">
          <el-form ref="form" :inline="true" :model="form" class="form">
            <!-- 简历类型筛选条件 -->
            <!-- <el-form-item label-width="77px" label="简历类型" prop="resumeType">
              <el-select v-model="form.resumeType" placeholder="全部类型">
                <el-option :label="item.name" :value="item.id" v-for="item in resumetypeList" :key="item.id"></el-option>
              </el-select>
            </el-form-item> -->
             <!-- 其他一些筛选条件 -->
            <div class="searchTab">
              <el-input type="text" placeholder="请输入" v-model="form.commonKey1" class="inputSelect">
                <el-select
                  size="medium"
                  class="selectTitle"
                  v-model="searchType.key1"
                  slot="prepend"
                  placeholder="公司名"
                >
                  <el-option label="公司名" value="company"></el-option>
                  <el-option label="职位名" value="position"></el-option>
                  <el-option label="求职者" value="jobhunter"></el-option>
                  <el-option label="面试官" value="recruiter"></el-option>
                  <el-option label="简历编号" value="resumeId"></el-option>
                  <!-- <el-option label="简历ID" value="interviewId"></el-option> -->
                </el-select>
              </el-input>
            </div>

            <el-form-item label="处理状态" prop="dealStatusId" class="formItem">
              <el-select
                class="select"
                v-model="form.dealStatusId"
                placeholder="请选择"
                @change="choiceStatus"
              >
                <el-option
                  v-for="(item,index) in dealStatusList"
                  :key="index"
                  :label="item.value"
                  :value="item.id"
                  @change="choiceStatus"
                ></el-option>
              </el-select>
              <el-select
                class="select"
                v-model="form.interviewNotSuitTypeId"
                placeholder="请选择"
                style="margin-left:20px;"
                v-if="showSecond"
              >
                <el-option
                  v-for="(item,index) in reason"
                  :key="index"
                  :label="item.value"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="time" label="面试日期" prop="startTime" label-width="100px">
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
            <el-form-item label-width="77px" label="跟进顾问" prop="followAdvisorUid">
              <el-select v-model="form.followAdvisorUid" placeholder="全部状态">
                <el-option :label="item.realname" :value="item.id" v-for="item in advisorUserList" :key="item.id"></el-option>
              </el-select>
            </el-form-item>
            <!-- 是否口点筛选条件 -->
            <el-form-item label-width="77px" label="是否扣点" prop="chargeStatus">
              <el-select v-model="form.chargeStatus" placeholder="全部">
                <el-option :label="item.realname" :value="item.id" v-for="item in pointsList" :key="item.id"></el-option>
              </el-select>
            </el-form-item>
            <!-- 约面形式筛选条件 -->
            <el-form-item label-width="77px" label="发起方" prop="applyType">
              <el-select v-model="form.applyType" placeholder="全部">
                <el-option :label="item.name" :value="item.id" v-for="item in applyTypeList" :key="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div class="BtnList">
            <el-button type="primary" @click.stop="getData(1)">查询</el-button>
            <el-button @click.stop="resetForm('form')">重置</el-button>
          </div>
        </div>
      </div>
      <div class="List" ref="List" id="scroll" slot="dataList">
        <div class="form">
          <el-table
            border
            :max-height="tableHeight"
            highlight-current-row
            :data="tableData"
            style="width: 100%"
          >
            <el-table-column type="index" width="50" label="序号"> </el-table-column>
            <el-table-column prop="jobhunter.resumeNum" label="简历ID" width="140">
              <template slot-scope="scope">
                <p v-if="scope.row.isJobhunterApply" class="Self-operation inquire">求职者已自行约面</p>
                <p style="color:#000;font-size:14px;">{{scope.row.jobhunter.resumeNum}}</p>
              </template>
            </el-table-column>
            <el-table-column prop="jobhunter" label="候选人信息" width="270">
              <template slot-scope="scope">
                <div class="col_position">
                  <span>{{scope.row.jobhunter.name}}</span>
                  <span>{{scope.row.jobhunter.lastPosition}}</span>
                </div>
                <p class="companyName">{{scope.row.jobhunter.lastCompany}}</p>
                <div class="operation">
                  <span
                    @click.stop="creatLink($event, scope.row.jobhunter.uid,scope.$index, 2)"
                  >扫码看简历</span>
                  <span @click.stop="showPhone($event, scope.row.jobhunter.mobile)">联系用户</span>
                  <!--求职者电话号码展示框-->
                  <div class="phone" v-if="scope.row.jobhunter.isShowMobile">
                    <p v-if="scope.row.jobhunter.mobile">{{scope.row.jobhunter.mobile}}</p>
                    <p v-else>暂无</p>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="province" label="处理状态" width="200">
              <template slot-scope="scope">
                <div v-if="scope.row.statusDesc">
                  <div class="col_position">
                    <i class="icon iconfont iconjiantouzuo" v-if="scope.row.status === 501 || scope.row.status === 305 || scope.row.status === 301 || scope.row.status === 315"></i>
                    <i
                      class="icon iconfont iconjiantou"
                      v-else
                    ></i>
                    <div class="valethandler" v-if="scope.row.status === 305" @click.stop="watchreson(scope.row)">原因</div>
                    <div class="valethandler" v-if="scope.row.status === 501 || scope.row.status === 101" @click="todoAction(scope.row)">代客操作</div>
                  </div>
                  <p class="companyName">
                    <span
                    style="color: #000;"
                      v-if="scope.row.statusDesc"
                    >{{scope.row.statusDesc}}</span>
                  </p>
                  <p v-if="scope.row.updatedAt">{{scope.row.updatedAt}}</p>
                </div>
                <div v-else>
                  <p>----------</p>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="city" label="面试官信息" width="300">
              <template slot-scope="scope">
                <div class="col_position">
                  <span>{{scope.row.recrutier.name}}</span>
                  <span>{{scope.row.recrutier.position}}</span>
                </div>
                <p class="companyName">{{scope.row.recrutier.companyName}}</p>
                <div class="operation">
                  <span
                    @click.stop="creatLink($event, scope.row.jobhunter.uid,scope.$index,1)"
                  >扫码看主页</span>
                  <span @click.stop="showPhone($event, scope.row.recrutier.mobile)">联系用户</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="address" label="约聊信息" width="300">
              <template slot-scope="scope">
                <div v-if="scope.row.positionInfo">
                  <p>职位：{{scope.row.positionInfo.positionName}} {{scope.row.positionInfo.emolumentMin}}k-{{scope.row.positionInfo.emolumentMax}}k</p>
                </div>
                <div v-else>
                  <p>------------------------</p>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="followAdvisor" label="跟进顾问" width="80"></el-table-column>
            <el-table-column prop="chargeStatusDesc" label="是否扣点" width="100"></el-table-column>
            <el-table-column fixed="right" label="操作" width="100">
              <!-- slot-scope="scope" -->
              <template slot-scope="scope">
                <!-- 如果不是系统自动，则显示操作列表 -->
                <div v-if="scope.row.interview">
                  <div v-if="!scope.row.interview.isAutomatic">
                    <p
                      @click.stop="handleClick(true,'扣点',scope.row.id,1)"
                      type="text"
                      size="medium"
                      v-if="scope.row.chargeStatus===1"
                      class="opeatingBtn"
                    >扣点</p>
                    <p
                      @click.stop="handleClick(true,'返点',scope.row.id,2)"
                      type="text"
                      size="small"
                      v-if="scope.row.chargeStatus===1"
                      class="opeatingBtn"
                    >返点</p>
                    <p
                      class="resultBtn"
                      @click.stop="handleClick(false,'返点原因',scope.row.id,3)"
                      v-if="scope.row.chargeStatus===3"
                    >返点原因</p>
                    <p
                      class="resultBtn"
                      @click.stop="handleClick(false,'扣点原因',scope.row.id,4)"
                      v-if="scope.row.chargeStatus===2"
                    >扣点原因</p>
                  </div>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </lyout-content>
    <!--电话号码展示框-->
    <div class="phone" ref="mobile">
      <span>{{mobile}}</span>
      <img class="phoneBg" src="../../../../assets/number_bg.png" />
    </div>
    <div class="qrCode" ref="qrCode">
      <img class="bg" src="../../../../assets/code_bg.png" />
      <div
        style="height: 100%;display: flex; align-items: center;flex-direction: column;justify-content: center;"
        v-if="!qrCode"
      >
        <img style="height: 38px;width: 38px;" src="../../../../assets/loading.gif" />
        <div class="txt">正在加载中…</div>
      </div>
      <div v-else>
        <img class="Qr" :src="qrCode" />
        <div class="txt">微信扫码，打开小程序查看</div>
      </div>
    </div>
    <el-dialog :title="dialogTitle" :visible.sync="centerDialogVisible" width="30%" center>
      <div class="editRusult" v-if="iseditResult">
        <el-input
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 4}"
          placeholder="请输入原因"
          v-model="RusultForm.note"
        ></el-input>
      </div>
      <div class="resultDetail" v-if="!iseditResult">
        <div class="iconItem" v-if="iconList.length>0">
          <span v-for="item in iconList" :key="item" class="itemIcon">{{item}}</span>
        </div>
        <span v-if="result">{{result}}</span>
      </div>
      <span slot="footer" class="dialog-footer" v-if="iseditResult">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="checkNote">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 代客操作 -->
    <el-dialog
      title="约聊信息"
      :visible.sync="InterviewVisible"
      width="30%">
      <div class="position"><i class="el-icon-tickets"></i><span>{{interviewinfo.name}}</span></div>
      <div class="position"><i class="el-icon-suitcase"></i><span>{{interviewinfo.positionName}}  {{interviewinfo.emolumentMin}}k-{{interviewinfo.emolumentMax}}k</span></div>
      <div class="cpname"><i class="el-icon-office-building"></i><span>{{interviewinfo.companyName}}</span></div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="noacceptInterview">{{btntext}}</el-button>
        <el-button type="primary" @click="acceptInterview">聊一聊</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="请选择原因"
      :visible.sync="resonVisible"
      width="30%">
      <div class="resoncontent clearfix">
        <span :class="[item.cur ? 'active' : '']" @click="selectreson(item)" :key="i" v-for="(item, i) in resonlist">{{item.title}}</span> 
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resonVisible = false">取消</el-button>
        <el-button type="primary" @click="confirereson">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="不合适原因"
      :visible.sync="seeresonVisible"
      width="30%">
      <div class="resoncontent clearfix">
        <span class="active" :key="i" v-for="(item, i) in seeresonlist">{{item}}</span> 
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="seeresonVisible = false">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import lyoutContent from 'COMPONENTS/LayoutWrapper/content.vue'
import { getAdvisorUserListApi } from 'API/common'
import {
  getListApi,
  openPositionApi,
  createPositionAddressApi,
  editPositionAddressApi,
  getPositionAddressApi
} from 'API/position'
import {
  interviewRetractApi,
  confirmvaletInterview,
  mvaletnoConsider,
  confirmArrangementInfo,
  editScheduletime,
  darenotinterestApi,
  inappropriateApi,
  jobhunteracceptchatApi,
  recruiteracceptchatApi,
  chatresonlist,
  getInterviewCommentReasonApi,
  getInterviewNotSuitReasonApi,
  refuseJobhunterUidInterviewApi,
  setInterviewInfoApi,
  getSimplepageAddressesListsApi,
  setUserInterviewAttendApi,
  setUserInterviewCommentApi,
  getResumeCodeUrlApi,
  getRecruiterCodeUrlApi,
  getPositionCodeUrlApi,
  getInterviewComment
} from 'API/interview'
import {
  chatsearchList,
  chatlistPay,
  chatlistrefund,
  chatlistStatus
} from 'API/resumeStore'
@Component({
  name: 'invitPro',
  prop: '',
  components: {
    lyoutContent
  }
})
export default class invitPro extends Vue {
  InterviewVisible = false
  resonVisible = false
  seeresonVisible = false
  seeresonlist = []
  resonlist = []
  tableHeight = 0;
  showSecond = false; /* 当选择不合适才出现第二级 */
  form = {
    commonKey1: '',
    dealStatusId: '',
    interviewNotSuitTypeId: '',
    startTime: '',
    endTime: '',
    isJobhunterApply: '',
    page: 1,
    count: 20,
    followAdvisorUid: '',
    chargeStatus: '',
    applyType: '',
    resumeType: '',
    address: {
      mobile: '',
      title: '',
      areaName: '',
      address: '',
      doorplate: '',
      lng: '',
      lat: ''
    }
  };
  page = 1;
  mobile = '';
  searchType = {
    key1: 'company',
    condition2: ''
  };
  appointmentId = ''
  interviewTime = ''
  interviewTimenum = ''
  interviewinfo = {
    name: '',
    positionName: '',
    emolumentMin: '',
    emolumentMax: '',
    companyName: ''
  }
  btntext = '不感兴趣'
  addressLists = []
  reasonList = []
  positionLists = []
  address = {
    mobile: '',
    title: '',
    areaName: '',
    address: '',
    doorplate: '',
    lng: '',
    lat: ''
  }
  model = {
    qrCode: '',
    resumeId: '',
    showResume: false,
    show: false,
    type: '',
    beforeType: '',
    title: '',
    beforeTitle: '',
    btnTxt: '取消',
    reason: [],
    extra: '',
    dateLists: [],
    interviewId: '',
    showConfirmBtn: true,
    showMap: false,
    position: {
      positionName: '',
      positionId: ''
    },
    address: {
      addressName: '',
      addressId: ''
    },
    item: {}
  }
  arrangementlist = []
  reason = []; /* 理由 */
  dealStatusList = []; /* 理由 */
  lastPage = 0;
  result = '';
  RusultForm = {
    recommendId: '',
    note: '',
    type: '' /* 1是扣点，2是返点 */
  };
  iconList = []; /* 不感兴趣标签栏 */
  centerDialogVisible = false; // 原因弹框
  qrCode = ''; // 二维码
  tableData = []; // 数据
  dialogTitle = ''; // 弹窗标题
  iseditResult = false; // 是否编辑

  leftcontent = {
    total: 0,
    title: '约聊列表',
    lastPage: '',
    page: 1
  };
  tableHeight = 700;
  resumetypeList = [{ id: 0, name: '全部类型' }, { id: 1, name: '普通简历' }, { id: 2, name: '热门推荐简历' }]
  applyTypeList = [{ id: 0, name: '全部' }, { id: 1, name: '候选人' }, { id: 2, name: '面试官' }]
  pointsList = [{ realname: '全部', id: 99 }, { realname: '未扣点', id: 0 }, { realname: '预扣点', id: 1 }, { realname: '已扣点', id: 2 }, { realname: '已返点', id: 3 }]
  advisorUserList = []
  /**
   * @Author   小书包
   * @DateTime 2019-07-19
   * @detail   顾问推荐 - 顾问列表
   * @return   {[type]}   [description]
   */
  getAdvisorUserList () {
    getAdvisorUserListApi().then(res => (this.advisorUserList = res.data.data))
  }
  handlePageChange (nowPage) {
    // console.log(nowPage);
    this.$refs['methods'].scrollZero()
    this.form.page = nowPage
    this.getData(this.form.page)
  }
  /* 选择二级状态 */
  choiceStatus (e) {
    e === 1052 ? (this.showSecond = true) : (this.showSecond = false)
  }
  /* 清除列表选项 */
  resetForm (name) {
    this.form.commonKey1 = ''
    this.form.dealStatusId = ''
    this.form.applyType = ''
    this.form.resumeType = ''
    this.form.interviewNotSuitTypeId = ''
    this.form.startTime = ''
    this.form.endTime = ''
    this.form.isJobhunterApply = false
    this.$refs[name].resetFields()
    this.form.isJobhunterApply = ''
    this.getData(1)
    // console.log(this.form);
  }
  /* 关闭二维码弹窗 */
  closeTopic () {
    this.$nextTick(() => {
      this.$refs['mobile'].style.display = 'none'
      this.$refs['qrCode'].style.display = 'none'
    })
  }
  forEachKeys (form, page = 1) {
    // 基础键，剩余键值对由用户选择
    let param = {
      page,
      count: 20,
      dealStatusId: form.dealStatusId,
      // interviewNotSuitTypeId: form.interviewNotSuitTypeId,
      startTime: form.startTime,
      endTime: form.endTime,
      followAdvisorUid: form.followAdvisorUid,
      chargeStatus: form.chargeStatus,
      applyType: form.applyType,
      resumeType: form.resumeType,
      isJobhunterApply: form.isJobhunterApply
    }
    param[this.searchType.key1] = this.form.commonKey1
    return param
  }
  getData (page) {
    if ((this.form.startTime && !this.form.endTime) || (!this.form.startTime && this.form.endTime)) {
      this.$message({ message: '面试日期必需选择区间时间', type: 'warning' })
      return
    }
    let obj = this.forEachKeys(this.form, page)
    if (obj.isJobhunterApply === '') delete obj.isJobhunterApply
    if (obj.dealStatusId === '') delete obj.dealStatusId
    if (obj.company && !obj.company.trim()) delete obj.company
    if (!obj.followAdvisorUid) delete obj.followAdvisorUid
    if (obj.chargeStatus === '') delete obj.chargeStatus
    if (obj.applyType === '') delete obj.applyType
    if (obj.resumeType === '') delete obj.resumeType
    if (!obj.startTime || !obj.endTime) {
      delete obj.startTime
      delete obj.endTime
    }
    if (obj.isJobhunterApply) {
      obj.isJobhunterApply = 1
    }
    if (!obj.isJobhunterApply) {
      delete obj.isJobhunterApply
    }
    chatsearchList(obj).then(res => {
      console.log(res)
      this.tableData = res.data.data
      this.leftcontent.lastPage = res.data.meta.lastPage
      this.leftcontent.total = res.data.meta.total
      this.tableData.forEach(item => {
        item.jobhunter.isShowMobile = false
        item.recrutier.isShowMobile = false
        if (item.interview) {
          if (/(55|54|57|58|60|61|100)/.test(item.interview.status)) {
            item.interview.isAutomatic = true
          } else {
            item.interview.isAutomatic = false
          }
        }
      })
    })
  }
  created () {
    this.chatlistStatus().then(() => {
      this.getData(1)
      this.getAdvisorUserList()
    })
  }
  chatlistStatus () {
    return chatlistStatus().then(res => {
      this.dealStatusList = res.data.data
      this.reason = res.data.data.notSuitTypes
    })
  }
  /* 生成二维码 */
  getQr (type, uid) {
    switch (type) {
      case 1:
        // 招聘官主页
        return getRecruiterCodeUrlApi({ id: uid })
      case 2:
        // 简历二维码
        return getResumeCodeUrlApi({ id: uid })
      case 3:
        if (uid === 0) return
        return getPositionCodeUrlApi({ id: uid })
    }
  }
  // 看二维码
  /* 生成小程序码 */
  /* 展示手机 */
  showPhone (e, mobile) {
    // console.log(mobile);
    if (this.timeout !== null) clearTimeout(this.timeout)
    this.mobile = mobile || '用户未绑定手机'
    this.$nextTick(() => {
      this.$refs['mobile'].style.display = 'block'
      this.$refs['mobile'].style.left = e.clientX + 'px'
      this.$refs['mobile'].style.top = e.clientY + window.scrollY + 'px'
    })
  }
  async creatLink (e, uid, index, type) {
    // console.log(e);
    // console.log(uid, index, type);
    // console.log(e.clientX, e.clientY, "e");
    // console.log(window.scrollY);
    this.qrCode = ''
    // 是否已经加载过二维码
    // console.log("this.tableData[index]", this.tableData[index]);
    if (this.tableData[index].qrCode && type === 1) {
      this.qrCode = this.tableData[index].qrCode
      this.$nextTick(() => {
        this.$refs['qrCode'].style.display = 'block'
        this.$refs['qrCode'].style.left = e.clientX + 'px'
        this.$refs['qrCode'].style.top = e.clientY + window.scrollY + 'px'
      })
      return
    } else if (this.tableData[index].resumeQrCode && type === 2) {
      this.qrCode = this.tableData[index].resumeQrCode
      this.$nextTick(() => {
        this.$refs['qrCode'].style.display = 'block'
        this.$refs['qrCode'].style.left = e.clientX + 'px'
        this.$refs['qrCode'].style.top = e.clientY + window.scrollY + 'px'
      })
      return
    } else if (this.tableData[index].jobQrCode && type === 3) {
      this.qrCode = this.tableData[index].jobQrCode
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
      this.tableData[index].qrCode = res.data.data.qrCodeUrl
    } else if (type === 2) {
      this.qrCode = res.data.data.qrCodeUrl
      this.tableData[index].resumeQrCode = res.data.data.qrCodeUrl
    } else {
      this.qrCode = res.data.data.qrCodeUrl
      this.tableData[index].jobQrCode = res.data.data.qrCodeUrl
    }
  }
  /* status  是否处于编辑状态,title  标题 */
  /*  */
  choiceType (type) {
    return {}
  }
  /* status 是否出现编辑弹框 */
  /* type  1 扣点  2 返点，3返点原因  4扣点原因 5 不合适原因 */
  handleClick (status, title, id, type) {
    // console.log(status, title, id, type);
    this.dialogTitle = title
    this.centerDialogVisible = true
    this.iconList = []
    this.RusultForm.note = ''
    let nowRow = this.tableData.filter(item => item.id === id)[0]
    // console.log(nowRow.chargeNote);
    switch (type) {
      case 1:
        this.RusultForm.type = type
        this.RusultForm.recommendId = id
        this.iseditResult = status
        break
      case 2:
        this.RusultForm.type = type
        this.RusultForm.recommendId = id
        this.iseditResult = status
        break
      case 3:
        this.iseditResult = status
        this.result = nowRow.chargeNote
        break
      case 4:
        this.iseditResult = status
        this.result = nowRow.chargeNote
        break
      case 5:
        this.result = nowRow.interview.comment.extraDesc
        this.iconList = nowRow.interview.comment.reason.split(',')
        break
    }
  }
  // 聊一聊
  acceptInterview () {
    this.$confirm('确认后，企业将扣除多多币，且会收到候选人同意约聊的消息提醒，请谨慎操作。确定操作为聊一聊？(确认后请联系双方进行约聊)', '提示', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      if (this.btntext === '不感兴趣') {
        this.jobhunteracceptchatApi()
      } else {
        this.recruiteracceptchatApi()
      }
    }).catch(() => {
    })
  }
  // 不敢兴趣或者不合适
  noacceptInterview () {
    if (this.btntext === '不感兴趣') {
      this.darenotinterestApi()
    } else {
      this.chatresonlist()
    }
  }
  selectreson (item) {
    item.cur = !item.cur
  }
  watchreson (item) {
    this.seeresonVisible = true
    this.seeresonlist = item.reason
  }
  confirereson () {
    let ids = []
    this.resonlist.map((v, k) => {
      if (v.cur) {
        ids.push(v.id)
      }
    })
    inappropriateApi({ chatId: this.chatid, reasonIds: ids.join(',') }).then((res) => {
      this.$message({
        type: 'success',
        message: '操作成功!'
      })
      this.InterviewVisible = false
      this.resonVisible = false
      this.getData()
    })
  }
  chatresonlist () {
    chatresonlist().then((res) => {
      let arr = res.data.data.recruiter
      arr.map((v, k) => {
        v.cur = false
      })
      this.resonlist = arr
      this.resonVisible = true
    })
  }
  todoAction (item) {
    this.chatid = item.id
    if (item.status === 501) {
      this.btntext = '不感兴趣'
    } else {
      this.btntext = '不合适'
    }
    this.handlervale(item)
  }
  // 不感兴趣
  darenotinterestApi () {
    darenotinterestApi({ chatId: this.chatid }).then((res) => {
      this.InterviewVisible = false
      this.getData()
    })
  }
  // 求职者聊一聊
  jobhunteracceptchatApi () {
    jobhunteracceptchatApi({ chatId: this.chatid }).then((res) => {
      this.InterviewVisible = false
      this.$message({
        type: 'success',
        message: '操作成功!'
      })
      this.getData()
    })
  }
  // 招聘官聊一聊
  recruiteracceptchatApi () {
    recruiteracceptchatApi({ chatId: this.chatid }).then((res) => {
      this.InterviewVisible = false
      this.$message({
        type: 'success',
        message: '操作成功!'
      })
      this.getData()
    })
  }
  handlervale (vo) {
    this.interviewinfo.name = vo.jobhunter.name
    this.interviewinfo.positionName = vo.positionInfo.positionName
    this.interviewinfo.emolumentMin = vo.positionInfo.emolumentMin
    this.interviewinfo.emolumentMax = vo.positionInfo.emolumentMax
    this.interviewinfo.companyName = vo.recrutier.companyName
    this.InterviewVisible = true
  }
  getPosition (index) {
    this.positionLists.map((field, i) => (field.active = i === index))
  }
  setReason (index) {
    this.reasonList[index].active = !this.reasonList[index].active
    this.model.reason = this.reasonList.filter(field => field.active)
  }
  interviewRetract (params) {
    return interviewRetractApi(params).then(() => this.init())
  }
  getTime (e) {
    this.model.dateLists.push({
      appointment: e,
      active: false,
      appointmentTime: Date.parse(new Date(e)) / 1000
    })
  }
  getLabelComment (params) {
    // 代表过程中的状态
    let pending = [11, 12, 21, 31, 32, 41]
    let api = pending.includes(Number(params.status)) ? getInterviewNotSuitReasonApi : getInterviewCommentReasonApi
    return api(params).then(res => {
      let reasonList = res.data.data
      reasonList.map(field => (field.active = false))
      this.reasonList = reasonList
    })
  }
  getPositionList (data) {
    let params = {
      page: this.positionNum,
      count: this.pageSize,
      status: '0,1,2'
    }
    params = Object.assign(params, data)
    return getListApi(params).then(res => {
      let infos = res.data
      let list = infos.data
      list.map(field => (field.active = false))
      this.positionLists = this.positionLists.concat(list)
      this.isLastPageOfPosition = !((res.data.meta && res.data.meta.nextPageUrl))
      this.positionNum++
    })
  }
  close () {
    let item = this.model.item
    switch (this.model.type) {
      case 'confirmSchedule':
        this.model.show = false
        break
      case 'recipe':
        this.model.title = '确定约面'
        this.model.show = false
        break
      case 'improper':
        this.model.show = false
        break
      case 'arrange':
        this.model.title = '安排面试'
        this.model.show = false
        break
      case 'modify':
        this.model.title = '修改面试时间'
        this.model.show = false
        break
      case 'preview':
        this.model.title = '查看面试'
        this.model.show = false
        break
      case 'position':
        this.model.type = this.model.beforeType
        this.model.title = this.model.beforeTitle
        break
      case 'address':
        let actionList = item.action.map(field => field.action)
        if (actionList.includes('arrange')) {
          this.model.type = 'arrange'
          this.model.title = '安排面试'
        } else {
          this.model.type = 'modify'
          this.model.title = '修改面试时间'
        }
        break
      case 'reason':
        this.model.show = false
        // this.model.position = this.model.defaultPosition
        break
      case 'present':
        this.model.show = false
        break
      case 'add_address':
        this.model.type = 'address'
        break
      case 'edit_address':
        this.getSimplepageAddressesLists({
          mobile: item.jobhunter.mobile
        }).then(() => {
          this.model.show = true
          this.model.title = '选择地址'
          this.model.btnTxt = '返回'
          this.model.type = 'address'
          this.setAddressDomScroll({
            mobile: item.jobhunter.mobile
          })
        })
        break
      default:
        break
    }
  }
  confirm () {
    let dateList = this.model.dateLists
    if (dateList.length) dateList = dateList.map(field => field.appointmentTime).join(',')
    let data = this.model.item
    switch (this.model.type) {
      case 'confirmSchedule':
        confirmArrangementInfo({ interviewId: this.model.interviewId, appointmentId: this.appointmentId }).then((res) => {
          this.model.show = false
          this.getData()
        })
        break
      case 'arrange':
        if (!this.model.position.positionId) {
          this.$message.error('请选择一个职位')
          return
        }
        if (!this.model.address.addressId) {
          this.$message.error('请选择一个地址')
          return
        }
        if (!dateList.length) {
          this.$message.error('请至少添加一个约面时间')
          return
        }
        this.setInterviewInfo({
          interviewId: this.model.interviewId,
          realname: this.form.realname,
          mobile: this.form.mobile,
          addressId: this.model.address.addressId,
          interviewTime: dateList,
          positionId: this.model.position.positionId
        }).then(() => {
          this.model.show = false
        })
        break
      case 'modify':
        this.model.show = false
        this.setInterviewInfo({
          interviewId: this.model.interviewId,
          realname: this.form.realname,
          mobile: this.form.mobile,
          addressId: this.model.address.addressId,
          interviewTime: dateList,
          positionId: this.model.position.positionId
        })
        break
      case 'preview':
        this.model.show = false
        break
      case 'improper':
        this.getLabelComment({ status: data.status }).then(() => {
          this.model.type = 'reason'
          this.model.title = '选择不合适原因'
        })
        break
      case 'position':
        let positionItem = this.positionLists.find(field => field.active)
        // 该职位处于下线状态
        if (!positionItem.status) {
          this.$confirm('确认开放该职位进行约面吗？', '开放职位约面', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(() => {
            this.openPosition({ id: positionItem.id }).then(() => {
              this.model.position.name = positionItem.positionName
              this.model.position.positionId = positionItem.id
              this.model.type = this.model.beforeType
              this.model.title = this.model.beforeTitle
            })
          }).catch(() => {
            // 2
          })
        } else {
          this.model.position.name = positionItem.positionName
          this.model.position.positionId = positionItem.id
          this.model.type = this.model.beforeType
          this.model.title = this.model.beforeTitle
        }
        break
      case 'address':
        let addressItem = this.addressLists.find(field => field.active)
        let actionList = data.action.map(field => field.action)
        if (addressItem) {
          this.model.address.addressName = addressItem.address
          this.model.address.addressId = addressItem.id
          if (actionList.includes('arrange')) {
            this.model.type = 'arrange'
            this.model.title = '安排面试'
          } else {
            this.model.type = 'modify'
            this.model.title = '修改面试时间'
          }
        } else {
          this.$message('请选择一个地址')
        }
        break
      case 'edit_address':
        this.editPositionAddress(this.form.address).then(() => {
          this.addressLists = []
          this.addressNum = 1
          this.isLastPageOfAddress = false
          this.getSimplepageAddressesLists({
            mobile: data.jobhunter.mobile
          }).then(() => {
            this.model.type = 'address'
            this.model.title = '选择地址'
            this.setAddressDomScroll({
              mobile: data.jobhunter.mobile
            })
          })
        })
        break
      case 'reason':
        let reason = this.model.reason.map(field => field.id).join(',')
        this.refuseJobhunterUidInterview({
          jobhunterUid: data.jobhunterInfo.uid,
          interviewId: data.interviewId,
          extra: this.model.extra,
          reason
        }).then(() => {
          this.model.show = false
        })
        break
      case 'present':
        this.setUserInterviewAttend({
          interviewId: data.interviewId,
          isAttend: this.form.isAttend
        }).then(() => {
          this.model.show = false
          this.init()
        })
        break
      case 'add_address':
        this.createPositionAddress(this.form.address).then(() => {
          this.addressLists = []
          this.addressNum = 1
          this.isLastPageOfAddress = false
          this.getSimplepageAddressesLists({
            mobile: data.jobhunter.mobile
          }).then(() => {
            this.model.type = 'address'
            this.model.title = '选择地址'
            this.setAddressDomScroll({
              mobile: data.jobhunter.mobile
            })
          })
        })
        break
      default:
        break
    }
  }
  setPositionDomScroll (params) {
    return new Promise((resolve, reject) => {
      let dom = document.getElementById('scroll_div_ul_position')
      dom.onscroll = () => {
        let wholeHeight = dom.scrollHeight
        let scrollTop = dom.scrollTop
        let divHeight = dom.clientHeight
        if (scrollTop + divHeight >= wholeHeight) this.getPositionList(params).then(() => resolve())
      }
    })
  }
  setInterviewInfo (param) {
    return setInterviewInfoApi(param).then(() => this.getData())
  }
  setUserInterviewAttend (params) {
    return setUserInterviewAttendApi(params)
  }
  /* 说出不合适原因 */
  sayResult (interviewId) {
    return getInterviewComment(interviewId).then(res => (this.model.refuseReason = res.data.data.reason))
  }
  setUserInterviewComment (params) {
    return setUserInterviewCommentApi(params)
  }
  getSimplepageAddressesLists (data) {
    let params = {
      page: this.addressNum,
      count: this.pageSize
    }
    params = Object.assign(params, data)
    return getSimplepageAddressesListsApi(params).then(res => {
      let infos = res.data
      let list = infos.data
      list.map(field => (field.active = false))
      this.addressLists = this.addressLists.concat(list)
      this.isLastPageOfAddress = !((res.data.meta && res.data.meta.nextPageUrl))
      this.addressNum++
    })
  }
  handertableHeight (e) {
    this.tableHeight = e
  }
  toPositionPath (id) {
    // console.log(id);
    this.$router.push({
      name: 'positionAuditDetail',
      query: { id }
    })
  }
  // 确认扣返点
  // 确认扣返点
  checkNote () {
    if (this.RusultForm.note === '') {
      this.$message({
        message: '原因不能为空',
        type: 'warning'
      })
      return
    }
    if (this.RusultForm.type === 1) {
      // console.log("扣点");
      chatlistPay(this.RusultForm.recommendId, {
        note: this.RusultForm.note
      }).then(res => {
        // console.log(res);
        this.centerDialogVisible = false
        this.getData()
        this.RusultForm.note = ''
      })
      /* 扣点 */
    } else if (this.RusultForm.type === 2) {
      // console.log("返点"); /* 返点 */
      chatlistrefund(this.RusultForm.recommendId, {
        note: this.RusultForm.note
      }).then(res => {
        // console.log(res);
        this.centerDialogVisible = false
        this.getData()
        this.RusultForm.note = ''
      })
    }
  }
  getAddress (index) {
    this.addressLists.map((field, i) => {
      field.active = false
      if (i === index) {
        field.active = true
        this.model.position.positionId = field.id
        this.model.position.positionName = field.positionName
      }
    })
  }
  getPositionAddress (params) {
    return getPositionAddressApi(params)
  }
  openPosition (params) {
    return openPositionApi(params)
  }
  createPositionAddress (params) {
    return createPositionAddressApi(params)
  }
  refuseJobhunterUidInterview (params) {
    return refuseJobhunterUidInterviewApi(params).then(() => this.init())
  }
  editPositionAddress (params) {
    if (!params.areaName) {
      delete params.areaName
      params.areaId = this.form.address.areaId
    }
    return editPositionAddressApi(params)
  }
  editAddress (index) {
    let item = this.addressLists.find((field, i) => i === index)
    let data = this.model.item
    this.getPositionAddress({ id: item.id }).then(res => {
      let infos = res.data.data
      this.form.address = {
        mobile: data.recruiterInfo.mobile,
        areaName: infos.area,
        address: infos.address,
        doorplate: infos.doorplate,
        lng: infos.lng,
        lat: infos.lat,
        id: infos.id,
        areaId: infos.areaId
      }
      this.model.type = 'edit_address'
      this.model.show = true
      this.model.title = '编辑地址'
    })
  }
}
</script>
<style lang='less' scoped>
@import "./index.less";
</style>
