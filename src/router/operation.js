import Layout from '@/pages/layout'
export default [
  /* 面试管理 */
  {
    path: '/operation',
    meta: {
      title: '运营位管理',
      auth: false
    },
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'operationList',
        meta: {
          title: '运营位管理'
        },
        component: resolve => require(['@/pages/operation/index.vue'], resolve)
      },
      {
        path: 'post',
        name: 'operationAdd',
        meta: {
          title: '运营位新增'
        },
        component: resolve => require(['@/pages/operation/post.vue'], resolve)
      },
      {
        path: 'update',
        name: 'operationEdit',
        meta: {
          title: '运营位编辑'
        },
        component: resolve => require(['@/pages/operation/post.vue'], resolve)
      }
    ]
  }
]
