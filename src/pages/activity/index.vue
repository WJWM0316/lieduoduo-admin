<template>
<!-- 活动列表 -->
  <div>
    <layout-content
      :leftcontent="{ title: '活动列表'}"
      :isShowbtn="true">
      <router-link v-if="![3, 4, 5, 6].includes(AdminShow)" slot="text" :to="{name: 'activity_add'}">
        <el-button type="primary">新增</el-button>
      </router-link>
      <template slot="formContent">
        <el-form ref="form" :model="params" style="margin-left: 12px" :inline="true">
          <el-form-item>
            <el-input placeholder="请输入内容" v-model="params.typeValue">
              <el-select @change="params.typeValue = ''" v-model="params.type" slot="prepend" style="width:110px" placeholder="请选择">
                <el-option label="活动名称" value="title"></el-option>
                <el-option label="活动ID" value="zt_id"></el-option>
              </el-select>
            </el-input>
          </el-form-item>
          <el-form-item label="端口">
            <el-select v-model="params.device" placeholder="请选择">
              <el-option label="全部" value=""></el-option>
              <el-option label="APP" value="app"></el-option>
              <el-option label="PC" value="pc"></el-option>
              <el-option label="小程序" value="mini_program"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="用户端">
            <el-select v-model="params.client" placeholder="请选择">
              <el-option label="全部" value=""></el-option>
              <el-option label="B端" value="b"></el-option>
              <el-option label="C端" value="c"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="活动时间">
            <date-filter
              ref="dateFilter"
              :start-time.sync="params.start_time"
              :end-time.sync="params.end_time" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button type="primary" @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </template>
      <template slot="dataList">
        <el-table border :data="lists" v-loading="getLoading">
          <el-table-column label="活动ID" prop="id" width="90"></el-table-column>
          <el-table-column label="活动名称" prop="title"></el-table-column>
          <el-table-column label="活动时间">
            <template slot-scope="{row}">
              <p>{{row.startTime}}  -</p>
              <p>{{row.endTime}}</p>
            </template>
          </el-table-column>
          <el-table-column label="端口" width="100">
            <template slot-scope="{row}">
              <p v-if="row.app === 1">APP</p>
              <p v-if="row.pc === 1">PC</p>
              <p v-if="row.miniProgram === 1">小程序</p>
            </template>
          </el-table-column>
          <el-table-column label="用户端" width="100">
            <template slot-scope="{row}">
              <p v-if="row.b === 1">B端</p>
              <p v-if="row.c === 1">C端</p>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="220">
            <template slot-scope="{row}">
              <router-link v-if="AdminShow !== 6" class="table-link" tag="p" :to="{name: 'unit_list', params: {aid: row.id}}">栏目</router-link>
              <template v-if="![3, 4, 5, 6].includes(AdminShow)">
                <router-link class="table-link" tag="p" :to="{name: 'activity_edit', query: {aid: row.id, vkey: row.vkey}}">编辑</router-link>
              </template>
              <el-popover
                placement="top"
                width="160"
                trigger="click">
                <div style="height: 160px">
                  <img style="max-width: 100%" :src="row.qrcode" alt="" />
                </div>
                <p slot="reference" class="table-link" @click="getListQrCode(row)">扫码看活动</p>
              </el-popover>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <template slot="pageList">
        <div class="list-footer">
          <el-pagination
            layout="prev, pager, next, slot"
            :total="total"
            :page-size="params.count"
            prev-text="上一页"
            next-text="下一页"
            :current-page="Number(params.page)"
            @current-change="(val) => handleSearch(val, 'page')">
            <span class="total">共{{ Math.ceil(total/20) }}页, {{total}}条记录</span>
          </el-pagination>
        </div>
      </template>
    </layout-content>
  </div>
</template>
<script>
import LayoutContent from 'COMPONENTS/LayoutWrapper/content'
import DateFilter from 'COMPONENTS/dateFilterPicker'
import { getActivityList, getActivityQrcode } from 'API/activity'
export default {
  components: {
    LayoutContent,
    DateFilter
  },
  data () {
    return {
      getLoading: false,
      params: {
        page: 1,
        count: 20,
        device: '', // 客户端
        client: '', // 用户端
        start_time: '',
        end_time: '',
        type: 'title',
        typeValue: ''
      },
      total: 0,
      AdminShow: '',
      lists: []

    }
  },
  created () {
    this.AdminShow = +sessionStorage.getItem('AdminShow')
    this.getPageList()
  },
  methods: {
    getPageList () {
      let params = {}
      for (let item of ['page', 'count', 'device', 'client']) {
        if (this.params[item]) {
          params[item] = this.params[item]
        }
      }
      if (this.params.start_time && this.params.end_time) {
        params.start_time = this.params.start_time
        params.end_time = this.params.end_time
      }
      if (this.params.typeValue) {
        params[this.params.type] = this.params.typeValue
      }
      this.getLoading = true
      getActivityList(params).then(({ data }) => {
        this.getLoading = false
        this.total = data.meta.total
        this.lists = data.data || []
      }).catch(() => {
        this.getLoading = false
      })
    },
    getListQrCode (row) {
      if (row.qrcode || !row.miniUrl) return
      getActivityQrcode({ path: row.miniUrl }).then(({ data }) => {
        this.$set(row, 'qrcode', data.data.url)
      })
    },
    handleSearch (value, type) {
      if (type !== 'page') this.params.page = 1
      this.getPageList()
    },
    handleReset () {
      this.params = {
        page: 1,
        count: 20,
        device: '', // 客户端
        client: '', // 用户端
        start_time: '',
        end_time: '',
        type: 'title',
        typeValue: ''
      }
      this.$refs.dateFilter.clear()
    }
  }
}
</script>
<style lang="less" scoped>
.table-link {
  color: #5E2B8C;
  cursor: pointer;
}
</style>
