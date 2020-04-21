<template>
  <div id="shop">
    <div class="head">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">后台首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content">
      <ul>
        <li>全部</li>
        <li>审核中</li>
        <li>出售中</li>
        <li>已下架</li>
        <li>库存预警</li>
        <li>回收站</li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name:"shop",
  data(){
    return{}
  }
}
</script>

<style lang="less" scoped>
.head{
  height:55px;
  border-bottom:1px solid #eceef5;
  padding:20px;
}
.content{
  margin:0 20px;
  height:40px;
  border-bottom:2px solid #eceef5;

  ul{
    padding:0;
    margin:0;
    list-style: none;
    display: flex;


    li{
      font:14px/40px "微软雅黑";
      font-weight: 500;
      color:#303133;
      padding:0 20px;
    }
  }
}
</style>