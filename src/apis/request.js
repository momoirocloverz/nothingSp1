/**
 * @module utils/ajax
 */
// ajax 辅助方法
import axios from 'axios';
import router from '../router/index'
import getIp from './getIp';
//import debug from 'debug';
//import { redirectLogin, removeAccessToken } from './userInfo';
// import config from '../config';
// const ajaxPrefix = config.ajaxPrefix;
// const ajaxError = debug('ajaxw:error');
// const ajaxLog = debug('ajax:log');

const defaultConfig = {
  headers: {
    // 'Access-Control-Allow-Origin': '*',  
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  // 'withCredentials': true,
  common: {
    'X-Requested-With':'XMLHttpRequest',
  },
  timeout:240000
};
const instance = axios.create(defaultConfig);
instance.interceptors.request.use(config=>{
  const token = sessionStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
},error => {
  Promise.reject(error)
});

// http response 服务器响应拦截器，
// 这里拦截超时或失效错误，并重新跳入登页重新获取token
instance.interceptors.response.use(
  response => {
    if(response.data && response.data.respCode == -2) {
      router.push({
        path: '/login',
      })
    }else{
      return response;
    }
  },
  error => {
    loadinginstace.close()
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 这里写清除token的代码
          router.push({
            path: '/login',
            // query: {redirect: router.currentRoute.fullPath}//登录成功后跳入浏览的当前页面
          })
      }
    }
    return Promise.reject(error.response.data)
  }
);

/**
 * 基于Promise的ajax请求接口
 * @param {Object} param 参考axios的config
 * @param {String} param.url ajax请求地址
 * @param {String} param.method GET/POST/PUT/PATCH/DELETE等
 * @param {String} param.params 使用GET方法传递参数时使用
 * @param {String} param.data 使用POST/PUT/PATCH/DELETE等等方法传递参数时使用
 * @return {Promise}
 */
export function request(param) {
  return new Promise((resolve, reject) => {
    instance.request(param).then(
      response => {
        const data = response.data;
        const code = data.respCode;
        if (code === 0) {
          resolve(data);
        }else {
          // if(code===-2){
          //   location.replace(`${getIp}login`)
          // }
          // 未登录或已超时、不存在或已停用企业
          // if (code === 4001) {
          //   if (config.useFrontCookie) {
          //     removeAccessToken();
          //   }
          //   redirectLogin(undefined, data.result);
          // }
          // // 权限不足，跳转到landing页面
          // else if (code === 4002) {
          //   location.replace(config.url.landing);
          // }
          reject(data);
        }
      },
      error => {
        // if (axios.isCancel(error)) {
        //   // ajaxLog(`ajax请求${param.url}被取消`, error);
        //   return;
        // }
        reject(error.response ? error.response.data : { result: error.message });
      }
    );
  });
}
