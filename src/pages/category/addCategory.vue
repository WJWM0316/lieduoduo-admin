<template>
  <!-- 新增|编辑招聘官 -->
  <div class="set-recruiter-wrapper">
    <el-form ref="form" :model="ruleForm" :rules="formRules" label-width="140px">
      <el-form-item label="新增方式" v-if="$route.query.level !== '3'">
        <template>
          <el-radio-group v-model="ruleForm.radio" @change="radiochange">
          <el-radio label="1">选择已有类别</el-radio>
          <el-radio label="2">自定义类别</el-radio>
        </el-radio-group>
        </template>
      </el-form-item>
      <el-form-item label="选择类别" v-show="ruleForm.radio === '1'">
        <el-input v-if="$route.query.level === '1'" v-model="ruleForm.name" placeholder="请选择一级职位类别" style="width: 400px;"></el-input>
        <el-input v-if="$route.query.level === '2'" v-model="ruleForm.name" placeholder="请选择二级职位类别" style="width: 400px;"></el-input>
        <el-input v-if="$route.query.level === '3'" v-model="ruleForm.name" placeholder="请选择三级职位类别" style="width: 400px;"></el-input>
          <div class="selectitem haveheight" @click="selectPositionfirst">
        </div>
        <!-- <el-input v-model="ruleForm.name" style="width: 400px;"></el-input> -->
      </el-form-item>
      <el-form-item label="类别名称">
        <el-input v-model="ruleForm.name" placeholder="请输入品类名称" style="width: 400px;"></el-input>
      </el-form-item>
      <el-form-item label="二级类别" v-if="$route.query.level === '1' && !$route.query.isedit" ref="twolabel">
        <div class="selectitem" ref="categoryH" @click="selectPosition($event, 2)">
           <input type="text" placeholder="请选择二级职位类别" v-if="ruleForm.secondname.length === 0">
           <div class="second" v-else>
           <span class="seconditem" :key="i" v-for="(item, i) in ruleForm.secondname">
             <span>{{item.name}}</span>
             <i class="iconfont el-icon-error" @click="delect(i)"></i>
             </span>
           </div>
        </div>
      </el-form-item>
      <el-form-item label="三级类别" v-if="$route.query.level === '2' && !$route.query.isedit" ref="threelabel">
      <div class="selectitem" ref="tcategoryH" @click="selectPosition($event, 3)">
           <input type="text" placeholder="请选择三级职位类别" v-if="ruleForm.secondname.length === 0">
           <div class="second" v-else>
           <span class="seconditem" :key="i" v-for="(item, i) in ruleForm.secondname">
             <span>{{item.name}}</span>
             <i class="iconfont el-icon-error" @click="delect(i)"></i>
             </span>
           </div>
        </div>
      </el-form-item>
      <el-form-item label="权重">
        <el-input v-model="ruleForm.sort" placeholder="请输入职位类别权重" style="width: 400px;"></el-input>
      </el-form-item>
      <el-form-item label="热门职位">
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
      <el-form-item label="上架状态">
        <template>
          <el-radio v-model="ruleForm.status" label="1">上架</el-radio>
          <el-radio v-model="ruleForm.status" label="0">下架</el-radio>
        </template>
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
import { addCategoryApi, getidCategoryApi, editCategoryApi } from 'API/category'
import SelectPositionRadio from '@/components/selectPositionRadio'
import { getLabelPositionListApi } from 'API/position'
export default {
  components: {
    SelectPositionRadio
  },
  data () {
    return {
      ruleForm: {
        name: '',
        label_id: '',
        pid: 0,
        id: '',
        is_hot: 1,
        sort: 1,
        status: '1',
        junior: [],
        radio: '1',
        secondname: ''
      },
      secondname: [],
      isshowRadio: false,
      labelitem: [],
      selectlevel: 1,
      btntitle: '确定',
      title: '请选择一级类别',
      isshowmove: false,
      level: 'level1',
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
      this.ruleForm.pid = this.$route.query.id ? this.$route.query.id : 0
      this.ruleForm.junior = this.ruleForm.secondname
      if (this.ruleForm.is_hot) {
        this.ruleForm.is_hot = 0
      } else {
        this.ruleForm.is_hot = 1
      }
      if (this.$route.query.isedit) {
        this.ruleForm.pid = undefined
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
    selectedPosition (item) {
      this.form.positionTypeName = item.name
    },
    // 选择一级职位类别
    selectPositionfirst () {
      this.title = '请选择一级类别'
      this.selectlevel = 1
      getLabelPositionListApi().then(({ data }) => {
        let listData = data.data || []
        this.labelitem = []
        this.isshowRadio = true
        listData.map((v, k) => {
          this.labelitem.push({ name: v.name, labelid: v.labelId })
        })
      })
    },
    // 确定
    surehandler (id, name, secondlist, thirdlist) {
      this.ruleForm.name = name
      this.ruleForm.label_id = id
      this.isshowRadio = false
      this.ruleForm.secondname = []
      if (this.$route.query.level === '1') {
        this.ruleForm.secondname = secondlist
        this.$nextTick(() => {
          this.$refs.twolabel.$el.style.height = this.$refs.categoryH.offsetHeight + 'px'
        })
      } else {
        this.ruleForm.secondname = thirdlist
        this.$nextTick(() => {
          this.$refs.threelabel.$el.style.height = this.$refs.tcategoryH.offsetHeight + 'px'
        })
      }
    },
    // 选择二级类别
    selectPosition (e, num) {
      if (!e.target.className || e.target.className === 'second') {
        this.title = '请选择二级类别'
        this.selectlevel = num
        this.isshowRadio = true
      }
    },
    delect (i) {
      this.ruleForm.secondname.splice(i, 1)
      this.$nextTick(() => {
        if (this.$refs.twolabel) {
          this.$refs.twolabel.$el.style.height = this.$refs.categoryH.offsetHeight + 'px'
        }
        if (this.$refs.threelabel) {
          this.$refs.threelabel.$el.style.height = this.$refs.tcategoryH.offsetHeight + 'px'
        }
      })
    },
    addCategoryApi () {
      addCategoryApi(this.ruleForm).then((res) => {
        this.$message({
          message: '新增成功',
          type: 'success'
        })
        this.$router.go(-1)
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
        if (res.data.data.labelId === 0) {
          this.ruleForm.radio = '2'
        }
        this.ruleForm.name = res.data.data.name
        this.ruleForm.sort = res.data.data.sort
        this.ruleForm.status = (res.data.data.status).toString()
      })
    },
    radiochange (id) {
      this.ruleForm.radio = id
      if (id === '2') {
        this.ruleForm.label_id = ''
      }
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
