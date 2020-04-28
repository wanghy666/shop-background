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
        <el-form-item>
          <el-button
            @click="onLogin"
            class="text-white"
            style="background-color:teal;width:100%"
            :loading="isLoading"
          >立即登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import { mapState } from "vuex";
import { stat } from "fs";
export default {
  data() {
    return {
      isLoading: false,
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
      this.$refs.ruleForm.validate(e => {
        //!e返回的结果为false，表示当前校验未通过
        if (!e) {
          return;
        }
        this.isLoading = true;
        this.axios
          .post("/admin/login", {
            username: this.ruleForm.username,
            password: this.ruleForm.password
          })
          .then(res => {
            let { data } = res.data;
            console.log(data);
            this.isLoading = false;
            //存储用户信息(vuex+本地存储)
            this.$store.commit("login", data);
            //存储导航菜单
            this.$store.commit("createMenuTree", data.tree);
            //存储用户角色
            if (data.role && data.role.rules.length > 0) {
              let rules = data.role.rules;
              localStorage.setItem("rules", JSON.stringify(rules));
            }
            //路由跳转
            this.$router.push({ name: "index" });
            // 成功提示
            this.$message({
              message: "登陆成功",
              type: "success",
              duration: 1000
            });
          });
      });
    }
  }
};
</script>
<style lang="less" scope>
</style>