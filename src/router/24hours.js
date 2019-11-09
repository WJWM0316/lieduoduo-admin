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
              title: '修改新增24h职位'
            },
            component: resolve => require(['@/pages/24h/position/post.vue'], resolve)
          },
          {
            path: 'add',
            name: 'h24_position_post',
            meta: {
              title: '新增24h职位'
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
      },
      {
        path: 'company',
        meta: { title: '24h招聘官' },
        component: { render (c) { return c('router-view') } },
        children: [
          {
            path: '',
            name: '24h_company',
            meta: { title: '24h招聘官理' },
            component: resolve => require(['@/pages/24h/company/list.vue'], resolve)
          },
          {
            path: 'add',
            name: '24h_company_add',
            meta: { title: '新增24招聘官' },
            component: resolve => require(['@/pages/24h/company/set.vue'], resolve)
          },
          {
            path: 'edit',
            name: '24h_company_edit',
            meta: { title: '编辑24招聘官' },
            component: resolve => require(['@/pages/24h/company/set.vue'], resolve)
          }
        ]
      },
      {
        path: 'labels',
        meta: { title: '24h公司标签分类' },
        component: { render (c) { return c('router-view') } },
        children: [
          {
            path: '',
            name: '24h_labels',
            meta: { title: '24h公司标签分类列表' },
            component: resolve => require(['@/pages/24h/labels/list.vue'], resolve)
          },
          {
            path: 'add',
            name: '24h_labels_add',
            meta: { title: '新增24h公司标签' },
            component: resolve => require(['@/pages/24h/labels/set.vue'], resolve)
          },
          {
            path: 'edit',
            name: '24h_labels_edit',
            meta: { title: '编辑24h公司标签' },
            component: resolve => require(['@/pages/24h/labels/set.vue'], resolve)
          }
        ]
      }
    ]
  }
]
