/**
 * 课程模块api
 */
import { request } from './index.js'

// 职位搜索列表
export const getListApi = data => request({
  url: `/position/list`,
  type: 'get',
  data,
  noGlobalLoading: false // 不需要loading
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
  url: `/position/${data.id}`,
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

// 职业标签列表
export const getLabelPositionListApi = data => request({
  url: `/label/position`,
  type: 'get',
  data
})

// 职业类型列表
export const getPositionTypeListApi = data => request({
  url: `/label/positionType`,
  type: 'get',
  data
})

// 搜索-职业标签
export const searchPositionApi = data => request({
  url: `/search/position`,
  type: 'get',
  data
})

// 职位技能列表
export const professionalSkillsApi = data => request({
  url: `/label/professionalSkills`,
  type: 'get',
  data
})

// 开放职位
export const openPositionApi = data => request({
  url: `/position/open/${data.id}`,
  type: 'put',
  noGlobalLoading: false // 不需要loading
})

// 创建职位地址
export const createPositionAddressApi = data => request({
  url: `/company/position/address`,
  type: 'put',
  data,
  noGlobalLoading: false // 不需要loading
})

// 编辑职位地址
export const editPositionAddressApi = data => request({
  url: `/company/position/address/${data.id}`,
  type: 'post',
  data,
  noGlobalLoading: false // 不需要loading
})

// 获取职位地址
export const getPositionAddressApi = data => request({
  url: `/company/position/address/${data.id}`,
  type: 'get',
  noGlobalLoading: false // 不需要loading
})
