<template>
  <div class="">
    <layout-content
      :leftcontent="{ title: '栏目内容'}">
      <div class="select-content-type" slot="formContent">
        <span>内容类型 </span>
        <el-select v-model="typeKeyValue" style="width: 120px">
            <template v-for="type in contentType">
              <el-option :key="type.value" :value="type.value" :label="type.label" />
            </template>
          </el-select>
          <el-button type="primary" @click="handleNewContents" :loading="addTabLoading">添加</el-button>
      </div>
      <template slot="dataList" >
        <div class="page-content" v-loading="getTabsLoading"  v-if="tabsList.length">
          <el-tabs
            v-model="currentTabName"
            type="card"
            closable
            @tab-click="handleChangTab"
            @tab-remove="removeContentTab">
            <el-tab-pane
              v-for="item in tabsList"
              :key="item.name"
              :label="item.title"
              :name="item.name"
            ></el-tab-pane>
          </el-tabs>
          <!-- tab content -->
          <div class="tab-content">
            <div class="tab-header">
              <span class="tab-header-title">内容组名称</span>
              <el-input v-model="setTabName" placeholder="自定义内容组名称">
                <el-button type="primary" slot="append" @click="setTab">更换</el-button>
              </el-input>
            </div>
            <div class="tab-header">
              <span class="tab-header-title">{{currentTab.text}}</span>
              <el-input v-model="newIds" placeholder="请填写需要新增的ID">
                <el-button type="primary" slot="append" @click="addIds">新增</el-button>
              </el-input>
              <div class="tab-header-tips">批量添加多个ID，请用英文,隔开</div>
            </div>
          </div>
          <!-- tabs list -->
          <div class="contents-list" v-loading="tabContentLoading">
            <template v-for="item in tabContents">
               <unit-list
                :key="item.id"
                :item="item"
                @list-click="handleOperate"
                @list-change="getTabDetials"
                :tab="currentTab"></unit-list>
            </template>
          </div>
        </div>
        <template v-else>
          <div class="content-empty">暂无数据</div>
        </template>
      </template>
    </layout-content>
    <!-- 图片设置 -->
    <set-images :visible.sync="imageDialog" @change="getTabDetials" :current="currentItem" />
    <!-- 文字设置 -->
    <set-texts :visible.sync="textDialog" @change="getTabDetials" :current="currentItem" />
    <!-- 职位设置 -->
    <set-position :visible.sync="positionDialog" @change="getTabDetials" :current="currentItem" />
  </div>
