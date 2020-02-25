<template>
  <el-dialog
    title="文字"
    width="500px"
    @close="handleClose"
    :visible="dialogStatus">
    <template v-for="(text, index) in textList">
      <div class="text-warpper" :key="text.key">
        <el-input  v-model="text.value"  placeholder="自定义文本"/>
        <template v-if="index > 0">
          <el-button type="danger" @click="handleRemove(text, index)" icon="el-icon-delete-solid"></el-button>
        </template>
        <template v-else>
          <el-button type="primary" @click="handleText" icon="el-icon-plus"></el-button>
        </template>
      </div>
    </template>
    <template slot="footer">
      <el-button type="primary" :loading="btnLoading" @click="handleSave">保存</el-button>
      <el-button @click="handleClose">取消</el-button>
    </template>
  </el-dialog>
</template>
<script>
import { getUnitTabTexts, setUnitTabTexts } from 'API/activity'
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
      btnLoading: false,
      textList: [{
        key: 1,
        value: ''
      }]
    }
  },
  methods: {
    getTexts () {
      getUnitTabTexts({ id: this.current.id }).then(({ data }) => {
        const texts = data.data || []
        if (texts.length) {
          this.textList = texts.map((val, index) => {
            return {
              key: index,
              value: val
            }
          })
        }
      })
    },
    handleSave () {
      const listsText = this.textList.filter(val => val.value).map(val => val.value).join(',')
      if (!listsText) {
        this.$message.warning('请填写至少一项！')
        return
      }
      this.btnLoading = true
      setUnitTabTexts({ id: this.current.id, text: listsText }).then(({ data }) => {
        this.btnLoading = false
        if (data.httpStatus === 200) {
          this.$message.success('保存成功！')
          this.$emit('change')
          this.handleClose()
        }
      }).catch(() => {
        this.btnLoading = false
      })
    },
    handleText () {
      this.textList.push({
        key: Date.now(),
        value: ''
      })
    },
    handleRemove (item, index) {
      this.textList.splice(index, 1)
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
        this.getTexts()
      }
    }
  }
}
</script>
<style lang="less" scoped>
.text-warpper {
  display: flex;
  align-items: center;
  text-align: center;
  margin-bottom: 8px;
  .el-input {
    width: 324px;
    margin-right: 8px;
  }
}
</style>
