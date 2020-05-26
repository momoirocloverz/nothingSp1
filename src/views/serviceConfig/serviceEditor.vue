<template>
    <div class="serviceEditorCon">
        <div class="subCon">      
            <div class="topPart">
                <div>当前已选生产区域：{{area}}</div>
                <div><el-button type="primary" @click="goBack">返回</el-button></div>
            </div>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="u-ruleForm">
          <el-form-item label="公告标题" prop="title">
              <el-input v-model="ruleForm.title" @change="titleChange"  placeholder="添加标题"></el-input>
            </el-form-item>
          <el-form-item label="公告内容" prop="content">
              <quill-editor class="myTextEditor"  v-model="ruleForm.content" :options="quillOption"  placeholder="添加内容" @change="onEditorChange($event)"></quill-editor>
            </el-form-item>
      </el-form>
      <div class="u-button-group">
          <el-button type="primary" @click="publishArticle" style="margin-right:40px;">保存</el-button>
          <div class="u-ready" @click="handleShowReady">预览</div>
      </div>
      <el-dialog title="预览" :visible.sync="show" width="500px"  class="forPreview u-dialog-wrapper">
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
    name: 'serviceEditorCon',
    data() {
        return {
            isEdit:false,
            area:'',
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
          content: '',
          quillOption: quillConfig,
          rules:{
            title:[{
                required: true,message: '标题不能为空', trigger: 'blur'
            }],
             content:[{
                 required: true,message: '内容不能为空', trigger: 'blur'
             }],
          },
            changeStatus:false,
            routerJumpFlag:false,
            timer:null,
        }
    },
    beforeRouteLeave (to, from, next) { 
        if( this.changeStatus ){
            this.$confirm('请确保当前编辑内容已保存,是否确定离开当前页面？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                next();
            }).catch(() => {});
        }else{
            next();
        }
    },
    mounted() {
        this.setCurrentTime();
    },
    methods: {
        titleChange(){
            this.changeStatus = true;
        },
        initResetChangeStatus(){
            this.changeStatus = false;
        },
        onEditorChange($event){
            console.log('变化了');
            this.changeStatus = true;
        },
        goBack(){
            this.$router.push({
                name: 'serviceConfig',
                query:{
                    selectVal:this.area,
                    listShow:'1',
                }
            });
        },
        setCurrentTime(){
            this.currentTime = this.Moment(Date.now()).format('YYYY-MM-DD');
            this.area = this.$route.query.area;
            this.isEdit = this.$route.query.edit == '0' ? false : true;
            this.getArticleContent();            
            this.timer = setTimeout(()=>{
                this.initResetChangeStatus(); 
            },2500);
        },
        publishArticle(){   
            this.$refs['ruleForm'].validate((valid)=>{                
                if(valid){
                    let dataParams = {
                        region:this.area,
                        title:this.ruleForm.title,
                        content:this.ruleForm.content,
                    };                    
                    if( this.isEdit ){
                        dataParams.id = this.$route.query.id;
                        dataParams.status = this.$route.query.status;
                    }                    
                    this.Apis.infoManageApi.editBoardArticle(dataParams).then(res=>{
                        let { respCode,data } = res;
                        if( respCode === 0 ){
                            this.$message({
                                  message: '保存成功',
                                  type: 'success'
                              });
                                this.changeStatus = false;
                            this.$nextTick(()=>{
                                this.goBack();
                            });                            
                        }
                    }).catch(err=>{
                        console.log('err',err);
                        this.$message.error(err.errorMsg);
                    })
                }else{
                }
            });   
        },
        getArticleContent(){
            if( this.isEdit ){                
                let params = {
                    id:this.$route.query.id 
                };
                this.Apis.infoManageApi.checkBoardArticle(params).then(res=>{
                    let { respCode,data } = res;
                    if( respCode === 0 ){
                        this.ruleForm.title = data.title;
                        this.ruleForm.content = data.content;
                    }
                }).catch(err=>{
                    console.log('err',err);
                    this.$message.error(err.errorMsg);
                })                
            }else{
                
            }
        },
        handleShowReady(){
            this.$refs['ruleForm'].validate((valid)=>{
                if(valid){
                    this.show = true;
                }
            });
        },
      handleSaveAndUp(){
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
              console.log( 'valid', this.ruleForm.listPic);
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
 .serviceEditorCon {
     padding: 20px;
 }
    .topPart {
        display: flex;
        justify-content: space-between;
        align-content: center;
        align-items: center;
        width: 800px;
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
    width: 800px;
  }
  .document-editor__editable{
    min-height: 400px;
}
.u-button-group {
  display: flex;
    padding-left: 300px;
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
    width: 360px;
    margin: 0 auto;
    background-color: #fff;
    padding: 60px;
    padding-top: 0;
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
    margin-bottom: 30px;
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
.serviceEditorCon{
    .ql-editor{
        height:400px;
    }
}
.u-detail-content.ql-editor {
  height: auto;
}
</style>
<style lang="scss">
    .serviceEditorCon {
        .forPreview {
            .ql-editor {
                img {
                    max-width: 330px;
                }
            }
        }
    }
</style>