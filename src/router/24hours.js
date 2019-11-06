import Layout from '@/pages/layout'
export default [
  /* 24h反馈专场管理 */
  {
    path: '/24h',
    meta: { title: '24h反馈专场管理', auth: true },
    component: Layout,
    children: [
      {
        path: 'position',
        meta: { title: '24h反馈专场管理' },
        component: { render (c) { return c('router-view') } },
        children: [
          {
            path: '',
            name: '24h_position',
            meta: { title: '24h反馈专场管理' },
            component: resolve => require(['@/pages/24h/position/24h.vue'], resolve)
          },
          {
            path: 'edit',
            name: 'h24_position_edit',
            meta: {
              title: '专场发布'
            },
            component: resolve => require(['@/pages/24h/position/post.vue'], resolve)
          },
          {
            path: 'add',
            name: 'h24_position_post',
            meta: {
              title: '专场发布'
            },
            component: resolve => require(['@/pages/24h/position/post.vue'], resolve)
          }
        ]
      }

    ]
  }
]
