import Layout from '@/pages/layout'
export default [
  // 活动管理
  {
    path: '/activity',
    name: 'activity',
    meta: { title: '活动管理', auth: true },
    component: Layout,
    children: [
      {
        path: '',
        name: 'activity_list',
        meta: { title: '活动列表' },
        component: resolve => require(['@/pages/activity/index.vue'], resolve)
      },
      {
        path: 'add',
        name: 'activity_add',
        meta: { title: '活动新增' },
        component: resolve => require(['@/pages/activity/set-activity.vue'], resolve)
      },
      {
        path: 'edit',
        name: 'activity_edit',
        meta: { title: '编辑活动' },
        component: resolve => require(['@/pages/activity/set-activity.vue'], resolve)
      },
      {
        path: 'unit/:aid',
        meta: { title: '栏目信息' },
        redirect: { name: 'unit_list' },
        component: { render (c) { return c('router-view') } },
        children: [
          {
            path: '',
            name: 'unit_list',
            meta: { title: '栏目列表' },
            component: resolve => require(['@/pages/activity/unit.vue'], resolve)
          },
          {
            path: 'set/:lid',
            name: 'unit_set',
            meta: { title: '栏目信息编辑' },
            component: resolve => require(['@/pages/activity/set-unit.vue'], resolve)
          }
        ]
      }
    ]
  }
]
