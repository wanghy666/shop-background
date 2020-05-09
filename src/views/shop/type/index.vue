<template>
  <div class="wrap">
    <div class="top" style="box-sizing:border-box;margin:20px">
      1234567
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
    <el-dialog :title="isEdit?'修改商品类型':'新增商品类型'" :visible.sync="editFormVisible" width="70%">
      <el-form :model="typeForm" :rules="rules" ref="typeForm" label-width="80px">
        <el-form-item label="类型名称" prop="name">
          <el-input v-model="typeForm.name" autocomplete="off" style="width:150px"></el-input>
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="typeForm.order" :min="0"></el-input-number>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="typeForm.status" size="mini">
            <el-radio :label="1" border>启用</el-radio>
            <el-radio :label="0" border>禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="关联规格">
          <div
            class="type-item"
            v-for="(item,index) in typeList"
            :key="index"
            @click="delSku(item,index)"
          >
            <span>{{item.name}}</span>
            <i class="el-icon-delete"></i>
          </div>
          <el-button icon="el-icon-plus" @click="chooseSku"></el-button>
        </el-form-item>
        <el-form-item label="属性列表">
          <el-table :data="attributeTable" style="width: 100%">
            <el-table-column prop="order" label="排序">
              <template slot-scope="scope">
                <el-input v-model="scope.row.order" placeholder="请输入内容"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="属性名称">
              <template slot-scope="scope">
                <el-input v-model="scope.row.name" placeholder="请输入属性名称"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="type" label="所属类型">
              <template slot-scope="scope">
                <el-select v-model="scope.row.type" placeholder="请选择">
                  <el-option label="输入框" value="input"></el-option>
                  <el-option label="单选框" value="radio"></el-option>
                  <el-option label="多选框" value="checkbox"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="是否显示">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.status"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                ></el-switch>
              </template>
            </el-table-column>
            <el-table-column prop="default" label="属性值" min-width="200px">
              <template slot-scope="scope">
                <el-input
                  v-if="scope.row.isItemEdit"
                  type="textarea"
                  placeholder="一行为一个属性值，多个请换行输入"
                  v-model="scope.row.default"
                  maxlength="100"
                ></el-input>
                <span v-else>{{scope.row.default | valueFormat}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="operation" label="操作" width="140px">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  v-if="scope.row.type!='input'"
                  @click="scope.row.isItemEdit=!scope.row.isItemEdit"
                >{{scope.row.isItemEdit?"完成":"编辑属性值"}}</el-button>
                <el-button type="text" @click="delAttrItem(scope.row,scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div style="color:teal" @click="addAttrItem">
            <i class="el-icon-plus mx-2"></i>
            <span>添加一个新属性</span>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmEditType">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 关联规格选择弹框 -->
    <el-dialog title="商品规格选择" :visible.sync="skuDialogVisible" width="70%">
      <div style="margin:-20px" class="d-flex border-top border-bottom">
        <div class="border-right" style="width:150px">
          <div
            v-for="(item,index) in skuList"
            :key="index"
            style="height:40px;line-height:40px;text-align:center"
            :class="[skuId==index?'active-sku':'', 'border-bottom']"
            @click="changeSku(index)"
          >{{item.name}}</div>
          <div class="d-flex" style="width:100%;height:30px">
            <div style="width:48%;text-align:center" class="border-right">
              <i class="el-icon-arrow-left" style="font-size:20px;line-height:30px"></i>
            </div>
            <div style="width:48%;text-align:center">
              <i class="el-icon-arrow-right" style="font-size:20px;line-height:30px"></i>
            </div>
          </div>
        </div>

        <div style="width:calc(100% - 150px)">
          <div class="border-bottom">
            <el-button
              type="primary"
              class="my-2 mx-3"
              @click="chooseAll"
            >{{isChooseAll?"取消全选":"全选"}}</el-button>
          </div>
          <div class="p-3">
            <span
              v-for="(item,index) in nowSkuList"
              :key="index"
              :class="[ item.isChoose===true?'active-sku':'','m-2','border','rounded','px-3','py-2']"
              @click="changeSkuItem(item)"
            >{{item.name}}</span>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="skuDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmSku">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
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
      rules: {
        name: [{ required: true, message: "请输入规格名", trigger: "blur" }]
      },
      skuDialogVisible: false, //规格选择弹框
      skuList: [],
      skuId: 0,
      skuPage: 1,
      skuLimit: 10,
      skuItemId: 0,
      chooseSkuList: [], //选中的规格选项
      isChooseAll: false //是否全选
    };
  },
  filters: {
    valueFormat(value) {
      let str = value.replace(/\n/g, ",");
      return str;
    }
  },
  computed: {
    //当前规格对应的选项值列表
    nowSkuList() {
      let item = this.skuList[this.skuId];
      return item ? item.list : [];
    }
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
          console.log(this.tableData, "所有的数据");
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
          //处理规格选项对应的选项值列表，为数据添加一个新的属性
          list.forEach(item => {
            let arr = item.default.split(",");
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
          this.$message.success("创建成功");
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
        this.typeList = { ...obj.skus };
        obj.goods_type_values = obj.goods_type_values.map(item => {
          return {
            ...item,
            isItemEdit: false
          };
        });
        this.attributeTable = [...obj.goods_type_values];
      }
    },
    //点击确定添加/修改
    confirmEditType() {
      this.$refs.typeForm.validate(valid => {
        //表单校验通过
        if (valid) {
          //校验属性列表
          let result = true; //属性列表总体的校验状态
          let message = []; //返回的提示
          this.attributeTable.forEach((item, index) => {
            if (item.order == "") {
              result = result && false;
              message.push(`第${index + 1}行：排序不能为空`);
            }
            if (item.name == "") {
              result = result && false;
              message.push(`第${index + 1}行：属性名不能为空`);
            }
            if (item.type != "input" && item.default == "") {
              result = result && false;
              message.push(`第${index + 1}行：非输入框类型属性值不能为空`);
            }
            if (!result) {
              let str = "";
              message.forEach(item => {
                str += `<li>${item}</li>`;
              });
              this.$notify({
                title: "警告提示",
                dangerouslyUseHTMLString: true,
                message: `<ul>${str}</ul>`,
                duration: 3000,
                type: "warning"
              });
            }
          });
          //处理数据
          if (this.typeList.length) {
            let skus_id = [];
            this.typeList.forEach(item => {
              skus_id.push(item.id);
            });
            this.typeForm.skus_id = [...skus_id];
          }
          if (this.attributeTable.length) {
            this.typeForm.value_list = { ...this.attributeTable };
          }
          //修改状态
          if (this.isEdit) {
            //修改
            this.getEditType(this.typeForm);
            // console.log(this.typeForm, "修改时的数据");
          } else {
            //新增
            this.getAddType(this.typeForm);
          }
        } else {
          return false;
        }
      });
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
        // // this.multipleSelection.forEach(item => {
        // //   ids.push(item.id);
        // // });
        // console.log(this.multipleSelection, "multipleSelection");
        // console.log(idList, "idList");
        // this.delAllAttr(idList);
      }
    },

    /*---商品类型弹框----*/
    //添加商品规格
    chooseSku() {
      this.getSkuList();
    },
    //删除关联规格
    delSku(item, index) {
      this.typeList.splice(index, 1);
    },
    //删除属性列表项
    delAttrItem(row, index) {
      this.attributeTable.splice(index, 1);
    },

    //添加属性列表项
    addAttrItem() {
      let item = {
        order: 10,
        name: "",
        type: "input",
        status: 0,
        default: "", //属性列表-属性值
        isItemEdit: false
      };
      this.attributeTable.push(item);
    },

    /* ---商品规格弹框 ---*/
    //点击选择商品规格
    //选择-商品规格
    changeSku(index) {
      this.skuId = index;
      //清除上次选择状态
      this.isChooseAll = false;
      this.nowSkuList.forEach(item => {
        item.isChoose = false;
      });
    },
    //选择-商品规格选项
    changeSkuItem(item) {
      item.isChoose = !item.isChoose;
      this.chooseSkuList.push(item);
    },
    //全选/取消全选
    chooseAll() {
      this.isChooseAll = !this.isChooseAll;
      if (this.isChooseAll) {
        this.nowSkuList.forEach(item => {
          item.isChoose = true;
        });
      } else {
        this.nowSkuList.forEach(item => {
          item.isChoose = false;
        });
      }
    },
    //确定选择商品规格
    confirmSku() {
      let item = this.skuList[this.skuId];
      this.typeList.push(item);
      this.skuDialogVisible = false;
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
  .type-item {
    display: inline-block;
    min-width: 50;
    box-sizing: border-box;
    padding: 5px 10px;
    height: 34px;
    line-height: 22px;
    font-size: 14px;
    border: 1px solid #eee;
    border-radius: 5px;
    text-align: center;
    margin-right: 10px;
  }
  .type-item > i {
    display: none;
  }
  .type-item:hover {
    background-color: #eee;
    width: 50px;
  }
  .type-item:hover > span {
    display: none;
  }
  .type-item:hover > i {
    display: inline-block;
  }
  .active-sku {
    background-color: #f0f9eb;
    border-color: #c2e7b0;
    color: #67c23a;
  }
}
</style>