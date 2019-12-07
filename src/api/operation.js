import { request } from './index.js'

/* 获取推送端 */
export const getBannerDeviceApi = () => request({
  url: '/banner/device',
  type: 'get'
})

/* 获取广告参数 */
export const getBannerParameterApi = data => request({
  url: '/banner/parameter',
  type: 'get',
  data
})

/* 获取banner广告列表 */
export const getBannerListsApi = data => request({
  url: '/banner/list',
  type: 'get',
  data
})

/* 获取急聘职位详情 */
export const getUrgencyApi = data => request({
  url: `/urgency/info/${data.id}`,
  type: 'get'
})

/* 删除急聘职位 */
export const deleteUrgencyApi = data => request({
  url: `/urgency/del/${data.id}`,
  type: 'delete'
})
