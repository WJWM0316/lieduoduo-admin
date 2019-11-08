<template>
  <div>
    <layout-content
      :leftcontent="{ title: '24h公司'}"
      :isShowbtn="true">
      <el-button type="primary" slot="text" @click="todoAction('add')">新增</el-button>
      <template slot="formContent">
        <header-filter
          ref="headerFilter"
          :props="{
            city: 'area_id',
            type:'label_id',
            status: 'status'
          }"
          :props-arr="{
            city: 'citys',
            type:'labelArr',
            status: 'rapidlyStatus'
          }"
          :props-key="{
            city: 'cityNum',
            type:'id',
            status: 'value'
          }"
          @on-search="handleSearch"
          method-type="getRapidlyCompanyAttr">
          <template slot="add-type-btn"><router-link style="margin-left: 8px" :to="{name: '24h_labels'}">
            <el-button type="default" icon="el-icon-setting">管理24h分类</el-button>
          </router-link></template>
        </header-filter>
        <el-form ref="form" :model="form" label-width="80px" :inline="true">
          <el-form-item label="公司ID:">
            <el-input v-model="form.company_id"></el-input>
          </el-form-item>
          <el-form-item label="公司名称:">
            <el-input v-model="form.company_name"></el-input>
          </el-form-item>
          <el-form-item label="上架时间:">
            <el-date-picker type="datetime" placeholder="选择日期" v-model="form.start_time" style="width: 100%;" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
          </el-form-item>
          <el-form-item label="下架时间:">
            <el-date-picker type="datetime" placeholder="选择日期" v-model="form.end_time" style="width: 100%;" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
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
          <el-table-column prop="id" label="公司ID"></el-table-column>
          <el-table-column label="公司信息" width="250">
            <template slot-scope="{row}">
              <div class="company-wrapper">
                <div class="company-image" >
                  <img :src="row.logoInfo && row.logoInfo.middleUrl" alt="">
                </div>
                <div class="company-title">
                  <p>{{row.companyShortname}}</p>
                  <p><span>{{row.industry}}</span> <span>{{row.financingInfo}}</span> <span>{{row.employeesInfo}}</span></p>
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
              <span class="btn_deal" @click="todoAction('edit', row)">编辑</span>
              <span class="btn_deal" @click="todoAction('details', row)">查看公司</span>
              <span class="btn_deal" @click="todoAction('view', row)">相关24h面试</span>
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
import { getRapidlyCompanyList } from 'API/24h'
export default {
  components: { LayoutContent, HeaderFilter },
  data () {
    return {
      getLoading: false,
      lists: [],
      total: 0,
      form: {
        page: 1,
        company_id: '',
        company_name: '',
        start_time: '',
        end_time: '',
        count: 20
      }
    }
  },
  mounted () {
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
      getRapidlyCompanyList(params).then(({ data }) => {
        this.getLoading = false
        this.total = data.meta.total
        this.lists = data.data
        this.$router.replace({ query: params })
      })
    },
    todoAction (type, data) {
      switch (type) {
        case 'add':
          this.$router.push({ name: '24h_company_add' })
          break
        case 'edit':
          this.$router.push({ name: '24h_company_edit', query: { id: data.surfaceRapidlyInfo.id } })
          break
        case 'view':
          this.$router.push({
            name: 'recruiter_info',
            params: {
              id: data.id
            }
          })
          break
        case 'details':
          this.$router.push({
            name: 'index',
            query: {
              searchType: 'companyId',
              content: data.id
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
        company_id: '',
        company_name: '',
        start_time: '',
        end_time: '',
        count: 20
      }
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
    min-width: 50px;
    height: 50px;
    overflow: hidden;
    margin-right: 4px;
    img {
      max-width: 100%;
    }
  }
}
</style>
