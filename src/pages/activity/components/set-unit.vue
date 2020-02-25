<template>
  <el-dialog
    :title="title"
    @close="handleClose"
    width="432px"
    :visible.sync="dialogStatus">
    <el-form ref="unitForm" :model="unitForm" :rules="unitFormRules" label-width="50px">
      <el-form-item prop="title" label="标题">
        <el-input v-model="unitForm.title" placeholder="请填写标题" />
      </el-form-item>
      <el-form-item prop="intro" label="介绍">
        <el-input type="textarea" placeholder="请填写介绍" maxlength="50" :show-word-limit="true" v-model="unitForm.intro"  />
      </el-form-item>
    </el-form>
    <div class="dialog-btn">
      <el-button type="primary" @click="handleSubmit">提交</el-button>
      <el-button @click="handleClose">取消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { addUnit, setUnitById } from 'API/activity'
export default {
  props: {
    aid: [Number, String],
    visible: {
      type: Boolean,
      required: true
    },
    isAdd: Boolean,
    current: Object
  },
  computed: {
    title () {
      return this.isAdd ? '新增栏目' : '编辑栏目'
    }
  },
  data () {
    return {
      dialogStatus: false,
      unitForm: {
        title: '',
        intro: ''
      },
      unitFormRules: {
        title: [{ required: true, message: '请填写标题', trigger: 'blur' }],
        intro: [{ required: true, message: '请填写介绍', trigger: 'blur' }]
      }
    }
  },
  methods: {
    handleSubmit () {
      this.$refs.unitForm.validate(valid => {
        if (valid) {
          if (this.isAdd) {
            addUnit({ zt_id: this.aid, ...this.unitForm }).then(({ data }) => {
              if (data.httpStatus === 200) {
                this.handleClose()
                this.$emit('change')
              }
            })
          } else {
            setUnitById({
              id: this.current.id,
              ...this.unitForm
            }).then(({ data }) => {
              if (data.httpStatus === 200) {
                this.handleClose()
                this.$emit('change')
              }
            })
          }
        }
      })
    },
    handleClose () {
      this.$emit('update:visible', false)
      this.dialogStatus = false
    }
  },
  watch: {
    visible (value) {
      this.dialogStatus = value
      if (value) {
        this.unitForm = {
          title: this.current.title,
          intro: this.current.intro
        }
        // 如果是编辑状态需要将数据写入表单
      } else {
        this.unitForm = {
          title: '',
          intro: ''
        }
      }
    }
  }
}
</script>
<style lang="less" scoped>
.dialog-btn {
  text-align: center;
}
</style>
