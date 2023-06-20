import axios from 'axios'
import { useUserStore } from '../stores'
import router from '../router'
// import md5 from 'js-md5'

// 设置全局的请求次数，请求的间隙
axios.defaults.retry = 2
axios.defaults.retryDelay = 1000
// http://192.168.3.244:5001
const baseURL = (process.env.NODE_ENV === "development") ? "http://szr.zwstk.cn/api" : `https://adminsix.dpj0413.xyz`;
// 创建axios实例
const service = axios.create({
    baseURL, // api 的 base_url
    timeout: 30000, // 请求超时时间
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'type': 2,
        'oemid': 2,
    }
})

let loading = null
// request拦截器
service.interceptors.request.use(
    config => {
        if (config.loading) {
            loading = ElLoading.service({ lock: true, text: 'Loading', background: 'rgba(255, 255, 255, 0.6)' })
        }
        const userStore = useUserStore()
        if (userStore.token) {
            config.headers['Authorization'] = 'Bearer ' + userStore.token // 让每个请求携带自定义token 请根据实际情况自行修改
        }
        return config
    },
    error => {
        // Do something with request error
        Promise.reject(error)
    }
)
// response 拦截器
service.interceptors.response.use(
    response => {
        if (response.config.loading) {
            loading.close()
        }
        const res = response.data
        if (res) {
            if (res.code === 0) { // code 为0请求正常
                return res
            } else {
                // 先提示错误信息
                if (res.message) {
                    ElMessage({ type: 'warning', message: res.message, offset: 100 })
                }
                /**
                 * '700003' => '认证失败',
                 * '700004' => '当前用户已经过期(登录超时)'
                 */
                const userStore = useUserStore()
                switch (res.code) {
                    case 700003: // 刷新用户 token
                        userStore.$reset()
                        router.replace('/login')
                        break;
                    case 700004: // 登录超时，退出登录状态
                        userStore.logOut()
                        router.replace('/login')
                        break;
                }
                return Promise.reject(res)
            }
        } else {
            // ElMessage({ type: 'warning', message: '请求成功，返回值错误', offset: 100 })
            return Promise.reject('error', response)
        }
    },
    error => {
        if (loading) {
            loading.close()
        }
        // http响应状态码
        const resposeCode = {
            '301': '请求需要重定向',
            '400': '网络错误，请重新尝试',
            '403': '请求被拒绝',
            '404': '请求资源不存在',
            '500': '服务器错误',
        }
        const response = error.response || { status: 400 }
        const status = response.status
        ElMessage({ type: 'error', message:  resposeCode[status], offset: 100 })
        return Promise.reject(error)
    }
)

export default service

//只会调用一次接口，共享返回的promise
/*function query(requestHash, fun, ...params) {
    let res = Storage.get(requestHash);
    if (!res || res.code !== 0 || (Array.isArray(res.data) && res.data.length === 0)) {
        //不存在就请求
        return fun(...params).then(response => {
            Storage.set(requestHash, response, params[2]);
            return response;
        }).catch(function (error) {
            throw error;
        });
    } else {
        //存在就返回本地存储中的数据
        return res;
    }
}
export const http_share = (...params) => {
    var url = params[0];
    var requestHash = md5.hex(url + JSON.stringify(params));
    //var requestHash = new Md5().update(url + '[POST]' + qs.stringify(params)).digest('hex');
    return query(requestHash, service, ...params);
};*/
