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
]
