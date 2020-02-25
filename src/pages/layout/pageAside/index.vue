<template>
  <div class="app-aside">
    <div class="logo">
      <img src="../../../assets/lieduoduo.png" class="avatar" />
    </div>
    <el-menu
      :default-active="currentRoute"
      background-color="#3e294d"
      text-color="#fff"
      :router="true"
      active-text-color="#ffd04b"
      class="el-menu-vertical-demo">
      <template v-for="item in itemList">
        <template v-if="item.children && item.children.length">
          <el-submenu :index="item.path" :key="item.path">
            <template slot="title">
              <i :class="item.icon"></i>
              <span>{{item.title}}</span>
            </template>
            <template v-for="child in item.children">
              <el-menu-item :index="child.path" :key="child.path">{{child.title}}</el-menu-item>
            </template>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item :index="item.path"  :key="item.path">
            <i :class="item.icon"></i>
            <span slot="title">{{item.title}}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>
<script>
import routelist from './route.json'

export default {
  data () {
    return {
      routes: null,
      AdminShow: 0
    }
  },
  computed: {
    itemList () {
      // return this.$store.state.common.menuList || []
      return routelist
    },
    currentRoute () {
      return this.$route.path
    }
  },
  mounted () {
    this.AdminShow = sessionStorage.getItem('AdminShow')
  },
  methods: {
    judge (adminGrade) {
      if (/(0|1|2)/.test(+adminGrade)) {
      // console.log("显示简历库");
        this.$set(this.itemList, 5, {
          path: '/resumeStore',
          name: '简历库',
          isShow: true,
          children: []
        })
      } else {
      // console.log("不显示简历库");
        this.$set(this.itemList, 5, {
          path: '/resumeStore',
          name: '简历库',
          isShow: false,
          children: []
        })
      }
    }
  }
}
</script>
<style scoped lang="less">
@import "./index.less";
</style>
