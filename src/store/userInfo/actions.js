import * as types from './mutations_types'
import { saveUserInfo, saveAccessToken } from 'API/cacheService'
export default {
  // 更新用户信息
  update_userinfo: ({ commit }, { userinfo }) => {
    return new Promise((resolve, reject) => {
      // 保存到 localStorage
      saveUserInfo(userinfo)
      // 保存token
      saveAccessToken(userinfo.adminToken)
      let { groupId, isAdmin, isGroupAdmin } = userinfo
      let isShowResumeHandle = userinfo.groupId === 3 || userinfo.groupId === 4 || (userinfo.groupId === 6 && !userinfo.isGroupAdmin)
      sessionStorage.setItem('isShowResumeHandle', !isShowResumeHandle)
      let AdminShow = judge(groupId, isAdmin, isGroupAdmin)
      let userInfo = Object.assign({}, userinfo, { AdminShow })
      sessionStorage.setItem('AdminShow', AdminShow)
      commit(types.UPDATE_USERINFO, {
        userInfo
      })
      resolve()
    })
  }
}

// 等级,身份
const judge = (groupId, isAdmin, isGroupAdmin) => {
  let AdminShow
  // 3||4销售主管
  if (isAdmin) {
    console.log('超管')
    AdminShow = 0
  } else if (isGroupAdmin && groupId === 2) {
    console.log('客服组长')
    AdminShow = 1
  } else if (!isGroupAdmin && groupId === 2) {
    console.log('客服组员')
    AdminShow = 2
  } else if (!isGroupAdmin && groupId === 3) {
    console.log('商务组员')
    AdminShow = 3
  } else if (!isGroupAdmin && groupId === 4) {
    AdminShow = 3
    console.log('商务组员')
  } else if (isGroupAdmin && groupId === 3) {
    console.log('商务组长')
    AdminShow = 4
  } else if (isGroupAdmin && groupId === 4) {
    console.log('商务组长')
    AdminShow = 4
  } else if (isGroupAdmin && groupId === 5) {
    console.log('猎头主管&顾问主管')
    AdminShow = 5
  } else if (!isGroupAdmin && groupId === 5) {
    console.log('猎头组员')
    AdminShow = 6
  }
  return AdminShow
}
