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
        url: '/suppliers',
        method: 'GET',
        params,
    })
}




export async function apiGetProducts(params) {
    return ApiService.fetchData({
        url: '/products',
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


export async function apiDeleteSupplyRequestItem(id) {
    return ApiService.fetchData({
        url: '/supply_request_detail/' + id,
        method: 'DELETE',
    })
}












export async function apiGetSupplyRequests(params) {
    return ApiService.fetchData({
        url: '/supply_request',
        method: 'GET',
        params,
    })
}

export async function apiGetSupplyRequest(id) {
    return ApiService.fetchData({
        url: '/supply_request/' + id,
        method: 'GET',
    })
}

export async function apiStoreSupplyRequest(data) {
    let url = '/supply_request'
    let method = 'POST'

    if (data.id) {
        url = '/supply_request/' + data.id
        method = 'PUT'
    }

    return ApiService.fetchData({
        url,
        method,
        data,
    })
}

export async function apiDeleteSupplyRequest(id) {
    return ApiService.fetchData({
        url: '/supply_request/' + id,
        method: 'DELETE',
    })
}

export async function apiGetBosses(id) {
    return ApiService.fetchData({
        url: '/offices/' + id + '/bosses',
        method: 'GET',
    })
}

export async function apiGetAdministrativeTechnicians() {
    return ApiService.fetchData({
        url: '/administrative_technicians',
        method: 'GET',
    })
}

export async function apiGetSupplyRequestDetail(id) {
    return ApiService.fetchData({
        url: '/supply_request_detail/' + id,
        method: 'GET',
    })
}

export async function apiStoreSupplyRequestItem(data) {
    let url = '/supply_request_detail'
    let method = 'POST'

    if (data.id) {
        url = '/supply_request_detail/' + data.id
        method = 'PUT'
    }

    return ApiService.fetchData({
        url,
        method,
        data,
    })
}

export async function apiGetPdfSupplyRequest(id) {
    return ApiService.fetchData({
        url: '/supply_request/pdf/' + id,
        method: 'GET',
        responseType: 'blob',
    })
}

export async function apiSendSupplyRequest(id) {
    return ApiService.fetchData({
        url: '/supply_request/send/' + id,
        method: 'POST',
    })
}


export async function apiApproveSupplyRequest(id) {
    return ApiService.fetchData({
        url: '/supply_request/approve/' + id,
        method: 'POST',
    })
}

export async function apiFinalizeSupplyRequest(id) {
    return ApiService.fetchData({
        url: '/supply_request/finalize/' + id,
        method: 'POST',
    })
}


export async function apiRejectSupplyRequest(id) {
    return ApiService.fetchData({
        url: '/supply_request/reject/' + id,
        method: 'POST',
    })
}

export async function apiGetKardexMovements(productId, filters) {
    return ApiService.fetchData({
        url: `/products/${productId}/kardex`,
        method: 'GET',
        params: filters,
    });
}

export async function apiGetProductShow(productId) {
    return ApiService.fetchData({
        url: `/products/${productId}/existencia`,
        method: 'GET',
    });
}


// ======================
// SUPPLY RETURNS (DEVOLUCIONES DE SUMINISTROS)
// ======================

export async function apiGetSupplyReturns(params) {
    return ApiService.fetchData({
        url: '/supply_return',
        method: 'GET',
        params,
    })
}

export async function apiGetSupplyReturn(id) {
    return ApiService.fetchData({
        url: '/supply_return/' + id,
        method: 'GET',
    })
}

export async function apiStoreSupplyReturn(data) {
    let url = '/supply_return'
    let method = 'POST'

    if (data.id) {
        url = '/supply_return/' + data.id
        method = 'PUT'
    }

    return ApiService.fetchData({
        url,
        method,
        data,
    })
}

export async function apiDeleteSupplyReturn(id) {
    return ApiService.fetchData({
        url: '/supply_return/' + id,
        method: 'DELETE',
    })
}


// ======================
// SUPPLY RETURN DETAIL (ÍTEMS DE DEVOLUCIÓN)
// ======================

export async function apiGetSupplyReturnDetail(id) {
    return ApiService.fetchData({
        url: '/supply_return_detail/' + id,
        method: 'GET',
    })
}


export async function apiStoreSupplyReturnItem(data) {
    let url = '/supply_return_detail'
    let method = 'POST'

    if (data.id) {
        url = '/supply_return_detail/' + data.id
        method = 'PUT'
    }

    return ApiService.fetchData({
        url,
        method,
        data,
    })
}


export async function apiDeleteSupplyReturnItem(id) {
    return ApiService.fetchData({
        url: '/supply_return_detail/' + id,
        method: 'DELETE',
    })
}
