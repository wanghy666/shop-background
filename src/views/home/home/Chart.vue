<template>
    <div id="chart">
        <div class="Tips">
            <ul>
                <li>
                    <div class="head">
                        <span>店铺及商品提示</span>
                        <span>需要关注的店铺信息及待处理事项</span>
                    </div>
                    <ul class="content" :shop='shop'>
                        <li>
                            <div class="num">{{shop.saleing}}</div>
                            <div class="state">出售中</div>
                        </li>
                        <li>
                            <div class="num">{{shop.reply}}</div>
                            <div class="state">待回复</div>
                        </li>
                        <li>
                            <div class="num">{{shop.warning}}</div>
                            <div class="state">库存预警</div>
                        </li>
                        <li>
                            <div class="num">{{shop.warehouse}}</div>
                            <div class="state">仓库中</div>
                        </li>
                    </ul>
                </li>
                <li>
                    <div class="head">
                        <span>交易提示</span>
                        <span>需要立即处理的交易订单</span>
                    </div>
                    <ul class="content2" :tips="tips">
                        <li>
                            <div class="num">{{tips.waitPay}}</div>
                            <div class="state">待付款</div>
                        </li>
                        <li>
                            <div class="num">{{tips.waitDelivery}}</div>
                            <div class="state">待发货</div>
                        </li>
                        <li>
                            <div class="num">{{tips.delivering}}</div>
                            <div class="state">已发货</div>
                        </li>
                        <li>
                            <div class="num">{{tips.receivingGoods}}</div>
                            <div class="state">已收货</div></li>
                        <li>
                            <div class="num">{{tips.refunding}}</div>
                            <div class="state">退款中</div>
                        </li>
                        <li>
                            <div class="num">{{tips.service}}</div>
                            <div class="state">待售后</div>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
        <div class='Echarts' style="width:590px;height:370px;padding:20px 30px;"></div>
    </div>
</template>

<script>
export default {
    name:"chart",
    data(){
        return{
            shop:{
                saleing:64,
                reply:10,
                warning:0,
                warehouse:3
            },
            tips:{
                waitPay:7,
                waitDelivery:10,
                delivering:5,
                receivingGoods:3,
                refunding:2,
                service:4
            }
        }
    },
    mounted(){
       this.initecharts()
    },
    methods:{
        initecharts(){
            let myEcharts = this.$echarts.init(document.querySelector(".Echarts"))
            myEcharts.setOption({
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#6a7985'
                        }
                    }
                },
                legend: {
                    data: ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎']
                },
                toolbox: {
                    feature: {
                        saveAsImage: {}
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ],
                series: [
                    {
                        name: '邮件营销',
                        type: 'line',
                        stack: '总量',
                        areaStyle: {},
                        data: [120, 132, 101, 134, 90, 230, 210]
                    },
                    {
                        name: '联盟广告',
                        type: 'line',
                        stack: '总量',
                        areaStyle: {},
                        data: [220, 182, 191, 234, 290, 330, 310]
                    },
                    {
                        name: '视频广告',
                        type: 'line',
                        stack: '总量',
                        areaStyle: {},
                        data: [150, 232, 201, 154, 190, 330, 410]
                    },
                    {
                        name: '直接访问',
                        type: 'line',
                        stack: '总量',
                        areaStyle: {},
                        data: [320, 332, 301, 334, 390, 330, 320]
                    },
                    {
                        name: '搜索引擎',
                        type: 'line',
                        stack: '总量',
                        label: {
                            normal: {
                                show: true,
                                position: 'top'
                            }
                        },
                        areaStyle: {},
                        data: [820, 932, 901, 934, 1290, 1330, 1320]
                    }
                ]
            })
        }
    }
}
</script>

<style lang="less" scoped>
#chart{
    margin-bottom: 20px;
    display: flex;

    .Tips{
        width:590px;
        height:370px;
        margin-right:20px;

        ul{
            margin:0;
            padding:0;
            list-style: none;

            li{
                width:590px;
                height:176px;
                border:2px solid #dfe2e6;
                &:last-child{
                    margin-top:20px;
                }

                .head{
                    width:588px;
                    height:61px;
                    padding:18px 20px;
                    display: flex;
                    justify-content: space-between;
                    border-bottom:2px solid #dfe2e6;

                    span:first-child{
                        color:#303133;
                        font-size:16px;
                    }
                    span:last-child{
                        font-size: 14px;
                        font-weight: 600;
                        color:#377e7f;
                    }
                }
                .content{
                    height:110px;
                    padding:20px;
                    margin:0;
                    list-style: none;
                    display: flex;
                    justify-content: space-between;

                    li{
                        width:113px;
                        height:70px;
                        border:0;
                        background:#f8f9fa;
                        &:last-child{
                            margin-top:0px;
                        }

                        .num{
                            font-size:24px;
                            font-weight: 600;
                            margin-top:4px;
                            text-align: center;
                        }
                        .state{
                            font-size:12px;
                            color:#6e757c;
                            text-align: center;

                        }
                    }
                }
                .content2{
                    height:110px;
                    padding:20px;
                    margin:0;
                    list-style: none;
                    display: flex;
                    justify-content: space-between;

                    li{
                        width:65px;
                        height:70px;
                        padding:6px 12px;
                        border:0;
                        background:#f8f9fa;
                        margin-top:0;
                        &:last-child{
                            margin-top:0px;
                        }
                        .num{
                            font-size:24px;
                            font-weight: 600;
                            margin-top:4px;
                            text-align: center;
                        }
                        .state{
                            font-size:12px;
                            color:#6e757c;
                            text-align: center;

                        }
                    }
                }
            }
        }
    }
    .Echarts{
        border:2px solid #dfe2e6;
        border-radius: 4px;
    }
}
</style>
