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
        path: '24h',
        name: 'interview24h',
        meta: {
          title: '24h反馈专场管理'
        },
        component: resolve =>
          require(['@/pages/interview24h/list/index.vue'], resolve)
      },
      {
        path: 'apply',
        name: 'interview_apply',
        meta: {
          title: '申请列表管理'
        },
        component: resolve =>
          require(['@/pages/interview24h/apply/index.vue'], resolve)
      },
      {
        path: 'invite',
        name: 'invite',
        meta: {
          title: '邀请列表管理'
        },
        component: resolve => require(['@/pages/interview24h/invite/index.vue'], resolve)
      }
    ]
  }
]
