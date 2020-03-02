import { request } from './index.js'

// 职位搜索列表

export const GetInferiorResumeAPI = data =>
  request({
    url: '/resume/inferior/search',
    type: 'get',
    data
  })

//   入选劣质简历原因列表(ps：入选原因，不是审核原因)
  export const GetInferiorAllreasonAPI = data =>
  request({
    url: '/resume/inferior/all_reason',
    type: 'get',
    data
  })
//   分页获取劣质简历审核原因(ps：审核原因，不是入选原因)
  export const GetInferiorAuditreasonsAPI = data =>
  request({
    url: '/resume/inferior/audit_reasons',
    type: 'get',
    data
  })
  
