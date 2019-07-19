<template>
	<el-row class="wrap">
		<!--面包屑-->
		<el-col :span="24" class="wrap-breadcrum">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item :to="{path:'/'}"><b>首页</b></el-breadcrumb-item>
				<el-breadcrumb-item>币导航</el-breadcrumb-item>
				<el-breadcrumb-item>其他导航</el-breadcrumb-item>
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
			
			<!--类目查询-->
			<el-col :span="12" :offset="6">
				<el-form :model="typeConsult" :inline="true">
					<el-form-item>
						<el-col :span="11">
							<el-form-item prop="oneType">
								<el-select size="small" v-model="typeConsult.oneType" placeholder="请选择一级类目" @change="getOneType($event,'all')">
		  						<el-option v-for="item in oneTypeBox" :value="item"></el-option>
		  					</el-select>
							</el-form-item>
						</el-col>
						<el-col :span="2" class="line">-</el-col>
						<el-col :span="11">
							<el-form-item prop="twoType">
								<el-select size="small" v-model="typeConsult.twoType" placeholder="请选择二级类目">
		  						<el-option v-for="item in typeLists" :value="item"></el-option>
		  					</el-select>
							</el-form-item>
						</el-col>
					</el-form-item>
					<el-form-item>
						<el-button type="success" @click="getList">查询</el-button>
					</el-form-item>
				</el-form>
			</el-col>
			
			<!--列表-->
			<!--参数：ID，颜色，网站名称，网址，一级类目，二级类目-->
			 <el-table :data="otherBiteList" highlight-current-row @selection-change="selsChange" style="width:100%" v-loading="listLoading">
		        <el-table-column type="selection" width="55"></el-table-column>
		        <el-table-column prop="id" width="80" label="ID" sortable></el-table-column>
		        <el-table-column prop="colour" label="颜色" :formatter="colorFormat"></el-table-column>
		        <el-table-column prop="websiteName" label="导航名称"></el-table-column>
		        <el-table-column prop="url" label="网址"></el-table-column>
		        <el-table-column prop="oneType" label="一级类目"></el-table-column>
		        <el-table-column prop="twoType" label="二级类目"></el-table-column>
		        <el-table-column prop="status" label="状态" sortable>
		          <template scope="scope">
		            <el-tag size="small" :type="statusTag.type">{{statusTag.name}}</el-tag>
		          </template>
		        </el-table-column>
		        <el-table-column label="操作">
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
		      <!--参数：颜色，网站名称，网址，一级类目，二级类目-->
		      <el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false">
		      	<el-form :model="editForm" ref="editForm" :rules="formRules" label-width="100px">
		      		<el-form-item prop="websiteName" label="网站名称">
		      			<el-input v-model="editForm.websiteName" auto-complete="off"></el-input>
		      		</el-form-item>
		      		<el-form-item prop="url" label="网址">
		      			<el-input v-model="editForm.url" auto-complete="off"></el-input>
		      		</el-form-item>
		      		<el-form-item prop="colour" label="颜色">
		      			<!--<el-color-picker v-model="editForm.colour"></el-color-picker>-->
		      			<el-radio-group v-model="editForm.colour">
		      				<el-radio label="黑色" border></el-radio>
		      				<el-radio label="蓝色" border></el-radio>
		      				<el-radio label="红色" border></el-radio>
		      				<el-radio label="绿色" border></el-radio>
		      				<el-radio label="橙色" border></el-radio>
		      			</el-radio-group>
		      		</el-form-item>
		      		<el-form-item label="类目" class="middleFormItem">
						<el-col :span="11">
							<el-form-item prop="oneType">
								<el-select size="small" v-model="editForm.oneType" placeholder="请选择一级类目" @change="getOneType($event,'edit')">
		  						<el-option v-for="item in oneTypeBox" :value="item"></el-option>
		  					</el-select>
							</el-form-item>
						</el-col>
						<el-col :span="2" class="line">-</el-col>
						<el-col :span="11">
							<el-form-item prop="twoType">
								<el-select size="small" v-model="editForm.twoType" placeholder="请选择二级类目">
		  						<el-option v-for="item in typeLists" :value="item"></el-option>
		  					</el-select>
							</el-form-item>
						</el-col>
					</el-form-item>
		      	</el-form>
		      	<div slot="footer" class="dialog-footer">
		      		<el-button @click.native="editFormVisible = false">取消</el-button>
		      		<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
		      	</div>
		      </el-dialog>
		      
		      <!--新增界面-->
		      <!--参数：颜色，网站名称，网址，一级类目，二级类目-->
		      <el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false">
		      	<el-form :model="addForm" ref="addForm" :rules="formRules" label-width="100px">
		      		<el-form-item prop="websiteName" label="网站名称">
		      			<el-input v-model="addForm.websiteName" auto-complete="off"></el-input>
		      		</el-form-item>
		      		<el-form-item prop="url" label="网址">
		      			<el-input v-model="addForm.url" auto-complete="off"></el-input>
		      		</el-form-item>
		      		<el-form-item prop="colour" label="颜色">
		      			<!--<el-color-picker v-model="addForm.colour"></el-color-picker>-->
		      			<el-radio-group v-model="addForm.colour">
		      				<el-radio label="黑色" border></el-radio>
		      				<el-radio label="蓝色" border></el-radio>
		      				<el-radio label="红色" border></el-radio>
		      				<el-radio label="绿色" border></el-radio>
		      				<el-radio label="橙色" border></el-radio>
		      			</el-radio-group>
		      		</el-form-item>
		      		<el-form-item label="类目" class="middleFormItem">
						<el-col :span="11">
							<el-form-item prop="oneType">
								<el-select size="small" v-model="addForm.oneType" placeholder="请选择一级类目" @change="getOneType($event,'add')">
		  						<el-option v-for="item in oneTypeBox" :value="item"></el-option>
		  					</el-select>
							</el-form-item>
						</el-col>
						<el-col :span="2" class="line">-</el-col>
						<el-col :span="11">
							<el-form-item prop="twoType">
								<el-select size="small" v-model="addForm.twoType" placeholder="请选择二级类目">
		  						<el-option v-for="item in typeLists" :value="item"></el-option>
		  					</el-select>
							</el-form-item>
						</el-col>
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
	import {reqGetOtherBiteList,reqAddOtherBite,reqDeleteOtherBite,reqEditOtherBite,reqGetListByTitle} from'api/api'
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
				oneTypeBox: ["全部","资讯网站","挖矿相关","ICO","金融衍生","应用发展"],
				twoTypeBox: [
					{
						one: "资讯网站",
						two: "中文资讯"
					},
					{
						one: "资讯网站",
						two: "全球资讯"
					},
					{
						one: "资讯网站",
						two: "自媒体"
					},
					{
						one: "资讯网站",
						two: "博客论坛"
					},
					{
						one: "挖矿相关",
						two: "矿池大全"
					},
					{
						one: "挖矿相关",
						two: "矿机信息"
					},
					{
						one: "挖矿相关",
						two: "挖矿信息"
					},
					{
						one: "ICO",
						two: "国内ICO平台"
					},
					{
						one: "ICO",
						two: "国外ICO平台"
					},
					{
						one: "ICO",
						two: "ICO资讯"
					},
					{
						one: "金融衍生",
						two: "理财借贷"
					},
					{
						one: "金融衍生",
						two: "基金创投"
					},
					{
						one: "金融衍生",
						two: "证券相关"
					},
					{
						one: "应用发展",
						two: "购物使用"
					},
					{
						one: "应用发展",
						two: "娱乐项目"
					}
				],
				typeLists: [],
				//通过二级类目获取列表
				typeConsult: {
					oneType: '全部',
		        	twoType: ''
				},
				//公共
				otherBiteList: [],
				filters : {
		        	title:''
		      	},
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
		        	websiteName: '',
		        	url: '',
		        	colour: '黑色',
		        	oneType: '资讯网站',
		        	twoType: '中文资讯'
		        },
		        formRules: {
		        	websiteName: [
		        		{required: true, message: "请输入标题", trigger: "blur"}
		        	],
		        	url: [
		        		{required: true, message: "请输入内容", trigger: "blur"}
		        	]
		        }
			}
		},
		
		methods: {
			//二级联动获取类目
			getOneType (val,type) {
				let tempList = [];
				if(type == 'add'){
					this.addForm.twoType = '';
				}else if(type == 'all'){
					this.typeConsult.twoType = '';
				}else if(type == 'edit'){
					this.editForm.twoType = '';
				}
//				for(var item of this.twoTypeBox){
//					if(val == item.one){
//						tempList.push(item.two)
//					}
//				}
				this.twoTypeBox.forEach((item, index)=>{
					if(val == item.one){
						tempList.push(item.two)
					}
				})
				this.typeLists = tempList
			},
			
			//格式化颜色
			colorFormat(row, cloumn) {
//				return row[cloumn.property]
				switch (row[cloumn.property]) {
					case "#000000": 
						return "黑色"
						break;
					case "#227fc6": 
						return "蓝色"
						break;
					case "#ff0000": 
						return "红色"
						break;
					case "#11b006": 
						return "绿色"
						break;
					case "#ff8e33": 
						return "橙色"
						break;
				}
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
					params.append("page",this.page);
					params.append("oneType",this.typeConsult.oneType)
					params.append("twoType",this.typeConsult.twoType)
					reqGetOtherBiteList(params).then(res=>{
						this.listLoading = false;
						this.total = res.data.pages*10;
						this.otherBiteList = res.data.list;
						console.log(this.otherBiteList);
					})
				}else{
					this.getTitleList();
				}
				
			},
			//根据title查询列表
			getTitleList () {
				let params = new URLSearchParams();
			    params.append("title",this.filters.title);
			    params.append("moduleName","其他导航")
			    params.append('page',this.page);
			    this.listLoading = true;
			    reqGetListByTitle(params).then(res=>{
			    	let {list, navigatepageNums} = res.data;
			        if(list != []){
			        	this.otherBiteList = list;
			            this.total = navigatepageNums.length * 10;
			            this.listLoading = false;
			        }else{
			        	this.otherBiteList = [];
			        	this.listLoading = true;
			        }
									console.log(res)
			    })
			},
			
			//显示新增界面
		    showAddDialog () {
		      this.addFormVisible = true;
		      this.getOneType("资讯网站","add")
//		      console.log(this.typeLists)
		    },
		    
		     //提交新增
		    addSubmit () {
		    	
		    	this.$refs.addForm.validate(valid=>{
		    		if(valid){
		    			this.$confirm("确认增加一条币信息吗","提示").then(()=>{
		    				this.addLoading = true;
		    				switch (this.addForm.colour){
		    					case "黑色":
		    						this.addForm.colour = "#000000"
		    						break;
		    					case "蓝色":
		    						this.addForm.colour = "#227fc6"
		    						break;
		    					case "红色":
		    						this.addForm.colour = "#ff0000"
		    						break;
		    					case "绿色":
		    						this.addForm.colour = "#11b006"
		    						break;
		    					case "橙色":
		    						this.addForm.colour = "#ff8e33"
		    						break;
		    				}
		    				console.log(this.addForm)
		    				let params = new URLSearchParams();
		    				params.append("oneType",this.addForm.oneType)
		    				params.append("twoType",this.addForm.twoType)
		    				params.append("url",this.addForm.url)
		    				params.append("colour",this.addForm.colour)
		    				params.append("websiteName",this.addForm.websiteName)
			    			reqAddOtherBite(params).then(res=>{
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
		
		        reqDeleteOtherBite(params).then(res=>{
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
		    showEditDialog (index,row) {		//注意：改变row的值会改变列表
		      this.editFormVisible = true;
		      console.log(row)
		     
		      this.editForm = Object.assign({},row)   //将需要编辑的那一项数据赋给编辑表单
		      this.getOneType(this.editForm.oneType)
		       switch (this.editForm.colour){
		      	case "#000000": 
		      		this.editForm.colour = "黑色"
		      		break;
		      	case "#227fc6": 
		      		this.editForm.colour = "蓝色"
		      		break;
		      	case "#ff0000": 
		      		this.editForm.colour = "红色"
		      		break;
		      	case "#11b006": 
		      		this.editForm.colour = "绿色"
		      		break;
		      	case "#ff8e33": 
		      		this.editForm.colour = "橙色"
		      		break;
		      }
		      console.log(this.editForm);
		    },
		    //提交编辑
		    editSubmit () {
//		    	this.editLoading = true;
				this.$refs.editForm.validate(valid=>{
					if(valid){
						this.$confirm("确认修改此条币信息吗？","提示").then(()=>{
							this.editLoading = true;
							switch (this.editForm.colour){
		    					case "黑色":
		    						this.editForm.colour = "#000000"
		    						break;
		    					case "蓝色":
		    						this.editForm.colour = "#227fc6"
		    						break;
		    					case "红色":
		    						this.editForm.colour = "#ff0000"
		    						break;
		    					case "绿色":
		    						this.editForm.colour = "#11b006"
		    						break;
		    					case "橙色":
		    						this.editForm.colour = "#ff8e33"
		    						break;
		    				}
							let params = new URLSearchParams();
							params.append("id",this.editForm.id)
							params.append("oneType",this.editForm.oneType)
		    				params.append("twoType",this.editForm.twoType)
		    				params.append("url",this.editForm.url)
		    				params.append("colour",this.editForm.colour)
		    				params.append("websiteName",this.editForm.websiteName)
			    			reqEditOtherBite(params).then(res=>{
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
			this.getOneType(this.typeConsult.oneType,"all")
			this.getList();
		}
	}
</script>

<style lang="scss" scoped="">
	
</style>