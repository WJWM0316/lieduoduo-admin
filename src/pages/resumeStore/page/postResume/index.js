import Vue from "vue"
import Component from "vue-class-component"
import {
  upload_api
} from '@/api/index.js'
import {
  jobhuntStatusAPI,
  createOrder,
  searchId,
  degreeListAPI,
  createResume,
  GetResumeDetailsAPI,
  haveMobile
} from "API/resumeStore"
import { 
  deleteExpectApi, deleteCareerApi, deleteProjectApi, deleteEducationApi,
  putExpectApi, putEducationApi, putProjectApi, putCareerApi,
  setLabelsApi, setEducationApi, setProjectApi, setBaseInfoApi, setIntroduceApi, setAttachResumeApi, setExpectApi, setCareerApi } from "API/resume"
import { professionalSkillsApi, getLabelPositionListApi } from "API/position"
import { getCityApi } from "API/company"
import { fieldApi, uploadApi } from "API/commont"
import { getAccessToken } from "API/cacheService"
import ImageUploader from '@/components/imageUploader'
const packjson = require("../../../../../package.json")
let canPush = 0 /* 0 规定 1 跳转注册页 2 去新建微简历 */
let Sumbitform = {
  name: "",
  gender: "",
  mobile: ""
}
@Component({
  name: "PostResume",
  components: {
    ImageUploader
  },
  filters: {
    getJobStatus (res) {
      console.log(res)
      switch(res){
        case 1:
          return '在职暂不考虑'
          break
        case 2:
          return '离职随时到岗'
          break
        case 3:
          return '在职月内到岗'
          break
        case 4:
          return '在职考虑机会'
          break
        default:
          return '在职暂不考虑'
      }
    }
  },
  computed: {
  }
})
export default class PostResume extends Vue {
  checkMobileVal = "" /* 校验手机号码 */
  uploadApi = ""
  isFocus = false
  dialogVisible = false
  fileList = []
  canform = Sumbitform

  /* 提示语 */
  nowUserMsg = {} /* 当前操作的用户数据 */
  closeModel = false
  autoUpload = false
  showClose = false
  isCreate = 0
  fieldList = [] /* 行业领域 */
  isShowForm = false
  minSalary = [] /* 最小薪资 */
  maxSalary = [] /* 最大薪资 */
  isShowmsg = false
  getCityList = [] //省市列表
  headers = {}
  form = {
    mobile: "" /* 手机号 */,
  }

