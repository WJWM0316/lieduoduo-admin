<template>
  <!--审核页面-->
  <div class="checkPage">
    <!--公司认证信息-->
    <div class="common companyInfo">
      <!--头部-->
      <div class="header" :class="{edit : isEdit}">
        <div class="left" v-if="!isEdit">
          <span class="title">公司认证信息</span>
          <span class="status" v-show="companyInfo.status === 0">
            <i class="el-icon-warning" style="color: #E6A23C;"></i> 已提交
          </span>
          <span class="status" v-show="companyInfo.status === 1">
            <i class="el-icon-success" style="color: #67C23A;"></i> 已通过
          </span>
          <span class="status" v-show="companyInfo.status === 2">
            <i class="el-icon-error" style="color: #F56C6C;"></i> 未通过
          </span>
        </div>
        <div class="editBox" v-if="!isEdit">
          <div v-if="AdminShow==0||AdminShow==1||AdminShow==2" style="display:inline-block;">
            <el-button
              class="inquire"
              @click.stop="Review(companyInfo.id, 'company')"
              v-show="companyInfo.status !== 1 && companyInfo.status !== 2 && clickAble"
            >审核</el-button>
            <el-button
              type="info"
              disabled
              v-show="companyInfo.status === 1 || companyInfo.status === 2 || !clickAble"
            >审核</el-button>
          </div>
          <el-button
            class="inquire"
            @click.stop="toEdit"
            v-show="companyInfo.status !== 1 && companyInfo.status !== 2"
          >编辑</el-button>
          <el-button
            type="info"
            disabled
            v-show="companyInfo.status === 1 || companyInfo.status === 2"
          >编辑</el-button>
        </div>
        <div class="editBox" v-else>
          <el-button class="inquire" @click.stop="edit('editCompany')">编辑</el-button>
        </div>
      </div>
      <!--内容-->
      <div class="content">
        <div class="title">公司信息</div>
        <div class="item companyName">
          <span class="lable">公司全称：</span>
          {{companyInfo.companyName}}
        </div>
        <div class="item">
          <span class="lable">公司简称：</span>
          {{companyInfo.companyShortname}}
        </div>
        <div class="item">
          <span class="lable">所属行业：</span>
          {{companyInfo.industry}}
        </div>
        <div class="item">
          <span class="lable">融资阶段：</span>
          {{companyInfo.financingInfo}}
        </div>
        <div class="item">
          <span class="lable">人员规模：</span>
          {{companyInfo.employeesInfo}}
        </div>
        <!-- <div>
          <template v-if="companyInfo.address && companyInfo.address.length">
            <div class="item" v-for="(item, index) in companyInfo.address" :key="index"><span class="lable">公司地址{{index+1}}：</span> {{item.address}}{{item.doorplate}}</div>
          </template>
          <template v-else>
            <div class="item"><span class="lable">公司地址1：</span> 还未设置</div>
          </template>
        </div>-->
        <div class="item">
          <span class="lable">公司简介：</span>
        </div>
        <pre class="describe"> {{companyInfo.intro}} </pre>
        <div class="item">
          <span class="lable">公司官网：</span>
          {{companyInfo.website || "未设置官网"}}
        </div>
        <div class="item">
          <span class="lable">公司邮箱：</span>
          {{companyInfo.email || "未绑定邮箱"}}
        </div>
        <div class="title">认证信息</div>
        <div class="item">
          <span class="lable">上传资质：</span>
        </div>
        <div class="item">
          <div class="imgBox" v-if="companyInfo.businessLicenseInfo">
            <div class="imgNote">营业执照</div>
            <img :src="companyInfo.businessLicenseInfo.middleUrl">
            <div class="zoomBox" @click.stop="showImg(companyInfo.businessLicenseInfo.url)">
              <i class="el-icon-zoom-in"></i>
              查看大图
            </div>
          </div>
          <div class="imgBox" v-if="companyInfo.onJobInfo">
            <div class="imgNote">上传工牌/名片/在职证明</div>
            <img :src="companyInfo.onJobInfo.middleUrl">
            <div class="zoomBox" @click.stop="showImg(companyInfo.onJobInfo.url)">
              <i class="el-icon-zoom-in"></i>
              查看大图
            </div>
          </div>
        </div>
        <!-- <div class="title">其他信息</div> -->
      </div>
    </div>

    <!--人员认证信息-->
    <div class="common companyInfo">
      <!--头部-->
      <div class="header" :class="{edit : isEdit}">
        <div class="left" v-if="!isEdit">
          <span class="title">身份认证信息</span>
          <span class="status" v-show="personalInfo.status === 0">
            <i class="el-icon-warning" style="color: #E6A23C;"></i> 已提交
          </span>
          <span class="status" v-show="personalInfo.status === 1">
            <i class="el-icon-success" style="color: #67C23A;"></i> 已通过
          </span>
          <span class="status" v-show="personalInfo.status === 2">
            <i class="el-icon-error" style="color: #F56C6C;"></i> 未通过
          </span>
          <span class="status" v-show="!personalInfo.status && personalInfo.status !== 0">
            <i class="el-icon-error" style="color: #F56C6C;"></i> 相关信息未提交
          </span>
        </div>
        <div class="editBox" v-if="!isEdit">
          <el-button class="inquire" @click.stop="editIdentity(companyInfo.createdUid)">编辑</el-button>
          <!-- <el-button class="inquire" @click.stop="Review(personalInfo.uid, 'identity')" v-show="personalInfo.status === 0">审核</el-button>
          <el-button type="info" disabled v-show="personalInfo.status !== 0">审核</el-button>-->
        </div>
        <div class="editBox" v-else>
          <el-button class="inquire" @click.stop="editIdentity(personalInfo.uid)">编辑</el-button>
        </div>
      </div>
      <!--内容-->
      <div class="content">
        <div class="title">账号资料</div>
        <div class="item">
          <span class="lable">手机号码：</span>
          {{personalInfo.mobile || '未设置手机'}}
        </div>
        <div class="title">个人资料</div>
        <div class="item">
          <span class="lable">姓名：</span>
          {{companyInfo.realName}}
        </div>
        <div class="item">
          <span class="lable">性别：</span>
          {{personalInfo.gender === 1? "男" : "女"}}
        </div>
        <div class="title">认证资料</div>
        <div class="item">
          <span class="lable">真实姓名：</span>
          {{personalInfo.realName}}
        </div>
        <div class="item">
          <span class="lable">身份证号码：</span>
          {{personalInfo.identityNum}}
        </div>
        <div class="item">
          <div class="imgBox" v-if="personalInfo.passportFrontInfo">
            <div class="imgNote">身份证（正面）：</div>
            <img :src="personalInfo.passportFrontInfo.middleUrl">
            <div class="zoomBox" @click.stop="showImg(personalInfo.passportFrontInfo.url)">
              <i class="el-icon-zoom-in"></i>
              查看大图
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--底部删除(暂时关闭该功能)-->
    <!--<div class="header del" v-if="isEdit">
      <div class="editBox">
        <el-button type="danger" @click.stop="del">删除</el-button>
      </div>
    </div>-->
    <!--大图蒙层-->
    <div class="mask" v-if="nowImg" @click.stop="hiddenMask">
      <vue-photo-zoom-pro type="circle" :width="250" :url="nowImg"></vue-photo-zoom-pro>
      <!--<img :src="nowImg"/>-->
    </div>
    <!--审核蒙层-->
    <el-dialog title="审核" :visible.sync="isCheck">
      <el-form :model="form">
        <el-form-item label="审核结果" label-width="100px" style="text-align: left;">
          <el-select v-model="form.result" placeholder="请选择审核结果">
            <el-option label="通过" value="true"></el-option>
            <el-option label="退回" value="false"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="不通过原因"
          label-width="100px"
          style="text-align: left;"
          v-show="needReason !== 'true'"
        >
          <el-select v-model="form.reason" placeholder="请选择审核结果" v-if="type === 'company'">
            <el-option label="您提供的公司名称与营业执照上登记的主体名称不符" value="您提供的公司名称与营业执照上登记的主体名称不符"></el-option>
            <el-option
              label="认证信息不能包含联系方式，包括但不限于：微博、微信、邮箱、QQ、网站链接；不能出现营销推广信息，内容健康、积极，不能包含敏感、色情等信息"
              value="认证信息不能包含联系方式，包括但不限于：微博、微信、邮箱、QQ、网站链接；不能出现营销推广信息，内容健康、积极，不能包含敏感、色情等信息"
            ></el-option>
            <el-option
              label="资质不支持认证信息 / 认证信息非企业面貌 / 认证信息包含营销信息"
              value="资质不支持认证信息 / 认证信息非企业面貌 / 认证信息包含营销信息"
            ></el-option>
            <el-option label="营业执照信息不全 / 与工商局登记信息不符 / 模糊不清" value="营业执照信息不全 / 与工商局登记信息不符 / 模糊不清"></el-option>
            <el-option
              label="资质信息与公司信息不符 / 伪造公章或证件 / 未盖章 / 运营人信息不实"
              value="资质信息与公司信息不符 / 伪造公章或证件 / 未盖章 / 运营人信息不实"
            ></el-option>
          </el-select>
          <el-select v-model="form.reason" placeholder="请选择审核结果" v-else>
            <el-option label="您提供的身份信息与身份证上登记的信息不符" value="您提供的身份信息与身份证上登记的信息不符"></el-option>
            <el-option
              label="身份证件信息模糊 / 遮挡 / 与身份认证需持【本人证件】的规定不符"
              value="身份证件信息模糊 / 遮挡 / 与身份认证需持【本人证件】的规定不符"
            ></el-option>
            <el-option label="系统判定为存在安全问题的其他情况" value="系统判定为存在安全问题的其他情况"></el-option>
          </el-select>
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
import {
  getCompanyInfo,
  temppassApi,
  tempfailApi,
  identityPassApi,
  identityFailApi,
  getCompanyInfoApi,
  deleteCompanyApi
} from 'API/company'
Component.registerHooks([
  'beforeRouteEnter',
  'beforeRouteLeave',
  'beforeRouteUpdate' // for vue-router 2.2+
])
@Component({
  name: 'checkPage',
  watch: {
    'form.result': {
      handler (tags, oldTags) {
        this.needReason = tags
      }
    }
  },
  computed: {
    clickAble () {
      return this.companyInfo &&
              this.companyInfo.companyName &&
              this.companyInfo.companyShortname &&
              this.companyInfo.financing &&
              this.companyInfo.employees &&
              this.companyInfo.industry
    }
  }
})
export default class checkPage extends Vue {
  companyInfo = '';
  personalInfo = '';
  AdminShow = ''; // 权限
  nowImg = '';
  type = ''; // 当前审核的信息类别 company 或 identity
  isCheck = false; // 审核蒙层
  checkId = '';
  isEdit = false; // 是否编辑公司库信息
  editCompanyID = ''; // 当前编辑的公司id
  needReason = '';
  form = {
    result: '',
    reason: '',
    other: '' // 其他原因
  };
  beforeRouteEnter (from, to, next) {
    if (from.query.isEdit) {
      from.meta.parentName = '公司库'
      from.meta.title = '公司编辑'
      from.meta.parentPath = '/index'
    } else {
      from.meta.parentName = '公司审核管理'
      from.meta.title = '公司审核详情'
      from.meta.parentPath = '/check/companyCheck'
    }
    next()
  }
  /* 删除 */
  del () {
    this.$confirm('删除公司将清除已关联的招聘官和职位, 您确定删除吗?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      customClass: 'messageBox',
      type: 'warning'
    })
      .then(() => {
        deleteCompanyApi(this.editCompanyID).then(res => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.$router.go(-1)
        })
      })
      .catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
  }
  /* 编辑公司信息 */
  edit (name) {
    this.$router.push({
      path: `/index/${name}`,
      query: { id: this.companyInfo.id }
    })
  }
  /* 绑定管理员 */
  bindAdmin () {}
  /* 编辑身份信息 */
  editIdentity (uid) {
    let checkId = this.$route.query.id
    this.$router.push({
      path: `/check/companyCheck/editUser/${checkId}?isFromCheck=true`
    })
  }
  /* 去编辑公司信息 */
  toEdit () {
    let checkId = this.$route.query.id
    this.$router.push({ path: `/check/companyCheck/check/${checkId}`, query: { from: 'cp' } })
  }

  mounted () {
    this.AdminShow = +sessionStorage.getItem('AdminShow')
  }
  /* 点击审核按钮 */
  Review (id, type) {
    this.type = type
    this.isCheck = true
    this.checkId = id
  }
  showImg (imgUrl) {
    this.nowImg = imgUrl
  }
  hiddenMask () {
    this.nowImg = ''
  }
  /* 设置审核结果 */
  setResult () {
    let param = {
      review_note: this.form.reason
        ? `${this.form.reason};${this.form.other}`
        : `${this.form.other}`
    }
    if (this.type === 'company') {
      // 审核公司信息
      if (this.form.result === 'true') {
        temppassApi(this.checkId).then(res => {
          this.companyInfo.status = 1
          this.isCheck = false
          this.$message({ type: 'success', message: '审核成功' })
        })
      } else {
        tempfailApi(this.checkId, param).then(res => {
          this.companyInfo.status = 2
          this.isCheck = false
          this.$message({ type: 'error', message: '审核驳回成功' })
        })
      }
    } else {
      // 审核人员信息
      if (this.form.result === 'true') {
        identityPassApi(this.checkId).then(res => {
          this.personalInfo.status = 1
          this.isCheck = false
        })
      } else {
        identityFailApi(this.checkId, param).then(res => {
          this.personalInfo.status = 2
          this.isCheck = false
        })
      }
    }
  }
  created () {
    const { id, isEdit } = this.$route.query
    if (isEdit) {
      this.editCompanyID = id
      this.isEdit = isEdit
      getCompanyInfoApi(id).then(res => {
        this.companyInfo = res.data.data.companyInfo
        this.personalInfo = res.data.data.identityInfo
      })
    } else {
      getCompanyInfo(id).then(res => {
        this.companyInfo = res.data.data.companyInfo
        this.personalInfo = res.data.data.identityInfo
      })
    }
  }
}
</script>

