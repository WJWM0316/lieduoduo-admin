<template>
  <div id="operation-index">
  	<div class="header">
	  	<div class="floor-one">
	  		<div class="item" v-for="(item, index) in portData" :key="item.key" :class="{active: item.active}" @click="changeBannerDevice(item, index)">{{item.text}}</div>
				<router-link :to="{ name: 'operationAdd' }" class="add item">新 增</router-link>
	  	</div>
	  	<div class="floor-tow" v-if="form.type === 1">
	  		广告位名称：
				<el-input v-model="form.name" placeholder="搜索广告位名称" style="width: 400px;"></el-input>
	      <!-- <div class="item mybutton" @click="getLists">搜 索</div> -->
	  	</div>
	  	<div class="bank-type-box">
	  		<div class="type-item" v-if="filter.client && filter.client.length">
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
        <div class="type-item" v-if="filter.location && filter.location.length">
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
        <div class="type-item" v-if="filter.area && filter.area.length">
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
				<template v-if="form.type === 1">
					<div class="myselected">
						状态：
						<el-select v-model="form.status" placeholder="请选择">
					    <el-option label="全部" value=""></el-option>
					    <el-option label="上线" value="1"></el-option>
					    <el-option label="下线" value="0"></el-option>
					    <el-option label="未上架" value="2"></el-option>
					  </el-select>
					</div>
					<div class="mydate">
						上下架时间：
						<el-date-picker
				      v-model="form.time"
				      type="datetimerange"
				      value-format="yyyy-MM-dd HH:mm:ss"
				      range-separator="至"
				      start-placeholder="开始日期"
				      end-placeholder="结束日期">
				    </el-date-picker>
					</div>
					<div class="submit item" @click="getLists">查 询</div>
				</template>
				<div class="add item" @click="toggleSwitch(2)" v-show="form.type === 1">切换排期视窗</div>
				<div class="add item" @click="toggleSwitch(1)" v-show="form.type === 2">切换列表视窗</div>
	  	</div>
  	</div>
  	<div v-if="form.type === 1">
	  	<el-table
	      :data="tableData.list"
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
		        prop="startTime"
		        sortable
		        label="上架时间">
		      </el-table-column>
		      <el-table-column
		        prop="endTime"
		        sortable
		        label="下架时间">
		      </el-table-column>
		      <el-table-column
		        prop="locationName"
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
		        prop="bigImg"
		        label="图片">
		        <template slot-scope="{row}">
		        	<img :src="row.bigImg.smallUrl" alt="" v-if="row.bigImg">
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
		        	<router-link :to="{ name: 'operationEdit', query: {id: row.id} }" tag="span" style="cursor: pointer;">编辑</router-link>
            </template>
		      </el-table-column>
	    </el-table>
	    <div class="list-footer"  v-if="tableData.total > form.count">
        <el-pagination
	        layout="prev, pager, next, slot"
	        :total="tableData.total"
	        :page-size="Number(form.count)"
	        prev-text="上一页"
	        next-text="下一页"
	        :current-page="Number(form.page)"
	        @current-change="changePage">
	        <span class="total">共{{ Math.ceil(tableData.total/20) }}页, {{tableData.total}}条记录</span>
	      </el-pagination>
			</div>
    </div>
    <div class="operation-content" v-if="form.type === 2">
    	<div class="date-box" :class="{active: !rankData.show}">
    		<datePicker :replaceItemHtml="replaceItemHtml" @changeDay="changeDay" v-if="rankData.show" @change="changeMounth" />
    		<div class="disable" v-if="!rankData.show">
    			<div class="circle">?</div>
    			<div class="tips">选择对应查询条件后，点击查询查看排期</div>
    		</div>
    	</div>
	    <ul class="rank-ul">
	    	<li>
					<h2 class="rank-item-tips">{{rankData.date}}-排期明细</h2>
					<span class="rank-item-week-tips">*以下运营位按权重排序</span>
	    	</li>
	    	<li v-for="(rank, rankIndex) in rankData.list" :key="rankIndex" class="rank-item" v-if="rankData.list.length && rankIndex <= 5">
	    		<h2 class="rank-item-title">{{rank.name}}</h2>
	    		<p>{{rank.createdAt}} 至{{rank.endTime}}</p>
	    		<router-link :to="{ name: 'operationEdit', query: {id: rank.id} }" class="rank-item-edit" tag="span">编辑</router-link>
	    	</li>
	    	<li class="nodata-rank" v-if="!rankData.list.length">
	    		暂无数据
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
	getBannerListsApi,
	getBannerTimeNumApi
} from 'API/operation'

const currentDate = new Date()
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

