import Layout from '@/pages/layout'
export default [
  {
    path: '/advertisement',
    redirect: {
      name: 'advertisement_edit'
    },
    name: 'advertisement_index',
    component: Layout,
    meta: {
      auth: true,
      title: '职场大咖'
    },
    children: [
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
    path: '/urgent',
    redirect: {
      name: 'urgent_edit'
    },
    name: 'urgent_index',
    meta: {
      auth: true,
      title: '职场大咖'
    },
    component: Layout,
    children: [
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
  }
]