  rules = {
    name: [{ required: true, message: '请输入姓名', trigger: "blur" }],
    mobile: [{ required: true, message: "请输入手机号码", trigger: "blur" }],
    gender: [{ required: true, message: "请选择性别", trigger: "change" }],
    birth: [{ required: true, message: "出生年月不能为空", trigger: "blur" }],
    jobStatus: [{ required: true,message: "请选择求职状态",trigger: "change" }],
    startWorkYear: [{ required: true, message: "请输入工作时间", trigger: "blur" }],

    cityNum: [
      { required: true, message: "请选择你期望的城市", trigger: "blur" }
    ],
    positionId: [
      { required: true, message: "请选择期望的职位", trigger: "blur" }
    ],
    salaryCeil: [
      {
        type: "date",
        required: true,
        message: "请选择期望的最高月薪",
        trigger: "blur"
      }
    ],
    salaryFloor: [
      { required: true, message: "请选择期望的最低月薪", trigger: "blur" }
    ],
    fieldIds: [
      { required: true, message: "请选择你期望的领域", trigger: "blur" }
    ],
    company: [{ required: true, message: '请输入公司名称', trigger: "blur" }],
    positionTypeId: [{ required: true, message: '请选择职位类别', trigger: "blur" }],
    position: [{ required: true, message: '请输入职位名称', trigger: "blur" }],
    startTime: [{ required: true, message: '请选择开始时间', trigger: "blur" }],
    duty: [{ required: true, message: '请输入工作内容', trigger: "blur" }],
  }
  rules5 = {
    name: [{ required: true, message: '请输入项目名称', trigger: "blur" }],
    role: [{ required: true, message: '请填写担任角色', trigger: "blur" }],
    position: [{ required: true, message: '请输入职位名称', trigger: "blur" }],
    startTime: [{ required: true, message: '请选择开始时间', trigger: "blur" }],
    description: [{ required: true, message: '请填写项目描述', trigger: "blur" }],
  }
  rules6 = {
    school: [{ required: true, message: '请输入学校名称', trigger: "blur" }],
    degree: [{ required: true, message: '请选择学历', trigger: "blur" }],
    major: [{ required: true, message: '请输入专业名称', trigger: "blur" }],
    startTime: [{ required: true, message: '请选择开始时间', trigger: "blur" }],
  }
  options = []
  title = '创建简历'
  iconUploader = {
    point: '',
    src:"",
    width: 100,
    height: 100,
    tips: '建议尺寸280X158px，JPG、PNG格式，图片小于5M。'
  }
  imageUpload = {
    list: [],
    limit: 20,
    accept: '.png,.jpg',
    tips: 'JPG、PNG格式，最多可上传9张',
    params: {
      'Authorization-Admin': getAccessToken(),
      attach_type: 'img',
    }
  }
  headicon = ''
  uid = null   // 求职者uid
  editMsg = {}
  handleStatus = ''  // add edit 
  // form1
    jobhuntStatus = [] // 求职状态
    isEditForm1 = false
    formValue1 = {
       avatar: '',        
       name: '',          
       gender: '1',        
       birth: '',        
       startWorkYear: '', 
       jobStatus: '',     
       mobile: '',        
       wechat: '',       
       signature: ''      
    }
    form1 = {
       avatar: '',        // 头像附件id
       name: '',          // 姓名
       gender: '1',        // 性别 0未知 1男 2女
       birth: '',         // 出生年月
       startWorkYear: '', // 参加工作时间（时间戳
       jobStatus: '',     // 求职状态。 在职暂不考虑1，离职随时到岗2，在职月内到岗3，在职考虑机会4
       mobile: '',        // 手机号
       wechat: '',        // 微信号
       signature: ''      // 个性签名
    }
  // form2
    professionalSkillsList = [] //职业技能列表
    professionalLiteracyList = []
    optionsSkills = []
    isEditForm2 = false
    form2 = {
      literacyLabels: [],   //职业素养
      skillLabels: [],   //职业技能
      lifeLabels: [],   //生活标签
    }
  // form3
    isEditForm3 = false
    form3cityNum = []
    form3positionId = []
    form3 = {
      cityNum: '',     // 期望城市，城市编号
      positionId: '',     // 期望职位id
      salaryCeil: '',
      salaryFloor: '',
      fieldIds: '',    //期望领域ids，逗号分隔
    }
  // form4
    isEditForm4 = false
    form4 = {
      company: '',     // 公司名称
      positionTypeId: '',     // 职位id
      position: '',    // 职位名称
      startTime: '',
      endTime: '',    //期望领域ids，逗号分隔
      duty: '',        // 工作内容
      labelIds: '',    // 技能标签ids，多个id以逗号分隔
    }
   // form5
    isEditForm5 = false
    form5 = {
      name: '',     // 项目名称
      role: '',     // 担任角色
      startTime: '',//开始时间
      endTime: '',    
      description: '',        // 项目描述
      link: '',    // 项目链接
    }
  // form6
    isEditForm6 = false
    degreeList = []    // 学历
    form6 = {
      school: '',        // 学校
      degree: '',          // 学历，初中及以下5，中专/中技10，高中15，大专20，本科25，硕士30，博士35，默认为本科
      major: '',        // 专业
      startTime: '',         // 开始时间
      endTime: '',         // 结束时间
      experience: '',     // 在校经历
    }
  // form7
    isEditForm7 = false
    introImgList = []
    form7 = {
      introduce: '',     // 介绍文本
      attachIds: '',     // 图片附件ids，多个id以逗号分隔
    }
   // form8
    isEditForm8 = false
    form8 = {
      attach_resume: '',     // 介绍文本
      attach_name: '',     // 图片附件ids，多个id以逗号分隔
    }
  created() {
    let query = this.$route.query
    query.userInfo = JSON.parse(this.$route.query.userInfo)
    this.form1.mobile = query.userInfo.mobile
    this.uid = query.userInfo.uid
    this.form1.gender = String(query.userInfo.gender);
    this.form1.name = query.userInfo.name

    this.title = query.isEdit ? '编辑简历' : '创建简历'
    if (query.isEdit) {
      this.editInit()
    } else {
      this.addInit()
    }
    // /label/professionalSkills
    this.getResumeDetails()
    this.salary()
    this.getField()
    this.getCityData()
    this.manageList()
    this.getJobhuntStatus()
    this.getDegreeList()
    this.getProfessionalSkills()
  }
  time(time) {
    var date = new Date(time + 8 * 3600 * 1000)
    return date.toJSON().substr(0, 10).replace('T', ' ')
  }
  addInit () {
  }

