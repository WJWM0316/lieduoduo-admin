<style lang="less" scoped>
#interview24h{
  margin: 22px 22px 60px 222px;
  border: 1px solid rgb(238, 238, 238);
  .h24_navigation{
    text-align: left;
    margin-top: 24px;
    margin-left: 10px;
    li{
      display: inline-block;
      background-color: #f4f4f5;
      display: inline-block;
      height: 40px;
      padding: 0 15px;
      line-height: 40px;
      font-size: 12px;
      color: #909399;
      cursor: pointer;
    }
    .active{
      background-color: #3e294d;
      color: white;
      cursor: none;
      pointer-events: none;
    }
    .export{
      float: right;
      margin-right: 20px;
    }
  }
  .el-form {
    text-align: left;
    margin-top: 22px;
    overflow: hidden;
    margin-left: 10px;
    .el-form-item{
      text-align: center;
    }
  }
  .el-pagination{
    text-align: left;
    margin: 22px 0;
    overflow: hidden;
  }
  .btn_deal{
    color: #652791;
    cursor: pointer;
    display: inline-block;
    margin-right: 20px;
  }
  .el-dialog__body{
    padding-top: 0;
    padding-bottom: 0;
  }
  .html_content {
    .row{
      height: 40px;
      line-height: 40px;
      display: block;
      overflow: hidden;
    }
    .label{
      display: inline-block;
      width: 80px;
      float: left;
    }
    .value{
      display: inline-block;
      position: relative;
      width: calc(100% - 80px);
      float: left;
    }
    .user_input{
      display: block;
      width: 80%;
      border: none;
      outline: none;
      height: 40px;
      background: transparent;
      line-height: 40px;
      font-size: 14px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .position_item{
      height: 40px;
      line-height: 40px;
      display: flex;
      position: relative;
    }
    .name{
      padding-left: 20px;
      max-width: 80%;
      overflow: hidden;
      line-height: 40px;
      text-overflow: ellipsis;
      white-space: nowrap;
      cursor: pointer;
    }
    .edit{
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      right: 20px;
      color: #652791;
      cursor: pointer;
    }
    .icon_circle_my{
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #606266;
      display: inline-block;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      left: 1px;
      cursor: pointer;
    }
    .el-icon-success{
      font-size: 14px;
      display: inline-block;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      left: 0;
      cursor: pointer;
      color: #3a8ee6;
    }
    .improper{
      padding-bottom: 5px;
    }
    .reason_item{
      height: 28px;
      line-height: 28px;
      padding: 0 15px;
      border-radius: 5px;
      display: inline-block;
      border-radius: 17px;
      border: 1px solid rgba(228, 228, 228, 1);
      margin-bottom: 8px;
      margin-right: 8px;
      color: #999;
      cursor: pointer;
    }
    .reason_item_active{
      color: #3a8ee6;
      border-color: #3a8ee6;
    }
    h2{
      color: #666;
      margin-bottom: 5px;
    }
  }
  .position_ul .p_ul{
    max-height: 300px;
    overflow: hidden;
    overflow-y: scroll;
  }
  .position_ul .p_ul::-webkit-scrollbar {
   width: 4px;
  }
   .position_ul .p_ul::-webkit-scrollbar-track {
   background:rgba(0,0,0,.1);
   -webkit-border-radius: 20px;
   -moz-border-radius: 20px;
   border-radius:20px;
  }
   .position_ul .p_ul::-webkit-scrollbar-thumb {
   background:rgba(0,0,0,1);
   -webkit-border-radius: 20px;
   -moz-border-radius: 20px;
   border-radius:20px;
  }
  .time_row{
    height: 30px;
    line-height: 30px;
    cursor: pointer;
    position: relative;
    i{
      margin-right: 10px;
      color: red;
    }
    .circle{
      border: 1px solid #dcdfe6;
      border-radius: 100%;
      width: 14px;
      height: 14px;
      background-color: #fff;
      position: relative;
      cursor: pointer;
      display: inline-block;
      box-sizing: border-box;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      right: 0;
    }
    .active{
      border-color: #3e294d;
      background: #3e294d;
    }
  }
  .add_time{
    position: relative;
    overflow: hidden;
    .el-date-editor{
      position: absolute;
      left: 0;
      right: 0;
      height: 100%;
      opacity: 0;
    }
  }
  .dialog-footer{
    text-align: left;
  }
  .strong_name{
    cursor: pointer;
    color: #652791;
  }
}
</style>
<style>
#interview24h .el-pagination{
    text-align: center !important;
    margin: 0 !important;
    overflow: hidden;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    z-index: 200;
    position: fixed;
    bottom: 0;
    left: 190px;
    padding: 8px;
    width: 100%;
    background-color: #ffffff;
    /* -webkit-box-shadow: 0px -1px 0px 0px #e8e9eb; */
    /* box-shadow: 0px -1px 0px 0px #e8e9eb; */
    border: 1px solid #e8e9eb;
}
</style>
<template>
  <div id="interview24h">

    <ul class="h24_navigation">
      <li v-for="item in navigation" :key="item.type" :class="{active: item.active}" @click="tabClick(item.type)">{{item.msg}}</li>
      <div class="export"><el-button type="primary" @click="download" :disabled="!canDownloadData" v-if="AdminShow == 0 || AdminShow == 2 || AdminShow == 1 || AdminShow == 4 || AdminShow == 5 || AdminShow===6">导出</el-button></div>
    </ul>
    <el-form ref="form" :model="form" label-width="80px" :inline="true">

      <el-form-item>
        <el-input
          type="text"
          placeholder="请输入内容"
          v-model="form.content">
          <el-select
            v-model="form.searchType"
            slot="prepend"
            placeholder="面试ID"
            @change="changeSearch"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-input>
      </el-form-item>

      <el-form-item label="公司名字">
        <el-input v-model="form.companyName" placeholder="请输入公司名字"></el-input>
      </el-form-item>

      <el-form-item label="状态">
        <el-select v-model="form.status" placeholder="全部状态" :disabled="form.tab_status !== '1'">
          <el-option
            v-for="item in statusLists"
            :key="item.status"
            :label="item.desc"
            :value="item.status">
          </el-option>
        </el-select>
        <el-select v-model="form.last_status" placeholder="全部状态" v-if="form.status === 52">
          <el-option
            v-for="item in statusChildLists"
            :key="item.status"
            :label="item.desc"
            :value="item.status">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="跟进销售">
        <el-select v-model="form.admin_uid" placeholder="跟进销售">
          <el-option
            v-for="item in saleLists"
            :key="item.id"
            :label="item.realname"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="城市">
          <el-select
            v-model="form.areaId"
            filterable
            placeholder="请输入城市名">
            <el-option
              v-for="(item, index) in cityLists"
              :key="index"
              :label="item.title"
              :value="item.areaId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="职位类别">
          <el-cascader
            ref="cascader"
            placeholder="职位类别"
            :options="mgoptions"
            filterable
            change-on-select
            :props="positionManage"
            @change="type"
          ></el-cascader>
        </el-form-item>
      <el-form-item label="申请时间" prop="createStartTime" style="margin-left: 10px;">
          <el-col :span="11">
            <el-date-picker
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
              v-model="form.createStartTime"
              style="width: 100%;"
            ></el-date-picker>
          </el-col>
          <el-col class="line" :span="2">—</el-col>
          <el-col :span="11">
            <el-date-picker
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
              v-model="form.createEndTime"
              style="width: 100%;"
            ></el-date-picker>
          </el-col>
        </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">搜索</el-button>
        <el-button type="primary" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table border :data="lists">
      <el-table-column
        prop="interviewId"
        width="80"
        label="面试ID">
      </el-table-column>
      <el-table-column
        prop="jobhunterInfo"
        label="求职者信息">
        <template slot-scope="scope" v-if="scope.row.jobhunterInfo">
          <div>
            <span class="strong_name" @click="showResume(scope.row)">{{scope.row.jobhunterInfo.realname}}</span>
            <span> · {{scope.row.jobhunterInfo.lastPosition}}</span>
          </div>
          <div>{{scope.row.jobhunterInfo.lastCompanyName}}</div>
          <div>
            <el-popover
              placement="bottom"
              width="300"
              @hide="hide"
              :disabled="openType !== 'resume'"
              trigger="click">
              <div>
                <div style="text-align: center;" v-if="!model.qrCode">
                  <img style="height: 38px;width: 38px; margin-top: 10px;" src="../../assets/loading.gif" />
                  <div style="margin-top: 20px;">正在加载中…</div>
                </div>
                <div v-else>
                  <img class="Qr" :src="model.qrCode" />
                  <div style="text-align: center;margin-top: 10px;">微信扫码，打开小程序查看</div>
                </div>
              </div>
              <span class="strong_name" @click.stop="getResumeCodeUrl(scope.row.jobhunterInfo.uid)" slot="reference">扫码看简历&nbsp;&nbsp;&nbsp;&nbsp;</span>
            </el-popover>
            <el-popover
              placement="bottom"
              width="50"
              trigger="click"
              v-if="AdminShow!==3 && AdminShow!==4"
              :content="scope.row.jobhunterInfo.mobile">
              <span class="strong_name" slot="reference">联系用户</span>
            </el-popover>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="statusDesc"
        label="状态">
        <template slot-scope="scope">
          <div>{{scope.row.statusDesc}}
            <span class="strong_name" style="margin-left: 50px;" @click="todoAction('viewReason', scope.row)" v-if="scope.row.status===52" >原因</span>
          </div>
          <div>{{scope.row.updatedAt}}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="recruiterInfo"
        label="面试官信息">
        <template slot-scope="scope" v-if="scope.row.recruiterInfo">
          <div>
            <span class="strong_name">{{scope.row.recruiterInfo.realname}}</span>
            <span> · {{scope.row.recruiterInfo.position}}</span>
          </div>
          <div>{{scope.row.recruiterInfo.companyName}}</div>
          <div>
            <el-popover
              placement="bottom"
              width="300"
              @hide="hide"
              :disabled="openType !== 'recruiter'"
              trigger="click">
              <div>
                <div style="text-align: center;" v-if="!model.qrCode">
                  <img style="height: 38px;width: 38px; margin-top: 10px;" src="../../assets/loading.gif" />
                  <div style="margin-top: 20px;">正在加载中…</div>
                </div>
                <div v-else>
                  <img class="Qr" :src="model.qrCode" />
                  <div style="text-align: center;margin-top: 10px;">微信扫码，打开小程序查看</div>
                </div>
              </div>
              <span class="strong_name" @click="getRecruiterCodeUrl(scope.row.recruiterInfo.uid)" slot="reference">扫码看主页&nbsp;&nbsp;&nbsp;&nbsp;</span>
            </el-popover>
            <el-popover
              placement="bottom"
              width="50"
              trigger="click"
              :content="scope.row.recruiterInfo.mobile">
              <span class="strong_name" slot="reference">联系用户</span>
            </el-popover>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="interviewType"
        label="约面信息">
        <template slot-scope="scope">
          <div>
            <span class="strong_name" @click="readPosition(scope.row.positionId)">职位： {{scope.row.positionName}}&nbsp;&nbsp;&nbsp;&nbsp;</span>
            <el-popover
              placement="bottom"
              width="300"
              @hide="hide"
              :disabled="openType !== 'position'"
              trigger="click">
              <div>
                <div style="text-align: center;" v-if="!model.qrCode">
                  <img style="height: 38px;width: 38px; margin-top: 10px;" src="../../assets/loading.gif" />
                  <div style="margin-top: 20px;">正在加载中…</div>
                </div>
                <div v-else>
                  <img class="Qr" :src="model.qrCode" />
                  <div style="text-align: center;margin-top: 10px;">微信扫码，打开小程序查看</div>
                </div>
              </div>
              <span class="strong_name" @click="getPositionCodeUrl(scope.row.positionId)" slot="reference">扫码看职位</span>
            </el-popover>
          </div>
          <div>地址：{{scope.row.address}}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="createdAt"
        label="申请时间">
      </el-table-column>
      <el-table-column
        prop="handleEndTime"
        label="服务到期时间">
      </el-table-column>
      <el-table-column
        prop="num4"
        label="跟进销售">
        <template slot-scope="scope" v-if="scope.row.adminInfo">
          {{scope.row.adminInfo.realname || ''}}
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        width="130"
        align="center"
        label="代客操作">
        <template slot-scope="scope" v-if="scope.row.action">
          <!-- <span class="btn_deal" @click="todoAction('modify', scope.row)">修改面试</span> -->
          <span class="btn_deal" @click="todoAction(item.action, scope.row)" v-for="(item, index) in scope.row.action" :key="index">{{item.msg}}</span>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      layout="prev, pager, next, slot"
      :total="total"
      :page-size="pageSize"
      prev-text="上一页"
      next-text="下一页"
      :current-page="Number(form.page)"
      v-if="total > pageSize"
      @current-change="pageChange">
      <span class="total">共{{ Math.ceil(total/20) }}页, {{total}}条记录</span>
    </el-pagination>
    <el-dialog
      :title="model.title"
      :visible.sync="model.show"
      width="450px"
      center>
      <div class="html_content position_ul" v-show="model.type === 'position'">
        <ul class="p_ul" id="scroll_div_ul_position">
          <li class="position_item" v-for="(item, index) in positionLists" :key="index" @click="getPosition(index)">
            <i class="icon_circle_my" v-show="!item.active"></i>
            <i class="el-icon-success" v-show="item.active"></i>
            <div class="name">{{item.positionName}}</div>
            <span v-if="item.isOnline === 2" style="margin-left: 10px;color: rgba(0,0,0,.2);">(已关闭)</span>
          </li>
        </ul>
      </div>
      <div class="html_content" v-show="model.type === 'present'">
        <div style="margin: 20px 0;">
          <el-radio v-model="form.isAttend" label="0">未到场</el-radio>
          <el-radio v-model="form.isAttend" label="1">已到场</el-radio>
        </div>
      </div>
      <div class="html_content" v-show="model.type === 'add_address' || model.type === 'edit_address'">
        <ul>
          <li class="row">
            <div class="label">地址：</div>
            <div class="value">{{form.address.address ? form.address.address : '点击调用地图，选择地点 >>'}}</div>
          </li>
          <li class="row">
            <div class="label">门牌：</div>
            <div class="value"><input type="text" class="user_input" placeholder="请输入门牌号" v-model="form.address.doorplate" /></div>
          </li>
        </ul>
      </div>
      <div class="html_content position_ul" v-show="model.type === 'address'">
        <ul class="p_ul" id="scroll_div_ul_address">
          <li class="position_item" v-for="(item, index) in addressLists" :key="index">
            <i class="icon_circle_my" v-show="!item.active"></i>
            <i class="el-icon-success" v-show="item.active"></i>
            <div class="name" @click="getAddress(index)">{{item.address}}</div>
            <span class="edit" @click="editAddress(index)">编辑</span>
          </li>
        </ul>
        <el-button type="text" class="add_time" @click="todoAction('add_address')"> +添加地址 </el-button>
      </div>
      <div class="html_content position_ul" v-show="model.type === 'improper'">
        <div class="improper">确定标记为不合适吗？</div>
      </div>
      <div class="html_content position_ul" v-show="model.type === 'viewReason'">
        <div style="padding: 10px 0 30px 0;">{{model.refuseReason}}</div>
      </div>
      <div class="html_content position_ul" v-show="model.type === 'reason'">
        <ul>
          <li
            v-for="(item, index) in reasonList"
            :key="index"
            class="reason_item"
            :class="{reason_item_active: item.active}"
            @click="setReason(index)">{{item.title}}</li>
        </ul>
        <div class="content_01">
          <h2>补充说明（选填）</h2>
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            v-model="model.extra">
          </el-input>
        </div>
      </div>
      <div class="html_content" v-show="model.type === 'modify' || model.type === 'arrange'">
        <ul>
          <li class="row">
            <div class="label">联系人：</div>
            <div class="value"><!-- {{form.realname}} --><input v-model="form.realname" class="user_input" /></div>
          </li>
          <li class="row">
            <div class="label">联系电话：</div>
            <div class="value"><!-- {{form.mobile}} --><input v-model="form.mobile" class="user_input" /></div>
          </li>
          <li class="row">
            <div class="label">职位：</div>
            <div class="value">
              <span class="user_input" style="cursor: pointer;color: #3a8ee6;" v-if="model.position.name" @click="todoAction('position')">{{model.position.name}}</span>
              <el-button type="text" @click="todoAction('position')" v-else>+选择职位</el-button>
            </div>
          </li>
          <li class="row">
            <div class="label">地址：</div>
            <div class="value">
              <span class="user_input" style="cursor: pointer;color: #3a8ee6;" v-if="model.address.addressName" @click="todoAction('address')">{{model.address.addressName}}</span>
              <el-button type="text" @click="todoAction('address')" v-else>+选择地址</el-button>
            </div>
          </li>
        </ul>
        <ul class="time_list" v-if="model.dateLists.length">
          <li class="time_row" v-for="(item, index) in model.dateLists" :key="index">
            <i class="el-icon-remove" @click="deleteTime(index)"></i>
            {{item.appointment}}
          </li>
        </ul>
        <el-button type="text" class="add_time" v-if="model.dateLists.length < 3">
          +添加时间
          <el-date-picker
            v-model="form.date1"
            type="datetime"
            @change="getTime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-button>
      </div>
      <div class="html_content" v-show="model.type === 'preview'">
        <ul>
          <li class="row">
            <div class="label">联系人：</div>
            <div class="value">{{form.realname}}</div>
          </li>
          <li class="row">
            <div class="label">联系电话：</div>
            <div class="value">{{form.mobile}}</div>
          </li>
          <li class="row">
            <div class="label">职位：</div>
            <div class="value">
              <span class="user_input" style="color: #3a8ee6;">{{model.position.name}}</span>
            </div>
          </li>
          <li class="row">
            <div class="label">地址：</div>
            <div class="value">
              <span class="user_input" style="color: #3a8ee6;">{{model.address.addressName}}</span>
            </div>
          </li>
        </ul>
        <ul class="time_list" v-if="model.dateLists.length">
          <li class="time_row" v-for="(item, index) in model.dateLists" :key="index" style="cursor: unset;">
            <!-- <i class="el-icon-remove"></i> -->
            {{item.appointment}}
          </li>
        </ul>
      </div>
       <!-- v-if="model.showFooter" -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="close" size="small">{{model.btnTxt}}</el-button>
        <el-button type="primary" @click="confirm" size="small">确 定</el-button>
      </div>
    </el-dialog>
    <resume-popup :resumeId="model.resumeId" :isShow="model.showResume" @showCallback="showCallback" ref="resume"></resume-popup>
    <map-search v-if="model.showMap" @popCancel="popCancel" @addAdress="addAdress"></map-search>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import resumePopup from 'COMPONENTS/resumePopup/resumePopup.vue'
