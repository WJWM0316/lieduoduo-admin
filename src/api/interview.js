
import { request } from './index.js'

/* 面试申请列表 */
export const getApplyListApi = data => request({
  url: '/interview/apply',
  type: 'get',
  data
})
/* 获取不合适评价内容 */
export const getInterviewComment = uid => request({
  url: `/interview/getInterviewComment?interviewId=${uid}`,
  type: 'get'
})
/* 获取面试状态列表 */
export const getInterviewStatusType = uid => request({
  url: `/interview/getInterviewStatusType`,
  type: 'get'
})
/* 获取申请不合适二级列表 */
export const getNotSuitTypeList = uid => request({
  url: `/interview/getApplyNotSuitTypeList`,
  type: 'get'
})
/* 获取邀约不合适二级列表 */
export const getInviteNotSuitTypeList = uid => request({
  url: `/interview/getInviteNotSuitTypeList`,
  type: 'get'
})
/* 获取申请列表面试状态一级列表 */
export const getApplyInterviewStatusType = uid => request({
  url: `/interview/getApplyInterviewStatusType`,
  type: 'get'
})
/* 获取申请列表面试状态一级列表 */
export const getInviteInterviewStatusType = uid => request({
  url: `/interview/getInviteInterviewStatusType`,
  type: 'get'
})
/* 面试邀请列表 */
export const getInviteListApi = data => request({
  url: '/interview/invite',
  type: 'get',
  data
})

/* 获取简历小程序码 */
export const getResumeCodeUrlApi = data => request({
  url: '/resume/get_resume_code_url',
  type: 'get',
  data,
  noGlobalLoading: false // 不需要loading
})

/* 获取招聘官主页小程序码 */
export const getRecruiterCodeUrlApi = data => request({
  url: '/applyjoin/get_recruiter_code_url',
  type: 'get',
  data,
  noGlobalLoading: false
})

/* 获取职位详情小程序码 */
export const getPositionCodeUrlApi = data => request({
  url: '/get_position_code_url',
  type: 'get',
  data,
  noGlobalLoading: false
})

/* 24h急速反馈列表 */
export const getQuickApplyInterviewApi = data => request({
  url: '/interview/quickApply',
  type: 'get',
  data,
  noGlobalLoading: false
})

/* 不合适面试撤回 */
export const interviewRetractApi = data => request({
  url: `/interview/interviewRetract/${data.jobhunterUid}`,
  type: 'put',
  data,
  noGlobalLoading: false
})

/* 确定约面 */
export const confirmInterviewApi = data => request({
  url: `/interview/confirm/${data.interviewId}`,
  type: 'post',
  noGlobalLoading: false
})

/* 获取面试评价不满意标签 */
export const getInterviewCommentReasonApi = data => request({
  url: `/interview/getCommentReason`,
  type: 'get',
  noGlobalLoading: false
})

/* 获取面试过程中不合适标签 */
export const getInterviewNotSuitReasonApi = data => request({
  url: `/interview/getInterviewNotSuitReason`,
  type: 'get',
  noGlobalLoading: false
})

/* 标记不合适 */
export const refuseJobhunterUidInterviewApi = data => request({
  url: `/interview/refuse/${data.jobhunterUid}`,
  type: 'post',
  data,
  noGlobalLoading: false
})

/* 设置面试安排 */
export const setInterviewInfoApi = data => request({
  url: `/interview/setInterviewInfo/${data.interviewId}`,
  type: 'post',
  data,
  noGlobalLoading: false
})

/* 分页获取地址列表 */
export const getSimplepageAddressesListsApi = data => request({
  url: '/company/position/simplepage/addresses',
  type: 'get',
  data,
  noGlobalLoading: false
})

/* 设置候选人是否到场 */
export const setUserInterviewAttendApi = data => request({
  url: '/interview/attend',
  type: 'put',
  data,
  noGlobalLoading: false
})

/* 面试评价(设置感兴趣) */
export const setUserInterviewCommentApi = data => request({
  url: '/interview/interviewComment',
  type: 'post',
  data
})

/* 获取面试的一级状态列表 */
export const getInterviewFisrtStatusListsApi = data => request({
  url: `/interview/quickApplyInterviewStatus`,
  type: 'get'
})

/* 获取面试的二级状态列表 */
export const getInterviewSecondStatusListsApi = data => request({
  url: `/interview/getApplyNotSuitTypeList`,
  type: 'get'
})

/* 获取面试的二级状态列表 */
export const testDeleteApi = data => request({
  url: `/interview/getApplyNotSuitTypeList`,
  type: 'delete'
})

/* 代客操作接受邀约 */
export const confirmvaletInterview = data => request({
  url: `/interview/jobhunter/confirm/${data.interviewId}`,
  type: 'post',
  noGlobalLoading: false
})

/* 代客操作暂不考虑 */
export const mvaletnoConsider = data => request({
  url: `/interview/jobhunter/refuse/${data.interviewId}`,
  type: 'post',
  noGlobalLoading: false
})

/* 代客操作确认面试安排信息 */
export const confirmArrangementInfo = data => request({
  url: `/interview/jobhunter/confirmArrangementInfo/${data.interviewId}`,
  type: 'post',
  noGlobalLoading: false
})

/* 代客操作修改面试时间 */
export const editScheduletime = data => request({
  url: `/interview/schedule/time/${data.interviewId}`,
  type: 'post',
  data,
  noGlobalLoading: false
})

/* 代客操作约聊列表代求职者设置约聊不感兴趣 */
export const darenotinterestApi = data => request({
  url: `/chat/jobhunter_not_interest/${data.chatId}`,
  type: 'post',
  data,
  noGlobalLoading: false
})

/* 代客操作约聊列表代招聘官设置约聊不合适 */
export const inappropriateApi = data => request({
  url: `/chat/recruiter_not_interest/${data.chatId}`,
  type: 'post',
  data,
  noGlobalLoading: false
})

/* 代客操作约聊列表代求职者聊一聊 */
export const jobhunteracceptchatApi = data => request({
  url: `/chat/jobhunter_accept/${data.chatId}`,
  type: 'put',
  data,
  noGlobalLoading: false
})

/* 代客操作约聊列表代招聘官聊一聊 */
export const recruiteracceptchatApi = data => request({
  url: `/chat/recruiter_accept/${data.chatId}`,
  type: 'put',
  data,
  noGlobalLoading: false
})

/* 获取约聊不合适原因列表 */
export const chatresonlist = data => request({
  url: '/chat/not_interest/all_reason',
  type: 'get'
})
