<!--  -->
<template>
  <div class="OrderDetail">
    <div class="TabView">
      <div class="tabList">
        <div
          class="tabItem"
          v-for="(item,index) in itemList"
          :key="index"
          @click.stop="ClickTab(index,item.path)"
          :class="isCreate===index?'active':''"
        >
          <span>{{item}}</span>
        </div>
      </div>
      <div class="createOrder">
        <p class="title">新建微简历</p>
        <div class="CreateContent">
          <el-form :model="form" :rules="rules" ref="form" class="demo-ruleForm">
            <el-form-item label-width="80px" prop="mobile" label="手机号码" class="formItem">
              <el-input disabled v-model.number="form.mobile"></el-input>
              <span class="editMoile" @click.stop="editMoile">换个手机</span>
            </el-form-item>
            <el-form-item label-width="80px" label="姓名" class="formItem" prop="name">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="性别" prop="gender" class="formItem" label-width="80px">
              <el-radio-group v-model="form.gender">
                <el-radio label="1">男</el-radio>
                <el-radio label="2">女</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="出生年月" label-width="80px" prop="birth" class="formItem" required>
              <el-date-picker
                type="date"
                placeholder="选择日期"
                v-model="form.birth"
                value-format="timestamp"
                format="yyyy 年 MM 月 dd 日"
                style="width: 142px;"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label-width="80px" prop="startWorkYear" label="工作时间" class="formItem">
              <el-date-picker
                class="datapicker"
                type="date"
                placeholder="选择日期"
                v-model="form.startWorkYear"
                value-format="timestamp"
                style="width: 142px;"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="近期公司" label-width="80px" prop="lastCompany" class="formItem">
              <el-input placeholder="最近任职公司" v-model="form.lastCompany"></el-input>
            </el-form-item>
            <el-form-item label="近期职位" label-width="80px" prop="lastPosition" class="formItem">
              <el-input placeholder="最近工作职位" v-model="form.lastPosition"></el-input>
            </el-form-item>
            <el-form-item label="期望城市" label-width="80px" class="formItem" prop="expectCityNum">
              <el-cascader
                ref="cityChoice"
                placeholder="期望城市"
                :options="getCityList"
                filterable
                :props="{
                value:'areaId',
                label:'title',
                children:'children'
                }"
                @change="type"
              ></el-cascader>
            </el-form-item>
            <el-form-item class="formItem" label-width="80px" label="期待职位" prop="expectPositionId">
              <el-cascader
                ref="cascader"
                class="formItem"
                placeholder="期待职位类别"
                :options="options"
                filterable
                :props="{
                value:'labelId',
                label:'name',
                children:'children'
                }"
                @change="choicePostion"
              ></el-cascader>
            </el-form-item>
            <el-form-item label="期望薪资">
              <el-row style="margin-left:161px;">
                <el-col :span="3">
                  <el-form-item prop="expectSalaryFloor" class="formItem">
                    <el-select
                      v-model="form.expectSalaryFloor "
                      placeholder="最低薪资"
                      @change="choiceMin"
                    >
                      <el-option v-for="item in minSalary" :key="item" :label="item" :value="item"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :span="1">-</el-col>
                <el-col :span="6">
                  <el-form-item prop="expectSalaryCeil" class="formItem">
                    <el-select
                      v-model="form.expectSalaryCeil"
                      placeholder="最高薪资"
                      @change="choiceMax"
                    >
                      <el-option v-for="item in maxSalary" :key="item" :label="item" :value="item"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form-item>

            <el-form-item label-width="80px" label="期望领域" class="formItem" prop="expectFieldIds">
              <el-select multiple collapse-tags v-model="form.expectFieldIds" placeholder="请选择">
                <el-option
                  v-for="item in fieldList"
                  :key="item.labelId"
                  :label="item.name"
                  :value="item.labelId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="附件简历(选填)" class="formItem">
              <el-upload
                action="https://admin-api.lieduoduo.ziwork.com/attaches"
                :limit="1"
                :file-list="fileList"
                :http-request="UploadImage"
              >
                <el-button size="small" type="primary">点击上传</el-button>
                <div class="el-upload__tip" slot="tip">支持上传png,jpg,pdf,doc,docx文件，且不超过500kb</div>
              </el-upload>
            </el-form-item>
            <el-form-item class="formItem">
              <el-button type="primary" @click="submitForm('form')">立即创建</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <el-dialog
      :title="'修改手机号码'"
      :close-on-click-modal="closeModel"
      :show-close="showClose"
      :visible.sync="dialogVisible"
      width="30%"
      center
    >
      <el-form :model="canform" ref="canform" class="demo-ruleForm">
        <el-form-item prop="mobile" label="手机号码" class="formItem">
          <el-input v-model="canform.mobile" placeholder="请输入手机号码"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click.stop="saveUser" class="inquire">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import {
  createResume,
  haveMobile
} from 'API/resumeStore'
import { getLabelPositionListApi } from 'API/position'
import { getCityApi } from 'API/company'
import { fieldApi, uploadApi } from 'API/common'
import { getAccessToken } from 'API/cacheService'
const packjson = require('../../../../../package.json')
// eslint-disable-next-line no-unused-vars
let canPush = 0 /* 0 规定 1 跳转注册页 2 去新建微简历 */
let Sumbitform = {
  name: '',
  gender: '',
  mobile: ''
}
@Component({
  name: 'OrderDetail'
})
export default class OrderDetail extends Vue {
  checkMobileVal = ''; /* 校验手机号码 */
  uploadApi = '';
  isFocus = false;
  dialogVisible = false;
  fileList = [];
  canform = Sumbitform;

