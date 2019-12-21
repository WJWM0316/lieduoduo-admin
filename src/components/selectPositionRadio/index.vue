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
            <div class="lists-selected" v-if="selectedData.length && selectlevel === 3 || selectlevel === 4">
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
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    isshowmove: {
      type: Boolean,
      default: true
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
    },
    selectlevel: {
      type: [String, Number],
      default: 1
    }
  },
  watch: {
    'visible': function (n) {
      this.visibleold = n
    }
  },
  data () {
    return {
      radio: '',
      name: '',
      secondlist: [],
      thirdlist: [],
      hotlist: [],
      selectedData: [], // 展示可选择的内容
      parentListId: null, // 当前选择parentid
      parentSelectData: [], // 父级选择的内容
      listData: [] // 接口获取到的所有内容
    }
  },
  created () {
    this.getLists()
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
      this.$emit('handlerPosition', this.radio, this.name, this.secondlist, this.thirdlist)
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
      item.children.map((v, k) => {
        v.open = false
      })
      this.parentSelectData = item.children
      this.selectedData = []
    },
    // 二级分类选择
    handleShowDetails (item) {
      if (this.selectlevel === 2) {
        item.open = !item.open
      } else {
        // 收起其他
        this.parentSelectData.map((v, k) => {
          v.open = item === v
        })
      }
      this.secondlist = []
      this.parentSelectData.map((v, k) => {
        if (v.open) {
          this.secondlist.push({ label_id: v.labelId, name: v.name })
        }
      })
      item.children.map((v, k) => {
        v.open = false
      })
      this.selectedData = item.children
    },
    // 三级分类选择
    handleSelected (item) {
      console.log(this.selectlevel === 4)
      if (this.selectlevel === 4) {
        this.selectedData.map((v, k) => {
          v.open = item === v
        })
        this.parentSelectData.map((v, k) => {
          v.open = false
        })
      } else {
        item.open = !item.open
        this.thirdlist = []
        this.selectedData.map((v, k) => {
          if (v.open) {
            this.thirdlist.push({ label_id: v.labelId, name: v.name })
          }
        })
      }
    },
    gethotselectlist () {
      this.selectedData.map((v, k) => {
        if (v.open) {
          this.hotlist.push({ label_id: v.labelId, name: v.name })
        }
      })
      this.parentSelectData.map((v, k) => {
        if (v.open) {
          this.hotlist.push({ label_id: v.labelId, name: v.name })
        }
      })
    },
    getLists () {
      getLabelPositionListApi().then(({ data }) => {
        let arr = data.data
        arr.map((v, k) => {
          v.open = false
          v.children.map((v, k) => {
            v.open = false
            v.children.map((v, k) => {
              v.open = false
            })
          })
        })
        this.listData = arr || []
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
