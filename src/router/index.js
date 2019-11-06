import Vue from 'vue'
import Router from 'vue-router'
import { routes } from './routes.js'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes,
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

router.beforeEach((to, from, next) => {
  if (from.name !== to.name) {
    window.scrollTo(0, 0)
  }
  if (to.path === '/check') {
    next('/check/companyCheck')
  } else {
    next(true)
  }
})

export default router
