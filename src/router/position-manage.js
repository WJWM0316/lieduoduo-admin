import Layout from '@/pages/layout'
export default [
  {
    path: '/manage',
    meta: { title: '职位管理', auth: true },
    component: Layout,
    children: [
      {
        path: '',
        name: 'manage',
        meta: { title: '职位管理' },
        component: resolve => require(['../App.vue'], resolve)
      },
      {
        path: 'advertisement',
        name: 'advertisement',
        meta: { title: '广告职位管理' },
        component: resolve =>
          require(['@/pages/advertisement/index.vue'], resolve)
      },
      {
        path: 'urgent',
        name: 'urgent',
        meta: { title: '急聘职位管理' },
        component: resolve =>
          require(['@/pages/urgent/index.vue'], resolve)
      },
      {
        path: 'positionManage',
        name: 'positionManage',
        meta: { title: '全部职位' },
        component: resolve =>
          require(['@/pages/positionManage/index.vue'], resolve)
      }
    ]
  },
  {
    path: '/positionManage',
    meta: { title: '职位编织', auth: true },
    name: 'positionManage_index',
    component: Layout,
    children: [
      /* 职位审核详情 */
      {
        path: 'positionAuditDetail',
        name: 'positionAuditDetail',
        meta: {
          title: '职位审核详情'
        },
        component: resolve =>
          require(['@/pages/positionAuditDetail/index.vue'], resolve)
      },
      /* 职位发布编辑 */
      {
        path: 'positionPost',
        name: 'positionPost',
        meta: {
          title: '职位发布'
        },
        component: resolve => require(['@/pages/positionPost/index.vue'], resolve)
      }
    ]
  }
]
