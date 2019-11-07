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
<style lang="less" scoped>
#app .app-container {
  margin-left: 222px;
  padding-left: 0px;
  padding-right: 22px;
}
</style>
