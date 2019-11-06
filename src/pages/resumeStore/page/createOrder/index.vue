<!--  -->
<template>
  <div class="OrderDetail">
    <div class="TabView">
      <div class="tabList">
        <div
          class="tabItem"
          v-for="(item,index) in itemList"
          :key="index"
          @click.stop="ClickTab(index,item.path)"
          :class="isCreate===index?'active':''"
        >
          <span>{{item}}</span>
        </div>
      </div>
      <div class="createOrder">
        <p class="title">新建推荐单</p>
        <div class="CreateContent">
          <el-form :model="form" :rules="rules" class="createForm">
            <el-form-item label="职位ID" prop="positionId" style="width: 380px;" class="formItem">
              <el-input
                :autofocus="isFocus"
                v-model.number="form.positionId"
                placeholder="填写职位ID"
                :maxlength="11"
                @blur.stop="checkId(form.positionId)"
              ></el-input>
            </el-form-item>
            <div class="positionMsg">
              <div class="msg">
                <span>职位名称:</span>
                <span
                  v-if="isShowmsg"
                >{{postionObj.positionName}}| {{postionObj.city}} | {{postionObj.emolumentMin}}K-{{postionObj.emolumentMax}}K</span>
              </div>
              <div class="msg">
                <span>公司名称:</span>
                <span v-if="isShowmsg">{{postionObj.companyInfo.companyName}}</span>
              </div>
              <div class="msg">
                <span>发布者:</span>
                <span v-if="isShowmsg">{{postionObj.recruiterInfo.name}}</span>
              </div>
              <el-form-item label="简历编号:" prop="vkeys" class="formItem">
                <el-input
                  :autosize="{ minRows:3, maxRows: 10}"
                  type="textarea"
                  show-word-limit
                  placeholder="请输入简历编号，多个编号用英文逗号区分"
                  v-model="form.vkeys"
                  size="mini"
                  :rows="5"
                  class="textarea"
                ></el-input>
              </el-form-item>
            </div>
          </el-form>
          <div class="opeating">
            <el-button type="primary" @click.stop="onSubmit('up')">提交</el-button>
            <el-button type="warning" @click.stop="dialogVisible=true">取消</el-button>
          </div>
        </div>
      </div>
    </div>
    <el-dialog title="确认取消新建推荐单" :visible.sync="dialogVisible" width="30%" center>
      <span>确认取消后将不保留当前数据</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button @click="$router.go(-1)" class="inquire">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 推荐单 -->
    <div class="PopForm" @click.stop="isShowForm=false" v-if="isShowForm">
      <div class="allRusule">
        <p class="title">提交结果</p>
        <div class="resumeNums">
          <span v-if="resultmsg.succeedNum">成功:{{resultmsg.succeedNum}}份</span>
          <span v-if="resultmsg.failNum">失败:{{resultmsg.failNum}}份</span>
        </div>
        <div class="resultList">
          <el-table height="400" max-height="400" :data="tableData">
            <el-table-column prop="vkey" label="简历编号"></el-table-column>
            <el-table-column prop="name" label="求职者"></el-table-column>
            <el-table-column prop="isSuccess" label="提交结果">
              <template slot-scope="scope">
                <i class="el-icon-circle-close" v-if="scope.row.isSuccess===0"></i>
                <i class="el-icon-circle-check" style="color:red;" v-if="scope.row.isSuccess===1"></i>
              </template>
            </el-table-column>
            <el-table-column prop="reason" label="原因说明">
              <template slot-scope="scope">
                <p style="color:#000;font-size:14px;" v-if="scope.row.isSuccess===1">推荐成功</p>
                <p style="color:#000;font-size:14px;" v-if="scope.row.isSuccess===0">{{scope.row.reason}}</p>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="okBtn" style="margin-top:20px;" v-if="sumbitRusult">
          <el-button @click.stop="goPath">好的</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import { createOrder, searchId } from 'API/resumeStore'
