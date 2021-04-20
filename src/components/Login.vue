<template>
    <div class="login_container">
        <div class="login_box">
            <!--图标区域-->
            <div class="logo_box">
                <img src="../assets/storm.png">
            </div>
            <!--登陆表单区域-->
            <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="80px" class="login_from">
                <!--用户名-->
                <el-form-item prop="username">
                    <el-input v-model="loginForm.username" prefix-icon="el-icon-user"></el-input>
                </el-form-item>
                <!--密码-->
                <el-form-item prop="password">
                    <el-input v-model="loginForm.password" prefix-icon="el-icon-lock" type="password"></el-input>
                </el-form-item>
                <!--按钮区域-->
                <el-form-item class="btns">
                    <el-button type="primary" @click="login">登录</el-button>
                    <el-button type="info" @click="register">注册</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            //登陆表单数据访问对象
            loginForm: {
                username: '',
                password: ''
            },
            //表单验证规则对象
            loginFormRules: {
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入用户密码', trigger: 'blur' },
                    { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        login () {
            this.$refs.loginFormRef.validate(async valid => {
                if (!valid) return;
                const {data: res} = await this.$http.post('cloud-user-service/user/login', this.loginForm);
                console.log(res);
                if (res.code !== 200) return this.$message.error('登录失败')
                this.$message.success('登录成功');
                window.sessionStorage.setItem('token', res.data.token_type + " " + res.data.access_token);
                window.sessionStorage.setItem('username', this.loginForm.username);
                window.sessionStorage.setItem('path', "/" + this.loginForm.username);
                this.$router.push('/home');
            });
        },
        register () {
            this.$router.push('/register');
        }
    }
} 
</script>

<style lang='less' scoped>
.login_container {
    background-color: #2b4b6b;
    height: 100%;
}
.login_box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    .logo_box {
        width: 130px;
        height: 130px;
        border: 1px solid #eee;
        border-radius: 50%;
        padding: 10px;
        box-shadow: 0 0 10px;
        position: absolute;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #fff;
        img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background-color: #eee;
        }
    }
}
.login_from {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
    transform: translate(-10%);
}
.btns {
    display: flex;
    justify-content: flex-end;
}
</style>
