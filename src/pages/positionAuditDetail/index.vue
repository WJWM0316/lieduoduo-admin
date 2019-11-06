<template>
  <!--审核页面-->
  <div class="checkPage">
    <!--公司认证信息-->
    <div class="commont companyInfo">
      <!--头部-->
      <div class="header">
        <div class="left">
          <span class="title">职位信息</span>
          <span class="status" v-show="positionData.status === 2">
            <i class="el-icon-warning" style="color: #E6A23C;"></i> 待审核
          </span>
          <span class="status" v-show="positionData.status === 3">
            <i class="el-icon-warning" style="color: #E6A23C;"></i> 退回重审
          </span>
          <span class="status" v-show="positionData.status === 1">
            <i class="el-icon-success" style="color: #67C23A;"></i> 通过
          </span>
          <span class="status" v-show="positionData.status === 4">
            <i class="el-icon-error" style="color: #F56C6C;"></i> 未通过
          </span>
        </div>
        <div class="editBox">
          <div v-if="AdminShow==0||AdminShow==1||AdminShow==2" style="display:inline-block;margin-right:10px;">
            <el-button
              class="inquire"
              @click="Review(positionData.id)"
              v-if="positionData.status ===2 || positionData.status ===3"
            >审核</el-button>
            <el-button type="info" disabled v-else>审核</el-button>
          </div>

          <el-button class="inquire" @click.stop="toPostPosition('edit')">编辑</el-button>
        </div>
      </div>
      <!--内容-->
      <div class="content">
        <div class="title">基本信息</div>

        <div class="item">
          <span class="lable">职位名称：</span>
          {{positionData.positionName}}
        </div>
        <div class="item">
          <span class="lable">职位类别：</span>
          {{positionData.typeName}}
        </div>
        <div class="item">
          <span class="lable">工作地点：</span>
          {{positionData.address}}{{positionData.doorplate}}
        </div>
        <div class="item">
          <span class="lable">团队亮点：</span>

          <span v-for="(item,index) in positionData.lightspotInfo" :key="index">{{item}}</span>
        </div>
        <div class="title">其他信息</div>

        <div class="item">
          <span class="lable">薪资范围：</span>
          {{positionData.emolumentMin}}k-{{positionData.emolumentMax}}k × {{positionData.annualSalaryDesc}}
        </div>
        <div class="item">
          <span class="lable">经验要求：</span>
          {{positionData.workExperienceName}}
        </div>
        <div class="item">
          <span class="lable">最低学历：</span>
          {{positionData.educationName}}
        </div>
        <div class="item">
          <span class="lable">技能要求：</span>
          <span v-for="(item,index) in positionData.skillsLabel" :key="index">{{item.name}}{{index === positionData.skillsLabel.length - 1 ? '' : '、'}}</span>
        </div>

        <div class="item">
          <span class="lable">职位描述：</span>
        </div>
        <pre class="describe"> {{positionData.describe}} </pre>
      </div>
    </div>
    <!--审核蒙层-->
    <el-dialog title="审核" :visible.sync="isCheck">
      <el-form :model="form">
        <el-form-item label="审核结果" label-width="100px">
          <el-select v-model="form.result" placeholder="请选择审核结果">
            <el-option label="通过" value="pass"></el-option>
            <el-option label="退回" value="unpass"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.stop="isCheck = false">取 消</el-button>
        <el-button type="primary" @click.stop="setResult">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import { getPositionApi, auditPositionApi } from 'API/position'

@Component({
  name: 'checkPage'
})
export default class checkPage extends Vue {
  AdminShow = 0;
  companyInfo = '';
  personalInfo = '';
  nowImg = '';
  isCheck = false; // 审核蒙层
  checkId = '';
  form = {
    result: ''
  };
  positionData = {};
  /* 点击审核按钮 */
  Review (id) {
    this.isCheck = true
    this.checkId = id
  }
  showImg (imgUrl) {
    this.nowImg = imgUrl
  }
  hiddenMask () {
    this.nowImg = ''
  }
  toPostPosition (type) {
    let query = {}
    if (type === 'add') {
    } else {
      let id = this.$route.query.id
      query.id = id
    }
    this.$router.push({
      path: '/positionManage/positionPost',
      query: query
    })
  }
  /* 设置审核结果 */
  setResult () {
    auditPositionApi({ id: this.checkId, action: this.form.result })
      .then(res => {
        this.$message.success('成功')
        this.isCheck = false
        this.getPosition()
      })
      .catch(err => {
        this.$message.success(err.msg)
      })
  }
  created () {
    this.AdminShow = +sessionStorage.getItem('AdminShow')
    this.getPosition()
  }

  getPosition () {
    const { id } = this.$route.query
    getPositionApi({
      id: id
    }).then(res => {
      this.positionData = res.data.data
    })
  }
}
</script>

<style lang="less" scoped="scoped">
.checkPage {
  margin-left: 200px;
  padding: 22px 22px 22px 22px;
  position: relative;
}
.describe {
  display: inline-block;
  text-align: left;
  width: 100%;

  white-space: pre-wrap;
  white-space: -moz-pre-wrap;
  white-space: -pre-wrap;
  white-space: -o-pre-wrap;
  word-wrap: break-word;
}
.mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    height: 90%;
  }
}
.commont {
  width: 100%;
  .header {
    background-color: #f4f4f4;
    border-radius: 4px;
    padding: 10px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .left {
      .status {
        margin-left: 10px;
      }
    }
  }
  .content {
    padding: 10px;
    box-sizing: border-box;
    border: 1px solid #f4f4f4;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    .title {
      line-height: 50px;
      font-size: 20px;
      font-weight: 700;
    }
    .item {
      line-height: 30px;
      .lable {
        margin-right: 10px;
        color: #909399;
      }
    }
    .imgBox {
      display: inline-block;
      margin-right: 20px;
      position: relative;
      img {
        width: 200px;
        height: 150px;
        background-color: #bcbcbc;
        object-fit: cover;
        vertical-align: middle;
      }
      i {
        cursor: pointer;
        color: #ffffff;
        font-size: 20px;
        position: absolute;
        bottom: 10px;
        right: 10px;
      }
    }
  }
}
.inquire {
  background-color: #652791;
  color: #ffffff;
  border-radius: 4px;
}
</style>
