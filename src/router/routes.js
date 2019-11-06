export const routes = [
  {
    path: '/',
    // 默认进入控制台
    redirect: {
      name: 'login'
    }
  },
  {
    path: '/login',
    name: 'login',
    component: resolve => require(['@/pages/login/index.vue'], resolve)
  },
  /* 公司管理 */
  {
    path: '/index',
    name: 'index',
    meta: { title: '公司库', scrollY: 0, Aside: false },
    component: resolve => require(['@/pages/index/index.vue'], resolve)
  },
  /* 简历库 */
  {
    path: '/resumeStore',
    name: 'resumeStore',
    meta: { title: '简历库', flag: 'resumeStore' },
    component: resolve => require(['../App.vue'], resolve),
    children: [
      {
        path: 'list',
        name: 'list',
        meta: { title: '简历列表', keepAlive: false, flag: 'resumeStore' },
        component: resolve =>
          require(['@/pages/resumeStore/page/list/list.vue'], resolve)
      },
      {
        path: 'recommendList',
        name: 'recommendList',
        meta: { title: '推荐纪录', keepAlive: false, flag: 'resumeStore' },
        component: resolve =>
          require(['@/pages/resumeStore/page/recommendList/index.vue'], resolve)
      },
      {
        path: 'invitationProgress',
        name: 'invitationProgress',
        meta: { title: '邀约进展', keepAlive: false, flag: 'resumeStore' },
        component: resolve =>
          require([
            '@/pages/resumeStore/page/invitationProgress/index.vue'
          ], resolve)
      },
      {
        path: 'consultantRecommendation',
        name: 'consultantRecommendation',
        meta: { title: '顾问推荐进展', keepAlive: false, flag: 'resumeStore' },
        component: resolve =>
          require([
            '@/pages/resumeStore/page/consultantRecommendation/index.vue'
          ], resolve)
      },
      {
        path: 'hotRecommendation',
        name: 'hotRecommendation',
        meta: { title: '热门推荐进展', keepAlive: false, flag: 'resumeStore' },
        component: resolve =>
          require([
            '@/pages/resumeStore/page/hotRecommendation/index.vue'
          ], resolve)
      }
    ]
  },
  {
    path: '/24h/add',
    name: 'h24_post',
    meta: {
      title: '专场发布',
      haveParent: true,
      parentPath: '/24h',
      parentName: '24h反馈专场管理'
    },
    component: resolve =>
      require(['@/pages/24h/post.vue'], resolve)
  },
  {
    path: '/24h/edit',
    name: 'h24_edit',
    meta: {
      title: '专场发布',
      haveParent: true,
      parentPath: '/24h',
      parentName: '24h反馈专场管理'
    },
    component: resolve =>
      require(['@/pages/24h/post.vue'], resolve)
  },
  /* 新建微简历 */
  {
    path: '/resumeStore/list/createNewResume',
    name: 'createNewResume',
    meta: {
      title: '新建微简历',
      haveParent: true,
      parentPath: '/resumeStore/list',
      parentName: '简历列表',
      keepAlive: false,
      flag: 'resumeStore'
    },
    component: resolve =>
      require(['@/pages/resumeStore/page/createNewResume/index.vue'], resolve)
  },
  /* 新建微简历 */
  {
    path: '/resumeStore/list/postResume',
    name: 'postResume',
    meta: {
      title: '操作简历',
      haveParent: true,
      parentPath: '/resumeStore/list',
      parentName: '简历列表',
      keepAlive: false,
      flag: 'resumeStore'
    },
    component: resolve =>
      require(['@/pages/resumeStore/page/postResume/index.vue'], resolve)
  },
  /* 新建推荐单 */
  {
    path: '/resumeStore/recommendList/createOrder',
    name: 'createOrder',
    meta: {
      title: '新建推荐单',
      haveParent: true,
      parentName: '推荐纪录',
      keepAlive: false,
      flag: 'resumeStore'
    },
    component: resolve =>
      require(['@/pages/resumeStore/page/createOrder/index.vue'], resolve)
  },
  /* 推荐单详情 */
  {
    path: '/resumeStore/recommendList/OrderDetail',
    name: 'OrderDetail',
    meta: {
      title: '推荐单详情',
      haveParent: true,
      parentName: '推荐纪录',
      keepAlive: false,
      flag: 'resumeStore'
    },
    component: resolve =>
      require(['@/pages/resumeStore/page/OrderDetail/index.vue'], resolve)
  },
  /* 24h反馈专场管理 */
  {
    path: '/24h',
    name: '24h',
    meta: { title: '24h反馈专场管理', haveParent: false },
    component: resolve => require(['@/pages/24h/24h.vue'], resolve)
  },
  // /* 急聘职位管理 */
  // {
  //   path: "/urgent",
  //   name: "urgent",
  //   meta: { title: "急聘职位管理", haveParent: false},
  //   component: resolve => require(["@/pages/urgent/index.vue"], resolve)
  // },
  // /* 职位管理 = 全部职位 */
  // {
  //   path: "/positionManage",
  //   name: "positionManage",
  //   meta: { title: "职位管理"},
  //   component: resolve => require(["@/pages/positionManage/index.vue"], resolve)
  // },
  //  /* 广告职位列表 */
  //  {
  //   path: "/advertisement",
  //   name: "advertisement",
  //   meta: { title: "广告职位管理", haveParent: false},
  //   component: resolve => require(["@/pages/advertisement/index.vue"], resolve)
  // },
  {
    path: '/manage',
    name: 'manage',
    meta: { title: '职位管理', keepAlive: true, scrollY: 0, flag: 'mangae' },
    component: resolve => require(['../App.vue'], resolve),
    children: [
      {
        path: 'advertisement',
        name: 'advertisement',
        meta: { title: '广告职位管理', keepAlive: false, flag: 'mangae' },
        component: resolve =>
          require(['@/pages/advertisement/index.vue'], resolve)
      },
      {
        path: 'urgent',
        name: 'urgent',
        meta: { title: '急聘职位管理', keepAlive: false, flag: 'mangae' },
        component: resolve =>
          require(['@/pages/urgent/index.vue'], resolve)
      },
      {
        path: 'positionManage',
        name: 'positionManage',
        meta: { title: '全部职位', keepAlive: false, flag: 'mangae' },
        component: resolve =>
          require(['@/pages/positionManage/index.vue'], resolve)
      }
    ]
  },
  // 审核管理
  {
    path: '/check',
    name: 'check',
    meta: { title: '审核管理', keepAlive: false, scrollY: 0, flag: 'check' },
    component: resolve => require(['../App.vue'], resolve),
    children: [
      {
        path: 'companyCheck',
        name: 'companyCheck',
        meta: { title: '公司审核管理', keepAlive: false, flag: 'check' },
        component: resolve =>
          require(['@/pages/companyCheck/index.vue'], resolve)
      },
      {
        path: 'recruitmentOfficer',
        name: 'recruitmentOfficer',
        meta: { title: '招聘官管理', keepAlive: false, flag: 'check' },
        component: resolve =>
          require(['@/pages/officerManage/index.vue'], resolve)
      }
    ]
  },
  /* 面试管理 */
  {
    path: '/interview',
    name: 'interview',
    meta: {
      title: '面试管理',
      keepAlive: false,
      scrollY: 0,
      flag: 'interview'
    },
    component: resolve => require(['../App.vue'], resolve),
    children: [
      {
        path: '24h',
        name: 'interview24h',
        meta: {
          title: '24h反馈专场管理',
          haveParent: true,
          flag: 'interview'
        },
        component: resolve =>
          require(['@/pages/interview24h/index.vue'], resolve)
      },
      {
        path: 'List',
        name: 'List',
        meta: {
          title: '申请列表管理',
          haveParent: true,
          keepAlive: false,
          flag: 'interview'
        },
        component: resolve =>
          require(['@/pages/application/index.vue'], resolve)
      },
      {
        path: 'invite',
        name: 'invite',
        meta: {
          title: '邀请列表管理',
          haveParent: true,
          keepAlive: false,
          flag: 'interview'
        },
        component: resolve => require(['@/pages/invite/index.vue'], resolve)
      }
    ]
  },

  {
    path: '/check/companyCheck/verify',
    name: 'companyCheckverify',
    meta: {
      title: '公司审核',
      haveParent: true,
      keepAlive: false,
      parentPath: '/check/companyCheck',
      parentName: '公司审核管理'
    },
    component: resolve => require(['@/pages/companyCheck/verify.vue'], resolve)
  },
  /* 编辑公司审核里的用户信息 */
  {
    path: '/check/companyCheck/editUser/:id',
    name: 'editUser',
    meta: {
      title: '编辑用户信息',
      haveParent: true,
      parentPath: '/check/companyCheck',
      parentName: '公司审核管理'
    },
    component: resolve => require(['@/pages/user/addUser.vue'], resolve)
  },

  /* 编辑申请招聘官用户信息 */
  {
    path: '/check/recruitmentOfficer/editUser/:id',
    name: 'editOfficerUser',
    meta: {
      title: '编辑招聘官信息',
      haveParent: true,
      parentPath: '/check/recruitmentOfficer',
      parentName: '招聘官审核'
    },
    component: resolve => require(['@/pages/user/addUser.vue'], resolve)
  },
  /* 招聘官审核详情 */
  {
    path: '/check/recruitmentOfficer/reviewDetails',
    name: 'reviewDetails',
    meta: {
      title: '招聘官审核详情',
      haveParent: true,
      parentPath: '/check/recruitmentOfficer',
      parentName: '招聘官管理'
    },
    component: resolve =>
      require(['@/pages/officerManage/reviewDetails.vue'], resolve)
  },
  /* 编辑审核公司信息 */
  {
    path: '/check/companyCheck/:checkId',
    name: 'editCheckCompany',
    meta: {
      title: '编辑公司信息',
      haveParent: true,
      parentPath: '/check/companyCheck',
      parentName: '公司审核管理'
    },
    component: resolve => require(['@/pages/createCompany/index.vue'], resolve)
  },
  /* 公司录入详情 */
  {
    path: '/index/companyInfo',
    name: 'companyInfo',
    meta: {
      title: '公司详情',
      haveParent: true,
      parentPath: '/index',
      parentName: '公司库',
      flag: 'gongsiku'
    },
    component: resolve => require(['@/pages/index/companyInfo.vue'], resolve)
  },
  /* 职位审核详情 */
  {
    path: '/positionManage/positionAuditDetail',
    name: 'positionAuditDetail',
    meta: {
      title: '职位审核详情',
      haveParent: true,
      parentPath: '/positionManage',
      parentName: '职位管理'
    },
    component: resolve =>
      require(['@/pages/positionAuditDetail/index.vue'], resolve)
  },
  /* 职位发布编辑 */
  {
    path: '/positionManage/positionPost',
    name: 'positionPost',
    meta: {
      title: '职位发布',
      haveParent: true,
      parentPath: '/positionManage',
      parentName: '职位管理'
    },
    component: resolve => require(['@/pages/positionPost/index.vue'], resolve)
  },
  /* 创建公司 */
  {
    path: '/index/createCompany',
    name: 'createCompany',
    meta: {
      title: '创建公司',
      haveParent: true,
      parentPath: '/index',
      parentName: '公司库'
    },
    component: resolve => require(['@/pages/createCompany/index.vue'], resolve)
  },
  /* 编辑公司信息 */
  {
    path: '/index/editCompany/:id',
    name: 'editCompany',
    meta: {
      title: '编辑公司信息',
      haveParent: true,
      parentPath: '/index',
      parentName: '公司库'
    },
    component: resolve => require(['@/pages/createCompany/index.vue'], resolve)
  },

  /* 编辑身份信息 */
  {
    path: '/index/editIdentity',
    name: 'editIdentity',
    meta: {
      title: '编辑身份信息',
      haveParent: true,
      parentPath: '/index',
      parentName: '公司库'
    },
    component: resolve =>
      require(['@/pages/editCompany/editIdentity.vue'], resolve)
  },

  /* 用户列表 */
  {
    path: '/user',
    name: 'user',
    meta: { title: '用户管理', haveParent: false, keepAlive: true },
    component: resolve => require(['@/pages/user/index.vue'], resolve)
  },
  {
    path: '/recruiter',
    name: 'recruiterList',
    meta: { title: '招聘官管理', haveParent: false },
    component: resolve => require(['@/pages/user/recruiter.vue'], resolve)
  },
  // {
  //   path: "/edit_recruiter",
  //   name: "edit_recruiter",
  //   meta: { title: "招聘官管理", haveParent: false, keepAlive: true },
  //   component: resolve => require(["@/pages/user/edit_recruiter.vue"], resolve)
  // },
  /* 广告职位编辑 */
  {
    path: '/advertisement/edit',
    name: 'advertisement_edit',
    meta: { title: '编辑职场大咖', haveParent: false },
    component: resolve => require(['@/pages/advertisement/post.vue'], resolve)
  },
  /* 广告职位新增 */
  {
    path: '/advertisement/post',
    name: 'advertisement_post',
    meta: { title: '新增职场大咖', haveParent: false },
    component: resolve => require(['@/pages/advertisement/post.vue'], resolve)
  },
  /* 广告职位编辑 */
  {
    path: '/urgent/edit',
    name: 'urgent_edit',
    meta: { title: '编辑职场大咖', haveParent: false },
    component: resolve => require(['@/pages/urgent/post.vue'], resolve)
  },
  /* 广告职位新增 */
  {
    path: '/urgent/post',
    name: 'urgent_post',
    meta: { title: '新增职场大咖', haveParent: false },
    component: resolve => require(['@/pages/urgent/post.vue'], resolve)
  },
  /* 添加用户 */
  {
    path: '/user/addUser',
    name: 'addUser',
    meta: {
      title: '添加用户',
      haveParent: true,
      parentPath: '/user',
      parentName: '用户管理'
    },
    component: resolve => require(['@/pages/user/addUser.vue'], resolve)
  },
  /* 编辑用户 */
  {
    path: '/user/editUser/:id',
    name: 'editUser',
    meta: {
      title: '编辑用户信息',
      haveParent: true,
      parentPath: '/user',
      parentName: '用户管理'
    },
    component: resolve => require(['@/pages/user/addUser.vue'], resolve)
  },
  /* 查看用户 */
  {
    path: '/user/userInfo/:id',
    name: 'userInfo',
    meta: {
      title: '查看用户详情',
      haveParent: true,
      parentPath: '/user',
      parentName: '用户管理'
    },
    component: resolve => require(['@/pages/user/userInfo.vue'], resolve)
  },
  /* 招聘官详情 */
  {
    path: '/user/recruiterInfo/:id',
    name: 'recruiter_info',
    meta: {
      title: '编辑详情',
      haveParent: true,
      parentPath: '/recruiter',
      parentName: '招聘官管理'
    },
    component: resolve => require(['@/pages/user/info_recruiter.vue'], resolve)
  },
  /* 编辑招聘官信息 */
  {
    path: '/user/editRecruiter/:id',
    name: 'editRecruiter',
    meta: {
      title: '查看用户详情',
      haveParent: true,
      parentPath: '/user',
      parentName: '用户管理'
    },
    component: resolve => require(['@/pages/user/editRecruiter.vue'], resolve)
  },
  /* 编辑招聘官信息 */
  {
    path: '/user/edit_recruiter/:id',
    name: 'edit_recruiter',
    meta: {
      title: '编辑招聘官信息',
      haveParent: true,
      parentPath: '/user',
      parentName: '用户管理'
    },
    component: resolve => require(['@/pages/user/edit_recruiter.vue'], resolve)
  },
  /* 简历详情 */
  {
    path: '/resumeDetails',
    name: 'resumeDetails',
    meta: { title: '简历详情', haveParent: false, keepAlive: true },
    component: resolve =>
      require(['@/pages/resumeDetails/resumeDetails.vue'], resolve)
  }
]