  editInit () {
  }

  getResumeDetails() {
    GetResumeDetailsAPI(this.uid).then(res => {
      console.log(res.data.data)
      this.editMsg = res.data.data
    })
  }
  // 添加类型
  addBlock (type) {
    if(this.handleStatus === 'add') return
    if (type) {
      this.handleStatus = 'add'
      let name = `isEditForm${type}`
      this[name] = true
    }
  }

  handleCancle (type) {
    let name = `isEditForm${type}`
    this.handleStatus = ''
    this[name] = false
  }

  // 点击提交
  handleSubmit (type) {
    let name = `form${type}`
    this.$refs[name].validate(valid => {
      if (valid) {
        this.saveInfo(type)
      } else {}
    })
  }

  /**
   * 保存课程
   */
  async saveInfo (type) {
    type = String(type)
    console.log(type)
    try {
      const params = this.transformData(type)
      if (type === '1') {
        await setBaseInfoApi(params)
      } else if (type === '2') {
        await setLabelsApi(params)
      } else if (type === '3') {
        if(this.handleStatus === 'add') await setExpectApi(params)
        else await putExpectApi(params)
      } else if (type === '4') {
        if(this.handleStatus === 'add') await setCareerApi(params)
        else await putCareerApi(params)
      } else if (type === '5') {
        if(this.handleStatus === 'add') await setProjectApi(params)
        else await putProjectApi(params)
      } else if (type === '6') {
        if(this.handleStatus === 'add') await setEducationApi(params)
        else await putEducationApi(params)
      } else if (type === '7') {
        await setIntroduceApi(params)
      } else if (type === '8') {
        await setAttachResumeApi(params)
      }
      this.$message.success('添加成功')
      this.handleStatus = ''
      this[`isEditForm${type}`] = false
      this.getResumeDetails()

      // this.$router.go(-1)
    } catch (e) {
    console.log(e)
      this.$message.error(e.msg)
    } finally {
    }
  }

