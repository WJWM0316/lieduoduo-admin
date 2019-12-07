<template>
  <div id="operation-index">
  	<div class="header">
	  	<div class="floor-one">
	  		<div class="item" v-for="(item, index) in portData" :key="item.key" :class="{active: item.active}" @click="changeBannerDevice(item, index)">{{item.text}}</div>
				<router-link :to="{ name: 'operationAdd', query: {key: portItem.key} }" class="add item">新 增</router-link>
	  	</div>
	  	<div class="floor-tow">
				<el-input v-model="form.name" placeholder="搜索广告位名称" style="width: 400px;"></el-input>
	      <div class="item mybutton">搜 索</div>
	  	</div>
	  	<div class="bank-type-box">
	  		<div class="type-item" v-if="filter.client">
          <div class="type-filter">用户端：</div>
          <div class="type-ul">
            <span
            	v-for="(clientItem, clientIndex) in filter.client"
            	:key="clientIndex"
            	class="type-li"
            	:class="{active: clientItem.active}"
            	@click="choose(clientItem, clientIndex, 'client')">{{clientItem.text}}</span>
          </div>
        </div>
        <div class="type-item" v-if="filter.location">
          <div class="type-filter">运营位：</div>
          <div class="type-ul">
            <span
            	v-for="(locationItem, locationIndex) in filter.location"
            	:key="locationIndex"
            	class="type-li"
            	:class="{active: locationItem.active}"
            	@click="choose(locationItem, locationIndex, 'location')">{{locationItem.text}}</span>
          </div>
        </div>
        <div class="type-item" v-if="filter.area">
          <div class="type-filter">城市：</div>
          <div class="type-ul">
            <span
            	v-for="(areaItem, areaIndex) in filter.area"
            	:key="areaIndex"
            	class="type-li"
            	:class="{active: areaItem.active}"
            	@click="choose(areaItem, areaIndex, 'area')">{{areaItem.text}}</span>
          </div>
        </div>
	    </div>
	    <div class="floor-three">
	    	<template  v-if="form.type === 1">
					<div class="myselected">
						状态：
						<el-select v-model="form.status" placeholder="请选择">
					    <el-option label="全部" value=""></el-option>
					    <el-option label="上线" value="1"></el-option>
					    <el-option label="下线" value="0"></el-option>
					  </el-select>
					</div>
					<div class="mydate">
						上下架时间：
						<el-date-picker
				      v-model="form.time"
				      type="daterange"
				      value-format="yyyy-MM-dd"
				      range-separator="至"
				      start-placeholder="开始日期"
				      end-placeholder="结束日期">
				    </el-date-picker>
					</div>
				</template>
				<div class="submit item" @click="getLists">查 询</div>
				<div class="add item" @click="toggleSwitch">切换排期视窗</div>
	  	</div>
  	</div>
  	<div v-if="form.type === 1">
	  	<el-table
	      :data="tableData"
	      :default-sort = "{prop: 'date', order: 'descending'}"
	      @sort-change="sortChange"
	      style="width: 100%">
	      	<el-table-column
		        prop="id"
		        label="广告位ID">
		      </el-table-column>
		      <el-table-column
		        prop="name"
		        label="广告位名称">
		      </el-table-column>
		      <el-table-column
		        prop="createdAt"
		        sortable
		        label="上架时间">
		      </el-table-column>
		      <el-table-column
		        prop="endTime"
		        sortable
		        label="下架时间">
		      </el-table-column>
		      <el-table-column
		        prop="type"
		        label="运营位类型">
		      </el-table-column>
		      <el-table-column
		        prop="areaName"
		        label="城市">
		      </el-table-column>
		      <el-table-column
		        prop="status"
		        label="状态">
		        <template slot-scope="{row}">
		        	{{row.status == 0 ? '下线' : '上线'}}
            </template>
		      </el-table-column>
		      <el-table-column
		        prop="smallImg"
		        label="图片">
		        <template slot-scope="{row}">
		        	<img :src="row.smallImg.smallUrl" alt="" v-if="row.smallImg">
            </template>
		      </el-table-column>
		      <el-table-column
		        prop="sort"
		        sortable
		        label="排序">
		      </el-table-column>
		      <el-table-column
		        prop="address"
		        label="操作">
		        <template slot-scope="{row}">
		        	<router-link :to="{ name: 'operationEdit', query: {id: row.id} }">编辑</router-link>
            </template>
		      </el-table-column>
	    </el-table>
    </div>
    <div class="operation-content" v-if="form.type === 2">
	    <datePicker :replaceItemHtml="replaceItemHtml" @changeDay="changeDay" />
	    <ul class="rank-ul">
	    	<li>
					<h2 class="rank-item-tips">2019年12月05日-排期明细 （剩余<span class="rank-item-week-strong">3个</span>可用）</h2>
					<span class="rank-item-week-tips">*以下运营位按权重排序</span>
	    	</li>
	    	<li v-for="item in 3" :key="item" class="rank-item">
	    		<h2 class="rank-item-title">运营招聘专场     </h2>
	    		<p>2019-11-28 至2019-12-09</p>
	    		<router-link :to="{ name: 'operationEdit', query: {id: row.id} }" class="rank-item-edit" tag="span">编辑</router-link>
	    	</li>
	    </ul>
	  </div>
  </div>
