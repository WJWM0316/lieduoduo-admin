import Layout from '@/pages/layout'
export default [
  {
    path: '',
    component: Layout,
    meta: { title: '品类', auth: true },
    children: [
      {
        path: '/category',
        name: 'categoryList',
        meta: { title: 'PC首页职位类别' },
        component: resolve => require(['@/pages/category/category.vue'], resolve)
      },
      {
        path: '/hotpositionlist',
        name: 'hotposition',
        meta: { title: 'PC热门职位类别' },
        component: resolve => require(['@/pages/category/hotposition.vue'], resolve)
      },
      {
        path: '/addhotCategory',
        name: 'addhotCategory',
        meta: { title: '新增热门类别' },
        component: resolve => require(['@/pages/category/addhotCategory.vue'], resolve)
      },
      {
        path: '/addCategory',
        name: 'addCategory',
        meta: { title: '新增类别' },
        component: resolve => require(['@/pages/category/addCategory.vue'], resolve)
      }
    ]
  }
]
