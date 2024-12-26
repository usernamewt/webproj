import axios from 'axios'
import router from '../router';
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
        let token = localStorage.getItem("Admin-Token");
        if (token) {
            // 添加请求头
            config.headers["Authorization"]="Bearer "+ token
        } 
        // else {
        //     router.push("/login");
        // }
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
        if (response.data.code === 401) {
            // token失效，跳转到登录页面
            localStorage.removeItem("Admin-Token");
            router.push("/login");
        }
        return response.data
    },
    error => {  
        // 对响应错误做点什么
        return Promise.reject(error)
    }
)
export default request