<template>
  <div id="home">
    <Sum></Sum>
    <Chart></Chart>
    <Sale></Sale>
  </div>
</template>

<script>
import Sale from '@/views/home/home/Sale.vue';
import Chart from '@/views/home/home/Chart.vue';
import Sum from '@/views/home/home/Sum.vue';
export default {
  name: "Home",
  data(){
    return{}
  },
  components:{
    Sale,
    Sum,
    Chart
  }
};
</script>

<style lang="less" scoped>
#home{
  margin:20px;
}
</style>
