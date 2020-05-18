"use strict";

import Vue from 'vue';
import axios from "axios";
import {
  Message,
  Loading
} from 'element-ui'


/* ----------  全局的加载动画  ------------ */
let loading;
////开始加载动画
function startLoading() {
  loading = Loading.service({
    lock: true, //是否锁定
    text: '拼命加载中...', //加载中需要显示的文字
    background: 'rgba(0,0,0,.7)', //背景颜色
  });
}
//结束加载动画
function endLoading() {
  loading.close();
}
//需要加载的次数
let needLoadingRequestCount = 0
export function showFullScreenLoading() {
  if (needLoadingRequestCount === 0) {
    startLoading()
  }
  needLoadingRequestCount++
}
export function tryHideFullScreenLoading() {
  if (needLoadingRequestCount <= 0) return
  needLoadingRequestCount--
  if (needLoadingRequestCount === 0) {
    endLoading()
  }
}


// Full config:  https://github.com/axios/axios#request-config
// axios.defaults.baseURL = process.env.baseURL || process.env.apiUrl || '';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';

let config = {
  baseURL: process.env.baseURL || process.env.apiUrl || "",
  timeout: 60 * 1000, // Timeout
  withCredentials: true, // Check cross-site Access-Control
};

// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
const _axios = axios.create(config);




//请求拦截器
_axios.interceptors.request.use(
  (config) => {
    showFullScreenLoading()
    //------统一添加token
    config.headers['token'] = localStorage.getItem('token')

    // let token = localStorage.getItem('token');
    // if (config.token === true && token != '') {
    //   config.headers['token'] = localStorage.getItem('token')
    // }
    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);

// 相应拦截器
_axios.interceptors.response.use(
  (response) => {
    //捕获成功的相应
    tryHideFullScreenLoading() //成功后结束动画
    return response;
  },
  (error) => {
    //捕获失败的相应
    tryHideFullScreenLoading() //如果错误也结束动画
    //如果有错误，捕获并提示错误信息
    if (error.response && error.response.data && error.response.data.errorCode) {
      Message.error(error.response.data.msg)
    }
    return Promise.reject(error);
  }
);

Plugin.install = function (Vue, options) {
  Vue.axios = _axios;
  window.axios = _axios;
  Object.defineProperties(Vue.prototype, {
    axios: {
      get() {
        return _axios;
      }
    },
    $axios: {
      get() {
        return _axios;
      }
    },
  });
};

Vue.use(Plugin)

export default Plugin;