<template>
  <div class="position-type">
    <el-dialog
      :title="title"
      :visible="visible"
      :labelitem="labelitem"
      width="650px"
      @close="cancel"
      custom-class="app-dialog"
      append-to-body>
      <div class="centent">
        <div class="item" v-if="selectlevel === 1">
        <el-radio-group v-model="radio" @change="radiochange">
          <el-radio :label="item.labelid" :key="i" v-for="(item, i) in labelitem">{{item.name}}</el-radio>
        </el-radio-group>
        </div>
        <div class="lists-wrapper" v-else>
        <ul class="warpper-scroll lists-left">
          <template v-for="item in listData">
            <li :key="item.labelId" :class="{active: item.labelId === parentListId}" @click="handleAsideCheck(item)">{{item.name}}</li>
          </template>
        </ul>
        <div class="lists-content">
          <div class="lists-items">
            <template v-for="item in parentSelectData">
              <span :key="item.labelId" @click="handleShowDetails(item)" :class="{active: item.open}">
                <i class="iconfont el-icon-success" v-if="item.open"/>
                <div class="isnocheck" v-else></div>
                {{item.name}}
              </span>
            </template>
          </div>
          <template>
            <div class="lists-selected" v-if="selectedData.length && selectlevel === 3 || selectlevel === 4 || selectlevel === 5">
              <template v-for="item in selectedData">
                <span :key="item.labelId" @click="handleSelected(item)" :class="{active: item.open}">
                <i class="iconfont el-icon-success" v-if="item.open"/>
                <div class="isnocheck" v-else></div>
                {{item.name}}
              </span>
              </template>
            </div>
          </template>
        </div>
      </div>
      <div class="handler">
      <el-button type="primary" @click="handlerPosition">{{btntitle}}</el-button>
      <el-button type="primary" v-if="isshowmove" @click="movePosition">移动</el-button>
      <el-button @click="cancel">取消</el-button>
      </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getLabelPositionListApi } from 'API/position'
