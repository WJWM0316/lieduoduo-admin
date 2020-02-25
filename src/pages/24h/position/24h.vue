<template>
  <div id="H24" class="H24">
    <div class="app-title">
      <div class="title">24h职位</div>
      <router-link class="btn-group-wrapper" target="_blank" :to="{name: 'h24_position_post'}" v-if="AdminShow != 4 && AdminShow != 5 && AdminShow != 6">
        <el-button type="primary">新增</el-button>
      </router-link>
    </div>
    <header-filter ref="headerFilter" @on-search="handleSearch" />
    <el-form ref="form" :model="form" style="margin-left: 12px" :inline="true">
      <el-form-item label="职位ID">
        <el-input v-model="form.positionId"></el-input>
      </el-form-item>
      <el-form-item label="上下架时间">
        <date-filter
            ref="dateFilter"
            :start-time.sync="form.startTime"
            :end-time.sync="form.endTime"
            :queryName="{start: 'startTime', end: 'endTime'}" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch()">搜索</el-button>
        <el-button type="primary" @click="reset()">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table border :data="lists" v-loading="getLoading">
      <el-table-column prop="sort" label="权重" width="90"></el-table-column>
      <el-table-column prop="positionId" label="职位ID"></el-table-column>
      <el-table-column prop="positionName" label="职位名" width="150"></el-table-column>
      <el-table-column prop="startTime" label="上架时间"></el-table-column>
      <el-table-column prop="endTime" label="下架时间"></el-table-column>
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
        fixed="right"
        width="150"
        prop="action"
        label="操作">
        <template slot-scope="{row}">
          <router-link class="btn_deal" v-if="row.status !== 4 && AdminShow != 4 && AdminShow != 5 && AdminShow != 6" target="_blank" :to="{ name: 'h24_position_edit', query: { id: row.id } }">编辑</router-link>
          <router-link class="btn_deal" target="_blank" :to="{
            name: 'interview24h',
            query: {
              tab_status: 1,
              searchType: 'position_id',
              content: row.positionId
            }
          }">相关24h面试</router-link>
          <router-link class="btn_deal" target="_blank" :to="{
            name: 'positionAuditDetail',
            query: { id: row.positionId }
          }">查看职位</router-link>
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
      @current-change="(val) => handleSearch(val, 'page')">
      <span class="total">共{{ Math.ceil(total/20) }}页, {{total}}条记录</span>
    </el-pagination>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import { getRapidlyPositionList } from 'API/24h'
import HeaderFilter from '../components/areaTypeFilter'
import DateFilter from 'COMPONENTS/dateFilterPicker'
@Component({
  name: 'H24',
  components: { HeaderFilter, DateFilter }
})
export default class H24 extends Vue {
  total = 0
  pageSize = 20
  getLoading = false
  form = {
    page: 1,
    positionId: '',
    startTime: '',
    endTime: '',
    count: this.pageSize
  }
  lists = []
  AdminShow = ''
  getRapidlySurfaceList (query = {}) {
    let params = {
      ...this.form,
      ...query
    }
    this.form = params
    this.getLoading = true
    getRapidlyPositionList(params).then(res => {
      this.getLoading = false
      let infos = res.data
      this.total = infos.meta.total
      this.lists = infos.data
      this.$router.replace({ query: params })
    })
  }
  handleSearch (value, type) {
    if (type !== 'page') this.form.page = 1
    if (typeof value === 'object') {
      this.getRapidlySurfaceList(value)
      return
    } else {
      if (value) this.form[type] = value
    }
    this.getRapidlySurfaceList()
  }
  reset () {
    this.form = {
      page: 1,
      positionId: '',
      startTime: '',
      endTime: '',
      count: 20
    }
    this.$refs.dateFilter.clear()
    this.$refs.headerFilter.clear().then(val => {
      this.handleSearch(val)
    })
  }
  mounted () {
    this.AdminShow = +sessionStorage.getItem('AdminShow')
    let query = this.$route.query
    this.form = Object.assign(this.form, query)
    this.getLoading = true
    this.$refs.headerFilter.getList().then(val => {
      this.getLoading = false
      this.getRapidlySurfaceList(val)
    })
  }
}
</script>
<style lang="less" scoped>
#H24{
  margin-bottom: 60px;
  border: 1px solid rgb(238, 238, 238);
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
    width: calc(100vw - 200px);
    background-color: #ffffff;
    border: 1px solid #e8e9eb;
}
</style>
