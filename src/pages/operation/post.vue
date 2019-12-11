<template>
  <div id="operation-create" style="width: 1200px;">
  	<el-form
      :model="form"
      :rules="rules"
      ref="form"
      label-width="120px"
      label-suffix="：">

  		<el-form-item label="端口" prop="device">
		    <el-select
          v-model="form.device"
          @change="changeDevice"
          placeholder="请选择端口"
          :disabled="$route.name === 'operationEdit'"
          style="width: 100%">
			    <el-option
            :label="item.text"
            :value="item.key"
            v-for="item in portData"
            :key="item.key">
          </el-option>
			  </el-select>
		  </el-form-item>

      <el-form-item label="用户端" prop="client">
        <el-select
          v-model="form.client"
          placeholder="请选择用户端"
          style="width: 100%"
          :disabled="$route.name === 'operationEdit'">
          <el-option
            :label="item.text"
            :value="item.key"
            v-for="item in bannerParameter.client"
            :key="item.key">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="运营位" prop="location">
        <el-select
          v-model="form.location"
          placeholder="请选择运营位"
          style="width: 100%"
          :disabled="$route.name === 'operationEdit'">
          <el-option
            :label="item.text"
            :value="item.key"
            v-for="item in bannerParameter.location"
            :key="item.key">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="落地页类行" prop="type">
        <el-select
          v-model="form.type"
          placeholder="请选择落地页类行"
          style="width: 100%">
          <el-option
            :label="item.name"
            :value="item.type"
            v-for="item in bannerParameter.bannerType"
            :key="item.type">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="落地页页面" prop="inputAny">
        <el-input
          type="text"
          v-model="form.inputAny"
          :placeholder="placeholder">
        </el-input>
      </el-form-item>

      <el-form-item label="数据识别码" prop="vkey">
        <el-input
          type="text"
          v-model="form.vkey"
          placeholder="请填写数据识别码">
        </el-input>
      </el-form-item>

      <el-form-item label="大图片上传" prop="big_img_id_checked">
        <image-uploader
          :width="imagesUploader.width"
          :height="imagesUploader.height"
          type="big_img_id"
          :tips="imagesUploader[form.location]"
          v-model="form.big_img_id.smallUrl"
          @loaded="uploadImage" />
      </el-form-item>
      
      <el-form-item label="小图片上传" prop="small_img_id_checked" v-if="form.device && form.device !== 'pc'">
        <image-uploader
          :width="imagesUploader.width"
          :height="imagesUploader.height"
          type="small_img_id"
          :tips="imagesUploader[form.location]"
          v-model="form.small_img_id.smallUrl"
          @loaded="uploadImage" />
      </el-form-item>

      <el-form-item label="城市" prop="area_id">
        <el-select
          v-model="form.area_id"
          placeholder="请选择城市"
          style="width: 100%">
          <el-option
            :label="item.text"
            :value="item.key"
            v-for="item in bannerParameter.area"
            :key="item.key">
          </el-option>
        </el-select>
      </el-form-item>

		  <el-form-item label="广告位名称" prop="name">
		    <el-input
          type="text"
          v-model="form.name"
          placeholder="请填写广告位名称">
        </el-input>
		  </el-form-item>

		  <el-form-item label="上架时间" prop="start_time">
		    <el-date-picker
          type="datetime"
          placeholder="选择上架时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          v-model="form.start_time"
          style="width: 100%;"
          @change="changeStartTime"
          :picker-options="pickerOptionsStart"
        ></el-date-picker>
		  </el-form-item>

		  <el-form-item label="截止时间" prop="end_time">
		    <el-date-picker
          type="datetime"
          placeholder="选择截止时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          v-model="form.end_time"
          style="width: 100%;"
          @change="changeEndTime"
          :picker-options="pickerOptionsStart"
          :disabled="!!!form.start_time"
        ></el-date-picker>
		  </el-form-item>

		  <el-form-item label="权重排序" prop="sort">
		    <el-input
          type="text"
          v-model="form.sort"
          placeholder="请输入权重排序">
        </el-input>
		  </el-form-item>
      
      <el-form-item label="状态" prop="status" v-if="$route.name === 'operationEdit'">
        <el-radio v-model="form.status" :label="1">上线</el-radio>
        <el-radio v-model="form.status" :label="0">下线</el-radio>
      </el-form-item>

		  <el-form-item>
		    <el-button type="primary" @click="check">确认</el-button>
		    <el-button @click="rtBack">返回</el-button>
		  </el-form-item>

		</el-form>
  </div>
