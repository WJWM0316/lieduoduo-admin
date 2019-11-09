<!--职位管理-->
<template>
  <div class="positionManage" @click="closeTopic">
    <el-container class="container" style="border: 1px solid #eee">
      <el-header class="header" style="text-align: right; font-size: 15px">
        <div class="title">职位管理({{total}})</div>
        <el-button @click.stop="addPosition" class="btn-limit-width">发布职位</el-button>
      </el-header>
      <el-main>
        <!--筛选-->
        <div class="form_header" @keyup.enter="search">
          <el-form ref="form" :inline="true">
            <el-form-item>
              <!-- 筛选条件1 -->
              <div class="searchTab">
                <el-input placeholder="请输入" v-model="form.name" class="inputSelect">
                  <el-select v-model="select1" slot="prepend" placeholder="职位">
                    <el-option label="公司名" value="1"></el-option>
                    <el-option label="招聘官" value="2"></el-option>
                    <el-option label="职位" value="3"></el-option>
                  </el-select>
                </el-input>
              </div>
            </el-form-item>
            <el-form-item>
              <!-- 筛选条件1 -->
              <div class="searchTab">
                <el-input placeholder="请输入" v-model="form.name2" class="inputSelect">
                  <el-select v-model="select2" slot="prepend" placeholder="公司">
                    <el-option label="公司名" value="1"></el-option>
                    <el-option label="招聘官" value="2"></el-option>
                    <el-option label="职位" value="3"></el-option>
                  </el-select>
                </el-input>
              </div>
            </el-form-item>
            <el-form-item label="上线/下线">
              <el-select v-model="form.is_online" placeholder="全部状态">
                <el-option label="上线" value="1"></el-option>
                <el-option label="下线" value="2"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="审核状态">
              <el-select v-model="form.status" placeholder="全部状态">
                <el-option label="全部状态" value=""></el-option>
                <el-option label="关闭" value="0"></el-option>
                <el-option label="已通过" value="1"></el-option>
                <el-option label="待审核" value="2"></el-option>
                <el-option label="退回重审" value="3"></el-option>
                <el-option label="未通过" value="4"></el-option>
              </el-select>
            </el-form-item>
            <!-- 职位来源 -->
            <el-form-item label="职位类别">
              <el-cascader
                ref="cascader"
                placeholder="职位类别"
                :options="options"
                filterable
                change-on-select
                :clearable="clearable"
                :props="positionManage"
                @change="type"
              ></el-cascader>
            </el-form-item>

            <el-form-item label="职位来源">
              <el-select v-model="form.wherefrom" placeholder="全部" style="width: 140px;">
                <el-option label="全部" value="0"></el-option>
                <el-option label="excel导入" value="3"></el-option>
                <el-option label="小程序发布" value="1"></el-option>
                <el-option label="后台添加" value="2"></el-option>
              </el-select>
            </el-form-item>
            <!-- 职位来源 -->
            <el-form-item label="薪资范围">
              <el-select v-model="form.emolument_min" placeholder="请选择" @change="changeEmolumentMin"  style="width: 120px;">
                <el-option
                  v-for="item in emolumentMinList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              -
              <el-select v-model="form.emolument_max" placeholder="请选择"  style="width: 120px;" :disabled="!form.emolument_min">
                <el-option
                  v-for="item in emolumentMaxList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              &nbsp;×&nbsp;
              <el-select v-model="form.annual_salary" placeholder="请选择" style="width: 120px;" :disabled="!form.emolument_max">
                <el-option
                  v-for="item in annual_salary_list"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="城市">
              <el-select
                v-model="form.city"
                filterable
                placeholder="请输入城市名">
                <el-option
                  v-for="(item, index) in cityLists"
                  :key="index"
                  :label="item.title"
                  :value="item.areaId">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="经验要求">
              <el-select v-model="form.work_experience" placeholder="请选择">
                <el-option :label="item.text" :value="item.id" v-for="item in experienceLists" :key="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="更新时间">
              <el-date-picker
                v-model="form.update_start"
                :picker-options="pickerOptionsStart"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetime"
                placeholder="请选择开始时间">
              </el-date-picker>
              -
              <el-date-picker
                v-model="form.update_end"
                :picker-options="pickerOptionsEnd"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetime"
                placeholder="请选择结束时间">
              </el-date-picker>
            </el-form-item>
          </el-form>
          <div class="SumbitBtn" style="overflow: hidden; text-align: right;">
            <el-button type="primary" @click="onSubmit">查询</el-button>
            <el-button @click="resetForm('form')">重置</el-button>
          </div>
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
            <div
              class="btn-container"
              style="flex-wrap: wrap;"
              v-if="props.scope.column.property === 'op'"
            >
              <div>
                <span class="check" @click="check(props.scope.row.id)">查看</span>
              </div>
              <span
                v-if="AdminShow==5||AdminShow==6||AdminShow==0"
                class="createOrder"
                @click="toPath(props.scope.row)"
              >创建推荐单</span>
              <div
                style="width: 100%; cursor: pointer; color: #652791;"
                @click.stop="creatLink($event, props.scope.row.id, props.scope.$index)"
              >扫码看职位</div>
              <div class="check" v-if="props.scope.row.isRapidly === 1" @click.stop="checkPosition(props.scope.row.id)">添加到24h职位（限席位）</div>
            </div>

            <div
              class="btn-container"
              v-else-if="props.scope.column.property === 'positionMsg'"
              style="height: 48px;"
            >
              <div class="positionMsg">
                <span class="job_name">
                  {{props.scope.row.positionName}}
                  <span
                    class="execlPut"
                    v-if="props.scope.row.wherefrom==='3'"
                  >导</span>
                </span>
              </div>
            </div>

            <div
              class="btn-container"
              v-else-if="props.scope.column.property === 'status'"
              style="height: 48px;"
            >
              <span v-show="props.scope.row.status ===0">
                关闭
                <i class="el-icon-error" style="color: #F56C6C;"></i>
              </span>
              <span v-show="props.scope.row.status ===1">
                已通过
                <i class="el-icon-success" style="color: #67C23A;"></i>
              </span>
              <span v-show="props.scope.row.status ===2">
                待审核
                <i class="el-icon-warning" style="color: #E6A23C;"></i>
              </span>
              <span v-show="props.scope.row.status ===3">
                退回重审
                <i class="el-icon-warning" style="color: #E6A23C;"></i>
              </span>
              <span v-show="props.scope.row.status ===4">
                未通过
                <i class="el-icon-error" style="color: #F56C6C;"></i>
              </span>
            </div>

            <div
              class="btn-container"
              v-else-if="props.scope.column.property === 'recruiterName'"
              style="height: 48px;"
            >
              <span v-if="props.scope.row.recruiterInfo">{{props.scope.row.recruiterInfo.name}}</span>
            </div>

            <div
              class="btn-container"
              v-else-if="props.scope.column.property === 'company'"
              style="height: 48px;"
            >
              <span>{{props.scope.row.companyInfo.companyName}}</span>
            </div>
            <div v-else-if="props.scope.column.property === 'types'">
              <p>{{props.scope.row.types.topType}}</p>
              <p>{{props.scope.row.types.middleType}}</p>
              <p>{{props.scope.row.types.minType}}</p>
            </div>
            <div v-else-if="props.scope.column.property === 'lastRapidly'">
              <p>{{props.scope.row.lastRapidly}}</p>
            </div>
            <div
              class="btn-container"
              v-else-if="props.scope.column.property === 'emolumentMin'"
              style="height: 48px;"
            >
              {{props.scope.row.emolumentMin}}k-{{props.scope.row.emolumentMax}}k x{{props.scope.row.annualSalary}}薪
            </div>
            <div
              class="btn-container"
              v-else-if="props.scope.column.property === 'isOnline'"
              style="height: 48px;"
            >
              <span>{{props.scope.row.isOnline === 2 ? '下线' : '上线'}}</span>
            </div>
            <!-- 职位信息
            <div
              class="btn-container"
              v-else-if="props.scope.column.property === 'positionMsg'"
              style="height: 48px;"
            >
              <i class="el-icon-error" style="color: #F56C6C;"></i>
            </div>-->
            <template v-else>
              <span
                :class="{'row-delete': props.scope.row.status !== 1}"
              >{{props.scope.row[props.scope.column.property]}}</span>
            </template>
          </template>
        </list>
      </el-main>
    </el-container>
    <!--小程序码展示框-->
    <div class="qrCode" ref="qrCode">
      <img class="bg" src="../../../assets/code_bg.png" />
      <div
        style="height: 100%;display: flex; align-items: center;flex-direction: column;justify-content: center;"
        v-if="!qrCode"
      >
        <img style="height: 38px;width: 38px;" src="../../../assets/loading.gif" />
        <div class="txt">正在加载中…</div>
      </div>
      <div v-else>
        <img class="Qr" :src="qrCode" />
        <div class="txt">微信扫码，打开小程序查看</div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import List from '@/components/list'
