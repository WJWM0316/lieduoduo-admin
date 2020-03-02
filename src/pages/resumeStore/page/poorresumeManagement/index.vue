<template>
    <div class="resumeStore" @click.stop="closeSubEvent">
      <lyout-content
        :leftcontent="leftcontent"
        :isShowbtn="true && isShowResumeHandle"
        ref="methods"
        @handlePageChange="handlePageChange"
      >
        <div class="formSumbit" slot="formContent">
            <ul class="h24_navigation">
                <template v-for="item in inferiorStatus">
                  <li
                    :class="{active: item.cur}"
                    @click="tabClick(item)">{{item.name}}</li>
                </template>
              </ul>
          <div class="formReasult">
            <el-form ref="form" :model="form" class="form">
                <el-form-item label="入选原因" class="formItem">
                    
                <el-select v-model="form.reasonId" placeholder="请选择">
                    <el-option
                        v-for="item in reasonlist"
                        :key="item.id"
                        :label="item.value"
                        :value="item.id">
                  </el-option>
                </el-select>
                </el-form-item>

                <el-form-item class="time" label="更新时间" label-width="100px">
                    <el-col :span="11">
                      <el-date-picker
                        type="date"
                        placeholder="选择日期"
                        v-model="form.updateTimeLower"
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
                        v-model="form.updateTimeUpper"
                        style="width: 142px;"
                      ></el-date-picker>
                    </el-col>
                  </el-form-item>

              <el-form-item label-width="80px" label="模糊搜索">
                <el-input
                  v-model="form.keyword"
                  placeholder="简历ID/姓名/公司/手机号/求职意向"
                  style="width:250px;"
                ></el-input>
              </el-form-item>
  
              <el-form-item class="time" label="访问时间" label-width="100px">
                <el-col :span="11">
                  <el-date-picker
                    type="date"
                    placeholder="选择日期"
                    v-model="form.visitTimeLower"
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
                    v-model="form.visitTimeUpper"
                    style="width: 142px;"
                  ></el-date-picker>
                </el-col>
              </el-form-item>
              <div class="BtnList">
                <el-button type="primary" @click.stop="onSubmit">查询</el-button>
                <el-button @click.stop="resetForm('form')">重置</el-button>
              </div>
            </el-form>
          </div>
        </div>
  
        <div class="resumeList" id="scroll" slot="dataList">
          <div
            class="resumeItem"
            @click.stop="getDetail(item.uid,index)"
            v-for="(item,index) in itemList"
            :key="index"
          >
            <div class="resumeNumber">
              <div class="resumeNum">
                简历编号: {{item.resumeNum}}
                <span style="margin-left: 20px;" v-if="item.inferiorReason">入选原因: {{item.inferiorReason}}</span>
                <span class="jobStatusDesc" v-if="item.jobStatusDesc!=''" style="margin-left: 20px;">{{item.jobStatusDesc}}</span>
                <span class="resumeUpdateTime">最近更新：{{item.resumeUpdateTime}}</span>
                <span class="lastLoginTime">最近访问：{{item.lastLoginTime}}</span>
              </div>
            </div>
            <div class="resumeContent">
              <div class="userMsg">
  
                <div class="userAvator">
                  <img :src="item.avatar.url" alt v-if="item.avatar" />
                </div>
  
                <div class="userName">
                  <div class="userTop row">
                    <span class="name">{{item.name}}</span>
                    <div class="experience">
                      <span v-if="item.workAge!=''">{{item.workAge}}年工作经验</span>
                      <span v-else>{{item.workAgeDesc}}</span>
                      <span>·</span>
                      <span>{{item.degreeDesc}}</span>
                      <span>·</span>
                      <span>{{item.age}}岁</span>
                    </div>
                  </div>
                  <p
                    class="lastWork"
                    v-show="item.lastCompany!=''"
                  >最近工作: {{item.lastCompany}} · {{item.lastPosition}}</p>
                  <p class="maxEducation">最高学历：{{item.school}} · {{item.degreeDesc}} · {{item.major}}</p>
                </div>
  
                <div class="needWork">
                  <div
                    class="workItem"
                    v-for="(item3,index3) in item.expects"
                    :key="index3"
                    v-show="index3<3"
                  >
                    <span>{{item3.city}}</span>
                    <span>{{item3.position}}</span>
                    <span>{{item3.salaryFloor}}~{{item3.salaryCeil}}k</span>
                    <div class="industry" v-for="(item4,index4) in item3.fields" :key="index4">
                      <span>{{item4.field}}</span>
                      <span v-show="index4!=item3.fields.length-1">&nbsp;</span>
                    </div>
                  </div>
                </div>
                <div class="seeResume">
                <el-button>审核</el-button>
                </div>
  
              </div>
            </div>
            <div class="tabList" v-if="item.resumeLabels.length>0">
              <div class="tabItem" v-for="(tab) in item.resumeLabels" :key="tab.id">
                <span>{{tab.labelName}}</span>
              </div>
            </div>
          </div>
  
          <div
            style="font-size: 14px;color: #000;padding: 30px 0px;"
            class="resumeItem"
            v-if="itemList.length===0"
          >
            <span>暂无数据</span>
          </div>
        </div>
      </lyout-content>
      <!-- 标签展示控件 -->
      <div class="tabSelect" v-if="closeSelectStore">
        <div class="tabContent">
          <div class="TabHeader">
            <span>选择标签</span>
            <i class="el-icon-circle-close" @click.stop="closeSelect"></i>
          </div>
          <div class="Selecting">
            <p class="selectNums">已选择 ({{nowCheckListTab.length}}/15)</p>
            <div class="successSelectList" id="successSelectList" style="overflow:auto">
              <div
                :class="['common',item.status?'itemfocus':'nofocus']"
                v-for="(item,index) in nowCheckListTab"
                :key="index"
                @click.stop="choiceTab(index)"
              >
                <span>{{item.name}}</span>
                <i class="el-icon-circle-close" style="color:#652791" @click.stop="delateTab(index)"></i>
              </div>
            </div>
          </div>
          <div class="Selecting">
            <p class="selectNums">标签库</p>
            <div class="successSelectList" id="TabStore">
              <div
                v-for="(item,index) in tabList"
                :key="index"
                :class="['common',item.status?'itemfocus':'nofocus']"
                @click.stop="choiceTab(index)"
              >
                <span>{{item.name}}</span>
              </div>
            </div>
          </div>
          <div class="resumeTabBtn">
            <el-button type="primary" @click="checkTab()">确定</el-button>
            <el-button @click.stop="closeSelectStore=false">取消</el-button>
          </div>
        </div>
      </div>
      <!-- 简历详情 -->
      <resume-popup
        :resumeId="resumeId"
        :typeList="typeList"
        :itemList="itemList"
        @SwitchResume="SwitchResume"
        @updata="getData"
        ref="resume"
      ></resume-popup>
      <!-- 检测是否有简历 -->
      <el-dialog :title="'验证手机号码'" :visible.sync="dialogVisible" width="30%" center>
        <el-form
          :validate-on-rule-change="startrules"
          :model="canform"
          :rules="rules"
          ref="form"
          class="demo-ruleForm"
        >
          <el-form-item label-width="80px" prop="mobile" label="手机号码" class="formItem">
            <el-input v-model="canform.mobile" placeholder="请输入手机号码"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="checkMobile('form')" class="inquire">下一步</el-button>
        </span>
      </el-dialog>
    </div>
  </template>
  
  <script>
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import lyoutContent from 'COMPONENTS/LayoutWrapper/content.vue'
  import resumePopup from 'COMPONENTS/resumePopup/resumePopup'
  import CustomSelect from '../../components/CustomSelect/index.vue'
  import filterAnswer from 'COMPONENTS/filterAnswer/index.vue'
  import { getLabelPositionListApi } from 'API/position'
  import { GetInferiorResumeAPI, GetInferiorAllreasonAPI, GetInferiorAuditreasonsAPI } from 'API/inferiorResume'
  import { getCityApi } from 'API/company'
  import { fieldApi } from 'API/common'
  import {
    GetResumeAPI,
    degreeListAPI,
    jobhuntStatusAPI,
    GetResumeHistory,
    addHistory,
    resumelist,
    haveMobile,
    getResumeLevelApi,
    setResumeLevelApi
  } from 'API/resumeStore.js'
  import { getAccessToken } from 'API/cacheService'
  import { API_ROOT } from 'API/index.js'
  
  let canPush = 0 /* 0 规定 1 跳转注册页 2 去新建微简历 */
  let Sumbitform = {
    name: '',
    gender: '',
    uid: '',
    mobile: ''
  }
  
  @Component({
    name: 'resumeStore',
    components: {
      lyoutContent,
      CustomSelect,
      resumePopup,
      filterAnswer
    },
    watch: {
      '$route': {
        handler () {
          this.isShowResumeHandle = sessionStorage.getItem('isShowResumeHandle') !== 'false'
        },
        immediate: true
      }
    }
  })
  export default class resumeStore extends Vue {
    canDownloadData = true
    AdminShow = true
    startrules = false;
    nowCheckListTab = []; /* 添加标签数组 */
    inferiorStatus = [{name: '待审核', cur: true, id: 1}, {name: '申诉简历', cur: false, id: 2}, {name: '待劣质简历审核', cur: false, id: 3}]
    dialogVisible = false;
    closeSelectStore = false;
    diyTabName = ''; /* 自定义标签名 */
    resumeLevel = []
    needWorkProps = {
      value: 'labelId',
      label: 'name',
      children: 'children'
    };
    labelStorePage = {
      page: 1,
      count: 100,
      haveData: 1 /* 总页数 */
    };
    typeList = ['简历详情', '历史记录'];
    resumeId = ''; /* 简历详情id */
    leftcontent = {
      total: 0,
      title: '劣质简历管理',
      lastPage: '',
      page: 1 // 当前显示页
    };
    canform = Sumbitform;
    validate_mobile = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入手机号码'))
      } else if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(value)) {
        callback(new Error('请输入正确的手机号码'))
      } else {
        haveMobile(value).then(res => {
          if (!res.data.data.userExist) {
            canPush = 1
            callback(new Error('该用户不存在，请去创建用户'))
          } else {
            canPush = 2
            Sumbitform = {
              uid: res.data.data.cardInfo.uid,
              gender: res.data.data.cardInfo.gender,
              name: res.data.data.cardInfo.name,
              mobile: value
            }
            callback()
          }
        })
      }
    };
    rules = {
      mobile: [
        {
          required: true,
          validator: this.validate_mobile,
          trigger: ['blur', 'change']
        }
      ]
    };
    closelift = false; /* 工作经验 */
    /* 简历来源 */
    Completion = [
      {
        labelId: '0',
        value: '不限条件'
      },
      {
        labelId: '1',
        value: '全部条件'
      },
      {
        labelId: 'completeExpect',
        value: '求职意向'
      },
      {
        labelId: 'completeCareer',
        value: '工作经历'
      },
      {
        labelId: 'completeEducation',
        value: '教育经历'
      },
      {
        labelId: 'completeProject',
        value: '项目经历'
      },
      {
        labelId: 'completeMoreIntro',
        value: '更多介绍'
      },
      {
        labelId: 'completeResumeAttach',
        value: '附件简历'
      }
    ];
    /* isSection 表示是否有价格区间 */
    workLiftList = [
      {
        text: '不限',
        isSection: false
      },
      {
        text: '无经验',
        isSection: false
      },
      {
        min: '3',
        max: '5',
        text: '3-5',
        isSection: true
      }
    ];
    AgeList = [
      {
        text: '不限',
        isSection: false
      },
      {
        min: '20',
        max: '25',
        text: '20-25',
        isSection: true
      },
      {
        min: '25',
        max: '30',
        text: '25-30',
        isSection: true
      },
      {
        min: '30',
        max: '35',
        text: '30-35',
        isSection: true
      }
    ];
    MoneyList = [
      {
        text: '不限',
        isSection: false
      },
      {
        min: '3',
        max: '5',
        text: '3K-5K',
        isSection: true
      },
      {
        min: '5',
        max: '8',
        text: '5K-8K',
        isSection: true
      },
      {
        min: '8',
        max: '12',
        text: '8K-12K',
        isSection: true
      }
    ];
    searchType = {
      commonKey1: 'expectPosition'
    };
    isShowSearch = true; // 显示搜索区域
    nowResumeMsg = {
      moreIntroduce: {
        introduce: ''
      }
    }; /* 简历详情 */
    comexpectFieldId = '';
    searchList = []; /* 简历标签 */
    fieldList = []; /* 期望行业 */
    options = []; // 期待职位信息
    itemList = []; // 简历数组
    historyList = []; // 历史记录数组
    degreeList = []; // 学历列表
    getCityList = []; // 省市列表
    jobhuntStatusList = []; // 求职状态
    reasonlist = []
    form = {
      keyword: '' /* 模糊搜索 */,
      inferiorStatus: 1,
      reasonId: 0,
      name: '',
      updateTimeLower: '' /* 简历更新时间下限 */,
      updateTimeUpper: '' /* 简历更新时间上限  */,
      visitTimeLower: '' /* 最近访问时间下限 */,
      visitTimeUpper: '' /* 最近访问时间上限 */,
      count: 20, // 每页条数
      page: 1
    };
    tabList = []; /* 标签栏 */
    isSales = 0; /* 权限字段 */
    historyCount = 1;
    nowCheck = 0; // 当前点击详情上方的tab
    nowIndex = ''; // 当前点击的简历索引
    isShowbtn = false;
    isShow = false; // 展示简历详情
    closeWork = false; /* 关闭工作经验弹框 */
    CompletionDisabled = false;
    TabShow = true;
    isShowResumeHandle = true // 是否展示简历编辑添加按钮
    /* 完整度 */
    CompletionCheck (e) {
      /* 不限条件 0  全部条件1 */
      let isAll = e.includes('1')
      let empty = e.includes('0')
      if (empty || isAll) {
        this.CompletionDisabled = true
      }
    }
    closeSelect () {
      this.closeSelectStore = false
      const el = document.getElementById('TabStore')
      el.removeEventListener('scroll', this.handleScroll)
    }
  
    createResume () {
      this.dialogVisible = true
      this.canform.mobile = ''
    }
  
    createResume2 () {
      this.$router.push({
        path: '/resumeStore/list/postResume',
        query: {
          isEdit: 0
        }
      })
    }
    getResumeLevel () {
      return getResumeLevelApi().then(res => (this.resumeLevel = res.data.data))
    }
    editResume (item) {
      this.$router.push({
        path: '/resumeStore/list/postResume',
        query: {
          isEdit: 1,
          userInfo: JSON.stringify({
            uid: item.uid
          })
        }
      })
    }
  
    checkMobile (form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          if (canPush === 2) {
            this.dialogVisible = false
            this.$router.push({
              // path: "/resumeStore/list/createNewResume",
              path: '/resumeStore/list/postResume',
              query: {
                isEdit: 0,
                userInfo: JSON.stringify(Sumbitform)
              }
            })
          }
        } else {
          if (canPush) {
            sessionStorage.setItem('up_router', this.$route.path)
            this.$nextTick(() => {
              this.$router.push({
                path: '/user/addUser',
                query: {
                  create_resume: true,
                  resumetype: 2
                }
              })
            })
            this.dialogVisible = false
          }
          return false
        }
      })
    }
    handleScroll (e, event) {
      const el = document.getElementById('TabStore')
      const offsetHeight = el.offsetHeight
      const scrollTop = el.scrollTop
      const scrollHeight = el.scrollHeight
      if (scrollTop + offsetHeight === scrollHeight) {
        this.Tabresumelist()
      }
    }
    addTab () {
      let nowCheckList = this.nowCheckListTab.concat()
      this.nowCheckListTab = nowCheckList
      this.closeSelectStore = true
      this.Tabresumelist()
      this.$nextTick(() => {
        const el = document.getElementById('TabStore')
        el.addEventListener('scroll', this.handleScroll)
      })
    }
    /* 标签库 */
    Tabresumelist () {
      if (this.labelStorePage.haveData) {
        resumelist({ count: 100, page: this.labelStorePage.page++ }).then(res => {
          this.tabList = [...this.tabList, ...res.data.data]
          this.labelStorePage.haveData = res.data.meta.haveData
          let isStatus = this.nowCheckListTab.map(item => item.id)
          this.tabList.map(item =>
            item.id === isStatus.includes(item.id)
          )
        })
      }
    }
    /* 删除已选择的标签 */
    delateTab (index) {
      this.resetStoreStatus(index)
      this.nowCheckListTab.splice(index, 1)
    }
    /* 重置标签库 */
    resetStoreStatus (index) {
      for (let i = 0; i < this.tabList.length; i++) {
        if (this.nowCheckListTab[index].id === this.tabList[i].id) {
          this.tabList[i].status = false
        }
      }
    }
  
    /* 点击确认 */
    checkTab () {
      this.searchList = this.nowCheckListTab
      this.form.resumeLabelIds = this.nowCheckListTab
        .map(item => item.id)
        .join(',')
      this.closeSelectStore = false
    }
    /* 选择标签 */
    choiceTab (index) {
      let isCheck = this.nowCheckListTab.filter(
        item => item.name === this.tabList[index].name
      )
      if (isCheck.length > 0) return
      if (this.nowCheckListTab.length >= 15) return
      if (!this.tabList[index].status) {
        let param = {
          status: !this.tabList[index].status,
          name: this.tabList[index].name,
          id: this.tabList[index].id
        }
        this.$nextTick(() => {
          this.tabList[index].status = true
          this.nowCheckListTab.push(param)
        })
      } else {
        this.$nextTick(() => {
          this.tabList[index].status = false
        })
      }
    }
  
    // 时间选择器
    TimeResult (e) {
      /* workExpLower 最小年限 workExpUpper 最大 */
      let { isStudent, min, max } = e
      this.form.isStudent = isStudent === undefined ? '' : isStudent
      this.form.workExpLower = min === undefined ? '' : min
      this.form.workExpUpper = max === undefined ? '' : max
      this.$refs['diywork'].checkTime = e.value
      this.$refs['diywork'].closeSelect()
    }
    MoneyChoice (e) {
      let { isStudent, min, max } = e
      this.form.isStudent = isStudent === undefined ? '' : isStudent
      this.form.salaryLower = min === undefined ? '' : min
      this.form.salaryUpper = max === undefined ? '' : max
      this.$refs['Money'].checkTime = e.value
      this.$refs['Money'].closeSelect()
    }
    AgeChoice (e) {
      let { isStudent, min, max } = e
      this.form.isStudent = isStudent === undefined ? '' : isStudent
      this.form.ageLower = min === undefined ? '' : min
      this.form.ageUpper = max === undefined ? '' : max
      this.$refs['age'].checkTime = e.value
      this.$refs['age'].closeSelect()
    }
  
    /* 手动关闭事件 */
    closeSubEvent () {
      this.closelift = false
      this.$refs['diywork'].closeSelect()
      this.$refs['Money'].closeSelect()
      this.$refs['age'].closeSelect()
    }
    checkType (e) {
      this.form[`${e}`] = ''
    }
    delateSearch (index) {
      this.searchList.splice(index, 1)
      this.nowCheckListTab = this.searchList
      this.form.resumeLabelIds = this.nowCheckListTab
        .map(item => item.id)
        .join(',')
    }
    /* 清除列表选项 */
    resetForm (name) {
      this.form.completeExpect = 0
      this.form.completeCareer = 0
      this.form.completeEducation = 0
      this.form.completeProject = 0
      this.form.completeMoreIntro = 0
      this.form.completeResumeAttach = 0
      this.$refs[name].resetFields()
      this.form.page = 1
      for (let key in this.form) {
        this.form[key] = null
      }
      this.comexpectFieldId = []
      this.searchList = []
      this.form.expectFieldId = ''
      this.form.keyword = ''
      this.form.reasonId = 0
      this.form.isStudent = ''
      this.form.workExpLower = ''
      this.form.workExpUpper = ''
      this.form.expectCityNum = ''
      this.form.updateTimeUpper = ''
      this.form.visitTimeUpper = ''
      this.form.page = 1
      this.$nextTick(() => {
        let obj = {}
        obj.stopPropagation = () => {}
      })
    }
    // 查看操作
    async operating (uid, param) {
      await addHistory(uid, param)
    }
    type (e) {
      this.form.expectPositionId = e[e.length - 1]
    }
    choiceCity (e) {
      this.form.expectCityNum = e[e.length - 1]
    }
    // 查询按钮
    onSubmit () {
      if ((this.form.updateTimeLower && !this.form.updateTimeUpper) || (!this.form.updateTimeLower && this.form.updateTimeUpper)) {
        this.$message({ message: '更新时间必需选择区间时间', type: 'warning' })
        return
      }
      if ((this.form.visitTimeLower && !this.form.visitTimeUpper) || (!this.form.visitTimeLower && this.form.visitTimeUpper)) {
        this.$message({ message: '访问时间必需选择区间时间', type: 'warning' })
        return
      }
      this.form.page = 1
      this.getData()
    }
    // 请求历史记录
    history (uid, form) {
      GetResumeHistory(uid, form).then(res => {
        this.historyList = res.data.data
      })
    }
    // 点击切换
    check (index) {
      this.nowCheck = +index
      this.historyCount = 1
      this.historyList = []
      if (this.nowCheck === 1) {
        this.history(this.nowResumeMsg.uid, {
          page: this.historyCount,
          count: 20
        })
      } else if (this.nowCheck === 0) {
        this.operating(this.nowResumeMsg.uid, {
          action: '查看',
          desc: '简历附件'
        })
      }
    }
    tabClick (data) {
        this.form.inferiorStatus = data.id
        this.inferiorStatus.map((v, k) => {
            v.cur = data === v
        })
        this.onSubmit()
    }
    getAllreason () {
        GetInferiorAllreasonAPI().then((res) => {
            this.reasonlist = res.data.data
        })
    }
    getAuditreasons () {
        GetInferiorAuditreasonsAPI().then((res) => {
            console.log(res)
        })
    }
    created () {
        this.getAllreason()
        this.getAuditreasons()
      let AdminShow = Number(+sessionStorage.getItem('AdminShow'))
      this.ManageList().then(() => {
        this.degreeData()
        this.jobhuntStatus()
        this.CityData()
        this.getData()
        this.field()
        this.getResumeLevel()
      })
      this.isSales = !/(3|4)/.test(AdminShow)
      this.AdminShow = AdminShow
    }
    field () {
      fieldApi().then(res => (this.fieldList = res.data.data))
    }
    CityData () {
      getCityApi().then(res => {
        this.getCityList = res.data.data
        this.getCityList.forEach(item => {
          item.children.forEach(item1 => {
            let result = JSON.stringify(item1.children)
            if (result === '[]') delete item1.children
          })
        })
      })
    }
    // 期待职位
    ManageList () {
      return getLabelPositionListApi().then(res => {
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
    jobhuntStatus () {
      jobhuntStatusAPI().then(res => {
        this.jobhuntStatusList = res.data.data
      })
    }
    /* 查看简历附件 */
    seereResume (index) {
      let AdminShow = +sessionStorage.getItem('AdminShow')
      AdminShow = !/(3|4)/.test(AdminShow)
      if (!AdminShow) {
        this.$message({
          message: '暂无权限',
          type: 'warning'
        })
        return
      }
      let uid = this.itemList[index].uid
      this.seeFiles(this.itemList[index], uid)
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
    // 学历列表
    degreeData () {
      degreeListAPI().then(res => {
        this.degreeList = res.data.data
      })
    }
  
    getDetail (uid, index) {
      this.resumeId = String(uid)
      this.showArrow = true
      this.nowIndex = index
      this.$nextTick(() => {
        let AdminShow = +sessionStorage.getItem('AdminShow')
        this.$refs['resume'].testingAdmin(AdminShow)
        this.$refs['resume'].getResume()
        this.$refs['resume'].showMark()
        this.$refs['resume'].initResume()
        this.$refs['resume'].nowIndex = index
        this.$refs['resume'].operating(uid, {
          action: '查看',
          desc: '简历'
        })
      })
    }
    /* 切换简历 */
    SwitchResume (e) {
      this.resumeId = String(e)
      this.$nextTick(() => {
        this.$refs['resume'].getResume()
      })
    }
    getData () {
      let params1 = {
        page: this.form.page,
        count: 20
      }
      if(this.form.keyword) {
        params1 = Object.assign(params1, {keyword: this.form.keyword})
      }
      if(this.form.name) {
        params1 = Object.assign(params1, {name: this.form.name})
      }
      if(this.form.salaryLower) {
        params1 = Object.assign(params1, {salaryLower: this.form.salaryLower})
      }
      if(this.form.salaryUpper) {
        params1 = Object.assign(params1, {salaryUpper: this.form.salaryUpper})
      }
      if(this.form.ageLower) {
        params1 = Object.assign(params1, {ageLower: this.form.ageLower})
      }
      if(this.form.ageUpper) {
        params1 = Object.assign(params1, {ageUpper: this.form.ageUpper})
      }
      if(this.form.wherefrom) {
        params1 = Object.assign(params1, {wherefrom: this.form.wherefrom})
      }
      if(this.form.resumeLabel) {
        params1 = Object.assign(params1, {resumeLabel: this.form.resumeLabel})
      }
      if(this.form.resumeGrades) {
        params1 = Object.assign(params1, {resumeGrades: this.form.resumeGrades})
      }
      if(this.form.workExpLower) {
        params1 = Object.assign(params1, {workExpLower: this.form.workExpLower})
      }
      if(this.form.workExpUpper) {
        params1 = Object.assign(params1, {workExpUpper: this.form.workExpUpper})
      }
      if(this.comexpectFieldId.length) {
        params1 = Object.assign(params1, {expectFieldId: this.comexpectFieldId.join(',')})
      }
      if(this.form.reasonId) {
        params1 = Object.assign(params1, {reasonId: this.form.reasonId})
      }
      if(this.form.inferiorStatus) {
        params1 = Object.assign(params1, {inferiorStatus: this.form.inferiorStatus})
      }
      if ((this.form.createTimeUpper && !this.form.createTimeLower) || (!this.form.createTimeUpper && this.form.createTimeLower)) {
        this.$message({ message: '必须选择一个创建时间区间', type: 'warning' })
        return
      } else {
        if (this.form.createTimeUpper && this.form.createTimeLower) {
          params1 = Object.assign(params1, { createTimeUpper: this.form.createTimeUpper, createTimeLower: this.form.createTimeLower })
        }
      }
      if ((this.form.updateTimeLower && !this.form.updateTimeUpper) || (!this.form.updateTimeLower && this.form.updateTimeUpper)) {
        this.$message({ message: '必须选择一个更新时间区间', type: 'warning' })
        return
      } else {
        if (this.form.updateTimeLower && this.form.updateTimeUpper) {
          params1 = Object.assign(params1, { updateTimeLower: this.form.updateTimeLower, updateTimeUpper: this.form.updateTimeUpper })
        }
      }
      if ((this.form.visitTimeLower && !this.form.visitTimeUpper) || (!this.form.visitTimeLower && this.form.visitTimeUpper)) {
        this.$message({ message: '必须选择一个访问时间区间', type: 'warning' })
        return
      } else {
        if (this.form.visitTimeLower && this.form.visitTimeUpper) {
          params1 = Object.assign(params1, { visitTimeLower: this.form.visitTimeLower, visitTimeUpper: this.form.visitTimeUpper })
        }
      }
      if(this.form.completeExpect) {
        params1 = Object.assign(params1, {completeExpect: this.form.completeExpect})
      }
      if(this.form.completeCareer) {
        params1 = Object.assign(params1, {completeCareer: this.form.completeCareer})
      }
      if(this.form.completeEducation) {
        params1 = Object.assign(params1, {completeEducation: this.form.completeEducation})
      }
      if(this.form.completeProject) {
        params1 = Object.assign(params1, {completeProject: this.form.completeProject})
      }
      if(this.form.completeMoreIntro) {
        params1 = Object.assign(params1, {completeMoreIntro: this.form.completeMoreIntro})
      }
      if(this.form.completeResumeAttach) {
        params1 = Object.assign(params1, {completeResumeAttach: this.form.completeResumeAttach})
      }
      if (params1.resumeGrades === '') delete params.resumeGrades
      GetInferiorResumeAPI(params1).then(res => {
        console.log(res.data.data)
        this.itemList = res.data.data
        this.leftcontent.total = parseInt(res.data.meta.total)
        this.leftcontent.lastPage = parseInt(res.data.meta.lastPage)
      })
    }
    // 翻页
    /* 翻页 */
    handlePageChange (nowPage) {
      this.$refs['methods'].scrollZero()
      this.form.page = nowPage
      this.form.page = nowPage
      this.getData()
      console.log(nowPage)
    }
    changeGrade (e, uid) {
      setResumeLevelApi({ grade: e, uid })
    }
  }
  </script>
  
  <style scoped lang="less">
  @import "./index.less";
  </style>
  