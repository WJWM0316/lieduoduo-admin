import Vue from 'vue'
import Component from 'vue-class-component'
// import config from '@/configs'
import {
  professionalSkillsApi,
  getLabelPositionListApi,
  searchPositionApi,
  getPositionApi,
  editPositionApi,
  addPositionApi
} from 'API/position'
import {
  getAdressListApi,
  addCompanyAdressApi
} from 'API/company'
import SearchBar from '@/components/searchBar'
import mapSearch from '@/components/map'
// P63BZ-4RM35-BIJIV-QOL7E-XNCZZ-WIF4L

@Component({
  name: 'community-edit',
  components: {
    /* Editor */
    SearchBar,
    mapSearch
  },

  filters: {
    // 活动周期过滤
    activityCycle (value, unit) {
      const option = {
        1: '天',
        2: '个星期',
        3: '个月',
        4: '年'
      }

      return `${value}${option[unit]}`
    }
  }
})
export default class CommunityEdit extends Vue {
  // 列表
  options = []
  options2 = []

  // 职位类别
  typeList = []
  // 学历
  educationList = [{
    value: 5,
    label: '初中及以下'
  },
  {
    value: 10,
    label: '中专/中技'
  },
  {
    value: 15,
    label: '高中'
  },
  {
    value: 20,
    label: '大专'
  },
  {
    value: 25,
    label: '本科'
  },
  {
    value: 30,
    label: '硕士'
  },
  {
    value: 35,
    label: '博士'
  }
  ]
  // 经验要求
  experienceList = [{
    value: '1',
    label: '不限'
  },
  {
    value: '2',
    label: '暂无经历'
  },
  {
    value: '3',
    label: '1年以内'
  },
  {
    value: '4',
    label: '1-3年'
  },
  {
    value: '5',
    label: '3-5年'
  },
  {
    value: '6',
    label: '5-10年'
  },
  {
    value: '7',
    label: '10年以上'
  }
  ]
  annual_salary_list = []
  addressList = [{
    value: '0',
    label: '添加新的公司地址'
  }]

  // 社区分类标签
  communityTags = []

  // 表单数据
  form = {
    mobile: null, // 13450211224
    position_name: '', // 职位名称
    type: '', // 职位类型
    address_id: '', // 选择的公司地址ID
    // area_id: '', // 区域ID(省，市，区的ID，级别最小的)
    lng: '', // 经度
    lat: '', // 纬度
    address: '', // 工作地址
    doorplate: '', // 工作地址-门牌
    labels: '', // 技能标签json数组[{’id’:1,’is_diy’:0},{’d’:12,’is_diy’:1}]
    emolument_min: '', // 薪资范围起点
    emolument_max: '', // 薪资范围终点
    work_experience: '', // integer(formData) 1:不限, 2:暂无经历 , 3:一年以内, 4:1-3年, 5:3-5年, 6:5-10年, 7 10年以上
    education: '', // 学历要求,5 ：初中及以下，10： 中专 ，15：高中, 20: 大专, 25: 本科， 30: 硕士, 35：博士
    describe: '', // 职位描述
    annual_salary: '12',
    is_online: 1
  }

  // 表单验证规则
  rules = {
    mobile: [{
      required: true,
      message: '手机号必须填写，最多11个字，纯数字',
      trigger: 'blur'
    },
    {
      max: 11,
      min: 11,
      trigger: 'blur',
      message: '手机号必须填写，最多11个字，纯数字'
    }
    ],
    position_name: [{
      required: true,
      message: '请填写职位名称',
      trigger: 'blur'
    },
    {
      min: 2,
      message: '职位名称不得少于2个字',
      trigger: 'blur'
    },
    {
      max: 30,
      message: '职位名称最多输入30个字',
      trigger: 'blur'
    }
    ],
    type: [{
      required: true,
      message: '请选择职位类型',
      trigger: 'blur'
    }],
    address_id: [{
      required: true,
      message: '请选择工作地点',
      trigger: 'blur'
    }],
    work_experience: [{
      required: true,
      message: '请选择经验要求',
      trigger: 'blur'
    }],
    education: [{
      required: true,
      message: '请选择经验要求',
      trigger: 'blur'
    }],
    emolument_min: [{
      required: true,
      message: '请选择薪资范围',
      trigger: 'blur'
    }],
    emolument_max: [{
      required: true,
      message: '请选择薪资范围',
      trigger: 'blur'
    }],
    labels: [{
      required: true,
      message: '请选择技能要求',
      trigger: 'blur'
    }],
    describe: [{
      required: true,
      message: '请填写职位描述',
      trigger: 'blur'
    }]
  }

  positionList = []
  secondPositionList = []
  thirdPositionList = []
  searchPosition = ''
  adressInput = ''
  adress_id_Input = ''
  isEdit = false
  pop = {
    isShow: false,
    type: 'position'
  }
  // 职位类别
  selectPositionItem = {
    name: '',
    typeId: ''
  }

  // 技能要求个数
  limit = 4

