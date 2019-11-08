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

/* 获取24h职位筛选参数 */
export const getRapidlyRecruiterAttr = data => request({
  url: '/surfaceRapidlyRecruiter/aggr',
  type: 'get',
  data
})
