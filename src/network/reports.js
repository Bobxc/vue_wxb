import { request } from 'network/request'

export function getReports() {
    return request({
        url: '/reports/type/1',
        method: 'get'
    })
}