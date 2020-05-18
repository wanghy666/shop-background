<template>
  <div style="padding:20px">
    <div class="d-flex flex-row-reverse">
      <search-box :isShowSupper="false" @search="searchHandle" class="mb-3"></search-box>
    </div>

    <el-table :data="tableData" border style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <div class="d-flex">
            <!-- 头像 -->
            <div class="mr-2">
              <img
                :src="props.row.user?props.row.user.avatar:''"
                alt
                style="width:40px;height:40px;border-radius:50%"
              >
            </div>
            <!-- 用户评价 -->
            <div class="d-flex flex-column" style="width:100%">
              <div class="d-flex align-items-center">
                <em class="font-weight-bold" style="font-size:16px">{{props.row.user.username}}</em>
                <span class="ml-2" style="line-height:16px">{{props.row.review_time}}</span>
              </div>
              <span>{{props.row.review.data}}</span>
              <img
                :src="item"
                alt
                v-for="(item,index) in props.row.review.image"
                :key="index"
                style="width:100px;height:100px"
              >
              <!-- 客服回复 -->
              <div style="background-color:#eee;margin-top:5px">
                <div style="color:#666" class="d-flex justify-content-between p-2">
                  <span class="font-weight-bold">客服</span>
                  <span>收起</span>
                </div>
                <span
                  class="ml-2"
                  v-for="(item,index) in props.row.extra"
                  :key="index"
                >{{item.data}}</span>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="id" label="id" width="60"></el-table-column>
      <el-table-column label="商品" width="250">
        <template slot-scope="scope">
          <div class="d-flex align-items-start">
            <img
              :src="scope.row.goods_item?scope.row.goods_item.cover:''"
              alt
              style="width:40px;height:40px"
            >
            <span class="ml-2">{{scope.row.goods_item?scope.row.goods_item.title:'-'}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="info" label="评价信息">
        <template slot-scope="scope">
          <div class="d-flex flex-column justify-content-around">
            <div>用户名：{{scope.row.user?scope.row.user.username:''}}</div>
            <div class="d-inline-flex">
              评分:
              <el-rate v-model="scope.row.rating"></el-rate>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="time" label="评价时间">
        <template slot-scope="scope">{{scope.row.review_time}}</template>
      </el-table-column>
      <el-table-column prop="isShow" label="是否显示" width="120" align="center">
        <template slot-scope="scope">
          <el-button
            :type="scope.row.status?'success':'danger'"
            plain
            @click="changeCommentState(scope.row)"
          >{{scope.row.status?'启用':'禁用'}}</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import searchBox from "@/components/searchBox.vue";
import { getCommentList, getEditComment } from "@/api/api";

export default {
  components: {
    searchBox
  },
  created() {
    this.init();
  },
  data() {
    return {
      page: 1,
      limit: 10,
      tableData: [],
      totalCount: 0,
      startValue: 1
    };
  },
  methods: {
    //请求评论列表
    init(title) {
      let url = `/admin/goods_comment/${this.page}`;
      let data = getCommentList(url, {
        limit: this.limit,
        title: title
      }).then(res => {
        let { data } = res.data;
        this.tableData = data.list;
        this.totalCount = data.totalCount;
      });
    },
    //搜索
    searchHandle(val) {
      this.init(val);
    },
    //修改评论状态
    changeCommentState(row) {
      let url = `/admin/goods_comment/${row.id}/update_status`;
      let status = "";
      if (row.status === 0) {
        status = 1;
      } else if (row.status === 1) {
        status = 0;
      }
      getEditComment(url, { status }).then(res => {
        this.$message.success("修改成功");
        this.searchHandle();
      });
    }
  }
};
</script>

<style lang="less" scoped>
</style>