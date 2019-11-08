<template>
  <div id="app">
    <page-aside/>
    <page-header/>
    <router-view class="app-container"></router-view>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import PageAside from './pageAside/index.vue'
import PageHeader from './pageHeader/index.vue'
@Component({
  name: 'App',
  components: {
    PageAside,
    PageHeader
  }
})
export default class App extends Vue {
  showResetPsw = false;
  mounted () {
    // if(sessionStorage.getItem(''))
  }
}
</script>
<style lang="less">
#app .app-container {
  margin-left: 222px;
  padding-left: 0px;
  padding-right: 22px;
}
/** 抽出头部样式  */
.app-title {
  padding: 10px 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .title {
    display: flex;
    align-items: center;
    position: relative;
    font-size: 15px;
    &::before {
      background: #ffe266;
      content: "";
      display: inline-block;
      height: 100%;
      height: 16px;
      margin-right: 10px;
      width: 6px;
    }
  }
  .btn-group-wrapper {
    margin-left: auto
  }
}
</style>
