<!--创建公司-->
<template>
  <div class="createCompany">
    <div class="header">
      <div class="creatTab">
        <div class="Info" :class="{'active': active === 0 }" @click.stop="tab(0)">公司信息</div>
        <div class="userInfo" :class="{'active': active === 2 }" @click.stop="tab(2)">在招职位</div>
        <div class="userInfo" :class="{'active': active === 3 }" @click.stop="tab(3)">招聘团队</div>
        <div class="userInfo" :class="{'active': active === 1 }" @click.stop="tab(1)">账户设置</div>
      </div>
      <div>
        <!-- <el-button @click.stop="last" v-show="active === 1">返回上一步</el-button>
        <el-button @click.stop="next" v-show="active === 0">保存，下一步</el-button>-->
        <el-button @click.stop="toEdit">编辑</el-button>
        <el-button @click.stop="bindAdmin" v-if="companyInfo.createdUid === 0">绑定管理员</el-button>
        <el-button @click.stop="delateAdmin" v-else>移除管理员</el-button>
      </div>
    </div>
    <!--大图蒙层-->
    <div class="mask" v-if="nowImg" @click.stop="hiddenMask">
      <vue-photo-zoom-pro type="circle" :width="250" :url="nowImg"></vue-photo-zoom-pro>
      <!--<img :src="nowImg"/>-->
    </div>
    <!--公司信息表格-->
    <div class="companyInfo" v-if="active === 0">
      <div class="point">上传工牌/名片/在职证明等信息需要与身份信息保持一致</div>
      <el-form
        class="edit-form"
        ref="companyInfo"
        :model="companyInfo"
        label-width="150px"
        label-suffix="："
      >
        <h3>公司信息</h3>
        <!--工牌/名片/在职证明-->
        <el-form-item class="full" label="公司LOGO" prop="icon" v-if="companyInfo.logoInfo">
          <img :src="companyInfo.logoInfo.smallUrl" alt>
        </el-form-item>

        <el-form-item label="公司全称" prop="company_name">
          <span>{{companyInfo.companyName}}</span>
        </el-form-item>

        <el-form-item label="公司简称" prop="company_shortname">
          <span>{{companyInfo.companyShortname}}</span>
        </el-form-item>

        <el-form-item label="所属行业" prop="industry_id">
          <span>{{companyInfo.industry}}</span>
        </el-form-item>
        <el-form-item label="融资阶段" prop="financing">
          <span>{{companyInfo.financingInfo}}</span>
        </el-form-item>

        <el-form-item label="人员规模" prop="employees">
          <span>{{companyInfo.employeesInfo}}</span>
        </el-form-item>

        <el-form-item label="公司地址" prop="address_id">
          <!--公司地址列表-->
          <span
            class="AdressList"
            v-for="(item, index) in companyInfo.address"
            :key="index"
          >{{`${index+1}、${item.address}${item.doorplate}`}}</span>
        </el-form-item>

        <el-form-item class label="公司简介">
          <span>{{companyInfo.intro}}</span>
        </el-form-item>

        <el-form-item class label="公司官网">
          <span>{{companyInfo.website}}</span>
        </el-form-item>

        <el-form-item class label="公司邮箱">
          <span>{{companyInfo.email}}</span>
        </el-form-item>

        <el-form-item class label="*一句话亮点">
          <span>{{companyInfo.oneSentenceIntro}}</span>
        </el-form-item>
        <el-form-item class label="公司图片">
          <ul class="common-list_01">
            <li
              v-for="(imageItem, imageIndex) in companyInfo.albumInfo"
              :key="imageIndex"
              :data-key="imageIndex"
              class="draggable"
              :style="`background-image: url(${imageItem.smallUrl}); background-size: cover; background-repeat: no-repeat; background-position: center center;`"
              draggable="true">
            </li>
          </ul>
        </el-form-item>
        <h3>资质信息</h3>
        <el-form-item class="full" label="营业执照" prop="icon" v-if="companyInfo.businessLicenseInfo">
          <div class="seePhoto" v-if="companyInfo.businessLicenseInfo.smallUrl!=null">
            <img :src="companyInfo.businessLicenseInfo.smallUrl" alt>
            <div class="zoomBox" @click.stop="showImg(companyInfo.businessLicenseInfo.url)">
              <i class="el-icon-zoom-in"></i>
              查看大图
            </div>
          </div>
        </el-form-item>
        <!--工牌/名片/在职证明-->
        <el-form-item
          class="full"
          label="工牌/名片/在职证明(三选一)"
          prop="icon"
          v-if="companyInfo.businessLicenseInfo"
        >
          <div class="seePhoto" v-if="companyInfo.onJobInfo.smallUrl!=null">
            <img :src="companyInfo.onJobInfo.smallUrl" alt>
            <div class="zoomBox" @click.stop="showImg(companyInfo.onJobInfo.url)">
              <i class="el-icon-zoom-in"></i>
              查看大图
            </div>
          </div>
        </el-form-item>
        <h3 v-if="companyInfo.product.length">产品介绍</h3>
        <template v-for="(item, index) in companyInfo.product">
          <div v-if="companyInfo.product.length" :key="index">
            <el-form-item class label="产品logo">
              <img :src="item.logoInfo.smallUrl" alt="" style="width: 130px;height: 130px;" v-if="item.logoInfo.smallUrl">
            </el-form-item>
            <el-form-item class label="产品名称">
              <span>{{item.productName}}</span>
            </el-form-item>
            <el-form-item class label="产品官网">
              <span>{{item.siteUrl}}</span>
            </el-form-item>
            <el-form-item class label="产品slogan">
              <span>{{item.slogan}}</span>
            </el-form-item>
            <el-form-item class label="产品亮点">
              <span>{{item.lightspot}}</span>
            </el-form-item>
            <div class="line" style="height: 1px;background: #ebeef5;width: 100%; margin-bottom: 20px;" v-if="companyInfo.product.length !== index + 1"></div>
          </div>
        </template>
      </el-form>
    </div>
    <!-- 跟进销售设置 -->
    <div class="sales" v-if="active === 1">
      <h3>跟进销售</h3>
      <el-form label-suffix="：">
        <el-form-item label="跟进人">
          <span>{{companyInfo.adminName}}</span>
        </el-form-item>
      </el-form>
      <h3>权益类型</h3>
      <el-form label-suffix="：">
        <el-form-item label="权益类型">
          <span>{{rightInfo.rtVersionName}}</span>
        </el-form-item>
        <el-form-item label="开始时间">
          <span>{{rightInfo.startTimeDesc}}</span>
        </el-form-item>
        <el-form-item label="结束时间">
          <span>{{rightInfo.expiredDesc}}</span>
        </el-form-item>
      </el-form>
      <h3>权益点</h3>
      <el-form label-suffix="：">
        <el-form-item label="招聘成员上限">
          <span>{{rightInfo.cRecruiterNum === -1 ? "无上限" : rightInfo.cRecruiterNum}}</span>
        </el-form-item>
        <el-form-item label="招聘职位上">
          <span>{{rightInfo.rOnlinePosition === -1 ? "无上限" : rightInfo.rOnlinePosition}}</span>
        </el-form-item>
        <el-form-item label="每日邀约上限">
          <span>{{rightInfo.rDayInviteInterview === -1 ? "无上限" : rightInfo.rDayInviteInterview}}</span>
        </el-form-item>
        <el-form-item label="每日查看简历上限">
          <span>{{rightInfo.rDayBrowseResume === -1 ? "无上限" : rightInfo.rDayBrowseResume}}</span>
        </el-form-item>
      </el-form>
    </div>
    <!-- 绑定与解绑模块 -->
    <div v-if="showAdminWindow" class="bindAdminWindo">
      <admin-control
        :isOldEdit="isOldEdit"
        @close="closeBtn"
        :companyInfo="companyInfo"
        :isNewCompany="isNewCompany"
        @closeAdminWindow="close"
        :isBindAdmin="companyInfo.createdUid? true : false"
        :nextAdmin="nextAdmin"
      ></admin-control>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import adminControl from '@/components/adminControl/index'