<style lang="less" scoped="scoped">
img {
  max-width: 90%;
  max-height: 90%;
}
.checkPage {
  padding: 22px;
  position: relative;
  .del {
    padding: 10px;
    background-color: #f4f4f4;
    display: flex;
    justify-content: flex-end;
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
  img {
    max-width: 90%;
    max-height: 90%;
  }
}
.el-form-item__content {
  text-align: left;
}
.common {
  width: 100%;
  .header {
    background-color: #f4f4f4;
    border-radius: 4px;
    padding: 10px 20px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .left {
      .status {
        margin-left: 10px;
      }
    }
  }
  .edit {
    justify-content: flex-end;
  }
  .content {
    padding: 10px;
    box-sizing: border-box;
    border: 1px solid #f4f4f4;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    .title {
      line-height: 50px;
      font-size: 20px;
      font-weight: 700;
    }
    .item {
      padding-left: 30px;
      line-height: 30px;
      text-align: left;
      .lable {
        margin-right: 10px;
        color: #909399;
      }
    }
    .companyName {
      font-size: 15px;
      font-weight: 700;
      span {
        font-size: 14px;
        font-weight: 500;
      }
    }
    .imgBox {
      display: inline-block;
      margin-right: 20px;
      position: relative;
      img {
        width: 265px;
        height: 170px;
        max-width: 100%;
        background-color: #bcbcbc;
        object-fit: cover;
        vertical-align: middle;
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
      .imgNote {
        text-align: left;
        color: #909399;
      }
    }
    .describe {
      box-sizing: border-box;
      width: 100%;
      white-space: pre-wrap;
      text-align: left;
      padding: 0 50px;
      line-height: 20px;
    }
  }
}
.inquire {
  background-color: #652791;
  color: #ffffff;
  border-radius: 4px;
}
</style>
