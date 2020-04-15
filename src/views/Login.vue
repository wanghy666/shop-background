<template>
  <div class="login">
    <el-card style="width:40%;margin:auto;margin-top:100px">
      <div slot="header" class="clearfix">
        <h1 class="text-muted" style="text-align:center">SHOP_ADMIN</h1>
      </div>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
        <el-form-item prop="username">
          <el-input v-model="ruleForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="ruleForm.password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-button
            @click="onLogin"
            class="text-white"
            style="background-color:teal;width:100%"
          >立即登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      ruleForm: {
        username: "",
        password: ""
      },
      rules: {
        username: [
          { required: true, message: "用户名不能为空", trigger: "blur" },
          { min: 3, message: "用户名至少有3个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          { min: 3, message: "用户名至少有3个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    onLogin() {
      this.$router.push("/index");
    }
  }
};
</script>
<style lang="less" scope>
</style>