<template>
    <div class="login_wrapper">
        <div class="login">
            <el-form :model="formLogin" :rules="rules" ref="ruleForm">
                <el-form-item>
                    <h2 class="title">后台管理系统</h2>
                </el-form-item>
                <el-form-item prop="username">
                    <el-input v-model="formLogin.username" placeholder="账号"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input  type="password" v-model="formLogin.password"  placeholder="密码"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="login">登录</el-button>
                    <span v-show="this.errorInfo.isShowError" class='error'>
                        {{this.errorInfo.text}}
                    </span>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
export default {
    name: 'login',
    data() {
        return {
            formLogin: {
                username: '',
                password: ''
            },
            errorInfo: {
                text: '登陆失败,请重试',
                isShowError: false
            },
          rules:{
              username: [{required:true,trigger:'blue',message:'请输入用户名'}],
              password: [{required:true,trigger:'blue',message:'请输入密码'}]
          }
        }
    },
    mounted() {
        this.clearAction();
        this.bindEnter();
    },
    methods: {
        clearAction(){
            this.$store.commit('changeMenuIndex','1-1');
            sessionStorage.clear();
            localStorage.clear();
        },
        bindEnter(){
            document.onkeydown = (event) => {
                var router=this.$route.path;
                var e = event || window.event || arguments.callee.caller.arguments[0];
                if (e && e.keyCode == 13&&this.$route.path=='/login') { // enter 键 
                    this.login();
                }
            };
        },
        login() {
            const param  = {
                username:`${this.formLogin.username},6`,
                password:this.formLogin.password
            }
            this.$refs['ruleForm'].validate((valid) => {
                if(valid){
                    this.Apis.shiroApi.loginIn(param).then(res=>{
                        if(res.data){
                            let respCode = res.data.respCode;
                            if(respCode==0){
                                sessionStorage.setItem("token",res.headers.authorization);
                                this.$router.push({name: 'InfoManage'});
                                if( /gonggao/.test(this.formLogin.username) ){
                                    sessionStorage.setItem('identity','1');
                                    this.$store.commit('changeMenuIndex','3-1');
                                }else{
                                    sessionStorage.setItem('identity','0');
                                }                                
                            }else{
                                this.errorInfo.isShowError=true
                                this.errorInfo.text=res.data.errorMsg
                            }
                        }
                    }).catch(err=>{
                        console.log('err',err);
                        this.$message.error(err.errorMsg);
                    })
                }
            })
        }
    }
}
</script>
<style lang="scss" scoped>
$input_width:300px;
.login_wrapper {
    height: 100%;
    background-image: url(../assets/th.jpeg);
    background-position: center;
    background-repeat: no-repeat;
    background-size:cover;
    display: flex;
    align-items: center;
    justify-content: center;
    .login {
        background-color: #fff;
        width: 460px;
        height: 296px;
        border: 1px solid #eaeaea;
        box-shadow: 0 0 25px #cac6c6;
        .title {
            text-align: center;
            color: #505458;
        }
        .el-form-item__content {
            width: $input_width;
        }
        .el-button {
            width: $input_width;
        }
        .el-form {
            margin: 30px 80px auto 80px;
            .error {
                display: block;
                text-align: center;
                color: red;
            }
        }
    }
}
</style>