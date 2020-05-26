<template>
    <div class="serviceQrcodePageCon">
        <div class="formCon">
            <el-form :model="infoForm" :rules="infoRules" ref="infoForm" label-width="100px" class="demo-ruleForm">
              <el-form-item label="客服姓名" prop="name">
                <el-input v-model="infoForm.name"></el-input>
              </el-form-item>
                <el-form-item label="联系电话" prop="phone">
                <el-input v-model="infoForm.phone"></el-input>
              </el-form-item>
                <el-form-item label="微信二维码"  prop="qrcode">
                    <el-upload class="avatar-uploader" action="//upload.qiniu.com/" :on-remove="handleRemove" :before-upload="beforeAvatarUpload" :limit="1" :on-exceed="handleExceed" :on-success="handleAvatarScucess" :file-list="fileList" :data="upload_form">
                  <img class="imgPreview" v-if="infoForm.qrcode" :src="infoForm.qrcode">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>      
                  <div slot="tip" class="el-upload__tip">只支持jpg、png格式</div>
                        <div slot="tip" class="el-upload__tip">建议上传正方形二维码图片，以便零工端识别。</div>
                </el-upload>
              </el-form-item>
                <el-form-item>
                <el-button type="primary" @click="submitForm('infoForm')">保存</el-button>
              </el-form-item>
                
            </el-form>
        </div>
    </div>
</template>
<script>
export default {
    name: 'serviceQrcodePageCon',
    props:{
        company:{
            type: String,
            default: '杭州萧山中心局',
        }
    },
    data() {
        return {
            fileList: [],
            upload_form: {},
            infoForm:{
                name:'',
                phone:'',
                qrcode:'',
                id:'',
            },
            infoRules:{
                name: [
                    { required: true, message: '请输入客服姓名', trigger: 'blur' },
                    { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
                  ],
                phone: [
                    { required: true, message: '请输入联系电话', trigger: 'blur' },
                    { pattern: /^[0-9]{11}$/, message: '请填写正确的联系电话' },
                  ],
                qrcode:[
                    { required: true, message: '请上传二维码', trigger: 'change' },                    
                ]
            },
        }
    },
    mounted() {
        this.getToken();
        this.getInfo();
    },
    methods: {
        getInfo(){
            let params = {
                region:this.company 
            };
            this.Apis.infoManageApi.getServiceInfo(params).then(res=>{
                let { respCode,data } = res;
                  if( respCode === 0 ){
                      if(data){
                          let first = data[0];
                          this.infoForm = {
                            name:first.name,
                            phone:first.mobile,
                            qrcode:first.qrCode,
                              id:first.id,
                        };
                      }
                  }else{

                  }
            }).catch(err=>{
                console.log('err',err);
                this.$message.error(err.errorMsg);
            })
        },
        submitForm(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let params = {
                        mobile:this.infoForm.phone,
                        qrCode:this.infoForm.qrcode,
                        name:this.infoForm.name,
                        region:this.company,
                    };                    
                    if( this.infoForm.id ){
                        params.id = this.infoForm.id;
                    }
                    this.Apis.infoManageApi.editServiceInfo(params).then(res=>{
                        let { respCode,data } = res;
                          if( respCode === 0 ){
                              this.$message({
                                  message: '保存成功',
                                  type: 'success'
                              });
                          }else{

                          }
                    }).catch(err=>{
                        console.log('err',err);
                        this.$message.error(err.errorMsg);
                    })
                } else {
                    return false;
                }
            });
        },
       handleRemove(file, fileList) {
           this.infoForm.qrcode = "";
           this.$forceUpdate();
       },
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg';
            const isPNG = file.type === 'image/png';
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG && !isPNG) {
                this.$message.error('上传二维码只能是 JPG 或PNG格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传二维码大小不能超过 2MB!');
            }
            return isLt2M && (isPNG || isJPG);
        },
        handleExceed(files, fileList) {
            this.$message.warning(`请删除当前文件再重新上传！`);
        },
        getToken() {
          this.Apis.infoManageApi.getImgToken().then((res) => {
              let { respCode,data } = res;
              if( respCode === 0 ){
                  this.upload_form = {
                      key: data.fileName,
                      token: data.upToken,
                  };
              }else{
                  
              }
          }).catch(err=>{
              console.log('err',err);
              this.$message.error(err.errorMsg);
          })
      },
         handleAvatarScucess(res, file) {
             const key = res.key;
             const img = `http://${this.bucketHost}/${key}`;
             this.infoForm.qrcode = img;
             this.getToken();
             this.$refs['infoForm'].validateField('qrcode');
             this.$message({
                 message: '图片上传后请用微信扫描二维码，确认客服微信是否正确',
                 type: 'success'
             });
        },
    }
}
</script>
<style lang="scss" scoped>
     .serviceQrcodePageCon {
         .formCon {
             width: 400px;
             margin: 0 auto;
         }
         .imgPreview {
             width: 260px;
         }
     }
</style>
<style lang="scss">
    .serviceQrcodePageCon {
        .el-upload {
            width: 260px;
        }
        .avatar-uploader .el-upload:hover {
            border-color: #409EFF;
          }
        .el-upload--text {
            height: 280px;
        }
          .avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 178px;
            height: 178px;
            line-height: 178px;
            text-align: center;
          }
    }    
</style>