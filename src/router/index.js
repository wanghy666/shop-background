import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '@/views/Layout.vue'
import {
  Message
} from 'element-ui'


Vue.use(VueRouter)

const routes = [{
    path: '/',
    redirect: '/index/index',
    component: Layout,
    children: [{
        path: 'index/index',
        name: 'index',
        meta: {
          title: '后台首页'
        },
        component: () => import('@/views/home/home/Index.vue')
      }, {
        path: 'image/index',
        name: 'image',
        meta: {
          title: '相册管理'
        },
        component: () => import('@/views/home/image/Image.vue')
      },
      {
        path: 'shop/goods/list',
        name: 'goods',
        meta: {
          title: '商品列表'
        },
        component: () => import('@/views/home/shop/Index.vue')
      },
      {
        path: 'shop/category/list',
        name: 'category',
        meta: {
          title: '分类列表'
        },
        component: () => import('@/views/shop/category/Category.vue')
      },
    ]
  }, {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue')
  },
  {
    path: '*',
    name: '404',
    component: () => import('@/views/404.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
router.beforeEach((to, from, next) => {
  let token = localStorage.getItem('token')
  if (token) {
    //已登录
    //是否去登陆页
    if (to.path === '/login') {
      Message.error('请勿重复登陆');
      //返回来时页面；如果没有来时页面（浏览器输入路由进入），返回首页
      return next(from.path ? from.path : '/index')
    }
    //非登陆页继续进行
    next()
  } else {
    //未登陆
    if (to.path === '/login') {
      next()
    } else {
      Message.error('暂未登陆，请先登录！')
      // Vue.prototype.$message.error('暂未登陆， 请先登录！');
      next('/login')
    }
  }
})

export default router