import { getAddressListsApi } from 'API/company'
import mapSearch from '@/components/map'

import {
  getQuickApplyInterviewApi,
  interviewRetractApi,
  confirmInterviewApi,
  getInterviewCommentReasonApi,
  getInterviewNotSuitReasonApi,
  refuseJobhunterUidInterviewApi,
  setInterviewInfoApi,
  getSimplepageAddressesListsApi,
  setUserInterviewAttendApi,
  setUserInterviewCommentApi,
  getResumeCodeUrlApi,
  getRecruiterCodeUrlApi,
  getPositionCodeUrlApi,
  getInterviewFisrtStatusListsApi,
  getInterviewSecondStatusListsApi,
  getInterviewComment
} from 'API/interview'
import {
  getListApi,
  openPositionApi,
  createPositionAddressApi,
  editPositionAddressApi,
  getLabelPositionListApi,
  getPositionAddressApi
} from 'API/position'
import { getSalerListApi } from 'API/common'
import { getAccessToken } from 'API/cacheService'
import { API_ROOT } from 'API/index.js'
@Component({
  name: 'Interview24h',
  components: {
    resumePopup,
    mapSearch
  },
  watch: {
    'form.areaId': {
      handler (areaId) {
        if (areaId) {
          let item = this.cityLists.find(field => field.areaId === areaId)
          if (!item) return
          this.form.areaId = item.areaId
          this.form.areaName = item.title
        }
      },
      immediate: true
    }
  }
})
export default class Interview24h extends Vue {
  AdminShow = ''
  canDownloadData = true
  openType = ''
  saleLists = []
  navigation = [
    {
      type: 'all',
      msg: '全部',
      active: false,
      id: '1'
    },
    {
      type: 'unprocessed',
      msg: '未处理',
      active: false,
      id: '2'
    },
    {
      type: 'expired',
      msg: '已过期',
      active: false,
      id: '3'
    }
  ]
  options = [
    {
      value: 'id',
      label: '面试ID'
    },
    {
      value: 'jobhunter',
      label: '求职者'
    },
    {
      value: 'recruiter',
      label: '招聘官'
    },
    {
      value: 'position',
      label: '职位'
    },
    {
      value: 'company_id',
      label: '公司ID'
    }
  ]
  statusLists = [
    {
      value: '11',
      label: '待面试官处理'
    },
    {
      value: '21',
      label: '待面试官安排时间'
    },
    {
      value: '31',
      label: '待求职者确认'
    },
    {
      value: '32',
      label: '待面试官修改'
    },
    {
      value: '41',
      label: '已确定面试日程'
    },
    {
      value: '52',
      label: '不合适'
    }
  ]
  statusChildLists = []
  total = 99
  pageSize = 20
  form = {
    tab_status: '1',
    admin_uid: '',
    companyName: '',
    searchType: 'id',
    date1: '',
    resource: '',
    page: 1,
    content: '',
    status: '',
    last_status: '',
    mobile: '',
    realname: '',
    isAttend: '0',
    createStartTime: undefined,
    createEndTime: undefined,
    address: {
      mobile: '',
      title: '',
      areaName: '',
      address: '',
      doorplate: '',
      lng: '',
      lat: ''
    },
    showFooter: true,
    refuseReason: '',
    areaName: '',
    positionLabel: '',
    areaId: ''
  }
  positionManage = {
    value: 'labelId',
    label: 'name',
    children: 'children'
  }; // 职位类别的配置
  mgoptions = []
  cityLists = []
  getAddressLists () {
    return getAddressListsApi({ level: 3 }).then(res => (this.cityLists = res.data.data))
  }
  lists = []
  model = {
    qrCode: '',
    resumeId: '',
    showResume: false,
    show: false,
    type: '',
    beforeType: '',
    title: '',
    beforeTitle: '',
    btnTxt: '取消',
    reason: [],
    extra: '',
    dateLists: [],
    interviewId: '',
    showConfirmBtn: true,
    showMap: false,
    position: {
      positionName: '',
      positionId: ''
    },
    address: {
      addressName: '',
      addressId: ''
    },
    item: {}
  }
  reasonList = []
  positionLists = []
  isLastPageOfPosition = false
  positionNum = 1
  addressLists = []
  isLastPageOfAddress = false
  addressNum = 1
  getQuickApplyInterview () {
    let tab = this.navigation.find(field => field.active)
    let params = {
      tab_status: tab.id,
      page: this.form.page,
      count: this.pageSize
    }
    if (this.form.companyName) {
      params = Object.assign(params, { companyName: this.form.companyName })
    }
    if (this.form.admin_uid) {
      params = Object.assign(params, { admin_uid: this.form.admin_uid })
    }
    if (this.form.searchType && this.form.content) {
      params = Object.assign(params, { searchType: this.form.searchType, content: this.form.content })
    }
    if ((this.form.createStartTime && !this.form.createEndTime) || (!this.form.createStartTime && this.form.createEndTime)) {
      this.$message({ message: '申请时间必需选择区间时间', type: 'warning' })
      return
    } else {
      if (this.form.createStartTime && this.form.createEndTime) {
        params = Object.assign(params, { createStartTime: this.form.createStartTime, createEndTime: this.form.createEndTime })
      }
    }
    if (this.form.status) {
      params = Object.assign(params, { status: this.form.status })
    }
    // 已经选择职位类型
    if (this.form.positionLabel) {
      params = Object.assign(params, { positionLabel: this.form.positionLabel })
    }
    // 已经选择城市
    if (this.form.areaId) {
      params = Object.assign(params, { areaId: this.form.areaId })
    }
    if (this.form.status === 52) {
      params = Object.assign(params, { last_status: this.form.last_status })
    }
    return getQuickApplyInterviewApi(params).then(res => {
      let infos = res.data
      this.total = infos.meta.total
      this.lists = infos.data
      this.$router.push({ query: { ...params } })
    })
  }
  /**
   * @Author   小书包
   * @DateTime 2019-08-01
   * @detail   关闭弹窗
   * @param    {[type]}   index [description]
   */
  close () {
    let item = this.model.item
    switch (this.model.type) {
      case 'recipe':
        this.model.title = '确定约面'
        this.model.show = false
        break
      case 'improper':
        this.model.show = false
        break
      case 'arrange':
        this.model.title = '安排面试'
        this.model.show = false
        break
      case 'modify':
        this.model.title = '修改面试时间'
        this.model.show = false
        break
      case 'preview':
        this.model.title = '查看面试'
        this.model.show = false
        break
      case 'position':
        this.model.type = this.model.beforeType
        this.model.title = this.model.beforeTitle
        break
      case 'address':
        let actionList = item.action.map(field => field.action)
        if (actionList.includes('arrange')) {
          this.model.type = 'arrange'
          this.model.title = '安排面试'
        } else {
          this.model.type = 'modify'
          this.model.title = '修改面试时间'
        }
        break
      case 'reason':
        this.model.show = false
        // this.model.position = this.model.defaultPosition
        break
      case 'present':
        this.model.show = false
        break
      case 'add_address':
        this.model.type = 'address'
        break
      case 'edit_address':
        this.getSimplepageAddressesLists({
          mobile: item.recruiterInfo.mobile
        }).then(() => {
          this.model.show = true
          this.model.title = '选择地址'
          this.model.btnTxt = '返回'
          this.model.type = 'address'
          this.setAddressDomScroll({
            mobile: item.recruiterInfo.mobile
          })
        })
        break
      default:
        break
    }
  }
  /**
   * @Author   小书包
   * @DateTime 2019-08-01
   * @detail   弹窗确定
   * @param    {[type]}   index [description]
   */
  confirm () {
    let dateList = this.model.dateLists
    if (dateList.length) dateList = dateList.map(field => field.appointmentTime).join(',')
    let data = this.model.item
    switch (this.model.type) {
      case 'arrange':
        if (!this.model.position.positionId) {
          this.$message.error('请选择一个职位')
          return
        }
        if (!this.model.address.addressId) {
          this.$message.error('请选择一个地址')
          return
        }
        if (!dateList.length) {
          this.$message.error('请至少添加一个约面时间')
          return
        }
        this.setInterviewInfo({
          interviewId: this.model.interviewId,
          realname: this.form.realname,
          mobile: this.form.mobile,
          addressId: this.model.address.addressId,
          interviewTime: dateList,
          positionId: this.model.position.positionId
        }).then(() => {
          this.model.show = false
        })
        break
      case 'modify':
        this.model.show = false
        this.setInterviewInfo({
          interviewId: this.model.interviewId,
          realname: this.form.realname,
          mobile: this.form.mobile,
          addressId: this.model.address.addressId,
          interviewTime: dateList,
          positionId: this.model.position.positionId
        })
        break
      case 'preview':
        this.model.show = false
        break
      case 'improper':
        this.getLabelComment({ status: data.status }).then(() => {
          this.model.type = 'reason'
          this.model.title = '选择不合适原因'
        })
        break
      case 'position':
        let positionItem = this.positionLists.find(field => field.active)
        // 该职位处于下线状态
        if (!positionItem.status) {
          this.$confirm('确认开放该职位进行约面吗？', '开放职位约面', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(() => {
            this.openPosition({ id: positionItem.id }).then(() => {
              this.model.position.name = positionItem.positionName
              this.model.position.positionId = positionItem.id
              this.model.type = this.model.beforeType
              this.model.title = this.model.beforeTitle
            })
          }).catch(() => {
            // 2
          })
        } else {
          this.model.position.name = positionItem.positionName
          this.model.position.positionId = positionItem.id
          this.model.type = this.model.beforeType
          this.model.title = this.model.beforeTitle
        }
        break
      case 'address':
        let addressItem = this.addressLists.find(field => field.active)
        let actionList = data.action.map(field => field.action)
        if (addressItem) {
          this.model.address.addressName = addressItem.address
          this.model.address.addressId = addressItem.id
          if (actionList.includes('arrange')) {
            this.model.type = 'arrange'
            this.model.title = '安排面试'
          } else {
            this.model.type = 'modify'
            this.model.title = '修改面试时间'
          }
        } else {
          this.$message('请选择一个地址')
        }
        break
      case 'edit_address':
        this.editPositionAddress(this.form.address).then(() => {
          this.addressLists = []
          this.addressNum = 1
          this.isLastPageOfAddress = false
          this.getSimplepageAddressesLists({
            mobile: data.recruiterInfo.mobile
          }).then(() => {
            this.model.type = 'address'
            this.model.title = '选择地址'
            this.setAddressDomScroll({
              mobile: data.recruiterInfo.mobile
            })
          })
        })
        break
      case 'reason':
        let reason = this.model.reason.map(field => field.id).join(',')
        this.refuseJobhunterUidInterview({
          jobhunterUid: data.jobhunterInfo.uid,
          interviewId: data.interviewId,
          extra: this.model.extra,
          reason
        }).then(() => {
          this.model.show = false
        })
        break
      case 'present':
        this.setUserInterviewAttend({
          interviewId: data.interviewId,
          isAttend: this.form.isAttend
        }).then(() => {
          this.model.show = false
          this.init()
        })
        break
      case 'add_address':
        this.createPositionAddress(this.form.address).then(() => {
          this.addressLists = []
          this.addressNum = 1
          this.isLastPageOfAddress = false
          this.getSimplepageAddressesLists({
            mobile: data.recruiterInfo.mobile
          }).then(() => {
            this.model.type = 'address'
            this.model.title = '选择地址'
            this.setAddressDomScroll({
              mobile: data.recruiterInfo.mobile
            })
          })
        })
        break
      default:
        break
    }
  }
  /**
   * @Author   小书包
   * @DateTime 2019-08-01
   * @detail   列表搜索
   * @param    {[type]}   index [description]
   */
  search () {
    this.getQuickApplyInterview()
  }
  /**
   * @Author   小书包
   * @DateTime 2019-08-01
   * @detail   设置不合适item激活
   * @param    {[type]}   index [description]
   */
  setReason (index) {
    this.reasonList[index].active = !this.reasonList[index].active
    this.model.reason = this.reasonList.filter(field => field.active)
  }
  /**
   * @Author   小书包
   * @DateTime 2019-08-01
   * @detail   获取选中的职位
   * @return   {[type]}         [description]
   */
  getPosition (index) {
    this.positionLists.map((field, i) => (field.active = i === index))
  }
  /**
   * @Author   小书包
   * @DateTime 2019-08-01
   * @detail   获取选中的地址
   * @return   {[type]}         [description]
   */
  getAddress (index) {
    this.addressLists.map((field, i) => {
      field.active = false
      if (i === index) {
        field.active = true
        this.model.position.positionId = field.id
        this.model.position.positionName = field.positionName
      }
    })
  }
  /**
   * @Author   小书包
   * @DateTime 2019-08-02
   * @detail   tab切换
   * @return   {[type]}        [description]
   */
  tabClick (type) {
    this.navigation.map(field => (field.active = type === field.type))
    this.form.content = ''
    this.getQuickApplyInterview().then(() => {
      this.form.tab_status = this.$route.query.tab_status
    })
  }
  /**
   * @Author   小书包
   * @DateTime 2019-08-02
   * @detail   分页获取数据
   * @return   {[type]}        [description]
   */
  pageChange (page) {
    this.form.page = page
    this.getQuickApplyInterview()
  }
  /**
   * @Author   小书包
   * @DateTime 2019-08-01
   * @detail   待办项
   * @return   {[type]}              [description]
   */
  todoAction (type, item) {
    let data = item || this.model.item
    this.form.realname = data.recruiterInfo.realname
    this.form.mobile = data.recruiterInfo.mobile
    this.model.item = data || this.model.item
    this.model.beforeType = this.model.type
    this.model.beforeTitle = this.model.title
    this.model.dateLists = []
    // this.model.position.name = data.positionName
    // this.model.position.positionId = data.positionId
    // this.model.address.addressName = data.address
    // this.model.address.addressId = data.addressId
    this.model.interviewId = data.interviewId
    // this.model.dateLists.push({active: true, value: data.handleEndTime})
    let reason = this.model.reason.map(field => field.id).join(',')
    switch (type) {
      case 'recipe':
        this.model.type = type
        this.confirmInterview({ interviewId: data.interviewId })
        break
      case 'improper':
        this.getLabelComment({ status: data.status }).then(() => {
          this.model.type = type
          this.model.show = true
          this.model.title = '不合适'
          this.model.item = data
          this.model.showFooter = true
        })
        break
      case 'arrange':
        this.model.type = type
        this.model.show = true
        this.model.title = '安排面试'
        this.model.position.name = data.positionName
        this.model.position.positionId = data.positionId
        this.model.address.addressName = data.address
        this.model.address.addressId = data.addressId
        break
      case 'modify':
        let dateLists1 = data.arrangementInfo.appointmentList
        dateLists1.map(field => (field.active = false))
        this.model.type = type
        this.model.show = true
        this.model.title = '修改面试时间'
        this.model.position.name = data.positionName
        this.model.position.positionId = data.positionId
        this.model.address.addressName = data.address
        this.model.address.addressId = data.addressId
        this.model.dateLists = dateLists1
        break
      case 'add_address':
        this.model.type = 'add_address'
        this.model.show = true
        this.model.showMap = true
        this.model.title = '新增地址'
        break
      case 'preview':
        this.model.show = true
        this.model.title = '查看面试'
        this.model.type = type
        this.model.showConfirmBtn = false
        this.model.btnTxt = '返回'
        if (data.arrangementInfo) {
          if (data.arrangementInfo.appointmentList) {
            let dateLists2 = data.arrangementInfo.appointmentList
            dateLists2.map(field => (field.active = false))
            this.model.dateLists = dateLists2
          } else {
            this.model.dateLists.push({
              active: true,
              appointment: data.arrangementInfo.appointment,
              appointmentTime: data.arrangementInfo.appointmentTime
            })
          }
          this.model.position.name = data.positionName
          this.model.position.positionId = data.positionId
          this.model.address.addressName = data.address
          this.model.address.addressId = data.addressId
        }
        break
      case 'position':
        this.positionLists = []
        this.positionNum = 1
        this.isLastPageOfPosition = false
        this.getPositionList({
          recruiter: data.recruiterInfo.uid
        }).then(() => {
          this.model.show = true
          this.model.type = type
          this.model.title = '选择职位'
          this.model.btnTxt = '返回'
          this.setPositionDomScroll({
            recruiter: data.recruiterInfo.uid
          })
        })
        break
      case 'address':
        this.addressLists = []
        this.addressNum = 1
        this.isLastPageOfAddress = false
        this.getSimplepageAddressesLists({
          mobile: data.recruiterInfo.mobile
        }).then(() => {
          this.model.show = true
          this.model.title = '选择地址'
          this.model.btnTxt = '返回'
          this.model.type = type
          this.setAddressDomScroll({
            mobile: data.recruiterInfo.mobile
          })
        })
        break
      case 'reason':
        this.model.show = true
        this.model.title = '选择不合适原因'
        this.model.type = 'reason'
        this.model.type = type
        this.refuseJobhunterUidInterview({
          jobhunterUid: data.jobhunterInfo.uid,
          interviewId: data.interviewId,
          reason,
          extra: this.model.extra
        })
        break
      case 'withdraw':
        this.interviewRetract({
          jobhunterUid: data.jobhunterInfo.uid,
          interviewId: data.interviewId
        })
        break
      case 'present':
        this.model.show = true
        this.model.title = '标记候选人是否到场'
        this.model.type = type
        break
      case 'evaluation':
        this.setUserInterviewComment({ interviewId: data.interviewId }).then(() => this.init())
        break
      case 'viewReason':
        this.sayResult(data.interviewId).then(() => {
          this.model.show = true
          this.model.title = '不合适原因'
          this.model.type = type
          this.model.showFooter = false
        })
        break
      default:
        break
    }
  }
  /* 说出不合适原因 */
  sayResult (interviewId) {
    return getInterviewComment(interviewId).then(res => (this.model.refuseReason = res.data.data.reason))
  }
  /**
   * @Author   小书包
   * @DateTime 2019-08-02
   * @detail   切换搜索类型
   * @return   {[type]}   [description]
   */
  changeSearch () {
    this.form.content = ''
  }
  /**
   * @Author   小书包
   * @DateTime 2019-08-02
   * @detail   获取时间
   * @param    {[type]}  e   [description]
   * @return   {[type]}     [description]
   */
  getTime (e) {
    this.model.dateLists.push({
      appointment: e,
      active: false,
      appointmentTime: Date.parse(new Date(e)) / 1000
    })
  }
  /**
   * @Author   小书包
   * @DateTime 2019-08-02
   * @detail   设置面试时间
   * @return   {[type]}         [description]
   */
  selectTime (index) {
    this.model.dateLists.map((field, i) => (field.active = index === i))
  }
  /**
   * @Author   小书包
   * @DateTime 2019-08-05
   * @detail   删除时间
   * @return   {[type]}         [description]
   */
  deleteTime (index) {
    this.model.dateLists.splice(index, 1)
  }
  /**
   * @Author   小书包
   * @DateTime 2019-08-02
   * @detail   初始化页面
   * @return   {[type]}   [description]
   */
  init () {
    let query = this.$route.query
    this.form = Object.assign(this.form, query)
    this.form.areaId = Number(this.form.areaId)
    if (!this.form.areaId) this.form.areaId = ''
    if (this.form.status) this.form.status = Number(this.form.status)
    if (this.form.last_status) this.form.last_status = Number(this.form.last_status)
    if (query.tab_status) {
      this.navigation.map(field => (field.active = String(query.tab_status) === field.id))
    } else {
      this.navigation[0].active = true
    }
    if (this.form.admin_uid) this.form.admin_uid = Number(this.form.admin_uid)
    this.getQuickApplyInterview()
    this.getInterviewFisrtStatusLists()
    this.getSalerList()
  }
  /**
   * @Author   小书包
   * @DateTime 2019-08-01
   * @detail   不合适撤回
   * @return   {[type]}          [description]
   */
  interviewRetract (params) {
    return interviewRetractApi(params).then(() => this.init())
  }
  /**
   * @Author   小书包
   * @DateTime 2019-08-01
   * @detail   确定约面
   * @return   {[type]}          [description]
   */
  confirmInterview (params) {
    return confirmInterviewApi(params).then(() => this.init())
  }
  /**
   * @Author   小书包
   * @DateTime 2019-08-01
   * @detail   获取不合适标签
   * @return   {[type]}   [description]
   */
  getLabelComment (params) {
    // 代表过程中的状态
    let pending = [11, 12, 21, 31, 32, 41]
    let api = pending.includes(Number(params.status)) ? getInterviewNotSuitReasonApi : getInterviewCommentReasonApi
    return api(params).then(res => {
      let reasonList = res.data.data
      reasonList.map(field => (field.active = false))
      this.reasonList = reasonList
    })
  }
  /**
   * @Author   小书包
   * @DateTime 2019-08-01
   * @detail   标记不合适
   * @return   {[type]}          [description]
   */
  refuseJobhunterUidInterview (params) {
    return refuseJobhunterUidInterviewApi(params).then(() => this.init())
  }
  /**
   * @Author   小书包
   * @DateTime 2019-08-01
   * @detail   修改面试时间
   * @param    {[type]}   param [description]
   */
  setInterviewInfo (param) {
    return setInterviewInfoApi(param).then(() => this.init())
  }
  /**
   * @Author   小书包
   * @DateTime 2019-08-01
   * @detail   获取职位列表
   * @return   {[type]}   [description]
   */
  getPositionList (data) {
    let params = {
      page: this.positionNum,
      count: this.pageSize,
      status: '0,1,2'
    }
    params = Object.assign(params, data)
    return getListApi(params).then(res => {
      let infos = res.data
      let list = infos.data
      list.map(field => (field.active = false))
      this.positionLists = this.positionLists.concat(list)
      this.isLastPageOfPosition = !((res.data.meta && res.data.meta.nextPageUrl))
      this.positionNum++
    })
  }
  /**
   * @Author   小书包
   * @DateTime 2019-08-01
   * @detail   获取地址列表
   * @return   {[type]}   [description]
   */
  getSimplepageAddressesLists (data) {
    let params = {
      page: this.addressNum,
      count: this.pageSize
    }
    params = Object.assign(params, data)
    return getSimplepageAddressesListsApi(params).then(res => {
      let infos = res.data
      let list = infos.data
      list.map(field => (field.active = false))
      this.addressLists = this.addressLists.concat(list)
      this.isLastPageOfAddress = !((res.data.meta && res.data.meta.nextPageUrl))
      this.addressNum++
    })
  }
  /**
   * @Author   小书包
   * @DateTime 2019-08-01
   * @detail   设置地址dom的滚动加载
   * @return   {[type]}   [description]
   */
  setAddressDomScroll (params) {
    return new Promise((resolve, reject) => {
      let dom = document.getElementById('scroll_div_ul_address')
      dom.onscroll = () => {
        let wholeHeight = dom.scrollHeight
        let scrollTop = dom.scrollTop
        let divHeight = dom.clientHeight
        if (scrollTop + divHeight >= wholeHeight) this.getSimplepageAddressesLists(params).then(() => resolve())
      }
    })
  }
  /**
   * @Author   小书包
   * @DateTime 2019-08-01
   * @detail   设置职位dom的滚动加载
   * @return   {[type]}   [description]
   */
  setPositionDomScroll (params) {
    return new Promise((resolve, reject) => {
      let dom = document.getElementById('scroll_div_ul_position')
      dom.onscroll = () => {
        let wholeHeight = dom.scrollHeight
        let scrollTop = dom.scrollTop
        let divHeight = dom.clientHeight
        if (scrollTop + divHeight >= wholeHeight) this.getPositionList(params).then(() => resolve())
      }
    })
  }
  /**
   * @Author   小书包
   * @DateTime 2019-08-02
   * @detail   detail
   * @param    {[type]}   params [description]
   * @return   {[type]}          [description]
   */
  openPosition (params) {
    return openPositionApi(params)
  }
  /**
   * @Author   小书包
   * @DateTime 2019-08-02
   * @detail   设置候选人是否到场
   * @param    {[type]}   params [description]
   */
  setUserInterviewAttend (params) {
    return setUserInterviewAttendApi(params)
  }
  /**
   * @Author   小书包
   * @DateTime 2019-08-02
   * @detail   评价面试
   */
  setUserInterviewComment (params) {
    return setUserInterviewCommentApi(params)
  }
  /**
   * @Author   小书包
   * @DateTime 2019-08-02
   * @detail   显示简历
   * @return   {[type]}       [description]
   */
  showResume (data) {
    if (this.AdminShow === 3 || this.AdminShow === 4) {
      this.$message({ message: '用户暂无权限' })
    } else {
      this.model.resumeId = String(data.jobhunterInfo.uid)
      this.model.showResume = true
      this.$nextTick(() => {
        let AdminShow = +sessionStorage.getItem('AdminShow')
        this.$refs['resume'].testingAdmin(AdminShow)
        this.$refs['resume'].getResume()
        this.$refs['resume'].showMark()
        this.$refs['resume'].initResume()
        this.$refs['resume'].operating(data.jobhunterInfo.uid, {
          action: '查看',
          desc: '简历'
        })
      })
    }
  }
  /**
   * @Author   小书包
   * @DateTime 2019-08-02
   * @detail   获取招聘官主页二维码
   * @return   {[type]}         [description]
   */
  getRecruiterCodeUrl (uid) {
    this.model.qrCode = ''
    this.openType = 'recruiter'
    return getRecruiterCodeUrlApi({ id: uid }).then(res => (this.model.qrCode = res.data.data.qrCodeUrl))
  }
  /**
   * @Author   小书包
   * @DateTime 2019-08-02
   * @detail   获取招简历二维码
   * @return   {[type]}         [description]
   */
  getResumeCodeUrl (uid) {
    this.model.qrCode = ''
    this.openType = 'resume'
    return getResumeCodeUrlApi({ id: uid }).then(res => (this.model.qrCode = res.data.data.qrCodeUrl))
  }
  /**
   * @Author   小书包
   * @DateTime 2019-08-02
   * @detail   获取招职位二维码
   * @return   {[type]}         [description]
   */
  getPositionCodeUrl (uid) {
    this.model.qrCode = ''
    this.openType = 'position'
    return getPositionCodeUrlApi({ id: uid }).then(res => (this.model.qrCode = res.data.data.qrCodeUrl))
  }
  showCallback () {}
  /**
   * @Author   小书包
   * @DateTime 2019-08-02
   * @detail   地图组件点击取消
   * @return   {[type]}   [description]
   */
  popCancel () {
    this.model.showMap = !this.model.showMap
  }
  /**
   * @Author   小书包
   * @DateTime 2019-08-02
   * @detail   地图组件点击确定
   * @param    {[type]}   e [description]
   */
  addAdress (e) {
    let item = this.model.item
    this.form.address = {
      mobile: item.recruiterInfo.mobile,
      areaName: e.data.area_id,
      address: e.data.address,
      doorplate: e.data.doorplate,
      lng: e.data.lng,
      lat: e.data.lat
    }
  }
  /**
   * @Author   小书包
   * @DateTime 2019-08-02
   * @detail   创建职位地址
   * @return   {[type]}          [description]
   */
  createPositionAddress (params) {
    return createPositionAddressApi(params)
  }
  /**
   * @Author   小书包
   * @DateTime 2019-08-02
   * @detail   编辑职位地址
   * @return   {[type]}          [description]
   */
  editPositionAddress (params) {
    if (!params.areaName) {
      delete params.areaName
      params.areaId = this.form.address.areaId
    }
    return editPositionAddressApi(params)
  }
  /**
   * @Author   小书包
   * @DateTime 2019-08-02
   * @detail   获取职位地址
   * @return   {[type]}          [description]
   */
  getPositionAddress (params) {
    return getPositionAddressApi(params)
  }
  /**
   * @Author   小书包
   * @DateTime 2019-08-02
   * @detail   编辑职位
   * @return   {[type]}         [description]
   */
  editAddress (index) {
    let item = this.addressLists.find((field, i) => i === index)
    let data = this.model.item
    this.getPositionAddress({ id: item.id }).then(res => {
      let infos = res.data.data
      this.form.address = {
        mobile: data.recruiterInfo.mobile,
        areaName: infos.area,
        address: infos.address,
        doorplate: infos.doorplate,
        lng: infos.lng,
        lat: infos.lat,
        id: infos.id,
        areaId: infos.areaId
      }
      this.model.type = 'edit_address'
      this.model.show = true
      this.model.title = '编辑地址'
    })
  }
  reset () {
    this.navigation.map((field, index) => (field.active = index === 0))
    this.form = {
      companyName: '',
      searchType: '',
      date1: '',
      resource: '',
      page: 1,
      content: '',
      status: '',
      mobile: '',
      realname: '',
      isAttend: '0',
      tab_status: '1',
      address: {
        mobile: '',
        title: '',
        areaName: '',
        address: '',
        doorplate: '',
        lng: '',
        lat: ''
      }
    }
    this.$refs.cascader.inputValue = ''
    this.getQuickApplyInterview()
  }
  /**
   * @Author   小书包
   * @DateTime 2019-08-05
   * @detail   获取面试状态一级列表
   * @return   {[type]}   [description]
   */
  getInterviewFisrtStatusLists () {
    // let query = this.$route.query
    return getInterviewFisrtStatusListsApi().then(res0 => {
      getInterviewSecondStatusListsApi().then(res1 => {
        this.statusChildLists = res1.data.data
        this.statusLists = res0.data.data
      })
    })
  }
  /**
   * @Author   小书包
   * @DateTime 2019-08-05
   * @detail   跳转职位详情
   * @return   {[type]}      [description]
   */
  readPosition (id) {
    window.open(`/manage/positionManage/positionAuditDetail?id=${id}`, '_blank')
  }
  hide () {
    this.openType = ''
  }
  /**
   * @Author   小书包
   * @DateTime 2019-08-07
   * @detail   获取销售列表
   * @return   {[type]}   [description]
   */
  getSalerList () {
    getSalerListApi().then(res => (this.saleLists = res.data.data))
  }
  download () {
    this.$confirm('是否导出该列表数据？', '提示', {
      confirmButtonText: '是',
      cancelButtonText: '否',
      type: 'warning'
    }).then(() => {
      let date = new Date()
      let downloadName = `24h急速反馈-${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}.xlsx`
      let url = `${API_ROOT}/interview/quickApply?isExport=1`
      let tab = this.navigation.find(field => field.active)

      url += `&tab_status=${tab.id}`

      if (this.form.companyName) {
        url += `&companyName=${this.form.companyName}`
      }
      if (this.form.admin_uid) {
        url += `&admin_uid=${this.form.admin_uid}`
      }
      if (this.form.searchType && this.form.content) {
        url += `&searchType=${this.form.searchType}&content=${this.form.content}`
      }
      if (this.form.status) {
        url += `&status=${this.form.status}`
      }
      if (this.form.status === 52) {
        url += `&last_status=${this.form.last_status}`
      }
      if (this.form.positionLabel) {
        url += `&positionLabel=${this.form.positionLabel}`
      }
      // 已经选择城市
      if (this.form.areaId) {
        url += `&areaId=${this.form.areaId}`
      }
      if (this.form.createStartTime && this.form.createEndTime) {
        url += `&createStartTime=${this.form.createStartTime}&createEndTime=${this.form.createEndTime}`
      }
      url = url.replace(/\s*/g, '')
      let xmlResquest = new XMLHttpRequest()
      xmlResquest.open('get', url, true)
      xmlResquest.setRequestHeader('Content-type', 'application/json')
      xmlResquest.setRequestHeader('Authorization-Admin', getAccessToken())
      xmlResquest.responseType = 'blob'
      this.canDownloadData = false
      xmlResquest.onload = () => {
        let content = xmlResquest.response
        let link = document.createElement('a')
        let blob = new Blob([content])
        link.download = downloadName
        link.style.display = 'none'
        link.href = URL.createObjectURL(blob)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        this.canDownloadData = true
      }
      xmlResquest.send()
    }).catch(() => {
      this.$message({
        type: 'info',
        message: '已取消导出'
      })
    })
  }
  type (e) {
    this.form.positionLabel = e[e.length - 1]
  }
  ManageList () {
    getLabelPositionListApi().then(res => {
      this.mgoptions = res.data.data
      this.mgoptions.forEach(item => {
        item.children.forEach(item1 => {
          item1.children.forEach(item2 => {
            let result = JSON.stringify(item2.children)
            if (result === '[]') delete item2.children
          })
        })
      })
    })
  }
  mounted () {
    this.getAddressLists()
    this.init()
    this.ManageList()
    this.AdminShow = +sessionStorage.getItem('AdminShow')
    // testDeleteApi()
  }
}
</script>
