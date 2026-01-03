import ApiService from './ApiService'

// ======================
// PRODUCTS (Productos)
// ======================

export async function apiGetProducts(params) {
    return ApiService.fetchData({
        url: '/products',
        method: 'GET',
        params,
    })
}

export async function apiStoreProduct(data) {
    let url = '/products'
    let method = 'POST'

    if (data.id) {
        url = '/products/' + data.id
        method = 'PUT'
    }

    return ApiService.fetchData({
        url,
        method,
        data,
    })
}

export async function apiDeleteProduct(id) {
    return ApiService.fetchData({
        url: '/products/' + id,
        method: 'DELETE',
    })
}

