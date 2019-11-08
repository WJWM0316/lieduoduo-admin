<template>
  <div>
    <layout-content
      :leftcontent="{ title: '24h公司分类', total: total}"
      :isShowbtn="true">
      <el-button type="primary" slot="text" @click="todoAction('add')">新建</el-button>
      <template slot="dataList">
        <el-table border :data="lists" v-loading="getLoading">
          <el-table-column prop="sort" label="权重" width="90"></el-table-column>
          <el-table-column prop="name" label="分类名称"></el-table-column>
          <el-table-column prop="companyTotal" label="进行中公司数" width="120"></el-table-column>
          <el-table-column prop="createdAt" label="创建时间"> </el-table-column>
          <el-table-column
            fixed="right"
            width="150"
            prop="action"
            label="操作">
            <template slot-scope="{row, $index}">
              <span class="btn_deal" @click="todoAction('edit', row)">编辑</span>
              <span class="btn_deal" @click="todoAction('delete', row, $index)">删除</span>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </layout-content>
  </div>
</template>
<script>
import LayoutContent from 'COMPONENTS/LayoutWrapper/content'
import { getRapidlyLabels, deleteRapidlyLabel } from 'API/24h'
export default {
  components: { LayoutContent },
  data () {
    return {
      getLoading: false,
      lists: [],
      total: 0
    }
  },
  created () {
    this.getPageList()
  },
  methods: {
    getPageList () {
      this.getLoading = true
      getRapidlyLabels({ page: 1, count: 1000 }).then(({ data }) => {
        this.getLoading = false
        this.total = data.data.length
        this.lists = data.data
      })
    },
    todoAction (type, data, index) {
      switch (type) {
        case 'add':
          this.$router.push({ name: '24h_labels_add' })
          break
        case 'edit':
          this.$router.push({ name: '24h_labels_edit', query: { id: data.id, name: data.name } })
          break
        case 'delete':
          let totalTips = {
            title: '是否删除该分类',
            content: '是否删除该分类'
          }
          const unDelete = data.companyTotal > 0
          if (unDelete) {
            totalTips = {
              title: '提示',
              content: '该分类下仍有公司，请先将公司下架或移动到其他分类'
            }
          }
          this.$confirm(totalTips.content, totalTips.title, {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            showCancelButton: !unDelete,
            type: 'warning'
          }).then(() => {
            if (!unDelete) {
              deleteRapidlyLabel({ id: data.id }).then(({ data: { httpStatus } }) => {
                if (httpStatus === 200) {
                  this.lists.splice(index, 1)
                }
              })
            }
          })
          break
        default:
          break
      }
    }
  }
}
</script>
<style lang="less" scoped>
.btn_deal{
  color: #652791;
  cursor: pointer;
  display: inline-block;
}
.btn_deal+.btn_deal {
  margin-left: 12px;
}
.el-table {
  margin-bottom: 20px;
}

</style>
