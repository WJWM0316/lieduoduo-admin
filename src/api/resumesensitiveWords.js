import { request } from './index.js'

// 简历敏感词列表
export const getsensitivelist = data =>
  request({
    url: '/sensitive/list',
    type: 'get',
    data
  })

// 添加简历敏感词
export const AddSensitiveAPI = data =>
  request({
    url: '/sensitive/add',
    type: 'post',
    data
  })

// 获取简历敏感词
export const GetSensitiveinfoAPI = data =>
  request({
    url: `/sensitive/info/${data.id}`,
    type: 'get',
    data
  })

// 删除简历敏感词
export const deleteSensitiveApi = data =>
  request({
    url: `/sensitive/del/${data.id}`,
    type: 'delete',
    data
  })

// 编辑简历敏感词
export const putSensitiveEditApi = data =>
  request({
    url: `/sensitive/edit/${data.id}`,
    type: 'put',
    data
  })
