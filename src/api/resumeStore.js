import { request } from './index.js'

// 职位搜索列表
export const GetResumeAPI = data =>
  request({
    url: `/resume/search`,
    type: 'get',
    data
  })
/* 简历详情 */
export const GetResumeDetailsAPI = data =>
  request({
    url: `/resume/detail/uid/${data}`,
    type: 'get'
  })
/* 清空接口 */
export const removeAllLabel = uid =>
  request({
    url: `/resume/labels/${uid}`,
    type: 'delete'
  })
/* 简历详情 */
export const delateResume = uid =>
  request({
    url: `/resume/attach/${uid}`,
    type: 'delete'
  })

/* 简历标签 列表 */
export const resumelist = data =>
  request({
    url: `/label/resume/list`,
    type: 'get',
    data
  })
/* 创建标签  */
export const createLabel = data =>
  request({
    url: `/label/resume`,
    type: 'post',
    data
  })
/* 保存简历附件  */
export const saveResume = (uid, data) =>
  request({
    url: `/resume/attach/${uid}`,
    type: 'put',
    data
  })
/* 删除简历标签  */
export const delateLabel = (uid, id) => {
  request({
    url: `/resume/label/${uid}?id=${id}`,
    type: 'delete'
  })
}

/* 批量设置标签  */
export const confgiLabel = (uid, data) =>
  request({
    url: `/resume/labels/${uid}`,
    type: 'post',
    data
  })
// 获取所有学历定义
export const degreeListAPI = () =>
  request({
    url: `/degree/all`,
    type: 'get'
  })
// 创建微简历
export const createResume = (mobile, data) =>
  request({
    url: `/jobhunter/card/${mobile}`,
    type: 'post',
    data
  })
// 校验手机号码
export const haveMobile = mobile =>
  request({
    url: `/jobhunter/card/have/${mobile}`,
    type: 'get'
  })
// 顾问推荐邀约列表 - 处理状态列表、不合适原因列表 （作为邀约列表搜索条件）
export const dealStatus = () =>
  request({
    url: `/advisor/recommend/deal_status`,
    type: 'get'
  })
// 求职状态列表
export const jobhuntStatusAPI = data =>
  request({
    url: `/jobhunt_status/all`,
    type: 'get'
  })
// 创建推荐单
export const createOrder = (positionId, data) =>
  request({
    url: `/advisor/recommend/resume/${positionId}`,
    type: 'post',
    noGlobalLoading: false,
    data
  })
// 获取简历历史记录
export const GetResumeHistory = (uid, data) =>
  request({
    url: `/resume/history/${uid}`,
    type: 'get',
    noGlobalLoading: false,
    data
  })
// 获取简历历史记录
// export const recommendList = data =>
//   request({
//     url: `/advisor/recommend/interviews/search`,
//     type: "get",
//     data
//   });
// 推荐清单列表
export const recommendList = data =>
  request({
    url: `/advisor/recommend_lists/search`,
    type: 'get',
    data
  })
// 推荐清单列表
export const recommendDetail = uid =>
  request({
    url: `/advisor/recommend_list/${uid}`,
    type: 'get'
  })
// 添加简历历史记录
export const addHistory = (uid, data) =>
  request({
    url: `/resume/history/${uid}`,
    type: 'post',
    noGlobalLoading: false,
    data
  })

// 校验职位id
export const searchId = id =>
  request({
    url: `/position/recommend/${id}`,
    type: 'get',
    noGlobalLoading: false
  })
// 返点原因
export const refund = (uid, data) =>
  request({
    url: `/advisor/recommend/refund/${uid}`,
    type: 'post',
    data
  })
// 扣点原因
export const recommendPay = (uid, data) =>
  request({
    url: `/advisor/recommend/pay/${uid}`,
    type: 'post',
    data
  })
// 推荐人
export const userList = () =>
  request({
    url: `/advisor/user/list`,
    type: 'get'
  })
// 推荐清单成功失败原因
export const resultList = uid =>
  request({
    url: `/advisor/recommend_list/result/${uid}`,
    type: 'get',
    noGlobalLoading: false
  })
// 邀约进展列表
export const interviewsList = data =>
  request({
    url: `/advisor/recommend/interviews/search`,
    type: 'get',
    data
  })
/* 平台热门简历推荐 - 面试邀约搜索 */
export const getRecommendInterviewsSearchListApi = data => request({
  url: `/recommend/interviews/search`,
  type: 'get',
  data,
  noGlobalLoading: false
})

/* 获取简历等级 */
export const getResumeLevelApi = data =>
  request({
    url: `/resume_grade/all`,
    type: 'get'
  })

/* 设置简历等级 */
export const setResumeLevelApi = data => request({
  url: `/resume/grade/${data.uid}`,
  type: 'put',
  data,
  noGlobalLoading: false
})
