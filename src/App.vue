<template>
  <router-view></router-view>
</template>

<style lang="less">
.messageBox {
  p {
    color: #000;
  }
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
@import './style/iconfont.less';
@import './style/reset.css';
@import './style/less/common.less';
@import './elementui/element.reset.less';

</style>
