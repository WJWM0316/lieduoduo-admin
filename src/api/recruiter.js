import { request } from './index.js'

/* 招聘官审核列表 */
export const getRecruiterListApi = data => request({
  url: '/applyjoin/newList',
  type: 'get',
  data
})

/* 招聘官审核详情 */
export const getReviewDetailsApi = data => request({
  url: `/applyjoin/${data}`,
  type: 'get'
})

/* 校验手机号码 */
export const detectionMobileApi = data => request({
  url: `/usermanage/is_existed/mobile`,
  type: 'post',
  data,
  noGlobalLoading: true
})
/* 身份证信息校验 */
export const checkUserauthApi = data => request({
  url: `/usermanage/userauth`,
  type: 'post',
  data
})
/* 身份证信息编辑并校验 */
export const editUserauthApi = (uid, data) => request({
  url: `/usermanage/userauth/${uid}`,
  type: 'post',
  data
})
/* 创建用户 */
export const createdUserApi = data => request({
  url: `/usermanage/user`,
  type: 'post',
  data
})
/* 编辑用户 */
export const editUserApi = (uid, data) => request({
  url: `/usermanage/user/${uid}`,
  type: 'put',
  data
})
/* 获取用户列表 */
export const getUserListApi = data => request({
  url: `/usermanage/users/search`,
  type: 'get',
  data
})
/* 获取用户详情 */
export const getUserInfoApi = data => request({
  url: `/usermanage/user/detail/${data}`,
  type: 'get',
  noGlobalLoading: true
})
/* 开启招聘官发布职位权限 */
export const onCreatedRightApi = data => request({
  url: `/usermanage/create_position/block/${data}`,
  type: 'delete'
})
/* 关闭招聘官发布职位权限 */
export const offCreatedRightApi = data => request({
  url: `/usermanage/create_position/block/${data}`,
  type: 'post'
})
/* 编辑招聘官信息 */
export const editOffCreatedApi = (uid, data) => request({
  url: `/usermanage/recruiter/${uid}`,
  type: 'post',
  data
})
/* 设置为需要身份认证 */
export const setDemandIdentityApi = (uid) => request({
  url: `/usermanage/real_name/demand/${uid}`,
  type: 'delete'
})
/* 设置不需要身份认证 */
export const delDemandIdentityApi = (uid) => request({
  url: `/usermanage/real_name/demand/${uid}`,
  type: 'post'
})
/* 关闭发布职位权限 */
export const closePublicPosisionApi = data => request({
  url: `/usermanage/create_position/block/${data.uid}`,
  type: 'post'
})

/* 开启发布职位权限 */
export const openPublicPosisionApi = data => request({
  url: `/usermanage/create_position/block/${data.uid}`,
  type: 'delete'
})

/* 获取招聘官基本信息 */
export const getRecruiterBaseInfoApi = data => request({
  url: `/recruiter/baseInfo/${data.uid}`,
  type: 'get'
})

/* 获取招聘官个人简介 */
export const getRecruiterBriefApi = data => request({
  url: `/recruiter/brief/${data.uid}`,
  type: 'get'
})

/* 获取招聘官个人标签 */
export const getRecruiterLabelApi = data => request({
  url: `/recruiter/label/${data.uid}`,
  type: 'get'
})

/* 获取招聘官个人标签 */
export const editUsermanageInfosApi = data => request({
  url: `/usermanage/recruiter/${data.uid}`,
  type: 'post',
  data
})

/* 设置招聘官个人简介 */
export const setRecruiterBriefApi = data => request({
  url: `/recruiter/brief/${data.uid}`,
  type: 'post',
  data
})

/* 创建职业技能标签 */
export const createLabelProfessionalSkillsApi = data => request({
  url: `/label/professionalSkills/${data.uid}`,
  type: 'post',
  data
})

/* 获取招聘官个人标签 */
export const getRecruiterLabelsListsApi = data => request({
  url: `/recruiter/label/${data.uid}`,
  type: 'get'
})

/* 创建职业技能标签 */
export const addProfessionalSkillsLabelApi = data => request({
  url: `/label/professionalSkills/${data.uid}`,
  type: 'post',
  data,
  noGlobalLoading: false
})

/* 设置招聘官个人标签 */
export const setRecruiterLabelsApi = data => request({
  url: `/recruiter/label/${data.uid}`,
  type: 'post',
  data,
  noGlobalLoading: true
})

/* 获取生活标签 */
export const getLifeLabelsListsApi = data => request({
  url: `/label/life`,
  type: 'get',
  noGlobalLoading: true
})

/* 添加生活标签 */
export const addLifeLabelsApi = data => request({
  url: `/label/life/${data.uid}`,
  type: 'post',
  data,
  noGlobalLoading: false
})
