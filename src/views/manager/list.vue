<template>
	<el-row class="wrap">
		<!--面包屑-->
		<el-col :span="24" class="wrap-breadcrum">
			<el-breadcrumb seperator="/">
				<el-breadcrumb-item :to="{name: '币友圈'}">首页</el-breadcrumb-item>
				<el-breadcrumb-item>管理员</el-breadcrumb-item>
			</el-breadcrumb>
		</el-col>
		<el-col class="wrap-main">
			<!--列表查询新增-->
			<el-col :span="24" class="list-query">
				<el-form :model="filters" :inline="true">
					<el-form-item>
						<el-input placeholder="请输入title" v-model="filters.title"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="getItem">查询</el-button>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="showAddDialog">新增</el-button>
					</el-form-item>
				</el-form>
			</el-col>
			
			<!--列表展示-->
			<!--参数：ID，管理员，昵称，登录次数，最后登录时间，注册时间，状态-->
			<el-table :data="managerList" highlight-current-row v-loading="listLoading" @selection-change="selsChange">
				<el-table-column type="selection" width="55"></el-table-column>
				<el-table-column prop="userName" label="管理员"></el-table-column>
				<el-table-column prop="name" label="昵称"></el-table-column>
				<el-table-column prop="logins" label="登录次数"></el-table-column>
				<el-table-column prop="lastLogintime" label="最后登录时间" sortable :formatter="formatDate"></el-table-column>
				<el-table-column prop="created" label="注册时间" sortable :formatter="formatDate"></el-table-column>
				<el-table-column prop="state" label="状态" sortable>
					<template scope="scope">
						<el-tag size="small" :type="statusTag.type" v-text="statusTag.name"></el-tag>
					</template>
				</el-table-column>
				<el-table-column label="操作">
					<template scope="scope">
						<el-button size="small" @click="showEditDialog(scope.$index,scope.row)">编辑</el-button>
						<el-button size="small" type="danger" @click="delManager(scope.$index,scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			
			<!--工具条-->
			<el-col :span="24" class="toolbar">
				<el-button type="danger" @click="batchDeleteLists" :disabled="sels.length===0">批量删除</el-button>
				<el-pagination layout="prev,pager,next" :total="total" @current-change="handleCurrentChange" style="float: right;"></el-pagination>
			</el-col>
			
			<!--编辑界面-->
			<!--参数：登录名，密码，昵称，性别-->
			<el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false">
				<el-form :model="editForm" ref="editForm" label-width="100px" :rules="formRules">
					<el-form-item label="登录名" prop="userName">
						<el-input v-model="editForm.userName" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="密码" prop="passwd">
						<el-input v-model="editForm.passwd" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="昵称" prop="name">
						<el-input v-model="editForm.name" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="性别" prop="sex">
						<el-radio class="radio" label="1" v-model="editForm.sex">男</el-radio>
						<el-radio class="radio" label="2" v-model="editForm.sex">女</el-radio>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click.native="editFormVisible = false">取消</el-button>
					<el-button @click.native="editSubmit" :loading="editLoading" type="primary">提交</el-button>
				</div>
			</el-dialog>
			
			<!--新增界面-->
			<!--参数：登录名，密码，昵称，性别-->
			<el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false">
				<el-form :model="addForm" :rules="formRules" ref="addForm" label-width="100px">
					<el-form-item label="登录名" prop="userName">
						<el-input v-model="addForm.userName" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="密码" prop="passwd">
						<el-input v-model="addForm.passwd" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="昵称" prop="name">
						<el-input v-model="addForm.name" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="性别" prop="sex">
						<el-radio class="radio" label="1" v-model="addForm.sex">男</el-radio>
						<el-radio class="radio" label="2" v-model="addForm.sex">女</el-radio>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click.native="addFormVisible = false">取消</el-button>
					<el-button @click.native="addSubmit" :loading="addLoading" type="primary">提交</el-button>
				</div>
			</el-dialog>
		</el-col>
	</el-row>
</template>

