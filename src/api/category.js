import { request } from './index.js'

/* 获取一级职位类别列表 */
export const getCategoryApi = data => request({
  url: '/labelnew/list',
  type: 'get',
  data
})

/* 通过id获取职位类别列表 */
export const getidCategoryApi = data => request({
  url: `/labelnew/info/${data.id}`,
  type: 'get'
})

/* 删除职位类别 */
export const deleteCategoryApi = data => request({
  url: `/labelnew/del/${data.id}`,
  type: 'delete'
})

/* 添加职位类别 */
export const addCategoryApi = data => request({
  url: '/labelnew/add',
  type: 'post',
  data
})

/* 编辑职位类别 */
export const editCategoryApi = data => request({
  url: `/labelnew/edit/${data.id}`,
  type: 'put',
  data
})

/* 职位标签列表 */
export const positionlabelList = data => request({
  url: '/labelnew/position',
  type: 'get',
  data
})

/* 复制职位类别 */
export const copylabelList = data => request({
  url: `/labelnew/copy/${data.id}`,
  type: 'put',
  data
})

/* 热门职位类别列表 */
export const hotpositionlabelList = data => request({
  url: '/labelnew/hotlist',
  type: 'get',
  data
})

/* 热门筛选的一级职位类别列表 */
export const firstpositionlist = data => request({
  url: '/labelnew/toplab',
  type: 'get',
  data
})
