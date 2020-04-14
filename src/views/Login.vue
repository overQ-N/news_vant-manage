<template>
  <div class="container">
   <div class="login">
      <el-form :model="LoginForm" :rules="rules" ref="LoginFormRef">
      <el-form-item prop="username">
        <el-input placeholder="用户名" prefix-icon="el-icon-user" v-model="LoginForm.username"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          type="password"
          placeholder="密码"
          prefix-icon="el-icon-unlock"
          v-model="LoginForm.password"
          @change='submitForm'
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">登录</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
   </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 登录表单数据
      LoginForm: {
        username: '13800138000',
        password: ''
      },
      // 表单验证
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 11, message: '长度在 3 到 11 个字符', trigger: 'blur' }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 16,
            message: '长度3到16个字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    // 提交表单
    submitForm () {
      this.$refs.LoginFormRef.validate(async valid => {
        if (!valid) return false
        const { data: res } = await this.$axios.post('/login', this.LoginForm)
        if (res.statusCode !== 200) return this.$message.error('登录失败')
        console.log(res)
        if (res.data.user.role.type !== 'admin') {
          return this.$message.warning('当前用户没有权限，必须为管理员')
        }
        sessionStorage.setItem('news-vant', JSON.stringify(res.data))
        this.$router.push('/index')
        this.$message.success('登录成功')
      })
    },
    // 重置表单
    resetForm () {
      this.$refs.LoginFormRef.resetFields()
    }
  }
}
</script>
<style lang="less" scoped>
.container {
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: center;
  background: #242335;
  .login{
    width: 500px;
    height: 360px;
    display: flex;
    box-shadow: 1px 2px rgba(0,0,0,.4) 3px;
    border-radius:8px;
    justify-content: center;
    align-items: center;
    background: #9ebfcc;
    .el-form {
    width: 320px;
  }
  }

}
</style>
