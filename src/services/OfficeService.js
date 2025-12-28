import ApiService from './ApiService'

// ======================
// OFFICES
// ======================

export async function apiGetOffices(params) {
    return ApiService.fetchData({
        url: '/offices',
        method: 'GET',
        params,
    })
}

