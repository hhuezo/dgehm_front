import React from 'react'
import { Navigate } from 'react-router-dom'
import usePermissions from 'utils/hooks/usePermissions'

const AuthorityGuard = (props) => {
    const { userPermissions = [], permissions = [], children } = props

    const permissionMatched = usePermissions(userPermissions, permissions)

    return permissionMatched ? children : <Navigate to="/access-denied" />
}

export default AuthorityGuard
