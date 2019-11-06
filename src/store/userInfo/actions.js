import * as types from './mutations_types'

export default {
  // 更新用户信息
  update_userinfo: ({ commit }, { userInfo }) => {
    return new Promise((resolve, reject) => {
      commit(types.UPDATE_USERINFO, {
        userInfo
      })
      resolve()
    })
  },
  // 清空用户信息
  remove_userinfo: ({ commit }) => {
    return new Promise((resolve, reject) => {
      commit(types.REMOVE_USERINFO)
      resolve()
    })
  }
}
