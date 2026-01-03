import ApiService from './ApiService'

// ======================
// MEASURES (Unidades de Medida)
// ======================

export async function apiGetMeasures(params) {
    return ApiService.fetchData({
        url: '/measures',
        method: 'GET',
        params,
    })
}

export async function apiStoreMeasure(data) {
    let url = '/measures'
    let method = 'POST'

    if (data.id) {
        url = '/measures/' + data.id
        method = 'PUT'
    }

    return ApiService.fetchData({
        url,
        method,
        data,
    })
}

export async function apiDeleteMeasure(id) {
    return ApiService.fetchData({
        url: '/measures/' + id,
        method: 'DELETE',
    })
}

