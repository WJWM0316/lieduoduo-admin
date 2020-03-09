<!--招聘官管理-->
<template>
  <div class="officerManage">
    <el-container class="container" style="border: 1px solid #eee">
      <el-header class="header" style="text-align: right; font-size: 15px">
        <div class="title">新建/编辑简历敏感词</div>
      </el-header>
      <el-main>
        <!--筛选-->
        <div class="selectionBox">
          <el-form ref="form" label-width="90px">
            <el-form-item label="敏感词名称" prop="name">
              <el-input v-model="name" placeholder="请输入敏感词名称" maxlength="20"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button @click="cancel">取消</el-button>
              <el-button type="primary" @click="onSubmit">确定</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import { AddSensitiveAPI, GetSensitiveinfoAPI, putSensitiveEditApi } from 'API/resumesensitiveWords'
@Component({
  name: 'officerManage'
})
export default class officerManage extends Vue {
  name = ''
  onSubmit () {
    if (this.$route.query.id) {
      let data = { id: this.$route.query.id, name: this.name }
      putSensitiveEditApi(data).then((res) => {
        this.$message({
          message: '编辑成功',
          type: 'success'
        })
        this.$router.go(-1)
      })
    } else {
      AddSensitiveAPI({ name: this.name }).then((res) => {
        this.$message({
          message: '恭喜你，创建成功',
          type: 'success'
        })
        this.$router.go(-1)
      })
    }
  }
  cancel () {
    this.$router.go(-1)
  }
  created () {
    if (this.$route.query.id) {
      let data = { id: this.$route.query.id }
      GetSensitiveinfoAPI(data).then((res) => {
        this.name = res.data.data.sensitiveWord
        this.id = res.data.data.id
      })
    }
  }
}
</script>

<style lang="less" scoped="scoped">
.officerManage{
  /*padding: 22px;*/
  .container{
    min-width: 1000px;
    margin: 22px;
    .header{
      display: flex;
      align-items: center;
      justify-content: space-between;
      .title{
        display: flex;
        align-items: center;
        position: relative;
        font-size: 15px;
        &::before{
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
      .creatBtn{
        font-size: 15px;
        padding: 12px 20px;
        background-color: #ffe266;
        border-radius: 4px;
      }
    }
  }
  .el-form{
    /* 筛选 */
    .inputSelect{
      float: left;
      margin-left: 10px;
      margin-bottom: 22px;
      width: 400px !important;
      background-color: #FFFFFF;
      .el-select{
        width: 120px;
        margin-top: -2px;
        border: none;
        box-sizing: border-box;
      }
    }
    .el-input{
      width: 200px;
    }
    &::after {
      content: '';
      display: block;
      height: 0;
      clear: both;
    }
  }
  .btn{
    .inquire{
      color: #FFFFFF;
      background-color: #652791;
    }
    span{
      white-space: nowrap;
      user-select:none;
      cursor: pointer;
      line-height: 12px;
      color: #652791;
    }
  }
  .btn-container{
    display: flex;
    align-items: center;
    justify-content: flex-start;
    .check{
      line-height: 48px;
      color: #652791;
      cursor: pointer;
    }
  }
}
.inquire{
  background-color: #652791;
  color: #FFFFFF;
  border-radius: 4px;
}
.qrCode {
  border-radius: 4px;
  color: #652791;
  position: absolute;
  top: -999px;
  left: -999px;
  z-index: 3;
  line-height: 60px;
  .phoneBg {
    display: block;
    position: absolute;
    top: 0;
    left: 5%;
    z-index: -1;
  }
}
.qrCode {
    text-align: center;
    width: 300px;
    height: 300px;
    /*background-color: #CCCCCC;*/
    transform: translateY(-100%) translateX(-50%);
    .Qr{
      width: 200px;
      height: 200px;
      margin-top: 30px;
    }
    .bg{
      width: 100%;
      height: 100%;
      max-width: 100%;
      max-height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      z-index: -1;
    }
    .txt{
      line-height: normal;
      color: #5C565D;
      margin-top: 5px;
    }
  }
</style>
