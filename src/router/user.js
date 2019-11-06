import Layout from '@/pages/layout'
export default [
  /* 用户列表 */
  {
    path: '/user',
    meta: { title: '用户管理', auth: true },
    component: Layout,
    children: [
      {
        path: '',
        name: 'user',
        meta: { title: '用户管理' },
        component: resolve => require(['@/pages/user/index.vue'], resolve)
      },
      /* 添加用户 */
      {
        path: 'addUser',
        name: 'addUser',
        meta: {
          title: '添加用户'
        },
        component: resolve => require(['@/pages/user/addUser.vue'], resolve)
      },
      /* 编辑用户 */
      {
        path: 'editUser/:id',
        name: 'editUser',
        meta: {
          title: '编辑用户信息'
        },
        component: resolve => require(['@/pages/user/addUser.vue'], resolve)
      },
      /* 查看用户 */
      {
        path: 'userInfo/:id',
        name: 'userInfo',
        meta: {
          title: '查看用户详情'
        },
        component: resolve => require(['@/pages/user/userInfo.vue'], resolve)
      },
      /* 招聘官详情 */
      {
        path: 'recruiterInfo/:id',
        name: 'recruiter_info',
        meta: {
          title: '编辑详情'
        },
        component: resolve => require(['@/pages/user/info_recruiter.vue'], resolve)
      },
      /* 编辑招聘官信息 */
      {
        path: 'editRecruiter/:id',
        name: 'editRecruiter',
        meta: {
          title: '查看用户详情'
        },
        component: resolve => require(['@/pages/user/editRecruiter.vue'], resolve)
      },
      /* 编辑招聘官信息 */
      {
        path: 'edit_recruiter/:id',
        name: 'edit_recruiter',
        meta: {
          title: '编辑招聘官信息'
        },
        component: resolve => require(['@/pages/user/edit_recruiter.vue'], resolve)
      }
    ]
  }
]
