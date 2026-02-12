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
        permissions: ['users view', 'roles view', 'permissions view', 'permission_type view'],
        subMenu: [
            {
                key: 'security.users',
                path: '/security/users',
                translateKey: 'Usuarios',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                permissions: ['users view'],
                subMenu: []
            },
            {
                key: 'security.roles',
                path: '/security/roles',
                translateKey: 'Roles',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                permissions: ['roles view'],
                subMenu: []
            },
            {
                key: 'security.permissions',
                path: '/security/permissions',
                translateKey: 'Permisos',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                permissions: ['permissions view'],
                subMenu: []
            },
            {
                key: 'security.permissionTypes',
                path: '/security/permission-types',
                translateKey: 'Tipos de permiso',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                permissions: ['permission_type view'],
                subMenu: []
            }
        ]
    },
    {
        key: 'inventary',
        path: '',
        translateKey: 'Inventario',
        icon: 'inventary',
        type: NAV_ITEM_TYPE_COLLAPSE,
        permissions: ['purchase_order view', 'supply_request view', 'products kardex'], // Al menos uno de estos permisos
        subMenu: [
            {
                key: 'warehouse.purchaseOrder',
                path: '/warehouse/purchaseOrder',
                translateKey: 'Ordenes de compra',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                permissions: ['purchase_order view'],
                subMenu: []
            },
            {
                key: 'warehouse.SupplyRequest',
                path: '/warehouse/SupplyRequest',
                translateKey: 'Solicitud de insumos',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                permissions: ['supply_request view'],
                subMenu: []
            },
            {
                key: 'warehouse.supplyReturn',
                path: '/warehouse/supplyReturn',
                translateKey: 'Devoluciones de suministros',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                permissions: ['supply_request view'], // Usa el mismo permiso que supply_request
                subMenu: []
            },

            {
                key: 'warehouse.Kardex',
                path: '/warehouse/Kardex',
                translateKey: 'Kardex',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                permissions: ['products kardex'],
                subMenu: []
            },

        ]
    },




    {
        key: 'requests',
        path: '',
        translateKey: 'Solicitudes',
        icon: 'tasks',
        type: NAV_ITEM_TYPE_COLLAPSE,
        permissions: ['supply_request view'], // Permiso para ver solicitudes
        subMenu: [

            {
                key: 'warehouse.SupplyRequest',
                path: '/warehouse/SupplyRequest',
                translateKey: 'Solicitud de insumos',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                permissions: ['supply_request view'],
                subMenu: []
            },
            {
                key: 'warehouse.supplyReturn',
                path: '/warehouse/supplyReturn',
                translateKey: 'Devoluciones de suministros',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                permissions: ['supply_request view'], // Usa el mismo permiso
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
        permissions: ['products view'], // Permiso general para ver productos/inventario
        subMenu: []
    },
    {
        key: 'fixedAssets',
        path: '/fixed-assets',
        translateKey: 'Activos Fijos',
        icon: 'inventory',
        type: NAV_ITEM_TYPE_ITEM,
        permissions: ['fixed_assets view'],
        subMenu: []
    },
    {
        key: 'catalogActivoFijo',
        path: '',
        translateKey: 'Catalogos activo fijo',
        icon: 'database',
        type: NAV_ITEM_TYPE_COLLAPSE,
        permissions: ['institutions view', 'organizational_unit_types view', 'organizational_units view', 'specifics view', 'classes view', 'categories view', 'origins view', 'physical_conditions view', 'vehicle_brands view', 'vehicle_drive_types view', 'vehicle_types view', 'vehicle_colors view'],
        subMenu: [
            {
                key: 'catalog.fixed.institution',
                path: '/catalog-fixed/institution',
                translateKey: 'Institución',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                permissions: ['institutions view'],
                subMenu: []
            },
            {
                key: 'catalog.fixed.organizationalUnitType',
                path: '/catalog-fixed/organizational-unit-type',
                translateKey: 'Tipo unidad organizativa',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                permissions: ['organizational_unit_types view'],
                subMenu: []
            },
            {
                key: 'catalog.fixed.organizationalUnit',
                path: '/catalog-fixed/organizational-unit',
                translateKey: 'Unidad organizativa',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                permissions: ['organizational_units view'],
                subMenu: []
            },
            {
                key: 'catalog.fixed.organizationalUnitConfig',
                path: '/catalog-fixed/organizational-unit-config',
                translateKey: 'Unidad organizativa config',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                permissions: ['organizational_units tree'],
                subMenu: []
            },
            {
                key: 'catalog.fixed.especifico',
                path: '/catalog-fixed/especifico',
                translateKey: 'Específico',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                permissions: ['specifics view'],
                subMenu: []
            },
            {
                key: 'catalog.fixed.clase',
                path: '/catalog-fixed/clase',
                translateKey: 'Clase',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                permissions: ['classes view'],
                subMenu: []
            },
            {
                key: 'catalog.fixed.category',
                path: '/catalog-fixed/category',
                translateKey: 'Categoría',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                permissions: ['categories view'],
                subMenu: []
            },
            {
                key: 'catalog.fixed.procedencia',
                path: '/catalog-fixed/procedencia',
                translateKey: 'Procedencia',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                permissions: ['origins view'],
                subMenu: []
            },
            {
                key: 'catalog.fixed.estadoFisico',
                path: '/catalog-fixed/estado-fisico',
                translateKey: 'Estado físico',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                permissions: ['physical_conditions view'],
                subMenu: []
            },
            {
                key: 'catalog.fixed.vehiculoMarca',
                path: '/catalog-fixed/vehiculo-marca',
                translateKey: 'Vehículo marca',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                permissions: ['vehicle_brands view'],
                subMenu: []
            },
            {
                key: 'catalog.fixed.vehiculoTraccion',
                path: '/catalog-fixed/vehiculo-traccion',
                translateKey: 'Vehículo tracción',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                permissions: ['vehicle_drive_types view'],
                subMenu: []
            },
            {
                key: 'catalog.fixed.vehiculoTipo',
                path: '/catalog-fixed/vehiculo-tipo',
                translateKey: 'Vehículo tipo',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                permissions: ['vehicle_types view'],
                subMenu: []
            },
            {
                key: 'catalog.fixed.vehiculoColor',
                path: '/catalog-fixed/vehiculo-color',
                translateKey: 'Vehículo color',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                permissions: ['vehicle_colors view'],
                subMenu: []
            }
        ]
    },
    {
        key: 'catalog',
        path: '',
        translateKey: 'Catalogos',
        icon: 'tag',
        type: NAV_ITEM_TYPE_COLLAPSE,
        permissions: ['offices view', 'measures view', 'suppliers view', 'accounting_account view', 'products view'], // Al menos uno de estos permisos
        subMenu: [
            {
                key: 'catalog.offices',
                path: '/catalog/offices',
                translateKey: 'Oficinas',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                permissions: ['offices view'],
                subMenu: []
            },
            {
                key: 'catalog.measures',
                path: '/catalog/measures',
                translateKey: 'Unidades de medida',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                permissions: ['measures view'],
                subMenu: []
            },
            {
                key: 'catalog.suppliers',
                path: '/catalog/suppliers',
                translateKey: 'Proveedores',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                permissions: ['suppliers view'],
                subMenu: []
            },
            {
                key: 'catalog.accountingAccounts',
                path: '/catalog/accountingAccounts',
                translateKey: 'Cuentas contables',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                permissions: ['accounting_account view'],
                subMenu: []
            },        
            {
                key: 'catalog.products',
                path: '/catalog/products',
                translateKey: 'Productos',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                permissions: ['products view'],
                subMenu: []
            }        
        ]
    }
]

export default navigationConfig