@Component({
  name: 'OrderDetail'
})
export default class OrderDetail extends Vue {
  isFocus = false;
  isCreate = 0;
  isShowForm = false;
  isShowmsg = false;
  form = {
    positionId: '',
    vkeys: ''
  };
  httpStatus = 0;
  postionObj = {
    positionName: '',
    city: '',
    emolumentMin: '',
    emolumentMax: '',
    companyInfo: {
      companyName: ''
    },
    recruiterInfo: {
      name: ''
    }
  };
  rules = {
    positionId: [
      { type: 'number', message: 'id必须为数字' },
      { type: 'number', trigger: 'blur', validator: this.verification_id }
    ]
  };
  sumbitRusult=false;
  resultmsg = {
    succeedNum: '',
    failNum: ''
  }; // 成功后的订单
  tableData = [];
  dialogVisible = false;
  itemList = ['新建推荐单'];
  goPath (e) {
    this.$router.push({
      path: '/resumeStore/recommendList/OrderDetail',
      query: {
        id: this.resultmsg.id
      }
    })
  }
  checkId (id) {
    // 6512
    searchId(id)
      .then(res => {
        this.postionObj = res.data.data
        this.isShowmsg = true
      })
      .catch(err => {
        this.httpStatus = err.data.httpStatus
        if (JSON.stringify(err.data.data) === '[]') {
          this.isShowmsg = false
        } else {
          this.postionObj = err.data.data
          this.isShowmsg = true
        }
      })
  }
  handleClose (done) {
    this.dialogVisible = false
  }
  onSubmit (status) {
    let reg = /^[a-zA-Z0-9,]+$/
    if (status === 'up') {
      if (this.form.positionId === '') return
      if (this.httpStatus === 400) return
      if (this.form.vkeys === '') {
        this.$message({
          message: '简历编号不可为空',
          type: 'warning'
        })
      } else if (!reg.test(this.form.vkeys)) {
        this.$message({
          message: '不可输除逗号以外的其他标点符号和特殊符号',
          type: 'warning'
        })
      } else {
        console.log('成功通过')
        createOrder(this.form.positionId, { vkeys: this.form.vkeys })
          .then(res => {
            this.$nextTick(() => {
              this.isShowForm = true
            })
            this.resultmsg = res.data.data.list
            this.tableData = res.data.data.result
            this.sumbitRusult = true
            // this.operating(this.nowResumeMsg.uid, { action: "删除", desc: "简历附件" });
            console.log(res)
          })
          .catch(err => {
            this.isShowForm = true
            if (err.data.data.list === null) {
              console.log('-----')
              this.$set(this.resultmsg, 'failNum', err.data.data.result.length)
              this.$set(this.resultmsg, 'succeedNum', 0)
              // this.resultmsg.failNum = res.data.data.result.length;
              console.log(this.resultmsg)
            }
            this.tableData = err.data.data.result
            console.log(this.tableData)
          })
      }
    } else {
    }
  }
  ClickTab (index) {
    let result = this.itemList[index].name.indexOf('详情') !== -1
    result ? (this.isCreate = 0) : (this.isCreate = 1)
  }
  checkFrom () {
    let { frompostion } = this.$route.query
    let obj = JSON.parse(this.$route.query.obj)
    if (frompostion) {
      this.form.positionId = obj.id
      this.postionObj = obj
      this.isShowmsg = true
    }
  }
  created () {
    this.checkFrom()
    if (this.$route.query.isCreate) {
      this.itemList.splice(this.Index(), 1)
    }
  }
  Index () {
    let indexOf = 0
    for (let i = 0; i < this.itemList.length; i++) {
      if (this.itemList[i].name.indexOf('详情') !== -1) {
        indexOf = i
      }
    }
    return indexOf
  }
}
</script>
<style lang='less' scoped>
@import "./index.less";
</style>
