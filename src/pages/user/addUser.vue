<!--创建公司-->
<template>
  <div class="createCompany">
    <div class="header">
      <div class="creatTab" @click.stop="tab">
        <div class="userInfo active">基本信息</div>
      </div>
      <el-button @click.stop="saveUser" v-if="!isEdit">保存并通过</el-button>
      <el-button @click.stop="saveUser" v-else>保存编辑</el-button>
    </div>
    <!--身份信息表格-->
    <div class="personalInfo">
      <div class="point">上传工牌/名片/在职证明等信息需要与身份信息保持一致</div>
      <el-form
        class="edit-form"
        ref="mobile"
        :rules="mobile"
        :model="phone"
        label-width="150px"
        label-suffix="："
      >
        <h3>账号信息</h3>
        <el-form-item label="手机号码" prop="mobile">
          <el-input
            v-model="phone.mobile"
            placeholder="请输入手机号码"
            :maxlength="11"
            style="width: 250px;"
            v-if="!isEdit"
          ></el-input>
          <el-input
            v-model="phone.mobile"
            disabled
            placeholder="请输入手机号码"
            :maxlength="11"
            style="width: 250px;"
            v-else
          ></el-input>
        </el-form-item>
      </el-form>

      <el-form
        class="edit-form"
        ref="personalInfo"
        :rules="personalInfoRules"
        :model="personalInfo"
        label-width="150px"
        label-suffix="："
      >
        <h3>个人信息</h3>
        <el-form-item label="姓名" prop="name">
          <el-input
            v-model="personalInfo.name"
            placeholder="请输入姓名"
            :maxlength="20"
            style="width: 215px;"
          ></el-input>
        </el-form-item>

        <el-form-item label="性别" prop="gender">
          <el-select class="selectState" v-model="personalInfo.gender" placeholder="请选择性别">
            <el-option label="未选择" value="0"></el-option>
            <el-option label="男" value="1"></el-option>
            <el-option label="女" value="2"></el-option>
          </el-select>
        </el-form-item>

        <template v-if="editIdentityAuth !== 1">
          <h3>身份信息</h3>
          <el-form-item label="真实姓名" prop="realname">
            <el-input
              v-model="personalInfo.realname"
              placeholder="请输入真实姓名"
              :maxlength="20"
              style="width: 400px;"
            ></el-input>
          </el-form-item>

          <el-form-item label="身份证号码" prop="idNum">
            <el-input
              v-model="personalInfo.idNum"
              placeholder="请输入身份证号码"
              :maxlength="18"
              style="width: 400px;"
            ></el-input>
          </el-form-item>

          <!--身份证正面-->
          <el-form-item class="full" label="身份证正面" prop="icon">
            <image-uploader
              :width="iconUploader.width"
              :height="iconUploader.height"
              :tips="iconUploader.tips"
              type="front"
              v-model="form.icon3"
              @loaded="handleIconLoaded"
            />
          </el-form-item>
          <el-button class="detection" type="danger" round @click.stop="detectionInfo">提交校验身份证信息</el-button>
        </template>
        <template v-else>
          <h3>
            身份信息
            <span class="status" v-show="editIdentityAuth === 1">
              <i class="el-icon-success" style="color: #67C23A;"></i> 验证通过
            </span>
          </h3>
          <el-form-item label="真实姓名" prop="realname">
            <span>{{personalInfo.realname}}</span>
          </el-form-item>

          <el-form-item label="身份证号码" prop="idNum">
            <span>{{personalInfo.idNum}}</span>
          </el-form-item>

          <!--身份证正面-->
          <el-form-item class="full" label="身份证正面" prop="icon">
            <img class="frontImg" :src="form.icon3" alt style="width:400px;height:300px;" />
          </el-form-item>
        </template>
      </el-form>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import ImageUploader from '@/components/imageUploader'