</template>
<script>
import LayoutContent from 'COMPONENTS/LayoutWrapper/content'
import UnitList from './components/unit-list'
import SetImages from './components/list-image'
import SetPosition from './components/list-position'
import SetTexts from './components/list-text'
import { addUnitTab, getUnitTabs, setUnitTab, deleteUnitTab, addUnitTabIds, getUnitTabDetails } from 'API/activity'
export default {
  components: { LayoutContent, UnitList, SetImages, SetTexts, SetPosition },
  data () {
    return {
      typeKeyValue: 'company', // 选择内容的值
      currentTabName: '1', // 当前内容的tab name 值
      setTabName: '',
      newIds: '',
      apiParams: { aid: null, lid: null },
      addTabLoading: false,
      getTabsLoading: false,
      tabContentLoading: false,
      contentType: [
        { value: 'company', label: '公司' },
        { value: 'recruiter', label: '招聘官' },
        { value: 'position', label: '职位' }
      ],
      tabsList: [],
      tabContents: [],
      currentItem: {}, // current tab content item
      imageDialog: false, // 设置图片的弹窗
      textDialog: false, // 设置文字弹窗
      positionDialog: false // 设置职位弹窗
    }
  },
  created () {
    this.apiParams = this.$route.params
    this.getTabs()
  },
  computed: {
    currentTab () {
      let tab = this.tabsList.find(val => val.name === this.currentTabName) || {}
      switch (tab.type) {
        case 'company':
          tab.text = '新增公司ID'
          break
        case 'recruiter':
          tab.text = '新增招聘官ID'
          break
        case 'position':
          tab.text = '新增职位ID'
          break
      }
      return tab
    }
  },
  methods: {
    getTabs () {
      this.getTabsLoading = true
      getUnitTabs({
        zt_category_id: this.apiParams.lid
      }).then(({ data }) => {
        this.getTabsLoading = false
        this.tabsList = data.data.map((val, index) => {
          return {
            title: val.title,
            name: index + 1 + '',
            type: val.type,
            tid: val.id
          }
        })
        // 默认获取第一个tab的详情作为显示
        if (this.tabsList[0]) {
          this.getTabDetials(this.tabsList[0].tid)
          this.setTabName = this.tabsList[0].title
        }
      }).catch(() => {
        this.getTabsLoading = false
      })
    },
    // 设置tab 名称
    setTab () {
      const { title, tid } = this.currentTab
      if (this.setTabName === title) {
        this.$message.warning('内容组名称和旧的一致')
      } else {
        setUnitTab({ title: this.setTabName, id: tid }).then(({ data }) => {
          if (data.httpStatus === 200) {
            this.$message.success('更换成功')
            this.tabsList.forEach(val => {
              if (val.tid === tid) {
                val.title = this.setTabName
              }
            })
          }
        })
      }
    },
    // 获取tab下关联的id（公司、招聘官、职位） 数据
    getTabDetials (id) {
      const currentId = id || this.currentTab.tid
      this.tabContentLoading = true
      getUnitTabDetails({ zt_category_class_id: currentId }).then(({ data }) => {
        this.tabContentLoading = false
        this.tabContents = data.data || []
      }).catch(() => {
        this.tabContentLoading = false
      })
    },
    // 添加一个新的tab
    handleNewContents () {
      let type = this.contentType.find(val => val.value === this.typeKeyValue)
      let tabLen = this.tabsList.filter(val => val.title.indexOf(type.label) === 0).length
      let tabName = this.tabsList.length + 1 + ''
      let titleName = type.label + (tabLen + 1)
      this.addTabLoading = true
      addUnitTab({
        zt_category_id: this.apiParams.lid,
        title: titleName,
        type: type.value
      }).then(({ data }) => {
        this.addTabLoading = false
        if (data.httpStatus === 200) {
          this.tabsList.push({
            title: titleName,
            name: tabName,
            type: type.value,
            tid: data.data.id
          })
          this.currentTabName = tabName
          this.setTabName = titleName
        }
      }).catch(() => {
        this.addTabLoading = false
      })
    },
    // 切换tab
    handleChangTab ({ name }) {
      this.setTabName = this.currentTab.title
      this.getTabDetials()
    },
    // 删除一项tab
    removeContentTab (name) {
      const current = this.tabsList.find(val => val.name === name)
      this.$confirm('删除将丢失这项所有内容, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteUnitTab({ id: current.tid }).then(({ data }) => {
          if (data.httpStatus === 200) {
            this.$message.success('删除成功！')
            this.getTabs()
          }
        })
      })
    },
    // tab项补充id
    addIds () {
      addUnitTabIds({
        zt_category_class_id: this.currentTab.tid,
        type_id: this.newIds
      }).then(({ data }) => {
        if (data.httpStatus === 200) {
          this.newIds = ''
          this.$message.success('新增成功')
          this.getTabDetials()
        }
      })
    },
    // 设置tab项补充自定义信息，显示对应的弹窗|操作
    handleOperate (type, item) {
      this.currentItem = item
      switch (type) {
        case 'image':
          this.imageDialog = true
          break
        case 'text':
          this.textDialog = true
          break
        case 'position':
          this.positionDialog = true
          break
        case 'weight':
          break
        case 'status':
          break
      }
    }
  }
}
</script>
<style lang="less" scoped>
.page-content {
  margin-top: 12px;
}
.content-empty {
  padding: 40px 0;
  text-align: center;
  border: 1px solid #eee;
  margin:30px 0 100px;
}
.tab-content {
  .tab-header {
    margin-bottom: 12px;
  }
  .tab-header-title {
    display: inline-block;
    vertical-align: middle;
    margin-right: 12px;
    min-width: 90px;
    text-align: right;
  }
  .el-input {
    vertical-align: middle;
    width: 320px;
  }
  .tab-header-tips {
    font-size: 14px;
    color: #999;
    padding-left: 102px;
  }
}
.select-content-type {
  .el-select {
    margin-left: 12px;
  }
  & /deep/ .el-input__inner {
    border-right: none;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
}
.contents-list {
  min-height: 100px;
}
</style>
