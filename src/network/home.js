import { request } from 'network/request';

export function menuList() {
    return request({
        url: '/menus'
    })
}

export function userList(query, pagenum, pagesize) {
    return request({
        url: '/users',
        params: {
            query,
            pagenum,
            pagesize
        }
    })
}

export function userState(uId, type) {
    return request({
        url: `/users/${uId}/state/${type}`,
        method: 'put'
    })
}

export function postAddUser(data) {
    return request({
        url: '/users',
        data: data,
        method: 'post'
    })
}

export function getUser(id) {
    return request({
        url: `/users/${id}`,
        method: 'get'
    })
}

export function putEditUser(params) {
    return request({
        url: `/users/${params.id}`,
        data: params,
        method: 'put'
    })
}

export function deleteRemoveUser(id) {
    return request({
        url: `/users/${id}`,
        method: 'delete'
    })
}