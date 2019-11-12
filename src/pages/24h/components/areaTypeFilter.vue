<template>
  <!-- 头部分筛选 -->
  <div class="header-filter" v-loading="getLoading">
    <ul class="h24_navigation">
      <template v-for="item in citys">
        <li
          :key="item[propsKey.city]"
          :class="{active: item[propsKey.city] === params[props.city]}"
          @click="tabClick(item, propsKey.city, props.city)">{{item.name}}</li>
      </template>
    </ul>
    <ul class="h24_navigation">
      <template v-for="item in types">
        <li
          :key="item[propsKey.type]"
          :class="{active: item[propsKey.type] == params[props.type]}"
          @click="tabClick(item, propsKey.type, props.type)">{{item.name}}</li>
      </template>
      <slot name="add-type-btn"></slot>
    </ul>
    <ul class="h24_navigation">
      <template v-for="item in status">
        <li
          :key="item[propsKey.status]"
          :class="{active: item[propsKey.status] == params[props.status]}"
          @click="tabClick(item, propsKey.status, props.status)">{{item.name}}</li>
      </template>
    </ul>
    <div class="header-btn">
      <slot></slot>
    </div>
  </div>
</template>
<script>
import { getRapidlyPositionAttr, getRapidlyRecruiterAttr, getRapidlyCompanyAttr } from 'API/24h'
export default {
  props: {
    props: {
      type: Object,
      default: () => ({
        city: 'cityNum',
        type: 'positionType',
        status: 'status'
      })
    },
    propsArr: {
      type: Object,
      default: () => ({
        city: 'citys',
        type: 'positionTypes',
        status: 'rapidlyStatus'
      })
    },
    propsKey: {
      type: Object,
      default: () => ({
        city: 'cityNum',
        type: 'positionTypeId',
        status: 'value'
      })
    },
    methodType: {
      type: String,
      default: 'getRapidlyPositionAttr'
    }
  },
  data () {
    return {
      citys: [], // 城市列表
      types: [], // 职位类型列表
      status: [], // 参数类型列表
      getLoading: false,
      params: {}
    }
  },
  created () {
    // 读取顶部是否存在对应的内容
    let { query } = this.$route
    // 生成对应params
    for (let item in this.props) {
      this.$set(this.params, this.props[item], query[this.props[item]])
    }
    this.methodApi = {
      getRapidlyPositionAttr,
      getRapidlyRecruiterAttr,
      getRapidlyCompanyAttr
    }
  },
  methods: {
    async getList () {
      this.getLoading = true
      await this.methodApi[this.methodType]().then(({ data }) => {
        this.getLoading = false
        // const { citys, positionTypes, rapidlyStatus } = data
        this.citys = data.data[this.propsArr['city']] || []
        this.types = data.data[this.propsArr['type']] || []
        this.status = data.data[this.propsArr['status']] || []
        // 赋值到params
        this.params[this.props.city] = this.citys[0] ? this.citys[0][this.propsKey.city] : ''
        this.params[this.props.type] = this.types[0] ? this.types[0][this.propsKey.type] : ''
        this.params[this.props.status] = this.status[0] ? this.status[0][this.propsKey.status] : ''
      })
      return this.params
    },
    tabClick (item, key, param, isClear) {
      if (isClear) this.clear()
      this.params[param] = item[key]
      this.$emit('on-search', this.params)
    },
    clear () {
      // 赋值到params
      return new Promise((resolve) => {
        this.params[this.props.city] = this.citys[0] ? this.citys[0][this.propsKey.city] : ''
        this.params[this.props.type] = this.types[0] ? this.types[0][this.propsKey.type] : ''
        this.params[this.props.status] = this.status[0] ? this.status[0][this.propsKey.status] : ''
        resolve(this.params)
      })
    }
  }
}
</script>
<style lang="less" scoped>
.header-filter {
  min-height: 100px;
  position: relative;
}
.header-btn {
  position: absolute;
  right: 12px;
  top: 0px;
}
.h24_navigation{
  text-align: left;
  margin-left: 10px;
  li{
    display: inline-block;
    background-color: #f4f4f5;
    display: inline-block;
    padding: 12px 15px;
    font-size: 12px;
    border-radius: 2px;
    color: #909399;
    margin-bottom: 10px;
    cursor: pointer;
    transition: opacity 400ms, background 400ms, color 400ms;
  }
  li+li {
    margin-left: 6px;
  }
  li:hover,.active {
    background-color: #3e294d;
    color: white;
  }
  li:hover {
    opacity: 0.9;
  }
  .active{
    pointer-events: none;
  }
}
</style>
