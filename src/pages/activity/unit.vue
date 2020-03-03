<template>
<div>
  <!-- 栏目列表 -->
  <layout-content
    :leftcontent="{ title: '栏目列表'}"
    :isShowbtn="true">
    <template slot="text" v-if="![1, 2, 3, 4, 5, 6].includes(AdminShow)">
      <el-button type="primary" @click="handleSet('add')">新增</el-button>
    </template>
    <template slot="dataList">
        <el-table border  :data="lists" v-loading="getLoading">
          <el-table-column label="栏目标题" prop="title" width="200"></el-table-column>
          <el-table-column label="栏目介绍" prop="intro"></el-table-column>
          <el-table-column label="操作" width="220">
            <template slot-scope="{row}">
              <template v-if="![1,2, 3, 4, 5, 6].includes(AdminShow)">
                <p class="table-link" @click="handleSet('edit', row)">栏目编辑</p>
                <router-link class="table-link" tag="p" :to="{name: 'unit_set', params: {aid: row.ztId,lid: row.id}}">内容编辑</router-link>
                <p class="table-error-link" @click="handleDelete(row)">删除</p>
              </template>
            </template>
          </el-table-column>
        </el-table>
      </template>
  </layout-content>
  <set-unit
    :aid="params.zt_id"
    @change="getUnits"
    :visible.sync="setUnitDialogStatus"
    :current="currentUnit"
    :is-add="isAdd"></set-unit>
</div>
</template>
<script>
import LayoutContent from 'COMPONENTS/LayoutWrapper/content'
import SetUnit from './components/set-unit'
import { getUnitList, deleteUnit } from 'API/activity'
export default {
  components: { LayoutContent, SetUnit },
  data () {
    return {
      getLoading: false,
      setUnitDialogStatus: false,
      currentUnit: {},
      isAdd: true,
      params: { zt_id: null },
      lists: [],
      AdminShow: ''
    }
  },
  created () {
    Object.assign(this.params, { zt_id: this.$route.params.aid })
    this.AdminShow = +sessionStorage.getItem('AdminShow')
    this.getUnits()
  },
  methods: {
    getUnits () {
      this.getLoading = true
      getUnitList(this.params).then(({ data }) => {
        this.getLoading = false
        this.lists = data.data || []
      }).catch(() => {
        this.getLoading = false
      })
    },
    handleDelete (row) {
      this.$confirm('删除将丢失栏目下所有内容, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteUnit({ id: row.id }).then(({ data }) => {
          if (data.httpStatus === 200) {
            this.$message.success('删除成功！')
            this.getUnits()
          }
        })
      })
    },
    handleSet (type, value) {
      this.isAdd = type === 'add'
      if (value) this.currentUnit = value
      this.setUnitDialogStatus = true
    }
  }
}
</script>
<style lang="less" scoped>
.table-link {
  color: #5E2B8C;
  cursor: pointer;
}
.table-error-link {
  color: #F07D6E;
  cursor: pointer;
}
</style>