import { getAddressListsApi } from 'API/company'
import { getPositionCodeUrlApi } from 'API/interview'
import { getListApi, getLabelPositionListApi } from 'API/position'
@Component({
  name: 'course-list',
  components: {
    List
  },
  watch: {
    'form.city': {
      handler (areaId) {
        if (areaId) {
          let item = this.cityLists.find(field => field.areaId === areaId)
          if (!item) return
          this.form.city = item.areaId
          this.form.cityName = item.title
        }
      },
      immediate: true
    }
  }
})
export default class companyCheck extends Vue {
  total = 0; // 筛查结果数量
  pageCount = 0; // 请求回的数据共几页
  qrCode = '';
  AdminShow = 0;
  searchType = {
    condition1: 'name',
    condition2: 'name2',
    condition3: 'name3',
    keyword1: '',
    keyword2: '',
    keyword3: ''
  };
  clearable = true
  select1 = {
    value: ''
  };
  select2 = {
    value: ''
  };
  form = {
    wherefrom: '', // 数据来源
    type: '',
    is_online: '', // 状态（1 上线，2 下线)
    status: '', // 状态（0关闭，1开启，审核通过，2审核中，3审核失败）查询多种状态用，号分隔（1,2,3）
    recruiter: '',
    page: 1,
    name: '', // 职位名称，公司名，招聘官名（1）
    name2: '', // 职位名称，公司名，招聘官名（2）
    count: 20,
    update_start: '',
    update_end: '',
    annual_salary: '',
    emolument_min: '',
    emolument_max: '',
    city: '',
    cityName: '',
    work_experience: ''
  };
  cityLists = [];
  positionManage = {
    value: 'labelId',
    label: 'name',
    children: 'children'
  }; // 职位类别的配置
  searchType = {
    condition1: 'keyword',
    condition2: 'mobile',
    keyword1: '',
    keyword2: ''
  };
  fields = [
    {
      prop: 'id',
      label: '职位ID',
      width: 150
    },
    {
      prop: 'positionMsg',
      label: '职位信息',
      width: 250
    },
    {
      prop: 'recruiterName',
      label: '招聘官',
      width: 180
    },
    {
      prop: 'company',
      label: '主体公司',
      width: 200
    },
    {
      prop: 'types',
      label: '职位类别',
      width: 150
    },
    {
      prop: 'lastRapidly',
      label: '上次成为24h职位（限席位）时间',
      width: 150
    },
    {
      prop: 'updatedAt',
      label: '更新时间',
      width: 200
    },
    {
      prop: 'emolumentMin',
      label: '薪资范围',
      width: 200
    },
    {
      prop: 'isOnline',
      label: '上线/下线',
      width: 150
    },
    {
      prop: 'status',
      label: '审核状态'
      //    width: 150
    },
    {
      prop: 'wherefromDesc',
      label: '职位来源'
      //    width: 150
    },
    {
      prop: 'op',
      fixed: 'right',
      width: 150,
      label: '操作'
    }
  ];
  loading = false
  list = [];
  options = [];
  positionManage = {
    value: 'labelId',
    label: 'name',
    children: 'children'
  }; // 职位类别的配置
  experienceLists = [
    {
      id: '1',
      text: '不限'
    },
    {
      id: '2',
      text: '应届生'
    },
    {
      id: '3',
      text: '一年以内'
    },
    {
      id: '4',
      text: '1-3年'
    },
    {
      id: '5',
      text: '3-5年'
    },
    {
      id: '6',
      text: '5-10年'
    },
    {
      id: '7',
      text: '10年以上'
    }
  ]
  emolumentMaxList = [] // 选择薪资范围
  emolumentMinList = [] // 选择薪资范围
  annual_salary_list = []
  change (e) {
    let result = this.cityLists.find(field => (field.areaId = e))
    this.form.city = result.areaId
    this.form.cityName = result.title
  }
  setEmolumentMin () {
    let max = 250
    let i = 0
    let list = []

    while (i < max) {
      if (i < 30) {
        i++
      } else if (i < 100) {
        i += 5
      } else if (i < max) {
        i += 10
      }

      list.push({
        label: `${i}k`,
        value: i
      })
    }

    this.emolumentMinList = list
  }

