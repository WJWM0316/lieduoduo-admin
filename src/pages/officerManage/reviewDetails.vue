<!--招聘官审核详情-->
<template>
  <div class="reviewDetail">
    <!--加入公司审核-->
    <div class="companyCheck">
      <div class="companyName"><span class="label">加入公司</span><div>{{personalInfo.companyName}}</div></div>
      <div class="companyName"><span class="label">加入方式</span>
        <div v-show="personalInfo.joinType === 0">未选择</div>
        <div v-show="personalInfo.joinType === 1">管理员认证</div>
        <div v-show="personalInfo.joinType === 2">邮箱认证</div>
      </div>
      <div class="checkStatus">
        <span class="label">加入审核状态</span>
        <div v-show="personalInfo.status === 0">审核中 <i class="el-icon-warning" style="color: #E6A23C;"></i></div>
        <div v-show="personalInfo.status === 1">已通过 <i class="el-icon-success" style="color: #67C23A;"></i></div>
        <div v-show="personalInfo.status === 2">未通过 <i class="el-icon-error" style="color: #F56C6C;"></i></div>
      </div>
      <div class="companyName" v-if="personalInfo.adminInfo"><span class="label">管理员</span><div>{{personalInfo.adminInfo.name || ''}}</div></div>
      <div class="companyName" v-if="personalInfo.adminInfo"><span class="label">联系方式</span><div>{{personalInfo.adminInfo.mobile || ''}}</div></div>
    </div>
    <div class="companyCheck">
      <div class="companyName"><span class="label">担任职务</span>{{personalInfo.userPosition || '无'}}</div>
      <div class="companyName"><span class="label">接收简历邮箱</span>{{personalInfo.userEmail || '无'}}</div>
      <div class="companyName"><span class="label">公司认证邮箱</span>{{recruiterInfo.companyEmail || '无'}}</div>
    </div>
    <!--人员认证信息-->
    <div class="commont companyInfo">
      <!--头部-->
      <div class="header">
        <div class="left">
          <span class="title">身份认证信息</span>
          <span class="status" v-show="identityInfo.status === 0"><i class="el-icon-warning" style="color: #E6A23C;"></i> 已提交</span>
          <span class="status" v-show="identityInfo.status === 1"><i class="el-icon-success" style="color: #67C23A;"></i> 已通过</span>
          <span class="status" v-show="identityInfo.status === 2"><i class="el-icon-error" style="color: #F56C6C;"></i> 未通过</span>
          <span class="status" v-show="!identityInfo.status && identityInfo.status !== 0"><i class="el-icon-error" style="color: #F56C6C;"></i> 未提交身份证信息</span>
        </div>
        <div class="editBox">
          <el-button class="inquire" @click.stop="Review(personalInfo.uid)" v-show="identityInfo.status === 0">审核</el-button>
          <el-button type="info" disabled v-show="identityInfo.status !== 0">{{identityInfo.status === 1? '已通过' : '审核'}}</el-button>
          <el-button class="inquire" @click.stop="toEdit(personalInfo.uid)">编辑</el-button>
        </div>
      </div>
      <!--内容-->
      <div class="content">
        <div class="title">账号信息</div>
        <div class="item"><span class="lable">手机号码：</span> {{identityInfo.mobile}}</div>
        <div class="title">个人信息</div>
        <div class="item"><span class="lable">姓名：</span> {{personalInfo.realName}}</div>
        <div class="item"><span class="lable">性别：</span> {{personalInfo.genderDesc}}</div>
      </div>
      <div class="content noData" v-if="!identityInfo.status && identityInfo.status !== 0">
        用户还未上传身份认证信息
      </div>
      <div class="content" v-else>
        <div class="title">身份信息</div>
        <div class="item"><span class="lable">真实姓名：</span> {{identityInfo.realName}}</div>
        <div class="item"><span class="lable">身份证号码：</span> {{identityInfo.identityNum}}</div>
        <div class="item">
          <div class="imgBox" v-if="identityInfo.passportFrontInfo">
            <span class="lable">身份证(正面)：</span>
            <img :src="identityInfo.passportFrontInfo.middleUrl"/>
            <div class="zoomBox" @click.stop="showImg(identityInfo.passportFrontInfo.url)">
              <i class="el-icon-zoom-in"></i>
              查看大图
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--大图蒙层-->
    <div class="mask" v-if="nowImg" @click.stop="hiddenMask">
      <vue-photo-zoom-pro type="circle" :width="250" :url="nowImg"></vue-photo-zoom-pro>
      <!--<img :src="nowImg"/>-->
    </div>
    <!--审核蒙层-->
    <el-dialog title="审核" :visible.sync="isCheck">
      <el-form :model="form" label-position="left">
        <el-form-item label="审核结果" label-width="100px" style="text-align: left;">
          <el-select v-model="form.result" placeholder="请选择审核结果">
            <el-option label="通过" value="true"></el-option>
            <el-option label="退回" value="false"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="原因" label-width="100px" style="text-align: left;" v-show="needReason !== 'true'">
          <el-select v-model="form.reason" placeholder="请选择审核结果">
            <el-option label="您提供的身份信息与身份证上登记的信息不符" value="您提供的身份信息与身份证上登记的信息不符"></el-option>
            <el-option label="身份证件信息模糊 / 遮挡 / 与身份认证需持【本人证件】的规定不符" value="身份证件信息模糊 / 遮挡 / 与身份认证需持【本人证件】的规定不符"></el-option>
            <el-option label="系统判定为存在安全问题的其他情况" value="系统判定为存在安全问题的其他情况"></el-option>
          </el-select>
          <!--<el-input v-model="form.reason" autocomplete="off"></el-input>-->
        </el-form-item>
        <!--<el-form-item label="其他原因" v-show="needReason !== 'true'" label-width="100px" style="text-align: left;">
          <el-input type="textarea" v-model="form.other" placeholder="请输入其他原因"></el-input>
        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.stop="isCheck = false">取 消</el-button>
        <el-button type="primary" @click.stop="setResult">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import { getReviewDetailsApi } from 'API/recruiter'