  setEdit (type, item) {
    if (this.handleStatus !== '') return 
    let name = `isEditForm${type}`
    this.handleStatus = 'edit'
    this[name] = true

    if (type === 3 || type === 4 || type === 5 || type === 6) {
      this[`form${type}`].id = item.id
    } 

    if(type === 1) {
      this[`form${type}`].mobile = this.editMsg.mobile
      this[`form${type}`].name = this.editMsg.name
      this[`form${type}`].gender = String(this.editMsg.gender)
      this[`form${type}`].startWorkYear = this.editMsg.startWorkYear
      this[`form${type}`].jobStatus = this.editMsg.jobStatus
      this[`form${type}`].wechat = this.editMsg.wechat
      this[`form${type}`].signature = this.editMsg.signature
      this[`form${type}`].birth = this.editMsg.birth
      this.iconUploader.src = this.editMsg.avatar.smallUrl
      this[`form${type}`].avatar = this.editMsg.avatar.id
    }

    if(type === 3) {
      this[`form${type}`].salaryCeil = item.salaryCeil
      this[`form${type}`].salaryFloor = item.salaryFloor
      // this[`form${type}`].fieldIds = item.fieldIds[0]
      this[`form${type}`].cityNum = [item.provinceNum,item.cityNum]
      this[`form${type}`].positionId = [item.fieldIds[0],item.positionId]
    }

    if(type === 4) {
      this[`form${type}`].company = item.company
      this[`form${type}`].positionTypeId = [item.positionTypeTopPid,item.positionTypePid,item.positionTypeId]
      this[`form${type}`].startTime = item.startTime
      this[`form${type}`].endTime = item.endTime
      this[`form${type}`].position = item.position
      this[`form${type}`].duty = item.duty
      this[`form${type}`].labelIds = item.technicalLabelIds.map(item => {
        return parseInt(item)
      })
    }

    if(type === 5) {
      this[`form${type}`].school = item.school
      this[`form${type}`].degree = item.degree
      this[`form${type}`].startTime = item.startTime
      this[`form${type}`].endTime = item.endTime
      this[`form${type}`].major = item.major
      this[`form${type}`].experience = item.experience
    }

    if(type === 6) {
      this[`form${type}`].school = item.school
      this[`form${type}`].degree = item.degree
      this[`form${type}`].startTime = item.startTime
      this[`form${type}`].endTime = item.endTime
      this[`form${type}`].major = item.major
      this[`form${type}`].experience = item.experience
    }
    if(type === 7) {
      this[`form${type}`].introduce = this.editMsg.moreIntroduce.introduce
      this.introImgList = this.editMsg.moreIntroduce.imgs.map((item,index) => {
        return {
          ...item
        }
      })

      console.log(this.introImgList)
    }

    // this set value
  }

  async setDelete (type, item) {
    if (this.handleStatus !== '') return
    try {
      if (type === '3') {
        await deleteExpectApi({
          uid: this.uid,
          id: item.id
        })
      } else if (type === '4') {
        await deleteCareerApi({
          uid: this.uid,
          id: item.id
        })
      } else if (type === '5') {
        await deleteProjectApi({
          uid: this.uid,
          id: item.id
        })
      } else if (type === '6') {
        await deleteEducationApi({
          uid: this.uid,
          id: item.id
        })
      }
      this.$message.success('删除成功')
      this.handleStatus = ''
      this[`isEditForm${type}`] = false
      this.getResumeDetails()
    } catch (e) {
      this.$message.error(e.msg)
    }
  }
 
  /**
   * 将表单数据转换成提交服务器的格式
   * @param {*} form
   */
  transformData (form) {
    let name = `form${form}`
    const newForm = Object.assign({}, this[name] || {})
    newForm.uid = this.uid

    if (name === 'form1') {
      newForm.birth =  newForm.birth/1000
      newForm.startWorkYear =  newForm.startWorkYear/1000
    }

    if (name === 'form3') {
      newForm.fieldIds =  newForm.fieldIds.join(',')
      newForm.positionId =  newForm.positionId[newForm.positionId.length - 1]
      newForm.cityNum =  newForm.cityNum[newForm.cityNum.length - 1]
    }

    if (name === 'form4') {
      
      newForm.positionTypeId =  newForm.positionTypeId[newForm.positionTypeId.length - 1]
      newForm.startTime =  newForm.startTime/1000
      newForm.endTime =  newForm.endTime/1000
      newForm.labelIds =  newForm.labelIds.join(',')
    }

    if (name === 'form5') {
      newForm.startTime =  newForm.startTime/1000
      newForm.endTime =  newForm.endTime/1000
    }

    if (name === 'form6') {
      newForm.startTime =  newForm.startTime/1000
      newForm.endTime =  newForm.endTime/1000
    }

    if (name === 'form7') {
      newForm.attachIds = this.introImgList.map(field => field.id).join(',')
    }

    console.log(newForm)
    return newForm
  }

  // form1 
    
