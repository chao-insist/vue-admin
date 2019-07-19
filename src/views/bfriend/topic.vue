<template lang="html">
  <el-row class="wrap">
  	
    <!-- 面包屑 -->
    <el-col :span="24" class="wrap-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{path:'/'}">首页</el-breadcrumb-item>
        <el-breadcrumb-item>话题</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>
    <el-col :span="24" class="wrap-main">
    	
      <!-- 列表统计 -->
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
      <!--参数：标题，作者，标签，阅读数，状态-->
      <el-table :data="news" highlight-current-row @selection-change="selsChange" style="width:100%" v-loading="listLoading">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="id" width="80" label="ID" sortable></el-table-column>
        <el-table-column prop="title" label="标题"></el-table-column>
        <el-table-column prop="adminName" label="作者" sortable></el-table-column>
        <el-table-column prop="lables" label="标签">
          <template scope="scope">
            <div slot="reference" class="status-wrapper">
              <el-tag v-for="item in scope.row.lables" size="small" type="success" style="margin:5px">{{item}}</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="views" label="真实阅读数" sortable></el-table-column>
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
        <el-button tyepe="danger" @click="batchDeleteNews" :disabled="this.sels.length===0">批量删除</el-button>
        <el-pagination layout="prev,pager,next" @current-change="handleCurrentChange" :total="total" style="float:right"></el-pagination>
      </el-col>
      
      <!-- 编辑界面 -->
      <!--参数：ID，标题，标签，关键词，关键词描述，上传图片，快讯内容-->
      <el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false">
        <el-form :model="editForm" label-width="100px" ref="editForm" :rules="formRules">
          <el-form-item label="标题" prop="title">
            <el-input v-model="editForm.title" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item prop="content" label="内容">
		      			<!--<quill-editor @editContent="getEditContent" :value="editForm.content"></quill-editor>-->
		      			<UE :value="editForm.content" :config="config" ref="editUe" :id="editUeId"></UE>
		      </el-form-item>
		      <el-form-item label="上传图片" prop="pic">
              <el-upload class="avatar-uploader"
               :action="picUpload"
               :show-file-list="false"
               :on-success="handleEditPic">
                <img v-if="editForm.pic" :src="editForm.pic" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
          </el-form-item>
          <el-form-item label="标签" prop="lables">
              <el-checkbox-group v-model="editForm.lables" :min="1" :max="2">
                <el-checkbox-button v-for="item in this.tagBox" :label="item" :key="item">{{item}}</el-checkbox-button>
              </el-checkbox-group>
          </el-form-item>
          <el-form-item label="关键词" prop="keywords">
            <el-input v-model="editForm.keywords"></el-input>
          </el-form-item>
          <el-form-item label="关键词描述" prop="keywordsContent">
            <el-input v-model="editForm.keywordsContent"></el-input>
          </el-form-item>
          
          <!--<el-form-item label="快讯内容" prop="content">
            <el-input type="textarea" v-model="editForm.content" :rows="textareaRows"></el-input>
          </el-form-item>-->
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
      <!--参数：标题，标签，关键词，关键词描述，上传图片，快讯内容-->
      <el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false">
        <el-form :model="addForm" label-width="100px" ref="addForm" :rules="formRules">
        	<el-form-item label="定时推送" prop="created">
        		<el-date-picker v-model="addForm.created" type="datetime" placeholder="选择定时推送时间" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
        	</el-form-item>
          <el-form-item label="标题" prop="title">
            <el-input v-model="addForm.title" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item prop="content" label="内容">
		      			<!--<quill-editor @addContent="getAddContent" :value="addForm.content"></quill-editor>-->
		      			<UE :value="addForm.content" :config="config" ref="addUe" :id="addUeId"></UE>
		      </el-form-item>
		      <el-form-item label="上传图片" prop="pic">
              <el-upload class="avatar-uploader"
               :action="picUpload"
               :show-file-list="false"
               :on-success="handleAddPic">
                <img v-if="addForm.pic" :src="addForm.pic" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
          </el-form-item>
          <el-form-item label="标签" prop="lables">
              <el-checkbox-group v-model="addForm.lables" :min="1" :max="2">
                <el-checkbox-button v-for="item in this.tagBox" :label="item" :key="item">{{item}}</el-checkbox-button>
              </el-checkbox-group>
          </el-form-item>
          <el-form-item label="关键词" prop="keywords">
            <el-input v-model="addForm.keywords" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="关键词描述" prop="keywordsContent">
            <el-input v-model="addForm.keywordsContent"></el-input>
          </el-form-item>
          
          <!--<el-form-item label="快讯内容" prop="content">
            <el-input type="textarea" v-model="addForm.content" :rows="textareaRows"></el-input>
          </el-form-item>-->
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
import {reqGetTopicList,reqGetListByTitle,reqAddTopic,reqEditTopic,reqDeleteTopic,picUpload} from 'api/api'
import QuillEditor from '@/components/quill-editor/quill-editor'
import UE from '@/components/ueditor/ueditor'
export default {
  name : 'topic',
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
    	value: '',
      config: {
	      initialFrameWidth: null,
	      initialFrameHeight: 350,
//	      autoFloatEnabled: false,
      },
      editUeId: "editUE",
      addUeId: "addUE",
    	isQuery: false,
      picUpload:picUpload,
      tagBox:["深度观点","话题","比特币","以太坊","竞争币","区块链","挖矿","币交所","其他"],
      //    defaultSort: {		//默认倒序排序
			//    	prop: "id",
			//    	order:"descending"
			//    },
      //公共
      news: [],
      textareaRows:5,
      filters : {
        title:''
      },
      page : 1,
      sels : [],
      total : 10,
      editFormVisible: false,
      editFormPicDialogVisible: false,
      addFormVisible: false,
      listLoading: false,
      editLoading: false,
      addLoading: false,
      uid: '',
      editForm:{},
      addForm:{
        lables : [],
        recommend:"true",
        recommendHome:"true",
        content:'',
        title:'',
        pic:"",
        keywords:'',
        keywordsContent:'',
        created: ''
      },
      formRules : {
        title : [
          {required : true,message : "请输入标题",trigger : "blur"}
        ],
        pic: [
	        {required : true,message : "请上传图片",trigger : "change"}
	    	],
        keywords : [
          {required : true,message : "请输入关键词",trigger : "blur"}
        ],
        keywordsContent : [
          {required : true,message : "请对关键词进行描述",trigger : "blur"}
        ],
        content : [
          {required : true,message : "请输入快讯内容",trigger : "blur"}
        ]
      }
    }
  },
  created(){
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
  	getAddContent(content){
			console.log(content)
			this.addForm.content = content;
		},
		getEditContent(content){
			console.log(content)
			this.editForm.content = content;
		},
	  //图片上传
	  handleEditPic(res, file) {
	    this.editForm.pic = file.response.data;
	  //   console.log(res);
	  },
	  handleAddPic(res, file) {
	    this.addForm.pic = file.response.data;
	    console.log(this.addForm.pic)
	},
	 	//列表分页
    handleCurrentChange (val) {
      this.page = val;  //当前页赋值
      this.getList();
    },
    //选中列
    selsChange (sels) {
      this.sels = sels;
      console.log(this.sels);
    },

		//获取列表
    getList () {
    	if(!this.isQuery){
    		let params = new URLSearchParams();
	      params.append('type',0);
	      params.append('page',this.page);
	      this.listLoading = true;
		    reqGetTopicList(params).then(res=>{
		        this.news = res.data.list;
		        this.total = res.data.navigatepageNums.length*10;
		        for(let i = 0;i < this.news.length;i++){
		            if(this.news[i].lables != ''){
		          		this.news[i].lables = this.news[i].lables.split(",");
		          	} 
		        }
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
	    params.append("moduleName","话题讨论")
	    params.append('page',this.page);
	    this.listLoading = true;
	    reqGetListByTitle(params).then(res=>{
	    	let {list, navigatepageNums} = res.data;
	        if(list != []){
	        	this.news = list;
	            this.total = navigatepageNums.length * 10
	            for(let i = 0;i < this.news.length;i++){
	                if(this.news[i].lables != ''){
			          		this.news[i].lables = this.news[i].lables.split(",");
			          	} 
	            }
	            this.listLoading = false;
	        }else{
	        	this.news = [];
	        	this.listLoading = true;
	        }
							console.log(res)
	    })
		},
	    
    //显示新增界面
    showAddDialog () {
      this.addFormVisible = true;
      this.addForm.content = "";
    },
    //提交新增数据
    addSubmit () {
    	this.getUeAddContent();
      this.$refs.addForm.validate((valid)=>{    //验证表单
        if(valid){
          this.$confirm("确认新增此条快讯吗？","提示",{type:"warning"}).then(()=>{
            this.addLoading = true;
            this.addForm.lables = this.addForm.lables.join(',');
            let params = new URLSearchParams();
            params.append("uid",this.uid)
            params.append("created",this.addForm.created)
            params.append("lables",this.addForm.lables)
            params.append("content",this.addForm.content)
            params.append("title",this.addForm.title)
            params.append("pic",this.addForm.pic)
            params.append("type",0)
            params.append("keywords",this.addForm.keywords)
            params.append("keywordsContent",this.addForm.keywordsContent)
            params.append("viewsOut",this.addForm.viewsOut)
            reqAddTopic(params).then(res=>{
            	this.addLoading = false;
            	let {code, msg} = res.data;
            	if(code != 2000){
            		this.$message({
                  message : "添加成功!",
                  type : "success"
               	})
                this.$refs['addForm'].resetFields();   //重置表单
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
    
    //删除一项
    delnew (index,row) {
      this.$confirm("确认删除该条记录吗？","提示",{type:"warning"}).then(()=>{
          this.listLoading = true;
        let params = new URLSearchParams();
        params.append("id",row.id);
        reqDeleteTopic(params).then(res=>{
            this.$message({
              message : "删除成功",
              type : "success"
            })
            this.listLoading = false;
            this.getList();
        }).catch((error)=>{})
      })
    },
    //批量删除
    batchDeleteNews (index,row) {
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
      // this.editForm.lables = this.tagBox;
      console.log(this.editForm);
    },
    //编辑
    editSubmit () {
    	this.getUeEditContent();
        this.$refs.editForm.validate(valid=>{
            if(valid){
                this.$confirm("确认提交吗","提示").then(()=>{
                  this.editLoading = false;
                  let params = new URLSearchParams();
                  params.append("id",this.editForm.id)
                  params.append("uid",this.uid)
                  params.append("title",this.editForm.title)
                  params.append("lables",this.editForm.lables)
                  params.append("content",this.editForm.content)
                  params.append("pic",this.editForm.pic)
                  params.append("keywords",this.editForm.keywords)
                  params.append("keywordsContent",this.editForm.keywordsContent)
									params.append("viewsOut",this.editForm.viewsOut)
                  reqEditTopic(params).then(res=>{
                  	this.editLoading = false;
                  	let {code, msg} = res.data;
                  	if(code != 2000){
                  		this.$message({
                        message:"提交成功",
                        type:"success"
                      })
                      
                      this.$refs.editForm.resetFields();   //对整个表单进行重置，将所有字段值重置为初始值并移除校验结果
                      this.editFormVisible = false;
                      this.getList();   //查询获取数据
                  	}else{
                  		this.$message({
                        message:msg,
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

<style lang="scss">

</style>
