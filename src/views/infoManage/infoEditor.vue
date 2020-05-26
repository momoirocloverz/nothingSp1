<template>
    <div class="u-info-editor">
        <div class="subCon">        
       <el-breadcrumb separator-class="el-icon-arrow-right" class="u-breadcrumb">
        <el-breadcrumb-item :to="{ path: '/infoManage' }">资讯管理</el-breadcrumb-item>
        <el-breadcrumb-item>{{textSecond}}</el-breadcrumb-item>
      </el-breadcrumb>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="u-ruleForm">
        <el-form-item label="标题" prop="title">
          <el-input v-model="ruleForm.title"  placeholder="添加标题"></el-input>
        </el-form-item>
        <el-form-item label="来源" prop="source">
          <el-input v-model="ruleForm.source"  placeholder="添加来源"></el-input>
        </el-form-item>
          <el-form-item label="类型" prop="type">
              <el-radio-group class="radio-search" v-model="ruleForm.type">
                      <el-radio :label="1">公司新闻</el-radio>
                      <el-radio :label="2">媒体报道</el-radio>
                      <el-radio :label="3">常见问题</el-radio>                      
                  </el-radio-group>
        </el-form-item>
          
        <el-form-item label="内容" prop="content">
          <quill-editor ref="myTextEditor"
             class="myTextEditor"
            v-model="ruleForm.content" :options="quillOption"  placeholder="添加内容">
          </quill-editor>
       </el-form-item>
        <el-form-item label="资讯简介" prop="description">
          <el-input v-model="ruleForm.description" maxlength="140"  placeholder="请输入140字以内,如不填默认显示提取资讯内容前140字" ></el-input>
        </el-form-item>
      </el-form>
      <div class="u-button-group" v-if="ruleForm.status===0">
        <el-button type="primary" @click="handleSaveAndUp({status:0})" style="margin-right:40px;">保存</el-button>
        <div class="u-ready" @click="handleShowReady">预览</div>

      </div>
      <div class="u-button-group" v-else-if="ruleForm.status===1">
        <el-button type="primary" @click="handleSaveAndUp({status:1})">发布</el-button>
        <div class="u-ready" @click="handleShowReady">预览</div>

      </div>
      <div class="u-button-group" v-else>
        <el-button type="primary" @click="handleSaveAndUp({status:0})" style="margin-right:40px;">保存</el-button>
        <el-button type="primary" @click="handleSaveAndUp({status:1})">发布</el-button>
        <div class="u-ready" @click="handleShowReady">预览</div>
      </div>
      <el-dialog
      title="预览"
      :visible.sync="show"
      width="calc(100% - 100px)"
      class="u-dialog-wrapper"
      >
      <div class="u-ready-wrapper">
        <div class="u-title">
        {{ruleForm.title}}
        </div>
        <div class="u-foot-note">
          <div class="u-source">{{ruleForm.source}} </div>
          <div class="u-time"> {{currentTime}}</div>
        </div>
        <div class="u-detail-content ql-editor" v-html="ruleForm.content">
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="show = false">确 定</el-button>
      </span>
    </el-dialog>
            </div>
    </div>