  changeEmolumentMin (e) {
    this.form.emolument_max = ''
    this.setEmolumentMax(e)
  }

  setEmolumentMax (num) {
    let max = 0
    let list = []

    if (num <= 10) {
      max = num + 5
    } else if (num > 10 && num < 31) {
      max = num * 2
    } else if (num > 34 && num < 71) {
      max = num + 30
    } else if (num > 74 && num < 96) {
      max = num + 30
    } else if (num > 99 && num < 251) {
      max = num * 2
    }

    for (let i = num + 1; i <= max; i++) {
      list.push({
        label: `${i}k`,
        value: i
      })
    }

    this.emolumentMaxList = list
  }
  get pickerOptionsStart () {
    let _this = this
    return {
      disabledDate (time) {
        let endDateVal = _this.form.appointmentConfirmTimeEnd
        if (endDateVal) {
          return Date.parse(time) > Date.parse(new Date(endDateVal))
        }
      }
    }
  }
  get pickerOptionsEnd () {
    let _this = this
    return {
      disabledDate (time) {
        let beginDateVal = _this.form.appointmentConfirmTimeStart
        if (beginDateVal) {
          return Date.parse(time) < Date.parse(new Date(beginDateVal))
        }
      }
    }
  }
  remoteMethod (query) {
    this.loading = true
  }
  type (e) {
    this.form.type = e[e.length - 1]
  }
  onSubmit (e) {
    this.form.page = 1
    this.getTemplist()
  }
  // 搜索地址
  search () {
    this.onSubmit()
  }
  check (id) {
    this.$route.meta.scrollY = window.scrollY
    this.$router.push({
      name: 'positionAuditDetail',
      query: {
        id: id,
        page: 'positionManage'
      }
    })
  }

