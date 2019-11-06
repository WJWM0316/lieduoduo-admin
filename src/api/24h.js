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
