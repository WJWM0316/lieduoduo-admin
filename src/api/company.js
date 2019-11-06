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
/* 在审核表创建公司 */
export const createCompanyApi = data => request({
  url: '/company/temp',
  type: 'post',
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
export const tempfailApi = (id, data) => request({
  url: `/company/tempfail/${id}`,
  type: 'put',
  data
})

/* 审核人员信息通过 */
export const identityPassApi = data => request({
  url: `/identity/pass/${data}`,
  type: 'put'
})

/* 审核人员信息不通过 */
export const identityFailApi = (id, data) => request({
  url: `/identity/fail/${id}`,
  type: 'put',
  data
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

/* 获取地址 */
export const getCompanyAdressApi = data => request({
  url: `/company/position/address/${data.id}`,
  type: 'get'
})

/* 修改地址 */
export const editCompanyAdressApi = data => request({
  url: `/company/position/address/${data.id}`,
  type: 'post',
  data
})

/* 删除地址 */
export const deleteCompanyAdressApi = data => request({
  url: `/company/position/address/${data.id}`,
  type: 'delete',
  data
})

/* 添加地址 */
export const addCompanyAdressApi = data => request({
  url: `/company/position/address`,
  type: 'put',
  data
})

/* 分页获取地址列表 */
export const getAdressListApi = data => request({
  url: `/company/position/simplepage/addresses`,
  type: 'get',
  data
})
/* 获取录入公司列表 */
export const getCompanyListApi = data => request({
  url: `/company/list`,
  type: 'get',
  data
})

/* 获取录入公司详情 */
export const getCompanyInfoApi = data => request({
  url: `/company/${data}`,
  type: 'get'
})

/* 删除公司 */
export const deleteCompanyApi = data => request({
  url: `/company/${data}`,
  type: 'delete'
})

/* 编辑公司 */
export const editCompanyApi = (id, data) => request({
  url: `/company/${id}`,
  type: 'put',
  data
})

/* 编辑身份信息 */
export const editIdentityApi = (id, data) => request({
  url: `/identity/${id}`,
  type: 'put',
  data
})

/* 编辑身份信息 */
export const getIdentityApi = (id, data) => request({
  url: `/identity/${id}`,
  type: 'get',
  data
})

/* 添加公司地址 */
export const addCompanyAddressApi = (id, data) => request({
  url: `/company/address/${id}`,
  type: 'put',
  data
})

/* 删除公司地址 */
export const delCompanyAddressApi = (id) => request({
  url: `/company/address/${id}`,
  type: 'delete'
})

/* 城市标签 */
export const getCityApi = () => request({
  url: `/area?level=3`,
  type: 'get'
})
/* 校验新公司名称是否被使用 */
export const checkCompanyNameApi = (data) => request({
  url: `/company/company_exist`,
  type: 'get',
  data,
  noGlobalLoading: false
})
// 绑定公司，检测公司是否存在
export const checkOldCompanyName = (data) => request({
  url: `/company/exist/${data}`,
  type: 'get',
  noGlobalLoading: false
})
/* 发送验证码到企业邮箱 */
export const sendEmailApi = (data) => request({
  url: `/company/mail`,
  type: 'post',
  data,
  noGlobalLoading: false
})
/* 验证企业邮箱 */
export const verifyEmailApi = (data) => request({
  url: `/company/verify`,
  type: 'post',
  data
})
/* 获取审核公司详情 */
export const getCheckCompanyInfoApi = (data) => request({
  url: `/company/temp/${data}`,
  type: 'get'
})
/* 编辑审核公司 */
export const editCheckCompanyInfoApi = (checkId, data) => request({
  url: `/company/edit_temp_company/${checkId}`,
  type: 'put',
  data
})
/* 检测手机号码绑定账号的身份 */
export const checkIdentityApi = (phone) => request({
  url: `/company/is_admin/${phone}`,
  type: 'get',
  noGlobalLoading: false
})
/* 公司绑定招聘官 */
export const bindCompanyApi = (companyId, data) => request({
  url: `/company/recruiter/bind/${companyId}`,
  type: 'post',
  data
})
/* 获取公司招聘官团队 */
export const getRecruitersListApi = (companyId, data) => request({
  url: `/company/recruiters/${companyId}`,
  type: 'get',
  data,
  noGlobalLoading: false
})
/* 解绑管理员 */
export const deleteAdminApi = (companyId, data) => request({
  url: `/company/admin/bind/${companyId}?newAdmin=${data.newAdmin}`,
  type: 'delete'
})
/* 解绑招聘官 */
export const deleteRecruiterApi = (companyId, uid) => request({
  url: `/company/recruiter/bind/${companyId}?uid=${uid}`,
  type: 'delete'
})
/* 编辑公司审核表跟进人 */
export const editCheckCompanyFollowUserApi = (companyId, uid, groupId) => request({
  url: `/company/company_temp_add_to_follow_user/${companyId}?admin_uid=${uid}&groupId=${groupId}`,
  type: 'put'
})
/* 用户表设置跟进人 */
export const editAdminNameApi = (uid, data) => request({
  url: `/usermanage/save_admin_uid_to_user/${uid}`,
  type: 'put',
  data
})
/* 编辑公司库表里跟进人 */
export const editCompanyFollowUserApi = (companyId, uid, groupId) => request({
  url: `/company/company_add_to_follow_user/${companyId}?admin_uid=${uid}&groupId=${groupId}`,
  type: 'put'
})
/* 获取审核表里的人员申请信息 */
export const getApplyUserInfoApi = (uid) => request({
  url: `/company/detail_company_apply_user_info/${uid}`,
  type: 'get'
})
/* 获取审核表里的人员申请信息 */
export const editApplyUserInfoApi = (uid, data) => request({
  url: `/company/update_company_apply_user_info/${uid}`,
  type: 'put',
  data
})
/* 审核表跟进人接口 */
export const companyTempUserList = () => request({
  url: `/company/company_temp_user_list`,
  type: 'get'
})

/* 设置客户等级 */
export const setCompanyCustomerLevelApi = data => request({
  url: `/company/set/customer_level/${data.id}`,
  type: 'put',
  data,
  noGlobalLoading: false
})

/* 设置客户等级 */
export const setCompanyCompanyLevelApi = data => request({
  url: `/company/set/company_temp_customer_level/${data.id}`,
  type: 'put',
  data,
  noGlobalLoading: false
})

/* 设置顾问跟进人 */
export const setCompanyCompanyAdvisorApi = data => request({
  url: `/company/set/advisor/${data.id}`,
  type: 'put',
  data,
  noGlobalLoading: false
})

/* 创建公司产品 */
export const addCompanyProductApi = data => request({
  url: `/company/product`,
  type: 'post',
  data,
  noGlobalLoading: false
})

/* 编辑公司产品 */
export const editCompanyProductApi = data => request({
  url: `/company/product/${data.id}`,
  type: 'put',
  data,
  noGlobalLoading: false
})

/* 获取某个公司产品产品 */
export const getCompanyProductApi = data => request({
  url: `/company/product/${data.id}`,
  type: 'get',
  noGlobalLoading: false
})

/* 删除公司产品 */
export const deleteCompanyProductApi = data => request({
  url: `/company/product/${data.id}`,
  type: 'get',
  noGlobalLoading: false
})

/* 获取公司产品列表 */
export const getCompanyProductListsApi = data => request({
  url: `/company/productlist/${data.id}`,
  type: 'get',
  data,
  noGlobalLoading: false
})

/* 获取地址 */
export const getAddressListsApi = data => request({
  url: `/area/level/${data.level}`,
  type: 'get',
  noGlobalLoading: false
})