  emolumentMaxList = [] // 选择薪资范围
  emolumentMinList = [] // 选择薪资范围
  addressData = {
    areaName: '',
    area_id: '',
    address: '',
    doorplate: '',
    lng: '',
    lat: ''
  }

  professionalSkillsList = []

  isEdit = false // 是否编辑
  isOnline = false // 编辑是否在线

  mobileBlur (e) {
    let value = e.target.value
    if (value.length === 11) {
      this.getAdressList()
    }
  }

  // 添加工作地点
  addAdress (param) {
    param.data.areaName = param.data.area_id
    param.data.mobile = this.form.mobile
    delete param.data.area_id
    this.addCompanyAdress(param.data)
  }

  /* 添加地址 */
  addCompanyAdress (data) {
    addCompanyAdressApi(data).then(res => {
      this.form.address_id = ''
      this.getAdressList()
    }).catch(e => {
      this.$message.error(e.data.msg)
    })
  }

  created () {
    // this.getTagList()
    this.init()
    this.setEmolumentMin()
    this.getProfessionalSkills()
    this.getLabelPositionList()
    for (let i = 12; i <= 24; i++) {
      this.annual_salary_list.push({
        value: String(i),
        label: `${i}薪`
      })
    }
  }

  /**
   * 初始化数据
   */
  async init () {
    try {
      // 如果有id，则为编辑
      if (this.$route.query.id) {
        const id = parseInt(this.$route.query.id)
        this.isEdit = true
        const {
          data
        } = await getPositionApi({
          id: id
        })

        if (data.data.isOnline === 1) {
          this.isOnline = true
        }
        // // 创建编辑表单数据
        const form = {}
        form.position_name = data.data.positionName
        form.type = data.data.typeName

        form.address_id = data.data.addressId
        form.lng = data.data.lng
        form.lat = data.data.lat
        form.address = data.data.address
        form.doorplate = data.data.doorplate

        form.work_experience = data.data.workExperience
        form.education = data.data.education
        form.describe = data.data.describe

        form.type = data.data.type
        form.is_online = data.data.isOnline
        this.selectPositionItem = {
          name: data.data.typeName,
          typeId: data.data.type
        }
        // 设置技能
        if (data.data.skillsLabel.length > 0) {
          this.selectPositionItem.topPid = data.data.skillsLabel[0].topPid

          if (this.professionalSkillsList.length < 1) {
            this.getProfessionalSkills().then(() => {
              this.setSkillsList(true)
            })
          } else {
            this.setSkillsList(true)
          }
        } else {
          // this.skillChange(true)
        }

        form.labels = []
        data.data.skillsLabel.map(item => {
          form.labels.push(item.labelId)
        })

        this.addressList[1] = {
          value: data.data.addressId,
          label: data.data.address
        }

        form.emolument_min = data.data.emolumentMin
        form.emolument_max = data.data.emolumentMax
        this.setEmolumentMax(data.data.emolumentMin)
        form.mobile = data.data.mobile
        form.annual_salary = String(data.data.annualSalary)
        this.form = form

        this.getAdressList()
      } else {
        // const res = await getCreateCommunityData({
        //   globalLoading: true
        // })
        // this.tags = reshaol
      }
    } catch (error) {
      // this.is_course = true;
      // this.$message.error(error.message)
    }
  }

  /**
   * 保存社区
   */
  async savePosition () {
    try {
      // this.$store.dispatch('showAjaxLoading')
      const params = this.transformData(this.form)
      if (!this.$route.query.id) {
        addPositionApi(params).then(res => {
          this.$message.success('创建成功')
          this.$router.go(-1)
          // this.$router.push({
          //   name: 'positionManage'
          // })
        }).catch(e => {
          this.$message.error(e.data.msg)
        })
      } else {
        params.id = this.$route.query.id
        editPositionApi(params).then(res => {
          this.$message.success('编辑成功')
          this.$router.go(-1)
          // this.$router.push({
          //   name: 'positionManage'
          // })
        }).catch(e => {
          this.$message.error(e.data.msg)
        })
      }
    } catch (e) {
      this.$message.error(e.message)
    } finally {
      // this.$store.dispatch('hideAjaxLoading')
    }
  }

  // 获取地址列表
  getAdressList () {
    let data = {
      mobile: this.form.mobile,
      page: 1,
      count: 20,
      sort: 'desc'
    }

    getAdressListApi(data).then(res => {
      if (res.data.data.length > 0) {
        res.data.data.map(item => {
          item.value = item.id
          item.label = `${item.address}${item.doorplate}`
        })
        this.addressList = [{
          value: '0',
          label: '添加新的公司地址'
        },
        ...res.data.data
        ]
      }
    }).catch(() => {
      this.$message.error('该手机号码的用户还不是招聘官哦~')
    })
  }

  setEmolumentMin () {
    let max = 250
    let i = 0
    let list = []

    while (i < max) {
      if (i < 30) {
        i++
      } else if (i < 100) {
        i += 5
      } else if (i < max) {
        i += 10
      }

      list.push({
        label: `${i}k`,
        value: i
      })
    }

    this.emolumentMinList = list
  }

