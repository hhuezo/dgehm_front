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
        authority: [],
    },

    {
        key: 'security.permissions',
        path: '/security/permissions',
        component: React.lazy(() => import('views/security/Permissions')),
        authority: [],
    },

    {
        key: 'security.roles',
        path: '/security/roles',
        component: React.lazy(() => import('views/security/Roles')),
        authority: [],
    },

    {
        key: 'security.users',
        path: '/security/users',
        component: React.lazy(() => import('views/security/Users')),
        authority: [],
    },





    {
        key: 'warehouse.purchaseOrder',
        path: '/warehouse/purchaseOrder',
        component: React.lazy(() => import('views/warehouse/PurchaseOrder')),
        authority: [],
    },

    // NUEVA RUTA: Vista de detalles, gestión de productos e ítems del Acta
    {
        key: 'warehouse.purchaseOrderDetails',
        // Usamos :id para capturar el ID de la orden de compra
        path: '/warehouse/purchaseOrder/:id',
        component: React.lazy(() => import('views/warehouse/PurchaseOrderItemDetails')), // Asegúrate de crear este componente
        authority: [],
    },


    {
        key: 'warehouse.supplyRequest',
        path: '/warehouse/supplyRequest',
        component: React.lazy(() => import('views/warehouse/SupplyRequest')),
        authority: [],
    },


    {
        key: 'warehouse.supplyRequestDetails',
        // ¡Ruta CORREGIDA! Debe coincidir con 'supply-request' que usa la tabla.
        path: '/warehouse/supply-request/:id',
        component: React.lazy(() => import('views/warehouse/SupplyRequestItemDetails')),
        authority: [],
    },

    {
        key: 'warehouse.Kardex',
        path: '/warehouse/Kardex',
        component: React.lazy(() => import('views/warehouse/Kardex')),
        authority: [],
    },

]
