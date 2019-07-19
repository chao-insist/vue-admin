<template lang="html">
  <el-row class="wrap">

    <!-- 面包屑 -->
    <el-col :span="24" class="wrap-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{path:'/'}">首页</el-breadcrumb-item>
        <el-breadcrumb-item>实时快讯</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>
    <el-col :span="24" class="wrap-main">

      <!-- 列表统计 -->
      <el-col :span="12" class="list-statistics">
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
      <el-col :span="12">
      	<el-card class="box-card">
				  <div class="text item">
				    今日快讯 <span>{{statistics.toDay}}</span>
				  </div>
				  <div class="text item">
				    昨日快讯 <span>{{statistics.yesterDay}}</span>
				  </div>
				  <div class="text item">
				    本月快讯 <span>{{statistics.thisMonth}}</span>
				  </div>
				  <div class="text item">
				    上月快讯 <span>{{statistics.lastMonth}}</span>
				  </div>
				  <div class="text item">
				    快讯总计 <span>{{statistics.countSum}}</span>
				  </div>
				</el-card>
      </el-col>

      <!-- 列表 -->
      <!--参数：ID，标题，作者，标签，阅读数，状态，-->
      <el-table :data="news" highlight-current-row @selection-change="selsChange" style="width:100%" v-loading="listLoading">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="id" width="80" label="ID" sortable></el-table-column>
        <el-table-column prop="title" label="标题"></el-table-column>
        <el-table-column prop="adminName" label="作者" sortable></el-table-column>
        <el-table-column label="位置">
        	<template slot-scope="scope">
        		<el-tag size="small" type="success" v-if="scope.row.recommendHome">头条</el-tag>
        		<el-tag size="small" type="success" v-if="scope.row.recommend">深度观点</el-tag>
        		<el-tag size="small" type="success" v-if="!scope.row.recommendHome&&!scope.row.recommend">新闻</el-tag>
        	</template>
        </el-table-column>
        <el-table-column prop="lables" label="标签">
          <template slot-scope="scope">
            <div slot="reference" class="status-wrapper">
              <el-tag size="small" v-for="item in scope.row.lables" type="success" style="margin:5px">{{item}}</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="views" label="阅读数" sortable></el-table-column>
        <el-table-column prop="status" label="状态" sortable>
          <template slot-scope="scope">
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
      <!--参数：标题，推荐，推荐到头条，是否禁用，标签，关键词，关键词描述，上传图片，快讯内容，来源，来源链接，阅读数，外部阅读数-->
      <el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false" :fullscreen="false">
        <el-form :model="editForm" label-width="100px" ref="editForm" :rules="formRules">
          <el-form-item label="标题" prop="title">
            <el-input v-model="editForm.title" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item prop="content" label="内容">
		      			<!--<quill-editor @editContent="getEditContent" :value="editForm.content"></quill-editor>-->
		      			<UE :value="editForm.content" :config="config" ref="editUe" :id="editUeId"></UE>
		      			<!--<button type="button" @click="getContent">获取内容</button>-->
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
          <el-form-item label="推荐" prop="recommend">
            <el-radio class="radio" v-model="editForm.recommend" label="true">推荐</el-radio>
            <el-radio class="radio" v-model="editForm.recommend" label="false">不推荐</el-radio>
          </el-form-item>
          <el-form-item label="推荐到头条" prop="recommendHome">
            <el-radio class="radio" v-model="editForm.recommendHome" label="true">推荐</el-radio>
            <el-radio class="radio" v-model="editForm.recommendHome" label="false">不推荐</el-radio>
          </el-form-item>
          <el-form-item label="是否套色" prop="color">
            <el-radio class="radio" v-model="editForm.color" label="true">套</el-radio>
            <el-radio class="radio" v-model="editForm.color" label="false">不套</el-radio>
          </el-form-item>
          <!--<el-form-item label="是否禁用" prop="status">
          	<el-switch v-model="isDisabled" on-text="正常" off-text="禁用" on-value=1 off-value=0></el-switch>
          </el-form-item>-->
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
          <el-form-item label="星级" prop="level">
          	<el-input-number :min="1" :max="5" v-model="editForm.level"></el-input-number>
          </el-form-item>
          <el-form-item label="来源" prop="src">
            <el-input v-model="editForm.src"></el-input>
          </el-form-item>
          <el-form-item label="来源链接" prop="link">
            <el-input v-model="editForm.link"></el-input>
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
      <!--参数：标题，推荐，推荐到头条，标签，关键词，关键词描述，上传图片，快讯内容，来源，来源链接，阅读数，外部阅读数-->
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
           <el-form-item label="推荐" prop="recommend">
            <el-radio class="radio" v-model="addForm.recommend" label="true">推荐</el-radio>
            <el-radio class="radio" v-model="addForm.recommend" label="false">不推荐</el-radio>
          </el-form-item>
          <el-form-item label="推荐到头条" prop="recommendHome">
            <el-radio class="radio" v-model="addForm.recommendHome" label="true">推荐</el-radio>
            <el-radio class="radio" v-model="addForm.recommendHome" label="false">不推荐</el-radio>
          </el-form-item>
          <el-form-item label="是否套色" prop="color">
            <el-radio class="radio" v-model="addForm.color" label="true">套</el-radio>
            <el-radio class="radio" v-model="addForm.color" label="false">不套</el-radio>
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
          <el-form-item label="星级" prop="level">
          	<el-input-number :min="1" :max="5" v-model="addForm.level"></el-input-number>
          </el-form-item>
          <!--<el-form-item label="快讯内容" prop="content">
            <el-input type="textarea" v-model="addForm.content" :rows="textareaRows"></el-input>
          </el-form-item>-->
          <el-form-item label="来源" prop="src">
            <el-input v-model="addForm.src"></el-input>
          </el-form-item>
          <el-form-item label="来源链接" prop="link">
            <el-input v-model="addForm.link"></el-input>
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
		<el-input v-model="$store.state.count"></el-input>
		<el-button @click.native= "add">+</el-button>
		<el-button @click.native="$store.commit('reduceCount')">-</el-button>

		<span>{{idate}}</span>
		<span>{{mdate}}</span>
  </el-row>
