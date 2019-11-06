import Layout from '@/pages/layout'
export default [
  /* 面试管理 */
  {
    path: '/interview',
    meta: {
      title: '面试管理',
      auth: true
    },
    component: Layout,
    children: [
      {
        path: '',
        name: 'interview',
        component: resolve => require(['../App.vue'], resolve),
        meta: {
          title: '面试管理'
        }
      },
      {
        path: '24h',
        name: 'interview24h',
        meta: {
          title: '24h反馈专场管理'
        },
        component: resolve =>
          require(['@/pages/interview24h/index.vue'], resolve)
      },
      {
        path: 'List',
        name: 'List',
        meta: {
          title: '申请列表管理'
        },
        component: resolve =>
          require(['@/pages/application/index.vue'], resolve)
      },
      {
        path: 'invite',
        name: 'invite',
        meta: {
          title: '邀请列表管理'
        },
        component: resolve => require(['@/pages/invite/index.vue'], resolve)
      }
    ]
  }
]
