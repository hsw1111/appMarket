import axios from 'axios'
import env from '../js/env'
import { Message } from 'iview';

let baseURL = env.apiPath

axios.defaults.baseURL = baseURL;
axios.defaults.withCredentials=true;

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;';
axios.defaults.headers.get['Content-Type'] = 'application/x-www-form-urlencoded;';


// http request 拦截器
axios.interceptors.request.use(
    config => {
        let token = window.localStorage.getItem('token')
        let url = config.url
        if (token) {
            if(config.method=='post'&& url!=(baseURL+'file/uploa')){
                config.data = {
                    ...config.data,
                    token: token,
                }
            }else if(config.method=='get'){
                config.params = {
                    token: token,
                    ...config.params
                }
            }
        }
        return config;
    },
    err => {
        return Promise.reject(err);
    });
var count = 0
// http response 拦截器
axios.interceptors.response.use(
    response => {
            // 会话超时
            if(response.data.erroCode=='1'||response.data.erroCode=='2'){
                if(count==0){
                    Message.error({content:response.data.msg,duration:3})
                    count++
                }
                window.localStorage.clear()
                window.location.hash='/login'
            }else if(response.data.success=='0'){
                Message.error({content:response.data.msg,duration:3})
            }
        return response.data;
    },
    error => {
        var p = Promise.reject(error)
        p.catch(error=>{
            console.log(error)
        })
        return p
    });
export default axios;
