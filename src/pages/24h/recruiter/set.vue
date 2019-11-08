<template>
  <!-- 新增|编辑招聘官 -->
  <div class="set-recruiter-wrapper">
    <el-form ref="form" :model="form" :rules="formRules" label-width="140px" label-suffix="：">
      <el-form-item label="批量添加职位ID" v-if="!isEdit" prop="positions">
        <div class="tips">添加多个招聘官，请用英文,隔开</div>
        <el-input type="textarea" v-model="form.recruiter_uid" style="width: 400px;"></el-input>
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
      <el-form-item label="城市" prop="area_id">
        <el-select v-model="form.area_id" style="width: 400px">
          <template v-for="item in citys">
            <el-option :key="item.cityNum" :label="item.name" :value="item.cityNum"></el-option>
          </template>
        </el-select>
      </el-form-item>
      <el-form-item label="职位列表" prop="position_type_id">
        <el-select v-model="form.position_type_id" style="width: 400px">
          <template v-for="item in positionTypes">
            <el-option :key="item.positionTypeId" :label="item.name" :value="item.positionTypeId"></el-option>
          </template>
        </el-select>
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
import { getRapidlyRecruiterAttr } from 'API/24h'
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
        start_time: '',
        end_time: '',
        times: [],
        sort: 0
      },
      formRules: {
        positions: [{ required: true, validator: validPosition, trigger: 'blur' }],
        area_id: [{ required: true, message: '请选择城市', trigger: 'blur' }],
        position_type_id: [{ required: true, message: '请选择职位类型', trigger: 'blur' }],
        times: [{ required: true, type: 'array', message: '请选择上下架时间', trigger: 'change' }],
        is_online: [{ type: 'number', message: '', trigger: 'change' }],
        sort: [{ type: 'number', message: '请输入正确的格式', trigger: 'blur' }]
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
    this.getAttrs()
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
</style>
