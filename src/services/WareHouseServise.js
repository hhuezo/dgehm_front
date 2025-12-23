import ApiService from './ApiService'

// ======================
// PURCHASE ORDERS
// ======================

export async function apiGetPurchaseOrders(params) {
    return ApiService.fetchData({
        url: '/purchase_order',
        method: 'GET',
        params,
    })
}

export async function apiGetPurchaseOrder(id) {
    return ApiService.fetchData({
        url: '/purchase_order/' + id,
        method: 'GET',
    })
}

export async function apiStorePurchaseOrder(data) {
    let url = '/purchase_order'
    let method = 'POST'

    if (data.id) {
        url = '/purchase_order/' + data.id
        method = 'PUT'
    }

    return ApiService.fetchData({
        url,
        method,
        data,
    })
}

export async function apiGetActaPurchaseOrder(id) {
    return ApiService.fetchData({
        url: '/purchase_order/acta/' + id,
        method: 'GET',
        responseType: 'blob',
    })
}


export async function apiDeletePurchaseOrder(id) {
    return ApiService.fetchData({
        url: '/purchase_order/acta' + id,
        method: 'DELETE',
    })
}


// ======================
// SUPPLIERS (PROVEEDORES)
// ======================

export async function apiGetSuppliers(params) {
    return ApiService.fetchData({
        url: '/supplier',
        method: 'GET',
        params,
    })
}




export async function apiGetProducts(params) {
    return ApiService.fetchData({
        url: '/product',
        method: 'GET',
        params,
    })
}


export async function apiGetPurchaseOrderDetail(id) {
    return ApiService.fetchData({
        url: '/purchase_order_detail/' + id,
        method: 'GET',
    })
}


export async function apiStorePurchaseOrderItem(data) {
    let url = '/purchase_order_detail'
    let method = 'POST'

    if (data.id) {
        url = '/purchase_order_detail/' + data.id
        method = 'PUT'
    }

    return ApiService.fetchData({
        url,
        method,
        data,
    })
}

export async function apiDeletePurchaseOrderItem(id) {
    return ApiService.fetchData({
        url: '/purchase_order_detail/' + id,
        method: 'DELETE',
    })
}

