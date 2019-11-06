import { request } from './index.js'

/* 获取急聘职位列表 */
export const getUrgencyListApi = data => request({
  url: '/urgency/list',
  type: 'get',
  data
})

/* 添加急聘职位 */
export const addUrgencyApi = data => request({
  url: '/urgency/add',
  type: 'post',
  data
})

/* 编辑急聘职位 */
export const editUrgencyApi = data => request({
  url: `/urgency/edit/${data.id}`,
  type: 'put',
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
