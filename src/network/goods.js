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
//编辑提交分类
export function putEditCategories(data) {
    return request({
        url: `/categories/${data.id}`,
        method: 'put',
        data: data
    })
}
//删除分类
export function deleteCategories(id) {
    return request({
        url: `/categories/${id}`,
        method: 'delete',
        data: id
    })
}