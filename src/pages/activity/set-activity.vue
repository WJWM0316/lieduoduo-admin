<template>
<!-- 活动信息设置 -->
  <div class="activity-wrapper">
    <h1 class="activity-form-title">活动基本信息</h1>
    <el-form ref="baseForm" :model="baseForm" :rules="baseFormRules" label-width="120px">
      <el-form-item prop="title" label="活动名称">
        <el-input v-model="baseForm.title" placeholder="请输入活动名称"  />
      </el-form-item>
      <el-form-item label="活动译文">
        <el-input v-model="baseForm.translation" placeholder="请填写活动英文/拼音译文"  />
      </el-form-item>
      <el-form-item prop="device" label="端口">
        <el-checkbox-group v-model="baseForm.device">
          <el-checkbox label="app">APP</el-checkbox>
          <el-checkbox label="pc">PC</el-checkbox>
          <el-checkbox label="mini_program">小程序</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item prop="client" label="用户端">
        <el-checkbox-group v-model="baseForm.client">
          <el-checkbox label="b">B端</el-checkbox>
          <el-checkbox label="c">C端</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item prop="time" label="活动时间">
        <el-date-picker
          v-model="baseForm.time"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item prop="wap_url" label="小程序链接">
        <el-input placeholder="请输入渠道码" v-model="baseForm.mini_sourceType">
          <template slot="prepend">{{baseLink.mini}}</template>
        </el-input>
        <el-input placeholder="请输入H5链接" v-model="baseForm.wap_url">
          <template slot="prepend">&p=</template>
        </el-input>
        <el-popover
          placement="top"
          width="160"
          v-model="showQrcode">
          <div style="height: 160px">
            <img style="max-width: 100%" :src="qrCodeImage" alt="">
          </div>
          <el-button slot="reference" style="margin-left: 4px" icon="el-icon-camera" @click="handleShowQrCode">扫码</el-button>
        </el-popover>
      </el-form-item>
      <el-form-item prop="web_url" label="网页链接">
        <el-input placeholder="请输入" v-model="baseForm.web_url">
          <template slot="prepend">{{baseLink.web}}</template>
        </el-input>
      </el-form-item>
      <el-form-item prop="intro" label="活动介绍">
        <el-input type="textarea" placeholder="请输入活动介绍" v-model="baseForm.intro" />
      </el-form-item>
    </el-form>
    <h1 class="activity-form-title">分享设置</h1>
    <el-form :model="shareForm" label-width="120px">
      <el-form-item prop="img_url" label="分享海报">
        <upload-picture
          :show-tip-text="true"
          tipText="尺寸750x1334px，JPG、PNG格式，图片小于5M。"
          :value.sync="shareForm.img_url"
          @change="(value) => changeImage('img', value)"/>
      </el-form-item>
      <el-form-item prop="mini_img_url" label="小程序分享图">
        <upload-picture
          :value.sync="shareForm.mini_img_url"
          :show-tip-text="true"
          @change="(value) => changeImage('mini_img', value)"
          tipText="尺寸750x1334px，JPG、PNG格式，图片小于5M。"/>
      </el-form-item>
      <el-form-item prop="mini_share_txt" label="小程序分享语">
        <el-input v-model="shareForm.mini_share_txt" placeholder="请输入分享语" maxlength="28" show-word-limit />
      </el-form-item>
    </el-form>
    <div class="page-footer-btn">
      <el-button type="primary" @click="onSubmit" :loading="btnLoading">确定</el-button>
      <el-button @click="onReset">取消</el-button>
    </div>
  </div>
