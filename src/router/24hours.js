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
        meta: { title: '24h职位' },
        component: { render (c) { return c('router-view') } },
        children: [
          {
            path: '',
            name: '24h_position',
            meta: { title: '24h职位管理' },
            component: resolve => require(['@/pages/24h/position/24h.vue'], resolve)
          },
          {
            path: 'edit',
            name: 'h24_position_edit',
            meta: {
              title: '新增24h职位'
            },
            component: resolve => require(['@/pages/24h/position/post.vue'], resolve)
          },
          {
            path: 'add',
            name: 'h24_position_post',
            meta: {
              title: '修改24h职位'
            },
            component: resolve => require(['@/pages/24h/position/post.vue'], resolve)
          }
        ]
      },
      {
        path: 'recruiter',
        meta: { title: '24h招聘官' },
        component: { render (c) { return c('router-view') } },
        children: [
          {
            path: '',
            name: '24h_recruiter',
            meta: { title: '24h招聘官理' },
            component: resolve => require(['@/pages/24h/recruiter/list.vue'], resolve)
          },
          {
            path: 'add',
            name: '24h_recruiter_add',
            meta: { title: '新增24招聘官' },
            component: resolve => require(['@/pages/24h/recruiter/set.vue'], resolve)
          },
          {
            path: 'edit',
            name: '24h_recruiter_edit',
            meta: { title: '编辑24招聘官' },
            component: resolve => require(['@/pages/24h/recruiter/set.vue'], resolve)
          }
        ]
      }
    ]
  }
]