import {
  getCompanyInfoApi,
  getRecruitersListApi,
  getCompanyProductListsApi
} from 'API/company'
@Component({
  name: 'companyInfo',
  components: {
    adminControl
  }
})
export default class createCompany extends Vue {
  active = 0;
  adressList = []; // 地址列表
  showAdminWindow = false;
  nowImg = ''; // 预览大图
  nextAdmin = null; // 公司下一个管理员的信息
  pop = {
    isShow: false,
    type: 'position'
  };
  isNewCompany = false;
  email = {
    isShow: false
  };
  /* 公司信息 */
  companyInfo = {
    product: [],
    createdUid: '' /* 0没有绑定管理员，1已经绑定了管理员 */
  };

  /* 权益信息 */
  rightInfo = {};
  // 是否是旧公司绑定管理员
  isOldEdit = false;
  /* 切换tab */
  tab (num) {
    switch (num) {
      case 0:
        this.active = num
        break
      case 1:
        this.active = num
        break
      case 2:
        window.open(`/manage/positionManage?page=1&count=20&is_online=1&name2=${this.companyInfo.companyName}`, '_blank')
        break
      case 3:
        window.open(`/recruiter?page=1&count=20&companyName=${this.companyInfo.companyName}`, '_blank')
        break
      default:
        break
    }
  }

