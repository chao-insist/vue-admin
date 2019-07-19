<template>
	<el-row class="wrap">
		<!--面包屑-->
		<el-col :span="24" class="wrap-breadcrum">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item :to="{path:'/'}"><b>首页</b></el-breadcrumb-item>
				<el-breadcrumb-item>币导航</el-breadcrumb-item>
				<el-breadcrumb-item>矿池</el-breadcrumb-item>
			</el-breadcrumb>
		</el-col>
		
		<el-col class="wrap-main">
			<!--查询新增-->
			<el-col :span="24" class="list-query">
				<el-form :model="filters" :inline ="true">
		          <el-form-item>
		            <el-input placeholder="请输入title" v-model="filters.title" @keyup.enter.native="getItem"></el-input>
		          </el-form-item>
		          <el-form-item>
		            <el-button type="primary" @click="getItem">查询</el-button>
		          </el-form-item>
		          <el-form-item>
		            <el-button type="primary" @click="showAddDialog">新增</el-button>
		          </el-form-item>
		        </el-form>
			</el-col>
			
			<!--列表-->
			<!--参数：ID，币交所，创建时间，创始人，信用等级，发表时间，状态-->
			 <el-table :data="biteWalletList" highlight-current-row @selection-change="selsChange" style="width:100%" v-loading="listLoading">
		        <el-table-column type="selection" width="55"></el-table-column>
		        <el-table-column prop="id" width="80" label="ID" sortable></el-table-column>
		        <el-table-column prop="chineseName" label="名称"></el-table-column>
		        <el-table-column prop="initiateCreated" label="创建时间" sortable></el-table-column>
		        <!--<el-table-column prop="initiatePerson" label="创始人" sortable></el-table-column>-->
		        <el-table-column prop="updated" label="发表时间" sortable :formatter="formatDate"></el-table-column>
	            <!--<el-table-column label="日期" width="180">
			      <template slot-scope="scope">
			        <i class="el-icon-time"></i>
			        <span style="margin-left: 10px">{{ scope.row.date }}</span>
			      </template>
				</el-table-column>-->
		        <el-table-column prop="status" label="状态" sortable>
		          <template scope="scope">
		            <el-tag size="small" :type="statusTag.type">{{statusTag.name}}</el-tag>
		          </template>
		        </el-table-column>
		        <el-table-column label="操作" width="280">
		          <template scope="scope">
		            <el-button size="small" @click="showEditDialog(scope.$index,scope.row)">编辑</el-button>
		            <el-button size="small" type="danger" @click="delBite(scope.$index,scope.row)">删除</el-button>
		          </template>
		        </el-table-column>
		      </el-table>
		      
		      <!-- 工具条 -->
		      <el-col :span="24" class="toolBar">
		        <el-button type="danger" @click="batchDeleteLists" :disabled="this.sels.length===0">批量删除</el-button>
		        <el-pagination layout="prev,pager,next" @current-change="handleCurrentChange" :total="total" style="float:right"></el-pagination>
		      </el-col>
		      
		      <!--编辑界面-->
		      <!--参数：标题，内容，图片，中文名称，创始时间，创始人，支持币种，星级，关键词，关键描述-->
		      <el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false">
		      	<el-form :model="editForm" ref="editForm" :rules="formRules" label-width="100px">
		      		<el-form-item prop="title" label="标题">
		      			<el-input v-model="editForm.title" auto-complete="off"></el-input>
		      		</el-form-item>
		      		<el-form-item prop="chineseName" label="矿池名称">
		      			<el-input v-model="editForm.chineseName" auto-complete="off"></el-input>
		      		</el-form-item>
		      		<el-form-item prop="content" label="介绍">
		      			<el-input v-model="editForm.content" auto-complete="off" type="textarea"></el-input>
		      		</el-form-item>
		      		<el-form-item prop="pic" label="图片">
		      			<el-upload class="avatar-uploader"
			               :action="picUpload"
			               :show-file-list="false"
			               :on-success="handleEditPic">
			               <img v-if="editForm.pic" :src="editForm.pic" class="avatar">
			               <i v-else class="el-icon-plus avatar-uploader-icon"></i>
		                </el-upload>
		      		</el-form-item>
		      		<el-form-item prop="initiateCreated" label="创始时间">
		      			<el-date-picker v-model="editForm.initiateCreated" type="year" format="yyyy年" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期" @change="getTimeEdit"></el-date-picker>
		      		</el-form-item>
		      		<el-form-item prop="initiatePerson" label="创始人">
		      			<el-input v-model="editForm.initiatePerson" auto-complete="off"></el-input>
		      		</el-form-item>
		      		<el-form-item prop="src" label="链接">
		      			<el-input v-model="editForm.src" auto-complete="off"></el-input>
		      		</el-form-item>
		      		<el-form-item label="支持币种" prop="supportCurrency">
		              <!--<el-checkbox-group v-model="editForm.supportCurrency" :min="1" :max="2">
		                <el-checkbox-button v-for="item in this.supportCurrencyBox" :label="item" :key="item">{{item}}</el-checkbox-button>
		              </el-checkbox-group>-->
		              <el-input v-model="editForm.supportCurrency"></el-input>
		            </el-form-item>
		      		<el-form-item prop="level" label="星级">
		      			<el-input-number v-model="editForm.level" :min="1" :max="5"></el-input-number>
		      		</el-form-item>
		      		<el-form-item prop="keywords" label="关键词">
		      			<el-input v-model="editForm.keywords" auto-complete="off"></el-input>
		      		</el-form-item>
		      		<el-form-item prop="keywordsContent" label="关键词描述">
		      			<el-input v-model="editForm.keywordsContent" auto-complete="off"></el-input>
		      		</el-form-item>
		      	</el-form>
		      	<div slot="footer" class="dialog-footer">
		      		<el-button @click.native="editFormVisible = false">取消</el-button>
		      		<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
		      	</div>
		      </el-dialog>
		      
		      <!--新增界面-->
		      <!--参数：标题，内容，图片，中文名称，创始时间，创始人，支持币种，星级，关键词，关键描述-->
		      <el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false">
		      	<el-form :model="addForm" ref="addForm" :rules="formRules" label-width="100px">
		      		<el-form-item prop="title" label="标题">
		      			<el-input v-model="addForm.title" auto-complete="off"></el-input>
		      		</el-form-item>
		      		<el-form-item prop="chineseName" label="矿池名称">
		      			<el-input v-model="addForm.chineseName" auto-complete="off"></el-input>
		      		</el-form-item>
		      		<el-form-item prop="content" label="介绍">
		      			<el-input v-model="addForm.content" auto-complete="off" type="textarea"></el-input>
		      		</el-form-item>
		      		<el-form-item prop="pic" label="图片">
		      			<el-upload class="avatar-uploader"
			               :action="picUpload"
			               :show-file-list="false"
			               :on-success="handleAddPic">
			               <img v-if="addForm.pic" :src="addForm.pic" class="avatar">
			               <i v-else class="el-icon-plus avatar-uploader-icon"></i>
		                </el-upload>
		      		</el-form-item>
		      		<el-form-item prop="initiateCreated" label="创始时间">
		      			<el-date-picker v-model="addForm.initiateCreated" type="year" format="yyyy年" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期" @change="getTimeAdd"></el-date-picker>
		      		</el-form-item>
		      		<el-form-item prop="initiatePerson" label="创始人">
		      			<el-input v-model="addForm.initiatePerson" auto-complete="off"></el-input>
		      		</el-form-item>
		      		<el-form-item prop="src" label="链接">
		      			<el-input v-model="addForm.src" auto-complete="off"></el-input>
		      		</el-form-item>
		      		<!--supportCurrency-->
		      		<el-form-item label="支持币种" prop="supportCurrency">
		              <el-input v-model="addForm.supportCurrency" auto-complete="off"></el-input>
		            </el-form-item>
		      		<el-form-item prop="level" label="星级">
		      			<el-input-number v-model="addForm.level" :min="1" :max="5"></el-input-number>
		      		</el-form-item>
		      		<el-form-item prop="keywords" label="关键词">
		      			<el-input v-model="addForm.keywords" auto-complete="off"></el-input>
		      		</el-form-item>
		      		<el-form-item prop="keywordsContent" label="关键词描述">
		      			<el-input v-model="addForm.keywordsContent" auto-complete="off"></el-input>
		      		</el-form-item>
		      	</el-form>
		      	<div slot="footer" class="dialog-footer">
		      		<el-button @click.native="addFormVisible = false">取消</el-button>
		      		<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
		      	</div>
		      </el-dialog>
		</el-col>
		
	</el-row>
