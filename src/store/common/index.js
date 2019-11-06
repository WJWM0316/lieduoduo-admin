const itemList = sessionStorage.getItem('itemList')
const state = {
  getMenuLoading: false,
  menuList: itemList ? JSON.parse(itemList) : []
}

const mutations = {
  setMenuList (state, payload) {
    // 保存一份到sessionStoreage
    sessionStorage.setItem('itemList', JSON.stringify(payload))
    state.menuList = payload
  },
  setMenuLoading (state, status) {
    state.getMenuLoading = status
  },
  removeMenus (state) {
    state.menuList = []
  }
}
export default {
  state,
  mutations
}