</template>
<script>
  import ImageUploader from '@/components/imageUploader'
  import {
    getBannerDeviceApi,
    getBannerParameterApi,
    getBannerListsApi,
    getBannerDetailApi,
    updateBannerDetailApi,
    postBannerDetailApi
  } from 'API/operation'
  import { uploadApi } from 'API/common'
  const debounce = (() => {
    let timer = 0
    return (callback, ms) => {
      clearTimeout(timer)
      timer = setTimeout(callback, ms)
    }
  })()
  export default {
    watch: {
      'form.type': {
        handler(str) {
          this.form.inputAny = ''
          switch(str) {
            case 'company':
              this.placeholder = '请输入公司id'
              break
            case 'position':
              this.placeholder = '请输入职位id'
              break
            case 'recruiter':
              this.placeholder = '请输入招聘官id'
              break
            case 'rank':
              this.placeholder = '请输入排行榜id'
              break
            case 'link':
              this.placeholder = '请输入外链链接'
              break
            case 'page':
              this.placeholder = '请输入小程序页面路径'
              break
            default:
              break
          }
        },
        immediate: true
      },
      'form.location': {
        handler(str) {
          this.form.big_img_id_checked = ''
          this.form.small_img_id_checked = ''
          this.form.small_img_id = {smallUrl: ''}
          this.form.big_img_id = {smallUrl: ''}
          this.form.area_id = ''
          this.form.type = ''
          setTimeout(() => {
            this.$refs.form.clearValidate('big_img_id_checked')
            this.$refs.form.clearValidate('small_img_id_checked')
            this.$refs.form.clearValidate('type')
          }, 16.7)
        },
        immediate: true
      }
    },
    components: {
      ImageUploader
    },
    data() {
      return {
        portData: [],
        form: {
          name: '', // 广告图名称
          device: '', // 推送端：miniProgram, pc, app
          location: '', // banner运营位
          type: '', // 落地页类型
          type_id: '', // 落地页ID
          url: '', // 落地页链接
          h5_url: '', // 落地页H5链接
          vkey: '', // 识别码
          big_img_id: {
            smallUrl: ''
          }, // 大图ID
          big_img_id_checked: '',
          small_img_id: {
            smallUrl: ''
          }, // 小图ID
          small_img_id_checked: '',
          area_id: '', // 城市
          sort: 1, // 排序
          start_time: '', // 开始时间
          end_time: '', // 结束时间
          status: 1,
          inputAny: '',
          client: ''
        },
        rules: {
          name: [
            { required: true, message: '请输入广告位名称', trigger: 'change' },
            { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'change' }
          ],
          device: [
            { type: 'string', required: true, message: '请选择端口', trigger: 'change' }
          ],
          client: [
            { type: 'string', required: true, message: '请选择用户端', trigger: 'change' }
          ],
          location: [
            { required: true, message: '请选择运营位', trigger: 'change' }
          ],
          area_id: [
            { required: true, message: '请选择城市', trigger: 'change' }
          ],
          type: [
            { required: true, message: '请选择落地页类行', trigger: 'change' }
          ],
          vkey: [
            { required: true, message: '请输入数据识别码', trigger: 'change' }
          ],
          status: [
            { required: true, message: '请选择上线状态', trigger: 'change' }
          ],
          start_time: [
            { type: 'string', required: true, message: '请选择上架时间', trigger: 'change' }
          ],
          end_time: [
            { type: 'string', required: true, message: '请选择下架时间', trigger: 'change' }
          ],
          big_img_id_checked: [
            { type: 'date', required: true, message: '请选择大图图片', trigger: 'change' }
          ],
          small_img_id_checked: [
            { type: 'date', required: true, message: '请选择小图图片', trigger: 'change' }
          ],
          sort: [
            { required: true, message: '请输入权重排序', trigger: 'change' }
          ],
          inputAny: [
            { required: true, message: '输入页面路径或者页面id', trigger: 'change' }
          ],
        },
        bannerParameter: {},
        imagesUploader: {
          point: '',
          width: 690,
          height: 140,
          tips1: '建议尺寸690X140px，JPG、PNG格式，图片小于5M。', // c首页-24小时急速约面
          job_hunter_24h: '建议尺寸690X190px，JPG、PNG格式，图片小于5M。', // C端24h约面中间banner
          job_hunter_index: '建议尺寸690X140px，JPG、PNG格式，图片小于5M。', // C端创建简历banner
          recruiter_index: '建议尺寸690X168px，JPG、PNG格式，图片小于5M。' // B端首页banner
        },
        placeholder: '请输入落地页页面',
        pickerOptionsStart: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;
          }
        }
      };
    },
    methods: {
      changeStartTime(date) {
        this.form.end_time = ''
      },
      changeEndTime(date) {
        let distance = 60 * 1000 // 时间间隔最小一个钟
        let timestamp_start = Date.parse(new Date(this.form.start_time))
        let timestamp_end = Date.parse(new Date(date))
        // this.$message({message, type: 'success'});
        if(timestamp_end - timestamp_start < distance) {
          this.$message({message: '截止时间不能晚于一个钟~', type: 'warning'});
          this.form.end_time = ''
          setTimeout(() => { this.$refs.form.clearValidate('end_time') }, 16.7)
        }
      },
      uploadImage(e) {
        let formData = new FormData()
        formData.append('attach_type', 'img')
        formData.append('img', e)
        uploadApi(formData).then(({ data }) => {
          this.form[e.uploadType] = data.data[0]
          this.form[`${e.uploadType}_checked`] = data.data[0].id
          this.$refs['form'].validateField(`${e.uploadType}_checked`)
        })
      },
      getBannerParameter(item) {
        return getBannerParameterApi({device: item.key}).then(({data}) => {
          let bannerParameter = data.data
          bannerParameter.client.shift()
          bannerParameter.location.shift()
          this.bannerParameter = bannerParameter
          return bannerParameter
        })
      },
      getBannerDevice() {
        return getBannerDeviceApi().then(({ data }) => {
          let portData = data.data.filter(v => v.key !== 'pc')
          this.portData = portData
          // this.getBannerParameter(this.portData[0])
        })
      },
      changeDevice(key) {
        let item = this.portData.find(v => v.key === key)
        this.getBannerParameter(item)
      },
      check() {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.submit()
          } else {
            return false;
          }
        });
      },
      rtBack() {
        this.$confirm('返回将不保存更改的内容，是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$router.go(-1)
        }).catch(() => {});
      },
      getBannerDetail() {
        getBannerDetailApi({id: this.$route.query.id}).then(({data}) => {
          let form = data.data
          this.form.device = form.device
          this.form.location = form.location
          this.form.name = form.name
          this.form.start_time = form.startTime
          this.form.end_time = form.endTime
          this.form.sort = form.sort
          this.form.vkey = form.vkey
          this.form.url = form.url
          this.form.h5_url = form.h5Url
          this.form.id = form.id
          this.form.status = form.status
          this.form.client = form.client
          this.getBannerParameter({key: form.device}).then(res => {
            this.form.big_img_id = form.bigImg
            this.form.small_img_id = form.smallImg
            this.form.big_img_id_checked = form.bigImg.id
            this.form.small_img_id_checked = form.smallImg.id
            this.form.type = form.type || 'page'
            this.form.area_id = form.areaId
            let data = res.bannerType.find(v => v.type === form.type)
            setTimeout(() => {
              switch(data.limitType) {
                case 1:
                  this.form.inputAny = form.typeId
                  break
                case 2:
                  this.form.inputAny = form.h5Url
                  break
                case 3:
                  this.form.inputAny = form.url
                  break
                default:
                  break
              }
            }, 16.7)
          })
        })
      },
      submit() {
        let funcApi = this.$route.name === 'operationEdit' ? updateBannerDetailApi : postBannerDetailApi
        let callback = () => {
          let message = this.$route.name === 'operationEdit' ? '修改成功~' : '添加成功~'
          this.$message({message, type: 'success'});
          this.$router.go(-1)
        }
        let form = this.form
        let params = {
          name: form.name, // 广告图名称
          device: form.device, // 推送端：miniProgram, pc, app
          location: form.location, // banner运营位
          type: form.type, // 落地页类型
          // type_id: form.type_id, // 落地页ID
          // url: form.url, // 落地页链接
          // h5_url: form.h5_url, // 落地页H5链接
          vkey: form.vkey, // 识别码
          big_img_id: form.big_img_id.id, // 大图ID
          // small_img_id: form.small_img_id.id, // 小图ID
          area_id: form.area_id, // 城市
          sort: form.sort, // 排序
          start_time: form.start_time, // 开始时间
          end_time: form.end_time, // 结束时间
        }
        let item = this.bannerParameter.bannerType.find(v => v.type === this.form.type)
        switch(item.limitType) {
          case 1:
            params = Object.assign(params, {type_id: form.inputAny})
            break
          case 2:
            params = Object.assign(params, {url: form.inputAny})
            break
          case 3:
            params = Object.assign(params, {h5_url: form.inputAny})
            break
          default:
            break
        }
        if(form.device && form.device !== 'pc') {
          params = Object.assign(params, {small_img_id: form.small_img_id.id})
        }
        if(form.id) {
          params = Object.assign(params, {id: form.id, status: form.status})
        }
        funcApi(params).then(() => callback())
      }
    },
    created() {
      this.getBannerDevice().then(res => {
        if(this.$route.name === 'operationEdit') {
          this.getBannerDetail()
        }
      })
    }
  }
</script>
<style lang="less">
#operation-create {
	margin: 50px 0;
}
</style>
