import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: JSON.parse(localStorage.getItem('user')) || {},
    token: localStorage.getItem('token') || false
  },
  mutations: {
    //登陆
    login(state, userInfo) {
      // 修改vuex
      state.user = userInfo;
      state.token = userInfo.token;
      // 本地存储
      localStorage.setItem('user', JSON.stringify(userInfo));
      localStorage.setItem('token', userInfo.token)
    },
    //退出
    logout(state) {
      // 修改vuex
      state.user = {};
      state.token = false;
      // 本地存储
      localStorage.clear()
    }
  },
  actions: {},
  modules: {}
})