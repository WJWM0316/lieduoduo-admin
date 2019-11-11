<!--创建公司-->
<template>
  <div id="edit_recruiter">

    <div class="base_infos">
      <el-form label-suffix="：" label-width="160px">
        <h3>
          基本信息
          <el-button type="text" v-if="!editBaseInfos" @click="todoAction('editBaseInfos')">编辑</el-button>
          <el-button type="text" @click="$router.back(-1)" style="float: right;">返回上一页</el-button>
        </h3>

        <el-form-item label="头像">
          <ul class="common-list">
            <li
              v-for="(imageItem, imageIndex) in userInfos.avatars"
              :key="imageIndex"
              :style="`background-image: url(${imageItem.smallUrl}); background-size: cover; background-repeat: no-repeat; background-position: center center;`"
              draggable="true">
              <div class="btn-close" @click="handleRemoveUploadImage(imageIndex)" v-if="editBaseInfos"><i class="el-icon-delete"></i></div>
            </li>
            <li class="upload-li" v-if="userInfos.avatars.length < model.limit && editBaseInfos" @click="handleChooseImage('#image')">
              <i class="el-icon-plus"></i>
              <input type="file" multiple="multiple" @change="handleChangeImage('#image')" style="display: none;" id="image" name="image" accept="image/*" />
            </li>
          </ul>
        </el-form-item>

        <el-form-item label="姓名">
          <el-input
            v-model="userInfos.name"
            placeholder="请输入姓名"
            :maxlength="20"
            style="width: 400px;"
            :disabled="true"
          ></el-input>
        </el-form-item>

        <el-form-item label="性别">
          <el-radio v-model="userInfos.gender" :label="1" :disabled="!editBaseInfos">男</el-radio>
          <el-radio v-model="userInfos.gender" :label="2" :disabled="!editBaseInfos">女</el-radio>
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
                @change="typeCategoryfun"
                :disabled="!editBaseInfos"
                v-model="userInfos.positionTypeId"
              ></el-cascader>
            </el-form-item>

        <el-form-item label="担任职务">
          <el-input
            v-model="userInfos.position"
            placeholder="请输入担任职务"
            :maxlength="20"
            :disabled="!editBaseInfos"
            style="width: 400px;"
          ></el-input>
        </el-form-item>

        <el-form-item label="接收简历邮箱">
          <el-input
            v-model="userInfos.email"
            placeholder="请输入邮箱"
            :maxlength="20"
            :disabled="!editBaseInfos"
            style="width: 400px;"
          ></el-input>
        </el-form-item>

        <el-form-item label="微信">
          <el-input
            v-model="userInfos.wechat"
            placeholder="请输入微信"
            :maxlength="20"
            :disabled="!editBaseInfos"
            style="width: 400px;"
          ></el-input>
        </el-form-item>

        <el-form-item label="个性签名">
          <el-input
            type="textarea"
            :rows="4"
            placeholder="请输入内容"
            style="width: 400px;"
            :disabled="!editBaseInfos"
            v-model="userInfos.signature">
          </el-input>
        </el-form-item>

        <el-form-item label="官方介绍">
          <el-input type="textarea"
          v-model="userInfos.oneSentenceIntro"
          :maxlength="35"
          :disabled="!editBaseInfos">
          </el-input>
        </el-form-item>

        <el-form-item v-if="editBaseInfos">
          <el-button type="primary" @click="saveUser">保存</el-button>
          <el-button @click="todoAction('editBaseInfos')">取消</el-button>
        </el-form-item>

      </el-form>
    </div>

    <div class="userLabel">
      <h3>个人标签</h3>
      <el-form label-suffix="：" label-width="160px">

        <el-form-item label="官方标签">
          <ul class="label_ul" v-if="official.length">
            <li
              :class="{active: item.active}"
              v-for="(item, index) in official"
              :key="index">{{item.name || item.labelName}}
            </li>
          </ul>
          <el-button type="text" @click="todoAction('official')">{{official.length ? '编辑' : '添加'}}</el-button>
        </el-form-item>
        
        <el-form-item label="职业技能">
          <ul class="label_ul" v-if="userInfos.skillLabels.length">
            <li
              :class="{active: item.active}"
              v-for="(item, index) in userInfos.skillLabels"
              :key="index">{{item.name || item.labelName}}
            </li>
          </ul>
          <el-button type="text" @click="todoAction('skills')">{{userInfos.skillLabels.length ? '编辑' : '添加'}}</el-button>
        </el-form-item>

        <el-form-item label="职业素养">
          <ul class="label_ul" v-if="userInfos.literacyLabels.length">
            <li
              :class="{active: item.active}"
              v-for="(item, index) in userInfos.literacyLabels"
              :key="index">{{item.name || item.labelName}}
            </li>
          </ul>
          <el-button type="text" @click="todoAction('literacy')">{{userInfos.literacyLabels.length ? '编辑' : '添加'}}</el-button>
        </el-form-item>

        <el-form-item label="自定义">
          <el-button type="text" @click="todoAction('customize')">添加</el-button>
        </el-form-item>

        <el-form-item label="生活标签">
          <ul class="label_ul" v-if="userInfos.lifeLabels.length">
            <li
              :class="{active: item.active}"
              v-for="(item, index) in userInfos.lifeLabels"
              :key="index">{{item.name || item.labelName}}
            </li>
          </ul>
          <el-button type="text" @click="todoAction('life')">{{userInfos.lifeLabels.length ? '编辑' : '添加'}}</el-button>
        </el-form-item>

        <el-form-item label="自定义">
          <el-button type="text" @click="todoAction('customize_life')">添加</el-button>
        </el-form-item>

      </el-form>
    </div>

    <div class="userLabel">
      <h3>个人简介 <el-button type="text" v-if="!editUserBreif" @click="todoAction('editUserBreif')">编辑</el-button></h3>
      <el-form label-suffix="：" label-width="160px">

        <el-form-item>
          <el-input
            type="textarea"
            :rows="4"
            placeholder="请输入个人简介"
            style="width: 400px;"
            :disabled="!editUserBreif"
            v-model="userInfos.brief">
          </el-input>
        </el-form-item>

        <el-form-item v-if="editUserBreif">
          <el-button type="primary" @click="setRecruiterBrief">保存</el-button>
          <el-button @click="todoAction('editUserBreif')">取消</el-button>
        </el-form-item>

      </el-form>
    </div>

    <div class="userBelong">
      <h3>所属公司</h3>
      <el-form label-suffix="：" label-width="160px" :inline="true">

        <el-form-item style="margin-left: 150px;" v-if="userInfos.companyInfo">
          公司全称：{{userInfos.companyInfo.companyName}}
        </el-form-item>

        <el-form-item style="margin-left: 100px;">
          是否可以发布职位
          <el-switch
            v-model="userInfos.createPositionRight"
            active-color="#3a8ee6"
            inactive-color="#cccccc"
            active-value="1"
            @change="switchPublicBtn"
            inactive-value="0">
          </el-switch>
        </el-form-item>

        <el-form-item style="float: right;">
          <el-button type="text" v-if="userInfos.companyInfo" @click="removeUser">移出公司</el-button>
          <el-button type="text" v-if="!userInfos.companyInfo" @click="bindCompany">绑定公司</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-dialog :title="model.title" :visible.sync="model.show" width="580px">

      <div class="html_content_box" v-if="model.type === 'official'">
        <div class="m_h1">已选择标签：</div>
        <ul class="label_ul_dialog" v-if="officialObtainedType.length">
          <li :class="{active: item.active}" v-for="(item, index) in officialObtainedType" :key="index"  @click="removeOfficial(index,item)">{{item.name || item.labelName}}</li>
        </ul>
        <el-form>
          <el-form-item label="请输入自定义标签">
            <el-input v-model="officialCustomize" maxlength=10></el-input>
            <el-button type="primary" @click="getofficialCustomize()">添加自定义标签</el-button>
          </el-form-item>
        </el-form>
        <div class="m_h2">请选择标签：</div>
        <ul class="label_ul_dialog" style="margin-top: 20px;">
          <li :class="{active: item.active}" v-for="(item, index) in labelProfessionalOfficial" :key="index" @click="getOfficial(index,item)">{{item.name}}</li>
        </ul>
      </div>

      <div class="html_content_box" v-if="model.type === 'skills'">
        <div class="m_h1">已选择标签：</div>
        <ul class="label_ul_dialog" v-if="model.selected.length">
          <li :class="{active: item.active}" v-for="(item, index) in model.selected" :key="index" @click="removeSkills(index, item)">{{item.name || item.labelName}}</li>
        </ul>
        <div class="m_h2">请选择标签：</div>
        <el-select v-model="model.value3" placeholder="请选择" @change="changeSkills">
          <el-option
            v-for="(item, index) in labelProfessionalSkillsList"
            :key="index"
            :label="item.name"
            :value="item.labelId">
          </el-option>
        </el-select>
        <ul class="label_ul_dialog" style="margin-top: 20px;">
          <li :class="{active: item.active}" v-for="(item, index) in model.list" :key="index" @click="getSkillsItem(index, item)">{{item.name}}</li>
        </ul>
      </div>

      <div class="html_content_box" v-if="model.type === 'literacy'">
        <div class="m_h1">已选择标签：</div>
        <ul class="label_ul_dialog" v-if="model.selected.length">
          <li :class="{active: item.active}" v-for="(item, index) in model.selected" :key="index" @click="removeLabelItem(index)">{{item.name || item.labelName}}</li>
        </ul>
        <div class="m_h2">请选择标签：</div>
        <ul class="label_ul_dialog" v-if="model.list.length">
          <li :class="{active: item.active}" v-for="(item, index) in model.list" :key="index" @click="getLabelItem(index, item)">{{item.name}}</li>
        </ul>
      </div>

      <div class="html_content_box" v-if="model.type === 'life'">
        <div class="m_h1">已选择标签：</div>
        <ul class="label_ul_dialog" v-if="model.selected.length">
          <li :class="{active: item.active}" v-for="(item, index) in model.selected" :key="index" @click="removeLifeItem(index, item)">{{item.name || item.labelName}}</li>
        </ul>
        <div class="m_h2">{{lifeLabelsLists[0].name}}:</div>
        <ul class="label_ul_dialog">
          <li :class="{active: item.active}" v-for="(item, index) in lifeLabelsLists[0].children" :key="index" @click="getLifeLabel('xingge', index, item)">{{item.name}}</li>
        </ul>
        <div class="m_h2">{{lifeLabelsLists[1].name}}:</div>
        <ul class="label_ul_dialog">
          <li :class="{active: item.active}" v-for="(item, index) in lifeLabelsLists[1].children" :key="index" @click="getLifeLabel('shenghuo', index, item)">{{item.name}}</li>
        </ul>
      </div>

      <div class="html_content_box_01" v-if="model.type === 'customize' || model.type === 'customize_life'">
        <el-input v-model="model.value2" placeholder="请输入标签名称" maxlength="6"></el-input>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 绑定与解绑模块 -->
    <div v-if="showAdminWindow" class="bindAdminWindo">
      <admin-control
        :companyInfo="companyInfo"
        :isNewCompany="isNewCompany"
        @close="closeAdmin"
        :AdduserInfo="userInfo"
        @closeAdminWindow="refresh"
        :isBindAdmin="isBindAdmin"
        :userName="personalInfo.name"
        :companyName="companyInfo ? companyInfo.companyName : ''"
        :nextAdmin="nextAdmin"
        :isFromUser="true"
        :isAdmin="companyInfo? companyInfo.isAdmin: 1"
        :companyId="companyInfo? companyInfo.id : 0"
      ></admin-control>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import ImageUploader from '@/components/imageUploader'
