import Layout from '@/pages/layout'
export default [
  {
    path: '/recruiter',
    component: Layout,
    meta: { title: '招聘官', auth: true },
    children: [
      {
        path: '',
        name: 'recruiterList',
        meta: { title: '招聘官管理' },
        component: resolve => require(['@/pages/user/recruiter.vue'], resolve)
      }
    ]
  }
]
