<template>
  <div>
    <!-- 商品类型选择弹框页 -->
    <el-dialog title="商品规格选择" :visible.sync="visible" width="70%" :before-close="modalClose">
      <div style="margin:-20px" class="d-flex border-top border-bottom">
        <div class="border-right" style="width:150px">
          <div
            v-for="(item,index) in skuList"
            :key="index"
            style="height:40px;line-height:40px;text-align:center"
            :class="[skuId==index?'active-sku':'', 'border-bottom']"
            @click="changeSku(index)"
          >{{item.name}}</div>
          <!-- 切换上下页 -->
          <el-button-group style="width:100%">
            <el-button
              plain
              icon="el-icon-arrow-left"
              style="width:50%"
              :disabled="skuPage===1"
              @click="changeSkuList({pageType:-1})"
            >上一页</el-button>
            <el-button
              plain
              style="width:50%"
              :disabled="skuPage >= Math.ceil(skuTotalCount/10)"
              @click="changeSkuList({pageType:1})"
            >
              下一页
              <i class="el-icon-arrow-right el-icon--right"></i>
            </el-button>
          </el-button-group>
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
        <el-button @click="modalClose">取 消</el-button>
        <el-button type="primary" @click="confirmSku">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      skuId: 0,
      skuItemId: 0,
      chooseSkuList: [], //选中的规格选项
      isChooseAll: false //是否全选
    };
  },
  props: {
    skuList: {
      type: Array,
      default: []
    },
    skuPage: {
      type: Number,
      default: 1
    },
    skuLimit: {
      type: Number,
      default: 10
    },
    skuTotalCount: {
      type: Number,
      default: 10
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    //当前规格对应的选项值列表
    nowSkuList() {
      let item = this.skuList[this.skuId];
      return item ? item.list : [];
    }
  },
  methods: {
    //关闭页面
    modalClose() {
      this.$emit("update:visible", false);
    },
    //改变左侧商品规格，切换右侧商品规格选项
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
      if (item) {
        this.$emit("getConfirmSku", item);
      }
      this.modalClose();
    },
    //切换商品列表上下页
    changeSkuList(obj) {
      let { pageType } = obj; //pageType=-1上一页，pageType=1下一页
      this.$emit("changeSkuList", pageType);
    }
  }
};
</script>

<style lang="less" scoped>
.active-sku {
  background-color: #f0f9eb;
  border-color: #c2e7b0;
  color: #67c23a;
}
</style>