import { uploadIdcardApi } from 'API/commont'
import {
  detectionMobileApi,
  checkUserauthApi,
  createdUserApi,
  getUserInfoApi,
  editUserauthApi,
  editUserApi
} from 'API/recruiter'
import {
  getApplyUserInfoApi,
  editApplyUserInfoApi
} from 'API/company'
@Component({
  name: 'addUser',
  components: {
    ImageUploader
  }
})
export default class addUser extends Vue {
  isEdit = false; // 是否编辑用户，默认为创建用户
  editIdentityAuth = 0; // 编辑用户的身份验证状态，默认未提交
  checkUid = '';
  pop = {
    isShow: false,
    type: 'position'
  };
  isDetection = false; // 是否已校验身份证信息
  /* 身份证信息对象 */
  iDCard = {};
  /* 手机号码 */
  phone = {
    mobile: ''
  };
  /* 身份信息 */
  personalInfo = {
    name: '', // 姓名
    gender: '',
    realname: '', // 真实姓名
    idNum: '', // 身份证号码
    passportFront: '' // 身份证正面照片
  };
  iconUploader = {
    point: '',
    width: 400,
    height: '',
    tips: '建议尺寸400X400px，JPG、PNG格式，图片小于5M。'
  };
  form = {
    icon3: '' // 身份证正面
  };
  /* 自定义校验手机规则 */
  phoneRule = (rule, value, callback) => {
    detectionMobileApi({ mobile: this.phone.mobile }).then(res => {
      if (res.data.data.isExisted) {
        callback(new Error('号码已经被注册'))
      } else {
        callback()
      }
    })
  };
  // 校验手机
  mobile = {
    mobile: [
      {
        required: true,
        message: '请输入正确的手机号码',
        trigger: 'blur',
        min: 11,
        max: 11
      },
      { validator: this.phoneRule, trigger: 'blur' }
    ]
  };
  // 身份信息表单验证
  personalInfoRules = {
    name: [
      {
        required: true,
        message: '请输入姓名，要求2-20个字',
        trigger: 'blur',
        max: 20,
        min: 2
      }
    ],
    gender: [{ required: true, message: '请选择性别', trigger: 'blur' }]
  };
  /* 调用创建或编辑 */
  editOrCreat (userInfo) {
    if (this.isEdit) {
      if (this.$route.query.isFromCheck) {
        let param = {
          real_name: this.personalInfo.name,
          gender: this.personalInfo.gender
        }
        return editApplyUserInfoApi(this.$route.params.id, param)
      } else {
        const uid = this.$route.params.id
        return editUserApi(uid, userInfo)
      }
    } else {
      return createdUserApi(userInfo)
    }
  }
  /* 创建或编辑用户 */
  saveUser () {
    let newUser = {}
    if (this.isDetection) {
      newUser = Object.assign({}, this.personalInfo, this.phone)
    } else {
      let param = {
        real_name: this.personalInfo.name,
        name: this.personalInfo.name,
        gender: this.personalInfo.gender
      }
      newUser = Object.assign({}, param, this.phone)
    }
    this.$refs['personalInfo'].validate(async valid => {
      if (valid) {
        let create_resume = this.$route.query.create_resume || false
        let up_router = sessionStorage.getItem(
          'up_router'
        ) /* 如果需要取上级路由，需要在上级路由缓存该路由path */
        this.editOrCreat(newUser).then(res => {
          this.$message({
            message: this.isEdit ? '编辑成功' : '用户创建成功',
            type: 'success'
          })
          if (this.isEdit) {
            /* 常规操作 处于编辑状态回退到user页面 */
            this.$router.replace({
              path: `/user`,
              query: { isNeedLoad: true }
            })
          } else {
            // 其余页面 进入创建用户界面 统一通过up_router 缓存上一级页面，进行回退，需要特殊处理的 下方判断
            let userInfo = {
              mobile: newUser.mobile,
              name: newUser.real_name,
              gender: newUser.gender
            }
            if (create_resume) {
              let name = `createNewResume`
              let resumeType = this.$route.query.resumetype === 2
              if (resumeType) {
                userInfo.uid = newUser.uid
                name = `postResume`
              }
              // 重定向到创建微简历
              this.$router.replace({
                name: name,
                query: {
                  userInfo: JSON.stringify(userInfo)
                }
              })
            } else {
              this.$router.replace({
                path: up_router,
                query: {
                  userInfo: JSON.stringify(userInfo),
                  id: this.$route.query.id
                }
              })
            }
          }
        })
      } else {
        return false
      }
    })
  }

  /* 上传身份证图片 */
  handleIconLoaded (e) {
    let formData = new FormData()
    formData.append('attach_type', 'img')
    formData.append('img', e)
    uploadIdcardApi(formData)
      .then(res => {
        let { idCardInfo, file } = res.data.data[0]
        this.personalInfo.realname = idCardInfo.name
        this.personalInfo.idNum = idCardInfo.num
        this.personalInfo.passportFront = file.id
      })
      .catch(() => {
        this.form.icon3 = ''
      })
  }

