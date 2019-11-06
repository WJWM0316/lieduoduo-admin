<template>
  <aside id="page-aside">
    <section class="section">
      <div class="AsideContent">
        <div class="logo">
          <img src="../../assets/lieduoduo.png" class="avatar" />
        </div>
        <ul class="itemList">
          <li
            v-for="(item, index) in itemList"
            :key="index"
            class="item"
            :class="{'slide-down': item.children.length, 'active': item.isShow }"
            @click.stop="topath('up', '', index, item)"
          >
            <div class="path" :class="{'pathactive': item.isShow}">
              <i
                style="margin-right: 16px;"
                class="icon iconfont icongongneng"
                :class="oneFlag===item.flag?'iconold':'iconNew'"
              ></i>
              <span>{{item.title}}</span>
              <i class="el-icon-arrow-up pathArrow" v-show="item.children.length"></i>
            </div>

            <!--  :class="{'pathactive': page.path === onePath }" -->
            <ul v-if="item.children.length">
              <li
                v-for="(page,index1) in item.children"
                :key="index1"
                class="children"
                @click.stop="topath('down', index, index1, page)"
              >
                <div class="verify" :class="{'pathactive': page.isShow }">
                  <span>{{page.title}}</span>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </section>
  </aside>
</template>
<script>
import Vue from 'vue'
import Component from 'vue-class-component'
// import { routes } from '@/router/routes'
// import { admin_menu } from 'API/common'
import routelist from './route.json'

@Component({
  name: 'page-asise',
  watch: {
    $route: {
      handler (route) {
        this.getMenu()
        this.init()
        let arr = route.path.split('/')
        this.oneFlag = arr[1]
      },
      immediate: true
    }
  },
  props: {}
})
export default class PageAside extends Vue {
  routes = null;
  isActive = 0;
  onePath = '/index'; // 当前一级路由
  oneFlag = 'index'; // 默认选中第一个
  SecondPath = ''; // 当前二级路由
  index = '';
  index1 = '';
  AdminShow = 0;
  itemList = [];
  tabSwitch () {
    this.isCLick = !this.isCLick
  }
  mounted () {
    this.AdminShow = sessionStorage.getItem('AdminShow')
  }
  getMenu () {
    if (this.$route.path !== '/login' && this.$route.path !== '/') {
      let itemList = JSON.parse(sessionStorage.getItem('itemList'))
      if (itemList !== null) {
        this.itemList = JSON.parse(sessionStorage.getItem('itemList'))
      } else {
        // admin_menu().then(res => {
        //   this.itemList = res.data.data;
        //   sessionStorage.setItem("itemList", JSON.stringify(res.data.data));
        // });
        this.itemList = routelist
        sessionStorage.setItem('itemList', JSON.stringify(routelist))
      }
    } else {
    }
  }
  topath (type, pIndex, cIndex, item) {
    let arr = item.flag.split('/')
    this.oneFlag = arr[0]
    if (type === 'up') {
      this.itemList.map(field => {
        field.isShow = false
        if (field.path === item.path) field.isShow = true
      })
    } else {
      this.itemList[pIndex].children.map(
        (field, i) => (field.isShow = i === cIndex)
      )
    }
    if (item.path === '/') {
      this.itemList.map((field, i) => {
        field.isShow = i === cIndex
      })
    } else {
      this.$router.push({ name: item.name })
    }
  }
  init () {
    let path = this.$route.path
    // let obj = {}
    this.itemList.map((uRoute, uIndex, uArray) => {
      if (Reflect.get(uRoute, 'path') === path) {
        uRoute.isShow = true
      } else {
        uRoute.isShow = false
        uRoute.children.map(cRoute => {
          if (cRoute.path === path) {
            cRoute.isShow = true
            uArray.map(
              field =>
                (field.isShow = field.flag === cRoute.flag)
            )
          } else {
            cRoute.isShow = false
          }
        })
      }
    })
  }
  judge (adminGrade) {
    // console.log("+adminGrade", +adminGrade);
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
</script>
<style scoped lang="less">
@import "./index.less";
</style>
