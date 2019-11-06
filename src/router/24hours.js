import Layout from '@/pages/layout'
export default [
  /* 24h反馈专场管理 */
  {
    path: '/24h',
    meta: { title: '24h反馈专场管理', auth: true },
    component: Layout,
    children: [
      {
        path: '',
        name: '24h',
        meta: { title: '24h反馈专场管理' },
        component: resolve => require(['@/pages/24h/24h.vue'], resolve)
      },
      {
        path: 'edit',
        name: 'h24_edit',
        meta: {
          title: '专场发布'
        },
        component: resolve =>
          require(['@/pages/24h/post.vue'], resolve)
      },
      {
        path: 'add',
        name: 'h24_post',
        meta: {
          title: '专场发布'
        },
        component: resolve =>
          require(['@/pages/24h/post.vue'], resolve)
      }
    ]
  }
]
