import { request } from './index.js'

// 职位搜索列表
export const setBaseInfoApi = data =>
  request({
    url: `/jobhunter/resume/baseInfo/${data.uid}`,
    type: 'post',
    data
  })

/* 设置更多介绍 */
export const setIntroduceApi = data =>
  request({
    url: `/jobhunter/resume/introduce/${data.uid}`,
    type: 'post',
    data
  })

/* 保存附件简历 */
export const setAttachResumeApi = data =>
  request({
    url: `/jobhunter/resume/attach_resume/${data.uid}`,
    type: 'post',
    data
  })

/* 新增求职意向 */
export const setExpectApi = data =>
  request({
    url: `/jobhunter/resume/expect/${data.uid}`,
    type: 'post',
    data
  })

/* 新建工作经历 */
export const setCareerApi = data =>
  request({
    url: `/jobhunter/resume/career/${data.uid}`,
    type: 'post',
    data
  })

/* 添加项目经历 */
export const setProjectApi = data =>
  request({
    url: `/jobhunter/resume/project/${data.uid}`,
    type: 'post',
    data
  })

/* 添加教育经历 */
export const setEducationApi = data =>
  request({
    url: `/jobhunter/resume/education/${data.uid}`,
    type: 'post',
    data
  })

/* 设置个性标签 */
export const setLabelsApi = data =>
  request({
    url: `/jobhunter/resume/labels/${data.uid}`,
    type: 'post',
    data
  })

// 职位搜索列表
export const getBaseInfoApi = data =>
  request({
    url: `/jobhunter/resume/baseInfo/${data.uid}`,
    type: 'get',
    data
  })

/* 设置更多介绍 */
export const getIntroduceApi = data =>
  request({
    url: `/jobhunter/resume/introduce/${data.uid}`,
    type: 'get',
    data
  })

/* 保存附件简历 */
export const getAttachResumeApi = data =>
  request({
    url: `/jobhunter/resume/attach_resume/${data.uid}`,
    type: 'get',
    data
  })

/* 新增求职意向 */
export const getExpectApi = data =>
  request({
    url: `/jobhunter/resume/expect/${data.uid}`,
    type: 'get',
    data
  })

/* 新建工作经历 */
export const getCareerApi = data =>
  request({
    url: `/jobhunter/resume/career/${data.uid}`,
    type: 'get',
    data
  })

/* 添加项目经历 */
export const getProjectApi = data =>
  request({
    url: `/jobhunter/resume/project/${data.uid}`,
    type: 'get',
    data
  })

/* 添加教育经历 */
export const getEducationApi = data =>
  request({
    url: `/jobhunter/resume/education/${data.uid}`,
    type: 'get',
    data
  })

/* 设置个性标签 */
export const getLabelsApi = data =>
  request({
    url: `/jobhunter/resume/labels/${data.uid}`,
    type: 'get',
    data
  })

/* 编辑求职意向 */
export const putExpectApi = data =>
  request({
    url: `/jobhunter/resume/expect/${data.uid}/${data.id}`,
    type: 'put',
    data
  })

/* 编辑工作经历 */
export const putCareerApi = data =>
  request({
    url: `/jobhunter/resume/career/${data.uid}/${data.id}`,
    type: 'put',
    data
  })

/* 编辑项目经历 */
export const putProjectApi = data =>
  request({
    url: `/jobhunter/resume/project/${data.uid}/${data.id}`,
    type: 'put',
    data
  })

/* 编辑教育经历 */
export const putEducationApi = data =>
  request({
    url: `/jobhunter/resume/education/${data.uid}/${data.id}`,
    type: 'put',
    data
  })

/* 删除附件 */
export const deleteAttachApi = data =>
  request({
    url: `/jobhunter/resume/attach_resume/${data}`,
    type: 'delete'
  })

/* 删除求职意向 */
export const deleteExpectApi = data =>
  request({
    url: `/jobhunter/resume/expect/${data.uid}/${data.id}`,
    type: 'delete',
    data
  })

/* 删除工作经历 */
export const deleteCareerApi = data =>
  request({
    url: `/jobhunter/resume/career/${data.uid}/${data.id}`,
    type: 'delete',
    data
  })

/* 删除项目经历 */
export const deleteProjectApi = data =>
  request({
    url: `/jobhunter/resume/project/${data.uid}/${data.id}`,
    type: 'delete',
    data
  })

/* 删除教育经历 */
export const deleteEducationApi = data =>
  request({
    url: `/jobhunter/resume/education/${data.uid}/${data.id}`,
    type: 'delete',
    data
  })

/* 生活标签表 */
export const getLifeLabelApi = data =>
  request({
    url: `/label/life`,
    type: 'get'
  })
