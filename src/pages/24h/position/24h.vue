<template>
  <div id="H24" class="H24">
     <el-button type="primary" @click="todoAction('add')">新增</el-button>
    <ul class="h24_navigation">
      <li v-for="item in navigation" :key="item.type" :class="{active: item.active}" @click="tabClick(item.type)">{{item.msg}}</li>
    </ul>
    <el-form ref="form" :model="form" label-width="80px" :inline="true">
      <el-form-item label="职位ID">
        <el-input v-model="form.position_id"></el-input>
      </el-form-item>
      <el-form-item label="上架时间">
        <el-date-picker type="datetime" placeholder="选择日期" v-model="form.start_time" style="width: 100%;" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
      </el-form-item>
      <el-form-item label="截止时间">
        <el-date-picker type="datetime" placeholder="选择日期" v-model="form.end_time" style="width: 100%;" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">搜索</el-button>
        <el-button type="primary" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table border :data="lists">
      <el-table-column prop="sort" label="权重"></el-table-column>
      <el-table-column prop="positionId" label="职位ID"></el-table-column>
      <el-table-column prop="positionName" label="职位名"></el-table-column>
      <el-table-column prop="startTime" label="上架时间"></el-table-column>
      <el-table-column prop="endTime" label="截止时间"></el-table-column>
      <el-table-column prop="seatsNum" label="服务席位数量"></el-table-column>
      <el-table-column prop="applyNum" label="真实抢占席位"></el-table-column>
      <el-table-column prop="natureApplyNum" label="虚拟抢占席位">
        <template slot-scope="scope">
          {{scope.row.natureApplyNum}}
        </template>
      </el-table-column>
      <el-table-column prop="seatsNum" label="剩余席位">
        <template slot-scope="scope">
          {{scope.row.seatsNum - scope.row.applyNum - scope.row.natureApplyNum}}
        </template>
      </el-table-column>
      <el-table-column prop="seatsNum" label="浏览人数">
        <template slot-scope="scope">
          {{scope.row.uv}}
        </template>
      </el-table-column>
      <el-table-column prop="seatsNum" label="浏览次数">
        <template slot-scope="scope">
          {{scope.row.pv}}
        </template>
      </el-table-column>
      <el-table-column prop="isOnline" label="上架状态">
        <template slot-scope="scope">
          <span v-if="scope.row.isOnline === 1">上架</span>
          <span v-if="scope.row.isOnline === 2">下架</span>
          <span v-if="scope.row.isOnline === 3">截止</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="action"
        label="操作">
        <template slot-scope="scope">
          <span class="btn_deal" @click="todoAction('edit', scope.row)" v-if="scope.row.status !== 4">编辑</span>
          <span class="btn_deal" @click="todoAction('view', scope.row)">查看</span>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      layout="prev, pager, next, slot"
      :total="total"
      :page-size="pageSize"
      prev-text="上一页"
      next-text="下一页"
      :current-page="Number(form.page)"
      v-if="total > pageSize"
      @current-change="pageChange">
      <span class="total">共{{ Math.ceil(total/20) }}页, {{total}}条记录</span>
    </el-pagination>

  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import {
  getRapidlySurfaceListApi
} from 'API/24h'
@Component({
  name: 'H24'
  // watch: {
  //   '$route': {
  //     handler() {
  //       this.init()
  //       this.getRapidlySurfaceList()
  //     },
  //     immediate: true
  //   }
  // }
})
export default class H24 extends Vue {
  navigation = [
    {
      type: 'processing',
      msg: '进行中',
      active: false,
      id: '1'
    },
    {
      type: 'notStarted',
      msg: '未开始',
      active: false,
      id: '2'
    },
    {
      type: 'padding',
      msg: '即将开始',
      active: false,
      id: '3'
    },
    {
      type: 'resolve',
      msg: '已结束',
      active: false,
      id: '4'
    }
  ]
  total = 0
  pageSize = 20
  form = {
    page: 1,
    position_id: '',
    start_time: '',
    end_time: '',
    count: this.pageSize
  }
  lists = []
  getRapidlySurfaceList () {
    let tab = this.navigation.find(field => field.active)
    let params = {
      count: this.pageSize,
      page: this.form.page,
      tab: tab.id
    }
    if (this.form.position_id) {
      params = Object.assign(params, { position_id: this.form.position_id })
    }
    if (this.form.start_time) {
      params = Object.assign(params, { start_time: this.form.start_time })
    }
    if (this.form.end_time) {
      params = Object.assign(params, { end_time: this.form.end_time })
    }
    getRapidlySurfaceListApi(params).then(res => {
      let infos = res.data
      this.total = infos.meta.total
      this.lists = infos.data
      this.$router.push({ query: { ...params } })
    })
  }
  tabClick (type) {
    this.navigation.map(field => (field.active = type === field.type))
    this.form.position_id = ''
    this.getRapidlySurfaceList()
  }
  search () {
    this.getRapidlySurfaceList()
  }
  pageChange (page) {
    this.form.page = page
    this.getRapidlySurfaceList()
  }
  todoAction (type, data) {
    switch (type) {
      case 'add':
        this.$router.push({ name: 'h24_position_post' })
        break
      case 'edit':
        this.$router.push({ name: 'h24_position_edit', query: { id: data.id } })
        break
      case 'view':
        this.$router.push({
          name: 'interview24h',
          query: {
            tab_status: 1,
            searchType: 'position',
            content: data.positionName
          }
        })
        break
      default:
        break
    }
  }
  init () {
    let query = this.$route.query
    this.form = Object.assign(this.form, query)
    if (query.tab) {
      this.navigation.map(field => (field.active = query.tab === field.id))
    } else {
      this.navigation[0].active = true
    }
  }
  reset () {
    this.navigation.map((field, index) => (field.active = index === 0))
    this.form = {
      page: 1,
      position_id: '',
      start_time: '',
      end_time: '',
      count: 20
    }
    this.getRapidlySurfaceList()
  }
  mounted () {
    this.init()
    this.getRapidlySurfaceList()
  }
}
</script>
<style lang="less" scoped>
#H24{
  margin: 22px 22px 60px 222px;
  border: 1px solid rgb(238, 238, 238);
  .h24_navigation{
    text-align: left;
    margin-top: 24px;
    margin-left: 10px;
    li{
      display: inline-block;
      background-color: #f4f4f5;
      display: inline-block;
      height: 40px;
      padding: 0 15px;
      line-height: 40px;
      font-size: 12px;
      color: #909399;
      cursor: pointer;
    }
    .active{
      background-color: #3e294d;
      color: white;
      cursor: none;
      pointer-events: none;
    }
  }
  .el-form {
    text-align: left;
    margin-top: 22px;
    overflow: hidden;
    .el-form-item{
      text-align: center;
    }
  }
  .el-pagination{
    text-align: left;
    margin: 22px 0;
    overflow: hidden;
  }
  .btn_deal{
    color: #652791;
    cursor: pointer;
    display: inline-block;
    margin-right: 40px;
  }
}
</style>
<style>
.H24 .el-pagination{
    text-align: center !important;
    margin: 0 !important;
    overflow: hidden;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    z-index: 200;
    position: fixed;
    bottom: 0;
    left: 190px;
    padding: 8px;
    width: 100%;
    background-color: #ffffff;
    /* -webkit-box-shadow: 0px -1px 0px 0px #e8e9eb; */
    /* box-shadow: 0px -1px 0px 0px #e8e9eb; */
    border: 1px solid #e8e9eb;
}
</style>
