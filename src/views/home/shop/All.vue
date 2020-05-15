<template>
    <div id="all">
        <div class="title">
            <div class="left">
                <div class="one">发布商品</div>
                <div class="two">批量删除</div>
                <div class="three">上架</div>
                <div class="four">下架</div>
            </div>
            <div class="right">
                <input type="text" placeholder="要搜索的商品名称" class="goods"/>
                <div class="search">搜索</div>
                <div class="senior">高级搜索</div>
            </div>
        </div>
        <div class="content">
            <el-table
                class="table"
                border
                height="508"
                ref="multipleTable"
                :data="tableData"
                tooltip-effect="dark"
                style="width: 100%"
                :row-style="{height:'110px'}"
                @selection-change="handleSelectionChange"
            >
                <el-table-column
                    type="selection"
                    width="55"
                >
                </el-table-column>
                <el-table-column
                    prop="shop"
                    label="商品"
                    width="300"
                >
                    <template 
                        slot-scope="scope"
                    >
                        <div style="display:flex">
                            <div style="margin-right:16px">
                                <img :src="scope.row.cover"/>
                            </div>   
                            <div style="font-size:14px">
                                <div style="margin-bottom:16px;">{{ scope.row.title }}</div>
                                <div>分类:{{ scope.row.category_id }}</div> 
                                <div>时间:{{ scope.row.create_time }}</div>
                            </div>
                        </div>                                           
                    </template>
                </el-table-column>
                <el-table-column
                    prop="SalesVolume"
                    label="实际销量"
                    width="70"
                >
                    <template
                        slot-scope="scope"
                    >
                        {{scope.row.name}}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="goodsState"
                    label="商品状态"
                    width="70"
                    show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column
                    prop="examine"
                    label="审核状态"
                    width="120"
                >
                </el-table-column>
                <el-table-column
                    prop="stock"
                    label="总库存"
                    width="90"
                >
                </el-table-column>
                <el-table-column
                    prop="price"
                    label="价格(元))"
                    width="120"
                >
                </el-table-column>
                <el-table-column
                    prop="operation"
                    label="操作"
                    width="392"
                >
                </el-table-column>
            </el-table>
            <!-- <div style="margin-top: 20px">
                <el-button @click="toggleSelection([tableData[1], tableData[2]])">切换第二、第三行的选中状态</el-button>
                <el-button @click="toggleSelection()">取消选择</el-button>
            </div> -->
        </div>
    </div>
</template>

<script>
export default {
    name:"all",
    data() {
      return {
        tableData: [{
          create_time: '2016-05-03',
          title: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-02',
          title: '王二小',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          title: '王小明',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-01',
          title: '王小花',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-08',
          title: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-06',
          title: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-07',
          title: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }],
        multipleSelection: []
      }
    },
    created(){
        this.init()
    },
    methods: {
        //初始化数据
        init(){
            this.loading = true;
            this.axios
            .get(`/admin/goods/1`,{ token: true })
            .then( res=>{
                console.log(res.data.data)
                this.tableData = res.data.data.list
            })
            .catch()
        },
    //   toggleSelection(rows) {
    //     if (rows) {
    //       rows.forEach(row => {
    //         this.$refs.multipleTable.toggleRowSelection(row);
    //       });
    //     } else {
    //       this.$refs.multipleTable.clearSelection();
    //     }
    //   },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      }
    },
    mounted(){
        console.log(123)
    }
}
</script>

<style lang="less" scoped>
    #all{
    
        .title{
            height:28px;
            margin:20px 0;
            display: flex;
            justify-content: space-between;

            .left{
                display: flex;
                text-align: center;
                font:12px/28px "微软雅黑";
                font-weight: 500;
                .one{
                    width:80px;
                    height:28px;
                    background:#67C23A; 
                    border-radius: 3px;  
                    margin-right:10px; 
                    color:#fff;            
                }
                .two{
                    width:80px;
                    height:28px;
                    background:#F56C6C;
                    border-radius: 3px;
                    margin-right:10px;
                    color:#fff;
                }
                .three{
                    width:56px;
                    height:28px;
                    border:1px solid #dddfe6;
                    border-radius: 3px;
                    margin-right:10px;
                    color:#616266;
                }
                .four{
                    width:56px;
                    height:28px;
                    border:1px solid #dddfe6;
                    border-radius: 3px;
                    color:#616266;
                }
            }
            .right{
                display: flex;
                .goods{
                    width:150px;
                    height:28px;
                    border-radius: 3px;
                    border:1px solid #dddfe6;
                    padding:0 15px;
                    font-size:13px;
                    color:#dddfe6;
                }
                .search{
                    width:56px;
                    height:28px;
                    background:#919399;
                    color:#fff;
                    border-radius: 3px;
                    font:13px/28px "微软雅黑";
                    text-align: center;
                    margin-left:10px;
                }
                .senior{
                    width:80px;
                    height:28px;
                    text-align: center;
                    font:13px/28px "微软雅黑";
                    border-radius: 3px;
                    color:#616266;
                    margin-left:10px;
                    border:1px solid #dddfe6;
                }
            }
        }
        .content{
            // .shopp{
            //     display: flex;
               img{
                    width:60px;
                    height:60px;
                }
                
            // }
            
        }
    }
    
</style>