import { identityPassApi, identityFailApi } from 'API/company'
@Component({
  name: 'reviewDetails',
  watch: {
    'form.result': {
      handler (tags, oldTags) {
        this.needReason = tags
      }
    }
  }
})
export default class reviewDetails extends Vue {
  personalInfo = ''
  identityInfo = ''
  recruiterInfo = ''
  nowImg = ''
  isCheck = false
  needReason = '' // 是否需要审核原因
  form = {
    result: '',
    reason: '',
    other: ''
  }
  getReviewDetails () {
    const { id } = this.$route.query
    getReviewDetailsApi(id).then(res => {
      console.log(res)
      this.personalInfo = res.data.data.applyInfo
      this.identityInfo = res.data.data.identityInfo
      console.log(this.personalInfo)
      this.recruiterInfo = res.data.data.recruiterInfo
    })
  }
  /* 查看大图 */
  showImg (imgUrl) {
    this.nowImg = imgUrl
  }
  hiddenMask () {
    this.nowImg = ''
  }
  /* 点击审核按钮 */
  Review (id) {
    this.isCheck = true
    this.checkId = id
  }
  /* 去编辑身份证信息 */
  toEdit (uid) {
    this.$router.push({ path: `/check/recruitmentOfficer/editUser/${uid}` })
  }
  /* 设置审核结果 */
  setResult () {
    let param = {
      review_note: this.form.reason ? `${this.form.reason};${this.form.other}` : `${this.form.other}`
    }
    // 审核人员信息
    if (this.form.result === 'true') {
      identityPassApi(this.checkId).then(res => {
        this.identityInfo.status = 1
        this.isCheck = false
        this.$message({ type: 'success', message: '审核成功' })
      })
    } else {
      identityFailApi(this.checkId, param).then(res => {
        this.identityInfo.status = 2
        this.isCheck = false
        this.$message({ type: 'error', message: '信息驳回成功' })
      })
    }
  }
  created () {
    this.getReviewDetails()
  }
}
</script>

<style lang="less" scoped="scoped">
.reviewDetail{
  padding: 20px;
  margin-left: 200px;
}
.companyCheck{
  border: 1px solid #f4f4f4;
  border-radius: 4px;
  padding: 22px;
  display: flex;
  justify-content: space-between;
  font-weight: 700;
  .label{
    margin-right: 10px;
    font-weight: 300;
    color: #909399;
  }
}
.commont{
  width: 100%;
  .header{
    background-color: #f4f4f4;
    border-radius: 4px;
    padding: 10px 22px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .left{
      .status{
        margin-left: 10px;
      }
    }
  }
  .content{
    padding: 22px;
    box-sizing: border-box;
    border: 1px solid #f4f4f4;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    .title{
      line-height: 50px;
      font-size: 20px;
      font-weight: 700;
    }
    .item{
      line-height: 30px;
      .lable{
        margin-right: 10px;
        color: #909399;
      }
    }
    .imgBox{
      display: inline-block;
      margin-right: 20px;
      position: relative;
      img{
        width: 241px;
        height: 150px;
        background-color: #BCBCBC;
        object-fit: cover;
        vertical-align: middle;
      }
      /*i{
        cursor: pointer;
        color: #FFFFFF;
        font-size: 20px;
        position: absolute;
        bottom: 10px;
        right: 10px;
      }*/
      .zoomBox{
        background-color: rgba(0, 0, 0, 0.2);
        padding: 0 5px;
        border-radius: 5px;
        cursor: pointer;
        color: #FFFFFF;
        font-size: 15px;
        position: absolute;
        bottom: 5px;
        right: 5px;
      }
    }
  }
  .noData{
    align-items: center;
    font-size: 15px;
  }
}
/*查看大图*/
.mask{
  position: fixed;
  top: 0;
  right: 0;
  z-index: 999;
  width: 50%;
  height: 100%;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  .pic-img{
    max-width: 90% !important;
  }
  img{
    max-width: 90% !important;
    max-height: 90% !important;
  }
}
.inquire{
  background-color: #652791;
  color: #FFFFFF;
  border-radius: 4px;
}
</style>
