import { NAV_ITEM_TYPE_COLLAPSE, NAV_ITEM_TYPE_ITEM } from 'constants/navigation.constant'
import { DIRECTORY_PREFIX_PATH } from 'constants/route.constant'


const navigationConfig = [

    {
        key: 'home',
        path: '/home',
        translateKey: 'Home',
        icon: 'home',
        type: NAV_ITEM_TYPE_ITEM,
        permissions: [], // Acceso general para todos los usuarios autenticados
        subMenu: []
    },
    {
        key: 'security',
        path: '',
        translateKey: 'Seguridad',
        icon: 'security',
        type: NAV_ITEM_TYPE_COLLAPSE,
        permissions: ['users.view', 'roles.view', 'permissions.view'], // Al menos uno de estos permisos
        subMenu: [
            {
                key: 'security.users',
                path: '/security/users',
                translateKey: 'Usuarios',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                permissions: ['users.view'],
                subMenu: []
            },
            {
                key: 'security.roles',
                path: '/security/roles',
                translateKey: 'Roles',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                permissions: ['roles.view'],
                subMenu: []
            },
            {
                key: 'security.permissions',
                path: '/security/permissions',
                translateKey: 'Permisos',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                permissions: ['permissions.view'],
                subMenu: []
            }
        ]
    },
    {
        key: 'inventary',
        path: '',
        translateKey: 'Inventario',
        icon: 'database',
        type: NAV_ITEM_TYPE_COLLAPSE,
        permissions: ['wh.purchase_order.view', 'wh.supply_request.view', 'wh.products.kardex'], // Al menos uno de estos permisos
        subMenu: [
            {
                key: 'warehouse.purchaseOrder',
                path: '/warehouse/purchaseOrder',
                translateKey: 'Ordenes de compra',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                permissions: ['wh.purchase_order.view'],
                subMenu: []
            },
            {
                key: 'warehouse.SupplyRequest',
                path: '/warehouse/SupplyRequest',
                translateKey: 'Solicitud de insumos',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                permissions: ['wh.supply_request.view'],
                subMenu: []
            },
            {
                key: 'warehouse.supplyReturn',
                path: '/warehouse/supplyReturn',
                translateKey: 'Devoluciones de suministros',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                permissions: ['wh.supply_request.view'], // Usa el mismo permiso que supply_request
                subMenu: []
            },

            {
                key: 'warehouse.Kardex',
                path: '/warehouse/Kardex',
                translateKey: 'Kardex',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                permissions: ['wh.products.kardex'],
                subMenu: []
            },

        ]
    },




    {
        key: 'requests',
        path: '',
        translateKey: 'Solicitudes',
        icon: 'database',
        type: NAV_ITEM_TYPE_COLLAPSE,
        permissions: ['wh.supply_request.view'], // Permiso para ver solicitudes
        subMenu: [

            {
                key: 'warehouse.SupplyRequest',
                path: '/warehouse/SupplyRequest',
                translateKey: 'Solicitud de insumos',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                permissions: ['wh.supply_request.view'],
                subMenu: []
            },
            {
                key: 'warehouse.supplyReturn',
                path: '/warehouse/supplyReturn',
                translateKey: 'Devoluciones de suministros',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                permissions: ['wh.supply_request.view'], // Usa el mismo permiso
                subMenu: []
            },
        ]
    },


    {
        key: 'inventary-reports',
        path: '/warehouse/reports',
        translateKey: 'Reportes de inventario',
        icon: 'reports',
        type: NAV_ITEM_TYPE_ITEM,
        permissions: ['wh.products.view'], // Permiso general para ver productos/inventario
        subMenu: []
    },
    {
        key: 'catalog',
        path: '',
        translateKey: 'Catalogos',
        icon: 'database',
        type: NAV_ITEM_TYPE_COLLAPSE,
<<<<<<< HEAD
        authority: [ADMIN, 'almacen-admin', 'almacen-solicitante', 'almacen-jefe-area'],
=======
        permissions: ['wh.offices.view', 'wh.measures.view', 'wh.suppliers.view', 'wh.accounting_account.view', 'wh.products.view'], // Al menos uno de estos permisos
>>>>>>> ef66bec (Session por permisos)
        subMenu: [
            {
                key: 'catalog.offices',
                path: '/catalog/offices',
                translateKey: 'Oficinas',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                permissions: ['wh.offices.view'],
                subMenu: []
            },
            {
                key: 'catalog.measures',
                path: '/catalog/measures',
                translateKey: 'Unidades de medida',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                permissions: ['wh.measures.view'],
                subMenu: []
            },
            {
                key: 'catalog.suppliers',
                path: '/catalog/suppliers',
                translateKey: 'Proveedores',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                permissions: ['wh.suppliers.view'],
                subMenu: []
            },
            {
                key: 'catalog.accountingAccounts',
                path: '/catalog/accountingAccounts',
                translateKey: 'Cuentas contables',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                permissions: ['wh.accounting_account.view'],
                subMenu: []
            },        
            {
                key: 'catalog.products',
                path: '/catalog/products',
                translateKey: 'Productos',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                permissions: ['wh.products.view'],
                subMenu: []
            }        
        ]
    }
]

export default navigationConfig
