export default [
  {
    path: '/',
    name: '首页',
    redirect: '/index'
  },
  {
    path: '/login',
    name: 'login',
    component: resolve => require(['@/pages/login/index.vue'], resolve)
  }
  // /* 急聘职位管理 */
  // {
  //   path: "/urgent",
  //   name: "urgent",
  //   meta: { title: "急聘职位管理", haveParent: false},
  //   component: resolve => require(["@/pages/urgent/index.vue"], resolve)
  // },
  // /* 职位管理 = 全部职位 */
  // {
  //   path: "/positionManage",
  //   name: "positionManage",
  //   meta: { title: "职位管理"},
  //   component: resolve => require(["@/pages/positionManage/index.vue"], resolve)
  // },
  //  /* 广告职位列表 */
  //  {
  //   path: "/advertisement",
  //   name: "advertisement",
  //   meta: { title: "广告职位管理", haveParent: false},
  //   component: resolve => require(["@/pages/advertisement/index.vue"], resolve)
  // },

  // {
  //   path: "/edit_recruiter",
  //   name: "edit_recruiter",
  //   meta: { title: "招聘官管理", haveParent: false,   },
  //   component: resolve => require(["@/pages/user/edit_recruiter.vue"], resolve)
  // },
]
