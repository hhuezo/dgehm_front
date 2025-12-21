import ApiService from './ApiService'

// ======================
// PERMISSIONS
// ======================

export async function apiGetPermissions(params) {
    return ApiService.fetchData({
        url: '/permission',
        method: 'GET',
        params,
    })
}

export async function apiGetPermission(id) {
    return ApiService.fetchData({
        url: '/permission/' + id,
        method: 'GET',
    })
}

export async function apiStorePermission(data) {
    let url = '/permission'
    let method = 'POST'

    if (data.id) {
        url = '/permission/' + data.id
        method = 'PUT'
    }

    return ApiService.fetchData({
        url,
        method,
        data,
    })
}

export async function apiDeletePermission(id) {
    return ApiService.fetchData({
        url: '/permission/' + id,
        method: 'DELETE',
    })
}

// ======================
// ROLES
// ======================

export async function apiGetRoles(params) {
    return ApiService.fetchData({
        url: '/role',
        method: 'GET',
        params,
    })
}

export async function apiGetRole(id) {
    return ApiService.fetchData({
        url: '/role/' + id,
        method: 'GET',
    })
}

export async function apiStoreRole(data) {
    let url = '/role'
    let method = 'POST'

    if (data.id) {
        url = '/role/' + data.id
        method = 'PUT'
    }

    return ApiService.fetchData({
        url,
        method,
        data,
    })
}

export async function apiShowRole(id) {
    return ApiService.fetchData({
        url: '/role/' + id,
        method: 'GET',
    })
}

export async function togglePermission(data) {
    return ApiService.fetchData({
        url: '/role/togglePermission',
        method: 'POST',
        data: data,
    })
}

// ======================
// USERS
// ======================

export async function apiGetUsers(params) {
    return ApiService.fetchData({
        url: '/users',
        method: 'GET',
        params,
    })
}

export async function apiGetUser(id) {
    return ApiService.fetchData({
        url: '/users/' + id,
        method: 'GET',
    })
}

export async function apiStoreUser(data) {
    let url = '/users'
    let method = 'POST'

    if (data.id) {
        url = '/users/' + data.id
        method = 'PATCH'
    }

    return ApiService.fetchData({
        url,
        method,
        data,
    })
}

export async function apiDeleteUser(id) {
    return ApiService.fetchData({
        url: '/users/' + id,
        method: 'DELETE',
    })
}
