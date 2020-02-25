import Layout from '@/pages/layout'
export default [
  /* 简历库 */
  {
    path: '/resumeStore',
    meta: { title: '简历库', auth: true },
    component: Layout,
    redirect: {
      name: 'list'
    },
    children: [
      {
        path: 'list',
        meta: { title: '简历列表' },
        component: { render (c) { return c('router-view') } },
        children: [
          {
            path: '',
            name: 'list',
            meta: { title: '简历列表管理' },
            component: resolve =>
              require(['@/pages/resumeStore/page/list/list.vue'], resolve)
          },
          /* 新建微简历 */
          {
            path: 'createNewResume',
            name: 'createNewResume',
            meta: {
              title: '新建微简历'
            },
            component: resolve =>
              require(['@/pages/resumeStore/page/createNewResume/index.vue'], resolve)
          },
          /* 新建微简历 */
          {
            path: 'postResume',
            name: 'postResume',
            meta: {
              title: '操作简历'
            },
            component: resolve =>
              require(['@/pages/resumeStore/page/postResume/index.vue'], resolve)
          }
        ]
      },
      {
        path: 'recommendList',
        meta: { title: '推荐纪录' },
        component: { render (c) { return c('router-view') } },
        children: [
          {
            path: '',
            name: 'recommendList',
            meta: { title: '推荐纪录' },
            component: resolve =>
              require(['@/pages/resumeStore/page/recommendList/index.vue'], resolve)
          },
          /* 新建推荐单 */
          {
            path: 'createOrder',
            name: 'createOrder',
            meta: {
              title: '新建推荐单'
            },
            component: resolve =>
              require(['@/pages/resumeStore/page/createOrder/index.vue'], resolve)
          },
          /* 推荐单详情 */
          {
            path: 'OrderDetail',
            name: 'OrderDetail',
            meta: {
              title: '推荐单详情'
            },
            component: resolve =>
              require(['@/pages/resumeStore/page/OrderDetail/index.vue'], resolve)
          }
        ]
      },
      {
        path: 'invitationProgress',
        name: 'invitationProgress',
        meta: { title: '邀约进展' },
        component: resolve =>
          require([
            '@/pages/resumeStore/page/invitationProgress/index.vue'
          ], resolve)
      },
      {
        path: 'consultantRecommendation',
        name: 'consultantRecommendation',
        meta: { title: '顾问推荐进展' },
        component: resolve =>
          require([
            '@/pages/resumeStore/page/consultantRecommendation/index.vue'
          ], resolve)
      },
      {
        path: 'hotRecommendation',
        name: 'hotRecommendation',
        meta: { title: '热门推荐进展' },
        component: resolve =>
          require([
            '@/pages/resumeStore/page/hotRecommendation/index.vue'
          ], resolve)
      },
      {
        path: 'consultantService',
        name: 'consultantService',
        meta: { title: '顾问服务进展' },
        component: resolve =>
          require([
            '@/pages/resumeStore/page/consultantService/index.vue'
          ], resolve)
      },
      {
        path: 'talkList',
        name: 'talkList',
        meta: { title: '约聊列表' },
        component: resolve =>
          require([
            '@/pages/resumeStore/page/talkList/index.vue'
          ], resolve)
      },
      /* 简历详情 */
      {
        path: 'resumeDetails',
        name: 'resumeDetails',
        meta: { title: '简历详情' },
        component: resolve => require(['@/pages/resumeStore/page/resumeDetails/index.vue'], resolve)
      }
    ]
  }
]
