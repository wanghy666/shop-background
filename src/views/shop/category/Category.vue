<template>
  <div class="category-wrap">
    <div class="border-bottom p-2">
      <el-button @click="createTop" size="mini" style="background-color:teal;color:white">创建顶级分类</el-button>
    </div>
    <el-tree
      :data="treeData"
      node-key="id"
      default-expand-all
      draggable
      :expand-on-click-node="false"
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
            :type="data.isShow?'primary':'danger'"
            size="mini"
            @click="changeIsShow(data)"
          >{{data.isShow?'显示':'隐藏'}}</el-button>
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
  data() {
    return {
      treeData: [
        {
          id: 1,
          label: "一级 1",
          isShow: true,
          isEdit: false,
          children: [
            {
              id: 4,
              label: "二级 1-1",
              isShow: false,
              isEdit: false,
              children: [
                {
                  id: 9,
                  label: "三级 1-1-1",
                  isShow: true,
                  isEdit: false
                },
                {
                  id: 10,
                  label: "三级 1-1-2",
                  isShow: false,
                  isEdit: false
                }
              ]
            }
          ]
        },
        {
          id: 2,
          label: "一级 2",
          isShow: true,
          isEdit: false,
          children: [
            {
              id: 5,
              label: "二级 2-1",
              isShow: true,
              isEdit: false
            },
            {
              id: 6,
              label: "二级 2-2",
              isShow: true,
              isEdit: false
            }
          ]
        },
        {
          id: 3,
          label: "一级 3",
          isShow: true,
          isEdit: false,
          children: [
            {
              id: 7,
              label: "二级 3-1",
              isShow: true,
              isEdit: false
            },
            {
              id: 8,
              label: "二级 3-2",
              isShow: true,
              isEdit: false,
              children: [
                {
                  id: 11,
                  label: "三级 3-2-1",
                  isShow: true,
                  isEdit: false
                },
                {
                  id: 12,
                  label: "三级 3-2-2",
                  isShow: true,
                  isEdit: false
                },
                {
                  id: 13,
                  label: "三级 3-2-3",
                  isShow: true,
                  isEdit: false
                }
              ]
            }
          ]
        }
      ],
      defaultProps: {
        children: "children",
        label: "label"
      }
    };
  },
  methods: {
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
          this.treeData.unshift({
            id: id++,
            label: value,
            isShow: true,
            isEdit: false,
            children: []
          });
          this.$message({
            type: "success",
            message: "创建成功"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消输入"
          });
        });
    },
    handleDragStart(node) {
      console.log("drag start", node);
    },
    //修改显示状态
    changeIsShow(data) {
      data.isShow = !data.isShow;
      this.$message({
        message: data.isShow ? "显示成功" : "隐藏成功",
        type: "success"
      });
    },
    //修改数据
    editData(data) {
      data.isEdit = !data.isEdit;
      if (!data.isEdit) {
        this.$message({
          message: "修改完成",
          type: "success"
        });
      }
    },
    //新增数据
    append(data) {
      const newChild = { id: id++, label: "testtest", children: [] };
      if (!data.children) {
        this.$set(data, "children", []);
      }
      data.children.push(newChild);
    },
    //删除数据
    remove(node, data) {
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex(d => d.id === data.id);
      this.$confirm("确定删除该数据", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(() => {
        children.splice(index, 1);
        this.$message({
          message: "删除成功",
          type: "success"
        });
      });
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