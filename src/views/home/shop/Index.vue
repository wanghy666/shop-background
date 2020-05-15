<template>
  <div id="shop">
    <div class="head">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">后台首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content">
      <el-menu :default-active="activeIndex"  class="el-menu-demo" mode="horizontal" @select="handleSelect">
        <el-menu-item
        v-for="(item,index) in navlist"
        :key="index"
        :index="index.toString()"
        >
          <span>{{item.name}}</span>
        </el-menu-item>
      </el-menu>
      <router-view/>
    </div>
    <div class="bottom">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage4"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"
        >
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name:"shop",
  data(){
    return{
      navlist:[
        {
          path:'shop/goods/list/all',
          name:'全部'
        },{
          path:'shop/goods/list/examine',
          name:'审核中'
        },{
          path:'shop/goods/list/sale',
          name:'出售中'
        },{
          path:'shop/goods/list/offline',
          name:'已下架'
        },{
          path:'shop/goods/list/stock',
          name:'库存预警'
        },{
          path:'shop/goods/list/recovery',
          name:'回收站'
        }
      ],
      activeIndex: '0',
      currentPage4: 1,
      totalCount:19,
      limit:5
    }
  },
  created(){
    this.init()
  },
  methods:{
    init(){
      this.axios.get(`/admin/goods/1`,{ token: true })
      .then(res=>{
        this.totalCount = res.data.data.totalCount
      })
      .catch()
    },
    handleSelect(key, keyPath) {//导航栏
      console.log(key);
      for (let i in this.navlist){
        if(key == i){
          this.$router.push(`/${this.navlist[key].path}`)
        }
      }
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.limit = val
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
    }
  },
  components:{
   
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
  height:614px;

  .el-menu{
    padding:0;
    margin:0;
    list-style: none;
    display: flex;
    height:40px;
    border-bottom:2px solid #eceef5;

    .el-menu-item{
      height:38px;
      font:14px/38px "微软雅黑";
      font-weight: 500;
      color:#303133;
      padding:0 20px;
    }
  }
}
.bottom{
  height:60px;
  border-top:2px solid #dfe2e6;
  color:#616266;
  padding:10px;
  font-size:14px;
}
</style>