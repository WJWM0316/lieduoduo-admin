import { getUserInfo } from 'API/cacheService'
export default {
  // 用户信息
  userinfo: getUserInfo() || {}
}
