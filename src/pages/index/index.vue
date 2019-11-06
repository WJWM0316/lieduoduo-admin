<template>
  <div id="index">
    <el-container class="container" style="border: 1px solid #eee">
      <el-header class="header" style="text-align: right; font-size: 15px">
        <div class="title">公司管理({{total}})</div>
        <div class="export">
        <el-button type="primary" @click="download" :disabled="!canDownloadData" v-if="AdminShow == 0 || AdminShow == 2 || AdminShow == 1 || AdminShow == 4 || AdminShow == 5">导出</el-button>
        </div>
      </el-header>
      <el-main width="200px">
        <!--筛选-->
        <div class="selectionBox" @keyup.enter="search">
          <el-form ref="form" :model="form" label-width="80px" validate="validate">

            <!-- 筛选条件1 -->
            <div class="searchTab">
              <el-input
                type="text"
                placeholder="请输入内容"
                v-model="form.content"
                class="inputSelect">
                <el-select
                  class="selectTitle"
                  v-model="form.searchType"
                  slot="prepend"
                  placeholder="公司名"
                  @change="changeSearchMethods"
                >
                  <el-option
                    label="公司名"
                    value="keyword"
                  ></el-option>
                  <el-option
                    label="手机号码"
                    value="mobile"
                  ></el-option>
                  <el-option
                    label="公司ID"
                    value="companyId"
                  ></el-option>
                </el-select>
              </el-input>
            </div>
            <!-- 筛选条件2 -->
            <!--地区筛选-->
            <el-form-item class="area" label="地区筛选" prop="area">
              <el-select
                v-model="form.firstAreaId"
                placeholder="请选择省份"
                @change="changeSearchType"
                style="margin-right: 10px;">
                <el-option
                  v-for="item in firstAreaIdList"
                  :key="item.areaId"
                  :label="item.title"
                  :value="item.areaId"
                ></el-option>
              </el-select>
              <el-select v-model="form.area_id" placeholder="请选择城市">
                <el-option
                  v-for="item in cityLable"
                  :key="item.areaId"
                  :label="item.title"
                  :value="item.areaId"
                ></el-option>
              </el-select>
            </el-form-item>

            <!-- 权益筛选 -->
            <el-form-item class="area" label="权益类型" prop="equity">
              <el-select v-model="form.equity" placeholder="请选择权益" style="margin-right: 10px;">
                <el-option label="全部权益" :value=0></el-option>
                <el-option
                  v-for="item in rightList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
                <!-- <el-option label="全部权益" value="0"></el-option>
                <el-option label="test" value="3"></el-option>
                <el-option label="专业版" value="2"></el-option>
                <el-option label="免费试用版" value="1"></el-option> -->
              </el-select>
            </el-form-item>

            <el-form-item class="time" label="权益截止时间" prop="start" label-width="100px">
              <el-col :span="11">
                <el-date-picker
                  type="date"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd"
                  v-model="form.start"
                  style="width: 100%;"
                ></el-date-picker>
              </el-col>
              <el-col class="line" :span="1">—</el-col>
              <el-col :span="11">
                <el-date-picker
                  type="date"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd"
                  v-model="form.end"
                  style="width: 100%;"
                ></el-date-picker>
              </el-col>
            </el-form-item>
            <!--用于代替清除结束时间-->
            <el-form-item label-width="1px" label prop="end"></el-form-item>

            <!-- 状态筛选 -->
            <el-form-item class="area" label="状态" prop="status" label-width="50px">
              <el-select v-model="form.status" placeholder="请选择状态" style="margin-right: 10px;">
                <el-option label="全部" :value=0></el-option>
                <el-option label="上线" value="1"></el-option>
                <el-option label="下线" value="0"></el-option>
              </el-select>
            </el-form-item>

            <!-- 跟进人筛选 -->
            <el-form-item class="area" label="跟进销售" prop="adminUid" label-width="70px">
              <el-select v-model="form.adminUid" placeholder="请选择" style="margin-right: 10px;">
                <el-option label="全部" value="all" v-if="AdminShow==4"></el-option>
                <el-option label="无" :value=0></el-option>
                <el-option
                  v-for="item in salerLis"
                  :key="item.id"
                  :label="item.realname"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label-width="77px" label="营业执照" prop="is_license">
              <el-select v-model="form.is_license" placeholder="全部状态">
                <el-option label="全部" value></el-option>
                <el-option label="无营业执照" value="0"></el-option>
                <el-option label="有营业执照" value="1"></el-option>
              </el-select>
            </el-form-item>
            <!-- 公司来源 -->
            <el-form-item label-width="77px" label="公司来源" prop="wherefrom">
              <el-select v-model="form.wherefrom" placeholder="全部状态">
                <el-option label="全部" :value=0></el-option>
                <el-option label="后台创建" value="2"></el-option>
                <el-option label="用户创建" value="1"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label-width="77px" label="客户等级" prop="customer_level">
              <el-select v-model="form.customer_level" placeholder="请选择">
                <el-option :label="item.text" :value="item.value" v-for="item in companyCustomerLevelRange" :key="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label-width="77px" label="跟进顾问" prop="advisorUid">
              <el-select v-model="form.advisorUid" placeholder="全部状态">
                <el-option :label="item.realname" :value="item.id" v-for="item in advisorUserList" :key="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="time" label="入库时间" prop="start" label-width="100px">
              <el-col :span="11">
                <el-date-picker
                  type="date"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd"
                  v-model="form.exportStart"
                  style="width: 100%;"
                ></el-date-picker>
              </el-col>
              <el-col class="line" :span="1">—</el-col>
              <el-col :span="11">
                <el-date-picker
                  type="date"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd"
                  v-model="form.exportEnd"
                  style="width: 100%;"
                ></el-date-picker>
              </el-col>
            </el-form-item>
            <!-- 是否优质公司 -->
            <el-form-item label-width="100px" label="是否优质公司" prop="high_quality">
              <el-select v-model="form.high_quality" placeholder="全部">
                <el-option label="否" value=0></el-option>
                <el-option label="是" value=1></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="btn">
              <el-button type="primary" @click="onSubmit">查询</el-button>
              <el-button @click.stop="resetForm('form')">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
        <!--筛选-->
        <list
          :fields="fields"
          :list="list"
          :total="total"
          :page="Number(form.page)"
          :page-count="pageCount"
          @page-change="handlePageChange"
        >
          <template slot-scope="props" slot="columns">
            <!-- 操作列 -->
            <div class="btn-container" v-if="props.scope.column.property === 'check'">
              <div>
                <span class="check" @click="check(props.scope.row.id)">查看</span>
              </div>
              <div>
                <span
                  class="check"
                  @click="toUser(props.scope.row.createdUid)"
                  v-if="props.scope.row.createdUid"
                >查看管理员</span>
              </div>
              <div>
                <span class="check"
                v-if="props.scope.row.highQuality === 0"
                @click="toPost(props.scope.row.id)"
                >添加到24h公司</span>
              </div>
            </div>
            <!-- 地址列 -->
            <div class="btn-container" v-else-if="props.scope.column.property === 'address'">
              <div>
                <span>{{props.scope.row.address.city || '公司未设置地址'}}</span>
              </div>
            </div>
            <!-- 序号 -->
            <div class="btn-container" v-else-if="props.scope.column.property === 'index'">
              <div>
                <span>{{props.scope.row.id}}</span>
              </div>
            </div>
            <div class="btn-container" v-else-if="props.scope.column.property === 'customer_level'">
              <el-select
                v-model="list[props.scope.$index].customerVevelValue"
                placeholder="请选择"
                @change="change(props.scope.$index, list[props.scope.$index].customerVevelValue)">
                <el-option
                  v-for="item in props.scope.row[props.scope.column.property]"
                  :key="item.value"
                  :label="item.text"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
            <!-- 申请信息 -->
            <div class="btn-container" v-else-if="props.scope.column.property === 'companyName'">
              <div style="text-align: left; display: flex;align-items: center;">
                <img
                  style="width: 56px;height: 56px;border-radius: 5px;margin-right: 5px;"
                  :src="props.scope.row.logoInfo.middleUrl"
                />
                <div>
                  <p class="btn-container-quality" v-if="props.scope.row.highQuality === 1">优质公司</p>
                  <span>{{props.scope.row.companyName}}</span>
                  <P class="label">
                    <span class="industry">{{props.scope.row.industry}}</span>
                    <span class="capital">{{props.scope.row.financingInfo}}</span>
                    <span class="extent">{{props.scope.row.employeesInfo}}</span>
                  </P>
                </div>
              </div>
            </div>
            <!--认证状态-->
            <div
              class="btn-container"
              v-else-if="props.scope.column.property === 'status' || props.scope.column.property === 'authStatus'"
              style="height: 48px;"
            >
              <div>
                <span
                  :class="{'row-delete': props.scope.row.status !== 1}"
                  v-show="!props.scope.row[props.scope.column.property] && props.scope.row[props.scope.column.property] !== 0"
                >
                  未提交
                  <i class="el-icon-warning" style="color: #E6A23C;"></i>
                </span>
                <span
                  :class="{'row-delete': props.scope.row.status !== 1}"
                  v-show="props.scope.row[props.scope.column.property] === 0"
                >
                  审核中
                  <i class="el-icon-warning" style="color: #E6A23C;"></i>
                </span>
                <span
                  :class="{'row-delete': props.scope.row.status !== 1}"
                  v-show="props.scope.row[props.scope.column.property] === 1"
                >
                  已通过
                  <i class="el-icon-success" style="color: #67C23A;"></i>
                </span>
                <span
                  :class="{'row-delete': props.scope.row.status !== 1}"
                  v-show="props.scope.row[props.scope.column.property] === 2"
                >
                  未通过
                  <i class="el-icon-error" style="color: #F56C6C;"></i>
                </span>
              </div>
            </div>
            <template v-else>
              <span
                :class="{'row-delete': props.scope.row.status !== 1}"
              >{{props.scope.row[props.scope.column.property]}}</span>
            </template>
          </template>
        </list>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import { getCompanyListApi, getCityApi, setCompanyCustomerLevelApi } from 'API/company'
