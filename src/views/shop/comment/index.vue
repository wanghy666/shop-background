<template>
  <div>
    <span>使用v-model</span>
    <el-input v-model="inputValue" placeholder></el-input>
    <br>
    <span>普通</span>
    <el-input :value="value" @input="changeHandle"></el-input>

    <br>
    <el-button type="primary" @click="isValue=true">普通弹框点击</el-button>
    <test :visible="isValue" @update:visible="isValue = $event"></test>

    <!-- <el-button type="primary" @click="isValue=true">普通弹框点击</el-button>
    <test :visible="isValue" @update:visible="isValue = $event"></test>-->

    <br>
    <el-button type="primary" @click="visible3=true">sync点击测试</el-button>
    <test3 :visible.sync="visible3"></test3>

    <br>
    <el-button type="primary" @click="dialogVisible=true">dialog点击</el-button>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="60%">
      <test2></test2>
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
    </el-dialog>

    <br>
    <el-button type="primary" @click="dialogVisible4=true">dialog点击</el-button>
    <test4 v-if="dialogVisible4" :visible11.sync="dialogVisible4"></test4>
  </div>
</template>

<script>
import test from "@/views/shop/comment/test.vue";
import test2 from "@/views/shop/comment/test2.vue";
import test3 from "@/views/shop/comment/test3.vue";
import test4 from "@/views/shop/comment/test4.vue";
export default {
  components: {
    test,
    test2,
    test3,
    test4
  },
  data() {
    return {
      //v-model测试
      inputValue: "使用v-model的值",
      value: "普通的值",
      //普通父子传值测试
      isValue: false,
      //dialog测试
      dialogVisible: false,
      //sync测试
      visible3: false,
      dialogVisible4: false
    };
  },
  methods: {
    changeHandle(e) {
      this.value = e;
    },
    //普通弹框点击
    clickHandle() {
      this.isValue = true;
    },
    updateHandle(value) {
      this.isValue = value;
    },
    //sync测试
    syncClick() {
      this.visible3 = true;
    }
  }
};
</script>

<style lang="less" scoped>
</style>