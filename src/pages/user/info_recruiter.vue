<!--创建公司-->
<template>
  <div class="createCompany">
    <div class="header">
      <div class="creatTab">
        <div class="userInfo" :class="{'active': isEditAdminName == false }" @click.self="tab">基本信息</div>
        <div class="editAdminName" :class="{'active': isEditAdminName == true }" @click.self="tab">账户设置</div>
      </div>
      <div class="editBox" v-if="isEditAdminName==false">
        <el-button
          class="inquire"
          @click.stop="Review(personalInfo.uid, 'company')"
          v-show="userInfo.status === 0"
        >审核</el-button>
        <div
          style="display:inline-block;margin-right:10px;"
          v-if="AdminShow==0||AdminShow==1||AdminShow==2"
        >
          <el-button
            type="info"
            disabled
            v-show="userInfo.status !== 0"
          >{{userInfo.status === 1? '已通过' : '审核'}}</el-button>
        </div>
        <el-button class="inquire" @click.stop="toEdit(personalInfo.uid)">编辑</el-button>
      </div>
      <div class="editBox" v-if="isEditAdminName==true">
        <el-button class="saveAdminName" @click.stop="saveAdminName">保存跟进人</el-button>
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
        <el-form-item
          label="原因"
          label-width="100px"
          style="text-align: left;"
          v-show="needReason !== 'true'"
        >
          <el-select v-model="form.reason" placeholder="请选择审核结果">
            <el-option label="您提供的身份信息与身份证上登记的信息不符" value="您提供的身份信息与身份证上登记的信息不符"></el-option>
            <el-option
              label="身份证件信息模糊 / 遮挡 / 与身份认证需持【本人证件】的规定不符"
              value="身份证件信息模糊 / 遮挡 / 与身份认证需持【本人证件】的规定不符"
            ></el-option>
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
    <!-- 账户设置 -->
    <div class="editAdminNam" v-if="isEditAdminName==true">
      <div class="sales">
        <h3>跟进销售</h3>
        <el-form>
          <el-form-item label="跟进人">
            <el-select
              style="width: 400px;"
              ref="salesList"
              v-model="companyInfo.realname"
              placeholder="请选择跟进人"
              @change="ground"
            >
              <el-option label="无" :value="0"/>
              <el-option
                v-for="(item, index) in salesList"
                :label="item.realname"
                :value="index"
                :key="index"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <!--身份信息表格-->
    <div class="personalInfo" v-if="isEditAdminName==false">
      <div class="point">上传工牌/名片/在职证明等信息需要与身份信息保持一致</div>
      <el-form class="edit-form" ref="mobile" :model="phone" label-width="150px" label-suffix="：">
        <h3>账号信息</h3>
        <el-form-item label="手机号码" prop="mobile">
          <span>{{phone.mobile}}</span>
        </el-form-item>
      </el-form>
      <el-form
        class="edit-form"
        ref="personalInfo"
        :model="personalInfo"
        label-width="160px"
        label-suffix="："
      >
        <h3>个人信息</h3>
        <el-form-item label="姓名" prop="name">
          <span>{{personalInfo.name}}</span>
        </el-form-item>

        <el-form-item label="性别" prop="gender">
          <span v-if="personalInfo.gender === 1">男</span>
          <span v-else>女</span>
        </el-form-item>

        <h3>
          身份信息
          <span class="status" v-show="personalInfo.identityAuth === 1">
            <i class="el-icon-success" style="color: #67C23A;"></i> 验证通过
          </span>
          <span class="status" v-show="personalInfo.identityAuth === 0">
            <i class="el-icon-error" style="color: #F56C6C;"></i> 验证失败
          </span>
        </h3>
        <el-form-item
          label="不需要身份认证"
          prop="realname"
          v-if="userInfo.companyId && personalInfo.identityAuth !== 1"
        >
          <el-switch v-model="isDetection" @change="changeDemand"></el-switch>
        </el-form-item>
        <el-form-item label="真实姓名" prop="realname">
          <span>{{personalInfo.realname}}</span>
        </el-form-item>

        <el-form-item label="身份证号码" prop="idNum">
          <span>{{personalInfo.idNum}}</span>
        </el-form-item>

        <!--身份证正面-->
        <el-form-item class="full" label="身份证正面" prop="icon">
          <div class="seeBigImg" v-if="personalInfo.passportFront">
            <img class="frontImg" :src="personalInfo.passportFront" alt>
            <div class="zoomBox" @click.stop="showImg(personalInfo.passportFront)">
              <i class="el-icon-zoom-in"></i>
              查看大图
            </div>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <div class="companyMessage" v-if="isEditAdminName==false&&userInfo.companyInfo!=null">
      <div>所属公司</div>
      <div class="companyName" v-show="companyInfo!=''">
        <span class="label">公司全称</span>
        <div>{{companyInfo.companyName}}</div>
      </div>
      <div class="companyName" v-show="companyInfo.isAdmin!=''">
        <span class="label">身份类型</span>
        <div>{{companyInfo.isAdmin === 1? '管理员' : '招聘官'}}</div>
      </div>
      <div class="companyName" v-show="companyInfo && userInfo.companyId">
        <span class="label">是否可以发布职位</span>
        <el-switch v-model="createPositionRight" @change="changeRight"></el-switch>
      </div>
      <div class="companyName" v-show="companyInfo && companyInfo.applyType">
        <span class="label">申请类型</span>
        <div>创建公司类型</div>
      </div>
      <div class="companyName" v-show="companyInfo && companyInfo.applyType">
        <div class="btn" @click.stop="toCheckCompany(companyInfo.id)">去查看审核</div>
      </div>
      <div class="companyName btn" v-show="userInfo.companyId" @click.stop="removeUser">移出公司</div>
    </div>
    <div class="companyMessage" v-else-if="isEditAdminName==false">
      <div>所属公司</div>
      <div class="companyName btn" @click.stop="bindCompany">绑定公司</div>
    </div>
    <div class="officerInfo" v-if="userInfo.companyId&&isEditAdminName==false">
      <div class="title">
        <span>招聘官信息</span>
        <div class="editOfficer" v-if="true" @click.stop="toEditRecruiter">
          <i class="el-icon-edit"></i>编辑
        </div>
      </div>
      <el-form label-suffix="：">
        <el-form-item label-width="150px" label="担任职务" style="width: 500px">{{userInfo.position}}</el-form-item>
        <el-form-item label-width="150px" label="接收简历邮箱" style="width: 500px">{{userInfo.email}}</el-form-item>
        <el-form-item
          label-width="150px"
          label="公司认证邮箱"
          style="width: 500px"
        >{{userInfo.companyEmail}}</el-form-item>
        <el-form-item label-width="150px" label="招聘官头像" style="width: 500px">
          <img
            class="avar"
            v-for="(item,index) in userInfo.avatars"
            :src="item.smallUrl"
            :key="index"
          >
        </el-form-item>
      </el-form>
    </div>
    <!-- 绑定与解绑模块 -->
    <div v-if="showAdminWindow" class="bindAdminWindo">
      <admin-control
        :companyInfo="companyInfo"
        :isNewCompany="isNewCompany"
        @close="closeAdmin"
        :AdduserInfo="userInfo"
        @closeAdminWindow="close"
        :isBindAdmin="isBindAdmin"
        :userName="personalInfo.name"
        :companyName="companyInfo? companyInfo.companyName : ''"
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
import { getSalerListApi } from 'API/common'
import { identityPassApi, identityFailApi,
  editAdminNameApi,
  getRecruitersListApi
} from 'API/company'
import {
  getUserInfoApi,
  onCreatedRightApi,
  offCreatedRightApi,
  setDemandIdentityApi,
  delDemandIdentityApi
} from 'API/recruiter'

