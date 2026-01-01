import { NAV_ITEM_TYPE_COLLAPSE, NAV_ITEM_TYPE_ITEM } from 'constants/navigation.constant'
import { DIRECTORY_PREFIX_PATH } from 'constants/route.constant'
import { ADMIN, USER } from 'constants/roles.constant'


const navigationConfig = [

    {
        key: 'home',
        path: '/home',
        translateKey: 'Home',
        icon: 'home',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [ADMIN, USER],
        subMenu: []
    },
    {
        key: 'security',
        path: '',
        translateKey: 'Seguridad',
        icon: 'security',
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: [ADMIN],
        subMenu: [
            {
                key: 'security.users',
                path: '/security/users',
                translateKey: 'Usuarios',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [ADMIN],
                subMenu: []
            },
            {
                key: 'security.roles',
                path: '/security/roles',
                translateKey: 'Roles',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [ADMIN],
                subMenu: []
            },
            {
                key: 'security.permissions',
                path: '/security/permissions',
                translateKey: 'Permisos',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [ADMIN],
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
        authority: [ADMIN, 'almacen-admin', 'almacen-solicitante', 'almacen-jefe-area'],
        subMenu: [
            {
                key: 'warehouse.purchaseOrder',
                path: '/warehouse/purchaseOrder',
                translateKey: 'Ordenes de compra',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [ADMIN, 'almacen-admin'],
                subMenu: []
            },
            {
                key: 'warehouse.SupplyRequest',
                path: '/warehouse/SupplyRequest',
                translateKey: 'Solicitud de insumos',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [ADMIN, 'almacen-admin', 'almacen-solicitante', 'almacen-jefe-area'],
                subMenu: []
            },
            {
                key: 'warehouse.supplyReturn',
                path: '/warehouse/supplyReturn',
                translateKey: 'Devoluciones de suministros',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [ADMIN, 'almacen-admin', 'almacen-solicitante', 'almacen-jefe-area'],
                subMenu: []
            },

            {
                key: 'warehouse.Kardex',
                path: '/warehouse/Kardex',
                translateKey: 'Kardex',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [ADMIN, 'almacen-admin'],
                subMenu: []
            },

        ]
    },
    {
        key: 'inventary-reports',
        path: '',
        translateKey: 'Reportes de inventario',
        icon: 'reports',
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: [ADMIN, 'almacen-admin', 'almacen-solicitante', 'almacen-jefe-area'],
        subMenu: [
            {
                key: 'warehouse.inventoryLiquidation',
                path: '/warehouse/inventoryLiquidation',
                translateKey: 'Reporte de liquidación',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [ADMIN, 'almacen-admin'],
                subMenu: []
            },
            {
                key: 'warehouse.inventoryStock',
                path: '/warehouse/inventoryStock',
                translateKey: 'Reporte de existencias',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [ADMIN, 'almacen-admin'],
                subMenu: []
            }
        ]
    }
]

export default navigationConfig
