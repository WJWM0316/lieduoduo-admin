<template>
  <div class="resumePopup">
    <!-- 遮罩 -->
    <div class="Mark" v-if="isShow" @click.stop="closeMark"></div>
    <div v-if="isShow">
      <div v-if="itemList.length>0">
        <div class="left comstyle" @click.stop="LeftArrow">
          <i class="el-icon-arrow-left"></i>
        </div>
        <div class="right comstyle" @click.stop="rightArrow">
          <i class="el-icon-arrow-right"></i>
        </div>
      </div>
      <div class="swiperList" @click.stop="initResume">
        <div class="swipertype">
          <div
            class="common"
            :class="[index==nowCheck?'isCheck':'noCheck']"
            v-for="(item,index) in typeList"
            :key="index"
            @click.stop="check(index,'tab')"
          >{{item}}</div>
        </div>
        <div class="nowResume" v-show="nowCheck==0">
          <div class="Numbering">
            <span>简历编号：{{nowResumeMsg.vkey}}</span>
            <span>{{nowResumeMsg.resumeUpdateTime}}更新</span>
          </div>
          <div class="resumeLyout">
            <div class="ResumeDetails">
              <!-- 基础信息 -->
              <div class="base">
                <div class="message">
                  <div class="msgUrl">
                    <img :src="nowResumeMsg.avatar.url" alt v-if="nowResumeMsg.avatar" />
                    <span class="gender" v-show="nowResumeMsg.gender===1">
                      <i v-show="nowResumeMsg.gender===1" class="icon iconfont iconicon_boy"></i>
                    </span>
                    <span class="gender2" v-show="nowResumeMsg.gender===2">
                      <i v-show="nowResumeMsg.gender===2" class="icon iconfont iconicon_girl"></i>
                    </span>
                  </div>
                  <div class="msgUserInfo">
                    <div class="basemsg">
                      <span class="realName">{{nowResumeMsg.name}}</span>
                      <div class="lebalList">
                        <div class="lebalItem">
                          <i class="icon iconfont iconzhiwei" style></i>
                          <span>{{nowResumeMsg.workAgeDesc}}</span>
                        </div>
                        <div class="lebalItem">
                          <i class="icon iconfont iconnianling"></i>
                          <span>{{nowResumeMsg.age}}岁</span>
                        </div>
                        <div
                          class="lebalItem"
                          :style="nowResumeMsg.jobStatus===''?'margin-right:0px;':''"
                        >
                          <i class="icon iconfont iconxueli"></i>
                          <span>{{nowResumeMsg.degreeDesc}}</span>
                        </div>
                        <div class="lebalItem">
                          <span
                            class="status"
                            v-if="nowResumeMsg.jobStatus"
                          >{{nowResumeMsg.jobStatusDesc}}</span>
                        </div>
                      </div>
                    </div>
                    <div class="description">
                      <span class="msg">{{nowResumeMsg.signature}}</span>
                      <!-- v-show="nowResumeMsg.personalizedLabels.length>0" -->
                      <div class="iconList">
                        <span
                          class="iconItem"
                          v-for="(item,index) in nowResumeMsg.personalizedLabels"
                          :key="item.labelName"
                          :style="index===nowResumeMsg.personalizedLabels.length-1?'margin-bottom:0px;':''"
                        >{{item.labelName}}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- 求职意向 -->
              <div class="intention" v-show="nowResumeMsg.expects!=''">
                <p class="title">求职意向</p>
                <div class="intentList">
                  <div
                    class="intentionItem"
                    v-for="(item,index) in nowResumeMsg.expects"
                    :key="item.position"
                    :style="index===nowResumeMsg.expects.length-1?'padding-bottom:0px;':''"
                  >
                    <span class="position">{{item.position}}&nbsp;|&nbsp;{{item.city}}</span>
                    <span v-if="item.fields.length>0">|</span>
                    <div style="margin-left:9px;display:inline-block;">
                      <div class="fields" v-for="(item1,index1) in item.fields" :key="index1">
                        <span>{{item1.field}}&nbsp;&nbsp;</span>
                      </div>
                    </div>
                    <span class="price">{{item.salaryFloor}}k-{{item.salaryCeil}}k</span>
                  </div>
                </div>
              </div>
              <!-- 工作经历 -->
              <div class="workExperience" v-show="nowResumeMsg.careers!=''">
                <p class="title">工作经历</p>
                <!-- v-show="nowResumeMsg.careers.length>0" -->
                <div class="workList">
                  <div
                    class="workItem"
                    v-for="(item,index) in nowResumeMsg.careers"
                    :key="item.id"
                    :style="index===nowResumeMsg.careers.length-1?'margin-bottom:0px;':''"
                  >
                    <div class="workTime">
                      <span>{{item.company}} | {{item.position}}</span>
                      <span>{{item.startTimeDesc}}~{{item.endTimeDesc}}</span>
                    </div>
                    <div class="workContent">
                      <span class="duties">
                        <pre>{{item.duty}}</pre>
                      </span>
                    </div>
                    <!-- v-show="item.technicalLabels.length>0" -->
                    <div class="workIconList" v-show="item.technicalLabels.length>0">
                      <span
                        v-for="item1 in item.technicalLabels"
                        :key="item1.technicalLabels"
                      >#{{item1.labelName}}</span>
                    </div>
                  </div>
                </div>
              </div>
              <!-- 项目经历 -->
              <div class="workExperience" v-show="nowResumeMsg.projects!=''">
                <p class="title">项目经历</p>
                <div class="workList">
                  <div
                    class="workItem"
                    v-for="(item,index) in nowResumeMsg.projects"
                    :key="item.role"
                    :style="index===nowResumeMsg.projects.length-1?'margin-bottom:0px;':''"
                  >
                    <div class="workTime">
                      <span>{{item.name}} &nbsp;| &nbsp;{{item.role}}</span>
                      <span>{{item.startTimeDesc}}~{{item.endTimeDesc}}</span>
                    </div>
                    <div class="workContent">
                      <span class="duties">
                        <pre>{{item.description}}</pre>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <!-- 教育经历 -->
              <div class="workExperience" v-show="nowResumeMsg.educations!=''">
                <p class="title">教育经历</p>
                <div class="workList">
                  <div
                    class="workItem"
                    v-for="(item,index) in nowResumeMsg.educations"
                    :key="item.school"
                    :style="index===nowResumeMsg.educations.length-1?'margin-bottom:0px;':''"
                  >
                    <div class="workTime">
                      <span>{{item.school}} | {{item.degreeDesc}} | {{item.major}}</span>
                      <span>{{item.startTimeDesc}}~{{item.endTimeDesc}}</span>
                    </div>
                    <div class="workContent" v-show="item.experience!=''">
                      <span class="duties">
                        <pre>{{item.experience}}</pre>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <!-- 更多介绍 -->
              <div class="workExperience" v-if="nowResumeMsg.moreIntroduce">
                <p class="title">更多介绍</p>
                <div class="workList">
                  <pre v-if="nowResumeMsg.moreIntroduce.introduce">{{nowResumeMsg.moreIntroduce.introduce}}</pre>
                  <div class="imgList">
                    <img
                      :src="item.url"
                      alt
                      v-for="(item,index) in nowResumeMsg.moreIntroduce.imgs"
                      :key="index"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="Code">
              <div class="msgCode">
                <img :src="nowResumeMsg.resumeQrCode" alt v-if="nowResumeMsg.resumeQrCode" />
                <span>扫码进入</span>
              </div>
              <div class="isAdmin" v-if="isSales">
                <div class="ContactInformation">
                  <p class="contactTitle" v-if="nowResumeMsg.mobile||nowResumeMsg.wechat">联系方式:</p>
                  <div class="Contact" @click.stop="seeMobile" v-if="nowResumeMsg.mobile">
                    <span>手机号</span>
                    <span v-if="nowResumeMsg.showPhone">{{nowResumeMsg.mobile}}</span>
                  </div>
                  <div class="Contact" @click.stop="seeWechat" v-if="nowResumeMsg.wechat">
                    <span>微信号</span>
                    <span v-if="nowResumeMsg.showWechat">{{nowResumeMsg.wechat}}</span>
                  </div>
                  <p v-if="nowResumeMsg.wechat==''&&nowResumeMsg.mobile==''" class="noUpload">暂无上传</p>
                </div>
                <div class="download">
                  <p class="contactTitle">
                    附件简历:
                    <span
                      v-if="nowResumeMsg.resumeAttach"
                    >{{nowResumeMsg.resumeAttach.whereFromDesc}}</span>
                  </p>
                  <el-upload
                    v-if="nowResumeMsg.resumeAttach==null"
                    action="https://admin-api.lieduoduo.ziwork.com/attaches"
                    :limit="1"
                    :http-request="UploadImage"
                  >
                    <el-button size="small" type="primary">上传附件</el-button>
                  </el-upload>
                  <div class="Contact" @click.stop="seeFilesBtn" v-else>
                    <span>查看附件</span>
                    <!--  -->
                    <el-popover placement="top" width="160" v-model="visible">
                      <p>确认删除么，删除后将无法恢复</p>
                      <div style="text-align: right; margin: 0">
                        <el-button size="mini" type="text" @click="visible = false">取消</el-button>
                        <el-button
                          type="primary"
                          size="mini"
                          @click.stop="delateFile(nowResumeMsg.uid)"
                        >确定</el-button>
                      </div>
                    </el-popover>
                    <i class="el-icon-delete" @click.stop="visible=true"></i>
                  </div>
                </div>
                <div class="TabSelect">
                  <p class="addTab" @click="addTab">打标签</p>
                  <div class="tabList" v-if="nowResumeMsg.resumeLabels">
                    <div class="tabItem" v-for="item in nowResumeMsg.resumeLabels" :key="item.id">
                      <!-- @click.stop="delateLabelBtn(item.id,nowResumeMsg.uid)" -->
                      <span>{{item.labelName}}</span>
                      <!-- <i class="el-icon-circle-close"></i> -->
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="auditButton">
              <div class="btn-status" v-if="nowResumeMsg.inferior === 20">
                <div>审核为劣质简历</div>
              </div>
              <!-- <div v-if="nowResumeMsg.inferior === 20">
                <div class="tip">入选原因： 静静的静静的</div>
                <div class="status" style="width:160px;">取消标记为劣质简历</div>
              </div> -->
              <!-- <div v-if="nowResumeMsg.inferior === 20">
                <div class="tip">入选原因： 静静的静静的</div>
                <div class="status marleft">审核为劣质简历</div>
                <div class="status">审核通过</div>
              </div> -->
          </div>
        </div>
        <!-- 历史记录 -->
        <div class="nowResume" v-show="nowCheck==1">
          <div class="Numbering">
            <span>简历编号：{{nowResumeMsg.vkey}}</span>
            <span>{{nowResumeMsg.resumeUpdateTime}}更新</span>
          </div>
          <div class="historyList" id="historyScroll" v-show="historyList.length>0">
            <span v-for="(item,index) in historyList" :key="index">
              {{item.createdAt}}
              <i>&nbsp;&nbsp;&nbsp;{{item.adminInfo}}&nbsp;&nbsp;</i>
              &nbsp;&nbsp;{{item.action}} &nbsp;&nbsp;{{item.desc}}
            </span>
          </div>
        </div>
      </div>
    </div>
    <resume-addtab
      ref="addTab"
      :nowCheckListTab="nowCheckListTab"
      :uid="nowResumeMsg.uid"
      @CallbackDetail="getResume()"
    ></resume-addtab>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import resumeAddtab from '../resumeAddtab/index'
