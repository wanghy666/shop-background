import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '@/views/Layout.vue'


Vue.use(VueRouter)

const routes = [{
  path: '/',
  redirect: '/index',
  component: Layout,
  children: [{
      path: 'index',
      name: 'index',
      meta: {
        title: '后台首页'
      },
      component: () => import('@/views/home/home/Index.vue')
    }, {
      path: 'image',
      name: 'image',
      meta: {
        title: '相册管理'
      },
      component: () => import('@/views/home/image/Image.vue')
    },
    {
      path: 'goods',
      name: 'goods',
      meta: {
        title: '商品列表'
      },
      component: () => import('@/views/home/shop/Index.vue')
    },
    {
      path: 'category',
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
}, {
  path: '*',
  name: '404',
  component: () => import('@/views/404.vue')
}]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router