</template>
<script>
import datePicker from '@/components/myDatePicker/date-picker.vue'
import {
	getBannerDeviceApi,
	getBannerParameterApi,
	getBannerListsApi
} from 'API/operation'

const formatDate = (timestamp) => {
	let date = new Date(timestamp)
	let YY = date.getFullYear() + '-'
	let MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
	let DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate())
	// var hour = date.getHours() + ':'
 //  var minute = date.getMinutes() + ':'
 //  var second = date.getSeconds() 
	return YY + MM + DD
}

const curTimestamp = Date.parse(new Date(formatDate(Date.parse(new Date()))))

export default {
	components: {
    datePicker
  },
	data() {
		return {
			portData: [],
			filter: {},
			tableData: [],
      list: [
      	{
      		date: '2019-12-05',
      		number: 1,
      		allNumber: 8
      	},
      	{
      		date: '2019-12-03',
      		number: 5,
      		allNumber: 8
      	},
      	{
      		date: '2019-12-04',
      		number: 8,
      		allNumber: 8
      	}
      ],
      form: {
      	time: [],
      	name: '',
      	type: 1,
      	status: '',
      	area_id: '',
      	client: '',
      	location: ''
      },
      portItem: {}
		}
	},
	methods: {
		changeDay(infos) {
			console.log(infos)
		},
		toggleSwitch(num) {
			this.form.type = this.form.type === 1 ? 2 : 1
		},
		edit(item, index) {
			console.log(item)
		},
		replaceItemHtml(item, index) {
			let html = item.content
			let curDate = formatDate(Date.parse(new Date()))
			this.list.map(v => {
				if(v.date === item.date && v.number) {
					// 当天数字显示黄色
					if(Date.parse(new Date(v.date)) === curTimestamp) {
						html = item.content + `<span class="yellow">${v.number}</span>`
					}
					// 早于当前日期，数字显示紫色
					if(Date.parse(new Date(v.date)) < curTimestamp) {
						html = item.content + `<span class="purple">${v.number}</span>`
					}
					// 运营位已满则显示红色
					if(v.allNumber === v.number) {
						html = item.content + `<span class="red">${v.number}</span>`
					}
				}
			})

			return html
		},
		sortChange(e) {
			console.log(e)
			switch(e.prop) {
				case 'online_date':
					break
				case 'offline_date':
					break
				case 'id':
					break
				default:
					break
			}
		},
		getBannerDevice() {
			return getBannerDeviceApi().then(({ data }) => {
				let portData = data.data
				portData.map((v, i) => v.active = !i ? true : false)
				this.portData = portData
				this.portItem = portData[0]
				this.getBannerParameter(this.portItem)
			})
		},
		getBannerParameter(item) {
			getBannerParameterApi({device: item.key}).then(({data}) => {
				let filter = data.data
				Object.keys(filter).map(v => filter[v].map((field, index) => field.active = !index ? true : false))
				this.filter = filter
			})
		},
		changeBannerDevice(item, index) {
			this.portItem = item
			this.portData.map((v, i) => v.active = i === index ? true : false)
			this.getBannerParameter(item)
			this.form.device = item.key
		},
		getLists() {
			let params = {
				page: 1,
				count: 20
			}
			if(this.form.name) {
				params = Object.assign(params, {name: this.form.name})
			}
			if(this.form.time && this.form.time.length) {
				params = Object.assign(params, {start_time: this.form.time[0], end_time: this.form.time[1]})
			}
			if(this.form.area) {
				params = Object.assign(params, {area_id: this.form.area})
			}
			if(this.form.client) {
				params = Object.assign(params, {client: this.form.client})
			}
			if(this.form.location) {
				params = Object.assign(params, {location: this.form.location})
			}
			if(this.form.device) {
				params = Object.assign(params, {device: this.form.device})
			}
			if(this.form.status) {
				params = Object.assign(params, {status: this.form.status})
			}
			getBannerListsApi(params).then(({ data }) => {
				this.tableData = data.data
				console.log(data)
			})
		},
		choose(item, index, key) {
			this.filter[key].map((v, i) => v.active = index === i ? true : false)
			this.form[key] = item.key
		}
	},
	created() {
		this.getBannerDevice().then(() => this.getLists())
	}
}
</script>
<style lang="less">
#operation-index{
	.header{
		margin-bottom: 30px;
	}
	.floor-one{
		margin: 20px 0;
		.item{
			display: inline-block;
			background-color: #f4f4f5;
	    display: inline-block;
	    height: 40px;
	    line-height: 40px;
	    font-size: 12px;
	    color: #909399;
	    cursor: pointer;
	    transition: opacity 400ms, background 400ms, color 400ms;
	    padding: 0 20px;
		}
		.item.active{
			background-color: #3e294d;
    	color: white;
    	pointer-events: none;
		}
		.add{
			display: inline-block;
	    height: 40px;
	    line-height: 40px;
	    font-size: 12px;
	    color: #909399;
	    cursor: pointer;
	    float: right;
	    background-color: #3e294d;
    	color: white;
		}
	}
	.floor-tow{
		.el-input{
			display: inline-block;
			vertical-align: middle;
		}
		.mybutton{
			display: inline-block;
			vertical-align: middle;
			border-radius: 0;
			display: inline-block;
			background-color: #f4f4f5;
	    display: inline-block;
	    height: 40px;
	    line-height: 40px;
	    font-size: 12px;
	    color: #909399;
	    cursor: pointer;
	    transition: opacity 400ms, background 400ms, color 400ms;
	    padding: 0 20px;
	    background-color: #3e294d;
    	color: white;
    	position: relative;
    	left: -1px;
		}
		.el-input__inner{
			border-radius: 0;
		}
	}
	.bank-type-box{
    background: white;
    padding-top: 30px;
    background: white;
    padding-bottom: 30px;
    .bank-type{
      /*width: 1200px;*/
      /*margin: 0 auto;*/
    }
    .type-filter{
      height:20px;
      font-size:14px;
      font-weight:400;
      color:#333333;
      line-height:20px;
      margin-right: 16px;
      display: inline-block;
      flex: 0 0 70px;
      align-self: stretch;
      position: relative;
      text-align: left;
    }
    .type-li {
      display: inline-block;
      margin-right: 30px;
      font-size:14px;
      font-weight:400;
      color:#66666E;
      line-height:20px;
      cursor: pointer;
      &:hover {
        font-weight:500;
        color:#3e294d;
      }
    }
    .active{
      font-weight:500;
      color:#3e294d;
    }
    .type-item {
      margin-bottom: 10px;
      display: flex;
      align-items: flex-start;
      &:last-child{
        margin-bottom: 0px;
      }
    }
  }
  .floor-three{
  	.myselected{
  		line-height: 40px;
  		display: inline-block;
  		margin-right: 40px;
  	}
  	.mydate{
  		display: inline-block;
  		line-height: 40px;
  		display: inline-block;
  		margin-right: 40px;
  	}
  	.item{
			display: inline-block;
			background-color: #f4f4f5;
	    display: inline-block;
	    height: 40px;
	    line-height: 40px;
	    font-size: 12px;
	    color: #909399;
	    cursor: pointer;
	    transition: opacity 400ms, background 400ms, color 400ms;
	    padding: 0 20px;
		}
  	.add{
			display: inline-block;
	    display: inline-block;
	    height: 40px;
	    line-height: 40px;
	    font-size: 12px;
	    color: #909399;
	    cursor: pointer;
	    float: right;
	    background-color: #3e294d;
    	color: white;
		}
		.submit{
			display: inline-block;
	    display: inline-block;
	    height: 40px;
	    line-height: 40px;
	    font-size: 12px;
	    color: #909399;
	    cursor: pointer;
	    background-color: #3e294d;
    	color: white;
		}
  }
  .el-table{
  	margin-top: 30px;
  }
  .rank-ul{
  	flex: 1;
  	padding-left: 20px;
  }
  .rank-item{
  	margin-top: 20px;
  	position: relative;
  	border-bottom: 1px dashed rgba(0,0,0,.1);
  	padding: 14px 0;
  }
  .rank-item-edit{
  	position: absolute;
  	top: 50%;
  	transform: translateY(-50%);
  	right: 0;
  	cursor: pointer;
  }
  .rank-item-title{
  	font-size: 18px;
  }
  .rank-item-tips{
  	font-size: 16px;
  }
  .rank-item-week-tips{
  	font-size: 14px;
  	color: #999999;
  }
  .rank-item-week-strong{
  	color: #800080;
  	font-weight: bolder;
  }
  .operation-content{
  	display: flex;
  }
}
.reset-el-date-picker{
  .yellow {
    span{
      color: #FF6600 !important;
      font-weight: normal !important;
    }
  }
  .purple {
  	span{
      color: purple !important;
      font-weight: normal !important;
    }
  }
  .today {
    span{
      color: #FF6600 !important;
      font-weight: normal !important;
    }
  }
  .red {
    span{
      color: #f00 !important;
      font-weight: normal !important;
    }
  }
}
</style>
