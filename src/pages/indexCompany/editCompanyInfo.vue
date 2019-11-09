<template>
  <div class="editCompanyInfo">
    <!--头部-->
    <div class="header">
      <div class="left">
        <span class="title">公司认证信息</span>
      </div>
      <div class="editBox">
        <el-button class="inquire" @click.stop="save">保存</el-button>
      </div>
    </div>
    <!--公司信息表格-->
    <div class="companyInfo">
      <div class="point">上传工牌/名片/在职证明等信息需要与身份信息保持一致</div>
      <el-form class="edit-form" ref="form" :model="companyInfo" label-width="150px" label-suffix="：">
        <h3>公司信息</h3>
        <!--工牌/名片/在职证明-->
          {{form.logo}}
        <el-form-item class="full" label="公司LOGO" prop="icon">
          <image-uploader :width="iconUploader.width"
                          :height="iconUploader.height"
                          type="logo"
                          v-model="form.logo"
                          @loaded="handleIconLoaded"/>
          }
        </el-form-item>

        <el-form-item label="公司全称" prop="title">
          <el-input v-model="companyInfo.company_name" placeholder="请输入名称" :maxlength="30" style="width: 400px;"></el-input>
        </el-form-item>

        <el-form-item label="公司简称" prop="title">
          <el-input v-model="companyInfo.company_shortname" placeholder="请输入名称" :maxlength="30" style="width: 400px;"></el-input>
        </el-form-item>

        <el-form-item label="公司地址" prop="address_id" style="width: 380px;">
          <span class="addAdress" @click.stop="changeAdress"><i class="el-icon-circle-plus" style="color: #67C23A;"></i>点击添加公司地址</span>
          <!--公司地址列表-->
          <span class="AdressList" v-for="item in adressList" :key="item.id">
            <i @click.stop="delAdress(item.id)" class="el-icon-remove" style="color: rgb(245, 108, 108);"></i>
            {{`${item.address}${item.doorplate}`}}
          </span>
        </el-form-item>

        <el-form-item label="所属行业" prop="tags">
          <el-select style="width: 400px;" ref="tagSelector" v-model="companyInfo.industry_id" placeholder="请选择所属行业">
            <el-option v-for="item in industry" :label="item.name" :value="item.labelId" :key="item.id" />
          </el-select>
        </el-form-item>

        <el-form-item label="融资阶段" prop="tags">
          <el-select style="width: 400px;" ref="tagSelector" v-model="companyInfo.financing" placeholder="请选择融资阶段">
            <el-option v-for="item in financing" :label="item.name" :value="item.id" :key="item.id" />
          </el-select>
        </el-form-item>

        <el-form-item label="人员规模" prop="tags">
          <el-select style="width: 400px;" ref="tagSelector" v-model="companyInfo.employees" placeholder="请选择人员规模">
            <el-option v-for="item in employees" :label="item.name" :value="item.id" :key="item.id" />
          </el-select>
        </el-form-item>

        <el-form-item class="introduction" label="公司简介" style="width: 640px;">
          <el-input
            type="textarea"
            :rows="6"
            placeholder="请输入内容"
            v-model="companyInfo.intro">
          </el-input>
        </el-form-item>
        <h3>资质信息</h3>
        <el-form-item class="full" label="营业执照" prop="icon">
          <image-uploader :width="iconUploader.width"
                          :height="iconUploader.height"
                          :tips="iconUploader.tips"
                          type="business_license"
                          v-model="form.icon1"
                          @loaded="handleIconLoaded"/>
        </el-form-item>
        <!--工牌/名片/在职证明-->
        <el-form-item class="full" label="工牌/名片/在职证明(三选一)" prop="icon">
          <image-uploader :width="iconUploader.width"
                          :height="iconUploader.height"
                          :tips="iconUploader.tips"
                          type="on_job"
                          v-model="form.icon2"
                          @loaded="handleIconLoaded"/>
        </el-form-item>
      </el-form>
    </div>
    <!--添加新公司地址弹窗-->
    <div class="pop" v-show="pop.isShow">
      <!--<map-search></map-search>-->
      <div class="addAdressBox">
        <div id="map" style="width:500px; height:400px"></div>
        <div class="searchBox">
          <input class="textbox searchMap" placeholder="请输入包含市名的地址" type="textbox" v-model="keyword"  @keyup.enter="searchKeyword">
          <input class="btn" type="button" value="搜索" @click="searchKeyword">
          <div style='width: 380px; height: 180px' id="infoDiv" @click.stop="clickAdress"></div>
        </div>
        <div class="nowPosi">
          <div class="address"><span>地址：</span>{{nowPosiInfo.address}}</div>
          <div class="btnBox">
            <el-button @click.stop="popCancel">取消</el-button>
            <el-button @click.stop="addAdress" style="background-color: #652791; color: #FFFFFF;" v-if="nowPosiInfo.address">保存</el-button>
            <el-button @click.stop="addAdress" disabled  type="info" v-else>保存</el-button>
          </div>
          <div class="doorplate"><span>门牌号：</span><input class="textbox" type="textbox" v-model="doorplate"></div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import ImageUploader from '@/components/imageUploader'
