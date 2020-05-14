<template>
  <div class="wrap">
    <div class="top" style="box-sizing:border-box;margin:20px">
      <el-button type="success" @click="editSku(false)">添加规格</el-button>
      <el-button type="danger" @click="delSku(false)">批量删除</el-button>
    </div>

    <div class="table-wrap" style="box-sizing:border-box;margin:0 20px;overflow:auto">
      <el-table :data="tableData" border style="width: 100%" @row-click="rowClickHandle">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="name" label="规格名称"></el-table-column>
        <el-table-column prop="default" label="规格值" align="center"></el-table-column>
        <el-table-column prop="order" label="排序" align="center" width="180"></el-table-column>
        <el-table-column prop="status" label="状态" align="center" width="180">
          <template slot-scope="scope">
            <el-button
              :type="scope.row.status?'success':'danger'"
              plain
              @click="handleChangeStatus(scope.row)"
            >{{scope.row.status?'启用':'禁用'}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="operation" label="操作" align="center">
          <template slot-scope="scope">
            <el-button-group>
              <el-button
                style="color:teal;background-color:#e6f2f2;border-color: #9cc;"
                plain
                @click="editSku(scope.row)"
              >修改</el-button>
              <el-button type="danger" plain @click="delSku(scope.row)">删除</el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div style="height:60px;box-sizing:border-box;padding:10px 20px;" class="border-top">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="pageSizes"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>

    <!-- 弹框 -->
    <el-dialog :title="isEdit?'修改规格':'新增规格'" :visible.sync="editFormVisible">
      <el-form :model="skuForm" :rules="rules" ref="skuForm" label-width="80px">
        <el-form-item label="规格名称" prop="name">
          <el-input v-model="skuForm.name" autocomplete="off" style="width:150px"></el-input>
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="skuForm.order" :min="0"></el-input-number>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="skuForm.status" size="mini">
            <el-radio :label="1" border>启用</el-radio>
            <el-radio :label="0" border>禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="类型">
          <el-radio-group v-model="skuForm.type" size="mini">
            <el-radio :label="0" border>文字</el-radio>
            <el-radio :label="1" border>颜色</el-radio>
            <el-radio :label="2" border>图片</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="规格值" prop="default">
          <el-input
            type="textarea"
            placeholder="请输入内容"
            v-model="skuForm.default"
            maxlength="30"
            show-word-limit
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmEditSku">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [
        // {
        //   name: "尺码",
        //   value: "s,m,l",
        //   sort: 11,
        //   status: 0,
        //   operation: 0
        // },
      ],
      total: 0, //总条数
      pageSizes: [15, 20, 30, 50],
      pageSize: 10,
      currentPage: 1,
      currentItem: {}, //当前操作数据
      editFormVisible: false, //修改/新增对话框
      isEdit: true, //当前编辑状态（true：修改，false:新增）
      skuForm: {
        name: "",
        default: "",
        order: 100,
        status: 0,
        type: 0
      },
      rules: {
        default: [{ required: true, message: "请输入规格值", trigger: "blur" }],
        name: [{ required: true, message: "请输入规格名", trigger: "blur" }]
      }
    };
  },
  created() {
    this.init();
  },
  methods: {
    rowClickHandle(row) {
      this.currentItem = row;
    },
    //获取商品规格列表
    init() {
      this.axios
        .get(`/admin/skus/${this.currentPage}?limit=${this.pageSize}`, {
          token: true
        })
        .then(res => {
          let { data } = res.data;
          this.total = data.totalCount;
          this.tableData = data.list;
        })
        .catch(err => {});
    },
    //修改启用禁用状态
    handleChangeStatus(row) {
      if (row.status == 0) {
        row.status = 1;
      } else {
        row.status = 0;
      }
      this.axios
        .post(
          `/admin/skus/${row.id}/update_status`,
          {
            status: row.status
          },
          { token: true }
        )
        .then(res => {
          this.$message.success(row.status ? "启用成功" : "禁用成功");
        });
    },
    //添加/修改商品规格
    editSku(obj) {
      //新增
      if (obj === false) {
        this.editFormVisible = true;
        this.isEdit = false;
        //重置数据
        this.skuForm = {
          name: "",
          default: "",
          order: 100,
          status: 0,
          type: 0
        };
      } else {
        //修改
        this.editFormVisible = true;
        this.isEdit = true;
        this.skuForm = { ...obj };
      }
    },
    //点击确定添加/修改
    confirmEditSku() {
      this.$refs.skuForm.validate(valid => {
        //表单校验通过
        if (valid) {
          //修改状态
          if (this.isEdit) {
            this.axios
              .post(`/admin/skus/${this.currentItem.id}`, this.skuForm, {
                token: true
              })
              .then(res => {
                this.editFormVisible = false;
                this.$message.success("修改成功");
                this.init();
              });
          } else {
            this.axios
              .post(`/admin/skus`, this.skuForm, { token: true })
              .then(res => {
                this.editFormVisible = false;
                this.$message.success("添加成功");
                this.init();
              });
          }
        } else {
          return false;
        }
      });
    },
    //删除
    delSku(obj) {
      //普通删除
      if (obj) {
        console.log("普通删除");
        this.axios
          .post(`/admin/skus/${obj.id}/delete`, {}, { token: true })
          .then(res => {
            console.log(res, "res");
          });
      } else {
        //批量删除
        console.log("批量删除");
      }
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.init();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.init();
    }
  }
};
</script>

<style lang="less" scoped>
.wrap {
  height: calc(100vh - 60px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .table-wrap {
    height: calc(100vh - 120px);
  }
}
</style>