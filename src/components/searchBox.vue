<template>
  <div class="search-wrap">
    <el-input v-model="searchValue" placeholder="请输入搜索关键词" style="width:150px" class="mr-2"></el-input>
    <el-button type="primary" @click="search">搜索</el-button>
    <el-button type="primary" plain @click="superSearch" v-if="isShowSupper">高级搜索</el-button>

    <el-card class="box-card" style="margin-top:10px" v-if="isShowCard">
      <div slot="header" style="margin:-8px 0">
        <span>高级搜索</span>
        <el-button
          style="float: right; padding: 3px 0"
          type="text"
          @click="isShowCard=!isShowCard"
        >收起</el-button>
      </div>
      <div>
        <el-form :inline="true" :model="searchForm" class="demo-form-inline">
          <el-form-item label="商品名称">
            <el-input v-model="searchForm.name" placeholder="请输入商品名称"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <el-cascader
              v-model="searchForm.category"
              :options="categoryList"
              :props="optionProps"
              @visible-change="chooseCategory"
            ></el-cascader>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="confirmSupperSearch">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" plain @click="clearSearch">清空筛选条件</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getCategoryList } from "@/api/api.js";
import { setTreeData } from "@/common/util.js";
export default {
  name: "searchBox",
  data() {
    return {
      searchValue: "",
      searchForm: {
        name: "",
        category: ""
      },
      categoryList: [],
      optionProps: {
        children: "child",
        label: "name",
        value: "id"
      },
      isShowCard: false //高级搜索卡片的展示状态
    };
  },
  props: {
    //是否展示高级搜索按钮
    isShowSupper: {
      type: Boolean,
      default: true
    }
  },

  methods: {
    setTreeData(data) {
      for (var i = 0; i < data.length; i++) {
        if (data[i].child.length < 1) {
          data[i].child = undefined;
        } else {
          this.setTreeData(data[i].child);
        }
      }
      return data;
    },
    //获取商品类型选选择器数据
    chooseCategory() {
      getCategoryList("/admin/category").then(res => {
        let data = res.data.data;
        this.categoryList = this.setTreeData(res.data.data);
      });
    },

    //进行普通搜索
    search() {
      this.$emit("search", this.searchValue);
    },
    //高级搜索
    superSearch() {
      this.isShowCard = !this.isShowCard;
    },
    //进行高级搜索
    confirmSupperSearch() {
      this.$emit("super-search", this.searchForm);
    },
    //清空搜索条件
    clearSearch() {
      this.searchForm.name = "";
      this.searchForm.category = "";
    }
  }
};
</script>

<style lang="less" >
.search-warp {
  display: flex;
}
</style>