<script>
	import {reqGetManagerList,reqAddManager,reqDeleteManager,reqEditManager,reqGetListByTitle} from 'api/api'
	import {formatDate} from 'common/js/date.js'
	export default {
		name: 'manager',
		computed : {
		    statusTag (val) {
		      if(val == -1){
		        return {
		          name : "删除",
		          type : "danger"
		        }
		      }else if(val == 0){
		        return {
		          name : "锁定",
		          type : "warning"
		        }
		      }
		      else{
		        return {
		          name : "正常",
		          type : "success"
		        }
		      }
		    }
		  },
		data () {
			return {
				//公共
			  managerList: [],
		      filters : {
		        id:''
		      },
		      sels: [],
		      page: 1,
		      total: 10,
		      editFormVisible: false,
		      addFormVisible: false,
		      listLoading: false,
		      editLoading: false,
		      addLoading: false,
		      editForm: {},
		      addForm:{
		      	userName: '',
		      	passwd: '',
		      	name: '',
		      	sex: '1'
		      },
		      formRules: {
		      	userName: [
		      		{required: true,message:"请输入您的登录名",trigger:"blur"}
		      	],
		      	passwd: [
		      		{required: true,message:"请输入您的密码",trigger:"blur"}
		      	],
		      	name: [
		      		{required: true,message:"请输入您的昵称",trigger:"blur"}
		      	]
		      },
			}
		},
		methods: {
			
			//格式化时间戳
		    formatDate (row,column) {
				let date = new Date(row[column.property]);
				return formatDate(date,"yy-MM-dd hh:mm")
			},
			
			//选中
			selsChange (sels) {
				this.sels = sels;
			},
		    //列表分页
		    handleCurrentChange (val) {
		    	this.page = val;	//当前页赋值
		    	this.getList();
		    },
			
			//获取列表
			getList () {
				let params = new URLSearchParams();
				params.append("page",this.page);
				this.listLoading = true;
				reqGetManagerList(params).then(res=>{
					this.listLoading = false;
//					console.log(res.data)
					this.managerList = res.data.list;
					console.log(this.managerList)
				    this.total = res.data.pages * 10;
				})
			},

		    //显示新增弹框
		    showAddDialog () {
		    	this.addFormVisible = true;
		    },
		    //提交新增
		    addSubmit () {
		    	this.$refs.addForm.validate(valid=>{
		    		if(valid){
		    			this.$confirm("确认提交吗？","提示").then(()=>{
		    				let params = new URLSearchParams();
		    				params.append("userName",this.addForm.userName)
		    				params.append("passwd",this.addForm.passwd)
		    				params.append("name",this.addForm.name)
		    				params.append("sex",this.addForm.sex)
		    				reqAddManager(params).then(res=>{
		    					this.addLoading = false;
		    					let {code, msg} = res.data;
		    					if(code !== 2000){
			    					this.$message({
			    						message: "提交成功",
			    						type: "success"
			    					});
			    					this.addFormVisible = false;
			    					this.$refs.addForm.resetFields();
			    					this.getList();
		    					}else{
		    						this.$message({
		    							message: msg,
		    							type: "warning"
		    						})
		    						this.editLoading = false;
		    					}		
		    				})
		    			})
		    		}
		    	})
		    },
		    
			//删除一项
			delManager (index,row) {
				this.$confirm("确认删除该条记录吗？","提示",{type:"warning"}).then(()=>{
					this.listLoading = true;
					let params = new URLSearchParams();
        			params.append("id",row.id);
					
					reqDeleteManager(params).then(res=>{
						this.listLoading = false;
						this.$message({
							message: "删除成功",
							type: "success"
						})
						this.getList();
					}).catch(error=>{})
				})
			},
			//批量删除
		    batchDeleteLists (index,row) {
		      this.$confirm("确认删除选中记录吗","提示",{type:"warning"}).then(()=>{
		        let ids = this.sels.map(item => item.id).toString();
		        let params = new URLSearchParams();
		        params.append("id",ids)
		        //请求批量删除接口
		      })
		    },
		    
			//显示编辑弹框
		    showEditDialog (index,row) {
		    	this.editFormVisible = true;
		    	this.editForm = Object.assign({},row);
		    	this.editForm.sex = this.editForm.sex.toString()
		    	console.log(this.editForm)
		    },
		    //提交编辑
		    editSubmit () {
		    	this.$refs.editForm.validate(valid=>{
		    		if(valid){
//		    			this.editForm.sex = Number(this.editForm.sex);
		    			this.editLoading = true;
		    			this.$confirm("确认提交吗？","提示").then(()=>{
		    				let params = new URLSearchParams();
		    				params.append("id",this.editForm.id)
		    				params.append("userName",this.editForm.userName)
		    				params.append("passwd",this.editForm.passwd)
		    				params.append("name",this.editForm.name)
		    				params.append("sex",this.editForm.sex)
		    				reqEditManager(params).then(res=>{
		    					if(res.data.code !== 2000){
		    						this.editLoading = false;
			    					this.$message({
			    						message: "提交成功",
			    						type: "success"
			    					});
			    					console.log(res)
			    					this.editFormVisible = false;
			    					this.$refs.editForm.resetFields();
			    					this.getList();
		    					}else{
		    						console.log(res)
		    						this.$message({
		    							message: res.data.msg,
		    							type: "warning"
		    						})
		    						this.editLoading = false;
		    					}
		    				})
		    			})
		    		}
		    	})
		    },
			
			//单条查询
		    getItem() {
		      if(this.filters.title){
		      	this.listLoading = true;
		        let params = new URLSearchParams();
		        params.append("title",this.filters.title);
		        reqGetListByTitle(params).then(res=>{
		        	this.listLoading = false;
		            console.log(res.data.data);
		            this.managerList = res.data.data;
		            this.total = res.data.data.length
		        })
		      }else{
		        this.getList();
		      }
		    },
		},
		mounted () {
			this.getList()
		}
	}
</script>

<style>
</style>