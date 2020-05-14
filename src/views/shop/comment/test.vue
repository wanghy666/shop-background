<template>
  <div>
    <div style="width:50%;heigth:300px" v-if="visible">
      子组件的内容
      <br>
      <el-button type="primary" @click="closeHandle">关闭</el-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    closeHandle() {
      this.$emit("update:visible", false);
    }
  }
};
</script>

<style lang="less" scoped>
</style>