<template>
  <div class="post-job">
    <el-form class="edit-form" ref="form" :model="form" :rules="rules" label-width="120px" label-suffix="：">
      <el-form-item label="招聘官手机" prop="mobile" style="width: 380px;" v-if="!isEdit">
        <el-input v-model="form.mobile" placeholder="填写招聘官手机号" :maxlength="11" onkeypress="return event.keyCode>=48&&event.keyCode<=57" @blur="mobileBlur"></el-input>
      </el-form-item>
      <el-form-item label="招聘官手机" prop="mobile" style="width: 380px;" v-else>
        <el-input v-model="form.mobile" :disabled="true" placeholder="填写招聘官手机号" :maxlength="11"></el-input>
      </el-form-item>

      <h3 class="title">职位基本信息</h3>
      <!-- <p class="hint">加“ <span style="color: red; font-size: 15px;">*</span> ”内容，在确认发布成功后，将无法修改</p> -->
      <el-form-item label="职位名称" prop="position_name" style="width: 380px;">
        <el-input v-model="form.position_name" placeholder="限制50个字以内" :maxlength="30"></el-input>
      </el-form-item>

      <el-form-item label="职位类别" prop="type" style="width: 380px;">
        <el-select v-model="selectPositionItem.name" placeholder="点击选择职位类别" @focus="changePosition" style="width: 100%;">
          <el-option
            v-for="item in typeList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="工作地点" prop="address_id" style="width: 380px;">
        <el-select v-model="form.address_id" placeholder="点击选择工作地点" @change="changeAdress" style="width: 100%;">
          <el-option
            v-for="item in addressList"
            :key="item.value"
            :label="item.label"
            :value="item.value">

            <span style="float: left;color: #999;" v-if="item.value!=='0'">{{ item.label }}</span>
            <span style="float: left; color: #652791;" v-else>{{ item.label }}</span>
          </el-option>
        </el-select>
      </el-form-item>

      <h3 class="title">职位要求</h3>
      <p class="hint">我们将通过以下条件，为您精确推荐合适的求职者，请尽量详细填写</p>

      <el-form-item label="经验要求" prop="work_experience" style="width: 380px;">
        <el-select v-model="form.work_experience" placeholder="请选择经验要求"  style="width: 100%;">
          <el-option
            v-for="item in experienceList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="最低学历" prop="education" style="width: 380px;">
        <el-select v-model="form.education" placeholder="请选择学历要求"  style="width: 100%;">
          <el-option
            v-for="item in educationList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="薪酬范围" prop="emolument_min" style="width: 800px; text-align: left;">
        <el-select v-model="form.emolument_min" placeholder="选择薪资范围" @change="changeEmolumentMin"  style="width: 150px;">
          <el-option
            v-for="item in emolumentMinList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        ----
        <el-select v-model="form.emolument_max" placeholder="选择薪资范围"  style="width: 150px;">
          <el-option
            v-for="item in emolumentMaxList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        &nbsp;×&nbsp;
        <el-select v-model="form.annual_salary" placeholder="请选择">
          <el-option
            v-for="item in annual_salary_list"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item style="width: 0; text-align: left; margin:0;">
      </el-form-item>

      <el-form-item label="技能要求" prop="labels" style="width: 450px;">
        <el-select
          style="width: 100%;"
          v-model="form.labels"
          multiple
          :multiple-limit="4"
          filterable
          allow-create
          default-first-option
          placeholder="请选择技能要求">
          <el-option
            v-for="item in options"
            :key="item.labelId"
            :label="item.name"
            :value="item.labelId">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="职位描述" prop="describe" style="width: 640px;">
        <el-input
          type="textarea"
          :rows="6"
          placeholder="请填写职位描述"
          v-model="form.describe">
        </el-input>
      </el-form-item>

      <el-form-item label="职位状态" style="text-align: left;">
        <el-radio v-model="form.is_online" :label="1">开启</el-radio>
        <el-radio v-model="form.is_online" :label="2">关闭</el-radio>
      </el-form-item>

      <p class="ruleHint">发布职位即表示同意遵守<a>《猎多多职位信息发布规则》</a>，如违反将导致您的账号被锁定</p>

      <div class="btn-container">
        <el-button class="btn_submit" type="primary" @click="handleSubmit">{{$route.query.id ? '保存' : '发布'}}</el-button>
        <el-button class="btn_cancel" @click="handleCancel">取消</el-button>
      </div>

      <div class="pop" v-if="pop.isShow">
        <div class="jobSelectPop" v-if="pop.type==='position'">
          <div class="pop_left">
            <div class="pop_tit">请选择职位类别</div>
            <ul class="pop_classily" >
              <li class="" :class="{'cur': item.active}" v-for="(item,index) in positionList" :key="index"  @click="selectPosition(index)">{{item.name}}</li>
            </ul>
          </div>
          <div class="pop_right">
            <img class="clo" src="../../../assets/images/clo.png" @click="popCancel('name')" />
            <search-bar class="f-float-left" @search="handleSearch" :width="'200'" v-model="searchPosition" placeholder="请输入职位关键词" style="margin-top: 12px;"></search-bar>
            <ul class="job_classily">
              <li v-for="(item,index) in secondPositionList" @click="selectSecondPosition(index)" :key="index">
                <img class="classily_icon classily_open" src="../../../assets/images/add_icon.png" v-if="!item.active" />
                <img class="classily_icon classily_close" src="../../../assets/images/close_icon.png" v-else />
                {{item.name}}
              </li>
            </ul>

            <ul class="open_jobs" v-if="thirdPositionList.length>0">
              <li v-for="(item,index) in thirdPositionList" @click="thirdSecondPosition(item)" :key="index"> {{item.name}}</li>
            </ul>
          </div>
        </div>
        <map-search v-if="pop.type==='addAdress'" @popCancel="popCancel" @addAdress="addAdress"></map-search>

        <div class="addAdressPop" v-if="pop.type==='addAdress2'">
          <img class="clo" @click="popCancel" />
          <h3 class="">添加新的公司地址</h3>
          <p>添加新的公司地址</p>
          <el-input style="width: 368px;margin: 13px 0 26px 0;box-sizing: border-box;" v-model="adressInput" placeholder="请输入工作地址）"></el-input>
          <el-input style="width: 368px;margin: 13px 0 26px 0;box-sizing: border-box;" v-model="adress_id_Input" placeholder="请输入门牌号（选填）"></el-input>
          <div class="btn-add">
            <el-button class="btn_cancel" @click="popCancel">取消</el-button>
            <el-button class="btn_submit" type="primary" @click="addAdress">保存地址</el-button>
          </div>
        </div>
      </div>

    </el-form>
  </div>
</template>
<script>
import PostPosition from './postPosition'
export default PostPosition
</script>

<style lang="less" scoped>
@import "./postPosition.less";

</style>
