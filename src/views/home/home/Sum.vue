<template>
   <div id="sum">
       <el-row :gutter="20">
            <el-col :span="6">
                <div class="grid-content bg-purple">
                    <div class="left"></div>
                    <div class="right" :nums="nums">
                        <div>{{nums.follow}}</div>
                        <div>关注人数(个)</div>
                    </div>
                </div>
            </el-col>
            <el-col :span="6">
                <div class="grid-content bg-purple">
                    <div class="left"></div>
                    <div class="right">
                        <div>{{nums.order}}</div>
                        <div>订单总数(笔)</div>
                    </div>
                </div>
            </el-col>
            <el-col :span="6">
                <div class="grid-content bg-purple">
                    <div class="left"></div>
                    <div class="right">
                        <div>{{nums.money}}</div>
                        <div>今日订单总金额(元)</div>
                    </div>
                </div>
            </el-col>
            <el-col :span="6">
                <div class="grid-content bg-purple">
                    <div class="left"></div>
                    <div class="right">
                        <div>{{nums.volume}}</div>
                        <div>本月销量(笔)</div>
                    </div>
                </div>
            </el-col>
        </el-row>
   </div> 
</template>

<script>
export default {
    name:'sum',
    data(){
        return{
            nums:{
                follow:30,
                order:120,
                money:4183.80,
                volume:100       
            }
        }
    }
}
</script>

<style lang="less" scoped>
#sum{
    margin-bottom:20px;
}
.el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #fff;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    width:280px;
    height:96px;
    padding:20px;
    border:2px solid #dfe2e6;
    border-radius: 4px;
    min-height: 36px;
    display: flex;

    .left{
        width:40px;
        height:40px;
        margin-right:16px;
        margin-top:5px;
        background:#337df7;
    }
    .right{

        div:first-child{
            height:40px;
            // font:40px/24px 600 "微软雅黑";
            font-size:24px;
            font-weight: 600;
            margin-top:-5px;
        }
        div:last-child{
            font-size:12px;
            color:#6e757c;
        }
    }
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
</style>
