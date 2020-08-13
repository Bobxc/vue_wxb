import { request } from 'network/request'

//商品列表数据
export function getGoods(data) {
    return request({
        url: '/goods',
        method: 'get',
        params: data
    })
}
//商品分类数据列表
export function getCategories(data) {
    return request({
        url: '/categories',
        method: 'get',
        params: data
    })
}
//添加分类
export function postCategories(data) {
    return request({
        url: '/categories',
        method: 'post',
        data: data
    })
}