<template>
  <div class="date-filter">
     <el-date-picker
      v-model="times.startTime"
      :default-value="startTime"
      type="datetime"
      value-format="yyyy-MM-dd HH:mm:ss"
      :placeholder="placeholder.start"
      @change="(val) => handleChange('startTime', val)"
      :picker-options="startDateOpt">
    </el-date-picker>
    <span class="data-separator">-</span>
    <el-date-picker
      v-model="times.endTime"
      :default-value="endTime"
      type="datetime"
      value-format="yyyy-MM-dd HH:mm:ss"
      :placeholder="placeholder.end"
      @change="(val) => handleChange('endTime', val)"
      :picker-options="endDateOpt">
    </el-date-picker>
  </div>
</template>
<script>
export default {
  props: {
    startTime: {
      type: [String, Date],
      default: ''
    },
    endTime: [String, Date],
    placeholder: {
      type: Object,
      default: () => ({ start: '开始时间', end: '结束时间' })
    },
    queryName: {
      type: Object,
      default: () => ({ start: 'start_time', end: 'end_time' })
    }
  },
  data () {
    return {
      times: {
        startTime: '',
        endTime: ''
      },
      startDateOpt: {
        disabledDate: (time) => {
          if (!this.endTime) return false
          return time.getTime() > new Date(this.endTime).getTime()
        }
      },
      endDateOpt: {
        disabledDate: (time) => {
          if (!this.startTime) return false
          return time.getTime() < new Date(this.startTime).getTime()
        }
      }
    }
  },
  created () {
    const { query } = this.$route
    this.times.startTime = query[this.queryName.start] || ''
    this.times.endTime = query[this.queryName.end] || ''
  },
  methods: {
    handleChange (type, value) {
      this.$emit(`update:${type}`, value)
    },
    clear () {
      this.times.startTime = ''
      this.times.endTime = ''
    }
  }
}
</script>
<style lang="less" scoped>
.date-filter {
  display: inline-block;
  .data-separator {
    padding: 0 4px;
    color: #666;
  }
}
</style>
