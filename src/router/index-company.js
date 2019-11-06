import Layout from '@/pages/layout'
export default [
  /* 公司管理 */
  {
    path: '/index',
    meta: { title: '公司库', auth: true },
    component: Layout,
    children: [
      /* 创建公司 */
      {
        path: '',
        name: 'index',
        meta: { title: '公司库' },
        component: resolve => require(['@/pages/index/index.vue'], resolve)
      },
      {
        path: 'createCompany',
        name: 'createCompany',
        meta: {
          title: '创建公司'
        },
        component: resolve => require(['@/pages/createCompany/index.vue'], resolve)
      },
      /* 编辑公司信息 */
      {
        path: 'editCompany/:id',
        name: 'editCompany',
        meta: {
          title: '编辑公司信息'
        },
        component: resolve => require(['@/pages/createCompany/index.vue'], resolve)
      },
      /* 公司录入详情 */
      {
        path: 'companyInfo',
        name: 'companyInfo',
        meta: {
          title: '公司详情'
        },
        component: resolve => require(['@/pages/index/companyInfo.vue'], resolve)
      },

      /* 编辑身份信息 */
      {
        path: 'editIdentity',
        name: 'editIdentity',
        meta: {
          title: '编辑身份信息'
        },
        component: resolve =>
          require(['@/pages/editCompany/editIdentity.vue'], resolve)
      }
    ]
  }
]