</template>

<script>
	import {formatDate} from 'common/js/date.js'
	import {reqGetBiteList,reqAddMiningPool,reqDeleteBite,reqEditBite,reqGetListByTitle,picUpload} from 'api/api'
	export default {
		computed : {
			//设置状态标签
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
				isQuery: false,
				supportCurrencyBox: ["比特币","莱特币","以太坊"],
				listType: 3,
				//公共
				biteWalletList: [],
				filters : {
		        	title:''
		      	},
		      	picUpload: picUpload,
		      	sels: [],
		      	total:0,
		      	page: 1,
		      	textareaRows: 5,
		      	listLoading: false,
		        editLoading: false,
		        addLoading: false,
		        editFormVisible: false,
		        addFormVisible: false,
		        editForm: {},
		        addForm: {
		        	title: '',
		        	content: '',
		        	pic: '',
		        	chineseName: '',
		        	initiateCreated: '',
		        	initiatePerson: '',
		        	supportCurrency: "",
		        	level: 0,
		        	keywords: '',
		        	keywordsContent: '',
		        },
		        formRules: {
		        	title: [
		        		{required: true, message: "请输入标题", trigger: "blur"}
		        	],
		        	content: [
		        		{required: true, message: "请输入内容", trigger: "blur"}
		        	],
		        	pic: [
			        	{required : true,message : "请上传图片",trigger : "change"}
			    	],
		        	chineseName: [
		        		{required: true, message: "请输入中文名称", trigger: "blur"}
		        	],
//		        	initiateCreated: [
//		        		{type: "date", required: true, message: "请输入创始时间", trigger: "change"}
//		        	],
//		        	initiatePerson: [
//		        		{required: true, message: "请输入创始人", trigger: "change"}
//		        	],
		        	level: [
		        		{type: "number", required: true, message: "请选择星级", trigger: "change"}
		        	],
		        	keywords: [
		        		{required: true, message: "请输入关键词", trigger: "blur"}
		        	],
		        	keywordsContent: [
		        		{required: true, message: "请输入关键词描述", trigger: "blur"}
		        	]
		        }
			}
		},
		methods: {
			//格式化时间戳
		    formatDate (row,column) {
				let date = new Date(row[column.property]);
				return formatDate(date,"yy-MM-dd hh:mm")
			},
			
			//日期字符串
			getTimeAdd (time) {
				this.addForm.initiateCreated = time;
			},
			getTimeEdit (time) {
				this.editForm.initiateCreated = time;
			},
			
			//上传图片双向绑定
		    handleAddPic(res, file) {
		        this.addForm.pic = file.response.data;
		        console.log(this.addForm.pic)
		    },
		    handleEditPic(res, file) {
		        this.editForm.pic = file.response.data;
		        console.log(this.eidtForm.pic)
		    },
		    
		    //选中列
		    selsChange (sels) {
		      this.sels = sels;
		      console.log(this.sels);
		    },
		    
		    //列表分页
		    handleCurrentChange (val) {
		      this.page = val;  //当前页赋值
		      this.getList();
		    },
		    
		    //获取列表
			getList () {
				if(!this.isQuery){
					this.listLoading = true;
					let params = new URLSearchParams();
					params.append("type",this.listType);
					params.append("page",this.page);
					reqGetBiteList(params).then(res=>{
						this.listLoading = false;
						this.total = res.data.pages*10;
						for(let i = 0;i < this.biteWalletList.length;i++){
				              this.biteWalletList[i].supportCurrency = this.biteWalletList[i].supportCurrency.split(",");
				          }
						this.biteWalletList = res.data.list;
						console.log(this.biteWalletList);
					})
				}else{
					this.getTitleList();
				}
				
			},
			
			//根据title查询列表
			getTitleList () {
				let params = new URLSearchParams();
			    params.append("title",this.filters.title);
			    params.append("moduleName","矿池")
			    params.append('page',this.page);
			    this.listLoading = true;
			    reqGetListByTitle(params).then(res=>{
			    	let {list, navigatepageNums} = res.data;
			        if(list != []){
			        	this.biteWalletList = list;
			            this.total = navigatepageNums.length * 10
			            this.listLoading = false;
			        }else{
			        	this.biteWalletList = [];
			        	this.listLoading = true;
			        }
									console.log(res)
			    })
			},
			
			//显示新增界面
		    showAddDialog () {
		      this.addFormVisible = true;
		    },
		    
		    //提交新增
		    addSubmit () {
		    	
		    	this.$refs.addForm.validate(valid=>{
		    		if(valid){
		    			this.$confirm("确认增加一条矿池信息吗","提示").then(()=>{
		    				this.addLoading = true;
		    				if(this.addForm.initiateCreated == ''){
		    					this.addForm.initiateCreated = "1970-01-01 00:00:00"
		    				}
		    				console.log(this.addForm)
		    				let params = new URLSearchParams();
		    				params.append('title',this.addForm.title);
		    				params.append('chineseName',this.addForm.chineseName);
		    				params.append('content',this.addForm.content);
		    				params.append('pic',this.addForm.pic);
		    				params.append('src',this.addForm.src);
			    			params.append('initiateCreated',this.addForm.initiateCreated);
			    			params.append('initiatePerson',this.addForm.initiatePerson);
			    			params.append('supportCurrency',this.addForm.supportCurrency);
			    			params.append('level',this.addForm.level);
			    			params.append('keywords',this.addForm.keywords);
			    			params.append('keywordsContent',this.addForm.keywordsContent);
			    			reqAddMiningPool(params).then(res=>{
			    				if(res.code != 2000){
				    				this.$message({
				    					message:"添加成功",
				    					type:"success"
				    				})
				    				this.addLoading = false;
				    				this.$refs.addForm.resetFields();
				    				this.addFormVisible = false;
				    				this.getList();
			    				}else{
			    					this.$message({
				    					message:res.msg,
				    					type:"warning"
				    				})
			    					this.addLoading = false;
			    				}
			    			})
		    			})
		    		}
		    	})
		    },
		    
		    //单条删除
		    delBite (index,row) {
		      this.$confirm("确认删除该条记录吗？","提示",{type:"warning"}).then(()=>{
		          this.listLoading = true;
		        let params = new URLSearchParams();
		        params.append("id",row.id);
		
		        reqDeleteBite(params).then(res=>{
		            this.listLoading = false;
		            this.$message({
		              message : "删除成功",
		              type : "success"
		            })
		            this.getList();
		        }).catch((error)=>{})
		      })
		    },
		    //批量删除
		    batchDeleteLists (index,row) {
		      this.$confirm("确认删除选中记录吗","提示",{type:"warning"}).then(()=>{
		        let ids = this.sels.map(item => item.id).toString();
		        let params = new URLSearchParams();
		        params.append("id",ids)
		        //请求删除接口
		      })
		    },
		    
		    //显示编辑界面
		    showEditDialog (index,row) {
		      this.editFormVisible = true;
		      this.editForm = Object.assign({},row)   //将需要编辑的那一项数据赋给编辑表单
		      console.log(this.editForm);
		    },
		    
		    //提交编辑
		    editSubmit () {
//		    	this.editLoading = true;
				this.$refs.editForm.validate(valid=>{
					if(valid){
						this.$confirm("确认修改此条币信息吗？","提示").then(()=>{
							this.editLoading = true;
							if(this.editForm.initiateCreated == ''){
		    					this.editForm.initiateCreated = "1970-01-01 00:00:00"
		    				}
							let params = new URLSearchParams();
							params.append('title',this.editForm.title);
							params.append('chineseName',this.editForm.chineseName);
							params.append("id",this.editForm.id);
		    				params.append('content',this.editForm.content);
		    				params.append("src",this.editForm.src);
		    				params.append('pic',this.editForm.pic);
			    			params.append('englishName',this.editForm.englishName);
			    			params.append('initiateCreated',this.editForm.initiateCreated);
			    			params.append('initiatePerson',this.editForm.initiatePerson);
			    			params.append('supportCurrency',this.editForm.supportCurrency);
			    			params.append('level',this.editForm.level);
			    			params.append('keywords',this.editForm.keywords);
			    			params.append('keywordsContent',this.editForm.keywordsContent);
			    			reqEditBite(params).then(res=>{
			    				console.log(res.data)
			    				this.editLoading = false;
			    				let {code, msg} = res.data;
			    				if(code != 2000){
			    					this.$message({
			    						message: "修改成功",
			    						type: "success"
			    					})
			    					this.$refs.editForm.resetFields(); 
			    					this.editFormVisible = false;
			    					this.getList()
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
		    
		    //获取单条数据
		    getItem() {
		      if(this.filters.title){
		        this.isQuery = true;
		        this.getTitleList();
		      }else{
		      	this.isQuery = false;
		        this.getList();
		      }
		    },
		},
		mounted () {
			this.getList();
		}
	}
</script>

<style>
</style>