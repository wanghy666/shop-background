<template>
  <el-dialog
    :title="isEdit?'修改商品类型':'新增商品类型'"
    :visible.sync="visible"
    width="70%"
    :before-close="modalClose"
  >
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
              <el-switch v-model="scope.row.status" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
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
      <el-button @click="modalClose">取 消</el-button>
      <el-button type="primary" @click="confirmEditType">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      rules: {
        name: [{ required: true, message: "请输入规格名", trigger: "blur" }]
      }
    };
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    //商品类型表单
    typeForm: {
      type: Object,
      default: {}
    },
    //关联规格列表
    typeList: {
      type: Array,
      default: []
    },
    //属性列表
    attributeTable: {
      type: Array,
      default: []
    },
    //编辑/修改状态
    isEdit: {
      type: Boolean,
      default: true
    }
  },
  filters: {
    valueFormat(value) {
      let str = value.replace(/\n/g, ",");
      return str;
    }
  },
  methods: {
    //关闭页面
    modalClose() {
      this.$emit("update:visible", false);
    },
    //添加关联规格
    chooseSku() {
      this.$emit("getSkuList", 1);
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
            this.$emit("getEditType", this.typeForm);
          } else {
            //新增
            this.$emit("getAddType", this.typeForm);
          }
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
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
  margin-bottom: 10px;
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
</style>