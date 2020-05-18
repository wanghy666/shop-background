<template>
  <div class="wrap">
    <div class="top" style="box-sizing:border-box;margin:20px">
      <el-button type="success" @click="editType(false)">添加类型</el-button>
      <el-button type="danger" @click="delType(false)">批量删除</el-button>
    </div>

    <div class="table-wrap" style="box-sizing:border-box;margin:0 20px;overflow:auto">
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        @row-click="rowClickHandle"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="name" label="类型名称" width="150"></el-table-column>
        <el-table-column prop="value" label="属性标签" align="center"></el-table-column>
        <el-table-column prop="order" label="排序" align="center" width="120"></el-table-column>
        <el-table-column prop="status" label="状态" align="center" width="120">
          <template slot-scope="scope">
            <el-button
              :type="scope.row.status?'success':'danger'"
              plain
              @click="handleChangeStatus(scope.row)"
            >{{scope.row.status?'启用':'禁用'}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="operation" label="操作" align="center" width="180">
          <template slot-scope="scope">
            <el-button-group>
              <el-button
                style="color:teal;background-color:#e6f2f2;border-color: #9cc;"
                plain
                @click="editType(scope.row)"
              >修改</el-button>
              <el-button type="danger" plain @click="delType(scope.row)">删除</el-button>
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

    <!-- 修改/新增商品类型弹框 -->
    <type-dialog
      :visible.sync="editFormVisible"
      v-if="editFormVisible"
      :typeList="typeList"
      :typeForm="typeForm"
      :attributeTable="attributeTable"
      :isEdit="isEdit"
      @getSkuList="getSkuListHandle"
      @getEditType="getEditTypeHandle"
      @getAddType="getAddTypeHandle"
    ></type-dialog>

    <!-- 关联规格选择弹框 -->
    <sku-dialog
      :skuList="skuList"
      :skuPage="skuPage"
      :skuTotalCount="skuTotalCount"
      :skuLimit="skuLimit"
      v-if="skuDialogVisible"
      :visible.sync="skuDialogVisible"
      @getConfirmSku="getConfirmSkuHandle"
      @changeSkuList="changeSkuListHandle"
    ></sku-dialog>
  </div>
</template>

<script>
import skuDialog from "@/components/skuDialog.vue";
import typeDialog from "@/views/shop/type/typeDialog.vue";
import { getTypeList } from "@/api/api";
export default {
  components: { skuDialog, typeDialog },
  data() {
    return {
      tableData: [],
      multipleSelection: [], //选中的表格项
      total: 0, //总条数
      pageSizes: [15, 20, 30, 50],
      pageSize: 10,
      currentPage: 1,
      currentItem: {}, //当前操作数据

      editFormVisible: false, //修改/新增对话框
      isEdit: true, //当前编辑状态（true：修改，false:新增）
      nowId: -1, //当前修改数据的类型id
      //新增/修改的当前类型数据
      typeForm: {
        name: "",
        order: 100,
        status: 0,
        skus_id: []
      },
      typeList: [], //关联规格
      attributeTable: [], //属性列表
      //规格选择弹框
      skuDialogVisible: false,
      skuList: [],
      skuTotalCount: 0, //skuList的数量和
      skuPage: 1,
      skuLimit: 10
    };
  },

  created() {
    this.init();
  },
  methods: {
    rowClickHandle(row) {
      this.currentItem = row;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    //获取商品类型列表
    init() {
      this.axios
        .get(`/admin/goods_type/${this.currentPage}?limit=${this.pageSize}`, {
          token: true
        })
        .then(res => {
          let { data } = res.data;
          data.list.forEach(item => {
            if (item.goods_type_values.length > 0) {
              let typeValue = "";
              item.goods_type_values.forEach(v => {
                typeValue += `${v.name},`;
              });
              typeValue = typeValue.slice(0, length - 1);
              item.value = typeValue;
            }
          });
          this.total = data.totalCount;
          this.tableData = data.list;
        })
        .catch(err => {});
    },
    //获取商品规格列表
    getSkuList() {
      this.axios
        .get(`/admin/skus/${this.skuPage}?limit=${this.skuLimit}`, {
          token: true
        })
        .then(res => {
          let { list } = res.data.data;
          this.skuTotalCount = res.data.data.totalCount;
          //处理规格选项对应的选项值列表，为数据添加一个新的属性
          list.forEach(item => {
            let arr = [];
            if (item.default) {
              arr = item.default.split(",");
            }
            item.list = arr.map(v => {
              return {
                name: v,
                isChoose: false
              };
            });
          });
          this.skuList = list;
          this.skuDialogVisible = true;
        });
    },
    //新增商品类型
    getAddType(data) {
      this.axios.post(`/admin/goods_type`, data, { token: true }).then(res => {
        this.$message.success("创建成功");
        this.editFormVisible = false;
        this.init();
      });
    },
    //修改商品类型
    getEditType(data) {
      data = {
        id: this.nowId,
        ...data
      };
      this.axios
        .post(`/admin/goods_type/${this.nowId}`, data, { token: true })
        .then(res => {
          this.$message.success("修改成功");
          this.editFormVisible = false;
          this.init();
        });
    },
    //批量删除商品类型
    getDelAllType(id) {
      this.axios
        .post(`/admin/goods_type/delete_all`, { ids: id }, { token: true })
        .then(res => {
          this.$message.success("删除成功");
          this.init();
        });
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
          `/admin/goods_type/${row.id}/update_status`,
          {
            status: row.status
          },
          { token: true }
        )
        .then(res => {
          this.$message.success(row.status ? "启用成功" : "禁用成功");
        });
    },
    //添加/修改商品类型
    editType(obj) {
      //新增
      if (obj === false) {
        this.editFormVisible = true;
        this.isEdit = false;
        //重置数据
        this.typeForm = {
          name: "",
          order: 100,
          status: 0,
          skus_id: []
        };
        this.typeList = [];
        this.attributeTable = [];
      } else {
        //修改
        this.nowId = obj.id;
        this.editFormVisible = true;
        this.isEdit = true;
        this.typeForm = {
          name: obj.name,
          order: obj.order,
          status: obj.status
        };
        this.typeList = [...obj.skus];
        obj.goods_type_values = obj.goods_type_values.map(item => {
          return {
            ...item,
            isItemEdit: false
          };
        });
        this.attributeTable = [...obj.goods_type_values];
      }
    },
    //删除
    delType(obj) {
      //普通删除
      if (obj) {
        this.$confirm("确定删除该数据", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消"
        }).then(() => {
          this.axios
            .post(`/admin/goods_type/${obj.id}/delete`, {}, { token: true })
            .then(res => {
              this.$message.success("删除成功");
              this.init();
            });
        });
      } else {
        //批量删除
        let idList = this.multipleSelection.map(item => {
          return item.id;
        });
        this.getDelAllType(idList);
      }
    },

    /*---商品类型弹框----*/
    getEditTypeHandle(data) {
      this.getEditType(data);
    },
    getAddTypeHandle(data) {
      this.getAddType(data);
    },
    /* ---商品规格弹框 ---*/
    //获取商品规格列表
    getSkuListHandle(skuPage) {
      this.skuPage = skuPage;
      this.getSkuList();
    },
    //切换商品规格列表的上下页
    changeSkuListHandle(pageType) {
      if (pageType == -1) {
        //上一页
        this.skuPage -= 1;
      } else {
        this.skuPage += 1;
      }
      this.getSkuList();
    },
    //确定选择商品规格
    getConfirmSkuHandle(item) {
      this.typeList.push(item);
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