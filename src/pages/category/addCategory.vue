<template>
  <!-- 新增|编辑招聘官 -->
  <div class="set-recruiter-wrapper">
    <el-form ref="form" :model="ruleForm" :rules="formRules" label-width="140px">
      <el-form-item label="选择类别">
        <template>
          <el-radio-group v-model="ruleForm.radio" @change="radiochange">
          <el-radio label="1">选择已有类别</el-radio>
          <el-radio label="2">自定义类别</el-radio>
        </el-radio-group>
        </template>
      </el-form-item>
      <el-form-item label="选择类别" v-show="ruleForm.radio === '1'">
        <select-position-type
          style="width: 400px;"
          title="请选择职位类别"
          v-model.number="form.type"
          :label="form.positionTypeName"
          @on-selected="selectedPosition">
        </select-position-type>
        <!-- <el-input v-model="ruleForm.name" style="width: 400px;"></el-input> -->
      </el-form-item>
      <el-form-item label="品类名称">
        <el-input v-model="ruleForm.name" placeholder="请输入品类名称" style="width: 400px;"></el-input>
      </el-form-item>
      <el-form-item label="二级类别">
        <el-input v-model="ruleForm.name" placeholder="请选择二级职位类别" style="width: 400px;">
        </el-input>
        <div class="selectitem" @click="selectPosition">
        </div>
      </el-form-item>
      <el-form-item label="上架状态">
        <template>
          <el-radio v-model="ruleForm.status" label="1">上架</el-radio>
          <el-radio v-model="ruleForm.status" label="2">下架</el-radio>
        </template>
      </el-form-item>
      <el-form-item label="三级类别">
      <el-select v-model="value1" multiple placeholder="请选择" style="width: 400px;" @change="thirdchange">
        <!-- <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option> -->
      </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">确定</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import SelectPositionType from '@/components/selectPositionType'
import { addCategoryApi, getidCategoryApi } from 'API/category'
export default {
  components: {
    SelectPositionType
  },
  data () {
    return {
      options: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }],
      value1: ['后端开发', '移动开发', '测试'],
      ruleForm: {
        id: '',
        radio: '1',
        status: '1'
      },
      form: {
        position_name: '', // 职位名称
        type: '', // 职位类型
        positionTypeName: ''
      },
      level: 'level1',
      formRules: {
        id: [{ required: true, message: '不能为空', trigger: 'blur' }]
      }
    }
  },
  created () {
    this.getlabeldetail()
  },
  methods: {
    onSubmit () {
      this.addCategoryApi()
      console.log(this.ruleForm)
    },
    cancel () {
      this.$router.go(-1)
    },
    selectedPosition (item) {
      this.form.positionTypeName = item.name
    },
    thirdchange (a) {
      console.log(a, this.value1)
    },
    selectPosition () {
      console.log('2333')
    },
    addCategoryApi () {
      let data = { name: '一级类别名字', status: 1, junior: [{ 'label_id': 1001, 'name': '技术' }, { 'label_id': 1002, 'name': '产品' }] }
      addCategoryApi(data).then((res) => {
        console.log(res)
      })
    },
    getlabeldetail () {
      let data = { id: this.$route.query.id }
      getidCategoryApi(data).then((res) => {
        console.log(res)
      })
    },
    radiochange (id) {
      this.ruleForm.radio = id
      console.log(id)
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
.selectitem{
  width: 400px;
  height: 40px;
  line-height: 40px;
  box-sizing: border-box;
  color: #606266;
  position: absolute;
  top: 0;
  cursor: pointer;
}
</style>
