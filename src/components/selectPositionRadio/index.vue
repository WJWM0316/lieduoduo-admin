<template>
  <div class="position-type">
    <el-dialog
      :title="title"
      :visible="visible"
      :labelitem="labelitem"
      width="650px"
      custom-class="app-dialog"
      append-to-body>
      <div class="centent">
        <div class="item">
        <el-radio-group v-model="radio" @change="radiochange">
          <el-radio :label="item.labelid" :key="i" v-for="(item, i) in labelitem">{{item.name}}</el-radio>
        </el-radio-group>
        </div>
        <div class="handler">
      <el-button type="primary" @click="handlerPosition">{{btntitle}}</el-button>
      <el-button type="primary" @click="movePosition">移动</el-button>
      <el-button @click="cancel">取消</el-button>
      </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '请选择一级类别'
    },
    btntitle: {
      type: String,
      default: '复制'
    },
    labelitem: {
      type: Array
    }
  },
  watch: {
    'visible': function (n) {
      if (n) {
        console.log(n, this.labelitem)
      }
    }
  },
  data () {
    return {
      radio: ''
    }
  },
  created () {
    console.log(this.labelitem)
  },
  methods: {
    radiochange (id) {
      this.radio = id
    },
    handlerPosition () {
      this.$emit('handlerPosition', this.radio)
    },
    movePosition () {
      this.$emit('movePosition', this.radio)
    },
    cancel () {
      this.$emit('cancelhandler')
    }
  }
}
</script>
<style lang="less" scoped>
.position-type {
  line-height: normal !important;
}
.centent{
  margin-bottom: 40px;
  .el-radio{
    margin-bottom: 30px;
  }
}
.handler{
  float: right;
}
</style>