     /* 求职状态 */
    getJobhuntStatus() {
      jobhuntStatusAPI().then(res => {
        this.jobhuntStatus = res.data.data
      })
    }
    /* 编辑图片 */
    handleIconLoaded (e) {
      let formData = new FormData()
      formData.append('attach_type', 'img')
      formData.append('img', e)
      console.log(e.uploadType)
      uploadApi(formData).then(res => {
        console.log(res.data)
        if (e.uploadType === 'headicon') {
          this.form1.avatar = String(res.data.data[0].id)
        }
      })
    }
  // form1 
  // form6 
    /* 学历 */
    getDegreeList() {
      degreeListAPI().then(res => {
        this.degreeList = res.data.data
      })
    }
  // form6 
  
  // form7
    /**
     * @detail   处理选中的图片
     */
    handleChangeImage() {
      this.files = document.querySelector('#image').files
      Array.from(this.files).map((file, index) => {
        let reader = new FileReader()
        let formData = new FormData()
        reader.readAsDataURL(file)
        // 开始
        reader.onloadstart = (res) => {}
        // 正在读取
        reader.onprogress = (res) => {}
        // 中断
        reader.onabort = (res) => {}
        // 出错
        reader.onerror = (res) => {}
        // 成功读取
        reader.onload = (res) => {
          let isLt5M = file.size / 1024 / 1024 > 5
          if(isLt5M) {
            this.$message.error('上传的图片大小是5MB~')
            return false
          }
        }
        // 读取完成，无论成功失败
        reader.onloadend = (res) => {}
        formData.append(`img${index + 1}`, file)
        formData.append('attach_type', 'img')
        this.xhr = new XMLHttpRequest()
        if(this.introImgList.length !== this.imageUpload.limit) {
          this.handleUploadImage(formData)
        }
      })
    }

    /**
     * @detail   上传选中的图片
     */
    handleUploadImage(formData) {
      let index = this.introImgList.length
      this.xhr.open('post', upload_api, true)
      this.xhr.setRequestHeader('Authorization-Admin', getAccessToken())
      // 上传成功
      this.xhr.onload = (res) => {
        this.introImgList.push(JSON.parse(res.target.responseText).data[0])


        console.log(this.introImgList)
      }
      // 上传失败
      this.xhr.onerror = (res) => {}
      // 上传进度
      this.xhr.upload.onprogress = (res) => {}
      this.xhr.send(formData)
    }

    /**
     * @detail  点击选择图片
     */
    handleChooseImage() {
      document.querySelector('#image').click()
      document.querySelector('#image').value = ''
    }

    handleRemoveUploadImage(index) {
      this.introImgList.splice(index, 1)
    }
  // form7

