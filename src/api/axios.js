import axios from 'axios'

export default function http(url, params = {}, type = 'get') {
    let promise;
    return new Promise((resolve, reject) => {
        if (type == 'get') {
            let str = '';
            Object.keys(params).forEach(item => {
                console.log(item);
                str += `${item}=${params[item]}&`
            });
            if (str) {
                str = str.substring(0, str.length - 1)
            }
            //拼接完整路径
            url += `?${str}`
            promise = axios.get(url); //因为axios返回的是一个promise对象，让变量接收这个对象
        } else if (type == 'post') {
            promise = axios(url, params)
        }

        //处理promise返回的结果
        promise.then(res => {
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })

}