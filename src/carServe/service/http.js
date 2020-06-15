import axios from "axios";
import service from "./service";
import {
  Toast
} from "vant";
import router from '../router'
console.log(router)
// service循环输出请求方法
// "http://2.0.0.1:15200/gateway",
let instance = axios.create({

  // baseURL: '/metrology-service/',
  baseURL: 'http://101.132.174.86:8081/',
  baseURL: 'http://39.105.4.52/rest/',

  timeout: 120000
});
// 请求方法容器
const Http = {};

// 请求参数格式化
for (let key in service) {
  let api = service[key];
  Http[key] = async function (
    params, // 请求参数
    isFormData = false, // 是否为form-data请求
    config = {} // 配置参数 header timeout...
  ) {
    let newParams = {};

    // content-type 是否是form-data
    if (params && isFormData) {
      newParams = new FormData();
      for (let i in params) {
        newParams.append(i, params[i]);
      }
    } else {
      newParams = params;
    }

    // 请求响应返回值
    let response = {};
    // 请求判断处理参数
    if (
      api.method === "post" ||
      api.method === "put" ||
      api.method === "patch"
    ) {
      try {
        response = await instance[api.method](api.url, newParams, config);
      } catch (err) {
        response = err;
      }
    } else if (api.method === "get" || api.method === "delete") {
      config.params = newParams;
      try {
        response = await instance[api.method](api.url, config);
      } catch (err) {
        response = err;
      }
    } else if (api.method === 'getParam') {
      try {
        response = await instance['get'](`${api.url}/${newParams.supplierId}`, config);
      } catch (err) {
        response = err;
      }
    } else if (api.method === 'putParam') {
      try {
        response = await instance['put'](`${api.url}/${newParams.regionCode}`, config);
      } catch (err) {
        response = err;
      }
    }
    return response;
  };
}

// 请求拦截器
instance.interceptors.request.use(
  config => {
    let data = config.data

    if (config.url === 'authentication/login') {
      config.url += `?username=${data.username}&password=${data.password}`
      // loading加载框
      Toast.loading({
        overlay: true,
        duration: 0,
        forbidClick: true, //禁止点击事件
        message: "加载中..."
      });
    }
    config.headers.Authorization = localStorage.getItem("new_token");

    return config;
  },
  () => {
    Toast.clear();
    Toast("请求错误！");
  }
);
// 响应拦截器
instance.interceptors.response.use(
  res => {
    Toast.clear();
    return res.data;
  },
  err => {
    if (err.config.url.includes('authentication/login') && err.response && err.response.status === 401) {
      Toast.clear();
      Toast(err.response.data);
    } else {
      Toast.clear();
      if (localStorage.getItem("new_token")) {
        Toast("请求错误！");
      } else {
        Toast("请重新登录");
        router.push('/')
      }
    }
  }
);

export default Http;