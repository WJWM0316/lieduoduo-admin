<template>
  <div class="position-type">
    <div @click="handleShowDialog">
      <slot>
        <div class="el-input" :class="{'is-disabled': disabled}">
          <div class="el-input__inner"><span v-if="!label"  class="input-placeholder-span">{{title}}</span>{{label}}</div>
          <span class="el-input__suffix">
            <span class="el-input__suffix-inner">
              <i class="el-select__caret el-input__icon el-icon-arrow-down"></i>
            </span>
          </span>
        </div>
      </slot>
    </div>
    <el-dialog
      :title="title"
      width="650px"
      custom-class="app-dialog"
      append-to-body
      :visible.sync="showDialog">
      <div class="lists-wrapper">
        <ul class="warpper-scroll lists-left">
          <template v-for="item in listData">
            <li :key="item.labelId" :class="{active: item.labelId === parentListId}" @click="handleAsideCheck(item)">{{item.name}}</li>
          </template>
        </ul>
        <div class="lists-content">
          <el-input
            class="el-input-radius no-error"
            :show-message="false"
            style="width: 320px;"
            size="medium"
            placeholder="请输入职位关键字"
            v-model="keyword"
            @keyup.native="handleSearch">
            <template slot="suffix">
              <i class="el-input__icon el-icon-search" @click="handleSearch"></i>
            </template>
          </el-input>
          <div class="lists-items">
            <template v-for="item in parentSelectData">
              <span :key="item.labelId" @click="handleShowDetails(item)" :class="{active: item.open}">
                <i class="iconfont" :class="item.open ? 'el-icon-success' : 'icon-tianjia'" /> {{item.name}}
              </span>
            </template>
          </div>
          <template v-if="searchData.length">
            <div class="lists-selected">
              <template v-for="item in searchData">
                <span :key="item.labelId" @click="handleSelected(item)">{{item.name}}</span>
              </template>
            </div>
          </template>
          <template v-else>
            <div class="lists-selected" v-if="selectedData.length">
              <template v-for="item in selectedData">
                <span :key="item.labelId" @click="handleSelected(item)">{{item.name}}</span>
              </template>
            </div>
          </template>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
// import { getLabelPositionListApi } from '@/api/putIn'
import { searchPositionApi } from '@/api/position'
import { getLabelPositionListApi } from 'API/position'

export default {
  props: {
    value: [String, Array, Number],
    label: String,
    disabled: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '请选择期望职位'
    }
  },
  data () {
    return {
      showDialog: false,
      listData: [], // 接口获取到的所有内容
      parentListId: null, // 当前选择parentid
      parentSelectData: [], // 父级选择的内容
      selectedData: [], // 展示可选择的内容
      searchData: [], // 查询接口返回的数据
      keyword: '' // search value
    }
  },
  methods: {
    getLists () {
      if (this.listData.length) return
      this.searchData = []
      getLabelPositionListApi().then(({ data }) => {
        this.listData = data.data || []
        // 数据复现
        this.reviewData(this.value)
      })
    },
    handleShowDialog () {
      if (this.disabled) return
      this.showDialog = true
      this.getLists()
    },
    reviewData (id) {
      if (id) {
        // 递归找到对应item
        let result = {}
        try {
          // eslint-disable-next-line no-inner-declarations
          function func (data) {
            data.forEach(item => {
              if (item.labelId === id) {
                result = item
                throw new Error('find finish')
              } else {
                if (item.children && item.children.length) func(item.children)
              }
            })
          }
          func(this.listData)
        } catch (e) {
        }
        if (result.topPid) {
          const { topPid, pid } = result
          this.parentListId = topPid
          this.parentSelectData = this.listData.find(val => val.labelId === topPid).children
          const selectData = this.parentSelectData.find(val => val.labelId === pid)
          this.$set(selectData, 'open', true)
          this.selectedData = selectData.children
        }
      } else {
        this.handleAsideCheck(this.listData[0])
      }
    },
    handleSearch () {
      if (this.keyword === '') return
      window.clearTimeout(this.getPositionTimer)
      this.getPositionTimer = window.setTimeout(() => {
        if (this.keyword === '') return
        searchPositionApi({ name: this.keyword }).then(({ data }) => {
          this.selectedData = []
          this.parentListId = null
          this.parentSelectData = []
          this.searchData = data.data || []
        })
      }, 200)
    },
    // 左侧内容选择
    handleAsideCheck (item) {
      this.parentListId = item.labelId
      this.parentSelectData = item.children || []
      this.searchData = []
      this.selectedData = []
    },
    // 显示详情
    handleShowDetails (item) {
      const open = !item.open
      // 收起其他
      this.parentSelectData.forEach(val => {
        if (val.open) val.open = false
      })
      this.$set(item, 'open', open)
      this.selectedData = open ? item.children : []
    },
    handleSelected (item) {
      this.$emit('input', item.labelId)
      if (this.$parent.$options.componentName === 'ElFormItem') {
        this.$parent.$emit('el.form.change', item.labelId)
      }
      this.$emit('on-selected', item)
      this.showDialog = false
    }
  },
  destroyed () {
    window.clearTimeout(this.getPositionTimer)
  }
}
</script>
<style lang="less" scoped>
.position-type {
  line-height: normal !important;
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
</style>
