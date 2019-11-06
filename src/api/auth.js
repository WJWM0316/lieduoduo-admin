/**
 * 课程模块api
 */
import { request } from './index.js'

// 职位搜索列表
export const getListApi = data => request({
  url: `/position/list`,
  type: 'get',
  data
})

// 职位分状态按条件数量统计
export const statustotalApi = data => request({
  url: `/position/statustotal`,
  type: 'get',
  data
})

// 搜索职位名称列表
export const getJobNameListApi = data => request({
  url: `/position/namelist`,
  type: 'get',
  data
})

// 创建职位
export const addPositionApi = data => request({
  url: `/position`,
  type: 'post',
  data
})

// 获取职位信息
export const getPositionApi = data => request({
  url: `/position/${data}`,
  type: 'get'
})

// 编辑职位信息
export const editPositionApi = data => request({
  url: `/position/${data.id}`,
  type: 'put',
  data
})

// 删除职位信息
export const deletePositionApi = data => request({
  url: `/position/${data.id}`,
  type: 'delete',
  data
})

// 通过vkey获取职位信息
export const getPositionVkeyApi = data => request({
  url: `/position/${data.vkey}`,
  type: 'get',
  data
})

// 获取经验数据列表
export const getExperienceApi = data => request({
  url: `/position/`,
  type: 'get',
  data
})

// 审核职位
export const auditPositionApi = data => request({
  url: `/position/audit/${data.id}`,
  type: 'put',
  data
})
