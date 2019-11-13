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

const roleList = [
  { role: 1, roleName: '超管', isShowAdmin: [0] },
  { role: 2, roleName: '客服组', isShowAdmin: [1, 2] },
  { role: 3, roleName: '商务组', isShowAdmin: [3, 4] },
  { role: 4, roleName: '商务组', isShowAdmin: [3, 4] },
  { role: 5, roleName: '猎头组', isShowAdmin: [5, 6] },
  { role: 6, roleName: '运营组', isShowAdmin: [7, 8] }
]
// 等级,身份
const judge = (groupId, isAdmin, isGroupAdmin) => {
  if (isAdmin) return 0
  const role = roleList.find(val => val.role === groupId)
  return isGroupAdmin ? role.isShowAdmin[0] : role.isShowAdmin[1]
}