  changeEmolumentMin (e) {
    this.form.emolument_max = ''
    this.setEmolumentMax(e)
  }

  setEmolumentMax (num) {
    let max = 0
    let list = []

    if (num <= 10) {
      max = num + 5
    } else if (num > 10 && num < 31) {
      max = num * 2
    } else if (num > 34 && num < 71) {
      max = num + 30
    } else if (num > 74 && num < 96) {
      max = num + 30
    } else if (num > 99 && num < 251) {
      max = num * 2
    }

    for (let i = num + 1; i <= max; i++) {
      list.push({
        label: `${i}k`,
        value: i
      })
    }

    this.emolumentMaxList = list
  }

  handleSelect (e) {}

  // 编辑标题
  get editTitle () {
    return this.$route.query.type !== 'add' ? '编辑职位' : '添加职位'
  }

  // 技能
  getProfessionalSkills () {
    let that = this
    return professionalSkillsApi({
      type: 'skills'
    }).then(res => {
      that.professionalSkillsList = res.data.data.labelProfessionalSkills
      let options = []
      res.data.data.labelProfessionalSkills.map((item, index) => {
        if (this.form.type === item.labelId) {
          options = item.children
        }
      })
      this.options = options
    })
  }

  // 搜索职位
  handleSearch (e) {
    searchPositionApi({
      name: e,
      page: 1,
      count: 20
    }).then(res => {
      this.secondPositionList = []
      this.thirdPositionList = res.data.data
    })
  }

  selectPosition (index) {
    if (!this.positionList[index].active) {
      this.positionList.map((item, index2) => {
        if (index2 === index) {
          item.active = true
          item.children.map((item2) => {
            item2.active = false
            this.thirdPositionList = item2.children
          })
          this.secondPositionList = item.children
        } else {
          item.active = false
        }
      })
    }
    this.thirdPositionList = []
  }

  selectSecondPosition (index) {
    if (!this.secondPositionList[index].active) {
      this.secondPositionList.map((item, index2) => {
        if (index2 === index) {
          item.active = true
          this.thirdPositionList = item.children
        } else {
          item.active = false
        }
      })
    } else {
      this.secondPositionList[index].active = false
      this.thirdPositionList = []
    }
  }

  thirdSecondPosition (item) {
    this.pop.isShow = false
    this.selectPositionItem = {
      name: item.name,
      typeId: item.labelId,
      topPid: item.topPid
    }

    this.form.labels = []
    this.form.type = item.labelId
    this.setSkillsList()
  }

  // 设置技能列表
  setSkillsList (isNext) {
    if (this.professionalSkillsList.length > 0) {
      let topPid = this.selectPositionItem.topPid
      this.professionalSkillsList.map(item => {
        if (item.labelId === topPid) {
          this.options = item.children
        }

        // 编辑 显示技能
        if (isNext) {
          this.skillChange(isNext)
        }
      })
    } else {}
  }

  changePosition () {
    this.pop = {
      isShow: true,
      type: 'position'
    }
  }

  // 工作地点选择
  changeAdress (e) {
    if (!this.form.mobile || this.form.mobile.length < 1) {
      this.form.address_id = ''
      this.$message.error('需要先填写手机号')
      return
    }
    if (e === '0') {
      this.pop = {
        isShow: true,
        type: 'addAdress'
      }
      this.form.address_id = ''
    }
    return false
  }

  getLabelPositionList () {
    getLabelPositionListApi().then(res => {
      res.data.data.map((item, index) => {
        if (index === 0) {
          item.active = true
          this.secondPositionList = item.children
        } else {
          item.active = false
        }
      })
      this.positionList = res.data.data
    })
  }

  /**
   * 将表单数据转换成提交服务器的格式
   * @param {*} form
   */
  transformData (form) {
    const newForm = {
      ...form
    }
    // 分类标签
    if (newForm.labels && newForm.labels.length > 0) {
      let labels = []
      newForm.labels.map(item => {
        labels.push({
          id: item,
          is_diy: '0'
        })
      })
      // var jsObject = JSON.parse(jsonString); //转换为json对象
      newForm.labels = JSON.stringify(labels) // 转换为json类型的字符串
    } else {
      delete newForm.labels
    }
    return newForm
  }

  /* 点击提交 */
  handleSubmit () {
    this.$refs.form.validate(valid => {
      if (valid) {
        // let data = this.form
        this.savePosition()
      } else {}
    })
  }

  /**
   * 点击取消
   */
  handleCancel () {
    this.$confirm('', '退出将不保存更改的内容, 是否继续?', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      center: true
    }).then(() => {
      this.$router.go(-1)
    }).catch(() => {
      this.$message({
        type: 'info',
        message: '已取消退出'
      })
    })
  }

  popCancel (type) {
    if (type === 'name') {
      this.selectPositionItem.name = ''
    }
    this.pop.isShow = false
  }

  // 技能下拉框显示隐藏
  skillChange (e) {
    if (e && this.selectPositionItem.name.length === 0) {
      this.$message.error('请先选择职位类别')
      this.options2 = []
    } else {
      this.options2 = this.options
    }
  }
}