import { uploadApi } from 'API/common'
import {
  addHistory,
  GetResumeHistory,
  GetResumeDetailsAPI,
  delateResume,
  delateLabel,
  saveResume
} from 'API/resumeStore.js'
@Component({
  name: 'resume-popup',
  props: {
    /* 简历ID */
    resumeId: {
      type: String,
      default: ''
    },
    /* 是否需要左右切换，如传入数组，则显示左右箭头，否则只显示当前简历 */
    itemList: {
      type: Array,
      default: () => []
    },
    /* 简历组件显示的tab ,如需补充多余tab 传入typelist同时，html加一个nowCheck */
    typeList: {
      type: Array,
      default: () => ['简历详情', '历史记录']
    }
  },
  components: {
    resumeAddtab
  },
  watch: {}
})
export default class resumePopup extends Vue {
  nowCheck = 0; // 当前点击
  historyList = []; /* 历史记录 */
  // 点击切换
  isShow = false; /* 是否显示简历 */
  delateTab = false;
  visible = false;
  nowCheckListTab = [];
  fileList = [];
  isSales = true; /* 只有超管，客服，顾问能看 */
  haveData = 1;
  nowResumeMsg = {
    resumeLabels: {}
  }; /* 当前简历详情 */
  nowIndex = 0; // 当itemList不为空时，记录当前点击的简历id
  AdminShow = ''; // 权限
  uploadParam = {}; /* 上传参数 */
  headers = {}; /* 上传头部 */
  /* 打开标签组件 */
  addTab () {
    let newTabList = this.nowResumeMsg.resumeLabels.concat()
    this.nowCheckListTab = newTabList
    this.$refs.addTab.showSelect()
    this.$refs.addTab.Tabresumelist()
  }
  // 查看操作
  async operating (uid, param) {
    await addHistory(uid, param)
  }
  created () {
    // this.AdminShow = +sessionStorage.getItem("AdminShow");
    // this.testingAdmin(this.AdminShow);
  }
  testingAdmin (admin) {
    this.isSales = !/(3|4)/.test(admin)
  }
  /* 初始化简历状态 */
  initResume () {
    this.nowResumeMsg.showPhone = false
    this.nowResumeMsg.showWechat = false
    this.nowCheck = 0
  }
  /* 上传文件 */
  UploadImage (param) {
    let name = param.file.name.split('.')[1]
    let type = /(jpg|gif|png|peg|bmp)/.test(name) ? 'img' : 'doc'
    const formData = new FormData()
    formData.append('Authorization', sessionStorage.getItem('adminToken')) //
    formData.append('attach_type', type)
    formData.append('img1', param.file)
    uploadApi(formData)
      .then(res => {
        const resumeAttachId = res.data.data[0].id
        return resumeAttachId
      })
      .then(resumeAttachId => {
        saveResume(this.nowResumeMsg.uid, { resumeAttachId }).then(res => {
          this.getResume()
          this.operating(this.nowResumeMsg.uid, {
            action: '上传',
            desc: '简历附件'
          })
          this.$message({
            message: `${res.data.msg}`
          })
        })
      })
  }
  // 获取简历
  getResume () {
    GetResumeDetailsAPI(this.resumeId).then(res => {
      this.nowResumeMsg = res.data.data
      this.nowResumeMsg.resumeLabels.map(item => (item.delateTab = false))
      this.nowResumeMsg = Object.assign({}, this.nowResumeMsg, {
        showPhone: false,
        showWechat: false
      })
      // console.log(this.itemList);
    })
  }
  delateFile (e) {
    delateResume(e).then(res => {
      this.visible = false
      this.getResume()
      this.operating(this.nowResumeMsg.uid, {
        action: '删除',
        desc: '简历附件'
      })
    })
  }
  beoforeUpload (e) {
    console.log(e)
  }
  // 上传简历f
  uploadFile () {
    console.log('上传简历')
  }
  /* 删除标签 */
  delateLabelBtn (labelId, uid) {
    delateLabel(uid, labelId).then(res => {
      this.$message({
        type: 'success',
        message: '删除成功!'
      })
      this.getResume()
      this.$emit('updata')
    })
  }
  // 左边箭头
  LeftArrow () {
    if (this.nowIndex < 0) {
      this.nowIndex = 0
    } else {
      this.nowIndex = this.nowIndex - 1

      // this.historyCount=1;
      if (this.nowCheck) {
        this.historyCount = 1
        this.history(this.itemList[this.nowIndex].uid, {
          page: this.historyCount,
          count: 20
        })
      }
      this.$emit('SwitchResume', this.itemList[this.nowIndex].uid)
      this.initResume()
      this.operating(this.itemList[this.nowIndex].uid, {
        action: '查看',
        desc: '简历'
      })
    }
  }
  // 右箭头
  rightArrow () {
    if (this.nowIndex === this.itemList.length) {
      this.$message({
        message: '本页数据加载完毕',
        type: 'warning'
      })
    } else {
      this.nowIndex = this.nowIndex + 1
      /* 每次切换简历应将历史记录的页面归为1 */
      if (this.nowCheck === 1) {
        this.historyCount = 1
        this.history(this.itemList[this.nowIndex].uid, {
          page: this.historyCount,
          count: 20
        })
      }
      // this.resumeId = this.itemList[this.nowIndex].uid;
      /* 把下一个uid发回到父组件，并再父组件重新调用查看简历的接口 */
      this.$emit('SwitchResume', this.itemList[this.nowIndex].uid)
      this.initResume()
      this.operating(this.itemList[this.nowIndex].uid, {
        action: '查看',
        desc: '简历'
      })
    }
  }
  // 查看附件
  seeFilesBtn () {
    this.seeFiles(this.nowResumeMsg, this.nowResumeMsg.uid)
  }
  seeFiles (fileObJ, uid) {
    let File = fileObJ.resumeAttach

    if (File === null) {
      this.$message.error('此人未上传简历附件')
    } else {
      let uid = fileObJ.uid
      let type = File.extension
      this.operating(uid, { action: '查看', desc: '简历附件' })
      this.$nextTick(() => {
        if (/(png|jpg)/.test(type)) {
          window.open(File.url)
        } else if (/(pdf)/.test(type)) {
          window.open(File.url)
        } else if (/(doc|docx)/.test(type)) {
          window.open(
            `https://view.officeapps.live.com/op/view.aspx?src=${File.url}`
          )
        } else {
          this.$message({
            message: '格式不支持',
            type: 'warning'
          })
        }
      })
    }
  }
  // 查看手机号码
  seeMobile () {
    let uid = this.nowResumeMsg.uid
    this.operating(uid, { action: '查看', desc: '手机号码' })
    this.nowResumeMsg.showPhone = true
  }
  /* 查看微信号 */
  seeWechat () {
    let uid = this.nowResumeMsg.uid
    this.operating(uid, { action: '查看', desc: '微信号' })
    this.nowResumeMsg.showWechat = true
  }
  // 点击遮罩展开组件
  showMark () {
    this.isShow = true
  }
  // 点击遮罩关闭组件
  closeMark () {
    this.isShow = false
    this.nowIndex = 0
  }
  check (index) {
    this.nowCheck = +index
    this.historyCount = 1
    this.historyList = []
    if (this.nowCheck === 1) {
      this.history(this.nowResumeMsg.uid, {
        page: this.historyCount,
        count: 20
      })
      this.$nextTick(() => {
        const el = document.getElementById('historyScroll')
        el.addEventListener('scroll', this.handleScroll)
      })
    } else if (this.nowCheck === 0) {
      const el = document.getElementById('historyScroll')
      el.removeEventListener('scroll', this.handleScroll)
      this.operating(this.nowResumeMsg.uid, { action: '查看', desc: '简历' })
    }
  }
  handleScroll (e) {
    const el = document.getElementById('historyScroll')
    const offsetHeight = el.offsetHeight
    const scrollTop = el.scrollTop
    const scrollHeight = el.scrollHeight
    if (scrollTop + offsetHeight === scrollHeight) {
      if (this.haveData) {
        GetResumeHistory(this.nowResumeMsg.uid, {
          page: this.historyCount++,
          count: 20
        }).then(res => {
          this.haveData = res.data.meta.haveData
          this.historyList = [...this.historyList, ...res.data.data]
        })
      }

      // this.Tabresumelist();
    }
  }
  // 请求历史记录
  history (uid, form) {
    GetResumeHistory(uid, form).then(res => {
      this.historyList = res.data.data
    })
  }
}
</script>
<style lang='less' scoped>
@import "./resumePopup.less";
</style>