  checkPosition (id) {
    this.$router.push({
      name: 'h24_position_post',
      query: {
        positions: id
      }
    })
  }

  /* 重置 */
  resetForm (formName) {
    this.form = {
      wherefrom: '', // 数据来源
      type: '',
      is_online: '', // 状态（1 上线，2 下线)
      status: '', // 状态（0关闭，1开启，审核通过，2审核中，3审核失败）查询多种状态用，号分隔（1,2,3）
      recruiter: '',
      page: 1,
      name: '', // 职位名称，公司名，招聘官名（1）
      name2: '', // 职位名称，公司名，招聘官名（2）
      count: 20,
      update_start: '',
      update_end: '',
      annual_salary: '',
      emolument_min: '',
      emolument_max: '',
      city: '',
      cityName: '',
      work_experience: ''
    }
    let obj = {}
    obj.stopPropagation = () => {}
    this.$refs.cascader.inputValue = ''
    // this.$refs.cascader.clearValue(obj)
    this.getTemplist()
  }

  addPosition () {
    this.$router.push({ name: 'positionPost' })
  }
  handlePageChange (nowPage) {
    this.$route.meta.scrollY = 0
    window.scrollTo(0, 0)
    this.form.page = nowPage
    this.getTemplist()
  }
  /* 请求职位管理列表 */
  getTemplist () {
    // 基本查询条件
    let params = {
      page: this.form.page,
      count: this.form.count
    }
    // 已添加职位来源
    if (this.form.wherefrom) {
      params = Object.assign(params, { wherefrom: this.form.wherefrom })
    }
    // 已经选择时间
    if (this.form.update_start && this.form.update_end) {
      params = Object.assign(params, {
        update_start: this.form.update_start,
        update_end: this.form.update_end
      })
    }
    // 已经选择城市
    if (this.form.city) {
      params = Object.assign(params, { city: this.form.city })
    }
    // 已经选择上下线
    if (this.form.is_online) {
      params = Object.assign(params, { is_online: this.form.is_online })
    }
    // 已经选择上下线
    if (this.form.status) {
      params = Object.assign(params, { status: this.form.status })
    }
    // 已经选择职位类别
    if (this.form.type) {
      params = Object.assign(params, { type: this.form.type })
    }
    // 已经选择薪资范围
    if (this.form.emolument_min && this.form.emolument_max) {
      params = Object.assign(params, { emolument_min: this.form.emolument_min, emolument_max: this.form.emolument_max, annual_salary: this.form.annual_salary })
    }
    // 已经符合筛选
    if (this.form.name) {
      params = Object.assign(params, { name: this.form.name })
    }
    // 已经符合筛选
    if (this.form.name2) {
      params = Object.assign(params, { name2: this.form.name2 })
    }
    // 已经薪资范围
    if (this.form.work_experience) {
      params = Object.assign(params, { work_experience: this.form.work_experience })
    }
    if (this.form.update_start && !this.form.update_end) {
      this.$message({ message: '请选择职位的结束时间', type: 'warning' })
      return
    }
    if (!this.form.update_start && this.form.update_end) {
      this.$message({ message: '请选择职位的开始时间', type: 'warning' })
      return
    }
    getListApi(params).then(res => {
      this.list = res.data.data
      this.total = res.data.meta.total
      this.pageCount = res.data.meta.lastPage
      this.$router.push({
        query: {
          ...params
        }
      })
    })
  }
  toPath (row) {
    // isRecommend
    if (!row.isRecommend) {
      this.$message({
        message: '没开通服务'
      })
    } else if (row.isOnline === 2) {
      this.$message({
        message: '职位已下线'
      })
    } else {
      let obj = JSON.stringify(row)
      this.$router.push({
        path: '/resumeStore/recommendList/createOrder',
        query: {
          obj,
          frompostion: true,
          isFocus: true
        }
      })
    }
  }
  /* 关闭浮窗 */
  closeTopic () {
    this.$nextTick(() => {
      this.$refs['qrCode'].style.display = 'none'
    })
  }

