<template>
  <div class="editCompanyInfo">
    <!--头部-->
    <div class="header">
      <div class="left">
        <span class="title">身份认证信息</span>
      </div>
      <div class="editBox">
        <el-button class="inquire" @click.stop="save">保存</el-button>
      </div>
    </div>
    <!--公司信息表格-->
    <div class="companyInfo">
      <div class="point">上传工牌/名片/在职证明等信息需要与身份信息保持一致</div>
      <el-form class="edit-form" ref="form" :model="personalInfo" label-width="150px" label-suffix="：">
        <h3>个人信息</h3>

        <el-form-item label="姓名" prop="title">
          <el-input v-model="personalInfo.name" :disabled="true" placeholder="请输入姓名" :maxlength="30" style="width: 400px;"></el-input>
        </el-form-item>

        <el-form-item label="公司职务" prop="title">
          <el-input v-model="personalInfo.user_position" placeholder="请输入公司职务" :disabled="true" :maxlength="30" style="width: 400px;"></el-input>
        </el-form-item>

        <el-form-item label="公司邮箱" prop="title">
          <el-input v-model="personalInfo.user_email" placeholder="请输入公司邮箱" :disabled="true" :maxlength="30" style="width: 400px;"></el-input>
        </el-form-item>

        <el-form-item label="手机号码" prop="title">
          <el-input v-model="personalInfo.mobile" placeholder="请输入手机号码" :disabled="true" :maxlength="30" style="width: 400px;"></el-input>
        </el-form-item>

        <h3>身份信息</h3>
        <el-form-item label="真实姓名" prop="title">
          <el-input v-model="personalInfo.real_name" placeholder="请输入真实姓名" :maxlength="20" style="width: 400px;"></el-input>
        </el-form-item>

        <el-form-item label="身份证号码" prop="title">
          <el-input v-model="personalInfo.identity_num" placeholder="请输入身份证号码" :maxlength="18" style="width: 400px;"></el-input>
        </el-form-item>

        <!--<el-form-item label="有效期" prop="date1">
          <el-date-picker type="date" value-format="yyyy-MM-dd" placeholder="选择日期" v-model="personalInfo.validity" style="width: 100%;"></el-date-picker>
        </el-form-item>-->
        <!--身份证开始时间-->
        <el-form-item label="开始有效时间" prop="date1">
          <el-date-picker type="date" value-format="yyyy-MM-dd" placeholder="选择开始日期" v-model="personalInfo.validity_start" style="width: 100%;"></el-date-picker>
        </el-form-item>
        <!--身份证过期时间-->
        <el-form-item label="有效期结束时间" prop="date1">
          <el-date-picker type="date" value-format="yyyy-MM-dd" placeholder="选择过期日期" v-model="personalInfo.validity_end" style="width: 100%;"></el-date-picker>
        </el-form-item>

        <h3>认证材料</h3>
        <!--身份证正面-->
        <el-form-item class="full" label="身份证正面" prop="icon">
          <image-uploader :width="iconUploader.width"
                          :height="iconUploader.height"
                          :tips="iconUploader.tips"
                          type="front"
                          v-model="form.icon1"
                          @loaded="handleIconLoaded"/>
        </el-form-item>
        <!--身份证背面-->
        <el-form-item class="full" label="身份证反面" prop="icon">
          <image-uploader :width="iconUploader.width"
                          :height="iconUploader.height"
                          :tips="iconUploader.tips"
                          type="reverse"
                          v-model="form.icon2"
                          @loaded="handleIconLoaded"/>
        </el-form-item>
        <!--手持身份证照-->
        <el-form-item class="full" label="手持身份证照" prop="icon">
          <image-uploader :width="iconUploader.width"
                          :height="iconUploader.height"
                          :tips="iconUploader.tips"
                          type="handheld"
                          v-model="form.icon3"
                          @loaded="handleIconLoaded"/>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import ImageUploader from '@/components/imageUploader'
