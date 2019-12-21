<template>
  <!-- 新增|编辑招聘官 -->
  <div class="set-recruiter-wrapper">
    <el-form ref="form" :model="ruleForm" :rules="formRules" label-width="140px">
      <el-form-item label="热门职位" v-if="!$route.query.isedit">
        <el-input v-model="ruleForm.name" placeholder="请选择热门职位类别" style="width: 400px;"></el-input>
          <div class="selectitem haveheight" @click="selectPosition(4)">
        </div>
      </el-form-item>
      <el-form-item label="热门职位" v-if="$route.query.isedit">
        <div style="display: flex;align-items: center;">
        <span style="padding:0 5px;">是</span>
        <el-switch
        v-model="ruleForm.is_hot"
        active-color="#ff4949"
        inactive-color="#13ce66">
      </el-switch>
      <span style="padding:0 5px;">否</span>
      </div>
      </el-form-item>
      <el-form-item label="权重">
        <el-input v-model="ruleForm.sort" placeholder="请输入职位类别权重" style="width: 400px;"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">确定</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
    <select-position-radio
      style="width: 400px;"
      :labelitem="labelitem"
      :title="title"
      @handlerPosition="surehandler"
      @cancelhandler="cancelbtn"
      :btntitle="btntitle"
      :selectlevel="selectlevel"
      :isshowmove="isshowmove"
      :visible.sync="isshowRadio">
    </select-position-radio>
  </div>
</template>
<script>
import { getidCategoryApi, editCategoryApi } from 'API/category'
import SelectPositionRadio from '@/components/selectPositionRadio'
export default {
  components: {
    SelectPositionRadio
  },
  data () {
    return {
      ruleForm: {
        name: '',
        id: '',
        is_hot: 1,
        sort: 1
      },
      isshowRadio: false,
      labelitem: [],
      selectlevel: 1,
      btntitle: '确定',
      title: '请选择一级类别',
      isshowmove: false,
      formRules: {
        id: [{ required: true, message: '不能为空', trigger: 'blur' }]
      }
    }
  },
  created () {
    if (this.$route.query.isedit) {
      this.getlabeldetail()
    }
  },
  methods: {
    onSubmit () {
      if (this.ruleForm.is_hot) {
        this.ruleForm.is_hot = 0
      } else {
        this.ruleForm.is_hot = 1
      }
      if (this.$route.query.isedit) {
        this.ruleForm.id = this.$route.query.id
        this.editCategory()
      } else {
        this.addCategoryApi()
      }
    },
    cancel () {
      this.$confirm('退出将不保存更改的内容，是否继续', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$router.go(-1)
      })
    },
    cancelbtn () {
      this.isshowRadio = false
    },
    // 确定
    surehandler (id, name, secondlist, thirdlist, hotlist) {
      this.ruleForm.name = hotlist[0].name
      this.ruleForm.id = hotlist[0].label_id
      this.isshowRadio = false
    },
    // 选择二级类别
    selectPosition (num) {
      this.title = '请选择职位'
      this.selectlevel = num
      this.isshowRadio = true
    },
    addCategoryApi () {
      editCategoryApi(this.ruleForm).then((res) => {
        this.$message({
          message: '新增成功',
          type: 'success'
        })
      })
    },
    editCategory () {
      editCategoryApi(this.ruleForm).then((res) => {
        this.$message({
          message: '编辑成功',
          type: 'success'
        })
        this.$router.go(-1)
      })
    },
    getlabeldetail () {
      let data = { id: this.$route.query.id }
      getidCategoryApi(data).then((res) => {
        this.ruleForm.name = res.data.data.name
        this.ruleForm.sort = res.data.data.sort
      })
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
  // height: 40px;
  // line-height: 40px;
  box-sizing: border-box;
  color: #606266;
  position: absolute;
  top: 0;
  border-radius: 4px;
  cursor: pointer;
  // border: 1px solid #DCDFE6;
  // z-index: 1;
  input{
    width: 400px;
    height: 40px;
    padding: 0 15px;
    box-sizing: border-box;
    border: 1px solid #DCDFE6;
    &::placeholder{
      color:#C0C4CC;
      font-size: 16px;
    }
  }
  .second{
    width: 400px;
    // height: 40px;
    padding: 0 15px;
    box-sizing: border-box;
    border: 1px solid #DCDFE6;
    .seconditem{
      padding: 0 10px;
    }
  }
}
.haveheight{
  height: 40px;
}
</style>
