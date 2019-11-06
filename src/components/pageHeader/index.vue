<template>
  <header id="page-header">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item v-if="haveParent" :to="{ path: `${parentPath}` }">{{parentName}}</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a>{{nowLinkName}}</a>
      </el-breadcrumb-item>
    </el-breadcrumb>
    <ul class="navigation">
      <li style="position: relative; cursor: pointer;" @click.stop="showExit">
        <img v-if="avar" :src="avar" class="avar">
        <span>欢迎登陆猎多多，{{userName}}</span>
        <i class="icon iconfont iconloeft_down" :class="{hide: !isShow, show: isShow}"></i>
        <span class="exit" @click.stop="toLogin" :class="{hideBox: !isShow, showBox: isShow}">退出登录</span>
      </li>
    </ul>
  </header>
</template>
<style lang="less">
#page-header {
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  background: #fff;
  text-align: right;
  font-size: 14px;
  box-shadow: 0px 2px 8px 0px rgba(29, 45, 53, 0.06);
  position: fixed;
  top: 0;
  left: 200px;
  right: 0;
  z-index: 201;
  .el-icon-bell {
    font-size: 18px;
  }
  section {
    position: fixed;
    height: 60px;
    left: 200px;
    right: 0;
  }
  .navigation {
    margin-right: 40px;
    li {
      color: #354048;
      display: inline-block;
      line-height: 60px;
      margin-left: 35px;
      .avar {
        margin-right: 5px;
      }
      .icon::before {
        cursor: pointer;
        color: #354048;
        transition: 0.5s ease;
      }
      .hide::before {
        display: inline-block;
        transform: rotateZ(-180deg);
      }
      .show::before {
        display: inline-block;
        transform: rotateZ(0deg);
      }
      .exit {
        cursor: pointer;
        position: absolute;
        bottom: -30px;
        right: 5px;
        background-color: #ffffff;
        line-height: 20px;
        padding: 10px;
        box-shadow: 1px 3px 10px 0px rgba(0, 0, 0, 0.3);
        transition: 0.5s ease;
        overflow: hidden;
        &:hover {
          color: #354048;
        }
      }
      .hideBox {
        padding: 0;
        height: 0;
      }
      .showBox {
        padding: 10px;
        height: 20px;
      }
    }
    img {
      width: 34px;
      height: 34px;
      background: rgba(0, 0, 0, 0.1);
      border-radius: 50%;
      display: inline-block;
      vertical-align: middle;
      cursor: pointer;
    }
  }
  .el-dropdown-link {
    i {
      font-size: 12px;
    }
  }
}
</style>
<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import { removeAccessToken } from 'API/cacheService'

@Component({
  watch: {
    $route: {
      handler (route) {
        this.avar = sessionStorage.getItem('avar')
        this.userName = sessionStorage.getItem('name')
        this.nowLinkName = route.meta.title
        if (route.meta.haveParent) {
          this.haveParent = true
          this.parentPath = route.meta.parentPath
          this.parentName = route.meta.parentName
        } else {
          this.haveParent = false
        }
      },
      immediate: true
    }
  }
})
export default class ComponentHeader extends Vue {
  nowLinkName = '';
  haveParent = false;
  parentPath = '';
  parentName = '';
  avar = '';
  userName = '';
  isShow = false;
  toLogin () {
    removeAccessToken()
    this.isShow = false
    sessionStorage.removeItem('isShowResumeHandle')
    this.$router.push({
      path: '/login'
    })
  }
  showExit () {
    this.isShow = !this.isShow
  }
}
</script>
