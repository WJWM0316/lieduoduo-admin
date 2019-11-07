import Layout from '@/pages/layout'
export default [
  // 审核管理
  {
    path: '/check',
    name: 'check',
    meta: { title: '审核管理', auth: true },
    component: Layout,
    children: [
      {
        path: 'companyCheck',
        meta: { title: '公司审核管理' },
        component: { render (c) { return c('router-view') } },
        children: [
          {
            path: '',
            name: 'companyCheck',
            component: resolve => require(['@/pages/companyCheck/index.vue'], resolve)
          },
          {
            path: 'verify',
            name: 'companyCheckverify',
            meta: {
              title: '公司审核'
            },
            component: resolve => require(['@/pages/companyCheck/verify.vue'], resolve)
          },
          /* 编辑公司审核里的用户信息 */
          {
            path: 'editUser/:id',
            name: 'check_editUser',
            meta: {
              title: '编辑用户信息'
            },
            component: resolve => require(['@/pages/user/addUser.vue'], resolve)
          },
          /* 编辑审核公司信息 */
          {
            path: 'check/:checkId',
            name: 'editCheckCompany',
            meta: {
              title: '编辑公司信息'
            },
            component: resolve => require(['@/pages/createCompany/index.vue'], resolve)
          }
        ]
      },
      {
        path: 'recruitmentOfficer',
        name: 'recruitmentOfficer',
        meta: { title: '招聘官管理' },
        component: resolve =>
          require(['@/pages/officerManage/index.vue'], resolve)
      },
      /* 编辑申请招聘官用户信息 */
      {
        path: '/check/recruitmentOfficer/editUser/:id',
        name: 'editOfficerUser',
        meta: {
          title: '编辑招聘官信息'
        },
        component: resolve => require(['@/pages/user/addUser.vue'], resolve)
      },
      /* 招聘官审核详情 */
      {
        path: '/check/recruitmentOfficer/reviewDetails',
        name: 'reviewDetails',
        meta: {
          title: '招聘官审核详情'
        },
        component: resolve =>
          require(['@/pages/officerManage/reviewDetails.vue'], resolve)
      }
    ]
  }
]
