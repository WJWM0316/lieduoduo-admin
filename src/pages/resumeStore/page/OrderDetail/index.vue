<!--  -->
<template>
  <div class="OrderDetail" @click.stop="closeTopic">
    <div class="TabView">
      <div class="Detail" style="padding:0px;">
        <div class="createTime">
          <span>推荐单详情</span>
          <span>创建时间: {{baseMsg.createdTimeDesc}}</span>
        </div>
        <div class="result">
          <div class="success">
            <span>推荐成功:</span>
            <span>{{baseMsg.succeedNum}}</span>
            <span>份简历</span>
          </div>
          <div class="success">
            <span>推荐失败:</span>
            <span>{{baseMsg.failNum}}</span>
            <span>份简历</span>
          </div>
          <div class="success" @click.stop="seeRusult">查看原因</div>
        </div>
        <div class="result">
          <div class="success">
            <span>职位ID:</span>
            <span>{{baseMsg.positionId}}</span>
          </div>
          <div class="success">
            <span>推荐职位:</span>
            <span>{{baseMsg.positionName}} | {{baseMsg.areaName}} | {{baseMsg.emolumentMin}}k-{{baseMsg.emolumentMax}}k</span>
          </div>
          <div class="success">
            <span>公司名称:</span>
            <span>{{baseMsg.companyName}}</span>
          </div>
          <div class="success">
            <span>发布者:</span>
            <span>{{baseMsg.recruiterName}}</span>
          </div>
          <div class="success">
            <span>负责推荐人:</span>
            <span>{{baseMsg.advisorName}}</span>
          </div>
        </div>
        <div class="content"></div>
      </div>
      <div class="form" ref="form">
        <el-table border highlight-current-row :data="tableData" style="width: 100%">
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
                <span @click.stop="creatLink($event, scope.row.jobhunter.uid,scope.$index, 2)">扫码看简历</span>
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
                  <span v-if="!scope.row.dealStatus">{{scope.row.dealStatusDesc}}</span>
                  <span v-else>{{scope.row.interview.statusDesc}}</span>
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
                <span @click.stop="creatLink($event, scope.row.jobhunter.uid,scope.$index,1)">扫码看主页</span>
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
                <div v-if="scope.row.interview.positionId==0">
                  <p style="text-align:left">--------------------</p>
                </div>
                <div class="positionRow" v-else>
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
              <div v-else>
                <p style="color:red;font-size：14px;">{{scope.row.dealStatusDesc}}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="chargeStatusDesc" label="是否扣点" width="200"></el-table-column>
          <el-table-column label="操作" width="100">
            <!-- slot-scope="scope" -->
            <template slot-scope="scope">
              <!-- 如果不是系统自动，则显示操作列表 -->
              <!--  -->
              <!-- -->
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
      <div class="PopForm" @click.stop="closeForm" v-if="isShowForm">
        <div class="allRusule">
          <p class="title">查看原因</p>
          <div class="resumeNums">
            <span>成功:{{nowSuccessNum}}份</span>
            <span>失败:{{nowFailNum}}份</span>
          </div>
          <div class="resultList">
            <el-table border height="400" max-height="400" :data="resultList" style="width: 100%">
              <el-table-column prop="vkey" label="简历编号" width="380"></el-table-column>
              <el-table-column prop="name" label="求职者" width="380"></el-table-column>
              <el-table-column prop="reason" label="原因说明" width="380"></el-table-column>
            </el-table>
          </div>
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
          <div class="iconItem">
            <span v-for="item in iconList" :key="item" class="itemIcon">{{item}}</span>
          </div>
          <span>{{result}}</span>
        </div>
        <span slot="footer" class="dialog-footer" v-if="iseditResult">
          <el-button @click="centerDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="checkNote">确 定</el-button>
        </span>
      </el-dialog>
      <!--电话号码展示框-->
      <div class="phone" ref="mobile">
        <span>{{mobile}}</span>

        <img class="phoneBg" src="../../../../assets/number_bg.png">
      </div>
      <!--小程序码展示框-->
      <div class="qrCode" ref="qrCode">
        <img class="bg" src="../../../../assets/code_bg.png">
        <div
          style="height: 100%;display: flex; align-items: center;flex-direction: column;justify-content: center;"
          v-if="!qrCode"
        >
          <img style="height: 38px;width: 38px;" src="../../../../assets/loading.gif">
          <div class="txt">正在加载中…</div>
        </div>
        <div v-else>
          <img class="Qr" :src="qrCode">
          <div class="txt">微信扫码，打开小程序查看</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import {
  recommendDetail,
  resultList,
  recommendPay,
  refund
} from 'API/resumeStore'
import { getResumeCodeUrlApi, getRecruiterCodeUrlApi, getPositionCodeUrlApi } from 'API/interview'
@Component({
  name: 'OrderDetail',
  prop: ''
})
export default class OrderDetail extends Vue {
  // itemList = ["推荐单详情"];
  isCreate = false; // 是否创建
  isShowForm = false; // 是否展示原因
  iseditResult = false; // 如果是编辑就弹出编辑弹框，否则是原因弹框
  dialogTitle = '返点'; // 弹框标题,四种情况 弹框唯一
  centerDialogVisible = false; // 原因弹框
  baseMsg = {}; // 基础信息
  textarea2 = ''; // 原因
  nowSuccessNum = 0; // 成功数
  nowFailNum = 0; // 失败数
  qrCode = ''; // 二维码
  mobile = '';
  result = '';
  isAutomatic = true; /* 是否系统自动   false 显示操作栏 true 不显示操作栏 */
  iconList = []; /* 不感兴趣标签栏 */
  tableData = [];
  RusultForm = {
    recommendId: '',
    note: '',
    type: '' /* 1是扣点，2是返点 */
  };
  closeForm () {
    this.isShowForm = !this.isShowForm
  }
  /* status 是否出现编辑弹框 */
  /* type  1 扣点  2 返点，3返点原因  4扣点原因 5 不合适原因 */
  handleClick (status, title, id, type) {
    // console.log(status, title, id, type);
    this.dialogTitle = title
    this.centerDialogVisible = true
    this.iconList = []
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
    // d
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
  /* 关闭二维码弹窗 */
  closeTopic () {
    this.$nextTick(() => {
      this.$refs['mobile'].style.display = 'none'
      this.$refs['qrCode'].style.display = 'none'
    })
  }
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
    // console.log(this.RusultForm);
  }
  created () {
    this.getData()
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
  toPositionPath (id) {
    // console.log(id);
    this.$router.push({
      name: 'positionAuditDetail',
      query: { id }
    })
  }
  seeRusult () {
    const { id } = this.$route.query
    this.isShowForm = true
    resultList(id).then(res => {
      // console.log(res);
      this.resultList = res.data.data
      this.nowSuccessNum = this.resultList.filter(
        item => item.isSuccess === 1
      ).length
      this.nowFailNum = this.resultList.filter(
        item => item.isSuccess === 0
      ).length
      this.resultList.forEach(item => {
        if (item.isSuccess) {
          item.reason = '推荐成功'
        }
      })
      // console.log(this.resultList);
    })
  }
  // 看二维码
  /* 生成小程序码 */
  async creatLink (e, uid, index, type) {
    this.qrCode = ''
    // 是否已经加载过二维码
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
  getData () {
    let { id } = this.$route.query
    // console.log(id);
    recommendDetail(id).then(res => {
      // console.log(res);
      this.baseMsg = res.data.data.listInfo
      this.tableData = res.data.data.recommends
      this.tableData.forEach(item => {
        item.jobhunter.isShowMobile = false
        item.recrutier.isShowMobile = false
        if (item.interview !== null) {
          if (/(55|54|57|58|60|61)/.test(item.interview.status)) {
            item.interview.isAutomatic = true
          } else {
            item.interview.isAutomatic = false
          }
        }
      })
    })
  }
}
</script>
<style lang='less' scoped>
@import "./index.less";
</style>
