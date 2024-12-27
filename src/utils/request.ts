import axios from 'axios'
import router from '../router';
import { getToken, removeToken } from './auth';
import { message } from 'ant-design-vue';
// 创建axios实例
const request = axios.create({
    baseURL: '/api',// 所有的请求地址前缀部分
    timeout: 80000, // 请求超时时间(毫秒)
    withCredentials: true,// 异步请求携带cookie
    // headers: {
    // 设置后端需要的传参类型
    // 'Content-Type': 'application/json',
    // 'token': x-auth-token',//一开始就要token
    // 'X-Requested-With': 'XMLHttpRequest',
    // },
})
 
// request拦截器
request.interceptors.request.use(
    config => {
        let token = getToken();
        if (token) {
            // 添加请求头
            // config.headers["Authorization"]="Bearer "+ token
            config.headers["token"]= token
        } 
        else {
            config.headers["token"]= ""
            if(router.currentRoute.value.path!=='/login'&&router.currentRoute.value.path!=='/user/send_sms'){
                message.error("token失效，请重新登录");
                router.push("/login");
            }
        }
        return config
    },
    error => {
        // 对请求错误做些什么
        Promise.reject(error)
    }
)
 
// response 拦截器
request.interceptors.response.use(
    response => {
        // 对响应数据做点什么
        if (response.data.status === 401) {
            // token失效，跳转到登录页面
            localStorage.removeItem("Admin-Token");
            removeToken();
            router.push("/login");
        }
        return response.data
    },
    error => {  
        // 401 token失效
        if(error.response.status===401){
            message.error("token失效，请重新登录");
            localStorage.removeItem("Admin-Token");
            removeToken();
            router.push("/login");
        }

        if(error.response.status===500){
            message.error("服务器错误，请稍后再试");
        }
        return Promise.reject(error)
    }
)
export default request