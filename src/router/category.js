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
        meta: { title: '品类管理' },
        component: resolve => require(['@/pages/category/category.vue'], resolve)
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
