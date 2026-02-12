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
    const id = data.id
    const payload = {
        name: data.name?.trim() ?? '',
        guard_name: data.guard_name || 'web',
        permission_type_id: data.permission_type_id || null,
    }
    if (id) {
        return ApiService.fetchData({
            url: '/permission/' + id,
            method: 'PUT',
            data: payload,
        })
    }
    return ApiService.fetchData({
        url: '/permission',
        method: 'POST',
        data: payload,
    })
}

export async function apiDeletePermission(id) {
    return ApiService.fetchData({
        url: '/permission/' + id,
        method: 'DELETE',
    })
}

// ======================
// PERMISSION TYPES
// ======================

export async function apiGetPermissionTypes(params) {
    return ApiService.fetchData({
        url: '/permission_type',
        method: 'GET',
        params,
    })
}

export async function apiGetPermissionType(id) {
    return ApiService.fetchData({
        url: '/permission_type/' + id,
        method: 'GET',
    })
}

export async function apiStorePermissionType(data) {
    const id = data.id
    const payload = {
        name: data.name?.trim() ?? '',
        is_active: data.is_active !== false,
    }
    if (id) {
        return ApiService.fetchData({
            url: '/permission_type/' + id,
            method: 'PUT',
            data: payload,
        })
    }
    return ApiService.fetchData({
        url: '/permission_type',
        method: 'POST',
        data: payload,
    })
}

export async function apiDeletePermissionType(id) {
    return ApiService.fetchData({
        url: '/permission_type/' + id,
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
        method = 'PUT'
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

export async function apiSyncUserRoles(userId, roleIds) {
    return ApiService.fetchData({
        url: '/users/' + userId + '/roles',
        method: 'POST',
        data: { role_ids: roleIds },
    })
}

export async function apiSyncUserOffices(userId, officeIds) {
    return ApiService.fetchData({
        url: '/users/' + userId + '/offices',
        method: 'POST',
        data: { office_ids: officeIds },
    })
}
