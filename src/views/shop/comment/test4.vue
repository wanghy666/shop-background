<template>
  <el-dialog title="提示" :visible.sync="visible11" width="30%">
    <span>这是dialog的内容</span>
    <span>这是dialog的内容</span>
    <span>这是dialog的内容</span>
    <span>这是dialog的内容</span>

    <span>这是dialog的内容</span>

    <span>这是dialog的内容</span>

    <span>这是dialog的内容</span>

    <span>这是dialog的内容</span>
    <span>这是dialog的内容</span>
    <span>这是dialog的内容</span>

    <span>这是dialog的内容</span>
    <span>这是dialog的内容</span>
    <span>这是dialog的内容</span>

    <span>这是dialog的内容</span>
    <span>这是dialog的内容</span>

    <span>这是dialog的内容</span>
    <span>这是dialog的内容</span>

    <span>这是dialog的内容</span>

    <span>这是dialog的内容</span>
    <span>这是dialog的内容</span>
    <br>
    <span>这是dialog的内容</span>
    <br>
    <span>这是dialog的内容</span>
    <br>
    <span>这是dialog的内容</span>
    <br>
    <span>这是dialog的内容</span>
    <br>

    <span>这是dialog的内容</span>
    <br>
    <span>这是dialog的内容</span>
    <br>

    <span>这是dialog的内容</span>
    <br>
    <span>这是dialog的内容</span>
    <br>
    <span>这是dialog的内容</span>
    <br>

    <span>这是dialog的内容</span>
    <br>

    <span>这是dialog的内容</span>
    <br>
    <span>这是dialog的内容</span>
    <br>
    <span>这是dialog的内容</span>
    <br>

    <span>这是dialog的内容</span>
    <br>
    <span>这是dialog的内容</span>
    <br>

    <span>这是dialog的内容</span>
    <br>
    <span>这是dialog的内容</span>
    <br>

    <span>这是dialog的内容</span>
    <br>
    <span>这是dialog的内容</span>
    <br>

    <span>这是dialog的内容</span>
    <br>
    <span>这是dialog的内容</span>
    <br>
    <span>这是dialog的内容</span>
    <br>

    <span>这是dialog的内容</span>
    <br>
    <span>这是dialog的内容</span>
    <br>
    <span>这是dialog的内容</span>
    <br>
    <span>这是dialog的内容</span>
    <br>

    <span>这是dialog的内容</span>
    <br>

    <span>这是dialog的内容</span>
    <br>

    <span slot="footer" class="dialog-footer">
      <el-button @click="cancelModle">取 消</el-button>
      <el-button type="primary" @click="cancelModle">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    visible11: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    cancelModle() {
      this.$emit("update:visible11", false);
    }
  }
};
</script>

<style lang="less" scoped>
</style>