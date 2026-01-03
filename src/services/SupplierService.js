import ApiService from './ApiService'

// ======================
// SUPPLIERS (Proveedores)
// ======================

export async function apiGetSuppliers(params) {
    return ApiService.fetchData({
        url: '/suppliers',
        method: 'GET',
        params,
    })
}

export async function apiStoreSupplier(data) {
    let url = '/suppliers'
    let method = 'POST'

    if (data.id) {
        url = '/suppliers/' + data.id
        method = 'PUT'
    }

    return ApiService.fetchData({
        url,
        method,
        data,
    })
}

export async function apiDeleteSupplier(id) {
    return ApiService.fetchData({
        url: '/suppliers/' + id,
        method: 'DELETE',
    })
}

