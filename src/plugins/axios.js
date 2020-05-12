"use strict";

import Vue from 'vue';
import axios from "axios";
import {
  Message
} from 'element-ui'

console.log(11111)
// Full config:  https://github.com/axios/axios#request-config
// axios.defaults.baseURL = process.env.baseURL || process.env.apiUrl || '';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

let config = {
  // baseURL: process.env.baseURL || process.env.apiUrl || ""
  // timeout: 60 * 1000, // Timeout
  // withCredentials: true, // Check cross-site Access-Control
};

const _axios = axios.create(config);

//请求拦截器
_axios.interceptors.request.use(
  function (config) {
    //统一添加token
    let token = localStorage.getItem('token');
    if (config.token === true && token != '') {
      config.headers['token'] = localStorage.getItem('token')
    }
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// 相应拦截器
_axios.interceptors.response.use(
  function (response) {
    //捕获成功的相应
    return response;
  },
  function (error) {
    //捕获失败的相应
    //如果有错误，捕获并提示错误信息
    if (error.response && error.response.data && error.response.data.errorCode) {
      Message.error(error.response.data.msg)
    }
    return Promise.reject(error);
  }
);

Plugin.install = function (Vue, options) {
  // console.log(options);
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