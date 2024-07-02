import Vue from 'vue';
import Router from 'vue-router';

import Index from '../pages/Index';
import Register from '../pages/Register';
import NotFound from '../pages/404';
import Login from '../pages/Login';
import Home from '../pages/Home';
import Infoshow from '../pages/Infoshow';
import FundList from '../pages/FundList';

Vue.use(Router)

const router = new Router({
  routes: [
    //配置路由
    {//访问/就跳转到/index
      path: '/',
      redirect: "/index"
    },
    {
      path: '/index',
      name: "index",
      component: Index,
      children: [
        {
          path: '',
          component: Home
        },
        {
          path: '/home',
          name: 'home',
          component: Home
        },
        {
          path: '/infoshow',
          name: 'infoshow',
          component: Infoshow
        },
        {
          path: '/fundlist',
          name: 'fundlist',
          component: FundList
        }
      ]
    },
    {
      path: '/register',
      name: "register",
      component: Register
    },
    {
      path: '/login',
      name: "login",
      component: Login
    },
    {
      path: '*',//什么都没有访问到
      name: "/404",
      component: NotFound
    },
  ]
})

//路由守卫
router.beforeEach((to, from, next) => {
  //判断localstorage中是否有token，有token就是已经登录
  //存在就返回true，不存在就返回false
  const isLogin = localStorage.eleToken ? true : false;
  if (to.path == '/login' || to.path == '/register') {
    //如果是访问登录或者注册页面，可以直接访问
    next();
  } else {
    //为true就向下执行，否则就进入login页面
    isLogin ? next() : next("/login");
  }
})

export default router;