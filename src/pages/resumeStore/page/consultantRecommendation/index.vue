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
            <el-form-item label-width="1px" label prop="end"></el-form-item>
            <el-form-item label-width="80px" prop="startd">
              <el-checkbox v-model="form.isJobhunterApply">只看求职者自行约面</el-checkbox>
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
            <el-table-column prop="jobhunter" label="求职者信息" width="270">
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
                <div v-if="scope.row.interview!=null">
                  <div class="col_position">
                    <i class="icon iconfont iconjiantou" v-if="scope.row.dealStatus==1"></i>
                    <i
                      class="icon iconfont iconjiantouzuo"
                      v-if="scope.row.dealStatus==2||scope.row.dealStatus==0"
                    ></i>
                  </div>
                  <p class="companyName">
                    <span
                      v-if="!scope.row.chargeStatus&&!scope.row.isJobhunterApply"
                    >{{scope.row.dealStatusDesc}}</span>
                    <span
                      v-else-if="scope.row.chargeStatus!==0||scope.row.isJobhunterApply!==0"
                    >{{scope.row.interview.statusDesc}}</span>
                    <span
                      class="StatusResult"
                      v-if="scope.row.interview.comment!==''"
                      @click.stop="handleClick(false,'不感兴趣原因',scope.row.id,5)"
                    >原因</span>
                  </p>
                  <p>{{scope.row.interview.updatedAt}}</p>
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
            <el-table-column prop="address" label="约面信息" width="300">
              <template slot-scope="scope">
                <!-- 推荐到其他地方 -->
                <div v-if="scope.row.isValid===0">
                  <p>{{scope.row.note}}</p>
                </div>
                <div v-else-if="scope.row.interview">
                  <p
                    style="text-align:left"
                    v-if="scope.row.interview.positionId===0"
                  >------------------------</p>
                  <div v-else>
                    <div class="positionRow">
                      <span style>职位:</span>
                      <span
                        class="positionName"
                        @click="toPositionPath(scope.row.interview.positionId)"
                      >{{scope.row.interview.positionName}}</span>
                      <span>{{scope.row.interview.emolumentMin}}k-{{scope.row.interview.emolumentMax}}k</span>
                    </div>
                    <p
                      class="companyName"
                    >{{scope.row.interview.address}}{{scope.row.interview.doorplate}}</p>
                    <p
                      v-if="scope.row.arrangementInfo"
                    >时间:{{scope.row.arrangementInfo.appointment_time}}</p>
                  </div>
                </div>

                <div v-else>
                  <p style="color:red;font-size：14px;">{{scope.row.dealStatusDesc}}</p>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="followAdvisor" label="跟进顾问" width="80"></el-table-column>
            <el-table-column prop="chargeStatusDesc" label="是否扣点" width="100"></el-table-column>
            <el-table-column fixed="right" label="操作" width="100">
              <!-- slot-scope="scope" -->
              <template slot-scope="scope">
                <!-- 如果不是系统自动，则显示操作列表 -->
                <div v-if="scope.row.interview!==null">
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
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import lyoutContent from 'COMPONENTS/Lyout/lyoutContent/lyoutContent.vue'
import { getAdvisorUserListApi } from 'API/common'
import {
  interviewsList,
  recommendPay,
  refund,
  dealStatus
} from 'API/resumeStore'
import { getResumeCodeUrlApi, getRecruiterCodeUrlApi, getPositionCodeUrlApi } from 'API/interview'
@Component({
  name: 'invitPro',
  prop: '',
  components: {
    lyoutContent
  }
})
export default class invitPro extends Vue {
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
    chargeStatus: ''
  };
  page = 1;
  mobile = '';
  searchType = {
    key1: 'company',
    condition2: ''
  };
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
    title: '顾问推荐进展',
    lastPage: '',
    page: 1
  };
  tableHeight = 700;
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
    interviewsList(obj).then(res => {
      this.tableData = res.data.data
      this.leftcontent.lastPage = res.data.meta.lastPage
      this.leftcontent.total = res.data.meta.total
      this.tableData.forEach(item => {
        item.jobhunter.isShowMobile = false
        item.recrutier.isShowMobile = false
        if (item.interview !== null) {
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
    this.dealStatus().then(() => {
      this.getData(1)
      this.getAdvisorUserList()
    })
  }
  dealStatus () {
    return dealStatus().then(res => {
      this.dealStatusList = res.data.data.dealStatus
      this.reason = res.data.data.notSuitTypes
    })
  }
  /* 生成二维码 */
  getQr (type, uid) {
    switch (type) {
      case 1:
        // 招聘官主页
        getRecruiterCodeUrlApi({ id: uid })
        break
      case 2:
        // 简历二维码
        getResumeCodeUrlApi({ id: uid })
        break
      case 3:
        if (uid === 0) return
        getPositionCodeUrlApi({ id: uid })
        break
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

    // [0];
    //
    //
    // if (nowRow.interview.comment !== ""&&type===undefined) {
    //   console.log("点击原因");
    //
    //
    // } else {
    //   console.log("点击扣返点");
    //   this.iconList=[];
    //
    // }
    //
    //
    //
  }
  handertableHeight (e) {
    this.tableHeight = e
  }
  toPositionPath (id) {
    // console.log(id);
    this.$router.push({
      path: '/positionManage/positionAuditDetail',
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
      recommendPay(this.RusultForm.recommendId, {
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
      refund(this.RusultForm.recommendId, {
        note: this.RusultForm.note
      }).then(res => {
        // console.log(res);
        this.centerDialogVisible = false
        this.getData()
        this.RusultForm.note = ''
      })
    }
  }
}
</script>
<style lang='less' scoped>
@import "./index.less";
</style>