import { fieldApi, uploadApi } from 'API/commont'
import { editIdentityApi, getIdentityApi } from 'API/company'
@Component({
  name: 'editCompany',
  components: {
    ImageUploader
  }
})
export default class editCompany extends Vue {
  /* 图片信息 */
  form = {
    icon1: '', // 身份证正面
    icon2: '', // 身份证背面
    icon3: '' // 手持身份证
  }
  /* 提示语 */
  iconUploader = {
    point: '',
    width: 280,
    height: 158,
    tips: '建议尺寸280X158px，JPG、PNG格式，图片小于5M。'
  }
  /* 身份信息 */
  personalInfo = {
    name: '', // 姓名
    company_id: '', // 公司id
    user_email: '', // 邮箱地址
    user_position: '', // 担任职务
    real_name: '', // 真实姓名
    //  mobile: '', // 手机号
    identity_num: '', // 身份证号码
    validity: '', // 有效期
    validity_start: '', // 开始有效期
    validity_end: '',
    passport_front: '', // 身份证正面照片
    passport_reverse: '', // 身份证反面照
    handheld_passport: '' // 手持身份证照
  }
  /* 所属行业 */
  industry = []
  /* 保存 */
  save () {
    const { id } = this.$route.query
    editIdentityApi(id, this.personalInfo).then(res => {
      let that = this
      this.active += 2
      this.$message({
        message: '身份信息保存成功',
        type: 'success'
      })
      setTimeout(function () {
        that.$router.push({
          path: '/index'
        })
      }, 1000)
    }).catch(err => {
      this.$message.error(`${err.data.msg}`)
    })
  }
  /* 编辑图片 */
  handleIconLoaded (e) {
    let formData = new FormData()
    formData.append('attach_type', 'img')
    formData.append('img', e)
    uploadApi(formData).then(res => {
      if (e.uploadType === 'front') {
        this.personalInfo.passport_front = res.data.data[0].id
      } else if (e.uploadType === 'reverse') {
        this.personalInfo.passport_reverse = res.data.data[0].id
      } else if (e.uploadType === 'handheld') {
        this.personalInfo.handheld_passport = res.data.data[0].id
      }
    })
  }
  /* 所属行业标签 */
  getfieldList () {
    fieldApi().then(res => {
      this.industry = res.data.data
    })
  }
  /* 获取编辑的公司信息 */
  getCompanyInfo () {
    const { id } = this.$route.query
    getIdentityApi(id).then(res => {
      this.form = {
        icon1: res.data.data.passportFrontInfo.middleUrl,
        icon2: res.data.data.passportReverseInfo.middleUrl,
        icon3: res.data.data.handheldPassportInfo.middleUrl
      }
      //    /* 身份信息 */
      this.personalInfo = {
        name: res.data.data.realName, // 姓名
        company_id: res.data.data.id, // 公司id
        user_email: res.data.data.companyInfo.userEmail, // 邮箱地址
        user_position: res.data.data.companyInfo.userPosition, // 担任职务
        real_name: res.data.data.realName, // 真实姓名
        //      mobile: '', // 手机号
        identity_num: res.data.data.identityNum, // 身份证号码
        validity: res.data.data.validity, // 有效期
        validity_start: res.data.data.validityStart, // 有效期开始
        validity_end: res.data.data.validityEnd, // 有效期结束
        passport_front: res.data.data.passportFrontInfo.id, // 身份证正面照片
        passport_reverse: res.data.data.passportReverseInfo.id, // 身份证反面照
        handheld_passport: res.data.data.handheldPassportInfo.id // 手持身份证照
      }
    })
  }
  created () {
    this.getfieldList()
    this.getCompanyInfo()
  }
}
</script>

<style lang="less" scoped="scoped">
.editCompanyInfo{
  margin-left: 200px;
  padding: 22px;
}
.header{
  padding: 22px;
  box-sizing: border-box;
  border-radius: 4px;
  border: 1px solid #BCBCBC;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .el-steps{
    text-align: left;
    width: 500px;
  }
}
/*公司信息*/
.companyInfo
{
  text-align: left;
  .point{
    font-size: 14px;
    color: #FFFFFF;
    background-color: #652791;
    padding: 10px;
    text-align: center;
    margin-bottom: 30px;
  }
}
.inquire{
  background-color: #652791;
  color: #FFFFFF;
  border-radius: 4px;
}
</style>