import { positionlabelList } from 'API/category'
export default {
  props: {
    // 显示隐藏
    visible: {
      type: Boolean,
      default: false
    },
    // 是否显示移动按钮
    isshowmove: {
      type: Boolean,
      default: true
    },
    // 弹窗标题
    title: {
      type: String,
      default: '请选择一级类别'
    },
    // 确定的btn操作的名字
    btntitle: {
      type: String,
      default: '复制'
    },
    // 数据列表
    labelitem: {
      type: Array
    },
    // selectlevel默认为1级单选，2是2级多选，3是3级多选，4是2级或者3级的单选任何一个, 5是3级单选, 6是2级单选。
    selectlevel: {
      type: [String, Number],
      default: 1
    }
  },
  data () {
    return {
      radio: '',
      name: '',
      secondlist: [],
      thirdlist: [],
      hotlist: [],
      threeradio: [],
      selectedData: [], // 展示可选择的内容
      parentListId: null, // 当前选择parentid
      parentSelectData: [], // 父级选择的内容
      listData: [] // 接口获取到的所有内容
    }
  },
  created () {
    if (this.$route.name === 'addhotCategory') {
      this.getnewposition()
    } else {
      this.getLists()
    }
  },
  methods: {
    radiochange (id) {
      this.radio = id
    },
    handlerPosition () {
      this.labelitem.map((v, k) => {
        if (v.labelid === this.radio) {
          this.name = v.name
        }
      })
      this.$emit('handlerPosition', this.radio, this.name, this.secondlist, this.thirdlist, this.hotlist, this.threeradio)
    },
    movePosition () {
      this.$emit('movePosition', this.radio)
    },
    cancel () {
      this.$emit('cancelhandler')
    },
    // 左侧内容选择
    handleAsideCheck (item) {
      this.parentListId = item.labelId
      this.parentSelectData = item.children || []
      this.selectedData = []
    },
    // 二级分类选择
    handleShowDetails (item) {
      if (this.selectlevel === 2) {
        const open = !item.open
        this.$set(item, 'open', open)
        if (item.open) {
          this.secondlist.push({ label_id: item.labelId, name: item.name })
        } else {
          this.secondlist.splice(this.hotlist.findIndex(v => v.labelId === item.labelId), 1)
        }
      } else if (this.selectlevel === 4) {
        const open = !item.open
        this.parentSelectData.forEach(val => {
          if (val.open) val.open = false
        })
        this.$set(item, 'open', open)
        this.selectedData.forEach(val => {
          if (val.open) val.open = false
        })
      } else if (this.selectlevel === 5) {
        this.parentSelectData.forEach(val => {
          if (val.open) val.open = false
        })
        this.selectedData.forEach(val => {
          if (val.open) val.open = false
        })
        this.$set(item, 'open', open)
      } else {
        // 收起其他
        this.parentSelectData.forEach(val => {
          if (val.open) val.open = false
        })
        this.$set(item, 'open', open)
      }
      this.selectedData = item.children
      this.gethotselectlist()
    },
    // 三级分类选择
    handleSelected (item) {
      if (this.selectlevel === 4) {
        // 收起其他
        this.selectedData.forEach(val => {
          if (val.open) val.open = false
        })
        this.$set(item, 'open', open)
        this.parentSelectData.map((v, k) => {
          v.open = false
        })
        this.gethotselectlist()
      } else if (this.selectlevel === 5) {
        this.parentSelectData.forEach(val => {
          if (val.open) val.open = false
        })
        this.selectedData.forEach(val => {
          if (val.open) val.open = false
        })
        this.$set(item, 'open', open)
        this.gethotselectlist()
      } else {
        const open = !item.open
        this.$set(item, 'open', open)
        if (item.open) {
          this.thirdlist.push({ label_id: item.labelId, name: item.name })
        } else {
          this.thirdlist.splice(this.thirdlist.findIndex(v => v.labelId === item.labelId), 1)
        }
      }
    },
    gethotselectlist () {
      this.hotlist = []
      this.threeradio = []
      this.selectedData.map((v, k) => {
        if (v.open) {
          this.hotlist.push({ label_id: v.labelId, name: v.name, id: v.id })
          this.threeradio.push({ label_id: v.labelId, name: v.name })
        }
      })
      this.parentSelectData.map((v, k) => {
        if (v.open) {
          this.hotlist.push({ label_id: v.labelId, name: v.name, id: v.id })
        }
      })
    },
    getLists () {
      getLabelPositionListApi().then(({ data }) => {
        this.listData = data.data || []
      })
    },
    getnewposition () {
      positionlabelList().then((res) => {
        this.listData = res.data.data || []
      })
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
.lists-wrapper {
  height: 550px;
  .lists-left {
    float: left;
    width: 142px;
    overflow-y: auto;
    height: 100%;
    li {
      height: 46px;
      text-align: center;
      line-height: 46px;
      position: relative;
      cursor: pointer;
    }
    .active {
      color: #03B3BB;
      background-color: #F8FAFA;
    }
    li.active:after {
      content: "";
      width: 4px;
      height: 20px;
      background: #00C4CD;
      border-radius: 0px 50px 50px 0px;
      position: absolute;
      left: 0;
      top: 50%;
      margin-top: -10px;
    }
    li:hover {
      color: #03B3BB;
    }
  }
  .lists-content {
    text-align: left;
    overflow-x: hidden;
    height: 100%;
    padding: 20px 28px;
    box-sizing: border-box;
    overflow-y: auto;
    background-color: #F8FAFA;
    & /deep/ .el-input__validateIcon {
      display: none;
    }
  }
}
.lists-items, .lists-selected {
  & > span {
    display: inline-block;
    width: 33.3333%;
    cursor: pointer;
    font-size: 14px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    line-height: 16px;
    margin: 12px 0;
    height: 16px;
  }
}
.lists-selected span {
  margin-top: 0;
}
.lists-items {
  padding: 8px 0;
  width: 100%;
  .active {
    color: #03B3BB;
    font-weight: bold;
  }
  .active i{
    font-weight: normal;
  }
  i {
    color: #03B3BB;
  }
}
.lists-selected {
  background-color: #F2FCFC;
  padding: 14px;
  box-sizing: border-box;
  span {
    color: #03B3BB;
  }
}
.isnocheck{
  display: inline-block;
  position: relative;
  border: 1px solid #DCDFE6;
  border-radius: 50%;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  width: 14px;
  height: 14px;
  background-color: #FFF;
  z-index: 1;
  -webkit-transition: border-color .25s cubic-bezier(.71,-.46,.29,1.46),background-color .25s cubic-bezier(.71,-.46,.29,1.46);
  transition: border-color .25s cubic-bezier(.71,-.46,.29,1.46),background-color .25s cubic-bezier(.71,-.46,.29,1.46);
}
</style>
