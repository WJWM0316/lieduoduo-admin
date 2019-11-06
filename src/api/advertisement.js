import { request } from './index.js'

/* 获取广告位列表 */
export const getAdvertListApi = data => request({
  url: '/advert/list',
  type: 'get',
  data
})

/* 添加广告位 */
export const addAdvertApi = data => request({
  url: '/advert/add',
  type: 'post',
  data
})

/* 编辑广告位 */
export const editAdvertApi = data => request({
  url: `/advert/edit/${data.id}`,
  type: 'put',
  data
})

/* 获取广告为详情 */
export const getAdvertApi = data => request({
  url: `/advert/info/${data.id}`,
  type: 'get'
})

/* 删除广告 */
export const deleteAdvertApi = data => request({
  url: `/advert/del/${data.id}`,
  type: 'delete'
})
