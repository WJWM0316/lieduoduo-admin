<template>
  <!-- 新增|编辑招聘官 -->
  <div class="set-recruiter-wrapper">
    <el-form ref="form" :model="form" :rules="formRules" label-width="140px">
      <el-form-item label="分类名称：">
        <el-input v-model.number="form.name" style="width: 400px;"></el-input>
      </el-form-item>
      <el-form-item label="权重(选填)：">
        <el-input v-model.number="form.sort" style="width: 400px;"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit" :loading="btnLoading">确定</el-button>
        <el-button @click="reset" v-if="isEdit">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { addRapidlyLabel, editRapidlyLabel, getRapidlyLabelById } from 'API/24h'
export default {
  data () {
    return {
      btnLoading: false,
      form: {
        name: '',
        sort: 0
      },
      formRules: {
        name: [{ required: true, min: 1, max: 10, message: '请填写1-10字的标签名称', trigger: 'blur' }],
        sort: [{ type: 'number', message: '请输入正确的格式', trigger: 'blur' }]
      }
    }
  },
  computed: {
    isEdit () {
      return this.$route.name === '24h_labels_edit'
    }
  },
  created () {
    const { query } = this.$route
    this.form.name = query.name
    // if (this.isEdit) this.getRapidlySurface()
  },
  methods: {
    onSubmit () {
      this.$refs.form.validate(valid => {
        if (valid) {
          const { name, sort } = this.form
          this.btnLoading = true
          if (this.isEdit) {
            editRapidlyLabel({
              id: this.$route.query.id,
              name,
              sort
            }).then(({ data }) => {
              this.btnLoading = false
              const { httpStatus } = data
              if (httpStatus === 200) {
                this.$message.success('标签修改成功！')
              }
            }).catch(() => {
              this.btnLoading = false
            })
          } else {
            addRapidlyLabel({
              name, sort
            }).then(({ data }) => {
              this.btnLoading = false
              const { httpStatus } = data
              if (httpStatus === 200) {
                this.$router.push({
                  name: '24h_labels'
                })
              }
            }).catch(() => {
              this.btnLoading = false
            })
          }
        }
      })
    },
    getRapidlySurface () {
      getRapidlyLabelById({ id: this.$route.query.id }).then(({ data }) => {
        const { name, sort } = data.data
        Object.assign(this.form, {
          name: name,
          sort: sort
        })
      })
    },
    reset () {
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
.set-recruiter-wrapper{
  margin: 22px 22px 22px 222px;
  border: 1px solid rgb(238, 238, 238);
  text-align: left;
  padding-top: 22px;
}
.tips {
  color: #666;
}
</style>
