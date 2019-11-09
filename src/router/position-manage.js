import Layout from '@/pages/layout'
export default [
  {
    path: '/manage',
    meta: { title: '职位管理', auth: true },
    component: Layout,
    redirect: {
      name: 'positionManage'
    },
    children: [
      {
        path: 'advertisement',
        meta: { title: '广告职位管理' },
        component: { render (c) { return c('router-view') } },
        children: [
          {
            path: '',
            meta: { title: '广告职位列表' },
            name: 'advertisement',
            component: resolve => require(['@/pages/advertisement/index.vue'], resolve)
          },
          /* 广告职位编辑 */
          {
            path: 'edit',
            name: 'advertisement_edit',
            meta: { title: '编辑职场大咖' },
            component: resolve => require(['@/pages/advertisement/post.vue'], resolve)
          },
          /* 广告职位新增 */
          {
            path: 'post',
            name: 'advertisement_post',
            meta: { title: '新增职场大咖' },
            component: resolve => require(['@/pages/advertisement/post.vue'], resolve)
          }
        ]
      },
      {
        path: 'urgent',
        meta: { title: '急聘职位管理' },
        component: { render (c) { return c('router-view') } },
        children: [
          {
            path: '',
            name: 'urgent',
            meta: { title: '急聘职位列表' },
            component: resolve => require(['@/pages/urgent/index.vue'], resolve)
          },
          /* 广告职位编辑 */
          {
            path: 'edit',
            name: 'urgent_edit',
            meta: { title: '编辑职场大咖' },
            component: resolve => require(['@/pages/urgent/post.vue'], resolve)
          },
          /* 广告职位新增 */
          {
            path: 'post',
            name: 'urgent_post',
            meta: { title: '新增职场大咖' },
            component: resolve => require(['@/pages/urgent/post.vue'], resolve)
          }
        ]
      },
      {
        path: 'positionManage',
        meta: { title: '职位管理' },
        component: { render (c) { return c('router-view') } },
        children: [
          {
            path: '',
            meta: { title: '职位列表' },
            name: 'positionManage',
            component: resolve => require(['@/pages/positionManage/list/index.vue'], resolve)
          },
          /* 职位审核详情 */
          {
            path: 'positionAuditDetail',
            name: 'positionAuditDetail',
            meta: {
              title: '职位审核详情'
            },
            component: resolve =>
              require(['@/pages/positionManage/audit/index.vue'], resolve)
          },
          /* 职位发布编辑 */
          {
            path: 'positionPost',
            name: 'positionPost',
            meta: {
              title: '职位发布'
            },
            component: resolve => require(['@/pages/positionManage/set/index.vue'], resolve)
          }
        ]
      }
    ]
  }
]
