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
        permissions: ['permissions view'],
    },

    {
        key: 'security.roles',
        path: '/security/roles',
        component: React.lazy(() => import('views/security/Roles')),
        permissions: ['roles view'],
    },

    {
        key: 'security.users',
        path: '/security/users',
        component: React.lazy(() => import('views/security/Users')),
        permissions: ['users view'],
    },

    {
        key: 'security.permissionTypes',
        path: '/security/permission-types',
        component: React.lazy(() => import('views/security/PermissionTypes')),
        permissions: ['permission_type view'],
    },


    {
        key: 'warehouse.purchaseOrder',
        path: '/warehouse/purchaseOrder',
        component: React.lazy(() => import('views/warehouse/PurchaseOrder')),
        permissions: ['purchase_order view'],
    },

    // NUEVA RUTA: Vista de detalles, gestión de productos e ítems del Acta
    {
        key: 'warehouse.purchaseOrderDetails',
        // Usamos :id para capturar el ID de la orden de compra
        path: '/warehouse/purchaseOrder/:id',
        component: React.lazy(() => import('views/warehouse/PurchaseOrderItemDetails')), // Asegúrate de crear este componente
        permissions: ['purchase_order show'],
    },


    {
        key: 'warehouse.supplyRequest',
        path: '/warehouse/supplyRequest',
        component: React.lazy(() => import('views/warehouse/SupplyRequest')),
        permissions: ['supply_request view'],
    },


    {
        key: 'warehouse.supplyRequestDetails',
        // ¡Ruta CORREGIDA! Debe coincidir con 'supply-request' que usa la tabla.
        path: '/warehouse/supply-request/:id',
        component: React.lazy(() => import('views/warehouse/SupplyRequestItemDetails')),
        permissions: ['supply_request show'],
    },

    {
        key: 'warehouse.Kardex',
        path: '/warehouse/Kardex',
        component: React.lazy(() => import('views/warehouse/Kardex')),
        permissions: ['products kardex'],
    },

    {
        key: 'warehouse.supplyReturn',
        path: '/warehouse/supplyReturn',
        component: React.lazy(() => import('views/warehouse/SupplyReturn')),
        permissions: ['supply_request view'],
    },

    {
        key: 'warehouse.supplyReturnDetails',
        path: '/warehouse/supply-return/:id',
        component: React.lazy(() => import('views/warehouse/SupplyReturnItemDetails')),
        permissions: ['supply_request show'],
    },
    {
        key: 'inventary-reports',
        path: '/warehouse/reports',
        component: React.lazy(() => import('views/warehouse/InventoryReports')),
        permissions: ['products view'],
    },

    {
        key: 'catalog.offices',
        path: '/catalog/offices',
        component: React.lazy(() => import('views/catalog/Offices')),
        permissions: ['offices view'],
    },

    {
        key: 'catalog.measures',
        path: '/catalog/measures',
        component: React.lazy(() => import('views/catalog/Measures')),
        permissions: ['measures view'],
    },

    {
        key: 'catalog.suppliers',
        path: '/catalog/suppliers',
        component: React.lazy(() => import('views/catalog/Suppliers')),
        permissions: ['suppliers view'],
    },

    {
        key: 'catalog.accountingAccounts',
        path: '/catalog/accountingAccounts',
        component: React.lazy(() => import('views/catalog/AccountingAccounts')),
        permissions: ['accounting_account view'],
    },

    {
        key: 'catalog.products',
        path: '/catalog/products',
        component: React.lazy(() => import('views/catalog/Products')),
        permissions: ['products view'],
    },

    // Catalogos activo fijo
    {
        key: 'catalog.fixed.institution',
        path: '/catalog-fixed/institution',
        component: React.lazy(() => import('views/catalog/fixed/Institution')),
        permissions: ['institutions view'],
    },
    {
        key: 'catalog.fixed.organizationalUnitType',
        path: '/catalog-fixed/organizational-unit-type',
        component: React.lazy(() => import('views/catalog/fixed/OrganizationalUnitType')),
        permissions: ['organizational_unit_types view'],
    },
    {
        key: 'catalog.fixed.organizationalUnit',
        path: '/catalog-fixed/organizational-unit',
        component: React.lazy(() => import('views/catalog/fixed/OrganizationalUnit')),
        permissions: ['organizational_units view'],
    },
    {
        key: 'catalog.fixed.organizationalUnitConfig',
        path: '/catalog-fixed/organizational-unit-config',
        component: React.lazy(() => import('views/catalog/fixed/OrganizationalUnitConfig')),
        permissions: ['organizational_units tree'],
    },
    {
        key: 'catalog.fixed.especifico',
        path: '/catalog-fixed/especifico',
        component: React.lazy(() => import('views/catalog/fixed/Especifico')),
        permissions: ['specifics view'],
    },
    {
        key: 'catalog.fixed.clase',
        path: '/catalog-fixed/clase',
        component: React.lazy(() => import('views/catalog/fixed/Clase')),
        permissions: ['classes view'],
    },
    {
        key: 'catalog.fixed.category',
        path: '/catalog-fixed/category',
        component: React.lazy(() => import('views/catalog/fixed/Category')),
        permissions: ['categories view'],
    },
    {
        key: 'catalog.fixed.procedencia',
        path: '/catalog-fixed/procedencia',
        component: React.lazy(() => import('views/catalog/fixed/Procedencia')),
        permissions: ['origins view'],
    },
    {
        key: 'catalog.fixed.estadoFisico',
        path: '/catalog-fixed/estado-fisico',
        component: React.lazy(() => import('views/catalog/fixed/EstadoFisico')),
        permissions: ['physical_conditions view'],
    },
    {
        key: 'catalog.fixed.vehiculoMarca',
        path: '/catalog-fixed/vehiculo-marca',
        component: React.lazy(() => import('views/catalog/fixed/VehiculoMarca')),
        permissions: ['vehicle_brands view'],
    },
    {
        key: 'catalog.fixed.vehiculoTraccion',
        path: '/catalog-fixed/vehiculo-traccion',
        component: React.lazy(() => import('views/catalog/fixed/VehiculoTraccion')),
        permissions: ['vehicle_drive_types view'],
    },
    {
        key: 'catalog.fixed.vehiculoTipo',
        path: '/catalog-fixed/vehiculo-tipo',
        component: React.lazy(() => import('views/catalog/fixed/VehiculoTipo')),
        permissions: ['vehicle_types view'],
    },
    {
        key: 'catalog.fixed.vehiculoColor',
        path: '/catalog-fixed/vehiculo-color',
        component: React.lazy(() => import('views/catalog/fixed/VehiculoColor')),
        permissions: ['vehicle_colors view'],
    },

    // Activos Fijos
    {
        key: 'fixedAssets',
        path: '/fixed-assets',
        component: React.lazy(() => import('views/fixedAssets/FixedAsset')),
        permissions: ['fixed_assets view'],
    },

]
