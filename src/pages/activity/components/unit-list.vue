<template>
  <div class="content-list">
    <!-- ID -->
    <div class="list-index">{{item.typeId}}</div>

    <!-- Details  Company -->
    <template v-if="item.companInfo && tab.type === 'company'">
      <!-- Image -->
      <div class="list-image">
        <div class="image-wrapper">
          <img :src="item.companInfo.logo" alt="">
        </div>
      </div>
      <div class="list-info">
        <p>{{item.companInfo.companyShortname}}</p>
        <p>{{item.companInfo.companyName}}</p>
      </div>
    </template>
    <!-- Details  Recruiter -->
    <template v-if="item.recruiterInfo && tab.type === 'recruiter'">
      <!-- Image -->
      <div class="list-image">
        <div class="image-wrapper">
          <img :src="item.recruiterInfo.avatar" alt="">
        </div>
      </div>
      <div class="list-info" >
        <p>{{item.recruiterInfo.realname}}</p>
        <p><span>{{item.recruiterInfo.companyShortname}}</span> <span>{{item.recruiterInfo.position}}</span></p>
      </div>
    </template>
    <!-- Details  Position -->
    <template v-if="item.positionInfo && tab.type === 'position'">
      <!-- Image -->
      <div class="list-image">
        <div class="image-wrapper">
          <img :src="item.positionInfo.logo" alt="">
        </div>
      </div>
      <div class="list-info">
        <p><span>{{item.positionInfo.positionName}}</span> <span>{{item.positionInfo.emolumentMin}}K-{{item.positionInfo.emolumentMax}}K</span></p>
        <p>{{item.positionInfo.companyName}}</p>
      </div>
    </template>
    <!-- Image Count -->
    <div class="list-item list-image-count">
      <div>图片</div>
      <div @click="handleClick('image')" class="count-text"><span>{{item.imageCount || '添加'}}</span></div>
    </div>
    <!-- Text Count -->
    <div class="list-item list-text-count">
      <div>文字</div>
      <div @click="handleClick('text')" class="count-text"><span>{{item.textCount || '编辑'}}</span></div>
    </div>
    <!-- Position Count -->
    <div class="list-item list-position-count" v-if="tab.type !== 'position'">
      <div>职位</div>
      <div @click="handleClick('position')" class="count-text"><span>{{item.positionCount || '选择'}}</span></div>
    </div>
    <!-- Weight -->
    <div class="list-item list-weight">
      <div>权重</div>
      <div @click="handleSet('weight')" class="count-text"><span>{{item.sort || '设置'}}</span></div>
    </div>
    <!-- Status -->
    <div class="list-item list-status">
      <div>状态</div>
      <div class="count-text">
        <el-switch
          v-model="item.status"
          @change="handleSet('status')"
          active-color="#13ce66"
          inactive-color="#ff4949"
          :active-value="1"
          :inactive-value="2">
        </el-switch>
        <!-- <span>{{item.status === 1 ? '已上架' : '已下架'}}</span> -->
      </div>
    </div>
    <!-- Delete -->
    <div class="list-operate">
      <el-button type="danger" @click="handleRemove">删除</el-button>
    </div>
  </div>
</template>
<script>
import { deleteUnitTabDetails, setUnitTabDetails } from 'API/activity'
export default {
  props: {
    tab: {
      type: Object,
      default: () => ({})
    },
    item: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {

    }
  },
  methods: {
    handleClick (type) {
      this.$emit('list-click', type, this.item)
    },
    handleSet (type) {
      const { id, status } = this.item
      if (type === 'weight') {
        this.$prompt('调整权重', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^[0-9]+$/,
          inputValue: this.item.sort || '',
          inputErrorMessage: '格式不正确, 请输入数字'
        }).then(({ value }) => {
          setUnitTabDetails({ id, sort: value }).then(({ data }) => {
            if (data.httpStatus === 200) {
              this.$message.success('修改成功！')
              this.item.sort = value
            }
          })
        })
      } else {
        this.item.status = status === 1 ? 2 : 1
        this.$confirm(this.item.status === 1 ? '下架后将不在活动页展示，是否继续?' : '是否确定重新上架?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let setStatus = this.item.status === 1 ? 2 : 1
          setUnitTabDetails({ id: id, status: setStatus }).then(({ data }) => {
            if (data.httpStatus === 200) {
              this.$message.success('修改成功！')
              this.item.status = setStatus
            }
          })
        })
      }
    },
    handleRemove () {
      this.$confirm('删除将丢失所有内容, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteUnitTabDetails({ id: this.item.id }).then(({ data }) => {
          if (data.httpStatus === 200) {
            this.$message.success('删除成功！')
            this.$emit('list-change')
          }
        })
      })
    }
  }
}
</script>
<style lang="less" scoped>
.content-list {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border: 1px solid #eee;
  & > div {
    margin: 0 4px;
  }
  margin-bottom: 12px;
}
.list-index {
  width: 48px;
}
.list-info {
  width: 400px;
  span, p {
    overflow: hidden;
    white-space:nowrap;
    text-overflow: ellipsis;
  }
  p {
    span {
      max-width: 180px;
      display: inline-block;
      vertical-align: middle;
    }
    span+span {
      padding-left: 12px;
    }
  }
  p + p {
    margin-top: 8px;
  }
}
.list-item {
  min-width: 50px;
}

.count-text {
  cursor: pointer;
  color: #5E2B8C;
}
.image-wrapper {
  width: 80px;
  height: 80px;
  border: 1px solid #eee;
  border-radius: 4px;
  overflow: hidden;
  text-align: center;
  img {
    max-width: 100%;
  }
}
</style>
