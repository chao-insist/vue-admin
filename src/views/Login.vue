<template lang="html">
    <el-form ref="AccountFrom" :model="account" :rules="rules" label-position="left" label-width="0px"
           class="demo-ruleForm login-container">
    <h3 class="title">系统登录</h3>
    <el-form-item prop="userName">
      <el-input type="text" v-model="account.userName" auto-complete="off" placeholder="账号"></el-input>
    </el-form-item>
    <el-form-item prop="passwd">
      <el-input type="password" v-model="account.passwd" auto-complete="off" placeholder="密码"></el-input>
    </el-form-item>
    <el-checkbox v-model="checked" class="remember">记住密码</el-checkbox>
    <el-form-item style="width:100%;">
      <el-button type="primary" style="width:100%;" @click.native.prevent="handleLogin" :loading="logining">登录</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
	import {reqLogin} from 'api/api'
	export default {
		data () {
			return {
				logining: false,
				account: {
					userName: '',
					passwd: ''
				},
				rules: {
					userName: [
						{required: true, message: "请输入密码", trigger: "blur"}
					],
					passwd: [
						{required: true, message: "请输入用户名", trigger: "blur"}
					]
				},
				checked: true
			}
		},
		mounted () {
			if(localStorage.getItem("userName")){
				let username = localStorage.getItem("userName")
				let pwd = localStorage.getItem("passwd")
				this.account.userName = username;
				this.account.passwd = pwd;
			}
		},
		methods : {
			handleLogin () {
				this.$refs.AccountFrom.validate(valid=>{
					if(valid){
						if(this.checked){
							 localStorage.setItem("userName",this.account.userName)
							 localStorage.setItem("passwd",this.account.passwd)
						}else{
							localStorage.removeItem("userName")
							localStorage.removeItem("passwd")
						}
						this.logining = true;
						let params = new URLSearchParams();
						params.append("userName",this.account.userName)
						params.append("passwd",this.account.passwd)
						reqLogin(params).then(res=>{
							console.log(res)
							if(res.data.code !== 0){
								console.log(res)
								this.$message({
									message: res.data.msg,
									type: "error"
								});
								this.logining = false;
							}else{
								console.log(res)
								this.logining = true;
								sessionStorage.setItem("admin-user",JSON.stringify(res.data.data[0]))
								this.$refs.AccountFrom.resetFields();
								this.$router.push({path: "/"})
							}
						})
					}else {
			            console.log('error submit!!');
			            return false;
			         }
				})
			}
		}
	}
</script>
<style type="text/css">
	body{
	    background: #DFE9FB;
	  }
</style>
<style lang="scss" scoped="">
.login-container {
    /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 160px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;

    background: -ms-linear-gradient(top, #fff, #6495ed);        /* IE 10 */
    background:-moz-linear-gradient(top,#b8c4cb,#f6f6f8);/*火狐*/
    background:-webkit-gradient(linear, 0% 0%, 0% 100%,from(#b8c4cb), to(#f6f6f8));/*谷歌*/
    background: -webkit-gradient(linear, 0% 0%, 0% 100%, from(#fff), to(#6495ed));      /* Safari 4-5, Chrome 1-9*/
    background: -webkit-linear-gradient(top, #fff, #6495ed,#fff);   /*Safari5.1 Chrome 10+*/
    background: -o-linear-gradient(top, #fff, #6495ed);  /*Opera 11.10+*/

    .title {
      margin: 0px auto 40px auto;
      text-align: center;
      color: #505458;
    }
    .remember {
      margin: 0px 0px 35px 0px;
    }
  }
</style>
