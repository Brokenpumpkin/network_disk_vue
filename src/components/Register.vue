<template>
  <div class="register_container">
      <div class="register_box">
        <!--注册表单区域-->
            <el-form ref="registerFormRef" :model="registerForm" :rules="registerFormRules" label-width="80px" class="register_from">
                <!--用户名-->
                <el-form-item prop="username">
                    <el-input v-model="registerForm.username" prefix-icon="el-icon-user"></el-input>
                </el-form-item>
                <!--手机号码-->
                <el-form-item prop="phone">
                    <el-input v-model="registerForm.phone" prefix-icon="el-icon-mobile-phone"></el-input>
                </el-form-item>
                <!--手机号码-->
                <el-form-item prop="email">
                    <el-input v-model="registerForm.email" prefix-icon="el-icon-message"></el-input>
                </el-form-item>
                <!--密码-->
                <el-form-item prop="password">
                    <el-input v-model="registerForm.password" prefix-icon="el-icon-lock" show-password></el-input>
                </el-form-item>
                <!--按钮区域-->
                <el-form-item class="btns">
                    <el-button type="primary" @click="register">注册</el-button>
                </el-form-item>
            </el-form>
      </div>
  </div>
</template>

<script>
var checkEmail = (rule, value, callback) => {
  const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
  if (!value) {
    return callback(new Error('邮箱不能为空'))
  }
  setTimeout(() => {
    if (mailReg.test(value)) {
      callback()
    } else {
      callback(new Error('请输入正确的邮箱格式'))
    }
  }, 100)
}

var checkPhone = (rule, value, callback) => {
  const mailReg = /^1[34578]\d{9}$/
  if (!value) {
    return callback(new Error('手机号码不能为空'))
  }
  setTimeout(() => {
    if (mailReg.test(value)) {
      callback()
    } else {
      callback(new Error('请输入正确的手机号码'))
    }
  }, 100)
}

export default {
  data () {
      return {
          //注册表单数据访问对象
          registerForm: {
              username: '',
              password: '',
              email: '',
              level: '1',
              phone: '',
              alias: ''
          },
          //表单验证规则对象
          registerFormRules: {
              username: [
                  { required: true, message: '请输入用户名', trigger: 'blur' },
                  { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
              ],
              password: [
                  { required: true, message: '请输入用户密码', trigger: 'blur' },
                  { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' }
              ],
              phone: [
                  { required: true, message: '请输入用户手机号码', trigger: 'blur' },
                  { validator: checkPhone, trigger: 'change'}
              ],
              email: [
                  { required: true, message: '请输入用户邮箱', trigger: 'blur' },
                  { validator: checkEmail, trigger: 'change'}
              ]
          }
      }
  },
  methods: {
    register () {
      this.$refs.registerFormRef.validate(async valid => {
          if (!valid) return;
          const {data: res} = await this.$http.post('cloud-user-service/user/register', this.registerForm);
          console.log(res);
          if (res.code !== 200) return this.$message.error('注册失败')
          this.$message.success('注册成功');
          this.$router.push('/login');
      });
    }
  }
}
</script>

<style lang='less' scoped>
.register_container {
    background-color: #2b4b6b;
    height: 100%;
}
.register_box {
    width: 450px;
    height: 350px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}
.register_from {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
    transform: translate(-10%);
}
</style>