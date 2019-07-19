<template>
	<el-row class="wrap">
		<!--面包屑-->
		<el-col :span="24" class="wrap-breadcrum">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item :to="{path: '/'}"><b>首页</b></el-breadcrumb-item>
				<el-breadcrumb-item>设置</el-breadcrumb-item>
				<el-breadcrumb-item>修改密码</el-breadcrumb-item>				
			</el-breadcrumb>
		</el-col>
		
		<!--修改密码-->
		<el-col :span="24" class="wrap-main">
			<el-form :model="form" ref="form" :rules="rules" label-width="80px">
				<el-form-item prop="oldPwd" label="原密码">
					<el-input v-model="form.oldPwd" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item prop="newPwd" label="新密码">
					<el-input v-model="form.newPwd" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item prop="checkPwd" label="确认密码">
					<el-input v-model="form.checkPwd" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="default" @click="onSubmit">提交</el-button>
				</el-form-item>
			</el-form>
		</el-col>
	</el-row>
</template>

<script>
	import {reqEditManager} from 'api/api'
	export default {
		data () {
			//验证原密码
			var validatePass = (rule,value,callback) => {
				var user = sessionStorage.getItem("admin-user")
				if(user){
					user = JSON.parse(user)
					var passwd = user.passwd;
				}
				if(value === ''){
					callback(new Error("请输入旧密码"))
				}else if(value != passwd){
					callback(new Error("原密码输入错误"))
				}else{
					callback();
				}
			}
			//验证输入密码
			var validatePass2 = (rule,value,callback) => {
				if(value === ''){
					callback(new Error('请输入密码'))
				}else{
					if (this.form.checkPwd !== '') {		//当再次输入密码框不为空时，判断是否一致
			           this.$refs.form.validateField('checkPwd');
			        }
					callback();
				}
			}
			//验证再次输入密码
			var validatePass3 = (rule,value,callback) => {
				if(value === ''){
					callback(new Error("请再次输入密码"));
				}else if(value != this.form.newPwd){
					callback(new Error("两次输入密码不一致"))
				}else{
					callback();
				}
			}
			return {
				form: {
					oldPwd: '',
					newPwd: '',
					checkPwd: ''
				},
				rules: {
					oldPwd: [
						{validator: validatePass, trigger: "blur"}
					],
					newPwd: [
						{validator: validatePass2, trigger: "blur"}
					],
					checkPwd: [
						{validator: validatePass3, trigger: "blur"}
					]
				},
				
			}
		},
		methods: {
			onSubmit () {
				let user = sessionStorage.getItem("admin-user")
				if(user){
					user = JSON.parse(user)
					var {id, userName} = user;
				}
				this.$refs.form.validate(valid=>{
					let params = new URLSearchParams();
					params.append("id",id)
					params.append("userName",userName)
					params.append("passwd",this.form.checkPwd)
//					console.log(params.get('id'))		获取参数
//					console.log(params.has("id"))		判断参数是否存在
					if(valid){
						reqEditManager(params).then(res=>{
							let {code, data, msg} = res.data;
							if(code != 2000){
								sessionStorage.setItem("admin-user",JSON.stringify(data[0]));
								this.$message({
									message: '修改成功',
									type: 'success'
								})
							}else{
								this.$message({
									message: msg,
									type: 'warning'
								})
							}
						})
					}
				})
				
			}
		},
	}
</script>

<style>
</style>