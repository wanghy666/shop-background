<template>
    <div id="sale">
        <el-row :gutter="20">
            <el-col :span="12">
                <div class="grid-content bg-purple">
                    <div class="head">
                        <span>销售情况统计</span>
                        <span>需要关注的店铺信息及待处理事项</span>
                    </div>
                    <ul class="content">
                        <li>
                            <div class="left">昨日销量</div>
                            <div class="right">
                                <div class="rightTop">
                                    <span>订单金额(元)</span>
                                    <span>12</span>
                                </div>
                                <div>
                                    <span>订单量(件)</span>
                                    <span>12</span>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div class="left">本月销量</div>
                            <div class="right">
                                <div class="rightTop">
                                    <span>订单金额(元)</span>
                                    <span>12</span>
                                </div>
                                <div>
                                    <span>订单量(件)</span>
                                    <span>12</span>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </el-col>
            <el-col :span="12">
                <div class="grid-content bg-purple">
                    <div class="head">
                        <span>单品销售排名</span>
                        <span>需要关注的店铺信息及待处理事项</span>
                    </div>
                    <div class="content">
                        <el-table
                            :data="tableData"
                            border
                            height="170"
                            style="width: 100%">
                            <el-table-column
                                fixed
                                prop="date"
                                label="#"
                                width="50">
                            </el-table-column>
                            <el-table-column
                                prop="name"
                                label="商品信息"
                                width="432">
                            </el-table-column>
                            <el-table-column
                                prop="address"
                                label="销量">
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
    name:"sale",
    data(){
        return{
            tableData: [{
                date: '1',
                name: '小天鹅',
                address: '9'
                }, {
                date: '2',
                name: '小天鹅',
                address: '9'
                }, {
                date: '3',
                name: '小天鹅',
                address: '9'
                }, {
                date: '4',
                name: '小天鹅',
                address: '9'
            }]
        }
    }
}
</script>

<style lang="less" scoped>
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
        border:2px solid #dfe2e6;
        border-radius: 4px;
        min-height: 36px;

        .head{
            width:586px;
            height:61px;
            border-bottom: 2px solid #eceef5;
            display: flex;
            justify-content: space-between;
            padding:15px;

            span:first-child{
                font-size:16px;
                color:#303133;
            }
            span:last-child{
                font-size:14px;
                font-weight: 500;
                color:#008080;
            }
        }
        .content{
            width:586px;
            height:204px;
            padding:20px;
            margin:0;
            list-style: none;

            li{
                width:543px;
                height:74px;
                border:2px solid #dfe2e6;
                display: flex;
                &:last-child{
                    margin-top:20px;
                }

                .left{
                    width:97px;
                    height:70px;
                    border-right:2px solid #dfe2e6;
                    background:#f8f9fa;
                    text-align: center;
                    font:16px/70px "微软雅黑";
                }
                .right{
                    width:442px;
                    height:72px;
                    .rightTop{
                        height:35px;
                        border-bottom:2px solid #dfe2e6;
                    }
                    span{
                        font:16px/35px "微软雅黑";
                        padding-left:20px;
                    }
                }
            }
        }
    }
    .row-bg {
        padding: 10px 0;
        background-color: #f9fafc;
    }
</style>
