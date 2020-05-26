<template>
    <div class="header">
        <div class="collapse-btn" @click="collapseChage">
            <i class="el-icon-menu"></i>
        </div>
        <div>
            <div class="logo">万才后台管理系统</div>
            <div class="header-right">
                <div class="header-user-con">
                   <i class="el-icon-user-solid"></i>
                      <el-dropdown class="user-name" trigger="click" @command="handleCommand">
                        <span class="el-dropdown-link">
                            {{username}} <i class="el-icon-caret-bottom"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="loginout">退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </div>
        </div>        

        <el-dialog title="更换绑定手机号" :visible.sync="changePhoneVisible" class="changePhoneDialog" >
            <div class="changePhoneForm">
                <el-form :model="changePhoneForm" :rules="changePhoneRules" ref="changePhoneForm" label-width="150px" class="">
                    <el-form-item label="验证手机号">
                        <div class="phoneItemCon">
                            <div class="phoneNumberText">{{ getPhone | encryptionPhone }}</div>
                            <el-button type="primary" @click.native="sendSms1">获取验证码</el-button>
                        </div>
                    </el-form-item>
                    <el-form-item label="原手机号短信验证码" prop="originPhone">
                        <el-input v-model="changePhoneForm.originPhone"></el-input>
                    </el-form-item>
                    <el-form-item label="更换手机号" prop="currentPhone">
                        <div class="chengPhoneItemCon">
                            <el-input v-model="changePhoneForm.currentPhone"></el-input>
                            <el-button type="primary" class="sendSms2Btn" @click.native="sendSms2">获取验证码</el-button>
                        </div>
                    </el-form-item>
                    <el-form-item label="新手机号短信验证码" prop="currentPhoneSms">
                        <el-input v-model="changePhoneForm.currentPhoneSms"></el-input>
                    </el-form-item>
                </el-form>
            </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="cancelChangePhone('changePhoneForm')">取 消</el-button>
            <el-button type="primary" @click="confirmChangePhone('changePhoneForm')">确 定</el-button>
          </span>
        </el-dialog>
        
    </div>
</template>
<script>
    import { mapGetters } from 'vuex';
    export default {
        data() {
            let validateOriginPhone = (rule, value, callback) => {
                if( value == '' ){
                    callback(new Error('短信验证码不能为空'));
                }else{
                    if( value.length>6 ){
                        callback(new Error('短信验证码长度在1-6位之间'));
                    }else{
                        let reg1 = /[^0-9a-zA-Z]/g;
                        if( reg1.test(value) ){
                            callback(new Error('请输入正确的短信验证码'));
                        }else{
                            callback();
                        }
                    }
                }
            };
            let validateCurrentPhone = (rule, value, callback) => {
                if( value == '' ){
                    callback(new Error('手机号不能为空'));
                }else{
                    if( value.length != 11 ){
                        callback(new Error('手机号长度在11位'));
                    }else{
                        let reg1 = /^[1]([3-9])[0-9]{9}$/;
                        if( reg1.test(value) ){
                            callback();
                        }else{
                            callback(new Error('请输入正确的手机号'));
                        }
                    }
                }
            };
            let validateCurrentPhoneSms = (rule, value, callback) => {
                if( value == '' ){
                    callback(new Error('短信验证码不能为空'));
                }else{
                    if( value.length>6 ){
                        callback(new Error('短信验证码长度在1-6位之间'));
                    }else{
                        let reg1 = /[^0-9a-zA-Z]/g;
                        if( reg1.test(value) ){
                            callback(new Error('请输入正确的短信验证码'));
                        }else{
                            callback();
                        }
                    }
                }
            };
            return {
                changePhoneVisible:false,
                name: 'admin',
                getPhone:'12345678901',
                username:'',
                changePhoneForm:{
                    originPhone:'',
                    currentPhone:'',
                    currentPhoneSms:'',
                },
                changePhoneRules:{
                    originPhone:[{ validator: validateOriginPhone, trigger: 'blur',required:true }],
                    currentPhone:[{ validator: validateCurrentPhone, trigger: 'blur',required:true }],
                    currentPhoneSms:[{ validator: validateCurrentPhoneSms, trigger: 'blur',required:true }],
                },
            }
        },
        filters:{
            encryptionPhone(value){
                if( value ){
                    let first = value.substring(0,3);
                    let sec = value.substring(7,11);
                    return `${first}****${sec}`
                }else{
                    return '暂无';
                }
            },
        },
        computed: {
            ...mapGetters({
                collapse:'getCollapse',
            })
        },
        mounted(){
            this.setCollapse();
            this.getStorageData();
        },
        methods:{
            getStorageData(){
                let sessionGet = sessionStorage.getItem('username');
                this.username = sessionGet?sessionGet:this.name;
            },
            cancelChangePhone(form){
                this.changePhoneVisible = false;
                this.$refs[form].resetFields();
            },
            confirmChangePhone(form){
                this.$refs[form].validate((valid) => {
                    if (valid) {
//                        this.changePhoneVisible = false;
                        
                    } else {
                        this.$message.error('请检查表单');
                        return false;
                    }
                });
            },
            setCollapse(){
                if(document.body.clientWidth < 1366){
                    this.collapseChage();
                }
            },
                sendSms1(){
                    console.log( '获取验证码' );
                },
            handleCommand(command) {
                if(command == 'loginout'){
                    sessionStorage.clear();
                    localStorage.clear();
                    this.$router.push({ path: '/login' })
                }
                if(command == 'accountSet'){
                   this.accountSet();
                }
            },
            collapseChage(){
                if( this.collapse ){
                    this.$store.commit('changeCollapse',false);
                }else{
                    this.$store.commit('changeCollapse',true);
                }
            },   
                accountSet(){
                    this.changePhoneVisible = true;
                },
        },        
    }
</script>
<style scoped lang="scss">
    .header {
        position: relative;
        box-sizing: border-box;
        width: 100%;
        height: 70px;
        font-size: 22px;
        color: #fff;
        .logo{
            float: left;
            width:250px;
            line-height: 70px;
        }
        .collapse-btn{
            float: left;
            padding: 0 21px;
            cursor: pointer;
            line-height: 70px;
        }
        .header-right{
            float: right;
            padding-right: 50px;
        }
        .header-user-con{
            display: flex;
            height: 70px;
            align-items: center;
        }
        .user-name{
            margin-left: 10px;
            font-size: 16px;
        }
        .phoneItemCon {
            display: flex;
            justify-content:space-between;
            align-content: center;
            align-items: center;
        }
        .chengPhoneItemCon {
            display: flex;
            justify-content: space-between;
            align-content: center;
            align-items: center;
            .sendSms2Btn {
                margin-left: 20px;
            }
        }
    }
    .el-dropdown-link{
        color: #fff;
        cursor: pointer;
    }
    .el-dropdown-menu__item{
        text-align: center;
    }
</style>
<style lang="scss">
    .header {
        .changePhoneDialog {
            .el-dialog {
                height: 450px;
                width: 500px;
                position: absolute;
                left: 0;
                right: 0;
                top: 0;
                bottom: 0;
                margin: auto !important;
            }
        }
    }
</style>