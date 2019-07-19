<template lang="html">
  <el-row class="wrap">
  	
    <!-- 面包屑 -->
    <el-col :span="24" class="wrap-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{path:'/'}">首页</el-breadcrumb-item>
        <el-breadcrumb-item>矿机交易</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>
    <el-col :span="24" class="wrap-main">
    	
      <!-- 列表查询新增 -->
      <el-col :span="24" class="list-statistics">
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
      
      <!-- 列表 -->
      <!--参数：ID，标题，昵称，使用时间，真实阅读数，类型，修改时间，state，状态-->
      <el-table :data="news" highlight-current-row @selection-change="selsChange" style="width:100%" v-loading="listLoading">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="id" width="80" label="ID" sortable></el-table-column>
        <el-table-column prop="title" label="标题"></el-table-column>
        <el-table-column prop="nick" label="昵称" sortable></el-table-column>
        <el-table-column prop="useTime" label="使用时间" sortable></el-table-column>
        <el-table-column prop="views" label="真实阅读数" sortable></el-table-column>
        <el-table-column prop="type" label="类型" sortable :formatter="formatType"></el-table-column>
        <el-table-column prop="updated" label="修改时间" sortable :formatter="formatDate"></el-table-column>
        <el-table-column prop="state" label="state" sortable :formatter="formatState"></el-table-column>
        <el-table-column prop="status" label="状态" sortable>
          <template scope="scope">
            <el-tag size="small" :type="statusTag.type">{{statusTag.name}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template scope="scope">
            <el-button size="small" @click="showEditDialog(scope.$index,scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="delnew(scope.$index,scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 工具条 -->
      <el-col :span="24" class="toolBar">
        <el-button tyepe="danger" @click="batchDeleteLists" :disabled="this.sels.length===0">批量删除</el-button>
        <el-pagination layout="prev,pager,next" @current-change="handleCurrentChange" :total="total" style="float:right"></el-pagination>
      </el-col>
      
      <!-- 编辑界面 -->
      <!--参数：标题，内容，图片，类型，价格，使用时间，电话，微信，QQ，城市-->
      <el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false">
        <el-form :model="editForm" label-width="100px" ref="editForm" :rules="formRules">
          <el-form-item label="标题" prop="title">
            <el-input v-model="editForm.title" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item prop="content" label="内容">
	      		<!--<quill-editor @editContent="getEditContent" :value="editForm.content"></quill-editor>-->
	      		<UE :value="editForm.content" :config="config" ref="editUe" :id="editUeId"></UE>
	      </el-form-item>
	      <el-form-item label="图片" prop="pic">
	          <el-upload class="avatar-uploader"
	           :action="picUpload"
	           :show-file-list="false"
	           :on-success="handleEditPic1">
	            <img v-if="editForm.pic1" :src="editForm.pic1" class="avatar">
	            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
	          </el-upload>
	          <el-upload class="avatar-uploader"
	           :action="picUpload"
	           :show-file-list="false"
	           :on-success="handleEditPic2">
	            <img v-if="editForm.pic2" :src="editForm.pic2" class="avatar">
	            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
	          </el-upload>
	          <el-upload class="avatar-uploader"
	           :action="picUpload"
	           :show-file-list="false"
	           :on-success="handleEditPic3">
	            <img v-if="editForm.pic3" :src="editForm.pic3" class="avatar">
	            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
	          </el-upload>
	          <el-upload class="avatar-uploader"
	           :action="picUpload"
	           :show-file-list="false"
	           :on-success="handleEditPic4">
	            <img v-if="editForm.pic4" :src="editForm.pic4" class="avatar">
	            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
	          </el-upload>
     	 </el-form-item>
     	 <el-form-item label="类型" prop="type">
     	 	<el-radio v-model="editForm.type" label="0">求购</el-radio>
     	 	<el-radio v-model="editForm.type" label="1">出售</el-radio>
     	 </el-form-item>
     	 <el-form-item label="状态" prop="state">
     	 	<el-radio v-model="editForm.state" label="0">未完成</el-radio>
     	 	<el-radio v-model="editForm.state" label="1">完成</el-radio>
     	 </el-form-item>
     	 <el-form-item label="价格" prop="price">
     	 	<!--<el-input-number v-model="editForm.price" :min="1"></el-input-number>-->
     	 	<el-input v-model="editForm.price" auto-complete="off"></el-input>
     	 </el-form-item>
     	 <el-form-item label="使用时间" prop="useTime">
     	 	<el-input-number v-model="editForm.useTime" :min="1"></el-input-number>
     	 </el-form-item>
     	 <el-form-item label="电话" prop="tel">
     	 	<el-input v-model="editForm.tel" auto-complete="off"></el-input>
     	 </el-form-item>
     	 <el-form-item label="微信" prop="weixin">
     	 	<el-input v-model="editForm.weixin" auto-complete="off"></el-input>
     	 </el-form-item>
     	 <el-form-item label="qq" prop="qq">
     	 	<el-input v-model="editForm.qq" auto-complete="off"></el-input>
     	 </el-form-item>
          <el-form-item label="城市" class="middleFormItem">
            <el-col :span="11">
              <el-form-item prop="pro">
              	<el-select size="small" v-model="editForm.pro" placeholder="请选择省份" @change="getProv($event,'edit')">
                    <el-option v-for="item in provs" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
              </el-col>
              <el-col class="line" :span="2">-</el-col>
              <el-col :span="11">
                <el-form-item prop="city">
                	<el-select size="small" v-model="editForm.city" placeholder="请选择城市">
                    <el-option v-for="item in citys" :label="item.label" :value="item.value"></el-option>
               		</el-select>
                </el-form-item>
              </el-col>
          </el-form-item>
          <el-form-item label="外部阅读数" prop="viewsOut">
          	<el-input-number v-model="editForm.viewsOut" :min="1"></el-input-number>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="editFormVisible = false">取消</el-button>
          <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
        </div>
      </el-dialog>
      
      <!-- 新增界面 -->
      <!--参数：标题，内容，图片，类型，价格，使用时间，电话，微信，QQ，城市-->
      <el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false">
        <el-form :model="addForm" label-width="100px" ref="addForm" :rules="formRules">
          <el-form-item label="标题" prop="title">
            <el-input v-model="addForm.title" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item prop="content" label="内容">
	      		<!--<quill-editor @editContent="getAddContent" :value="addForm.content"></quill-editor>-->		
						<UE :value="addForm.content" :config="config" ref="addUe" :id="addUeId"></UE>
	      </el-form-item>
	      <el-form-item label="图片" prop="pic">
	          <el-upload class="avatar-uploader"
	           :action="picUpload"
	           :show-file-list="false"
	           :on-success="handleAddPic1">
	            <img v-if="addForm.pic1" :src="addForm.pic1" class="avatar">
	            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
	          </el-upload>
	          <el-upload class="avatar-uploader"
	           :action="picUpload"
	           :show-file-list="false"
	           :on-success="handleAddPic2">
	            <img v-if="addForm.pic2" :src="addForm.pic2" class="avatar">
	            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
	          </el-upload>
	          <el-upload class="avatar-uploader"
	           :action="picUpload"
	           :show-file-list="false"
	           :on-success="handleAddPic3">
	            <img v-if="addForm.pic3" :src="addForm.pic3" class="avatar">
	            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
	          </el-upload>
	          <el-upload class="avatar-uploader"
	           :action="picUpload"
	           :show-file-list="false"
	           :on-success="handleAddPic4">
	            <img v-if="addForm.pic4" :src="addForm.pic4" class="avatar">
	            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
	          </el-upload>
     	 </el-form-item>
     	 <el-form-item label="类型" prop="type">
     	 	<el-radio v-model="addForm.type" label="0">求购</el-radio>
     	 	<el-radio v-model="addForm.type" label="1">出售</el-radio>
     	 </el-form-item>
     	 <el-form-item label="状态" prop="state">
     	 	<el-radio v-model="addForm.state" label="0">未完成</el-radio>
     	 	<el-radio v-model="addForm.state" label="1">完成</el-radio>
     	 </el-form-item>
     	 <el-form-item label="价格" prop="price">
     	 	<!--<el-input-number v-model="addForm.price" :min="1"></el-input-number>-->
     	 	<el-input v-model="addForm.price" auto-complete="off"></el-input>
     	 </el-form-item>
     	 <el-form-item label="使用时间" prop="useTime">
     	 	<el-input-number v-model="addForm.useTime" :min="1"></el-input-number>
     	 </el-form-item>
     	 <el-form-item label="电话" prop="tel">
     	 	<el-input v-model="addForm.tel" auto-complete="off"></el-input>
     	 </el-form-item>
     	 <el-form-item label="微信" prop="weixin">
     	 	<el-input v-model="addForm.weixin" auto-complete="off"></el-input>
     	 </el-form-item>
     	 <el-form-item label="qq" prop="qq">
     	 	<el-input v-model="addForm.qq" auto-complete="off"></el-input>
     	 </el-form-item>
          <el-form-item label="城市" class="middleFormItem">
            <el-col :span="11">
              <el-form-item prop="pro">
              	<el-select size="small" v-model="addForm.pro" placeholder="请选择省份" @change="getProv($event,'edit')">
                    <el-option v-for="item in provs" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
              </el-col>
              <el-col class="line" :span="2">-</el-col>
              <el-col :span="11">
                <el-form-item prop="city">
                	<el-select size="small" v-model="addForm.city" placeholder="请选择城市">
                    <el-option v-for="item in citys" :label="item.label" :value="item.value"></el-option>
               		</el-select>
                </el-form-item>
              </el-col>
          </el-form-item>
          <el-form-item label="外部阅读数" prop="viewsOut">
		     		<el-input-number v-model="addForm.viewsOut" :min="1"></el-input-number>
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
import {provs,allCitys} from '@/util/address.js'
import {reqGetMiningTransactionList,reqAddMiningTransaction,reqDeleteMiningTransaction,reqEditMiningTransaction,reqGetListByTitle,picUpload} from 'api/api'
import {formatDate} from 'common/js/date.js'
import QuillEditor from '@/components/quill-editor/quill-editor'
import UE from '@/components/ueditor/ueditor'
export default {
  name : 'miningTransaction',
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
    },
  },

  data () {
    return {
    	value: '',
      config: {
	      initialFrameWidth: null,
	      initialFrameHeight: 350,
//	      autoFloatEnabled: false,
      },
      editUeId: "editUE",
      addUeId: "addUE",
    	isQuery: false,
      picUpload: picUpload,
      provs: provs,
      citys: [],
			uid: '',
      //公共
      news: [],
      textareaRows: 5,
      filters : {
        title:''
      },
      page : 1,
      total : 1,
      sels : [],
      listLoading: false,
      editLoading: false,
      addLoading: false,
      editFormVisible: false,
      addFormVisible: false,

      editForm:{},
      addForm:{
        title:'',
        content: '',
        pic1: '',
        pic2: '',
        pic3: '',
        pic4: '',
        price: '',
        useTime: '',
        type: "0",
        weixin: '',
        qq: "",
        tel: '',
        pro: '',
        city: '',
        state: "0",
        viewsOut: ""
      },
      formRules : {
        title : [
          	{required : true,message : "请输入标题",trigger : "blur"}
        ],
        content : [
          	{required : true,message : "请输入快讯内容",trigger : "blur"}
        ],
      }
    }
  },
  created() {
  	this.uid = JSON.parse(sessionStorage.getItem("admin-user")).id;
  },
  methods : {
  	//获取编辑内容
  	getUeEditContent(){
  		let content = this.$refs.editUe.getUEContent();
  		this.editForm.content = content;
  	},
  	//获取新增内容
  	getUeAddContent(){
  		let content = this.$refs.addUe.getUEContent();
  		this.addForm.content = content;
  	},
  	//格式化状态
		formatType(row,column){
			if(row[column.property] == '0'){
				return "求购"
			}else if(row[column.property] == '1'){
				return "出售"
			}
		},
  	//格式化state
  	formatState(row,column) {
  		if(row[column.property] == "0"){
  			return "未完成"
  		}else{
  			return "完成"
  		}
  	},
  	
  	//格式化时间
  	formatDate(row,column){
  		let date = new Date(row[column.property])
  		return formatDate(date,"yy-MM-dd hh:mm")
  	},
  	getAddContent(content){
			console.log(content)
			this.addForm.content = content;
		},
		getEditContent(content){
			console.log(content)
			this.editForm.content = content;
		},
  	//日期字符串
  	getTimeAdd (time) {
  		this.addForm.meetingDate = time;
  	},
  	getTimeEdit (time) {
  		this.editForm.meetingDate = time;
  		console.log(this.editForm.meetingDate)
  	},
    //图片上传
    handleEditPic1(res, file) {
      this.editForm.pic1 = file.response.data;
    	
    },
    handleEditPic2(res, file) {
      this.editForm.pic2 = file.response.data;
    //   console.log(res);
    },
    handleEditPic3(res, file) {
      this.editForm.pic3 = file.response.data;
    //   console.log(res);
    },
    handleEditPic4(res, file) {
      this.editForm.pic4 = file.response.data;
    //   console.log(res);
    },
    handleAddPic1(res, file) {
      this.addForm.pic1 = file.response.data;
      console.log(this.addForm.pic1)
  	},
  	handleAddPic2(res, file) {
      this.addForm.pic2 = file.response.data;
      console.log(this.addForm.pic2)
  	},
  	handleAddPic3(res, file) {
      this.addForm.pic3 = file.response.data;
      console.log(this.addForm.pic3)
  	},
  	handleAddPic4(res, file) {
      this.addForm.pic4 = file.response.data;
      console.log(this.addForm.pic4)
  	},
    // beforeAvatarUpload(file) {
    //     const isJPG = file.type === 'image/jpeg';
    //     const isLt2M = file.size / 1024 / 1024 < 2;
    //
    //     if (!isJPG) {
    //       this.$message.error('上传头像图片只能是 JPG 格式!');
    //     }
    //     if (!isLt2M) {
    //       this.$message.error('上传头像图片大小不能超过 2MB!');
    //     }
    //     return isJPG && isLt2M;
    // },
    /*二级联动选择地区*/
    getProv: function (prov,type) {
        let tempCity=[];
        this.citys=[];
        if(type == 'add'){
        	this.addForm.meetingCity = '';
        }else if(type == 'edit'){
        	this.editForm.meetingCity = '';
        }
        let allCity = allCitys;
        for (var val of allCity){
            if (prov == val.prov){
                tempCity.push({label: val.label, value: val.label})
            }
        }
        this.citys = tempCity;
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
      	let params = new URLSearchParams();
	      params.append('page',this.page);
	      this.listLoading = true;
	      reqGetMiningTransactionList(params).then(res=>{
	          this.news = res.data.list;    //==>返回的是单页的数据
	          this.total = res.data.navigatepageNums.length*10;   //取到后台返回的总页码
	          console.log(this.total);
	          this.listLoading = false;
	          console.log(this.news);
	          // this.$set(this.news,index,val) 全局给news数组增加元素
	      })
      }else{
      	this.getTitleList();
      }
    },
    
    //根据title查询列表
			getTitleList () {
				let params = new URLSearchParams();
			    params.append("title",this.filters.title);
			    params.append("moduleName","矿机交易")
			    params.append('page',this.page);
			    this.listLoading = true;
			    reqGetListByTitle(params).then(res=>{
			    	let {list, navigatepageNums} = res.data;
			        if(list != []){
			        	this.news = list;
			            this.total = navigatepageNums.length * 10
			            this.listLoading = false;
			        }else{
			        	
			        	this.news = [];
			        	this.listLoading = false;
			        }
									console.log(res)
			    })
			},
  
    //显示新增界面
    showAddDialog () {
      this.addFormVisible = true;
      this.addForm.content = "";
    },
    
    //列表新增
    addSubmit () {
    	this.getUeAddContent();
      this.$refs.addForm.validate((valid)=>{    //验证表单
        if(valid){
          this.$confirm("确认新增此条快讯吗？","提示",{type:"warning"}).then(()=>{
          	console.log(this.addForm)
            this.addLoading = true;
//          this.addForm.type = Number(this.addForm.type) 
            let params = new URLSearchParams();
            params.append("uid",this.uid)
            params.append("state",Number(this.addForm.state))
            params.append("title",this.addForm.title)
            params.append("content",this.addForm.content)
            params.append("pro",this.addForm.pro)
            params.append("city",this.addForm.city)
            params.append("price",this.addForm.price)
            params.append("pic",this.addForm.pic1+','+this.addForm.pic2+','+this.addForm.pic3+','+this.addForm.pic4)
            params.append("type",this.addForm.type)
            params.append("useTime",this.addForm.useTime)
            params.append("weixin",this.addForm.weixin)
            params.append("qq",this.addForm.qq)
            params.append("tel",this.addForm.tel)
            params.append("viewsOut",this.addForm.viewsOut)
            reqAddMiningTransaction(params).then(res=>{
            	this.addLoading = false;
            	let {code, msg} = res.data;
            	if(code != 2000){
            		this.$message({
                  message : "添加成功!",
                  type : "success"
               	})
                this.$refs['addForm'].resetFields();   //重置表单,只重置校验部分
               	this.addForm.pic1 = ''
               	this.addForm.pic2 = ''
               	this.addForm.pic3 = ''
               	this.addForm.pic4 = ''
                this.addFormVisible = false;
                this.getList();
            	}else{
            		this.$message({
                  message : msg,
                  type : "warning"
               	})
            	}
            })
          })
        }
      })
    },
   
    //单条删除
    delnew (index,row) {
      this.$confirm("确认删除该条记录吗？","提示",{type:"warning"}).then(()=>{
          this.listLoading = true;
        let params = new URLSearchParams();
        params.append("id",row.id);

        reqDeleteMiningTransaction(params).then(res=>{
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
    showEditDialog (index,row) {			//偶然出现编辑框取不到城市的情况
      this.editFormVisible = true;
      row.type = row.type.toString()
      row.state = row.state.toString();
      this.editForm = Object.assign({},row)   //将需要编辑的那一项数据赋给编辑表单
//			console.log(this.editForm.meetingCity)		//有城市
//    console.log(this.editForm);		//无城市
//    this.getProv(this.editForm.pro);
			console.log(this.editForm.pic)
			var pic = row.pic.split(",")
//			console.log(pic)
			this.editForm.pic1 = pic[0]
			this.editForm.pic2 = pic[1]
			this.editForm.pic3 = pic[2]
			this.editForm.pic4 = pic[3]
    },
    //列表编辑
    editSubmit () {
			this.getUeEditContent();
      this.$refs.editForm.validate((valid)=>{
        if(valid){
          this.$confirm("确认提交吗","提示").then(()=>{
            this.editLoading = true;
            let params = new URLSearchParams();
            params.append("id",this.editForm.id)
            params.append("state",this.editForm.state)
            params.append("title",this.editForm.title)
            params.append("content",this.editForm.content)
            params.append("pro",this.editForm.pro)
            params.append("city",this.editForm.city)
            params.append("price",this.editForm.price)
            params.append("pic",this.editForm.pic1+','+this.editForm.pic2+','+this.editForm.pic3+','+this.editForm.pic4)
            params.append("useTime",this.editForm.useTime)
            params.append("type",this.editForm.type)
            params.append("weixin",this.editForm.weixin)
            params.append("qq",this.editForm.qq)
            params.append("tel",this.editForm.tel)
            params.append("viewsOut",this.editForm.viewsOut)
            reqEditMiningTransaction(params).then(res=>{
            	let {code, msg} = res.data;
            	if(code != 2000){
            		this.$message({
                  message:"提交成功",
                  type:"success"
                })
            	
                this.editLoading = false;
                this.$refs.editForm.resetFields();   //对整个表单进行重置，将所有字段值重置为初始值并移除校验结果
                
                this.editFormVisible = false;
                this.getList();   //查询获取数据
            	}else{
            		this.$message({
                  message: msg,
                  type:"warning"
                })
            		this.editLoading = false;
            	}
            }).catch((error)=>{})
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
  components: {
			QuillEditor,
			UE
	},
  mounted () {
  	this.getList();
  }
}
</script>

<style lang="scss" scoped="">	
	.avatar-uploader{
		width: 200px;
		float: left;
		margin-right: 100px;
		margin-bottom: 50px;
	}
</style>
