<!--  -->
<template>
  <div class="OrderDetail">
    <div class="TabView">
      <div class="createOrder">
        <!-- <p class="title">新建简历</p> -->
        <div class="CreateContent">
          <h4 class="classifyTitle">基本信息 <span class="edit_span" v-if="!isEditForm1" @click="setEdit(1)">编辑</span></h4>
          <div class="infoCont" v-if="!isEditForm1">
            <div class="line_blo">
              <div class="row_blo">
                <span class="label_name">手机号:</span>
                <div class="label_value">{{editMsg.mobile}}</div>
              </div>
              <div class="row_blo">
                <span class="label_name">头像:</span>
                <img class="row_img" v-if="editMsg.avatar" :src="editMsg.avatar.middleUrl">
              </div>
            </div>

            <div class="line_blo">
              <div class="row_blo">
                <span class="label_name">姓名:</span>
                <div class="label_value">{{editMsg.name}}</div>
              </div>
              <div class="row_blo">
                <span class="label_name">性别:</span>
                <div class="label_value">{{editMsg.gender === 1 ? '男' : '女'}}</div>
              </div>
            </div>

            <div class="line_blo">
              <div class="row_blo">
                <span class="label_name">出生年月:</span>
                <div class="label_value" v-if="editMsg.birth">{{time(editMsg.birth*1000)}}</div>
              </div>
              <div class="row_blo">
                <span class="label_name">参加工作时间:</span>
                <div class="label_value" v-if="editMsg.startWorkYear">{{time(editMsg.startWorkYear*1000)}}</div>
              </div>
            </div>
            <div class="line_blo">
              <div class="row_blo">
                <span class="label_name">求职状态:</span>
                <div class="label_value" v-if="editMsg.jobStatus">{{editMsg.jobStatus | getJobStatus}}</div>
              </div>

              <div class="row_blo">
                <span class="label_name">微信号:</span>
                <div class="label_value">{{editMsg.wechat}}</div>
              </div>
            </div>
            <div class="line_blo">
              <div class="row_blo">
                <span class="label_name">自我描述:</span>
                <div class="label_value">{{editMsg.signature}}</div>
              </div>
            </div>
          </div>
          <el-form :model="form1" :rules="rules" ref="form1" class="demo-ruleForm" v-else>
            <el-form-item label-width="80px" prop="mobile" label="手机号码" class="formItem">
              <el-input disabled v-model.number="form1.mobile" ></el-input>
              <span class="editMoile" @click.stop="editMoile">换个手机</span>
            </el-form-item>

            <el-form-item label-width="80px" label="头像" class="formItem" prop="name">
              <image-uploader :width="iconUploader.width"
                              :height="iconUploader.height"
                              :src="iconUploader.src"
                              type="headicon"
                              @loaded="handleIconLoaded"/>
            </el-form-item>
            <el-form-item label-width="80px" label="姓名" class="formItem" prop="name">
              <el-input v-model="form1.name"></el-input>
            </el-form-item>
            <el-form-item label="性别" prop="gender" class="formItem" label-width="80px">
              <el-radio-group v-model="form1.gender">
                <el-radio label="1">男</el-radio>
                <el-radio label="2">女</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="出生年月" label-width="80px" prop="birth" class="formItem" required>
              <el-date-picker
                type="date"
                placeholder="选择日期"
                v-model="form1.birth"
                value-format="timestamp"
                format="yyyy 年 MM 月 dd 日"
                style="width: 142px"
              ></el-date-picker>
            </el-form-item>

            <el-form-item label-width="80px" prop="startWorkYear" label="工作时间" class="formItem">
              <el-date-picker
                class="datapicker"
                type="date"
                placeholder="选择日期"
                v-model="form1.startWorkYear"
                value-format="timestamp"
                style="width: 142px"
              ></el-date-picker>
            </el-form-item>

            <el-form-item label-width="80px" label="求职状态" class="formItem" prop="jobStatus">
              <el-select
                v-model="form1.jobStatus "
                placeholder="求职状态"
              >
                <el-option v-for="item in jobhuntStatus" :key="item.value" :label="item.text" :value="item.value"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label-width="80px" label="微信号" class="formItem" prop="wechat">

              <el-input placeholder="请输入微信号" v-model="form1.wechat"></el-input>
            </el-form-item>

            <el-form-item label="自我描述" prop="signature">
              <el-input
                style="width: 300px; float: left;margin-left: 90px;"
                type="textarea"
                :rows="6"
                placeholder="请填写自我描述,150以内"
                v-model="form1.signature">
              </el-input>
            </el-form-item>

            <el-form-item class="formItem submit">
              <el-button size="medium" @click="handleCancle('1')">取消</el-button>
              <el-button size="medium" type="primary" @click="handleSubmit(1)">确定</el-button>
            </el-form-item>
            <!-- <el-form-item class="formItem">
              <el-button type="primary" @click="submitForm('form')">立即创建</el-button>
            </el-form-item> -->
          </el-form>
          <template v-if="haveCard!==0">
            <h4 class="classifyTitle">个性标签<span class="edit_span" v-if="!isEditForm2" @click="setEdit(2)">编辑</span></h4>
            <div class="infoCont" v-if="!isEditForm2">
              <div class="line_blo">
                <div class="row_blo">
                  <span class="label_name">个性标签:</span>
                  <div class="label_value formItem">
                    <div class="selectedList selectCont">
                      <div class="selected_span" v-for="(item, index) in editMsg.personalizedLabels" :key="index">{{item.labelName}}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <el-form :model="form2" :rules="rules" ref="form2" class="demo-ruleForm"  v-else>
              <el-form-item label-width="80px" label="职业素养" class="formItem" prop="literacyLabels">
                <el-select
                  filterable
                  default-first-option
                  @change="changeLiteracyLabels"
                  placeholder="请选择">
                  <el-option
                    v-for="item in professionalLiteracyList"
                    :key="item.labelId"
                    :label="item.name"
                    :value="item.labelId">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label-width="80px" label="职业技能" class="formItem" prop="skillLabels">
                <el-select
                  v-model="skillSelectText"
                  filterable
                  default-first-option
                  @change="changeSetSkillLabels"
                  placeholder="请选择行业">
                  <el-option
                    v-for="item in professionalSkillsList"
                    :key="item.labelId"
                    :label="item.name"
                    :value="item.labelId">
                  </el-option>
                </el-select>
                <el-select
                  filterable
                  default-first-option
                  @change="changeSkillLabels"
                  placeholder="请选择技能">
                  <el-option
                    v-for="item in skillLabelsList"
                    :key="item.labelId"
                    :label="item.name"
                    :value="item.labelId">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label-width="80px" label="生活标签" class="formItem" prop="lifeLabels">
                <el-select
                  filterable
                  default-first-option
                  @change="changeLifeLabels"
                  placeholder="请选择">
                  <el-option
                    v-for="item in lifeLabelsList"
                    :key="item.labelId"
                    :label="item.name"
                    :value="item.labelId">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label-width="80px" label="性格标签" class="formItem" prop="lifeLabels">
                <el-select
                  filterable
                  default-first-option
                  @change="changeCharacterLabels"
                  placeholder="请选择">
                  <el-option
                    v-for="item in characterLabelsList"
                    :key="item.labelId"
                    :label="item.name"
                    :value="item.labelId">
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item label-width="110px" label="已选择职业标签" class="formItem" >
                <div class="selectedList">
                  <div class="selected_span" v-for="(item, index) in selectedJobList" @click="deleteLabel('job',index)" :key="index">{{item.name || item.labelName}}</div>
                </div>
              </el-form-item>
              <el-form-item label-width="110px" label="已选择生活标签" class="formItem" >
                <div class="selectedList">
                  <div class="selected_span" v-for="(item, index) in selectedLifeList" @click="deleteLabel('life',index)" :key="index">{{item.name || item.labelName}}</div>
                </div>
              </el-form-item>

              <el-form-item class="formItem submit">
                <el-button size="medium" @click="handleCancle('2')">取消</el-button>
                <el-button size="medium" type="primary" @click="handleSubmit(2)">确定</el-button>
              </el-form-item>
            </el-form>

            <h4 class="classifyTitle">
              求职意向
              <el-button class="titleAdd" size="medium" type="primary" @click="addBlock(3)">添加求职意向</el-button>
            </h4>
            <el-form :model="form3" :rules="rules" ref="form3" class="demo-ruleForm" v-if="isEditForm3">
              <el-form-item label="期望城市" label-width="80px" class="formItem" prop="cityNum">
                <el-cascader
                  v-model="form3.cityNum"
                  ref="cityChoice"
                  placeholder="期望城市"
                  :options="getCityList"
                  filterable
                  :props="{
                    value:'areaId',
                    label:'title',
                    children:'children'
                  }"
                  @change="changeCity"
                ></el-cascader>
              </el-form-item>
              <el-form-item class="formItem" label-width="80px" label="期待职位" prop="positionId">
                <el-cascader
                  v-model="form3.positionId"
                  ref="cascader"
                  class="formItem"
                  placeholder="期待职位类别"
                  :options="options"
                  filterable
                  @change="changepositionId"
                  :props="{
                    value:'labelId',
                    label:'name',
                    children:'children'
                  }"
                ></el-cascader>
              </el-form-item>
              <el-form-item label="期望薪资" prop="salaryFloor" class="formItem" label-width="80px" >
                <div style="display: flex;justify-content: flex-start;">
                  <el-select
                    v-model="form3.salaryFloor "
                    placeholder="最低薪资"
                    @change="changeMin"
                    style="margin-right: 20px;"
                  >
                    <el-option v-for="item in minSalary" :key="item" :label="item+'k'" :value="item"></el-option>
                  </el-select>

                  <el-select
                    v-model="form3.salaryCeil"
                    placeholder="最高薪资"
                    @change="choiceMax"
                  >
                    <el-option v-for="item in maxSalary" :key="item" :label="item+'k'" :value="item"></el-option>
                  </el-select>
                </div>
              </el-form-item>

              <el-form-item label-width="80px" label="期望领域" class="formItem" prop="fieldIds">
                <el-select :multiple-limit="3" multiple collapse-tags v-model="form3.fieldIds" placeholder="请选择" @change="changefieldIds">
                  <el-option
                    v-for="item in fieldList"
                    :key="item.labelId"
                    :label="item.name"
                    :value="item.labelId"
                  ></el-option>
                </el-select>
              </el-form-item>

              <el-form-item class="formItem submit">
                <el-button size="medium" @click="handleCancle('3')">取消</el-button>
                <el-button size="medium" type="primary" @click="handleSubmit(3)">确定</el-button>
              </el-form-item>
            </el-form>
            <div class="infoCont" v-for="(item,index) in editMsg.expects" :key="index"  v-else>
              <span class="info_edit" v-if="!isEditForm3" @click="setEdit(3,item)">编辑</span>
              <span class="info_delete" v-if="!isEditForm3 && editMsg.expects.length>1" @click="setDelete(3,item)">删除</span>
              <div class="line_blo">
                <div class="row_blo">
                  <span class="label_name">期望城市:</span>
                  <div class="label_value">{{item.city}}</div>
                </div>
                <div class="row_blo">
                  <span class="label_name">期望职位:</span>
                  <div class="label_value">{{item.position}}</div>
                </div>
              </div>
              <div class="line_blo">
                <div class="row_blo">
                  <span class="label_name">期望薪资:</span>
                  <div class="label_value" v-if="item.salaryFloor">{{item.salaryFloor}}k-{{item.salaryCeil}}k</div>
                </div>
                <div class="row_blo">
                  <span class="label_name">期望领域:</span>
                  <div class="label_value" v-if="item.fields">
                    <span class="value_span" v-for="(item2,index) in item.fields" :key="index">{{item2.field}}</span>
                  </div>
                </div>
              </div>
            </div>

            <h4 class="classifyTitle">
              工作经历
              <el-button class="titleAdd" size="medium" type="primary" @click="addBlock(4)">添加工作经历</el-button>
            </h4>
            <el-form :model="form4" :rules="rules4" ref="form4" class="demo-ruleForm" v-if="isEditForm4">

              <el-form-item label-width="80px" label="公司名称" class="formItem" prop="company">
                <el-input placeholder="请输入公司名称" v-model="form4.company"></el-input>
              </el-form-item>

              <el-form-item label-width="80px" label="职位类别" class="formItem" prop="positionTypeId">
                  <el-cascader
                    v-model="form4.positionTypeId"
                    ref="cascader"
                    class="formItem"
                    placeholder="期待职位类别"
                    :options="options"
                    filterable
                    :props="{
                      value:'labelId',
                      label:'name',
                      children:'children'
                    }"
                    @change="changePostion1"
                  ></el-cascader>
              </el-form-item>

              <el-form-item label-width="80px" label="职位名称" class="formItem" prop="position">
                <el-input placeholder="请输入职位名称" v-model="form4.position"></el-input>
              </el-form-item>

              <el-form-item label-width="80px" label="开始时间" class="formItem" prop="startTime">
                <el-date-picker
                  type="date"
                  placeholder="选择日期"
                  value-format="timestamp"
                  v-model="form4.startTime"
                  style="width: 100%;"
                ></el-date-picker>
              </el-form-item>
              <el-form-item  label-width="80px" label="结束时间" class="formItem" prop="endTime">
                  <el-date-picker
                    type="date"
                    placeholder="选择日期"
                    value-format="timestamp"
                    v-model="form4.endTime"
                    style="width: 100%;"
                  ></el-date-picker>
              </el-form-item>

              <el-form-item label-width="80px" label="技能标签" prop="labelIds">
                <el-select
                  style="width: 300px;float: left;margin-left: 80px;"
                  v-model="form4.labelIds"
                  multiple
                  :multiple-limit="3"
                  filterable
                  allow-create
                  default-first-option
                  placeholder="请选择">
                  <el-option
                    v-for="item in optionsSkills"
                    :key="item.labelId"
                    :label="item.name"
                    :value="item.labelId">
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="工作内容" prop="duty">
                <el-input
                  style="width: 300px; float: left;margin-left: 80px;"
                  type="textarea"
                  :rows="6"
                  placeholder="工作内容1000以内"
                  v-model="form4.duty">
                </el-input>
              </el-form-item>

              <el-form-item class="formItem submit">
                <el-button size="medium" @click="handleCancle('4')">取消</el-button>
                <el-button size="medium" type="primary" @click="handleSubmit(4)">确定</el-button>
              </el-form-item>
            </el-form>
            <div class="infoCont" v-for="(item,index) in editMsg.careers" :key="index" v-else>
              <span class="info_edit" v-if="!isEditForm4" @click="setEdit(4,item)">编辑</span>
              <span class="info_delete" v-if="!isEditForm4 && editMsg.careers.length>1" @click="setDelete(4,item)">删除</span>
              <div class="line_blo">
                <div class="row_blo">
                  <span class="label_name">公司名称:</span>
                  <div class="label_value">{{item.company}}</div>
                </div>
                <div class="row_blo">
                  <span class="label_name">职位类别:</span>
                  <div class="label_value">{{item.positionType}}</div>
                </div>
              </div>

              <div class="line_blo">
                <div class="row_blo">
                  <span class="label_name">职位名称:</span>
                  <div class="label_value">{{item.position}}</div>
                </div>
                <div class="row_blo">
                  <span class="label_name">开始时间:</span>
                  <div class="label_value">{{item.startTimeDesc}}</div>
                </div>
              </div>

              <div class="line_blo">
                <div class="row_blo">
                  <span class="label_name">结束时间:</span>
                  <div class="label_value">{{item.endTimeDesc}}</div>
                </div>
                <div class="row_blo">
                  <span class="label_name">技能标签:</span>
                  <div class="label_value">
                    <span class="value_span" v-for="(item2,index) in item.technicalLabels" :key="index"> {{item2.labelName}}  </span>
                  </div>
                </div>
              </div>
              <div class="line_blo">
                <div class="row_blo">
                  <span class="label_name">工作内容:</span>
                  <div class="label_value">{{item.duty}}</div>
                </div>

              </div>
            </div>

            <h4 class="classifyTitle">
              项目经历
              <el-button class="titleAdd" size="medium" type="primary" @click="addBlock(5)">添加项目经历</el-button>
            </h4>
            <el-form :model="form5" :rules="rules5" ref="form5" class="demo-ruleForm"  v-if="isEditForm5">

              <el-form-item label-width="80px" label="项目名称" class="formItem" prop="name">
                <el-input placeholder="请输入项目名称" v-model="form5.name"></el-input>
              </el-form-item>

              <el-form-item label-width="80px" label="担任角色" class="formItem" prop="role">
                <el-input placeholder="请填写担任角色" v-model="form5.role"></el-input>
              </el-form-item>

              <el-form-item label-width="80px" label="开始时间" class="formItem" prop="startTime">
                <el-date-picker
                  type="date"
                  placeholder="选择日期"
                  value-format="timestamp"
                  v-model="form5.startTime"
                  style="width: 100%;"
                ></el-date-picker>
              </el-form-item>
              <el-form-item  label-width="80px" label="结束时间" class="formItem" prop="endTime">
                  <el-date-picker
                    type="date"
                    placeholder="选择日期"
                    value-format="timestamp"
                    v-model="form5.endTime"
                    style="width: 100%;"
                  ></el-date-picker>
              </el-form-item>

              <el-form-item  label="项目描述" prop="description">
                <el-input
                  style="width: 300px; float: left;margin-left: 90px;"
                  type="textarea"
                  :rows="6"
                  placeholder="请填写项目描述"
                  v-model="form5.description">
                </el-input>
              </el-form-item>

              <el-form-item  label="项目链接" prop="link">
                <el-input
                  style="width: 300px; float: left;margin-left: 90px;"
                  type="textarea"
                  :rows="3"
                  placeholder="请输入项目链接"
                  v-model="form5.link">
                </el-input>
              </el-form-item>

              <el-form-item class="formItem submit">
                <el-button size="medium" @click="handleCancle('5')">取消</el-button>
                <el-button size="medium" type="primary" @click="handleSubmit(5)">确定</el-button>
              </el-form-item>
            </el-form>
            <div class="infoCont" v-for="(item,index) in editMsg.projects" :key="index"  v-else>
              <span class="info_edit" v-if="!isEditForm5" @click="setEdit(5,item)">编辑</span>
              <span class="info_delete" v-if="!isEditForm5 && editMsg.projects.length>1" @click="setDelete(5,item)">删除</span>
              <div class="line_blo">
                <div class="row_blo">
                  <span class="label_name">项目名称:</span>
                  <div class="label_value">{{item.name}}</div>
                </div>
                <div class="row_blo">
                  <span class="label_name">担任角色:</span>
                  <div class="label_value">{{item.role}}</div>
                </div>
              </div>
              <div class="line_blo">
                <div class="row_blo">
                  <span class="label_name">开始时间:</span>
                  <div class="label_value">{{item.startTimeDesc}}</div>
                </div>
                <div class="row_blo">
                  <span class="label_name">结束时间:</span>
                  <div class="label_value">{{item.endTimeDesc}}</div>
                </div>
              </div>
              <div class="line_blo">
                <div class="row_blo">
                  <span class="label_name">项目描述:</span>
                  <div class="label_value">{{item.description}}</div>
                </div>
                <div class="row_blo">
                  <span class="label_name">项目链接:</span>
                  <div class="label_value">{{item.link}}</div>
                </div>
              </div>
            </div>

            <h4 class="classifyTitle">
              教育经历
              <el-button class="titleAdd" size="medium" type="primary" @click="addBlock(6)">添加教育经历</el-button>
            </h4>
            <el-form :model="form6" :rules="rules6" ref="form6" class="demo-ruleForm" v-if="isEditForm6">

              <el-form-item label-width="80px" label="学校" class="formItem" prop="school">
                <el-input placeholder="请输入学校名称" v-model="form6.school"></el-input>
              </el-form-item>

              <el-form-item label-width="80px" label="学历" class="formItem" prop="degree">
                <el-select
                  v-model="form6.degree "
                  placeholder="请选择学历"
                >
                  <el-option v-for="item in degreeList" :key="item.value" :label="item.text" :value="item.value"></el-option>
                </el-select>
              </el-form-item>

              <el-form-item label-width="80px" label="专业" class="formItem" prop="major">
                <el-input placeholder="请输入专业名称" v-model="form6.major"></el-input>
              </el-form-item>

              <el-form-item label-width="80px" label="开始时间" class="formItem" prop="startTime">
                <el-date-picker
                  type="date"
                  placeholder="选择日期"
                  value-format="timestamp"
                  v-model="form6.startTime"
                  style="width: 100%;"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label-width="80px" label="结束时间" class="formItem" prop="endTime">
                <el-date-picker
                  type="date"
                  placeholder="选择日期"
                  value-format="timestamp"
                  v-model="form6.endTime"
                  style="width: 100%;"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="在校经历" prop="experience">
                <el-input
                  style="width: 300px; float: left;margin-left: 90px;"
                  type="textarea"
                  :rows="6"
                  placeholder="请填写在校经历"
                  v-model="form6.experience">
                </el-input>
              </el-form-item>

              <el-form-item class="formItem submit">
                <el-button size="medium" @click="handleCancle('6')">取消</el-button>
                <el-button size="medium" type="primary" @click="handleSubmit(6)">确定</el-button>
              </el-form-item>
            </el-form>
            <div class="infoCont" v-for="(item,index) in editMsg.educations" :key="index" v-else>
              <span class="info_edit" v-if="!isEditForm6" @click="setEdit(6,item)">编辑</span>
              <span class="info_delete" v-if="!isEditForm6 && editMsg.educations.length>1" @click="setDelete(6,item)">删除</span>
              <div class="line_blo">
                <div class="row_blo">
                  <span class="label_name">学校:</span>
                  <div class="label_value">{{item.school}}</div>
                </div>
                <div class="row_blo">
                  <span class="label_name">学历:</span>
                  <div class="label_value">{{item.degreeDesc}}</div>
                </div>
              </div>
              <div class="line_blo">
                <div class="row_blo">
                  <span class="label_name">开始时间:</span>
                  <div class="label_value">{{item.startTimeDesc}}</div>
                </div>
                <div class="row_blo">
                  <span class="label_name">结束时间:</span>
                  <div class="label_value">{{item.endTimeDesc}}</div>
                </div>
              </div>
              <div class="line_blo">
                <div class="row_blo">
                  <span class="label_name">在校经历:</span>
                  <div class="label_value">{{item.experience}}</div>
                </div>
                <div class="row_blo">
                  <span class="label_name">专业:</span>
                  <div class="label_value">{{item.major}}</div>
                </div>
              </div>
            </div>

            <h4 class="classifyTitle">
              更多介绍
              <span class="edit_span" v-if="!isEditForm7" @click="setEdit(7)">编辑</span>
            </h4>
            <el-form :model="form7" :rules="rules" ref="form7" class="demo-ruleForm" v-if="isEditForm7">

              <el-form-item label="更多介绍" prop="introduce">
                <el-input
                  style="width: 300px; float: left;margin-left: 90px;"
                  type="textarea"
                  :rows="6"
                  placeholder="请填写更多介绍,1000以内"
                  v-model="form7.introduce" >
                </el-input>
              </el-form-item>

              <el-form-item label="介绍图片" prop="input" >
                <ul class="introImgList" >
                  <li
                    v-for="(imageItem, imageIndex) in introImgList"
                    :key="imageIndex"
                    :data-key="imageIndex"
                    class="draggable"
                    :style="`background-image: url(${imageItem.smallUrl}); background-size: cover; background-repeat: no-repeat; background-position: center center;`"
                    draggable="true">
                    <div class="btn-close" @click="handleRemoveUploadImage(imageIndex)"><i class="el-icon-delete"></i></div>
                  </li>
                  <li class="upload-li" v-if="introImgList.length < 20" @click="handleChooseImage">
                    <i class="el-icon-plus"></i>
                    <input type="file" multiple="multiple" @change="handleChangeImage" style="display: none;" id="image" name="image" accept="image/*" />
                  </li>
                </ul>
              </el-form-item>

              <el-form-item class="formItem submit">
                <el-button size="medium" @click="handleCancle('7')">取消</el-button>
                <el-button size="medium" type="primary" @click="handleSubmit(7)">确定</el-button>
              </el-form-item>
            </el-form>
            <div class="infoCont" v-else>
              <div class="line_blo">
                <div class="row_blo">
                  <span class="label_name">更多介绍:</span>
                  <div class="label_value" v-if="editMsg.moreIntroduce">{{editMsg.moreIntroduce.introduce}}</div>
                </div>
              </div>
              <div class="line_blo">
                <div class="row_blo">
                  <span class="label_name">介绍图片:</span>
                  <div class="label_value pics" v-if="editMsg.moreIntroduce">
                    <img v-for="(item,index) in editMsg.moreIntroduce.imgs" :key="index" :src="item.middleUrl"  />
                  </div>
                </div>
              </div>
            </div>

            <h4 class="classifyTitle">
              上传附件
              <span class="edit_span" v-if="!isEditForm8" @click="setEdit(8)">编辑</span>
            </h4>
            <el-form :model="form8" :rules="rules" ref="form8" class="demo-ruleForm" v-if="isEditForm8">

              <el-form-item label="附件简历(选填)" class="formItem attach_resume">
                <el-upload
                  action="https://admin-api.lieduoduo.ziwork.com/attaches"
                  :limit="1"
                  :file-list="fileList"
                  :http-request="uploadFile"
                  :before-upload="beforeUpload"
                  :before-remove="removeUpload"
                >
                  <el-button size="small" type="primary">点击上传</el-button>

                  <div class="el-upload__tip" slot="tip">支持上传png,jpg,pdf,doc,docx文件，且不超过500kb</div>
                </el-upload>
              </el-form-item>
              <el-form-item class="formItem submit">
                <el-button size="medium" @click="handleCancle('8')">取消</el-button>
                <el-button size="medium" type="primary" @click="handleSubmit(8)">确定</el-button>
              </el-form-item>
            </el-form>
            <div class="infoCont" v-else>
              <div class="line_blo">
                <div class="row_blo">
                  <span class="label_name">附件简历:</span>
                  <div class="label_value" v-if="editMsg.resumeAttach">{{editMsg.resumeAttach.fileName}}</div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
    <el-dialog
      :title="'修改手机号码'"
      :close-on-click-modal="closeModel"
      :show-close="showClose"
      :visible.sync="dialogVisible"
      width="300px"
      center>
      <el-form :model="canform" ref="canform" class="demo-ruleForm">
        <el-form-item prop="mobile" label="手机号码" class="formItem">
          <el-input v-model="canform.mobile" placeholder="请输入手机号码"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click.stop="saveUser" class="inquire">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import PostResume from './index'
export default PostResume
</script>

<style lang='less' scoped>
@import "./index.less";
</style>
