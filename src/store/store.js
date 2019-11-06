import Vue from 'vue'
import Vuex from 'vuex'

import userInfo from './userInfo/index.js'
import common from './common'
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    userInfo,
    common
  }
})
