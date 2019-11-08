<template>
  <!-- 新增|编辑招聘官 -->
  <div class="set-recruiter-wrapper">
    <el-form ref="form" :model="form" :rules="formRules" label-width="140px">
      <el-form-item label="批量添加公司ID：" v-if="!isEdit" prop="company_id">
        <div class="tips">添加多个公司，请用英文,隔开</div>
        <el-input type="textarea" v-model="form.company_id" style="width: 400px;"></el-input>
      </el-form-item>
      <el-form-item label="上下架时间：" prop="times">
        <el-date-picker
          :disabled="form.is_online === 2"
          v-model="form.times"
          type="datetimerange"
          value-format="yyyy-MM-dd HH:mm:ss"
          style="width: 400px"
          start-placeholder="上架时间"
          end-placeholder="下架时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="24h公司分类：" prop="labels">
        <el-select v-model="form.labels" style="width: 400px">
          <template v-for="item in labelArr">
            <el-option :key="item.id" :label="item.name" :value="item.id"></el-option>
          </template>
        </el-select>
      </el-form-item>
      <el-form-item label="状态(选填)：" v-if="isEdit">
        <el-switch
          v-model="form.is_online"
          active-color="#13ce66"
          inactive-color="#ff4949"
          :active-value="1"
          :inactive-value="0"
          active-text="上架"
          inactive-text="下架">
        </el-switch>
      </el-form-item>
      <el-form-item label="权重(选填)：">
        <el-input v-model.number="form.sort" style="width: 400px;"></el-input>
      </el-form-item>
      <el-form-item label="温馨提示：" v-if="!isEdit">
        <div class="tips">添加后对应关联的24h职位和24h招聘官，需要几分钟才能跑完，所以前台可能会有延迟现象，请耐心等候。</div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit" :loading="btnLoading">确定</el-button>
        <el-button @click="reset" v-if="isEdit">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { getRapidlyCompanyAttr, addRapidlyCompany, editRapidlyCompany, getRapidCompanyById } from 'API/24h'
export default {
  data () {
    const validPosition = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入职位Id'))
        return
      }
      if (/^[1-9]/g.test(value)) {
        callback()
      } else {
        callback(new Error('内容格式不正确'))
      }
    }
    return {
      btnLoading: false,
      form: {
        labels: '',
        company_id: '',
        is_online: '',
        times: [],
        sort: 0
      },
      formRules: {
        company_id: [{ required: true, validator: validPosition, trigger: 'blur' }],
        labels: [{ required: true, message: '请选择职位类型', trigger: 'blur' }],
        times: [{ required: true, type: 'array', message: '请选择上下架时间', trigger: 'change' }],
        is_online: [{ type: 'number', message: '', trigger: 'change' }],
        sort: [{ type: 'number', message: '请输入正确的格式', trigger: 'blur' }]
      },
      labelArr: []
    }
  },
  computed: {
    isEdit () {
      return this.$route.name === '24h_company_edit'
    }
  },
  created () {
    this.getAttrs()
    if (this.isEdit) this.getRapidlySurface()
  },
  methods: {
    // 获取部分参数
    getAttrs () {
      getRapidlyCompanyAttr().then(({ data }) => {
        const { labelArr } = data.data
        this.labelArr = labelArr
      })
    },
    onSubmit () {
      this.$refs.form.validate(valid => {
        if (valid) {
          const { labels, company_id, is_online, times, sort } = this.form
          const start_time = times[0]
          const end_time = times[1]
          this.btnLoading = true
          if (this.isEdit) {
            editRapidlyCompany({
              id: this.$route.query.id,
              labels: String(labels),
              is_online,
              start_time,
              end_time,
              sort
            }).then(({ data }) => {
              this.btnLoading = false
              const { httpStatus } = data
              if (httpStatus === 200) {
                this.$message.success('信息修改成功！')
              }
            })
          } else {
            addRapidlyCompany({
              labels: String(labels), company_id, start_time, end_time, sort
            }).then(({ data }) => {
              this.btnLoading = false
              const { httpStatus } = data
              if (httpStatus === 200) {
                this.$router.push({
                  name: '24h_company'
                })
              }
            })
          }
        }
      })
    },
    getRapidlySurface () {
      getRapidCompanyById({ id: this.$route.query.id }).then(({ data }) => {
        const { surfaceRapidlyInfo } = data.data
        Object.assign(this.form, {
          times: [surfaceRapidlyInfo.startTime, surfaceRapidlyInfo.endTime],
          is_online: surfaceRapidlyInfo.isOnline,
          sort: surfaceRapidlyInfo.sort,
          labels: surfaceRapidlyInfo.labelArr[0] && surfaceRapidlyInfo.labelArr[0].id
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