@Component({
  name: 'userInfo',
  watch: {
    'form.result': {
      handler (tags, oldTags) {
        this.needReason = tags
      }
    }
  },
  components: {
    ImageUploader,
    adminControl
  }
})
export default class addUser extends Vue {
  pop = {
    isShow: false,
    type: 'position'
  };
  active = 0; // 点击切换tab
  AdminShow = ''; // 管理员权限控制
  needReason = ''; // 审核结果
  isCheck = false;
  nowImg = ''; // 当前大图预览显示的图片
  isEditAdminName = false; // 显示基本信息还是账户设置
  showAdminWindow = false; // 是否显示招聘官弹窗
  nextAdmin = null; // 公司下一个管理员的信息
  userInfo = ''; // 请求回来的所有用户信息
  createPositionRight = false; // 是否有职位发布权限
  isDetection = ''; // 是否已校验身份证信息
  isBindAdmin = false;
  isNewCompany = false;
  /* 身份证信息对象 */
  iDCard = {};
  /* 手机号码 */
  phone = {
    mobile: ''
  };
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
    vkey: ''
  };
  /* 身份信息 */
  personalInfo = {
    name: '', // 姓名
    gender: '',
    realname: '', // 真实姓名
    idNum: '', // 身份证号码
    passportFront: '' // 身份证正面照片
  };
  companyName = {};
  saveParam = {
    admin_uid: '',
    group_id: ''
  };
  salesList = [];
  iconUploader = {
    point: '',
    width: 400,
    height: '',
    tips: '建议尺寸400X400px，JPG、PNG格式，图片小于5M。'
  };
  form = {
    result: '',
    reason: '',
    other: '' // 其他原因
  };
  /* 切换tab */
  tab (e) {
    if (e.target.className.indexOf('userInfo') === -1) {
      this.$nextTick(() => {
        this.userList()
      })
      this.isEditAdminName = true
    } else if (e.target.className.indexOf('editAdminName') === -1) {
      this.$nextTick(() => {
        this.getUserInfo()
      })
      this.isEditAdminName = false
    }
  }
  ground (e) {
    this.$set(this.saveParam, 'group_id', this.salesList[e].groupId)
    this.$set(this.saveParam, 'admin_uid', this.salesList[e].id)
  }
  async saveAdminName () {
    if (this.saveParam.group_id === '') {
      this.$message.error('请先选择跟进人')
    } else {
      await editAdminNameApi(this.$route.params.id, this.saveParam)
      this.$message({
        showClose: true,
        type: 'success',
        message: '保存成功'
      })
    }
  }
  /* 设置审核结果 */
  setResult () {
    let param = {
      review_note: this.form.reason
        ? `${this.form.reason};${this.form.other}`
        : `${this.form.other}`
    }
    // 审核人员信息
    if (this.form.result === 'true') {
      identityPassApi(this.checkId).then(res => {
        this.personalInfo.identityAuth = 1
        this.isCheck = false
        this.$message({ type: 'success', message: '审核成功' })
      })
      this.isCheck = false
    } else {
      identityFailApi(this.checkId, param).then(res => {
        this.personalInfo.identityAuth = 0
        this.isCheck = false
        this.$message({ type: 'error', message: '信息驳回成功' })
      })
    }
  }
  // 点击审核按钮
  Review (id, type) {
    this.type = type
    this.isCheck = true
    this.checkId = id
  }
  /* 查看大图 */
  showImg (imgUrl) {
    this.nowImg = imgUrl
  }
  /* 隐藏大图 */
  hiddenMask () {
    this.nowImg = ''
  }
  // 关闭移除招聘官
  closeAdmin () {
    this.showAdminWindow = false
  }
  /* 去编辑用户信息 */
  toEdit () {
    this.$router.push({ path: `/user/edit_recruiter/${this.$route.params.id}` })
  }
  /* 去查看公司审核 */
  toCheckCompany (companyId) {
    this.$router.push({ path: `/check/companyCheck/verify?id=${companyId}` })
  }
  /* 移出公司 */
  async removeUser () {
    this.showAdminWindow = true
    // this.is
    this.isBindAdmin = true
    // this.isNewCompany=false
    this.companyInfo.realName = this.userInfo.name

    // console.log(this.userInfo);
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
    // this.
  }
  /* 关闭弹窗 */
  close (e) {
    this.showAdminWindow = false
    if (e && e.needLoad) this.getUserInfo()
  }

  /* 获取用户信息 */
  async getUserInfo () {
    let res = await getUserInfoApi(this.$route.params.id)
    let userInfo = res.data.data
    this.userInfo = userInfo

    this.isDetection = !userInfo.needRealNameAuth
    if (userInfo.companyInfo) {
      this.companyInfo = userInfo.companyInfo
    } else {
      this.companyInfo = {
        realname: ''
      }
    }
    this.createPositionRight = !!userInfo.createPositionRight
    this.phone = {
      mobile: userInfo.mobile
    }
    console.log('userInfo', userInfo)
    /* 身份信息 */
    this.personalInfo = {
      uid: userInfo.uid,
      name: userInfo.name, // 姓名
      gender: userInfo.gender,
      realname: userInfo.realname || '', // 真实姓名
      idNum: userInfo.identityNum || '', // 身份证号码
      passportFront: userInfo.passportFront
        ? userInfo.passportFront.middleUrl
        : '', // 身份证正面照片
      identityAuth: userInfo.identityAuth
    }
  }
  /* 是否需要校验身份信息 */
  async changeDemand () {
    try {
      if (!this.isDetection) {
        await setDemandIdentityApi(this.$route.params.id)
      } else {
        await delDemandIdentityApi(this.$route.params.id)
      }
    } catch (err) {
      this.isDetection = !this.isDetection
    }
  }
  /* 改变招聘官发布职位权限 */
  changeRight () {
    if (!this.createPositionRight) {
      // 关闭
      offCreatedRightApi(this.$route.params.id)
        .then(res => {
          this.$message({ type: 'warning', message: '关闭发布权限成功' })
        })
        .catch(res => {
          this.createPositionRight = true
        })
    } else {
      // 开启
      onCreatedRightApi(this.$route.params.id)
        .then(res => {
          this.$message({ type: 'success', message: '开启发布权限成功' })
        })
        .catch(res => {
          this.createPositionRight = false
        })
    }
  }

  toEditRecruiter () {
    this.$router.push({
      path: `/user/editRecruiter/${this.$route.params.id}`
    })
  }
  userList () {
    getSalerListApi().then(res => (this.salesList = res.data.data))
  }
  mounted (e) {
    if (this.isEditAdminName) {
      this.userList()
    } else {
      this.getUserInfo()
    }
    this.AdminShow = +sessionStorage.getItem('AdminShow')
  }
}
</script>

