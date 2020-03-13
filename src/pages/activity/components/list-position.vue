<template>
  <el-dialog
    title="职位"
    @close="handleClose"
    width="550px"
    :visible="dialogStatus">
    <el-table height="350" :data="lists" border v-loading="getLoading">
      <el-table-column prop="id" label="职位ID" width="80"></el-table-column>
      <el-table-column prop="positionName" label="职位名称"></el-table-column>
      <el-table-column label="薪酬范围">
        <template slot-scope="{row}">
          {{row.emolumentMin}}K-{{row.emolumentMax}}K·{{row.annualSalary}}薪
        </template>
      </el-table-column>
      <el-table-column width="90">
        <template slot="header" slot-scope="scope">
          <el-button @click="handleAdd(scope)" type="success" size="mini" icon="el-icon-plus"></el-button>
        </template>
        <template slot-scope="{$index, row}">
          <el-button size="mini" type="danger" @click="handleRemove($index, row)">移除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>
<script>
import { getUnitPositions, setUnitPositions, setDeleteUnitPositions } from 'API/activity'
export default {
  props: {
    visible: Boolean,
    current: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      dialogStatus: false,
      getLoading: false,
      lists: []
    }
  },
  methods: {
    getPositions () {
      getUnitPositions({ id: this.current.id }).then(({ data }) => {
        this.lists = data.data || []
      })
    },
    handleAdd () {
      this.$prompt('职位ID', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPlaceholder: '批量添加多个职位，输入职位ID，请用英文,隔开'
        // inputPattern: /^[0-9]$/,
        // inputErrorMessage: '格式不正确, 请输入数字'
      }).then(({ value }) => {
        // http://localhost:8080/activity/unit/1/set/2
        setUnitPositions({ id: this.current.id, position_id: value }).then(({ data }) => {
          if (data.httpStatus === 200) {
            this.$message.success('添加成功！')
            this.getPositions()
          }
        })
      })
    },
    handleRemove (index, row) {
      let strIds = []
      this.lists.forEach(val => {
        if (row.id !== val.id) strIds.push(val.id)
      })
      setDeleteUnitPositions({
        id: row.id
        // id: this.current.id,
        // position_id: strIds.join(',')
      }).then(({ data }) => {
        this.$message.success('移除成功！')
        this.lists.splice(index, 1)
      })
    },
    handleClose () {
      this.dialogStatus = false
      this.$emit('update:visible', false)
    }
  },
  watch: {
    visible (value) {
      if (value) {
        this.dialogStatus = true
        this.getPositions()
      } else {
        this.lists = []
      }
    }
  }
}
</script>