  /* 去编辑 */
  toEdit () {
    this.$router.push({ path: `/index/editCompany/${this.$route.query.id}` })
  }

  /* 获取公司信息 */
  getCompanyInfo () {
    const { id } = this.$route.query
    getCompanyInfoApi(id)
      .catch(err => {
        if (err.data.code === 403) {
          this.$router.go(-1)
        }
      })
      .then(res => {
        this.companyInfo = res.data.data.companyInfo
        this.rightInfo = res.data.data.rtInfo
      })
  }
  getCompanyProductLists () {
    let query = this.$route.query
    getCompanyProductListsApi({ id: query.id, page: 1, count: 50 })
  }
  // 绑定已有公司的管理员
  async bindAdmin () {
    // this.isFromUser = !false;
    this.showAdminWindow = true
    this.isBindAdmin = !!this.companyInfo.createdUid
    this.isOldEdit = true
  }
  /* 移除已有公司的管理员 */
  async delateAdmin () {
    this.showAdminWindow = true
    // 判断是否存在公司id，如果存在，则进入下一步
    if (this.companyInfo.createdUid) {
      let param = {
        page: 1,
        count: 2
      }
      // 弹出移除并更换管理员的系统弹框，并自动调取管理员列表，获取下一个管理员信息
      let res = await getRecruitersListApi(this.$route.query.id, param)
      res.data.data.forEach((item, index) => {
        if (this.companyInfo.createdUid !== item.uid) {
          this.nextAdmin = item
        } else {
          if (index === 0) {
            this.nextAdmin = null
          }
        }
      })
    }
  }
  close (e) {
    this.showAdminWindow = false
    if (e && e.needLoad) this.getCompanyInfo()
  }
  closeBtn () {
    this.showAdminWindow = false
  }
  /* 查看大图 */
  showImg (imgUrl) {
    this.nowImg = imgUrl
  }
  /* 隐藏大图 */
  hiddenMask () {
    this.nowImg = ''
  }
  created () {
    this.getCompanyInfo()
  }
}
</script>

<style lang="less" scoped="scoped">
.common-list_01 {
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
  }
  .upload-li {
    position: relative;
    box-sizing: border-box;
    border: dotted 1px #DCDCDC;
    background: #f5f7fa;
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
    top: -8px;
    right: -8px;
    color: #BCBCBC;
    font-size: 20px;
    line-height: 1;
    cursor: pointer;
  }
  .el-progress--circle{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
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
.seePhoto {
  position: relative;
  width: 130px;
  height: 170px;
  overflow: hidden;
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
    // .el-steps{
    //   text-align: left;
    //   width: 500px;
    // }
  }
  /*公司信息*/
  .companyInfo,
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
    border-radius: 0 0 4px 4px;
    padding: 30px 32px;
    h3 {
      font-size: 25px;
      font-weight: 500;
      color: #652791;
      margin-bottom: 20px;
    }
  }
  .companyInfo {
    border: 1px solid #cccccc;
    border-radius: 0 0 4px 4px;
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
}
.emailBox {
  color: #ffffff;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  z-index: 9999;
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
</style>