  checkUserauth (param) {
    if (this.isEdit) {
      let uid = ''
      if (this.$route.query.isFromCheck) {
        uid = this.checkUid
      } else {
        uid = this.$route.params.id
      }
      return editUserauthApi(uid, param)
    } else {
      return checkUserauthApi(param)
    }
  }

  /* 身份证信息校验 */
  async detectionInfo () {
    if (!this.personalInfo.passportFront) {
      this.$message.error(`请上传正确清晰的身份证图片`)
      return
    }
    let param = {
      realname: this.personalInfo.realname,
      idNum: this.personalInfo.idNum,
      passportFront: this.personalInfo.passportFront
    }
    let res = await this.checkUserauth(param)
    if (res.data.data.pass) {
      if (!this.isEdit) this.isDetection = true
      this.$message({
        message: '身份证信息校验成功，校验有效时间为15分钟，请及时提交创建',
        type: 'success'
      })
    } else {
      this.$message.error(`信息校验失败，请确认上传信息无误`)
    }
  }
  getApplyUserInfo () {
    if (this.$route.query.isFromCheck) {
      return getApplyUserInfoApi(this.$route.params.id)
    } else {
      return getUserInfoApi(this.$route.params.id)
    }
  }
  /* 获取编辑用户的信息 */
  async getUserInfo () {
    const isFromCheck = this.$route.query.isFromCheck
    let res = await this.getApplyUserInfo()
    let eidtUser = res.data.data
    this.editIdentityAuth = eidtUser.identityAuth || eidtUser.identityInfo
    /* 手机号码 */
    this.phone.mobile = eidtUser.mobile
    /* 身份信息 */
    this.personalInfo = {
      name: eidtUser.name || eidtUser.realName, // 姓名
      gender: String(eidtUser.gender),
      realname: !isFromCheck
        ? eidtUser.realname
        : eidtUser.identityInfo.realName, // 真实姓名
      idNum: !isFromCheck
        ? eidtUser.identityNum
        : eidtUser.identityInfo.identityNum, // 身份证号码
      passportFront: !isFromCheck
        ? eidtUser.passportFrontId
        : eidtUser.passportFront // 身份证正面照片
    }
    if (this.$route.query.isFromCheck) {
      this.checkUid = eidtUser.uid
      this.form.icon3 = eidtUser.identityInfo.passportFrontInfo
        ? eidtUser.identityInfo.passportFrontInfo.url
        : ''
    } else {
      this.form.icon3 = eidtUser.passportFront
        ? eidtUser.passportFront.url
        : ''
    }
  }

  created () {
    if (!this.$route.params.id) return
    this.isEdit = true
    if (this.$route.query.isFromCheck) {
      this.getUserInfo()
    } else {
      this.getUserInfo()
    }
  }
}
</script>

<style lang="less" scoped="scoped">
.createCompany {
  margin-left: 200px;
  padding: 22px;
  .header {
    padding-right: 20px;
    box-sizing: border-box;
    border-radius: 4px 4px 0 0;
    height: 80px;
    border: 1px solid #cccccc;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .creatTab {
      height: 100%;
      > div {
        cursor: pointer;
        line-height: 80px;
        border: 1px solid #cccccc;
        width: 100px;
        height: 100%;
        display: inline-block;
        &.active {
          background-color: #652791;
          border: none;
          color: #ffffff;
        }
      }
    }
  }
  /*公司信息*/
  .companyInfo,
  .personalInfo,
  .sales {
    padding: 0 32px;
    text-align: left;
    border: 1px solid #cccccc;
    .point {
      font-size: 14px;
      color: #ffffff;
      background-color: #652791;
      padding: 10px;
      text-align: center;
      margin-bottom: 30px;
      margin-left: -32px;
      margin-right: -32px;
    }
  }
  .sales {
    border-radius: 4px;
    padding: 30px 32px;
    h3 {
      font-size: 25px;
      font-weight: 500;
      color: #652791;
    }
  }
  .companyInfo,
  .personalInfo {
    border: 1px solid #cccccc;
    border-radius: 4px;
    h3 {
      color: #354048;
      font-size: 20px;
      padding-bottom: 16px;
      padding-left: 10px;
      border-bottom: 1px solid #ebeef5;
      margin-bottom: 32px;
    }
  }
  .addAdress {
    cursor: pointer;
  }
  .AdressList {
    cursor: pointer;
    white-space: nowrap;
    i {
      margin-right: 5px;
      cursor: pointer;
    }
    display: block;
  }
  .email {
    color: #652791;
    cursor: pointer;
  }
  .detection {
    margin-left: 120px;
    margin-bottom: 30px;
  }
}
</style>
