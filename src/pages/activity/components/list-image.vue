<template>
  <el-dialog
    title="图片"
    @close="handleClose"
    width="500px"
    :visible="dialogStatus">
    <upload-picture
      class="cresume-upload-wrapper"
      :value.sync="images"
      :multiple="true"
      :size="20"
      :limit="20" />
    <div slot="footer">
      <el-button type="primary" :loading="btnLoading" @click="handleSave">保存</el-button>
      <el-button @click="handleClose">取消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import UploadPicture from 'COMPONENTS/imageUploader/picture'
import { getUnitTabImages, setUnitTabImages } from 'API/activity'
export default {
  components: { UploadPicture },
  props: {
    visible: Boolean,
    current: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      dialogStatus: false,
      btnLoading: false,
      images: []
    }
  },
  methods: {
    getImages () {
      getUnitTabImages({ id: this.current.id }).then(({ data }) => {
        this.images = data.data || []
      })
    },
    handleSave () {
      const images = this.images.map(val => val.id).join(',')
      if (!images) {
        this.$message.warning('至少上传一张图片！')
        return
      }
      this.btnLoading = true
      setUnitTabImages({
        id: this.current.id,
        image_id: images
      }).then(({ data }) => {
        this.btnLoading = false
        if (data.httpStatus === 200) {
          this.$message.success('保存成功！')
          this.$emit('change')
          this.handleClose()
        }
      }).catch(() => {
        this.btnLoading = false
      })
    },
    handleClose () {
      this.dialogStatus = false
      this.$emit('update:visible', false)
    }
  },
  watch: {
    visible (value) {
      if (value) {
        this.dialogStatus = true
        this.getImages()
      } else {
        this.images = []
      }
    }
  }
}
</script>