import adminControl from '@/components/adminControl/index'

import {
  uploadApi,
  getLabelProfessionalLiteracyListApi,
  getLabelProfessionalSkillsListApi,
  getLabelProfessionalOfficialListtypeApi
} from 'API/common'
import { getLabelPositionListApi } from 'API/position'
import {
  upload_api
} from '@/api/index.js'
import {
  editUserApi,
  closePublicPosisionApi,
  openPublicPosisionApi,
  getRecruiterBaseInfoApi,
  getRecruiterBriefApi,
  getRecruiterLabelApi,
  editUsermanageInfosApi,
  setRecruiterBriefApi,
  createLabelProfessionalSkillsApi,
  getRecruiterLabelsListsApi,
  addProfessionalSkillsLabelApi,
  setRecruiterLabelsApi,
  getLifeLabelsListsApi,
  addLifeLabelsApi,
  getofficialLifeLabelsApi
} from 'API/recruiter'

import {
  getApplyUserInfoApi,
  editApplyUserInfoApi,
  getRecruitersListApi
} from 'API/company'
import { getAccessToken } from '@/api/cacheService.js'
import { getLabelProfessionalOfficialListApi,
        postLabelProfessionalOfficialListApi,
        postLabelProfessionalOfficialListtypeApi
} from 'API/common'
// 邮箱
// eslint-disable-next-line no-useless-escape
export const emailReg = /^([a-zA-Z0-9]+[_|\_|\.|\-]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[-_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,8}$/
export const wechatReg = /^.{2,20}$/

@Component({
  name: 'EditRecruiter',
  components: {
    ImageUploader,
    adminControl
  }
})
export default class EditRecruiter extends Vue {
  showAdminWindow = false
  isNewCompany=false
  isBindAdmin = false;
  editBaseInfos = false
  editUserLabel = false
  editUserBreif = false
  editBelongCompany = false
  lifeLabelsLists = []
  companyInfo = {
    realname: '',
    avatarIds: [],
    avatars: [],
    companyEmail: '',
    companyId: '',
    companyInfo: '',
    createPositionRight: '',
    email: '',
    gender: '',
    identityAuth: 0,
    identityNum: '',
    isBlockCreatePosition: 0,
    mobile: '',
    name: '',
    needRealNameAuth: '',
    passportFront: '',
    passportFrontId: 0,
    position: '',
    status: '',
    uid: '',
    vkey: '',
  }
  options = [] // 职位标签列表
  clearable = true
  positionManage = {
    value: 'labelId',
    label: 'name',
    children: 'children'
  }; // 职位类别的配置
  /* 身份信息 */
  personalInfo = {
    name: '', // 姓名
    gender: '',
    realname: '', // 真实姓名
    idNum: '', // 身份证号码
    passportFront: '' // 身份证正面照片
  }
  model = {
    show: false,
    type: '',
    title: '',
    selected: [],
    list: [],
    value1: '100',
    value2: '',
    positionLabel: '',
    value3: 120000,
    avatar: {
      url: ''
    },
    width: 400,
    height: 400,
    tips: '建议尺寸400X400px，JPG、PNG格式，图片小于5M。',
    limit: 6
  }
  /* 身份信息 */
  userInfos = {
    name: '', // 姓名
    gender: '',
    realname: '',
    avatars: [],
    brief: '',
    createPositionRight: '1',
    skillLabels: [],
    literacyLabels: [],
    lifeLabels: [],
    positionTypeId: '',
    signature: '',
    position: '',
    email: '',
    wechat: '',
    oneSentenceIntro: ''
  };
  userInfo = {}
  nextAdmin = null; // 公司下一个管理员的信息
  labelProfessionalLiteracyList = []
  labelProfessionalSkillsList = []
  labelProfessionalOfficial = [] // 官方标签库
  officialObtainedType = [] // 已选择官方标签
  officialCustomize = ''// 自定义官方标签
  official = [] // 展示的官方标签
  // 关闭移除招聘官
  closeAdmin () {
    this.showAdminWindow = false
  }
  /* 移出公司 */
  async removeUser () {
    this.showAdminWindow = true
    this.isBindAdmin = true
    this.companyInfo.realName = this.userInfo.name
    if (this.companyInfo.isAdmin) {
      let param = {
        page: 1,
        count: 2
      }
      let res = await getRecruitersListApi(this.companyInfo.id, param)
      res.data.data.forEach(item => {
        if (this.userInfo.uid !== item.uid) {
          this.nextAdmin = item
        }
      })
    }
  }
  /* 绑定公司 */
  bindCompany () {
    this.showAdminWindow = true
    this.isBindAdmin = false
  }
  setRecruiterBrief () {
    if (this.userInfos.brief.trim() && (this.userInfos.brief.trim().length < 6 || this.userInfos.brief.trim().length > 5000)) {
      this.$message({
        message: '请输入有效的个人简介',
        type: 'warning'
      })
      return
    }
    setRecruiterBriefApi({ uid: this.$route.params.id, brief: this.userInfos.brief }).then(() => {
      this.editUserBreif = !this.editUserBreif
    })
  }
  switchPublicBtn (e) {
    let funcApi = e === 'y' ? openPublicPosisionApi : closePublicPosisionApi
    funcApi({ uid: this.$route.params.id })
  }
  removeLabelItem (index) {
    if (this.model.selected.length < 2) {
      this.$message({
        message: '至少选择一个标签',
        type: 'warning'
      })
      return
    }
    let item = this.model.selected.splice(index, 1)
    this.model.value3 = ''
    this.labelProfessionalLiteracyList.map(field => {
      if (field.labelId === item[0].labelId) field.active = false
    })
    this.model.list = [].concat(this.labelProfessionalLiteracyList)
  }
  removeLifeItem (index, item) {
    console.log(index, item)
    if (this.model.selected.length < 2) {
      this.$message({
        message: '至少选择一个标签',
        type: 'warning'
      })
      return
    }
    this.model.selected.splice(index, 1)
    if (item.source === 'diy') {
      this.userInfos.lifeLabels.map(field => {
        if (field.labelId === item.labelId) field.delete = 'true'
      })
    }
    let lifeLabelsLists = [].concat(this.lifeLabelsLists)
    lifeLabelsLists[0].children.map((e, i) => {
      if (item.labelId === e.labelId) e.active = false
    })
    lifeLabelsLists[1].children.map((e, i) => {
      if (item.labelId === e.labelId) e.active = false
    })
    this.lifeLabelsLists = lifeLabelsLists
  }
  getRecruiterBaseInfo () {
    return getRecruiterBaseInfoApi({ uid: this.$route.params.id })
      .then(res => {
        let userInfos = res.data.data
        this.userInfos = Object.assign(this.userInfos, userInfos)
        if (userInfos.avatars.length) this.model.avatar = userInfos.avatars[0]
      })
  }
  getRecruiterBrief () {
    return getRecruiterBriefApi({ uid: this.$route.params.id })
      .then(res => (this.userInfos = Object.assign(this.userInfos, { brief: res.data.data.brief })))
  }
  getRecruiterLabel () {
    return getRecruiterLabelApi({ uid: this.$route.params.id })
      .then(res => (this.userInfos = Object.assign(this.userInfos, { label: res.data.data })))
  }
  // 拿官方标签库
  getLabelProfessionalOfficialList () {
    getLabelProfessionalOfficialListApi ({ uid: this.$route.params.id })
    .then(res => {
      let datas = JSON.parse(JSON.stringify(res.data.data).replace(/id/g,"labelId"))
      this.labelProfessionalOfficial = datas
      this.labelProfessionalOfficial.forEach(item => {
      this.officialObtainedType.forEach(i => {
        item.active = false
        if(item.labelId === i.labelId) { item.active = true }
      })
    })
    })

  }
  // 拿当前招聘官已有的官方标签
  getLabelProfessionalOfficialListtype () {
    getLabelProfessionalOfficialListtypeApi ({ uid: this.$route.params.id })
    .then(res => {
      let data = res.data.data
      data.forEach(item => {
        item.active = true
      })
      this.official = JSON.parse(JSON.stringify(data))
      this.officialObtainedType = JSON.parse(JSON.stringify(data))
    })
  }
  getRecruiterLabelsLists () {
    return getRecruiterLabelsListsApi({ uid: this.$route.params.id }).then(res => {
      let literacyLabels = []
      let lifeLabels = []
      let skillLabels = []
      let list = res.data.data
      list.map(field => {
        field.active = true
        if (field.type === 'label_professional_literacy') literacyLabels.push(field)
        if (field.type === 'label_life') lifeLabels.push(field)
        if (field.type === 'label_professional_skills') skillLabels.push(field)
      })
      this.userInfos.literacyLabels = literacyLabels
      this.userInfos.lifeLabels = lifeLabels
      this.userInfos.skillLabels = skillLabels
    })
  }
  getUserInfo () {
    let funcApi = this.$route.query.isFromCheck ? getApplyUserInfoApi : getRecruiterBaseInfoApi
    // let isFromCheck = this.$route.query.isFromCheck
    return funcApi({ uid: this.$route.params.id, id: this.$route.params.id }).then(res => {
      let userInfos = res.data.data
      this.userInfo = userInfos
      this.isDetection = !userInfos.needRealNameAuth
      if (userInfos.companyInfo) {
        this.companyInfo = userInfos.companyInfo
      } else {
        this.companyInfo = { realname: '' }
      }
      this.createPositionRight = !!userInfos.createPositionRight
      this.phone = { mobile: userInfos.mobile }
      /* 身份信息 */
      this.personalInfo = {
        uid: userInfos.uid,
        name: userInfos.name, // 姓名
        gender: userInfos.gender,
        realname: userInfos.realname || '', // 真实姓名
        idNum: userInfos.identityNum || '', // 身份证号码
        passportFront: userInfos.passportFront
          ? userInfos.passportFront.middleUrl
          : '', // 身份证正面照片
        identityAuth: userInfos.identityAuth
      }
      let params = {
        uid: userInfos.uid,
        name: userInfos.name,
        gender: userInfos.gender,
        wechat: userInfos.wechat,
        signature: userInfos.signature,
        position: userInfos.position,
        email: userInfos.email,
        companyEmail: userInfos.companyEmail,
        avatars: userInfos.avatars,
        createPositionRight: String(userInfos.createPositionRight),
        companyInfo: userInfos.companyInfo,
        positionTypeId: userInfos.positionTypeId,
        oneSentenceIntro: userInfos.oneSentenceIntro
      }
      this.userInfos = Object.assign(this.userInfos, params)
      this.companyInfo = userInfos.companyInfo
    })
  }
  getLifeLabelsLists () {
    return getLifeLabelsListsApi().then(res => {
      let lifeLabelsLists = res.data.data
      lifeLabelsLists[0].children.map(field => {
        field.active = false
        field.source = 'system'
      })
      lifeLabelsLists[1].children.map(field => {
        field.active = false
        field.source = 'system'
      })
      this.lifeLabelsLists = lifeLabelsLists
    })
  }
  todoAction (type) {
    let literacyLabels = this.userInfos.literacyLabels.map(field => field.labelId)
    switch (type) {

      case 'official':
        
        this.model.show = true
        this.model.title = '添加官方标签'
        this.model.type = 'official'
        break

      case 'literacy':
        let literacy = [].concat(this.userInfos.skillLabels)
        if (literacy.length >= 3) {
          this.$message({ message: '最多只能添加三个技能标签', type: 'warning' })
          return
        }
        this.model.show = true
        this.model.title = '添加职业素养标签'
        this.model.type = 'literacy'
        this.model.selected = [].concat(this.userInfos.skillLabels, this.userInfos.literacyLabels)
        this.labelProfessionalLiteracyList.map(field => (field.active = !!literacyLabels.includes(field.labelId)))
        this.model.list = this.labelProfessionalLiteracyList
        break
      case 'customize':
        let customize = [].concat(this.userInfos.skillLabels, this.userInfos.literacyLabels)
        if (customize.length >= 3) {
          this.$message({ message: '最多只能添加三个技能标签', type: 'warning' })
          return
        }
        this.model.show = true
        this.model.title = '添加自定义标签'
        this.model.type = 'customize'
        break
      case 'skills':
        let skills = [].concat(this.userInfos.literacyLabels)
        if (skills.length >= 3) {
          this.$message({ message: '最多只能添加三个技能标签', type: 'warning' })
          return
        }
        let skillsList = [].concat(this.labelProfessionalSkillsList[0].children)
        let temSkillsLists = [].concat(this.userInfos.skillLabels, this.userInfos.literacyLabels)
        let temSkillsListsId = []
        if (temSkillsLists.length) {
          temSkillsLists.map(field => temSkillsListsId.push(field.labelId))
        }
        skillsList.map(field => {
          field.active = false
          if (temSkillsListsId.includes(field.labelId)) {
            field.active = true
          }
        })
        this.model.show = true
        this.model.title = '添加职业能力标签'
        this.model.type = 'skills'
        this.model.selected = temSkillsLists
        this.model.list = skillsList
        break
      case 'customize_life':
        let customize_life = [].concat(this.userInfos.lifeLabels)
        if (customize_life.length >= 3) {
          this.$message({ message: '最多只能添加三个生活标签', type: 'warning' })
          return
        }
        this.model.show = true
        this.model.title = '添加自定义标签'
        this.model.type = 'customize_life'
        break
      case 'life':
        let temLifeLists = [].concat(this.userInfos.lifeLabels)
        let temLifeListsId = []
        if (temLifeLists.length) {
          temLifeListsId = temLifeLists.map(field => field.labelId)
        }
        this.lifeLabelsLists[0].children.map(field => {
          field.active = false
          if (temLifeListsId.includes(field.labelId)) {
            field.active = true
          }
        })
        this.lifeLabelsLists[1].children.map(field => {
          field.active = false
          if (temLifeListsId.includes(field.labelId)) {
            field.active = true
          }
        })
        this.model.show = true
        this.model.title = '添加生活标签'
        this.model.type = 'life'
        this.model.selected = temLifeLists
        break
      case 'editBaseInfos':
        this.editBaseInfos = !this.editBaseInfos
        break
      case 'editUserLabel':
        this.editUserLabel = !this.editUserLabel
        break
      case 'editUserBreif':
        this.editUserBreif = !this.editUserBreif
        break
      default:
        break
    }
  }
  confirm () {
    let skillLabels = []
    let literacyLabels = []
    let lifeLabels = []
    // 设置默认值
    this.userInfos.literacyLabels.map(item => {
      literacyLabels.push({ labelId: item.labelId, source: item.source })
    })
    this.userInfos.lifeLabels.map(item => {
      lifeLabels.push({ labelId: item.labelId, source: item.source })
    })
    this.userInfos.skillLabels.map(item => {
      skillLabels.push({ labelId: item.labelId, source: item.source })
    })
    let data = {
      uid: this.$route.params.id,
      skillLabels,
      literacyLabels,
      lifeLabels
    }
    switch (this.model.type) {
      case 'literacy':
        data.literacyLabels = []
        data.skillLabels = []
        this.model.selected.map(item => {
          if (item.type === 'label_professional_skills') {
            data.skillLabels.push({ labelId: item.labelId, source: item.source })
          } else {
            data.literacyLabels.push({ labelId: item.labelId, source: item.source })
          }
        })
        this.setRecruiterLabels(data)
        break
      case 'life':
        data.lifeLabels = []
        this.model.selected.map(item => data.lifeLabels.push({ labelId: item.labelId, source: item.source }))
        this.setRecruiterLabels(data)
        break
      case 'skills':
        data.literacyLabels = []
        data.skillLabels = []
        this.model.selected.map(item => {
          if (item.type === 'label_professional_skills') {
            data.skillLabels.push({ labelId: item.labelId, source: item.source })
          } else {
            data.literacyLabels.push({ labelId: item.labelId, source: item.source })
          }
        })
        this.setRecruiterLabels(data)
        break
      case 'customize':
        addProfessionalSkillsLabelApi({ uid: this.$route.params.id, name: this.model.value2 }).then(res => {
          skillLabels.push(res.data.data)
          this.setRecruiterLabels(data)
        })
        break
      case 'customize_life':
        addLifeLabelsApi({ uid: this.$route.params.id, name: this.model.value2 }).then(res => {
          lifeLabels.push(res.data.data)
          this.setRecruiterLabels(data)
        })
        break
      case 'official':
        if (!this.officialObtainedType.length){ return }
        let labelIds = []
        let uid = this.$route.params.id
        this.officialObtainedType.forEach(item => {
          labelIds.push(item.labelId)
        })
        let datas = {
          uid: uid,
          labelIds: labelIds
        }
        postLabelProfessionalOfficialListtypeApi(datas)
        .then(res => {
          this.official = JSON.parse(JSON.stringify(this.officialObtainedType))
        })
        this.model.show = false
        break
      default:
        break
    }
    this.userInfos.skillLabels.map(field => delete field.delete)
    this.userInfos.literacyLabels.map(field => delete field.delete)
    this.userInfos.lifeLabels.map(field => delete field.delete)
  }
  setRecruiterLabels (data) {
    return setRecruiterLabelsApi(data).then(() => {
      this.model.show = false
      this.getRecruiterLabelsLists()
    })
  }
  close () {
    this.model.show = false
    this.showAdminWindow = false
    this.userInfos.skillLabels.map(field => delete field.delete)
    this.userInfos.literacyLabels.map(field => delete field.delete)
    this.userInfos.lifeLabels.map(field => delete field.delete)
    this.officialObtainedType = JSON.parse(JSON.stringify(this.official))
    this.labelProfessionalOfficial.forEach(item => {
      this.officialObtainedType.forEach(i => {
        item.active = false
        if(item.labelId === i.labelId) { item.active = true }
      })
    })
  }
  saveUser () {
    let params = {
      uid: this.$route.params.id,
      name: this.userInfos.name,
      gender: this.userInfos.gender,
      wechat: this.userInfos.wechat,
      signature: this.userInfos.signature,
      oneSentenceIntro: this.userInfos.oneSentenceIntro,
      position: this.userInfos.position,
      email: this.userInfos.email,
      companyEmail: this.userInfos.companyEmail,
      positionTypeId: this.userInfos.positionTypeId
    }
    if (this.userInfos.avatars.length) {
      params = Object.assign(params, { avatars: this.userInfos.avatars.map(field => field.id).join(',') })
    }
    if (!emailReg.test(params.email)) {
      this.$message({
        message: '请输入有效邮箱',
        type: 'warning'
      })
      return
    }
    if (params.wechat && !wechatReg.test(params.wechat)) {
      this.$message({
        message: '请输入有效的微信号',
        type: 'warning'
      })
      return
    }
    if (params.signature.trim() && (params.signature.trim().length < 6 || params.signature.trim().length > 30)) {
      this.$message({
        message: '请输入有效的个性签名',
        type: 'warning'
      })
      return
    }
    editUsermanageInfosApi(params).then(() => {
      this.editBaseInfos = !this.editBaseInfos
    })
  }
  getLabelProfessionalLiteracyList () {
    return getLabelProfessionalLiteracyListApi().then(res => (this.labelProfessionalLiteracyList = res.data.data))
  }
  getLabelProfessionalSkillsList () {
    return getLabelProfessionalSkillsListApi().then(res => (this.labelProfessionalSkillsList = res.data.data.labelProfessionalSkills))
  }
  createLabelProfessionalSkills () {
    return createLabelProfessionalSkillsApi({ uid: this.$route.params.id })
  }
  getLabelItem (index, item) {
    let selected = this.model.selected
    let result = this.labelProfessionalLiteracyList[index]
    let list = [].concat(this.labelProfessionalLiteracyList)
    if (this.model.selected.length > 2) {
      if (!result.active) {
        this.$message({ message: '最多只能添加三个标签', type: 'warning' })
      } else {
        list[index].active = false
        this.model.list = list
        selected.map((field, i) => {
          if (item.labelId === field.labelId) {
            selected.splice(i, 1)
          }
        })
        this.model.selected = selected
      }
    } else {
      if (!result.active) {
        list[index].active = !list[index].active
        item.active = true
        selected.push(item)
        this.model.list = list
        this.model.selected = selected
      } else {
        if (selected.length < 2) {
          this.$message({ message: '至少选择一个标签', type: 'warning' })
          return
        }
        list[index].active = false
        this.model.list = list
        selected.map((field, i) => {
          if (item.labelId === field.labelId) {
            selected.splice(i, 1)
          }
        })
        this.model.selected = selected
      }
    }
  }
  getLifeLabel (type, index, item) {
    let lifeLabelsLists = this.lifeLabelsLists
    let selected = this.model.selected
    switch (type) {
      case 'xingge':
        selected = this.model.selected
        if (selected.length > 2) {
          if (!item.active) {
            this.$message({ message: '最多只能添加三个标签', type: 'warning' })
          } else {
            lifeLabelsLists[0].children[index].active = !lifeLabelsLists[0].children[index].active
            lifeLabelsLists[0].children[index].source = 'system'
            this.lifeLabelsLists = lifeLabelsLists
            selected.map((field, i) => {
              if (item.labelId === field.labelId) {
                selected.splice(i, 1)
              }
            })
            this.model.selected = selected
          }
        } else {
          if (!item.active) {
            lifeLabelsLists[0].children[index].active = !lifeLabelsLists[0].children[index].active
            item.active = true
            selected.push(item)
            this.lifeLabelsLists = lifeLabelsLists
            this.model.selected = selected
          } else {
            if (selected.length < 2) {
              this.$message({ message: '至少选择一个标签', type: 'warning' })
              return
            }
            lifeLabelsLists[0].children[index].active = false
            this.lifeLabelsLists = lifeLabelsLists
            selected.map((field, i) => {
              if (item.labelId === field.labelId) {
                selected.splice(i, 1)
              }
            })
            this.model.selected = selected
          }
        }
        break
      case 'shenghuo':
        selected = this.model.selected
        if (selected.length > 2) {
          if (!item.active) {
            this.$message({ message: '最多只能添加三个标签', type: 'warning' })
          } else {
            lifeLabelsLists[1].children[index].active = !lifeLabelsLists[1].children[index].active
            lifeLabelsLists[1].children[index].source = 'system'
            this.lifeLabelsLists = lifeLabelsLists
            selected.map((field, i) => {
              if (item.labelId === field.labelId) {
                selected.splice(i, 1)
              }
            })
            this.model.selected = selected
          }
        } else {
          if (!item.active) {
            lifeLabelsLists[1].children[index].active = !lifeLabelsLists[1].children[index].active
            item.active = true
            selected.push(item)
            this.lifeLabelsLists = lifeLabelsLists
            this.model.selected = selected
          } else {
            if (selected.length < 2) {
              this.$message({ message: '至少选择一个标签', type: 'warning' })
              return
            }
            lifeLabelsLists[1].children[index].active = false
            this.lifeLabelsLists = lifeLabelsLists
            selected.map((field, i) => {
              if (item.labelId === field.labelId) {
                selected.splice(i, 1)
              }
            })
            this.model.selected = selected
          }
        }
        break
      default:
        break
    }
  }
  changeSkills (e) {
    let item = this.labelProfessionalSkillsList.find(field => field.labelId === e)
    let list = item.children
    let temSkillsLists = [].concat(this.userInfos.skillLabels, this.userInfos.literacyLabels)
    let temSkillsListsId = []
    if (temSkillsLists.length) {
      temSkillsLists.map(field => temSkillsListsId.push(field.labelId))
    }
    list.map(field => {
      field.source = 'system'
      if (temSkillsListsId.includes(field.labelId)) field.active = true
    })
    this.model.list = list
  }
  // 删除已经选择的官方标签
  removeOfficial (index,item) {
    if (this.officialObtainedType.length < 2) {
      this.$message({
        message: '至少选择一个标签',
        type: 'warning'
      })
      return
    }
    this.officialObtainedType.splice(index, 1)
    item.active = false
    this.labelProfessionalOfficial.forEach(i => {
      if(i.labelId === item.labelId){ i.active = false }
    })
  }

  removeSkills (index, data) {
    if (this.model.selected.length < 2) {
      this.$message({
        message: '至少选择一个标签',
        type: 'warning'
      })
      return
    }
    let item = this.model.selected.splice(index, 1)
    if (data.type === 'label_professional_skills') {
      this.userInfos.skillLabels.map(field => {
        if (field.labelId === data.labelId) field.delete = 'true'
      })
    } else {
      this.userInfos.literacyLabels.map(field => {
        if (field.labelId === data.labelId) field.delete = 'true'
      })
    }
    this.model.value3 = ''
    this.model.list.map(field => {
      if (field.labelId === item[0].labelId) field.active = false
    })
  }

  // 从官方标签库中选择一个标签添加进已选择
  getOfficial (index,item) {
    if (this.officialObtainedType.length > 1) {
      this.$message({ message: '最多只能添加两个标签', type: 'warning' })
      return
    }
    if (item.active === true){ return }
    
    this.officialObtainedType.push(this.labelProfessionalOfficial[index])
    item.active = true
  }
  // 自定义官方标签
  getofficialCustomize () {
    let label = []
    let officialCustomize = this.officialCustomize
    if(!officialCustomize){ return }
    if (this.officialObtainedType.length > 1) {
      this.$message({ message: '最多只能添加两个标签', type: 'warning' })
      return
    }
    postLabelProfessionalOfficialListApi({ name : officialCustomize })
    .then(res => {
      let data = {
        labelId: res.data.data.labelId,
        name: officialCustomize,
        active: true
      }
      this.officialObtainedType.push(data)
    })
    this.officialCustomize = '' // 初始化输入框value
  }

  getSkillsItem (index, item) {
    let list = [].concat(this.model.list)
    let selected = this.model.selected
    let result = this.model.list[index]
    if (this.model.selected.length > 2) {
      if (!result.active) {
        this.$message({ message: '最多只能添加三个标签', type: 'warning' })
      } else {
        list[index].active = false
        this.model.list = list
        selected.map((field, i) => {
          if (item.labelId === field.labelId) {
            selected.splice(i, 1)
          }
        })
        this.model.selected = selected
      }
    } else {
      if (!result.active) {
        list[index].active = !list[index].active
        item.active = true
        selected.push(item)
        this.model.list = list
        this.model.selected = selected
      } else {
        if (selected.length < 2) {
          this.$message({ message: '至少选择一个标签', type: 'warning' })
          return
        }
        list[index].active = false
        this.model.list = list
        selected.map((field, i) => {
          if (item.labelId === field.labelId) {
            selected.splice(i, 1)
          }
        })
        this.model.selected = selected
      }
    }
  }
  handleAvatarLoaded (e) {
    let formData = new FormData()
    formData.append('attach_type', 'img')
    formData.append('img', e)
    uploadApi(formData).then(res => (this.model.avatar = res.data.data[0]))
  }
  /**
   * @Author   小书包
   * @DateTime 2018-12-03
   * @detail  点击选择图片
   * @return   {[type]}   [description]
   */
  handleChooseImage (dom) {
    document.querySelector(dom).click()
    document.querySelector(dom).value = ''
  }
  /**
   * @Author   小书包
   * @DateTime 2018-12-03
   * @detail   处理选中的图片
   * @return   {[type]}   [description]
   */
  handleChangeImage (dom) {
    let fileLists = document.querySelector(dom).files
    fileLists = Array.from(fileLists).slice(0, this.model.limit - this.userInfos.avatars.length)
    Array.from(fileLists).map((file, index) => {
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
        if (isLt5M) {
          this.$message.error('上传的图片大小是5MB~')
          return false
        }
      }
      // 读取完成，无论成功失败
      reader.onloadend = (res) => {}
      formData.append(`img${index + 1}`, file)
      formData.append('attach_type', 'img')
      this.xhr = new XMLHttpRequest()
      if (this.userInfos.avatars.length !== this.model.limit) {
        this.handleUploadImage(formData)
      }
    })
  }
  /**
   * @Author   小书包
   * @DateTime 2018-12-03
   * @detail   上传选中的图片
   * @return   {[type]}         [description]
   */
  handleUploadImage (formData) {
    this.xhr.open('post', upload_api, true)
    this.xhr.setRequestHeader('Authorization-Admin', getAccessToken())
    // 上传成功
    this.xhr.onload = (res) => {
      this.userInfos.avatars.unshift(JSON.parse(res.target.responseText).data[0])
    }
    // 上传失败
    this.xhr.onerror = (res) => {}
    // 上传进度
    this.xhr.upload.onprogress = (res) => {}
    this.xhr.send(formData)
  }
  /**
   * @Author   小书包
   * @DateTime 2018-11-23
   * @detail   取消某一张图片上传
   * @return   {[type]}        [description]
   */
  handleRemoveUploadImage (index) {
    this.userInfos.avatars.splice(index, 1)
  }
  editUsermanageInfos (userInfo) {
    let uid = this.$route.params.id
    let funcApi = this.$route.query.isFromCheck ? editApplyUserInfoApi : editUserApi
    let tem = { real_name: userInfo.name, gender: userInfo.gender }
    let params = this.$route.query.isFromCheck ? tem : userInfo
    return funcApi(uid, params)
  }
  refresh () {
    this.showAdminWindow = false
    this.init()
  }
  init () {
    this.getUserInfo()
    this.ManageList()
    this.getLabelProfessionalLiteracyList()
    this.getLabelProfessionalSkillsList()
    // this.getRecruiterBaseInfo()
    this.getLabelProfessionalOfficialListtype()
    this.getRecruiterBrief()
    this.getRecruiterLabel()
    this.getRecruiterLabelsLists()
    this.getLabelProfessionalOfficialList() // 拿招聘官官方标签库
    this.getLifeLabelsLists()
  }
  created () {
    this.init()
  }
  typeCategoryfun (e) {
    this.positionTypeId = e[e.length - 1]
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
}
</script>

<style lang="less" scoped="scoped">
#edit_recruiter{
  margin: 20px 20px 20px 220px;
  text-align: left;
  background: white;
  border: 1px solid #cccccc;
  padding: 20px;
  h3{
    color: #354048;
    font-size: 20px;
    padding-bottom: 16px;
    padding-left: 10px;
    border-bottom: 1px solid #ebeef5;
    margin-bottom: 32px;
  }
  .m_h1{
    margin-bottom: 5px;
  }
  .m_h2{
    margin-bottom: 10px;
    font-size: 20px;
    color: #000;
  }
  .label_ul {
    height: 40px;
    li{
      padding: 0 20px;
      line-height: 30px;
      box-sizing: border-box;
      border-width: 1px;
      border-style: solid;
      border-color: #ccc;
      border-radius: 2px;
      -moz-box-shadow: none;
      -webkit-box-shadow: none;
      box-shadow: none;
      vertical-align: middle;
      display: inline-block;
      margin-right: 20px;
      cursor: pointer;
    }
    .active{
      border-color: #3a8ee6;
      color: #3a8ee6;
    }
  }
  .html_content_box{
    height: 250px;
    overflow: hidden;
    overflow-y: scroll;
  }
  .html_content_box::-webkit-scrollbar {
   width: 4px;
  }
  .html_content_box::-webkit-scrollbar-track {
   background:rgba(0,0,0,.1);
   -webkit-border-radius: 20px;
   -moz-border-radius: 20px;
   border-radius:20px;
  }
  .html_content_box::-webkit-scrollbar-thumb {
   background:rgba(0,0,0,1);
   -webkit-border-radius: 20px;
   -moz-border-radius: 20px;
   border-radius:20px;
  }
  .el-dialog__body{
    padding-top: 0;
    padding-bottom: 0;
  }
  .label_ul_dialog {
    li{
      padding: 0 20px;
      line-height: 30px;
      box-sizing: border-box;
      border-width: 1px;
      border-style: solid;
      border-color: #ccc;
      border-radius: 2px;
      -moz-box-shadow: none;
      -webkit-box-shadow: none;
      box-shadow: none;
      vertical-align: middle;
      display: inline-block;
      margin-right: 10px;
      cursor: pointer;
      margin-bottom: 10px;
    }
    .active{
      border-color: #3a8ee6;
      color: #3a8ee6;
    }
  }
  .html_content_box_01{
    margin: 20px;
  }
  .common-list {
    li {
      width:88px;
      height:88px;
      background:rgba(245,247,250,1);
      border-radius:4px;
      position: relative;
      display: inline-block;
      margin-right: 24px;
      margin-bottom: 24px;
      img {
        width: 100%;
        height: 100%;
      }
      &:hover{
        .btn-close{
          opacity: 1
        }
      };
    }
    .upload-li {
      position: relative;
      box-sizing: border-box;
      border: dotted 1px #DCDCDC;
      background: #f5f7fa;
      border-radius: 5px;
      overflow: hidden;
      .el-upload {
        width: 100%;
        height: 100%;
      }
      .el-icon-plus {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: #DCDCDC;
        font-size: 24px;
      }
    }
    .btn-close{
      position: absolute;
      top: 0;
      right: 0;
      color: #BCBCBC;
      font-size: 20px;
      line-height: 1;
      cursor: pointer;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,.6);
      z-index: 2;
      text-align: center;
      line-height: 88px;
      border-radius: 5px;
      overflow: hidden;
      color: white;
      transition: all ease .4s;
      opacity: 0;
    }
  }
  .bindAdminWindo {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    z-index: 1000;
  }
}
</style>
<style lang="less">
#edit_recruiter{
  .el-dialog__body{
    padding-top: 0;
    padding-bottom: 0;
  }
}
</style>
