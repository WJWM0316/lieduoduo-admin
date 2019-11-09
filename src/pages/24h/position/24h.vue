<template>
  <div id="H24" class="H24">
    <div class="app-title">
      <div class="title">24h职位</div>
      <el-button class="btn-group-wrapper" type="primary" @click="todoAction('add')">新增</el-button>
    </div>
    <header-filter ref="headerFilter" @on-search="handleSearch" />
    <el-form ref="form" :model="form" label-width="80px" :inline="true">
      <el-form-item label="职位ID">
        <el-input v-model="form.positionId"></el-input>
      </el-form-item>
      <el-form-item label="上架时间">
        <el-date-picker type="datetime" placeholder="选择日期" v-model="form.startTime" style="width: 100%;" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
      </el-form-item>
      <el-form-item label="下架时间">
        <el-date-picker type="datetime" placeholder="选择日期" v-model="form.endTime" style="width: 100%;" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
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
        <template slot-scope="scope">
          <span class="btn_deal" @click="todoAction('edit', scope.row)" v-if="scope.row.status !== 4">编辑</span>
          <span class="btn_deal" @click="todoAction('view', scope.row)">相关24h面试</span>
          <span class="btn_deal" @click="todoAction('details', scope.row)">查看职位</span>
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
@Component({
  name: 'H24',
  components: { HeaderFilter }
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
      case 'details':
        this.$router.push({
          name: 'positionAuditDetail',
          query: { id: data.positionId }
        })
        break
      default:
        break
    }
  }
  reset () {
    this.form = {
      page: 1,
      positionId: '',
      startTime: '',
      endTime: '',
      count: 20
    }
    this.$refs.headerFilter.clear().then(val => {
      this.handleSearch(val)
    })
  }
  mounted () {
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
    width: 100%;
    background-color: #ffffff;
    border: 1px solid #e8e9eb;
}
</style>
