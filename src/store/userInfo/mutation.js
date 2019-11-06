import * as types from './mutations_types'

export default {
  [types.UPDATE_USERINFO] (state, userDb) {
    state.userinfo = userDb.userInfo
  },
  [types.REMOVE_USERINFO] (state) {
    state.userinfo = {}
  }
}
