import ApiService from './ApiService'

// ======================
// ACCOUNTING ACCOUNTS (Cuentas Contables)
// ======================

export async function apiGetAccountingAccounts(params) {
    return ApiService.fetchData({
        url: '/accounting_account',
        method: 'GET',
        params,
    })
}

export async function apiStoreAccountingAccount(data) {
    let url = '/accounting_account'
    let method = 'POST'

    if (data.id) {
        url = '/accounting_account/' + data.id
        method = 'PUT'
    }

    return ApiService.fetchData({
        url,
        method,
        data,
    })
}

export async function apiDeleteAccountingAccount(id) {
    return ApiService.fetchData({
        url: '/accounting_account/' + id,
        method: 'DELETE',
    })
}

