<style lang="less" scoped>
#h24_position_post{
  margin: 22px 22px 22px 222px;
  border: 1px solid rgb(238, 238, 238);
  text-align: left;
  padding-top: 22px;
}
</style>
<template>
  <div id="h24_position_post" class="H24">
    <el-form ref="form" :model="form" :rules="formRules" label-width="140px" label-suffix="：">
      <el-form-item label="批量添加职位ID" v-if="!isEdit" prop="positions">
        <div class="tips">添加多个职位，请用英文,隔开</div>
        <el-input type="textarea" v-model="form.positions" style="width: 400px;"></el-input>
      </el-form-item>
      <el-form-item label="上下架时间" prop="times">
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
      <el-form-item label="服务席位数量" prop="seats_num">
        <el-input v-model.number="form.seats_num" style="width: 400px;" :disabled="form.status === 1 && isEdit"></el-input>
      </el-form-item>
      <el-form-item label="状态(选填)" v-if="isEdit">
        <el-switch
          v-model="form.is_online"
          active-color="#13ce66"
          inactive-color="#ff4949"
          :active-value="1"
          :inactive-value="2"
          active-text="上架"
          inactive-text="下架">
        </el-switch>
      </el-form-item>
      <el-form-item label="权重(选填)">
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
import { addRapidlySurfaceApi, editRapidlySurfaceApi, getRapidlySurfaceApi } from 'API/24h'
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
        seats_num: '',
        is_online: '',
        positions: '',
        times: [],
        sort: 0
      },
      formRules: {
        positions: [{ required: true, validator: validPosition, trigger: 'blur' }],
        seats_num: [{ required: true, type: 'number', message: '请输入服务席位数量', trigger: 'blur' }],
        times: [{ required: true, type: 'array', message: '请选择上下架时间', trigger: 'change' }],
        is_online: [{ type: 'number', message: '', trigger: 'change' }],
        sort: [{ type: 'number', message: '请输入正确的格式', trigger: 'blur' }]
      }
    }
  },
  created () {
    if (this.isEdit) this.getRapidlySurface()
  },
  computed: {
    isEdit () {
      return this.$route.name === 'h24_position_edit'
    }
  },
  methods: {
    onSubmit () {
      this.$refs.form.validate(valid => {
        if (valid) {
          const { seats_num, times, is_online, positions, sort } = this.form
          const start_time = times[0]
          const end_time = times[1]
          this.btnLoading = true
          if (this.isEdit) {
            editRapidlySurfaceApi({
              id: this.form.id,
              seats_num,
              is_online,
              positions,
              start_time,
              end_time,
              sort
            }).then(() => {
              this.btnLoading = false
              this.$router.push({ name: '24h_position' })
            })
          } else {
            addRapidlySurfaceApi({
              positions, start_time, end_time, seats_num, sort
            }).then(() => {
              this.btnLoading = false
              this.$router.push({ name: '24h_position' })
            })
          }
        }
      })
    },
    getRapidlySurface () {
      getRapidlySurfaceApi({ id: this.$route.query.id }).then(res => {
        let infos = res.data.data
        let form = {
          seats_num: infos.seatsNum,
          times: [infos.startTime, infos.endTime],
          positions: infos.positionId,
          id: infos.id,
          is_online: infos.isOnline,
          sort: infos.sort,
          status: infos.status
        }
        this.form = form
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
