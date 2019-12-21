import Vue from 'vue'
import Router from 'vue-router'
import Store from '@/store/store'
import { admin_menu, getUserInfoApi } from 'API/common'
import { getAccessToken, getUserInfo } from 'API/cacheService'
import Hours24 from './24hours'
import Check from './check'
import Common from './common'
import IndexCompany from './index-company'
import Interview from './interview'
import PositionManage from './position-manage'
import Recruiter from './recruiter'
import Resume from './resume'
import User from './user'
import Operation from './operation'

import Category from './category'
Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    ...Common,
    ...IndexCompany,
    ...Recruiter,
    ...Hours24,
    ...User,
    ...Category,
    ...Check,
    ...Interview,
    ...PositionManage,
    ...Resume,
    ...Operation
  ],
  // linkActiveClass:'pathactive',
  scrollBehavior (to, from, savedPosition) {
    if (to.hash) {
      return {
        selector: to.hash
      }
    } else {
      return savedPosition || { x: 0, y: 0 }
    }
  }
})

router.beforeEach(async (to, from, next) => {
  if (to.matched.some(record => record.meta.auth)) {
    // 判断该路由是否需要登录权限
    if (getAccessToken()) {
      const { common } = Store.state
      // 获取用户信息
      if (!getUserInfo()) {
        let { data } = await getUserInfoApi()
        await Store.dispatch('update_userinfo', { userinfo: data })
      }
      // 获取侧栏数据
      if (!sessionStorage.getItem('itemList')) {
        // 保存获取状态
        if (common.getMenuLoading) return
        Store.commit('setMenuLoading', true)
        admin_menu({}).then(({ data }) => {
          // 存放到vuex
          Store.commit('setMenuLoading', false)
          Store.commit('setMenuList', data.data || [])
        })
      }
      next()
    } else {
      next({
        path: '/login',
        query: { redirect: to.fullPath } // 将跳转的路由path作为参数，登录成功后跳转到该路由
      })
    }
  } else {
    // 如果已经登陆返回上一页或者
    if (to.path === '/login' && getAccessToken()) {
      next({
        path: from.path || '/index',
        query: {
          ...from.query,
          q: Date.now()
        }
      })
    }
    next()
  }
})

export default router
