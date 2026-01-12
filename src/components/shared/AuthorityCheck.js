import React from 'react'
import PropTypes from 'prop-types'
import usePermissions from 'utils/hooks/usePermissions'

const AuthorityCheck = (props) => {
    const { userPermissions = [], permissions = [], children } = props

    const permissionMatched = usePermissions(userPermissions, permissions)

    return permissionMatched ? children : <></>
}

AuthorityCheck.propTypes = {
    userPermissions: PropTypes.array,
    permissions: PropTypes.array,
}

export default AuthorityCheck