  // 修改用户
  saveUser() {
    let value = this.canform.mobile
    if (!value) {
      this.$message({
        message: "请输入手机号码"
      })
    } else if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(value)) {
      this.$message({
        message: "请输入正确的手机号码"
      })
    } else {
      haveMobile(value).then(res => {
        if (!res.data.data.userExist) {
          canPush = 1
          this.$message({
            message: "该用户不存在，请去创建用户"
          })
          this.$nextTick(() => {
            this.$router.push({
              path: "/user/addUser",
              query: {
                create_resume: true
              }
            })
          })
        } else {
          // 满足需求
          canPush = 2
          this.uid = res.data.data.cardInfo.uid
          this.dialogVisible = false

          this.getResumeDetails()
        }
      })
    }
  }
  goPath(e) {
    this.$router.push({
      path: "/resumeStore/recommendList/OrderDetail",
      query: {
        id: this.resultmsg.id
      }
    })
  }
  /* 修改手机号码 */
  editMoile() {
    this.showClose = true
    this.dialogVisible = true
    this.closeModel = true
  }
  verificationMobile() {
    console.log(this.checkMobileVal)
  }
  changeTimeStamp(e, type) {
    this.form[type] = parseInt(e / 1000)
  }
  UploadImage(param) {
    let name = param.file.name.split(".")[1]
    let type = /(jpg|gif|png|peg|bmp)/.test(name) ? "img" : "doc"
    const formData = new FormData()
    formData.append("Authorization", sessionStorage.getItem("adminToken"))//
    formData.append("attach_type", type)
    formData.append("img1", param.file)
    uploadApi(formData).then(res => {
      const msg = res.data.data[0]
      this.form8.attach_resume = msg.id
      this.form8.attach_name = msg.fileName
    });
  }
  /* 验证手机号码 */
  checkMobile(e) {
    if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(e)) {
      this.$message({
        message: "格式有误，请重新输入有效11位手机号",
        type: "warning"
      })
    } else {
      haveMobile(e).then(res => {
        console.log(res)
        if (!res.data.data.userExist) {
          this.$message({
            message: "该用户不存在，请去创建用户",
            type: "warning"
          })
          this.showClose = false
          this.dialogVisible = false
          this.closeModel = false
          this.$router.push({ path: "/user/addUser" })
        } else if (res.data.data.userExist && res.data.data.haveCard) {
          this.$message({
            message: "该手机号已创建简历，不能再次创建",
            type: "warning"
          })
        } else {
          this.form.mobile = e
          this.dialogVisible = false
          this.nowUserMsg = res.data.data.cardInfo
        }
        // if(res)
      })
    }
  }
  choiceMax(e) {
    console.log(e)
  }
  submitForm(form) {
    this.changeTimeStamp(this.form.birth, "birth")
    this.changeTimeStamp(this.form.startWorkYear, "startWorkYear")
    // console.log(this.form.fieldIds)
    this.form3.fieldIds = [...this.form3.fieldIds].join(",")
    this.$refs[form].validate(valid => {
      if (valid) {
        createResume(this.form.mobile, this.form).then(res => {
          console.log(res)
          this.$message({
            message: "创建成功",
            type: "success"
          })
          this.$router.push({
            path: "/resumeStore/list",
            meta: {
              keepAlive: false
            }
          })
        })
      } else {
        console.log(this.form)
        return false
      }
    })
  }
  changePostion(e) {
    console.log(e)
    // this.form3.positionId = e[e.length - 1]
  }
  // 工作经历 =》 职位类别
  changePostion1(e) {
    console.log(e)
    // this.form4.positionTypeId = e[e.length - 1]
    this.setProfessionalSkills()
  }
  /* 选择最小薪资 */
  changeMin(val) {
    let length = 2 * +val
    let firstVal = +val + 1
    this.maxSalary = []
    for (let i = +val;i < length;i++) {
      this.maxSalary.push(parseInt(+i + 1))
    }
  }
  changeCity(e) {
    console.log(e)
    // this.form3.cityNum = e[e.length - 1]
  }
  getCityData() {
    getCityApi().then(res => {
      this.getCityList = res.data.data
      this.getCityList.forEach(item => {
        item.children.forEach(item1 => {
          let result = JSON.stringify(item1.children)
          if (result === "[]") delete item1.children
        })
      })
    })
  }
  // 职业技能
  getProfessionalSkills () {
    return professionalSkillsApi().then(res => {
      this.professionalSkillsList = res.data.data.labelProfessionalSkills
      this.professionalLiteracyList = res.data.data.labelProfessionalLiteracy
    })
  }

  setProfessionalSkills () {
    let options = []
    let id = this.form4.positionTypeId[0]
    this.professionalSkillsList.map((item,index) => {
      if (id === item.labelId) {
        options = item.children
        return
      }
    })
    console.log(id,options)
    console.log(this.professionalSkillsList)
    this.optionsSkills = options
  }

  // 期待职位
  manageList() {
    getLabelPositionListApi().then(res => {
      this.options = res.data.data
      this.options.forEach(item => {
        item.children.forEach(item1 => {
          item1.children.forEach(item2 => {
            let result = JSON.stringify(item2.children)
            if (result === "[]") delete item2.children
          })
        })
      })
    })
  }
  // 行业
  getField() {
    fieldApi().then(res => {
      this.fieldList = res.data.data
      // console.log("行业", this.fieldList)
    })
  }
  salary() {
    let minSalary = new Array(60)
    for (var i = 0; i < minSalary.length; i++) {
      minSalary[i] = i + 1
    }
    this.minSalary = minSalary
  }
}