</template>

<script>
import {mapState, mapMutations} from 'vuex'
import {parseTime, formatTime, getDateDiff, toThousands} from "common/js/date"
import {reqGetTopicList,reqGetListByTitle,reqAddTopic,reqEditTopic,reqDeleteTopic,picUpload, reqGetTopicStatistics} from 'api/api'
import QuillEditor from '@/components/quill-editor/quill-editor'
import UE from '@/components/ueditor/ueditor'
export default {
  name : 'topic',
  computed : {
  	idate () {
  		return parseTime(4234344322143,"{y}年{m}月{d}日 {h}:{i}:{s}星期{a}");
  	},
  	mdate () {
		return toThousands(144733)
//return new Date().getTime()/1000
//return Date.now()
return
  	},
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
    recommendTag (scope) {
    	return scope.row.title;
    },

  },
  data () {
    return {
    	//统计
    	statistics: {
    		countSum: 0,
    		lastMonth: 0,
    		thisMonth: 0,
    		toDay: 0,
    		yesterDay: 0
    	},
    	value: '',
      config: {
	      initialFrameWidth: null,
	      initialFrameHeight: 350,
//	      autoFloatEnabled: false,
//	      serverUrl: "http://192.168.20.53:8080/bzj-portal/uedconfig.html"
      },
      editUeId: "editUE",
      addUeId: "addUE",
      picUpload:picUpload,
      tagBox:["国内","国外","平台","新币","矿场","区块链","其他"],
      //    defaultSort: {		//默认倒序排序
			//    	prop: "id",
			//    	order:"descending"
			//    },

      //公共
      isQuery: false,
      news: [],
      textareaRows:5,
      filters : {
        title:''
      },
      page : 1,
      sels : [],
      total : 10,
      editFormVisible: false,
      addFormVisible: false,
      listLoading: false,
      editLoading: false,
      addLoading: false,
			uid: '',
      editForm:{},
      addForm:{
        lables : [],
        recommend:"false",
        recommendHome:"false",
        content:'',
        title:'',
        pic:"",
        keywords:'',
        keywordsContent:'',
        src:'',
        link:"",
        viewsOut: 1,
        color: "false",
        created: '',
        level: 1
      },
      formRules : {
        title : [
          {required : true,message : "请输入标题",trigger : "blur"}
        ],
        keywords : [
          {required : true,message : "请输入关键词",trigger : "blur"}
        ],
        keywordsContent : [
          {required : true,message : "请对关键词进行描述",trigger : "blur"}
        ],
        pic: [
	        {required : true,message : "请上传图片",trigger : "change"}
	    	],
//      content : [
//        {required : true,message : "请输入快讯内容",trigger : "blur"}
//      ],
        src : [
          {required : true,message : "请输入快讯来源",trigger : "blur"}
        ],
        link : [
          {required : true,message : "请输入快讯链接",trigger : "blur"}
        ]
      }
    }
  },
  created (){
		this.uid = JSON.parse(sessionStorage.getItem("admin-user")).id;
	},
  methods: {

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
  		//绑定新增内容
  		getAddContent(content){
				this.addForm.content = content;
			},
			//绑定编辑内容
			getEditContent(content) {
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

	    //获取新增标签
	    getAddTag (val) {
	        console.log(val.target.value);
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
	      params.append('type',1);
	      params.append('page',this.page);
	      this.listLoading = true;
	      reqGetTopicList(params).then(res=>{
	          this.news = res.data.list;
	          console.log(res.data.list)
	          this.total = res.data.navigatepageNums.length*10;
	          for(let i = 0;i < this.news.length;i++){
	          	if(this.news[i].lables != ''){
	          		this.news[i].lables = this.news[i].lables.split(",");
	          	}
	          }
	          this.listLoading = false;
//	          console.log(this.news);
	      })
    	}else{
    		this.getTitleList();
    	}

    },

		//根据title查询列表
		getTitleList () {
			let params = new URLSearchParams();
	    params.append("title",this.filters.title);
	    params.append("moduleName","实时快讯")
	    params.append('page',this.page);
	    this.listLoading = true;
	    reqGetListByTitle(params).then(res=>{
	    	let {list, navigatepageNums} = res.data;
	        if(list != []){
	        	this.news = list;
	            this.total = navigatepageNums.length * 10
	            for(let i = 0;i < this.news.length;i++){
	                this.news[i].lables = this.news[i].lables.split(",");
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
        	console.log(this.addForm.keywordsContent);
        	console.log(this.addForm.recommendHome)
          this.$confirm("确认新增此条快讯吗？","提示",{type:"warning"}).then(()=>{
            this.addLoading = true;
            this.addForm.lables = this.addForm.lables.join(',');
            let params = new URLSearchParams();
            if(this.addForm.created){
            	params.append("created",this.addForm.created)
            }
            params.append("uid",this.uid)
            params.append("lables",this.addForm.lables)
            params.append("color",this.addForm.color)
            params.append("recommend",this.addForm.recommend.toString())
            params.append("recommendHome",this.addForm.recommendHome.toString())
            params.append("content",this.addForm.content)
            params.append("title",this.addForm.title)
            params.append("pic",this.addForm.pic)
            params.append("type",1)
            params.append("level",this.addForm.level)
            params.append("keywords",this.addForm.keywords)
            params.append("keywordsContent",this.addForm.keywordsContent)
            params.append("src",this.addForm.src)
            params.append("link",this.addForm.link)
            params.append("viewsOut",this.addForm.viewsOut);
            reqAddTopic(params).then(res=>{
              this.addLoading = false;
             	let {code, msg} = res.data;
             	if(code != 2000){
             		this.$message({
	                message : "添加成功!",
	                type : "success"
	              })
	              this.$refs.addForm.resetFields();   //重置表单
	              this.addForm.value = "";
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
      row.recommend = row.recommend.toString();
      row.recommendHome = row.recommendHome.toString();
      this.editForm = Object.assign({},row)   //将需要编辑的那一项数据赋给编辑表单
      console.log(this.editForm);
    },
    //编辑
    editSubmit () {
    	this.getUeEditContent();
      this.$refs.editForm.validate(valid=>{
          if(valid){
              this.$confirm("确认提交吗","提示").then(()=>{
                this.editLoading = true;
                let params = new URLSearchParams();
                params.append("id",this.editForm.id)
                params.append("uid",this.uid)
                params.append("title",this.editForm.title)
                params.append("color",this.editForm.color)
                params.append("recommend",this.editForm.recommend)
            		params.append("recommendHome",this.editForm.recommendHome)
                params.append("lables",this.editForm.lables)
                params.append("content",this.editForm.content)
                params.append("pic",this.editForm.pic)
                params.append("level",this.editForm.level)
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
	                  this.$refs['editForm'].resetFields();   //对整个表单进行重置，将所有字段值重置为初始值并移除校验结果
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
	    }

  },
  components: {
			QuillEditor,
			UE
	},
  mounted () {
    this.getList();
    var params = new URLSearchParams();
    params.append("type",1)

    reqGetTopicStatistics(params).then(res=>{
    	console.log(res)
    	let data = res.data.data[0];
    	console.log(data)
    	this.statistics.countSum = data.countSum;
    	this.statistics.lastMonth = data.lastMonth;
    	this.statistics.thisMonth = data.thisMonth;
    	this.statistics.toDay = data.toDay;
    	this.statistics.yesterDay = data.yesterDay;
    })
  }
}
</script>

<style lang="scss">
	#edui1{
		z-index: 3000!important;
	}
	#edui_fixedlayer{
		z-index: 3000!important;
	}
	.text {
    font-size: 14px;
  }

  .item {
    display: inline-block;
    margin-right: 20px;
    span{
    	color: #FF0000;
    }
  }

</style>
