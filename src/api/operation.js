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

/* 获取广告图信息 */
export const getBannerDetailApi = data => request({
  url: `/banner/details/${data.id}`,
  type: 'get'
})

/* 编辑广告图信息 */
export const updateBannerDetailApi = data => request({
  url: `/banner/edit/${data.id}`,
  type: 'post',
  data
})

/* 添加广告图信息 */
export const postBannerDetailApi = data => request({
  url: '/banner/add',
  type: 'post',
  data
})

/* 获取月度数量列表 */
export const getBannerTimeNumApi = data => request({
  url: '/banner/list/timeNum',
  type: 'get',
  data
})