  /* 生成职位详情小程序码 */
  async creatLink (e, positionId, index) {
    this.qrCode = ''
    // 是否已经加载过二维码
    if (this.list[index].qrCode) {
      this.qrCode = this.list[index].qrCode
      this.$nextTick(() => {
        this.$refs['qrCode'].style.display = 'block'
        this.$refs['qrCode'].style.left = e.clientX + 'px'
        this.$refs['qrCode'].style.top = e.clientY + window.scrollY + 'px'
      })
      return
    }

    this.$nextTick(() => {
      this.$refs['qrCode'].style.display = 'block'
      this.$refs['qrCode'].style.left = e.clientX + 'px'
      this.$refs['qrCode'].style.top = e.clientY + window.scrollY + 'px'
    })
    let res = await this.getQr(positionId)
    this.qrCode = res.data.data.qrCodeUrl
    this.list[index].qrCode = res.data.data.qrCodeUrl
  }

  /* 生成二维码 */
  getQr (id) {
    return getPositionCodeUrlApi({ id: id })
  }
  /* 关闭二维码弹窗 */
  hiddenQr () {
    this.$nextTick(() => {
      this.$refs['qrCode'].style.display = 'none'
    })
  }
  getAddressLists () {
    return getAddressListsApi({ level: 3 }).then((res) => {
      let arr = res.data.data
      arr.map((v, k) => {
        v.areaId = ((v.areaId).toString())
      })
      this.cityLists = arr
    })
    // return getAddressListsApi({level: 3}).then(res => this.cityLists = res.data.data)
  }
  created () {
    this.form = Object.assign(this.form, this.$route.query)
    if (!this.form.city) this.form.city = ''
    this.AdminShow = +sessionStorage.getItem('AdminShow')
    this.getTemplist()
    this.ManageList()
    this.setEmolumentMin()
    this.getAddressLists()
    for (let i = 12; i <= 24; i++) {
      this.annual_salary_list.push({ value: String(i), label: `${i}薪` })
    }
  }
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
  activated () {
    let that = this
    setTimeout(function () {
      window.scrollTo(0, that.$route.meta.scrollY)
    }, 300)
  }
}
</script>

<style lang="less" scoped="scoped">
@import "./index.less";
.inputSelect {
  line-height: 20px !important;
  width: 100px !important;
  background-color: #ffffff;
  .el-select {
    width: 120px;
    margin-top: -2px;
    border: none;
    box-sizing: border-box;
  }
}
.el-input-group__prepend {
  width: 57px !important;
}
.positionManage {
  text-align: unset;
  .el-main,
  .m-list{
    padding-left: 0;
    padding-right: 0;
  }
  .form_header{
    padding: 0 20px;
  }
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
      .creatBtn {
        font-size: 15px;
        padding: 12px 20px;
        background-color: #ffe266;
        border-radius: 4px;
      }
    }
    .el-form {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      .el-input {
        width: 200px;
      }
    }
    .el-form-item {
      display: inline-block;
    }
  }
  .positionMsg {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .job_name {
      font-family: PingFang-SC-Medium;
      font-weight: 500;
      color: rgba(53, 64, 72, 1);
      margin-bottom: 8px;
      text-overflow: -o-ellipsis-lastline;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      line-clamp: 2;
      -webkit-box-orient: vertical;
      display: inline-block;
      margin-right: 10px;
      .execlPut {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 1px solid red;
        font-size: 12px;
        color: red;
        display: inline-block;
        text-align: center;
        line-height: 20px;
      }
    }
    .job_info {
      span {
        font-size: 12px;
        font-family: PingFang-SC-Regular;
        font-weight: 400;
        color: rgba(98, 98, 98, 1);
        padding: 0 6px;
        margin-right: 8px;
        background: rgba(248, 248, 248, 1);
        border-radius: 2px;
        display: inline-block;
      }
    }
  }
  .btn-container {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    .check {
      color: #652791;
      cursor: pointer;
    }
  }
}
</style>
