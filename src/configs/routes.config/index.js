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
]
