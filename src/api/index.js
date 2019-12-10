import axios from 'axios'
import { Loading, Message } from 'element-ui'
import Store from '@/store/store'
import router from '@/router/index'
// const Version=107;
import { getAccessToken, removeAccessToken } from './cacheService'
let loadingInstance = null

// 开发状态
export const API_ROOT = process.env.VUE_APP_API

// 请求的跟地址
export const upload_api = `${API_ROOT}/attaches`
axios.defaults.baseURL = API_ROOT
// 请求拦截器
axios.interceptors.request.use(
  config => {
    if (window.document.location.pathname !== '/login') {
      if (!getAccessToken()) {
        router.push({ name: 'login' })
        if (loadingInstance) loadingInstance.close()
        return
      }
    }
    //  loadingInstance = Loading.service({})
    config.headers.common['Authorization-Admin'] = getAccessToken()
    return config
  },
  error => {
    return Promise.error(error)
  }
)
// http response 拦截器
axios.interceptors.response.use(
  res => {
    if (loadingInstance) loadingInstance.close()
    return res
  },
  err => {
    // 登陆过期或者未登录
    if (err.response.data.httpStatus === 401) {
      Store.commit('removeMenus')
      Store.commit('REMOVE_USERINFO')
      router.push({ name: 'login' })
      removeAccessToken()
      // Message.error(`登录状态已过期,请重新登录`);
    }
    if (loadingInstance) loadingInstance.close()
    return Promise.reject(err.response)
  }
)

export const request = ({
  type = 'post',
  url,
  data = {},
  globalLoading,
  globalTips = true,
  config = {}
} = {}) => {
  if (globalLoading) {
    loadingInstance = Loading.service({})
  }
  return axios[type](url, type === 'get' ? { params: data } : data).catch(
    err => {
      /* 通用的错误捕获可以在这里操作 */
      // Message.error(`啊，好像出错了，数据跑到银河系外面去了。`)
      if (globalTips) Message.error((err.data && err.data.msg) || '请求失败')
      return Promise.reject(err)
    }
  )
}
