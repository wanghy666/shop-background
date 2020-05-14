<template>
  <div class="category-wrap">
    <div class="border-bottom p-2">
      <el-button @click="createTop" size="mini" style="background-color:teal;color:white">创建顶级分类</el-button>
    </div>
    <el-tree
      :data="treeData"
      :props="defaultProps"
      node-key="id"
      default-expand-all
      draggable
      :expand-on-click-node="false"
      @node-drop="nodeDropHandle"
      @node-drag-end="nodeDragEndHandle"
    >
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <el-input
          v-if="data.isEdit===true"
          v-model="data.label"
          placeholder="请输入"
          size="mini"
          style="width:130px"
        ></el-input>
        <span v-else class="mr-auto">{{ node.label }}</span>
        <span>
          <el-button
            :type="data.status?'primary':'danger'"
            size="mini"
            @click="changeIsShow(data)"
          >{{data.status===1?'显示':'隐藏'}}</el-button>
          <el-button type="success" size="mini" @click="append(data)">增加</el-button>
          <el-button
            :type="data.isEdit?'':'warning'"
            size="mini"
            @click="editData(data)"
          >{{data.isEdit?'完成':'修改'}}</el-button>
          <el-button type="danger" size="mini" @click="remove(node, data)">删除</el-button>
        </span>
      </span>
    </el-tree>
  </div>
</template>

<script>
let id = 1000;
export default {
  inject: ["layout"],
  data() {
    return {
      treeData: [],
      defaultProps: {
        children: "child",
        label: "name"
      },
      sortData: []
    };
  },
  created() {
    this.init();
  },
  methods: {
    //获取商品分类列表
    init() {
      this.layout.loading = true;
      this.axios
        .get("/admin/category", { token: true })
        .then(res => {
          let data = res.data.data;
          let addEditStatus = function(arr) {
            arr.forEach(item => {
              item.isEdit = false;
              if (item.child.length) {
                addEditStatus(item.child);
              }
            });
          };
          addEditStatus(data);
          this.treeData = data;
          this.layout.loading = false;
        })
        .catch(err => {
          this.layout.loading = false;
        });
    },
    //增加分类
    getAddCategory(id, name) {
      this.layout.loading = true;
      this.axios
        .post(
          "/admin/category",
          { status: false, category_id: id, name: name ? name : "新建分类" },
          { token: true }
        )
        .then(res => {
          this.$message({
            message: "添加成功",
            type: "success"
          });
          this.init();
          this.layout.loading = false;
        })
        .catch(err => {
          this.layout.loading = false;
        });
    },
    //修改分类
    getEditCategory(obj) {
      this.layout.loading = true;
      this.axios
        .post(
          `/admin/category/${obj.id}`,
          {
            status: false,
            category_id: obj.category_id,
            name: obj.name
          },
          {
            token: true
          }
        )
        .then(res => {
          this.$message({
            message: "修改成功",
            type: "success"
          });
          this.init();
          this.layout.loading = false;
        })
        .catch(err => {
          this.layout.loading = false;
        });
    },
    //删除分类
    getDelCategory(id) {
      this.layout.loading = true;
      this.axios
        .delete(`/admin/category/${id}`, {
          token: true
        })
        .then(res => {
          this.$message.success("删除成功");
          this.init();
          this.layout.loading = false;
        })
        .catch(err => {
          this.layout.loading = false;
        });
    },
    //修改显示状态
    getUpdateStatus(id, status) {
      this.layout.loading = true;
      this.axios
        .post(
          `/admin/category/${id}/update_status`,
          {
            status: status
          },
          { token: true }
        )
        .then(res => {
          this.$message.success("修改成功");
          this.layout.loading = false;
        })
        .catch(err => {
          this.layout.loading = false;
        });
    },
    //拖拽分类排序
    getSort(data) {
      this.layout.loading = true;
      this.axios
        .post(
          `/admin/category/sort`,
          {
            sortdata: data
          },
          { token: true }
        )
        .then(res => {
          this.$message.success("拖拽成功");
          this.init();
          this.layout.loading = false;
        })
        .catch(item => {
          this.layout.loading = false;
        });
    },

    /* ----- 方法 -----  */
    //创建顶级分类
    createTop() {
      this.$prompt("请输入分类名称", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputValidator(val) {
          if (val == "" || val == null) {
            return "分类名称不能为空";
          }
        }
      })
        .then(({ value }) => {
          this.getAddCategory(0, value);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消输入"
          });
        });
    },
    //修改显示状态
    changeIsShow(data) {
      if (data.status === 0) {
        data.status = 1;
      } else {
        data.status = 0;
      }
      this.getUpdateStatus(data.id, data.status);
    },
    //修改数据
    editData(data) {
      if (data.isEdit) {
        data.isEdit = false;
      } else {
        //递归关闭所有的编辑状态
        let addEditStatus = function(arr) {
          arr.forEach(item => {
            item.isEdit = false;
            if (item.child.length) {
              addEditStatus(item.child);
            }
          });
        };
        addEditStatus(this.treeData);
        //打开当前的编辑状态
        data.isEdit = true;
      }
      if (!data.isEdit) {
        let obj = {
          id: data.id,
          category_id: data.category_id,
          name: data.label
        };
        this.getEditCategory(obj);
      }
    },
    //新增数据
    append(data) {
      let id = data.id;
      this.getAddCategory(id);
    },
    //删除数据
    remove(node, data) {
      this.$confirm("确定删除该数据", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(() => {
        this.getDelCategory(data.id);
      });
    },
    //拖拽结束时
    nodeDragEndHandle(...options) {
      let newData = [];
      if (options[1]) {
        if (options[2] === "before" || options[2] === "after") {
          options[0].data.category_id = options[1].data.category_id;
        } else {
          options[0].data.category_id = options[1].data.id;
        }
      }
      //递归把多维数组转一纬数组
      let change = function(arr) {
        arr.forEach(item => {
          newData.push(item);
          if (item.child) {
            change(item.child);
          }
        });
      };
      change(this.treeData);
      this.sortData = newData.map(item => {
        return {
          name: item.name,
          id: item.id,
          order: item.order,
          category_id: item.category_id
        };
      });
    },
    //拖拽成功完成
    nodeDropHandle(...options) {
      this.getSort(JSON.stringify(this.sortData)); //注意：接收的数据类型是string
    }
  }
};
</script>

<style lang="less" scoped>
.category-wrap {
  padding: 0 20px;
}
/deep/.el-tree-node__content {
  height: 40px;
  line-height: 40px;
  margin-bottom: 5px;
}
.show {
  background-color: teal;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>