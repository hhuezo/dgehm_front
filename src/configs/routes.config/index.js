import React from 'react'
import authRoute from './authRoute'

export const publicRoutes = [
    ...authRoute
]

export const protectedRoutes = [

    {
        key: 'home',
        path: '/home',
        component: React.lazy(() => import('views/Home')),
        permissions: [], // Acceso general
    },

    {
        key: 'security.permissions',
        path: '/security/permissions',
        component: React.lazy(() => import('views/security/Permissions')),
        permissions: ['permissions.view'],
    },

    {
        key: 'security.roles',
        path: '/security/roles',
        component: React.lazy(() => import('views/security/Roles')),
        permissions: ['roles.view'],
    },

    {
        key: 'security.users',
        path: '/security/users',
        component: React.lazy(() => import('views/security/Users')),
        permissions: ['users.view'],
    },





    {
        key: 'warehouse.purchaseOrder',
        path: '/warehouse/purchaseOrder',
        component: React.lazy(() => import('views/warehouse/PurchaseOrder')),
        permissions: ['wh.purchase_order.view'],
    },

    // NUEVA RUTA: Vista de detalles, gestión de productos e ítems del Acta
    {
        key: 'warehouse.purchaseOrderDetails',
        // Usamos :id para capturar el ID de la orden de compra
        path: '/warehouse/purchaseOrder/:id',
        component: React.lazy(() => import('views/warehouse/PurchaseOrderItemDetails')), // Asegúrate de crear este componente
        permissions: ['wh.purchase_order.show'],
    },


    {
        key: 'warehouse.supplyRequest',
        path: '/warehouse/supplyRequest',
        component: React.lazy(() => import('views/warehouse/SupplyRequest')),
        permissions: ['wh.supply_request.view'],
    },


    {
        key: 'warehouse.supplyRequestDetails',
        // ¡Ruta CORREGIDA! Debe coincidir con 'supply-request' que usa la tabla.
        path: '/warehouse/supply-request/:id',
        component: React.lazy(() => import('views/warehouse/SupplyRequestItemDetails')),
        permissions: ['wh.supply_request.show'],
    },

    {
        key: 'warehouse.Kardex',
        path: '/warehouse/Kardex',
        component: React.lazy(() => import('views/warehouse/Kardex')),
        permissions: ['wh.products.kardex'],
    },

    {
        key: 'warehouse.supplyReturn',
        path: '/warehouse/supplyReturn',
        component: React.lazy(() => import('views/warehouse/SupplyReturn')),
        permissions: ['wh.supply_request.view'],
    },

    {
        key: 'warehouse.supplyReturnDetails',
        path: '/warehouse/supply-return/:id',
        component: React.lazy(() => import('views/warehouse/SupplyReturnItemDetails')),
        permissions: ['wh.supply_request.show'],
    },
    {
        key: 'inventary-reports',
        path: '/warehouse/reports',
        component: React.lazy(() => import('views/warehouse/InventoryReports')),
        permissions: ['wh.products.view'],
    },

    {
        key: 'catalog.offices',
        path: '/catalog/offices',
        component: React.lazy(() => import('views/catalog/Offices')),
        permissions: ['wh.offices.view'],
    },

    {
        key: 'catalog.measures',
        path: '/catalog/measures',
        component: React.lazy(() => import('views/catalog/Measures')),
        permissions: ['wh.measures.view'],
    },

    {
        key: 'catalog.suppliers',
        path: '/catalog/suppliers',
        component: React.lazy(() => import('views/catalog/Suppliers')),
        permissions: ['wh.suppliers.view'],
    },

    {
        key: 'catalog.accountingAccounts',
        path: '/catalog/accountingAccounts',
        component: React.lazy(() => import('views/catalog/AccountingAccounts')),
        permissions: ['wh.accounting_account.view'],
    },

    {
        key: 'catalog.products',
        path: '/catalog/products',
        component: React.lazy(() => import('views/catalog/Products')),
        permissions: ['wh.products.view'],
    },


]
