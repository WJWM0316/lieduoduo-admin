<template>
  <div id="app">
    <page-aside/>
    <page-header/>
    <!--<router-view/>-->
    <router-view></router-view>
    <!-- <keep-alive>
      <router-view v-if="$route.meta.keepAlive">
      </router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive">
    </router-view> -->
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import PageAside from 'COMPONENTS/pageAside/index.vue'
import PageHeader from 'COMPONENTS/pageHeader/index.vue'
// import { Loading } from 'element-ui'
@Component({
  name: 'App',
  components: {
    PageAside,
    PageHeader
  },
  watch: {
    isAjax: {
      handler (res) {
        this.showAside(res)
      }
    }
  }
})
export default class App extends Vue {
  loadingInstance = null;
  showResetPsw = false;
  isAjax = false;
  showAside (res) {
    this.isAjax = res
  }
  changeStatus (e) {
    console.log(e)
  }
  mounted () {
    // if(sessionStorage.getItem(''))
  }
}
</script>

<style lang="less">
@import "./App.less";
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
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
.el-table {
  .cell {
    text-align: left;
  }
}
</style>