<style lang="less" scoped="scoped">
.frontImg {
  width: 100%;
  height: 100%;
}
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
    margin-bottom: 20px;
  }
}
.mask {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 999;
  width: 50%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  .pic-img {
    max-width: 90% !important;
  }
  img {
    max-width: 90% !important;
    max-height: 90% !important;
  }
}
.seeBigImg {
  position: relative;
  width: 330px;
  height: 210px;
}
.zoomBox {
  background-color: rgba(0, 0, 0, 0.2);
  padding: 0 5px;
  border-radius: 5px;
  cursor: pointer;
  color: #ffffff;
  font-size: 15px;
  position: absolute;
  bottom: 5px;
  right: 5px;
}

.inquire {
  background-color: #652791;
  color: #ffffff;
  border-radius: 4px;
}
.createCompany {
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
  .status {
    font-size: 15px;
    padding-left: 10px;
  }
  .companyMessage {
    border: 1px solid #cccccc;
    border-radius: 4px;
    padding: 22px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 700;
    .label {
      margin-right: 10px;
      font-weight: 300;
      color: #909399;
    }
    .btn {
      cursor: pointer;
      color: #652791;
    }
  }
  .officerInfo {
    padding: 22px;
    text-align: left;
    border: 1px solid #cccccc;
    border-radius: 4px;
    .title {
      border-bottom: 1px solid #cccccc;
      padding-bottom: 10px;
      margin-bottom: 10px;
      > span {
        font-weight: 700;
        font-size: 18px;
      }
      .editOfficer {
        float: right;
        cursor: pointer;
      }
    }
    .avar {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      margin-left: 10px;
    }
  }
  .bindAdminWindo {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    z-index: 100;
  }
}
</style>
