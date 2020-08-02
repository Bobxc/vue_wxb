import { request } from 'network/request'

export function postLogin(username, password) {
    return request({
        url: '/login',
        params: {
            username,
            password
        }
    })
}