</template>
<script>
import { Quill } from 'vue-quill-editor'
import quillConfig from '@/apis/quill-config.js'
import { ImageDrop } from 'quill-image-drop-module';
import  ImageResize  from 'quill-image-resize-module';
Quill.register('modules/imageDrop', ImageDrop);
Quill.register('modules/imageResize', ImageResize);    
export default {
    name: 'infoEditor',
    data() {
        return {
            currentTime:Date.now(),
          textSecond:'',
          show:false,
          ruleForm:{
            title:'',
            source:'',
            description:'',
            content:'',
            status:'',
            listPic:'',
              type:1,
          },
          content: '<h2>quill-editor</h2>',
          quillOption: quillConfig,
          rules:{
            title:[{
                    required: true,message: '标题不能为空', trigger: 'blur'
                }],
            source:[{
                    required: true,message: '来源不能为空', trigger: 'blur'
                }],
             content:[{
                    required: true,message: '内容不能为空', trigger: 'blur'
                }],
              type:[{
                    required: true,message: '类型不能为空', trigger: 'blur'
                }],
          }
        }
    },
    mounted() {
        this.handleIsCreate();
        this.setCurrentTime();
    },
    methods: {
        setCurrentTime(){
            this.currentTime = this.Moment(Date.now()).format('YYYY-MM-DD');
        },
      handleIsCreate(){
        let {type,id} = this.$route.query;
        if(type==='0'){
          this.textSecond = '添加资讯';
        }else {
          this.textSecond = '编辑资讯';
          this.handleGetEditorInfo({id});
        }
      },
      handleGetEditorInfo({id}){
        this.Apis.infoManageApi.getEditorInfo({id}).then(res=>{
          this.ruleForm.source = res.data.source;
          this.ruleForm.title = res.data.title;
          this.ruleForm.description = res.data.description;
          this.ruleForm.content = res.data.content;
          this.ruleForm.status = res.data.status;
            this.ruleForm.type = res.data.type;
        })
      },
      handleShowReady(){
        this.$refs['ruleForm'].validate((valid)=>{
          if(valid){
            this.show = true;
          }
        });
      },
      handleSaveAndUp({status}){
        let contents = this.ruleForm.content
          if(contents){
            /*截取简介*/
          if(!this.ruleForm.description){
            let pretitleTemp = contents.replace(/(\n)/g, "");
            pretitleTemp = pretitleTemp.replace(/(\t)/g, "");
            pretitleTemp = pretitleTemp.replace(/(\r)/g, "");
            pretitleTemp = pretitleTemp.replace(/<\/?[^>]*>/g, "");
            pretitleTemp = pretitleTemp.replace(/\s*/g, "");
            this.ruleForm.description = pretitleTemp.substring(0,140)
          }
          /*匹配img属性*/
          let imgReg = /<img.*?(?:>|\/>)/gi;
          /*匹配src属性*/
          let srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;
          /*找到第一张图片*/
          let arr = contents.match(imgReg);
          if(arr){
            /*找到匹配的src属性*/
            let srctemp = arr[0].match(srcReg);
            /*第一张图片地址*/
            if(srctemp){
              this.ruleForm.listPic=srctemp[1]
            }
          }
        }
        const {id} =this.$route.query;
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            if(id){
              this.Apis.infoManageApi.setSaveAndUp({...this.ruleForm,id,status}).then(res=>{
                this.$router.replace({ name: "InfoManage" });
              })
            }else {
              this.Apis.infoManageApi.setNewSaveAndUp({...this.ruleForm,status}).then(res=>{
                this.$router.replace({ name: "InfoManage" });
              })
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        });
        
      }
    }
}
</script>
<style lang="scss" scoped>
 .u-info-editor {
     padding: 20px;
 }
    .subCon {
         background-color: #fff;
         padding: 20px;
         box-sizing: border-box;
     }
 .u-breadcrumb {
      margin: 0 20px;
      font-size: 18px;
      font-weight: 700;
      color: #000;
  }
  .u-ruleForm {
    margin-top: 30px;
    width: 1200px;
  }
  .document-editor__editable{
    min-height: 400px;
}
.u-button-group {
  display: flex;
  padding-left: 600px;
}
.u-ready {
  margin-left: 40px;
  height: 40px;
  line-height: 40px;
  cursor: pointer;
  color: #169BD5;
}
.u-ruleForm {
  .el-form-item__content {
    width:100%
  }
}
.u-dialog-wrapper {
  .el-dialog {
    background-color: rgb(245, 246, 248);
    img {
      max-width: 100%;
    }
  }
  .el-dialog__body {
    color: #101010;
  }
}
.u-ready-wrapper {
  width: 790px;
  margin: 0 auto;
  background-color: #fff;
  width: 790px;
  padding: 60px;
  .content-box {

  }
  .u-title {
    font-family: "Source Han Sans CN";
    font-weight: bold;
    color: rgb(16, 16, 16);
    font-size: 30px;
    line-height: 51px;
    padding: 0;
    margin: 0;
    text-indent:0;
  }
  .u-foot-note {
    display: flex;
    margin-top: 20px;
    // font-size: 12px;
    // line-height: 20px;
    margin-bottom: 30px;
    .u-source {

    }
    .u-time {
          margin-left: 51px;
          color: rgb(155, 158, 160);
    }
    .u-detail-content {
      font-family: "Source Han Sans CN";
      color: #101010;
      font-weight: 400;
      font-size: 14px;
      line-height: 30px;
    }
  }
}
.myTextEditor {
}
.u-info-editor{
.ql-editor{
         height:400px;
     }
}
.u-detail-content.ql-editor {
  height: auto;
}

</style>