</template>
<script>
import UploadPicture from 'COMPONENTS/imageUploader/picture'
import { addActivity, getActivityById, setActivity, getActivityQrcode } from 'API/activity'
export default {
  components: {
    UploadPicture
  },
  data () {
    return {
      btnLoading: false,
      showQrcode: false,
      qrCodeImage: '',
      params: { aid: null, vkey: '' },
      baseLink: {
        web: 'https://www.lieduoduo.com/',
        mini: 'page/common/pages/webView/webView?sourceType='
      },
      baseForm: {
        title: '', // 活动名称
        translation: '', // 译文
        device: [], // 端口
        client: [], // 用户端
        time: [],
        mini_sourceType: 'shr', // 小程序渠道统计
        wap_url: '',
        web_url: '',
        intro: ''
      },
      shareForm: {
        img_url: '',
        img: null,
        mini_img_url: '',
        mini_img: null,
        mini_share_txt: ''
      },
      baseFormRules: {
        title: [{ required: true, message: '请填写活动名称', trigger: 'blur' }],
        translation: [{ required: true, message: '请填写活动译文', trigger: 'blur' }],
        device: [{ required: true, type: 'array', message: '请选择设备端', trigger: 'change' }],
        client: [{ required: true, type: 'array', message: '请选择用户端', trigger: 'change' }],
        time: [{ required: true, type: 'array', message: '请选择活动时间段', trigger: 'change' }],
        mini_url: [{ required: true, message: '请填写小程序链接', trigger: 'blur' }],
        web_url: [{ required: true, message: '请填写网页链接', trigger: 'blur' }]
      }
    }
  },
  watch: {
    'baseForm.translation' :function(val,oldval){
      this.baseForm['web_url'] = val
    }
  },
  computed: {
    isEdit () {
      return this.$route.name === 'activity_edit'
    },
    mini_url () {
      return `${this.baseLink.mini}${this.baseForm.mini_sourceType}&p=${encodeURIComponent(this.baseForm.wap_url)}`
    }
  },
  created () {
    if (this.isEdit) {
      this.params = this.$route.query
      this.getActivityById()
    }
  },
  methods: {
    changeImage (key, res) {
      if (this.shareForm[key] !== undefined) this.shareForm[key] = res[0].id
    },
    onSubmit () {
      this.$refs.baseForm.validate(valid => {
        if (valid) {
          let form = { pc: 2, app: 2, mini_program: 2, b: 2, c: 2 }
          const { title, translation, device, client, time, web_url, intro } = this.baseForm
          const { img, mini_img, mini_share_txt } = this.shareForm
          if (img) form.img = img
          if (mini_img) form.mini_url = mini_img
          for (let item of [...device, ...client]) {
            form[item] = 1
          }
          form.start_time = time[0]
          form.end_time = time[1]
          if (this.isEdit) {
            setActivity({
              id: this.params.aid,
              ...form,
              title,
              translation,
              mini_url: this.mini_url,
              web_url: this.baseLink.web + web_url,
              intro,
              mini_share_txt
            }).then(({ data }) => {
              if (data.httpStatus === 200) {
                this.$message.success('活动修改成功')
                this.$router.push({ name: 'activity_list' })
              }
            })
          } else {
            addActivity({
              ...form,
              title,
              translation,
              mini_url: this.mini_url,
              web_url: this.baseLink.web + web_url,
              intro,
              mini_share_txt
            }).then(({ data }) => {
              if (data.httpStatus === 200) {
                this.$message.success('创建成功')
                this.$router.push({ name: 'activity_list' })
              }
            })
          }
        }
      })
    },
    getActivityById () {
      if (!this.params.aid) return
      getActivityById(this.params.aid).then(({ data }) => {
        let activityData = data.data || {}
        const device = [activityData.pc === 1 && 'pc', activityData.app === 1 && 'app', activityData.miniProgram === 1 && 'mini_program'].filter(val => val)
        const client = [activityData.b === 1 && 'b', activityData.c === 1 && 'c'].filter(val => val)
        Object.assign(this.baseForm, {
          title: activityData.title, // 活动名称
          translation: activityData.translation, // 译文
          device: device, // 端口
          client: client, // 用户端
          time: [activityData.startTime, activityData.endTime],
          wap_url: decodeURIComponent(activityData.miniUrl.split("&")[1].replace('p=', "")),
          web_url: activityData.webUrl.replace(this.baseLink.web, ''),
          intro: activityData.intro
        })
        Object.assign(this.shareForm, {
          img: activityData.img || null,
          img_url: activityData.imgUrl,
          mini_img_url: activityData.miniImgUrl,
          mini_img: activityData.miniImg || null,
          mini_share_txt: activityData.miniShareTxt
        })
      })
    },
    handleShowQrCode () {
      if (!this.baseForm.wap_url) {
        this.$message.warning('请输入H5链接')
        return
      }
      getActivityQrcode({ path: 'page/common/pages/webView/webView', params: this.mini_url.split('?')[1] }).then(({ data }) => {
        if (data.httpStatus === 200) {
          this.qrCodeImage = data.data.url
        }
      })
    },
    onReset () {
      this.$confirm('', '退出将不保存更改的内容, 是否继续?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        this.$router.go(-1)
      }).catch(() => {})
    }
  }
}
</script>
<style lang="less" scoped>
.activity-wrapper {
  max-width: 780px;
  border: 1px solid #eeeeee;
  box-sizing: border-box;
  margin: 20px 0;
}
.activity-form-title {
  margin: 30px 0;
  font-size: 20px;
  padding-left: 20px;
}
.el-input, .el-textarea {
  max-width: 480px;
}
.page-footer-btn {
  padding-left: 120px;
  margin: 40px 0 60px;
  .el-button+.el-button {
    margin-left: 16px;
  }
}
</style>