import { fieldApi, uploadApi } from 'API/common'
import { getCompanyInfoApi, editCompanyApi, addCompanyAddressApi, delCompanyAddressApi } from 'API/company'
import { TMap } from '../../util/js/TMap.js'
// import mapSearch from '@/components/map'
@Component({
  name: 'editCompany',
  components: {
    ImageUploader
    //  mapSearch
  }
})
export default class editCompany extends Vue {
  map = null // 当前地图对象
  geocoder = null // 地址获取地图信息
  searchService = null // 查询地图信息
  qqMapObj = null
  center = null // 当前选择坐标值
  nowMarker = null // 当前选择的坐标对象
  markers = [] // 当前查询回来的地址信息数组
  nowResults = [] // 当前搜索地址的结果列表
  nowPosiInfo = '' // 当前地址信息
  keyword = '北京市天安门广场' // 搜索地址关键词
  doorplate = ''
  /* 公司信息 */
  companyInfo = {
    company_name: '', // 公司名称
    company_shortname: '', // 公司简称
    industry_id: '', // 所属行业
    financing: '', // 融资
    employees: '', // 规模
    intro: '', // 公司简介
    business_license: '', // 营业执照
    on_job: '', // 在职证明
    logo: ''
  }
  /* 图片信息 */
  form = {
    logo: '', // logo
    icon1: '', // 营业执照
    icon2: '' // 工牌/名片/在职证明
  }
  /* 提示语 */
  iconUploader = {
    point: '',
    width: 280,
    height: 158,
    tips: '建议尺寸280X158px，JPG、PNG格式，图片小于5M。'
  }
  /* 融资情况标签 */
  financing = [
    { name: '未融资', id: 1 },
    { name: '天使轮', id: 2 },
    { name: 'A轮', id: 3 },
    { name: 'B轮', id: 4 },
    { name: 'C轮', id: 5 },
    { name: 'D轮及以上', id: 6 },
    { name: '已上市', id: 7 },
    { name: '不需要融资', id: 8 }
  ]
  /* 规模标签 */
  employees = [
    { name: '0-20人', id: 1 },
    { name: '20-99人', id: 2 },
    { name: '100-499人', id: 3 },
    { name: '500-999人', id: 4 },
    { name: '1000-9999人', id: 5 },
    { name: '10000人以上', id: 6 }
  ]
  pop = {
    isShow: false,
    type: 'position'
  }
  /* 地址数据 */
  addressData = {
    areaName: '',
    area_id: '',
    address: '',
    doorplate: '',
    lng: '',
    lat: ''
  }
  /* 地址列表 */
  adressList = []
  /* 所属行业 */
  industry = []
  adressInput = ''
  adress_id_Input = ''
  mounted () {
    let that = this
    TMap('P63BZ-4RM35-BIJIV-QOL7E-XNCZZ-WIF4L').then(qq => {
      that.$nextTick(() => {
        let center = new that.qqMapObj.maps.LatLng(39.916527, 116.397128)
        that.map = new that.qqMapObj.maps.Map(document.getElementById('map'), {
          center: center,
          zoom: 13
        })
      })
      // 保存地图对象
      that.qqMapObj = qq
      let latlngBounds = new qq.maps.LatLngBounds()
      that.searchService = new qq.maps.SearchService({
        // 设置搜索范围为北京
        location: '北京',
        // 设置搜索页码为1
        pageIndex: 0,
        // 设置每页的结果数为5
        pageCapacity: 5,
        // 设置展现查询结构到infoDIV上
        panel: document.getElementById('infoDiv'),
        // 设置动扩大检索区域。默认值true，会自动检索指定城市以外区域。
        autoExtend: true,
        // 检索成功的回调函数
        complete: function (results) {
          that.nowResults = results.detail.pois
          // 设置回调函数参数
          let pois = results.detail.pois
          for (let i = 0, l = pois.length; i < l; i++) {
            let poi = pois[i]
            // 扩展边界范围，用来包含搜索到的Poi点
            latlngBounds.extend(poi.latLng)
            let marker = new qq.maps.Marker({
              map: that.map,
              position: poi.latLng
            })

            marker.setTitle(i + 1)
            that.markers.push(marker)
          }
          // 调整地图视野及中心坐标
          let nowPosi = new qq.maps.LatLng(that.markers[0].position.lat, that.markers[0].position.lng)
          that.map.fitBounds(latlngBounds)
          that.map.zoomTo(13)
          that.map.setCenter(nowPosi)
        },
        // 若服务请求失败，则运行以下函数
        error: function () {
          alert('地址太过模糊，无法找到信息。')
        }
      })

      that.geocoder = new qq.maps.Geocoder({
        complete: function (result) {
          if (that.nowPosiInfo === '') {
            that.nowPosiInfo = result.detail
          } else {
            that.nowPosiInfo.addressComponents = result.detail.addressComponents
          }
          /* let data = {
            mobile: that.form.mobile,
            areaName: result.detail.addressComponents.city || '',
            // address: result.detail.address,
            address: that.adressInput,
            doorplate: that.addressData.doorplate,
            lng: result.detail.location.lng,
            lat: result.detail.location.lat
          } */
        }, // 若服务请求失败，则运行以下函数
        error: function (e) {
          that.nowPosiInfo = ''
          //        that.$message.error("地址搜索失败,请确保地址准确且包含城市名")
        }
      })
    })
  }

