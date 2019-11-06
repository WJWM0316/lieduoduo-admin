<style lang="less" scoped>
#urgent{
  margin: 22px 22px 22px 222px;
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
    padding: 0 20px;
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
    display: block;
  }
}
</style>
<style>
.urgent .el-pagination{
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
<template>
  <div id="urgent" class="urgent">

    <el-form ref="form" :inline="true">

      <el-form-item>
        <el-input placeholder="请输入" v-model="form.name">
          <el-select v-model="form.select1" slot="prepend" placeholder="职位">
            <el-option label="公司名" value="1"></el-option>
            <el-option label="招聘官" value="2"></el-option>
            <el-option label="职位" value="3"></el-option>
          </el-select>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-input placeholder="请输入" v-model="form.name2">
          <el-select v-model="form.select2" slot="prepend" placeholder="公司">
            <el-option label="公司名" value="1"></el-option>
            <el-option label="招聘官" value="2"></el-option>
            <el-option label="职位" value="3"></el-option>
          </el-select>
        </el-input>
      </el-form-item>
      <el-form-item label="上架/下架">
        <el-select v-model="form.is_online" placeholder="全部状态">
          <el-option label="上架" value="1"></el-option>
          <el-option label="下架" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="审核状态">
        <el-select v-model="form.status" placeholder="全部状态">
          <el-option label="关闭" value="0"></el-option>
          <el-option label="已通过" value="1"></el-option>
          <el-option label="待审核" value="2"></el-option>
          <el-option label="退回重审" value="3"></el-option>
          <el-option label="未通过" value="4"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="职位类别">
        <el-cascader
          ref="cascader"
          class="formItem"
          placeholder="职位类别"
          :options="options"
          filterable
          change-on-select
          :props="positionManage"
          @change="type"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="职位来源">
        <el-select v-model="form.wherefrom" placeholder="全部状态">
          <el-option label="小程序发布" value="1"></el-option>
          <el-option label="后台添加" value="2"></el-option>
          <el-option label="excel导入" value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="todoAction('add')">新增</el-button>
        <el-button type="primary" @click="search">搜索</el-button>
        <el-button type="primary" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table border :data="lists">
      <el-table-column
        prop="id"
        label="职位ID">
      </el-table-column>
      <el-table-column
        prop="sort"
        label="权重序号">
      </el-table-column>
      <el-table-column
        prop="positionName"
        label="职位名">
      </el-table-column>
<!--       <el-table-column
        prop="positionName"
        label="职位信息">
      </el-table-column> -->
      <el-table-column
        prop="recruiterInfo"
        label="招聘官">
        <template slot-scope="scope" v-if="scope.row.recruiterInfo">
          {{scope.row.recruiterInfo.name}}
        </template>
      </el-table-column>
      <el-table-column
        prop="recruiterInfo"
        label="主体公司">
        <template slot-scope="scope" v-if="scope.row.recruiterInfo">
          {{scope.row.recruiterInfo.companyName}}
        </template>
      </el-table-column>
      <el-table-column
        prop="updatedAt"
        label="更新时间">
      </el-table-column>
      <el-table-column
        prop="seatsNum"
        label="上架/下架">
        <template slot-scope="scope">
          {{scope.row.upIsOnline === 1 ? '上架' : '下架'}}
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        label="审核状态">
        <template slot-scope="scope">
          <span v-if="scope.row.status === 0">关闭</span>
          <span v-if="scope.row.status === 1">已通过</span>
          <span v-if="scope.row.status === 2">待审核</span>
          <span v-if="scope.row.status === 3">退回重审</span>
          <span v-if="scope.row.status === 4">未通过</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="action"
        width="100"
        label="操作">
        <template slot-scope="scope">
          <span class="btn_deal" @click="todoAction('delete', scope.row)">移除</span>
          <span class="btn_deal" @click="todoAction('edit', scope.row)">编辑</span>
          <span class="btn_deal" @click="todoAction('view', scope.row)">查看</span>
          <span v-if="AdminShow==5 || AdminShow==6 || AdminShow==0" @click="todoAction('create', scope.row)" class="btn_deal">创建推荐单</span>
          <el-popover
            placement="bottom"
            width="300"
            v-model="scope.row.canDisplay"
            trigger="click">
            <div>
              <div style="text-align: center;" v-if="!form.qrCode">
                <img style="height: 38px;width: 38px; margin-top: 10px;" src="../../assets/loading.gif" />
                <div style="margin-top: 20px;">正在加载中…</div>
              </div>
              <div v-else>
                <img class="Qr" :src="form.qrCode" />
                <div style="text-align: center;margin-top: 10px;">微信扫码，打开小程序查看</div>
              </div>
            </div>
            <span @click.stop="getPositionCodeUrl(scope.row.id)" slot="reference" class="btn_deal">扫码看职位</span>
          </el-popover>
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
import { getLabelPositionListApi } from 'API/position'
import { getUrgencyListApi, deleteUrgencyApi } from 'API/urgent'
import { getPositionCodeUrlApi } from 'API/interview'

@Component({
  name: 'urgent'
})
export default class Urgent extends Vue {
  AdminShow = 0
  total = 0
  pageSize = 20
  form = {
    page: 1,
    position_id: '',
    start_time: '',
    end_time: '',
    count: this.pageSize,
    is_online: '',
    wherefrom: '',
    name: '',
    name2: '',
    type: '',
    status: '',
    select2: '',
    select1: '',
    qrCode: ''
  }
  lists = []
  options = [];
  positionManage = {
    value: 'labelId',
    label: 'name',
    children: 'children'
  }; // 职位类别的配置
  ManageList () {
    getLabelPositionListApi().then(res => {
      this.options = res.data.data
      this.options.forEach(item => {
        item.children.forEach(item1 => {
          item1.children.forEach(item2 => {
            let result = JSON.stringify(item2.children)
            if (result === '[]') delete item2.children
          })
        })
      })
    })
  }
  type (e) {
    this.form.type = e[e.length - 1]
  }
  getUrgencyList () {
    let params = {
      count: this.pageSize,
      page: this.form.page
    }
    if (this.form.is_online) {
      params = Object.assign(params, { is_online: this.form.is_online })
    }
    if (this.form.type) {
      params = Object.assign(params, { type: this.form.type })
    }
    if (this.form.status) {
      params = Object.assign(params, { status: this.form.status })
    }
    if (this.form.name) {
      params = Object.assign(params, { name: this.form.name })
    }
    if (this.form.name2) {
      params = Object.assign(params, { name2: this.form.name2 })
    }
    if (this.form.wherefrom) {
      params = Object.assign(params, { wherefrom: this.form.wherefrom })
    }
    getUrgencyListApi(params).then(res => {
      let infos = res.data
      let lists = infos.data
      lists.map(field => (field.canDisplay = false))
      this.total = infos.meta.total
      this.lists = lists
      if (this.form.name) {
        params = Object.assign(params, { select1: this.form.select1 })
      }
      if (this.form.name2) {
        params = Object.assign(params, { select2: this.form.select2 })
      }
      this.$router.push({ query: { ...params } })
    })
  }
  tabClick (type) {
    this.navigation.map(field => (field.active = type === field.type))
    this.form.position_id = ''
    this.getUrgencyList()
  }
  search () {
    this.getUrgencyList()
  }
  pageChange (page) {
    this.form.page = page
    this.getUrgencyList()
  }
  todoAction (type, data) {
    switch (type) {
      case 'add':
        this.$router.push({ name: 'urgent_post' })
        break
      case 'edit':
        this.$router.push({ name: 'urgent_edit', query: { id: data.aid } })
        break
      case 'delete':
        this.$confirm('移出急聘职位管理吗？', '移出', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          deleteUrgencyApi({ id: data.aid }).then(() => this.getUrgencyList())
        }).catch(() => {})
        break
      case 'view':
        this.$router.push({
          name: 'positionAuditDetail',
          query: {
            id: data.id,
            page: 'urgent'
          }
        })
        break
      case 'create':
        if (!data.isRecommend) {
          this.$message({ message: '没开通服务' })
        } else if (data.isOnline === 2) {
          this.$message({ message: '职位已下线' })
        } else {
          let obj = JSON.stringify(data)
          this.$router.push({
            path: '/resumeStore/recommendList/createOrder',
            query: {
              obj,
              frompostion: true,
              isFocus: true
            }
          })
        }
        break
      default:
        break
    }
  }
  getPositionCodeUrl (uid) {
    this.lists.map(field => {
      field.canDisplay = false
      if (field.uid === uid) field.canDisplay = true
    })
    this.form.qrCode = ''
    return getPositionCodeUrlApi({ id: uid }).then(res => (this.form.qrCode = res.data.data.qrCodeUrl))
  }
  init () {
    let query = this.$route.query
    this.form = Object.assign(this.form, query)
    if (this.form.is_online) this.form.is_online = Number(this.form.is_online)
  }
  reset () {
    this.form = {
      page: 1,
      position_id: '',
      start_time: '',
      end_time: '',
      count: 20
    }
    let obj = {}
    obj.stopPropagation = () => {}
    this.$refs.cascader.inputValue = ''
    // this.$refs.cascader.clearValue(obj)
    this.getUrgencyList()
  }
  created () {
    this.init()
    this.getUrgencyList()
    this.ManageList()
    this.AdminShow = +sessionStorage.getItem('AdminShow')
  }
}
</script>
