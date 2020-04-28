import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import echarts from 'echarts'
Vue.prototype.$echarts = echarts



//样式重置
import "@/assets/style/reset.css"

Vue.directive('auth', {
  // 当被绑定的元素插入到 DOM 中时……
  inserted(el, binding, vnode, oldnode) {
    let user = localStorage.getItem('user');
    user = user ? JSON.parse(user) : {};
    //获取所有的按钮权限列表
    let btnRules = user.ruleNames
    if (btnRules.length > 0) {
      let nowItem = btnRules.find(item => item == binding.value)
      if (!nowItem) {
        //⚠️这里先找到当前元素的父节点，然后移除父节点中的当前节点
        el.parentNode.removeChild(el)
      }
    }
  }
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')