  // 添加公司地点
  addAdress () {
    const { id } = this.$route.query
    const data = {
      area_id: this.nowPosiInfo.addressComponents.city,
      doorplate: this.doorplate,
      address: this.nowPosiInfo.address,
      lng: this.nowPosiInfo.location ? this.nowPosiInfo.location.lng : this.nowPosiInfo.latLng.lng,
      lat: this.nowPosiInfo.location ? this.nowPosiInfo.location.lat : this.nowPosiInfo.latLng.lat
    }

    addCompanyAddressApi(id, data).then((res) => {
      this.$message({
        type: 'success',
        message: '添加成功!'
      })
      this.adressList.push(res.data.data)
      this.popCancel()
    })
  }
  /* 删除公司地址 */
  delAdress (id) {
    this.$confirm('您确定删除吗?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      customClass: 'messageBox',
      type: 'warning'
    }).then(() => {
      delCompanyAddressApi(id).then(res => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.adressList.map((item, index) => {
          if (item.id === id) {
            this.adressList.splice(index, 1)
          }
        })
      }).catch(() => {})
    }).catch(() => {
      this.$message({
        type: 'info',
        message: '已取消删除'
      })
    })
  }
  // 关闭地图层
  popCancel () {
    this.pop.isShow = false
    this.nowPosiInfo = ''
  }
  // 搜索地址
  searchKeyword () {
    this.nowPosiInfo = ''
    this.clearOverlays(this.markers)
    this.geocoder.getLocation(this.keyword)
    this.searchService.search(this.keyword)
  }

  // 选中搜索后的地址
  clickAdress (e) {
    let that = this
    this.nowResults.map((item, index) => {
      if (item.address === e.target.innerText || item.name === e.target.innerText) {
        that.nowPosiInfo = item
        let latLng = new that.qqMapObj.maps.LatLng(item.latLng.lat, item.latLng.lng)
        that.geocoder.getAddress(latLng)
      }
    })
  }

  // 清除上次查询后地图上的标注
  clearOverlays (overlays) {
    var overlay
    // eslint-disable-next-line no-cond-assign
    while (overlay = overlays.pop()) {
      overlay.setMap(null)
    }
  }

  // 工作地点选择
  changeAdress (e) {
    let that = this
    // let center = new that.qqMapObj.maps.LatLng(39.916527, 116.397128)

    this.qqMapObj.maps.event.addListener(that.map, 'click', function (e) {
      // 清除地图上搜索的坐标
      that.markers.map(item => {
        item.setMap(null)
      })
      // 清除上一次选择的坐标
      if (that.nowMarker) that.nowMarker.setMap(null)
      let choosePosition = new that.qqMapObj.maps.LatLng(e.latLng.lat, e.latLng.lng)
      that.nowMarker = new that.qqMapObj.maps.Marker({
        position: choosePosition,
        map: that.map
      })
    })

    this.pop = {
      isShow: true,
      type: 'addAdress'
    }
    this.form.address_id = ''
    return false
  }

  /* 编辑图片 */
  handleIconLoaded (e) {
    let formData = new FormData()
    formData.append('attach_type', 'img')
    formData.append('img', e)
    uploadApi(formData).then(res => {
      if (e.uploadType === 'business_license') {
        this.companyInfo.business_license = res.data.data[0].id
      } else if (e.uploadType === 'on_job') {
        this.companyInfo.on_job = res.data.data[0].id
      } else if (e.uploadType === 'logo') {
        this.companyInfo.logo = res.data.data[0].id
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
    getCompanyInfoApi(id).then(res => {
      this.form = {
        logo: res.data.data.companyInfo.logoInfo.url,
        icon1: res.data.data.companyInfo.businessLicenseInfo.url,
        icon2: res.data.data.companyInfo.onJobInfo.url
      }
      /* 公司信息 */
      this.companyInfo = {
        company_name: res.data.data.companyInfo.companyName, // 公司名称
        company_shortname: res.data.data.companyInfo.companyShortname, // 公司简称
        industry_id: res.data.data.companyInfo.industryId, // 所属行业
        financing: parseInt(res.data.data.companyInfo.financing), // 融资
        employees: parseInt(res.data.data.companyInfo.employees), // 规模
        intro: res.data.data.companyInfo.intro, // 公司简介
        business_license: res.data.data.companyInfo.businessLicenseInfo.id, // 营业执照
        on_job: res.data.data.companyInfo.onJobInfo.id, // 在职证明
        logo: res.data.data.companyInfo.logoInfo.id
      }
      /* 地址列表 */
      this.adressList = res.data.data.companyInfo.address
    })
  }
  /* 保存 */
  save () {
    const { id } = this.$route.query
    editCompanyApi(id, this.companyInfo).then(res => {
      this.$message({
        type: 'success',
        message: '保存成功!'
      })
      this.$router.go(-1)
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
  h3{
    font-size: 20px;
    font-weight: 700;
    color: #354048;
    line-height: 28px;
    margin-bottom: 32px;
  }
  .introduction{
    width: 520px;
  }
}
.addAdress{
  i{
    margin-right: 5px;
  }
  color: #652791;
  cursor: pointer;
}
.AdressList{
  white-space: nowrap;
  i{
    margin-right: 5px;
    cursor: pointer;
  }
  display: block;
}
.inquire{
  background-color: #652791;
  color: #FFFFFF;
  border-radius: 4px;
}
.addAdressPop {
  width:432px;
  background:rgba(255,255,255,1);
  box-shadow:0px 4px 12px 0px rgba(0,0,0,0.2);
  border-radius:4px;
  background: white;
  position: fixed;
  left: 50%;
  top: 50%;
  z-index: 6;
  transform: translate(-50%, -50%);
  box-sizing: border-box;
  padding: 36px;
  text-align: left;
  .clo {
    width:10px;
    height:10px;
    position: absolute;
    right: 16px;
    top: 16px;
  }
  h3 {
    font-size:16px;
    font-weight:500;
    color:rgba(53,64,72,1);
  }
  p {
    font-size:14px;
    font-family:PingFang-SC-Regular;
    font-weight:400;
    color:rgba(98,98,98,1);
    margin: 4px 0 14px 0;
  }
  .btn-add {
    display: flex;
    justify-content: flex-end;
    flex-direction: row;
    .btn_cancel {
      width:80px;
      height:32px;
      background:rgba(255,255,255,1);
      border-radius:16px;
      border:1px solid rgba(220,220,220,1);
      box-sizing: border-box;
      font-size:14px;
      font-family:PingFangSC-Regular;
      font-weight:400;
      color:rgba(53,64,72,1);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
    }
    .btn_submit {
      width:80px;
      height:32px;
      background:rgba(101,39,145,1);
      border-radius:16px;
      box-sizing: border-box;
      border:1px solid rgba(101,39,145,1);
      font-size:14px;
      font-family:PingFangSC-Regular;
      font-weight:400;
      color:rgba(255,255,255,1);
      margin-left: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      span {
        color: #fff;
      }
    }
  }
}
.pop {
  position: fixed;
  left: 0;
  top: 0;
  background: rgba(0, 0, 0, 0.8);
  width: 100%;
  height: 100%;
  z-index: 100;
  .addAdressBox{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 30px;
    border-radius: 10px;
    width: 900px;
    height: 500px;
    background-color: #FFFFFF;
    #map{
      float: left;
      margin-right: 10px;
      margin-bottom: 20px;
    }
    .searchBox {
      float: left;
      input {
        border: 1px solid #CCCCCC;
        border-radius: 5px;
        margin-right: 10px;
        padding: 5px;
      }
      .searchMap{
        width: 300px;
      }
      #infoDiv{
        text-align: left;
      }
    }
    .nowPosi {
      padding: 20px 0;
      clear: both;
      width: 100%;
      border-top: 1px solid #CCCCCC;
      .address {
        color: #652791;
        width: 400px;
        text-align: left;
        float: left;
        span{
          color: #929292;
        }
      }
      .doorplate {
        margin-right: 20px;
        float: right;
        input {
          border: 1px solid #CCCCCC;
          border-radius: 5px;
          margin-right: 10px;
          padding: 5px;
        }
      }
      .btnBox {
        float: right;
      }
    }
  }
}
</style>
