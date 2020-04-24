<template>
  <div>
    <el-container>
      <!-- 一级导航 -->
      <el-header class="header-wrap">
        <p class="text-white h4">APP_ADMIN</p>
        <el-menu
          :default-active="topActiveIndex"
          class="el-menu-demo"
          mode="horizontal"
          @select="handleSelect"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          <el-menu-item
            :index="item.index"
            v-for="(item) in topMenuList"
            :key="item.index"
          >{{item.name}}</el-menu-item>
          <el-submenu index="100">
            <template slot="title">
              <el-avatar
                size="small"
                :src="user.avatar?'user.avatar':'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'"
                class="mr-1"
              ></el-avatar>
              <span class="userName">{{user.username}}</span>
            </template>
            <el-menu-item index="100-1">修改</el-menu-item>
            <el-menu-item index="100-2">退出</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-header>
      <el-container class="container-wrap">
        <!-- 左侧二级导航 -->
        <el-aside width="200px">
          <el-menu
            :default-active="leftActiveIndex"
            class="el-menu-vertical-demo"
            @select="handleSelectLeftMenu"
            @open="handleOpen"
            @close="handleClose"
          >
            <el-menu-item :index="item.index" v-for="item in leftMenuList" :key="item.index">
              <i :class="item.icon"></i>
              <span slot="title">{{item.name}}</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <!-- 主体内容 -->
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { stat } from "fs";
export default {
  name: "Layout",
  data() {
    return {
      topActiveIndex: "0", //顶部一级导航选中索引（从0开始计算）
      //   leftActiveIndex: "1", //左侧二级导航选中索引
      topMenuList: [
        {
          index: "0",
          name: "首页",
          subMenuIndex: "0",
          subMenuList: [
            {
              index: "0",
              name: "后台首页",
              icon: "el-icon-menu",
              pathName: "/index"
            },
            {
              index: "1",
              name: "相册管理",
              icon: "el-icon-document",
              pathName: "/image"
            },
            {
              index: "2",
              name: "商品列表",
              icon: "el-icon-setting",
              pathName: "/goods"
            }
          ]
        },
        {
          index: "1",
          name: "商品",
          subMenuIndex: "0",
          subMenuList: [
            {
              index: "0",
              name: "商品列表",
              icon: "el-icon-menu",
              pathName: "/goods"
            },
            {
              index: "1",
              name: "分类列表",
              icon: "el-icon-document",
              pathName: "/category"
            }
            // { index: "2", name: "商品规格", icon: "el-icon-setting" },
            // { index: "3", name: "商品类型", icon: "el-icon-menu" },
            // { index: "4", name: "商品评论", icon: "el-icon-document" }
          ]
        },
        {
          index: "2",
          name: "订单",
          subMenuIndex: "0",
          subMenuList: [
            // { index: "0", name: "订单管理", icon: "el-icon-menu" },
            // { index: "1", name: "发票管理", icon: "el-icon-document" },
            // { index: "2", name: "售后服务", icon: "el-icon-setting" }
          ]
        },
        {
          index: "3",
          name: "会员",
          subMenuIndex: "0",
          subMenuList: [
            // { index: "0", name: "会员列表", icon: "el-icon-menu" },
            // { index: "1", name: "会员等级", icon: "el-icon-document" }
          ]
        },
        {
          index: "4",
          name: "设置",
          subMenuIndex: "0",
          subMenuList: [
            // { index: "0", name: "基础设置", icon: "el-icon-menu" },
            // { index: "1", name: "物流设置", icon: "el-icon-document" },
            // { index: "2", name: "管理员设置", icon: "el-icon-setting" },
            // { index: "3", name: "交易设置", icon: "el-icon-setting" }
          ]
        }
      ]
    };
  },
  computed: {
    ...mapState({
      user: state => state.user
    }),
    //当前页的左侧菜单数据
    leftMenuList() {
      return this.topMenuList[this.topActiveIndex].subMenuList || [];
    },
    //当前页的左侧索引
    // leftActiveIndex() {
    //   return this.topMenuList[this.topActiveIndex].subMenIndex || "0";
    // }
    leftActiveIndex: {
      get() {
        return this.topMenuList[this.topActiveIndex].subMenuIndex || "0";
      },
      set(val) {
        this.topMenuList[this.topActiveIndex].subMenuIndex = val;
      }
    }
  },
  created() {
    //刷新后从本地存储中获取当前的顶部和侧边导航索引
    this.topActiveIndex = localStorage.getItem("top") || "0";
    this.leftActiveIndex = localStorage.getItem("left") || "0";
  },
  methods: {
    //点击切换顶部一级导航
    handleSelect(key) {
      if (key === "100-1") {
        return console.log("修改");
      } else if (key === "100-2") {
        return this.onLogout();
      }
      //1.获取当前顶部导航索引
      this.topActiveIndex = key;
      localStorage.setItem("top", this.topActiveIndex);
      //2.页面路由跳转
      if (this.leftMenuList.length === 0) return;
      this.$router.push(this.leftMenuList[this.leftActiveIndex].pathName);
    },
    //退出
    onLogout() {
      this.axios
        .post(
          "/admin/logout",
          {},
          {
            headers: {
              token: this.user.token
            }
          }
        )
        .then(res => {
          //修改vuex状态，清空本地存储
          this.$store.commit("logout");
          //成功提示
          this.$message.success("退出成功");
          //路由跳转
          this.$router.push("/login");
        })
        .catch(err => {
          //防止出现token过期出现的错误捕获，清除数据，路由跳转
          this.$store.commit("logout");
          this.$router.push("/login");
        });
    },
    //点击切换左侧导航
    handleSelectLeftMenu(key) {
      //获取左侧导航的索引
      this.leftActiveIndex = key;
      localStorage.setItem("left", this.leftActiveIndex);
      //路由跳转
      this.$router.push(this.leftMenuList[key].pathName);
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    }
  }
};
</script>

<style lang="less" scoped>
.header-wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: rgb(84, 92, 100);
}
.container-wrap {
  height: calc(100vh - 60px);
  .el-aside {
    height: 100%;
    border: 1px solid #eee;
  }
  /deep/.el-menu {
    border: none;
  }
}
/deep/.el-main {
  padding: 0;
}
</style>