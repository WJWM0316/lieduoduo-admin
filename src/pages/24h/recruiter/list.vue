<template>
  <div>
    <layout-content
      :leftcontent="{ title: '24h招聘官'}"
      :isShowbtn="true">
      <router-link slot="text" target="_blank" :to="{name: '24h_recruiter_add'}" v-if="AdminShow != 3 && AdminShow != 4">
        <el-button type="primary">新增</el-button>
      </router-link>
      <template slot="formContent">
        <header-filter
          ref="headerFilter"
          :props="{
            city: 'area_id',
            type:'position_type_id',
            status: 'status'
          }"
          @on-search="handleSearch"
          method-type="getRapidlyRecruiterAttr"/>
        <el-form ref="form" :model="form" style="margin-left: 12px" :inline="true">
          <el-form-item label="用户ID">
            <el-input v-model="form.uid"></el-input>
          </el-form-item>
          <el-form-item label="上下架时间">
            <date-filter
              ref="dateFilter"
              :start-time.sync="form.start_time"
              :end-time.sync="form.end_time" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch()">搜索</el-button>
            <el-button type="primary" @click="reset()">重置</el-button>
          </el-form-item>
        </el-form>
      </template>
      <template slot="dataList">
        <el-table border :data="lists" v-loading="getLoading">
          <el-table-column label="权重" width="90">
            <template slot-scope="{row}">
              {{row.surfaceRapidlyInfo && row.surfaceRapidlyInfo.sort}}
            </template>
          </el-table-column>
          <el-table-column prop="uid" label="用户ID"></el-table-column>
          <el-table-column prop="name" label="招聘官名称" width="120"></el-table-column>
          <el-table-column label="所属公司" width="250">
            <template slot-scope="{row}">
              <div class="company-wrapper"  v-if="row.companyInfo">
                <div class="company-image">
                  <img :src="row.companyInfo.logoInfo.middleUrl" alt="">
                </div>
                <div class="company-title">
                  <p>{{row.companyInfo.companyShortname}}</p>
                  <p><span>{{row.companyInfo.industry}}</span> <span>{{row.companyInfo.financingInfo}}</span> <span>{{row.companyInfo.employeesInfo}}</span></p>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="positionNum" label="在线职位数"></el-table-column>
          <el-table-column prop="isOnline" label="上架状态">
            <template slot-scope="{row}">
              {{row.surfaceRapidlyInfo && row.surfaceRapidlyInfo.isOnlineDesc}}
            </template>
          </el-table-column>
          <el-table-column label="上架时间">
            <template slot-scope="{row}">
              {{row.surfaceRapidlyInfo && row.surfaceRapidlyInfo.startTime}}
            </template>
          </el-table-column>
          <el-table-column label="下架时间">
            <template slot-scope="{row}">
              {{row.surfaceRapidlyInfo && row.surfaceRapidlyInfo.endTime}}
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            width="150"
            prop="action"
            label="操作">
            <template slot-scope="{row}">
              <router-link class="btn_deal" target="_blank" :to="{ name: '24h_recruiter_edit', query: { id: row.surfaceRapidlyInfo.id } }" v-if="AdminShow != 3 && AdminShow != 4">编辑</router-link>
              <router-link class="btn_deal" target="_blank" :to="{ name: 'interview24h', query: { tab_status: 1, searchType: 'recruiter', content: row.name } }">相关24h面试</router-link>
              <router-link class="btn_deal" target="_blank" :to="{ name: 'recruiter_info', params: { id: row.id } }">查看招聘官</router-link>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <template slot="pageList"  v-if="total > form.count">
        <el-pagination
        layout="prev, pager, next, slot"
        :total="total"
        :page-size="form.count"
        prev-text="上一页"
        next-text="下一页"
        :current-page="Number(form.page)"
        @current-change="(val) => handleSearch(val, 'page')">
        <span class="total">共{{ Math.ceil(total/20) }}页, {{total}}条记录</span>
      </el-pagination>
      </template>
    </layout-content>
  </div>
</template>
<script>
import LayoutContent from 'COMPONENTS/LayoutWrapper/content'
import HeaderFilter from '../components/areaTypeFilter'
import DateFilter from '../components/dateFilter'
import { getRapidlyRecruiterList } from 'API/24h'
export default {
  components: { LayoutContent, HeaderFilter, DateFilter },
  data () {
    return {
      getLoading: false,
      lists: [],
      total: 0,
      form: {
        page: 1,
        uid: '',
        start_time: '',
        end_time: '',
        count: 20
      },
      AdminShow: ''
    }
  },
  mounted () {
    this.AdminShow = +sessionStorage.getItem('AdminShow')
    let query = this.$route.query
    this.form = Object.assign(this.form, query)
    this.getLoading = true
    this.$refs.headerFilter.getList().then(val => {
      this.getLoading = false
      this.getPageList(val)
    })
  },
  methods: {
    getPageList (query = {}) {
      let params = {
        ...this.form,
        ...query
      }
      this.form = params
      this.getLoading = true
      getRapidlyRecruiterList(params).then(({ data }) => {
        this.getLoading = false
        this.total = data.meta.total
        this.lists = data.data
        this.$router.replace({ query: params })
      })
    },
    todoAction (type, data) {
      switch (type) {
        case 'add':
          this.$router.push({ name: '24h_recruiter_add' })
          break
        case 'edit':
          this.$router.push({ name: '24h_recruiter_edit', query: { id: data.surfaceRapidlyInfo.id } })
          break
        case 'view':
          this.$router.push({
            name: 'interview24h',
            query: {
              tab_status: 1,
              searchType: 'recruiter',
              content: data.id
            }
          })
          break
        case 'details':
          this.$router.push({
            name: 'recruiter_info',
            params: {
              id: data.id
            }
          })
          break
        default:
          break
      }
    },
    handleSearch (value, type) {
      if (type !== 'page') this.form.page = 1
      if (typeof value === 'object') {
        this.getPageList(value)
        return
      } else {
        if (value) this.form[type] = value
      }
      this.getPageList()
    },
    reset () {
      this.form = {
        page: 1,
        uid: '',
        start_time: '',
        end_time: '',
        count: 20
      }
      this.$refs.dateFilter.clear()
      this.$refs.headerFilter.clear().then(val => {
        this.handleSearch(val)
      })
    }
  }
}
</script>
<style lang="less" scoped>
.btn_deal{
  color: #652791;
  cursor: pointer;
  display: inline-block;
  margin-right: 40px;
}
.company-wrapper {
  display: flex;
  p {
    font-size: 12px;
    span + span {
      margin-left: 3px;
    }
  }
  align-items: center;
  .company-image {
    width: 50px;
    height: 50px;
    min-width: 50px;
    overflow: hidden;
    margin-right: 4px;
    img {
      max-width: 100%;
    }
  }
}
</style>
