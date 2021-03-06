import axios from 'axios'
import Nprogress from 'nprogress'
import 'nprogress/nprogress.css'

export function request(config) {
    // 1.创建axios实例
    const instance = axios.create({
            baseURL: 'http://127.0.0.1:8888/api/private/v1',
            timeout: 5000
        })
        // 2.axios拦截器
        // 2.1请求拦截的作用
    instance.interceptors.request.use(config => {
            Nprogress.start();
            //为请求头对象，添加Token验证的Authorization字段
            config.headers.Authorization = window.sessionStorage.getItem('token');
            return config
        }, err => {
            console.log(err);
        })
        // 2.1相应拦截
    instance.interceptors.response.use(res => {
            Nprogress.done();
            return res.data
        }, err => {
            console.log(err);
        })
        // 3.发送真正的网络请求
    return instance(config);
}