//请求拦截和响应拦截文件
import axios from 'axios'
import { Message, Loading } from 'element-ui';
import router from './router/index';

//看element-ui文档
let loading;
//开始一个动画
function startLoading() {
  loading = Loading.service({
    lock: true,//是否锁定
    text: "拼命加载中...",//在加载中的提示文本
    background: 'rgba(0,0,0,0.7)',//背景颜色
  })
}

//结束一个动画
function endLoading() {
  loading.close();//结束当前的加载动画
}


//请求拦截
axios.interceptors.request.use(config => {
  //加载动画
  startLoading();

  //判断token是否存在
  if (localStorage.eleToken) {
    //token存在的话设置统一的请求头header
    config.headers.Authorization = localStorage.eleToken
  }

  return config;
}, error => {
  //错误提醒
  return Promise.reject(error)
});

//响应拦截
axios.interceptors.response.use(response => {
  //结束加载动画
  endLoading();
  return response;
}, error => {
  //错误提醒
  endLoading();
  Message.error(error.response.data);

  //获取错误状态码
  const { status } = error.response;
  if (status == 401) {//状态码为401代表token已经失效
    Message.error("token失效，请重新登陆！")
    //清除token
    localStorage.removeItem("eleToken");
    //跳转到登录页面
    router.push("/login")
  }

  return Promise.reject(error);
});

export default axios