import { rightInfoApi, getSalerListApi, getCompanyCustomerLevelRangeApi, getAdvisorUserListApi } from 'API/commont'
import { getAccessToken } from 'API/cacheService'
import { API_ROOT } from 'API/index.js'
import List from '@/components/list'
Component.registerHooks([
  'beforeRouteEnter',
  'beforeRouteLeave',
  'beforeRouteUpdate' // for vue-router 2.2+
])

@Component({
  name: 'companyLibrary',
  components: {
    List
  }
})
export default class indexPage extends Vue {
  canDownloadData = true
  total = 0; // 筛查结果数量
  pageCount = 0; // 请求回的数据共几页
  AdminShow = ''; // 权限字段，限制搜索
  form = {
    high_quality:'0',
    wherefrom: "",
    is_license: "",
    start: "",
    end: "",
    exportStart: undefined,
    exportEnd: undefined,
    page: 1,
    count: 20,
    area_id: '',
    firstAreaId: '',
    equity: '',
    status: '',
    adminUid: '',
    customer_level: '',
    advisorUid: '',
    searchType: 'keyword',
    keyword: '',
    companyId: '',
    mobile: '',
    content: ''
  };
  rightList = []; // 权益列表
  salerLis = []; // 销售人员列表
  // firstAreaId = ''
  firstAreaIdList = [];
  cityLable = [];
  list = [];
  fields = [
    {
      prop: 'id',
      label: '公司ID',
      width: 100
    },
    {
      prop: 'companyName',
      label: '申请信息',
      width: 350
      //    align: 'left'
    },
    {
      prop: 'address',
      label: '地区',
      width: 150
    },
    {
      prop: 'rtVersionName',
      label: '权益类型',
      width: 100
    },
    {
      prop: 'customer_level',
      label: '客户等级',
      width: 200,
      align: 'left'
    },
    {
      prop: 'expiredDesc',
      label: '权益截止时间',
      width: 200
    },
    {
      prop: 'adminName',
      label: '跟进销售',
      width: 100
    },
    {
      prop: 'advisorName',
      label: '跟进顾问',
      width: 100
    },
    {
      prop: 'statusDesc',
      label: '状态',
      width: 100
    },
    {
      prop: 'check',
      fixed: 'right',
      width: 200,
      label: '操作'
    }
  ];
  companyCustomerLevelRange = []
  advisorUserList = []
  changeSearchMethods (e) {
    this.form.content = ''
    this.form.keyword = ''
    this.form.mobile = ''
    this.form.companyId = ''
  }
  change (index, value) {
    let item = this.list.find((field, i) => index === i)
    setCompanyCustomerLevelApi({ id: item.id, customerLevel: value })
  }
  /**
   * @Author   小书包
   * @DateTime 2019-07-19
   * @detail   获取跟进人列表
   * @return   {[type]}   [description]
   */
  getCompanyCustomerLevelRange () {
    getCompanyCustomerLevelRangeApi().then((res) => {
      let arr = res.data.data
      arr.map((v, k) => {
        v.value = ((v.value).toString())
      })
      this.companyCustomerLevelRange = arr
    })
  }
  /**
   * @Author   小书包
   * @DateTime 2019-07-19
   * @detail   顾问推荐 - 顾问列表
   * @return   {[type]}   [description]
   */
  getAdvisorUserList () {
    getAdvisorUserListApi().then((res) => {
      let arr = res.data.data
      arr.map((v, k) => {
        v.id = ((v.id).toString())
      })
      this.advisorUserList = arr
    })
  }
  /**
   * @Author   小书包
   * @DateTime 2019-07-19
   * @detail   获取公司数据
   * @return   {[type]}           [description]
   */
  getCompanyList (newForm) {
    this.form[this.form.searchType] = this.form.content
    let params = {
      page: this.form.page,
      count: this.form.count
    }
    if (this.form.wherefrom) {
      params = Object.assign(params, { wherefrom: this.form.wherefrom })
    }
    if (this.form.customer_level !== '') {
      params = Object.assign(params, { customer_level: this.form.customer_level })
    }
    if (this.form.advisorUid) {
      params = Object.assign(params, { advisorUid: this.form.advisorUid })
    }
    if (this.form.adminUid) {
      params = Object.assign(params, { adminUid: this.form.adminUid })
    }
    if (this.form.status) {
      params = Object.assign(params, { status: this.form.status })
    }
    if (this.form.is_license) {
      params = Object.assign(params, { is_license: this.form.is_license })
    }
    if (this.form.equity) {
      params = Object.assign(params, { equity: this.form.equity })
    }
    if (this.form.keyword) {
      params = Object.assign(params, { keyword: this.form.keyword })
    }
    if (this.form.companyId) {
      params = Object.assign(params, { companyId: this.form.companyId })
    }
    if (this.form.mobile) {
      params = Object.assign(params, { mobile: this.form.mobile })
    }
    if ((this.form.start && !this.form.end) || (!this.form.start && this.form.end)) {
      this.$message({ message: '权益截止时间必需选择区间时间', type: 'warning' })
      return
    } else {
      if (this.form.start && this.form.end) {
        params = Object.assign(params, { start: this.form.start, end: this.form.end })
      }
    }
    if ((this.form.exportStart && !this.form.exportEnd) || (!this.form.exportStart && this.form.exportEnd)) {
      this.$message({ message: '入库时间必需选择区间时间', type: 'warning' })
      return
    } else {
      if (this.form.exportStart && this.form.exportEnd) {
        params = Object.assign(params, { exportStart: this.form.exportStart, exportEnd: this.form.exportEnd })
      }
    }
    // if(this.form.exportStart && this.form.exportEnd) {
    //   params = Object.assign(params, {exportStart: this.form.exportStart, exportEnd: this.form.exportEnd})
    // }
    if ((this.form.firstAreaId && !this.form.area_id) || (!this.form.firstAreaId && this.form.area_id)) {
      this.$message.error('请选择城市')
      return
    } else {
      if (this.form.firstAreaId && this.form.area_id) {
        params = Object.assign(params, { firstAreaId: this.form.firstAreaId, area_id: this.form.area_id })
      }
    }
    params = Object.assign(params,{high_quality: this.form.high_quality})
    getCompanyListApi(params).then(res => {
      let list = res.data.data
      list.map((field, index) => {
        field.customer_level = [].concat(this.companyCustomerLevelRange)
        field.customerVevelValue = (field.customerLevel).toString()
      })
      this.list = list;
      this.pageCount = res.data.meta.lastPage;
      this.total = res.data.meta.total;
      if(this.form.keyword || this.form.mobile || this.form.companyId) {
        params = Object.assign(params, {searchType: this.form.searchType, content: this.form.content})
      }
      
      this.$router.push({
        query: {
          ...params
        }
      })
    })
  }
  /* 翻页 */
  handlePageChange (nowPage) {
    this.form.page = nowPage
    this.getCompanyList()
  }
  /* 新建公司 */
  addCompany () {
    this.$router.push({ path: '/index/createCompany' })
  }
  onSubmit () {
    this.form.page = 1
    this.getCompanyList()
  }
  // 搜索公司
  search () {
    this.onSubmit()
  }
  // 获取城市标签
  getCity () {
    return getCityApi().then(res => {
      res.data.data.map(item => this.firstAreaIdList.push(item))
    })
  }
  // 获取权益列表
  async getRightList () {
    let res = await rightInfoApi({ pageCount: 50 })
    let arr = res.data.data
    arr.map((v, k) => {
      v.id = ((v.id).toString())
    })
    this.rightList = arr
  }
  // 获取销售人员名单
  async getSalerList () {
    let res = await getSalerListApi({ pageCount: 50 })
    let arr = res.data.data
    arr.map((v, k) => {
      v.id = ((v.id).toString())
    })
    this.salerLis = arr
  }
  /* 选择省 */
  changeSearchType () {
    this.firstAreaIdList.map(item => {
      if (item.areaId === this.form.firstAreaId) {
        this.cityLable = item.children
        this.form.area_id = ''
      }
    })
  }
  resetForm (name) {
    this.$refs[name].resetFields()
    this.form.searchType = 'keyword'
    this.form.content = ''
    this.form.keyword = ''
    this.form.mobile = ''
    this.form.companyId = ''
    this.form.area_id = ''
    this.form.firstAreaId = ''
    this.form.equity = ''
    this.form.status = ''
    this.form.adminUid = ''
    this.form.is_license = ''
    this.form.wherefrom = ''
    this.form.customer_level = ''
    this.form.advisorUid = ''
    this.form.exportStart = undefined
    this.form.exportEnd = undefined
    this.getCompanyList()
  }
  check (id) {
    this.$route.meta.scrollY = window.scrollY
    this.$router.push({
      path: '/index/companyInfo',
      query: { id: id }
    })
  }
  toUser (uid) {
    this.$router.push({ path: `/user/userInfo/${uid}` })
  }
  toPost(id) {
    this.$router.push({ path: `/24h/add/${id}` });
  }
  download() {
    this.$confirm('是否导出该列表数据？', '提示', {
      confirmButtonText: '是',
      cancelButtonText: '否',
      type: 'warning'
    }).then(() => {
      let date = new Date()
      let downloadName = `公司库-${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}.xlsx`
      let url = `${API_ROOT}/company/list?isExport=1`

      this.form[this.form.searchType] = this.form.content
      if (this.form.wherefrom) {
        url += `&wherefrom=${this.form.wherefrom}`
      }
      if (this.form.customer_level !== '') {
        url += `&customer_level=${this.form.customer_level}`
      }
      if (this.form.advisorUid) {
        url += `&advisorUid=${this.form.advisorUid}`
      }
      if (this.form.adminUid) {
        url += `&adminUid=${this.form.adminUid}`
      }
      if (this.form.status) {
        url += `&status=${this.form.status}`
      }
      if (this.form.equity) {
        url += `&equity=${this.form.equity}`
      }
      if (this.form.keyword) {
        url += `&keyword=${this.form.keyword}`
      }
      if (this.form.companyId) {
        url += `&companyId=${this.form.companyId}`
      }
      if (this.form.mobile) {
        url += `&mobile=${this.form.mobile}`
      }
      if (this.form.is_license) {
        url += `&is_license=${this.form.is_license}`
      }
      if ((this.form.start && !this.form.end) || (!this.form.start && this.form.end)) {
        this.$message({ message: '权益截止时间必需选择区间时间', type: 'warning' })
        return
      } else {
        if (this.form.start && this.form.end) {
          url += `&start=${this.form.start}&end=${this.form.end}`
        }
      }
      if ((this.form.exportStart && this.form.exportEnd)) {
        url += `&exportStart=${this.form.exportStart}&exportEnd=${this.form.exportEnd}`
      }

      if ((this.form.firstAreaId && !this.form.area_id) || (!this.form.firstAreaId && this.form.area_id)) {
        this.$message.error('请选择城市')
        return
      } else {
        if (this.form.firstAreaId && this.form.area_id) {
          url += `&firstAreaId=${this.form.firstAreaId}&area_id=${this.form.area_id}`
        }
      }
      this.canDownloadData = false
      url = url.replace(/\s*/g, '')
      let xmlResquest = new XMLHttpRequest()
      xmlResquest.open('get', url, true)
      xmlResquest.setRequestHeader('Content-type', 'application/json')
      xmlResquest.setRequestHeader('Authorization-Admin', getAccessToken())
      xmlResquest.responseType = 'blob'
      xmlResquest.onload = () => {
        this.canDownloadData = true
        let content = xmlResquest.response
        let link = document.createElement('a')
        let blob = new Blob([content])
        link.download = downloadName
        link.style.display = 'none'
        link.href = URL.createObjectURL(blob)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
      xmlResquest.send()
    }).catch(() => {
      this.$message({
        type: 'info',
        message: '已取消导出'
      })
    })
  }
  created () {
    this.form = Object.assign(this.form, this.$route.query)
    this.getCompanyList()
    this.getCity().then(() => {
      this.form.firstAreaId = Number(this.form.firstAreaId) > 0 ? Number(this.form.firstAreaId) : ''
      this.form.area_id = Number(this.form.area_id) > 0 ? Number(this.form.area_id) : ''
      let result = {}
      if (this.form.firstAreaId) {
        result = this.firstAreaIdList.find(field => field.areaId === this.form.firstAreaId)
        this.cityLable = result.children
      }
    })
    this.getRightList()
    this.getSalerList()
    this.getCompanyCustomerLevelRange()
    this.getAdvisorUserList()
    this.AdminShow = +sessionStorage.getItem('AdminShow')
  }
}
</script>

<style lang="less">
#index {
  .el-form-item__label{
    text-align: center
  }
  margin-left: 200px;
  .container {
    min-width: 1000px;
    margin: 22px;
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .title {
        display: flex;
        align-items: center;
        position: relative;
        font-size: 15px;
        &::before {
          background: #ffe266;
          content: "";
          display: inline-block;
          float: left;
          height: 100%;
          height: 16px;
          margin-right: 10px;
          width: 6px;
        }
      }
      .export{
        margin-right: 20px;
        margin-top: 10px;
      }
      .creatBtn {
        font-size: 15px;
        padding: 12px 20px;
        background-color: #ffe266;
        border-radius: 4px;
      }
    }
    .el-form {
      /*display: flex;*/
      /*align-items: center;*/
      /* 筛选 */
      .inputSelect {
        line-height: 20px !important;
        width: 400px !important;
        background-color: #ffffff;
        .el-select {
          width: 120px;
          margin-top: -2px;
          border: none;
          box-sizing: border-box;
        }
      }
      &::after {
        content: "";
        display: block;
        height: 0;
        clear: both;
      }
    }
    .el-form-item,
    .searchTab {
      margin-bottom: 22px;
      margin-right: 20px;
      float: left;
    }
    .btn {
      float: right;
    }
  }
}
.check {
  line-height: 45px;
  color: #652791;
  cursor: pointer;
}
.btn-container {
  .label {
    white-space: nowrap;
    text-align: left;
    width: 100%;
    span {
      display: inline-block;
      background-color: #f8f8f8;
      padding: 0 4px;
      border-radius: 3px;
      margin-right: 10px;
    }
  }
  .btn-container-quality{
    width: 70px;
    line-height: 20px;
    color: #fff;
    background: #652791;
    border-radius: 30px;
    text-align: center;
  }
}
</style>
