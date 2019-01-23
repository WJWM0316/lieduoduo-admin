import { request } from './index.js'


/* 公司审核列表 */
export const login = data => request({
  url: '/auth/login',
  type: 'post',
  data
})

/* 公司审核列表 */
export const templistApi = data => request({
  url: '/company/templist',
  type: 'get',
  data
})

/* 获取审核公司基本信息 */
export const getCompanyInfo = data => request({
  url: `/company/temp/${data}`,
  type: 'get'
})

/* 审核公司信息通过 */
export const temppassApi = data => request({
  url: `/company/temppass/${data}`,
  type: 'put'
})

/* 审核公司信息不通过 */
export const tempfailApi = data => request({
  url: `/company/tempfail/${data}`,
  type: 'put'
})

/* 审核人员信息通过 */
export const identityPassApi = data => request({
  url: `/identity/pass/${data}`,
  type: 'put'
})

/* 审核人员信息不通过 */
export const identityFailApi = data => request({
  url: `/identity/fail/${data}`,
  type: 'put'
})

/* 填写公司信息 */
export const setCompanyInfoApi = data => request({
  url: `/company`,
  type: 'post',
  data
})

/* 填写人员认证信息 */
export const setIdentityInfoApi = data => request({
  url: `/identity`,
  type: 'post',
  data
})
