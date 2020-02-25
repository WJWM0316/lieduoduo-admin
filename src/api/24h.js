import { request } from './index.js'

/* 获取24h反馈职位列表 */
export const getRapidlySurfaceListApi = data => request({
  url: '/rapidly/surface',
  type: 'get',
  data
})

/* 获取24h反馈职位 */
export const addRapidlySurfaceApi = data => request({
  url: '/rapidly/surface',
  type: 'post',
  data
})

/* 编辑24h反馈职位 */
export const editRapidlySurfaceApi = data => request({
  url: `/rapidly/surface/${data.id}`,
  type: 'put',
  data
})

/* 获取24h反馈职位 */
export const getRapidlySurfaceApi = data => request({
  url: `/rapidly/surface/${data.id}`,
  type: 'get'
})

/* 获取24h职位筛选参数 */
export const getRapidlyPositionAttr = data => request({
  url: '/rapidly/aggr',
  type: 'get',
  data
})

/** 获取24职位列表 新(v2.0.0) */
export const getRapidlyPositionList = data => request({
  url: '/rapidly/positions',
  type: 'get',
  data
})

/** 获取24招聘官列表  */
export const getRapidlyRecruiterList = data => request({
  url: '/surfaceRapidlyRecruiter/lists',
  type: 'get',
  data
})

/* 获取24h招聘官筛选参数 */
export const getRapidlyRecruiterAttr = data => request({
  url: '/surfaceRapidlyRecruiter/aggr',
  type: 'get',
  data
})

/** 添加24h招聘官  */
export const addRapidlyRecruiter = data => request({
  url: '/surfaceRapidlyRecruiter/info',
  type: 'post',
  data,
  globalTips: false
})

/** 修改24h招聘官  */
export const editRapidlyRecruiter = data => request({
  url: `/surfaceRapidlyRecruiter/info/${data.id}`,
  type: 'put',
  data
})

/** 查询指定招聘官  */
export const getRapidRecruiterById = data => request({
  url: `/surfaceRapidlyRecruiter/info/${data.id}`,
  type: 'get',
  data
})

/** 获取24公司列表  */
export const getRapidlyCompanyList = data => request({
  url: '/surfaceRapidlyCompany/lists',
  type: 'get',
  data
})

/* 获取24h公司筛选参数 */
export const getRapidlyCompanyAttr = data => request({
  url: '/surfaceRapidlyCompany/aggr',
  type: 'get',
  data
})

/** 添加24h公司 */
export const addRapidlyCompany = data => request({
  url: '/surfaceRapidlyCompany/info',
  type: 'post',
  data
})

/** 修改24h公司 */
export const editRapidlyCompany = data => request({
  url: `/surfaceRapidlyCompany/info/${data.id}`,
  type: 'put',
  data
})

/** 查询指定24h公司  */
export const getRapidCompanyById = data => request({
  url: `/surfaceRapidlyCompany/info/${data.id}`,
  type: 'get',
  data
})

/** 获取24h公司标签 */
export const getRapidlyLabels = data => request({
  url: '/surfaceRapidlyCompanyLabel/label/lists',
  type: 'get',
  data
})

/** 获取24h公司标签 */
export const getRapidlyLabelById = data => request({
  url: `/surfaceRapidlyCompanyLabel/label/lists/${data.id}`,
  type: 'get',
  data
})

/** 获取24h公司标签 */
export const addRapidlyLabel = data => request({
  url: '/surfaceRapidlyCompanyLabel/label',
  type: 'post',
  data
})

/** 设置公司标签 */
export const editRapidlyLabel = data => request({
  url: `/surfaceRapidlyCompanyLabel/label/${data.id}`,
  type: 'put',
  data
})

/** 删除公司标签  */
export const deleteRapidlyLabel = data => request({
  url: `/surfaceRapidlyCompanyLabel/label/${data.id}`,
  type: 'delete',
  data
})
