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

export function getRightsList(type) {
    return request({
        url: `/rights/${type}`,
        method: 'get',
        params: {
            type: type
        }
    })
}

export function getRoles() {
    return request({
        url: '/roles',
        method: 'get'
    })
}
//删除角色指定权限
export function deleteRoleRight(roleId, rightId) {
    return request({
        url: `roles/${roleId}/rights/${rightId}`,
        method: 'delete'
    })
}
//获取权限数据
export function getRightsTree(type) {
    return request({
        url: `rights/${type}`,
        method: 'get',
        params: {
            type: type
        }
    })
}
//为角色分配权限
export function postAllotRights(roleId, rids) {
    return request({
        url: `roles/${roleId}/rights`,
        method: 'post',
        data: {
            roleId: roleId,
            rids: rids
        }
    })
}
//分配用户角色
export function putUserRole(id, rid) {
    return request({
        url: `users/${id}/role`,
        method: 'put',
        data: {
            rid: rid
        }
    })
}