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
      {
        path: 'shop/sku/list',
        name: 'sku',
        meta: {
          title: '商品规格'
        },
        component: () => import('@/views/shop/sku/index.vue')
      },
      {
        path: 'shop/type/list',
        name: 'type',
        meta: {
          title: '商品类型'
        },
        component: () => import('@/views/shop/type/index.vue')
      },
    ]
  }, {
    path: '/index',
    redirect: '/index/index',
  },
  {
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

//全局守卫
router.beforeEach((to, from, next) => {
  let token = localStorage.getItem('token')
  if (token) {
    //1.1已登录
    //是否去登陆页
    if (to.path === '/login') {
      Message.error('请勿重复登陆');
      //返回来时页面；如果没有来时页面（浏览器输入路由进入），返回首页
      return next(from.path ? from.path : '/index')
    }
    //2.1判断当前可以访问的用户权限
    let rules = JSON.parse(localStorage.getItem('rules'));
    //查找所要到达页面是否在全权限内
    let index = rules.find(item => {
      let toPath = to.path.substring(1);
      return item.rule_id > 0 && item.frontpath == toPath
    })
    //2.2无权限访问时，返回原页面
    if (index == -1) {
      Message.error('暂无访问权限')
      return next(from.path ? from.path : '/index')
    } else {
      next()
    }
  } else {
    //1.2未登陆
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