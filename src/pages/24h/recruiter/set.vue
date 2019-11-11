<template>
  <!-- 新增|编辑招聘官 -->
  <div class="set-recruiter-wrapper">
    <el-form ref="form" :model="form" :rules="formRules" label-width="140px">
      <el-form-item label="批量添加招聘官ID：" v-if="!isEdit" prop="recruiter_uid">
        <div class="tips">添加多个招聘官，请用英文,隔开</div>
        <el-input type="textarea" v-model="form.recruiter_uid" style="width: 400px;"></el-input>
      </el-form-item>
      <el-form-item label="上下架时间：" prop="times">
        <el-date-picker
          :disabled="form.is_online === 2"
          v-model="form.times"
          type="datetimerange"
          value-format="yyyy-MM-dd HH:mm:ss"
          style="width: 400px"
          :picker-options="dateOpt"
          start-placeholder="上架时间"
          end-placeholder="下架时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="城市：" prop="area_id">
        <el-select v-model="form.area_id" style="width: 400px">
          <template v-for="item in citys">
            <el-option :key="item.cityNum" :label="item.name" :value="item.cityNum"></el-option>
          </template>
        </el-select>
      </el-form-item>
      <el-form-item label="职位类别：" prop="position_type_id">
        <el-select v-model="form.position_type_id" style="width: 400px">
          <template v-for="item in positionTypes">
            <el-option :key="item.positionTypeId" :label="item.name" :value="item.positionTypeId"></el-option>
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
        <div class="tips">添加后对应关联的24h职位和24h招聘官，需要几分钟才能跑完，导致前台可能会有延迟现象，请耐心等候。</div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit" :loading="btnLoading">确定</el-button>
        <el-button @click="reset" v-if="isEdit">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { getRapidlyRecruiterAttr, addRapidlyRecruiter, getRapidRecruiterById, editRapidlyRecruiter } from 'API/24h'
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
        area_id: '',
        position_type_id: '',
        recruiter_uid: '',
        is_online: '',
        times: [],
        sort: 0
      },
      formRules: {
        recruiter_uid: [{ required: true, validator: validPosition, trigger: 'blur' }],
        area_id: [{ required: true, message: '请选择城市', trigger: 'blur' }],
        position_type_id: [{ required: true, message: '请选择职位类型', trigger: 'blur' }],
        times: [{ required: true, type: 'array', message: '请选择上下架时间', trigger: 'change' }],
        is_online: [{ type: 'number', message: '', trigger: 'change' }],
        sort: [{ type: 'number', message: '请输入正确的格式', trigger: 'blur' }]
      },
      dateOpt: {
        disabledDate: (time) => {
          return time.getTime() < new Date(new Date().toLocaleDateString()).getTime()
        }
      },
      citys: [],
      positionTypes: []
    }
  },
  computed: {
    isEdit () {
      return this.$route.name === '24h_recruiter_edit'
    }
  },
  created () {
    const { query } = this.$route
    this.form.recruiter_uid = query.recruiter_uid ? query.recruiter_uid : ''
    this.getAttrs()
    if (this.isEdit) {
      this.getRapidlySurface()
    }
  },
  methods: {
    // 获取部分参数
    getAttrs () {
      getRapidlyRecruiterAttr().then(({ data }) => {
        const { citys, positionTypes } = data.data
        this.citys = citys
        this.positionTypes = positionTypes
      })
    },
    onSubmit () {
      this.$refs.form.validate(valid => {
        if (valid) {
          const { area_id, position_type_id, recruiter_uid, is_online, times, sort } = this.form
          const start_time = times[0]
          const end_time = times[1]
          this.btnLoading = true
          if (this.isEdit) {
            editRapidlyRecruiter({
              id: this.$route.query.id,
              area_id,
              position_type_id,
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
            addRapidlyRecruiter({
              area_id, position_type_id, recruiter_uid, start_time, end_time, sort
            }).then(({ data }) => {
              this.btnLoading = false
              const { httpStatus } = data
              if (httpStatus === 200) {
                this.$router.push({
                  name: '24h_recruiter'
                })
              }
            }).catch(({ data }) => {
              this.btnLoading = false
              if (data.code === 919) {
                this.$alert(`${data.msg}`, '以下用户非招聘官', {
                  confirmButtonText: '确定',
                  type: 'warning'
                })
              } else {
                this.$message.error(data.msg)
              }
            })
          }
        }
      })
    },
    getRapidlySurface () {
      getRapidRecruiterById({ id: this.$route.query.id }).then(({ data }) => {
        const { surfaceRapidlyInfo } = data.data
        Object.assign(this.form, {
          area_id: surfaceRapidlyInfo.areaId,
          times: [surfaceRapidlyInfo.startTime, surfaceRapidlyInfo.endTime],
          is_online: surfaceRapidlyInfo.isOnline,
          sort: surfaceRapidlyInfo.sort,
          position_type_id: surfaceRapidlyInfo.positionTypeId
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
