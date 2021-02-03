import Vue from 'vue'
import store from './Store.js'
import axios from 'axios';
import router from './router'
import $ from 'jquery'
import { Message } from 'element-ui';

// function getDeviceId(){
//   var num = Math.ceil((new Date().getTime()/1000)-Vue.prototype.serverStaticData.timestamp);
//   return num;
// }

// axios.defaults.baseURL = myConst.apiUrl;
// axios.defaults.baseURL = "http://192.168.2.163:80"  //"http://laravel.test"
// curl -X POST "http://laravel.test/api/pad/login" -H  "accept: application/json" -H  "Content-Type: application/json" -H  "X-CSRF-TOKEN: " -d "{\"name\":\"G1\",\"card\":\"E0555\",\"password\":\"123456\"}"
var config = {
  // deviceId:"",
  accept:"application/json",
  "Content-Type":"application/json",
  "X-CSRF-TOKEN":"",
  // userType:"staff",
  Authorization:"",
  // 'Content-Type':"application/x-www-form-urlencoded"
}
axios.defaults.headers.post = config;
// axios.defaults.transformRequest = [function (data) {
//       let src = ''
//       for (let item in data) {
//         src += encodeURIComponent(item) + '=' + encodeURIComponent(data[item]) + '&'
//       }
//       return src
//     }]
// 请求拦截
axios.interceptors.request.use((req) => {//发送请求
  console.log("请求字段",req)
    if(localStorage.getItem("logdata")){
      req.headers.Authorization = "Bearer " + localStorage.getItem("logdata")
    }
    // if(localStorage.getItem("deviceId")){
    //   req.headers.deviceId = localStorage.getItem("deviceId")
    // }
  // if((reqNumObj[req.url] === undefined) || reqNumObj[req.url] != 1){
  //   reqNumObj[req.url] = 1;
  //   return req;
  // }
  return req;
},(error)=>{
  // Do something with request error
  return Promise.reject(error);
});
//响应拦截
let reqNumObj = {}
axios.interceptors.response.use((res) => {
  console.log("响应字段",res)
  if (res.data.code == 1001) { // 百度云请求超时检测
    Message.error('请求超时!');
  }else if(res.data.code == 1 || res.data.code == 11001){ //请求失败
    Message({message:res.data.message,type: 'warning'});
  }else if(res.data.code == 99993){
    router.push("/login")
  }else if(res.data.code != 0){
    if(res.data.message){
      Message({message:res.data.message,type: 'warning'});
    }
  }
  //下面的注释仅仅只针对于该项目，别的项目需要打开
  /*  if (res.data.code !== 200) {
    window.alert('数据返回有误')
    return Promise.reject(res)
  }*/
  reqNumObj[res.request.responseURL] = 0;
  return res
}, (error) => { //请求报错
  console.log('promise error:' + error)
  return Promise.reject(error)
})

// axios.prototype.getDeviceId = function(){
//   var num = String(Math.ceil((new Date().getTime()/1000)-this.serverStaticData.timestamp));
//   this.defaults.headers.post['DeviceId'] = num;
// }
Vue.prototype.$http = axios;
export default axios
