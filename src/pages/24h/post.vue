<style lang="less" scoped>
#H24_post{
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
  <div id="H24_post" class="H24">
    <el-form ref="form" :model="form" label-width="140px" label-suffix="：">
      <el-form-item label="批量添加职位ID" v-if="$route.name !== 'h24_edit'">
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
      <!-- :disabled="form.status === 1 && $route.name === 'h24_edit'" -->
      <el-form-item label="截止时间">
        <el-date-picker
          v-model="form.end_time"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          style="width: 400px;"
          placeholder="选择下架日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="服务席位数量">
        <el-input v-model="form.seats_num" style="width: 400px;" :disabled="form.status === 1 && $route.name === 'h24_edit'"></el-input>
      </el-form-item>
      <el-form-item label="状态" v-if="$route.name === 'h24_edit'">
        <!-- <el-radio v-model="form.is_online" :label="1">上架</el-radio>
        <el-radio v-model="form.is_online" :label="2">下架</el-radio> -->
        <el-radio v-model="form.is_online" :label="3">立即截止</el-radio>
      </el-form-item>
      <el-form-item label="权重排序值" v-if="$route.name === 'h24_edit'">
        <el-input v-model="form.sort" style="width: 400px;"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">确定</el-button>
        <el-button @click="reset" v-if="$route.name === 'h24_edit'">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import {
  addRapidlySurfaceApi,
  editRapidlySurfaceApi,
  getRapidlySurfaceApi
} from 'API/24h'
@Component({
  name: 'H24_POST'
})
export default class H24_POST extends Vue {
  form = {
    seats_num: '',
    start_time: '',
    end_time: '',
    status: '',
    positions: ''
  }
  onSubmit () {
    let params = {}
    // params.start_time = Date.parse(this.form.start_time) / 1000
    // params.end_time = Date.parse(this.form.end_time) / 1000
    params.start_time = this.form.start_time
    params.end_time = this.form.end_time
    params.seats_num = this.form.seats_num
    params.positions = this.form.positions
    // eslint-disable-next-line prefer-promise-reject-errors
    let startTime = new Promise((resolve, reject) => !this.form.start_time ? reject('请选择开始时间') : resolve())
    // eslint-disable-next-line prefer-promise-reject-errors
    let endTime = new Promise((resolve, reject) => !this.form.end_time ? reject('请选择结束时间') : resolve())
    // eslint-disable-next-line prefer-promise-reject-errors
    let positions = new Promise((resolve, reject) => !this.form.positions ? reject('请添加职位') : resolve())
    // eslint-disable-next-line prefer-promise-reject-errors
    let seats_num = new Promise((resolve, reject) => !this.form.seats_num ? reject('请添加席位数量') : resolve())
    // eslint-disable-next-line prefer-promise-reject-errors
    let repeatPosition = new Promise((resolve, reject) => this.hasDuplicates(params.positions) ? reject('请不要重复添加职位') : resolve())
    let api = this.$route.name === 'h24_edit' ? 'editAction' : 'addAction'
    if (this.form.id) {
      params = Object.assign(params, { id: this.form.id })
    }
    if (Reflect.has(this.form, 'is_online')) {
      params = Object.assign(params, { is_online: this.form.is_online })
    }
    if (Reflect.has(this.form, 'sort')) {
      params = Object.assign(params, { sort: this.form.sort })
    }
    Promise.all([repeatPosition, positions, startTime, endTime, seats_num]).then(() => this[api](params)).catch(err => this.$message.error(err))
  }
  addAction (params) {
    addRapidlySurfaceApi(params).then(() => this.$router.push({ name: '24h' }))
  }
  editAction (params) {
    editRapidlySurfaceApi(params).then(() => this.$router.push({ name: '24h' }))
  }
  getRapidlySurface () {
    getRapidlySurfaceApi({ id: this.$route.query.id }).then(res => {
      let infos = res.data.data
      let form = {
        seats_num: infos.seatsNum,
        start_time: infos.startTime,
        end_time: infos.endTime,
        positions: infos.positionId,
        id: infos.id,
        is_online: infos.isOnline,
        sort: infos.sort,
        status: infos.status
      }
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
    if (this.$route.name === 'h24_edit') this.getRapidlySurface()
  }
}
</script>