const getDays = (year =  currentDate.getFullYear(), month = currentDate.getMonth()) => {
	var d = new Date(year, month - 1, 0);
  return d.getDate();
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
			tableData: {
				list: [],
				total: 0,
				isLoaded: false,
				count: 20,
				page: 1
			},
      rankData: {
      	list: [],
      	total: 0,
      	isLoaded: false,
      	number: 0,
      	count: 6,
      	show: true,
      	calendarList: [],
      	hasLoadCalendar: false,
      	surplusNum: 0
      },
      form: {
      	time: [],
      	name: '',
      	type: 1,
      	status: '',
      	area_id: '',
      	client: '',
      	location: '',
      	count: 20,

      },
      other: {}
		}
	},
	methods: {
		getCurrentTime() {
			let date = new Date()
			let YY = date.getFullYear() + '-'
			let MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
			let DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate())
			var hour = date.getHours() + ':'
		  var minute = date.getMinutes() + ':'
		  var second = date.getSeconds()
		  return `${YY}${MM}${DD}`
		},
		changeDay(infos) {
			let tem = infos.date.split('-')
			this.form.time = [
				`${infos.date} 00:00:00`,
				`${infos.date} 23:59:59`
			]
			this.rankData.date = `${tem[0]}年${tem[1]}月${tem[2]}日`
			this.rankData.list = this.rankData.calendarList.find(v => infos.date === v.date).arrDate
			this.rankData.surplusNum = this.rankData.calendarList.find(v => infos.date === v.date).surplusNum
		},
		changeCalendarStatus() {
			if(!this.filter.client[0].active && this.filter.location.length && !this.filter.location[0].active) {
				this.rankData.show = true
			} else {
				this.rankData.show = false
			}
		},
		toggleSwitch(num) {
			this.changeCalendarStatus()
			this.form.type = num
			let tem = this.getCurrentTime().split('-')
			this.changeMounth()
			if(num === 2 && !this.rankData.isLoaded) {
				this.form.time = [
					`${this.getCurrentTime()} 00:00:00`,
					`${this.getCurrentTime()} 23:59:59`
				]
				this.rankData.date = `${tem[0]}年${tem[1]}月${tem[2]}日`
				// this.getRankLists()
			}
			if(this.rankData.show && num === 2) {
				this.getBannerTimeNum()
			}
		},
		changeMounth(e) {
			if(!e) return
			let tem = e.time.split('-')
			this.getBannerTimeNum(Number(tem[0]), Number(tem[1]))
		},
		replaceItemHtml(item, index) {
			let html = item.content
			let curDate = formatDate(Date.parse(new Date()))
			this.rankData.calendarList.map(v => {
				if(v.date === item.date && v.useNum) {
					// 当天数字显示黄色
					if(Date.parse(new Date(v.date)) >= curTimestamp) {
						html = item.content + `<span class="yellow">${v.useNum}</span>`
					}
					// 早于当前日期，数字显示紫色
					if(Date.parse(new Date(v.date)) < curTimestamp) {
						html = item.content + `<span class="purple">${v.useNum}</span>`
					}
					// 运营位已满则显示红色
					if(!v.surplusNum) {
						html = item.content + `<span class="red">${v.useNum}</span>`
					}
				}
			})

			return html
		},
		sortChange(e) {
			let { order } = e
			let params = {}
			switch(e.prop) {
				case 'startTime':
					if(order) {
						params = {start_time_sort: order.replace('ending', '')}
					}
					this.other = params
					this.getLists()
					break
				case 'endTime':
					if(order) {
						params = {end_time_sort: order.replace('ending', '')}
					}
					this.other = params
					this.getLists()
					break
				case 'sort':
					if(order) {
						params = {sort: order.replace('ending', '')}
					}
					this.other = params
					this.getLists()
					break
				default:
					break
			}
		},
		getBannerDevice() {
			let { query } = this.$route
			return getBannerDeviceApi().then(({ data }) => {
				let portData = data.data.filter(v => v.key !== 'pc')
				portData.map((v, i) => {
					v.active = false
					if((!i && !query.device) || (v.key === query.device)) {
						v.active = true
						this.form.device = query.device
						this.getBannerParameter(v)
					}
				})
				this.portData = portData
			})
		},
		getBannerParameter(item) {
			let { query } = this.$route
			this.form = Object.assign(this.form, query)
			let params = {device: item.key}
      if(item.client) {
        params = Object.assign(params, {client: item.client})
      }
			getBannerParameterApi(params).then(({data}) => {
				let filter = data.data
				filter.client.map((v, i) =>  v.active = (v.key === query.client) || (!i && !query.client) ? true : false)
				filter.location.map((v, i) =>  v.active = (v.key === query.location) || (!i && !query.location) ? true : false)
				filter.area.map((v, i) =>  v.active = (v.key === query.area_id) || (!i && !query.area_id) ? true : false)
				this.filter = filter
			})
		},
		reGetBannerParameter(item) {
			let {query} = this.$route
			let params = {device: item.key}
      if(item.client) {
        params = Object.assign(params, {client: item.client})
      }
			getBannerParameterApi(params).then(({data}) => {
				this.form.area_id = ''
      	this.form.location = ''
				let filter = data.data
				Object.keys(filter).map(v => filter[v].map((field, index) => field.active = !index ? true : false))
				delete filter.client
				filter.location.map((v, i) =>  v.active = (v.key === query.location) || (!i && !query.location) ? true : false)
				filter.area.map((v, i) =>  v.active = (v.key === query.area_id) || (!i && !query.area_id) ? true : false)
				this.filter = Object.assign(this.filter, filter)
			})
		},
		changeBannerDevice(item, index) {
			this.form = {
      	time: [],
      	name: '',
      	type: 1,
      	status: '',
      	area_id: '',
      	client: '',
      	location: '',
      	count: 20,
      }
      this.$router.push({query: {
				device: item.key
			}})
			this.portData.map((v, i) => v.active = i === index ? true : false)
			this.getBannerParameter(item)
			this.form.device = item.key
			this.tableData.page = 1
			this.getLists()
		},
		getLists() {
			let params = {
				page: this.tableData.page,
				count: this.tableData.count
			}
			params = Object.assign(params, this.other)
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
				this.tableData.list = data.data
				this.tableData.total = data.meta.total
				this.$router.push({query: params})
			})
		},
		getBannerTimeNum(year =  currentDate.getFullYear(), month = currentDate.getMonth() + 1) {
			let deviceItem = this.portData.find(v => v.active)
			let params = {
				year,
				month
			}
			if(this.form.client) {
				params = Object.assign(params, {client: this.form.client})
			}
			if(this.form.location) {
				params = Object.assign(params, {location: this.form.location})
			}
			if(deviceItem) {
				params = Object.assign(params, {device: deviceItem.key})
			}
			return getBannerTimeNumApi(params).then(({ data }) => {
				let calendarList = data.data
				let now = formatDate(Date.parse(new Date()))
				let tem = now.split('-')
				this.rankData.date = `${tem[0]}年${tem[1]}月${tem[2]}日`
				this.rankData.list = calendarList.find(v => now === v.date).arrDate
				this.rankData.surplusNum = calendarList.find(v => now === v.date).surplusNum
				this.rankData.calendarList = calendarList
				this.rankData.hasLoadCalendar = true
			})
		},

		choose(item, index, key) {
			this.filter[key].map((v, i) => v.active = index === i ? true : false)
			this.form[key] = item.key
			let deviceItem = this.portData.find(v => v.active)
			if(key === 'client') {
				this.form.area_id = ''
				this.form.location = ''
				this.reGetBannerParameter({key: deviceItem.key, client: item.key})
				return
			}
			this.changeCalendarStatus()
			if(this.rankData.show) {
				this.getBannerTimeNum()
			} else {
				this.rankData.list = []
			}
		},
		changePage(page) {
			this.tableData.page = page
			this.getLists()
		}
	},
	created() {
		// let { query } = this.$route
		// if(query.device) {
		// 	this.form.device = query.device
		// }
		this.getBannerDevice().then(() => this.getLists())
	}
}
</script>
<style lang="less">
#operation-index{
	.list-footer {
    text-align: center;
    box-sizing: border-box;
    z-index: 200;
    position: fixed;
    left: 200px;
    bottom: 0;
    padding: 8px;
    width: 100%;
    background-color: #ffffff;
    box-shadow: 0px -1px 0px 0px rgba(232, 233, 235, 1);
    border: 1px solid #e8e9eb;
  }
	.header{
		margin-bottom: 30px;
	}
	.floor-one{
		margin-top: 20px;
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
		margin-top: 20px;
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
      font-weight:700;
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
  	overflow: hidden;
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
  	padding-bottom: 50px;
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
  .nodata-rank{
		line-height: 50px;
		color: #666666;
  }
  .date-box{
    width: 300px;
    height: 300px;
    border-radius: 4px;
    background-color: white;
    position: relative;
    .disable {
			text-align: center;
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			width: 100%;
    }
    .circle{
	    width: 84px;
	    height: 84px;
	    font-size: 36px;
	    color: #666666;
	    border: 1px dashed rgba(0,0,0,.1);
	    line-height: 84px;
	    text-align: center;
	    border-radius: 50%;
	    display: inline-block;
    }
    .tips{
    	text-align: center;
    	color: rgba(0,0,0,.4);
    	margin-top: 10px;
    }
  }
  .date-box.active{
  	box-shadow: 0 0 10px rgba(208,208,208,0.5)
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
