<template>
  <div id="operation-create">
  	<el-form :model="form" status-icon :rules="rules" ref="form" label-width="100px" class="demo-form">
  		<el-form-item label="运营位类型" prop="pass">
		    <el-select v-model="form.keyword" placeholder="请选择" style="width: 100%">
			    <el-option :label="item.name" :value="item.type" v-for="item in bannerParameter.bannerType" :key="item.type"></el-option>
			  </el-select>
		  </el-form-item>
      <el-form-item label="城市" prop="pass">
        <el-select v-model="form.keyword" placeholder="请选择" style="width: 100%">
          <el-option :label="item.name" :value="item.type" v-for="item in bannerParameter.bannerType" :key="item.type"></el-option>
        </el-select>
      </el-form-item>
		  <el-form-item label="广告名称" prop="pass">
		    <el-input type="text" v-model="form.name" placeholder="请填写，限制20个字以内"></el-input>
		  </el-form-item>
		  <el-form-item label="上架时间" prop="pass">
		    <el-date-picker
          type="date"
          placeholder="选择日期"
          value-format="yyyy-MM-dd"
          v-model="form.start_time"
          style="width: 100%;"
        ></el-date-picker>
		  </el-form-item>
		  <el-form-item label="截止时间" prop="pass">
		    <el-date-picker
          type="date"
          placeholder="选择日期"
          value-format="yyyy-MM-dd"
          v-model="form.end_time"
          style="width: 100%;"
        ></el-date-picker>
		  </el-form-item>
		  <el-form-item label="权重排序" prop="pass">
		    <el-input type="text" v-model="form.sort" placeholder="数字越小，排序越前"></el-input>
		  </el-form-item>
		  <el-form-item>
		    <el-button type="primary" @click="submitForm('form')">确认</el-button>
		    <el-button @click="resetForm('form')">重置</el-button>
		  </el-form-item>
		</el-form>
  </div>
</template>
<script>
  import {
    getBannerDeviceApi,
    getBannerParameterApi,
    getBannerListsApi
  } from 'API/operation'

  export default {
    data() {
      return {
        form: {
          name: '',
          sort: '',
          start_time: '',
          end_time: ''
        },
        rules: {},
        bannerType: [],
        bannerParameter: {}
      };
    },
    methods: {
      getBannerParameter() {
        getBannerParameterApi({device: this.$route.query.key}).then(({data}) => {
          this.bannerParameter = data.data
          console.log(data)
          this.bannerType = data.data.bannerType
        })
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            console.log(this.form)
          } else {
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    },
    created() {
      this.getBannerParameter()
    }
  }
</script>
<style lang="less">
#operation-create {
	margin: 50px 0;
}
</style>
