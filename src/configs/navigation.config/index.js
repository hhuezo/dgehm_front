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
    }
]

export default navigationConfig
