import Vue from 'vue'
import Component from 'vue-class-component'
// import { addCompanyAddressApi, delCompanyAddressApi } from 'API/company'
import { TMap } from '../../util/js/TMap.js'
// const QQMapWX = require('../../util/lib/qqmap-wx-jssdk.min.js')

@Component({
  name: 'mapSearch',
  props: {
    componyId: {
      type: Number
    }
  }
})
export default class mapSearch extends Vue {
  map = null // 当前地图对象
  geocoder = null // 地址获取地图信息
  searchService = null // 查询地图信息
  qqMapObj = null
  center = null // 当前选择坐标值
  marker = null // 当前选择的坐标对象
  markers = [] // 当前查询回来的地址信息数组
  nowResults = [] // 当前搜索地址的结果列表
  nowPosiInfo = '' // 当前地址信息
  keyword = '北京市天安门广场' // 搜索地址关键词
  doorplate = ''

  /* 地址数据 */
  addressData = {
    areaName: '',
    area_id: '',
    address: '',
    doorplate: '',
    lng: '',
    lat: ''
  }

  mounted () {
    let that = this
    TMap('TMZBZ-S72K6-66ISB-ES3XG-CVJC6-HKFZG').then(qq => {
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
          var pois = results.detail.pois
          for (var i = 0, l = pois.length; i < l; i++) {
            var poi = pois[i]
            // 扩展边界范围，用来包含搜索到的Poi点
            latlngBounds.extend(poi.latLng)
            var marker = new qq.maps.Marker({
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
          that.$message.error('地址太过模糊,请确保地址准确且包含城市名')
        }
      })
    })
  }

  /* 搜索地址 */
  searchKeyword () {
    this.nowPosiInfo = ''
    this.clearOverlays(this.markers)
    this.geocoder.getLocation(this.keyword)
    this.searchService.search(this.keyword)
  }

  /* 添加公司地点 */
  addAdress () {
    const data = {
      area_id: this.nowPosiInfo.addressComponents.city,
      doorplate: this.doorplate,
      address: this.nowPosiInfo.address,
      lng: this.nowPosiInfo.location ? this.nowPosiInfo.location.lng : this.nowPosiInfo.latLng.lng,
      lat: this.nowPosiInfo.location ? this.nowPosiInfo.location.lat : this.nowPosiInfo.latLng.lat
    }
    this.saveData(data)
    this.popCancel()
  }

  /* 返回地址数据 */
  saveData (data) {
    this.$emit('addAdress', { data: data })
  }

  /* 关闭弹窗 */
  popCancel () {
    this.$emit('popCancel')
  }

  /* 选中搜索后的地址 */
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

  /* 清除上次查询后地图上的标注 */
  clearOverlays (overlays) {
    var overlay
    // eslint-disable-next-line no-cond-assign
    while (overlay = overlays.pop()) {
      overlay.setMap(null)
    }
  }
}
