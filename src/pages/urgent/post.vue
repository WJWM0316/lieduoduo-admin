<style lang="less" scoped>
#urgent_post{
  margin: 22px 22px 22px 222px;
  border: 1px solid rgb(238, 238, 238);
  text-align: left;
  padding-top: 22px;
  .tips{
    &:before{
      display: inline;
      content: '*';
      color: red;
    };
  }
}
</style>
<template>
  <div id="urgent_post">
    <el-form ref="form" :model="form" label-width="140px" label-suffix="：">
      <el-form-item label="批量添加职位ID" v-if="$route.name !== 'urgent_edit'">
        <div class="tips">添加多个职位，请用英文,隔开</div>
        <el-input type="textarea" v-model="form.positions" style="width: 400px;"></el-input>
      </el-form-item>
      <el-form-item label="上架时间">
        <el-date-picker
          v-model="form.start_time"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          style="width: 400px;"
          placeholder="选择上架日期">
        </el-date-picker>
      </el-form-item>
      <!-- canEditFormData -->
      <el-form-item label="截止时间">
        <el-date-picker
          v-model="form.end_time"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          style="width: 400px;"
          placeholder="选择下架日期">
        </el-date-picker>
      </el-form-item>
      <!-- <el-form-item label="状态" v-if="$route.name === 'urgent_edit'">
        <el-radio v-model="form.is_online" :label="1">上架</el-radio>
        <el-radio v-model="form.is_online" :label="2">下架</el-radio>
      </el-form-item> -->
      <el-form-item label="权重排序值" v-if="$route.name === 'urgent_edit'">
        <el-input v-model="form.sort" style="width: 400px;"></el-input>
        <!-- :disabled="canEditFormData" -->
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">确定</el-button>
        <el-button @click="reset" v-if="$route.name === 'urgent_edit'">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import {
  addUrgencyApi,
  editUrgencyApi,
  getUrgencyApi
} from 'API/urgent'
@Component({
  name: 'UrgentPost'
})
export default class Urgent extends Vue {
  canEditFormData = true
  form = {
    start_time: '',
    end_time: '',
    positions: ''
  }
  onSubmit () {
    let params = {}
    // params.start_time = Date.parse(this.form.start_time) / 1000
    // params.end_time = Date.parse(this.form.end_time) / 1000
    params.start_time = this.form.start_time
    params.end_time = this.form.end_time
    params.positions = this.form.positions
    // eslint-disable-next-line prefer-promise-reject-errors
    let startTime = new Promise((resolve, reject) => !this.form.start_time ? reject('请选择开始时间') : resolve())
    // eslint-disable-next-line prefer-promise-reject-errors
    let endTime = new Promise((resolve, reject) => !this.form.end_time ? reject('请选择结束时间') : resolve())
    // eslint-disable-next-line prefer-promise-reject-errors
    let positions = new Promise((resolve, reject) => !this.form.positions ? reject('请添加职位') : resolve())
    // eslint-disable-next-line prefer-promise-reject-errors
    let repeatPosition = new Promise((resolve, reject) => this.hasDuplicates(params.positions) ? reject('请不要重复添加职位') : resolve())
    let api = this.$route.name === 'urgent_edit' ? 'editAction' : 'addAction'
    if (this.form.id) {
      params = Object.assign(params, { id: this.form.id })
    }
    if (Reflect.has(this.form, 'is_online')) {
      params = Object.assign(params, { is_online: this.form.is_online })
    }
    if (Reflect.has(this.form, 'sort')) {
      params = Object.assign(params, { sort: this.form.sort })
    }
    Promise.all([repeatPosition, positions, startTime, endTime]).then(() => this[api](params)).catch(err => this.$message.error(err))
  }
  addAction (params) {
    addUrgencyApi(params).then(() => this.$router.push({ name: 'urgent' }))
  }
  editAction (params) {
    editUrgencyApi(params).then(() => this.$router.push({ name: 'urgent' }))
  }
  getUrgency () {
    getUrgencyApi({ id: this.$route.query.id }).then(res => {
      let infos = res.data.data
      let form = {
        start_time: infos.startTime,
        end_time: infos.endTime,
        positions: infos.positionId,
        id: infos.id,
        is_online: infos.isOnline,
        sort: infos.sort
      }
      this.canEditFormData = infos.isOnline === 1
      this.form = form
    })
  }
  reset () {
    this.$confirm('', '退出将不保存更改的内容, 是否继续?', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      center: true
    }).then(() => {
      this.$router.go(-1)
    }).catch(() => {})
  }
  hasDuplicates (str) {
    let arr = String(str).split(',')
    return arr.filter((e, i) => arr.lastIndexOf(e) !== i && i === arr.indexOf(e)).length > 0
  }
  created () {
    if (this.$route.name === 'urgent_edit') this.getUrgency()
    if (this.$route.name === 'urgent_post') this.canEditFormData = false
  }
}
</script>
