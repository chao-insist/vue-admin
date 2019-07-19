<template>
	<el-row class="wrap">
		<!--面包屑-->
		<el-col :span="24" class="wrap-breadcrum">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item :to="{path: '/'}">首页</el-breadcrumb-item>
				<el-breadcrumb-item>设置</el-breadcrumb-item>
        		<el-breadcrumb-item>个人信息</el-breadcrumb-item>
			</el-breadcrumb>
		</el-col>

		<!--修改资料-->
		<el-col :span="24" class="warp-main">
	      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
	        <el-form-item label="账号">
	          <el-input v-model="form.username" disabled></el-input>
	        </el-form-item>
	        <el-form-item prop="name" label="昵称">
	          <el-input v-model="form.name"></el-input>
	        </el-form-item>
	        <el-form-item label="性别" prop="sex">
				<el-radio class="radio" label="1" v-model="form.sex">男</el-radio>
				<el-radio class="radio" label="2" v-model="form.sex">女</el-radio>
			</el-form-item>
			<el-form-item label="编辑头像" prop="head">
				<img :src="imgDataUrl" class="uploadPreviewImg">
				<el-button size="small" round type="success" icon="upload" style="position: absolute;bottom: 15px;margin-left: 40px;" @click="show=true">修改头像</el-button>
			</el-form-item>
	        <my-upload field="file"
	          @crop-success="cropSuccess"
	          @crop-upload-success="cropUploadSuccess"
	          @crop-upload-fail="cropUploadFail"
	          v-model="show"
	          :width="300"
	          :height="300"
	          :url="url"
	          img-format="png"></my-upload>
	        <el-form-item>
	          <el-button type="primary" @click="onSubmit" style="margin-top: 50px;">修改并保存</el-button>
	        </el-form-item>
	      </el-form>
	    </el-col>
	</el-row>
</template>

<script>
	import myUpload from 'vue-image-crop-upload';
	import {reqEditManager, picUpload} from 'api/api'
	import {bus} from '@/bus'
	export default {
		components: { 'my-upload': myUpload },
		data () {
			return {
				url: picUpload,
				show: false,
		        imgDataUrl1: 'http://img.jinse.com/313440_image20.png',
		        imgDataUrl: '',
				form: {
		          username: '',
		          name: '',
		          sex: "0",
		          id: 0,
		          picUrl: ''
		        },
		        rules: {
		          name: [
		            {required: true, message: '请输入昵称', trigger: 'blur'}
		          ]
		        }
			}
		},
		methods: {
		
			  cropSuccess(imgDataUrl, field){
		          console.log('-------- crop success --------');
		          this.imgDataUrl = imgDataUrl;
		      },
		      cropUploadSuccess(jsonData, field){
		          console.log('-------- upload success --------');
		          console.log(jsonData);
		          this.form.picUrl = jsonData.data;
		      },
		      cropUploadFail(status, field){
		          console.log('-------- upload fail --------');
		          console.log(status);
		      },
			//sessionStorage和localStorage只能存字符串
			onSubmit () {
				this.$refs.form.validate(valid=>{
					if(valid){
						let params = new URLSearchParams();
						params.append("id",this.form.id)
						params.append("userName",this.form.username)
						params.append("name",this.form.name)
						params.append("sex",this.form.sex)
						params.append("head",this.form.picUrl)
						reqEditManager(params).then(res=>{
							console.log(res)
							let {code, data, msg} = res.data;
							if(code !== 2000){
								sessionStorage.setItem('admin-user',JSON.stringify(data[0]))
//								bus.$emit("setUserName",data[0].userName)
								this.$message({
									message: "修改成功",
									type: "success"
								})
							}else{
								this.$message({
									message: msg,
									type: "warning"
								})
							}
						})
					}
				})
			}
		},
		mounted() {
	      let user = sessionStorage.getItem("admin-user");
	      if(user){
	      	user = JSON.parse(user);
	      	this.form.username = user.userName
	      	this.form.name = user.name || ''
	      	this.form.sex = user.sex.toString() || '1'
	      	this.form.id = user.id
	      	this.imgDataUrl = user.head;
	      }
	    }
	}
</script>

<style>
	.uploadPreviewImg{
		float: left;
		width: 80px;
		height: 80px;
		background: rgba(255, 255, 255, 0.3);
		border-radius: 50%;
		transition: transform 0.3s ease-in-out 0.2s, opacity 0.3s ease-in-out 0.2s, background 0.2s linear 0s;
	}
</style>
