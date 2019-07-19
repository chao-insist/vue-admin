<template>
  <div>
    <script ref="editor" type="text/plain"></script>
  </div>
</template>
<script>
  export default {
    name: 'UE',
//  editor.addListener("contentChange",function(){
//		    console.log('内容改变:'+editor.getContent());
//		})
    data () {
      return {
      	content: "",
        editor: null,
//      id: "editor",

      }
    },
    props: {
      value: {
        type: String,
        default: ''
      },
      config: {
        type: Object
        
      },
      id: {
      	type: String,
      	default: ''
      }
    },
    watch: {
    	"value"(newVal, oldVal){
    		console.log("正在改变value值")
    		this.$emit("addContent", newVal)
        this.$emit("editContent", newVal)
    		this.editor = UE.getEditor(this.id, this.config); // 初始化UE
    		
    		if(newVal){
    			this.editor.setContent(newVal)
    		}
    		
    	}
    },
    mounted() {
    	const _this = this;
    	this.$refs.editor.id = this.id;
      this.editor = UE.getEditor(this.id, this.config); // 初始化UE
      this.editor.addListener("ready", function () {
        _this.editor.setContent(_this.value); // 确保UE加载完成后，放入内容。
      });
      this.content = this.value;
    },
    methods: {
      getUEContent() { // 获取内容方法
        return this.editor.getContent()
      },
    },
    destroyed() {
      this.editor.destroy();
    }
  }
</script>