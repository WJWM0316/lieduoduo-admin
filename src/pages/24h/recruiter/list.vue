<template>
  <div>
    <layout-content
      :leftcontent="{ title: '24招聘官'}"
      :isShowbtn="true">
      <el-button type="primary" slot="text" @click="todoAction('add')">新建</el-button>
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
        <el-form ref="form" :model="form" label-width="80px" :inline="true">
          <el-form-item label="用户Id">
            <el-input v-model="form.uid"></el-input>
          </el-form-item>
          <el-form-item label="上架时间">
            <el-date-picker type="datetime" placeholder="选择日期" v-model="form.start_time" style="width: 100%;" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
          </el-form-item>
          <el-form-item label="下架时间">
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
            <template scope="{row}">
              {{row.surfaceRapidlyInfo && row.surfaceRapidlyInfo.sort}}
            </template>
          </el-table-column>
          <el-table-column prop="uid" label="用户Id"></el-table-column>
          <el-table-column prop="name" label="招聘官名称" width="120"></el-table-column>
          <el-table-column label="所属公司" width="250">
            <template scope="{row}">
              <div class="company-wrapper"  v-if="row.companyInfo">
                <div class="company-image" >
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
            <template scope="{row}">
              <!-- <span v-if="row.isOnline === 1">上架</span>
              <span v-if="row.isOnline === 2">下架</span>
              <span v-if="row.isOnline === 3">截止</span> -->
              {{row.surfaceRapidlyInfo && row.surfaceRapidlyInfo.isOnlineDesc}}
            </template>
          </el-table-column>
          <el-table-column label="上架时间">
            <template scope="{row}">
              {{row.surfaceRapidlyInfo && row.surfaceRapidlyInfo.startTime}}
            </template>
          </el-table-column>
          <el-table-column label="下架时间">
            <template scope="{row}">
              {{row.surfaceRapidlyInfo && row.surfaceRapidlyInfo.endTime}}
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            width="150"
            prop="action"
            label="操作">
            <template scope="{row}">
              <span class="btn_deal" @click="todoAction('edit', row)">编辑</span>
              <span class="btn_deal" @click="todoAction('details', row)">查看招聘官</span>
              <span class="btn_deal" @click="todoAction('view', row)">相关24h面试</span>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <template slot="pageList">
        <el-pagination
        layout="prev, pager, next, slot"
        :total="total"
        :page-size="form.count"
        prev-text="上一页"
        next-text="下一页"
        :current-page="Number(form.page)"
        v-if="total > form.count"
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
import { getRapidlyRecruiterList } from 'API/24h'
export default {
  components: { LayoutContent, HeaderFilter },
  data () {
    return {
      getLoading: false,
      lists: [],
      total: 0,
      form: {
        page: 1,
        uid: '',
        start_time: '',
        enend_time: '',
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
          this.$router.push({ name: '24h_recruiter_edit', query: { id: data.id } })
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

    }
  }
}
</script>
<style lang="less">
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
    margin-right: 4px;
    img {
      max-width: 100%;
    }
  }
}
</style>