  /* 提示语 */
  nowUserMsg = {}; /* 当前操作的用户数据 */
  closeModel = false;
  autoUpload = false;
  showClose = false;
  isCreate = 0;
  fieldList = []; /* 行业领域 */
  isShowForm = false;
  minSalary = []; /* 最小薪资 */
  maxSalary = []; /* 最大薪资 */
  isShowmsg = false;
  getCityList = []; // 省市列表
  resumeAttachId = ''; /* 附件id */
  headers = {};
  resumeAttachId = '';
  form = {
    mobile: '' /* 手机号 */,
    avatar: '' /* 头像附件id */,
    gender: '' /* 性别，未知0，男1，女2 */,
    name: '' /* 姓名 */,
    birth: '' /* 出生年月(时间戳) */,
    startWorkYear: '' /* 参加工作年份(时间戳) */,
    lastCompany: '' /* 最近任职公司 */,
    lastPosition: '' /* 最近任职职位 */,
    expectCityNum: '' /* 期望城市，城市编号 */,
    expectPositionId: '' /* 期望职位id */,
    expectSalaryCeil: '' /* 期望月薪上限，单位k */,
    expectSalaryFloor: '' /* 期望月薪下限，单位k */,
    expectFieldIds: '' /* 期望领域ids，逗号分隔 */,
    resumeAttachId: '' /* 简历附件id */
  };
  validate_Name = (rule, value, callback) => {
    if (value === '') {
      callback(new Error('姓名不能为空'))
    } else {
      callback()
    }
  };
  validate_Birth = (rule, value, callback) => {
    if (!value) {
      callback(new Error('出生年月不能为空'))
    } else {
      callback()
    }
  };
  validate_lastCompany = (rule, value, callback) => {
    // console.log(value);
    if (!value) {
      callback(new Error('请输入最近任职公司'))
    } else {
      callback()
    }
  };
  validate_startWorkYear = (rule, value, callback) => {
    console.log(value, 'startWorkYear')
    if (!value) {
      callback(new Error('请输入工作时间'))
    } else {
      callback()
    }
  };
  rules = {
    name: [{ required: true, validator: this.validate_Name, trigger: 'blur' }],
    mobile: [{ required: true, message: '请输入手机号码', trigger: 'blur' }],
    gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
    birth: [
      {
        required: true,
        validator: this.validate_Birth,
        trigger: 'blur'
      }
    ],
    startWorkYear: [
      {
        type: 'date',
        required: true,
        validator: this.validate_startWorkYear,
        trigger: 'blur'
      }
    ],
    lastCompany: [
      { required: true, message: '请选择最近任职的公司', trigger: 'blur' }
    ],
    lastPosition: [
      { required: true, message: '请选择最近的工作职位', trigger: 'blur' }
    ],
    expectCityNum: [
      { required: true, message: '请选择你期望的城市', trigger: 'blur' }
    ],
    expectPositionId: [
      { required: true, message: '请选择期望的职位', trigger: 'change' }
    ],
    expectSalaryCeil: [
      {
        type: 'date',
        required: true,
        message: '请选择期望的最高月薪',
        trigger: 'blur'
      }
    ],
    expectSalaryFloor: [
      { required: true, message: '请选择期望的最低月薪', trigger: 'blur' }
    ],
    expectFieldIds: [
      { required: true, message: '请选择你期望的领域', trigger: 'change' }
    ]
  };
  options = [];
  sumbitRusult = false;
  itemList = ['新建微简历'];
  // 修改用户
  saveUser () {
    let value = this.canform.mobile
    if (!value) {
      this.$message({
        message: '请输入手机号码'
      })
    } else if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(value)) {
      this.$message({
        message: '请输入正确的手机号码'
      })
    } else {
      haveMobile(value).then(res => {
        if (!res.data.data.userExist) {
          canPush = 1
          this.$message({
            message: '该用户不存在，请去创建用户'
          })
          this.$nextTick(() => {
            this.$router.push({
              path: '/user/addUser',
              query: {
                create_resume: true
              }
            })
          })
        } else if (res.data.data.userExist && res.data.data.haveCard) {
          this.$message({
            message: '该手机号已创建简历，不能再次创建'
          })
        } else {
          // 满足需求
          canPush = 2
          let param = {
            gender: String(res.data.data.cardInfo.gender),
            name: res.data.data.cardInfo.name,
            mobile: value
          }
          this.form = { ...this.form, ...param }
          this.dialogVisible = false
        }
      })
    }
  }
  goPath (e) {
    this.$router.push({
      path: '/resumeStore/recommendList/OrderDetail',
      query: {
        id: this.resultmsg.id
      }
    })
  }
  /* 上传文件 */
  handleFileSuccess (e) {
    console.log(e)
  }
  /* 修改手机号码 */
  editMoile () {
    this.showClose = true
    this.dialogVisible = true
    this.closeModel = true
  }
  verificationMobile () {
    console.log(this.checkMobileVal)
  }
  changeTimeStamp (e, type) {
    this.form[type] = parseInt(e / 1000)
  }
  /* 文件上传成功 */
  uploadImg (e) {
    console.log(e)
  }
  /* 选择文件 */
  beforeUpload (e) {
    this.form.resumeAttachId = e.data[0].id
  }
  UploadImage (param) {
    console.log(param)
    let name = param.file.name.split('.')[1]
    let type = /(jpg|gif|png|peg|bmp)/.test(name) ? 'img' : 'doc'
    const formData = new FormData()
    formData.append('Authorization', sessionStorage.getItem('adminToken')) //
    formData.append('attach_type', type)
    formData.append('img1', param.file)
    uploadApi(formData).then(res => {
      const resumeAttachId = res.data.data[0].id
      this.form.resumeAttachId = resumeAttachId
    })
  }
  /* 验证手机号码 */
  checkMobile (e) {
    if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(e)) {
      this.$message({
        message: '格式有误，请重新输入有效11位手机号',
        type: 'warning'
      })
    } else {
      haveMobile(e).then(res => {
        console.log(res)
        if (!res.data.data.userExist) {
          this.$message({
            message: '该用户不存在，请去创建用户',
            type: 'warning'
          })
          this.showClose = false
          this.dialogVisible = false
          this.closeModel = false
          this.$router.push({ path: '/user/addUser' })
        } else if (res.data.data.userExist && res.data.data.haveCard) {
          this.$message({
            message: '该手机号已创建简历，不能再次创建',
            type: 'warning'
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
  choiceMax (e) {
    console.log(e)
  }
  submitForm (form) {
    this.changeTimeStamp(this.form.birth, 'birth')
    this.changeTimeStamp(this.form.startWorkYear, 'startWorkYear')
    // console.log(this.form.expectFieldIds);
    this.form.expectFieldIds = [...this.form.expectFieldIds].join(',')
    this.$refs[form].validate(valid => {
      if (valid) {
        createResume(this.form.mobile, this.form).then(res => {
          console.log(res)
          this.$message({
            message: '创建成功',
            type: 'success'
          })
          this.$router.push({
            path: '/resumeStore/list',
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
  choicePostion (e) {
    this.form.expectPositionId = e[e.length - 1]
  }
  /* 选择最小薪资 */
  choiceMin (val) {
    let length = 2 * +val
    // let firstVal = +val + 1
    this.maxSalary = []
    for (let i = +val; i < length; i++) {
      this.maxSalary.push(parseInt(+i + 1))
    }
  }
  type (e) {
    this.form.expectCityNum = e[e.length - 1]
  }
  ClickTab (index) {
    let result = this.itemList[index].name.indexOf('详情') !== -1
    result ? (this.isCreate = 0) : (this.isCreate = 1)
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
  field () {
    fieldApi().then(res => {
      this.fieldList = res.data.data
      console.log('行业', this.fieldList)
    })
  }
  getUploadParam () {
    this.uploadParam = {
      Authorization: sessionStorage.getItem('adminToken'),
      attach_type: 'doc',
      img1: ''
    }
    this.headers = {
      'Authorization-Admin': getAccessToken(),
      'Admin-Version': packjson.lieduoduoversion
    }
  }
  created () {
    this.getUploadParam()
    this.form.mobile = JSON.parse(this.$route.query.userInfo).mobile
    this.form.gender = String(JSON.parse(this.$route.query.userInfo).gender)
    this.form.name = JSON.parse(this.$route.query.userInfo).name
    this.salary()
    this.field()
    this.CityData()
    this.ManageList()
  }
  salary () {
    let minSalary = new Array(60)
    for (var i = 0; i < minSalary.length; i++) {
      minSalary[i] = i + 1
    }
    this.minSalary = minSalary
  }
}
</script>
<style lang='less' scoped>
@import "./index.less";
</style>
