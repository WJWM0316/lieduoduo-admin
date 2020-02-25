import { request } from './index.js'

// 获取活动列表
export const getActivityList = data => request({
  url: '/zt/list',
  type: 'get',
  data
})

// 新增活动
export const addActivity = data => request({
  url: '/zt/add',
  type: 'post',
  data
})

// 编辑活动
export const setActivity = data => request({
  url: `/zt/edit/${data.id}`,
  type: 'post',
  data
})

// 获取单个专题活动
export const getActivityById = id => request({
  url: `/zt/detail/${id}`,
  type: 'get'
})

// 获取活动二维码
export const getActivityQrcode = data => request({
  url: '/activity/create/qr/code',
  type: 'post',
  data
})

// 获取活动栏目
export const getUnitList = data => request({
  url: '/zt/category/list',
  type: 'get',
  data
})

// 添加活动栏目
export const addUnit = data => request({
  url: '/zt/category/add',
  type: 'post',
  data
})

// 编辑活动栏目
export const setUnitById = data => request({
  url: `/zt/category/edit/${data.id}`,
  type: 'post',
  data
})

// 删除单条活动栏目
export const deleteUnit = data => request({
  url: `/zt/category/delete/${data.id}`,
  type: 'delete',
  data
})

// 添加栏目内容的tab
export const addUnitTab = data => request({
  url: '/zt/category/class/add',
  type: 'post',
  data
})

// 获取栏目tab 列表
export const getUnitTabs = data => request({
  url: '/zt/category/class/list',
  type: 'get',
  data
})

// 编辑栏目tab 内容
export const setUnitTab = data => request({
  url: `/zt/category/class/edit/${data.id}`,
  type: 'post',
  data
})

// 删除栏目tab
export const deleteUnitTab = data => request({
  url: `/zt/category/class/delete/${data.id}`,
  type: 'delete',
  data
})

// 栏目tab填充id
export const addUnitTabIds = data => request({
  url: '/zt/category/type/add',
  type: 'post',
  data
})

// 获取栏目tab的详情信息
export const getUnitTabDetails = data => request({
  url: '/zt/category/type/list',
  type: 'get',
  data
})

// 设置栏目tab详情信息
export const setUnitTabDetails = data => request({
  url: `/zt/category/type/edit/${data.id}`,
  type: 'post',
  data
})

// 删除栏目tab
export const deleteUnitTabDetails = data => request({
  url: `/zt/category/type/delete/${data.id}`,
  type: 'delete',
  data
})

// 栏目tab详情图片获取
export const getUnitTabImages = data => request({
  url: `/zt/category/type/image/detail/${data.id}`,
  type: 'get'
})

// 栏目tab详情图片更新
export const setUnitTabImages = data => request({
  url: `/zt/category/type/image/edit/${data.id}`,
  type: 'post',
  data
})

// 栏目tab详情文字获取
export const getUnitTabTexts = data => request({
  url: `/zt/category/type/text/detail/${data.id}`,
  type: 'get'
})

// 栏目tab详情文字更新
export const setUnitTabTexts = data => request({
  url: `/zt/category/type/text/edit/${data.id}`,
  type: 'post',
  data
})

// 栏目tab详情职位
export const getUnitPositions = data => request({
  url: `/zt/category/type/position/detail/${data.id}`,
  type: 'get'
})

// 设置栏目tab详情职位
export const setUnitPositions = data => request({
  url: `/zt/category/type/position/edit/${data.id}`,
  type: 'post',
  data
})
