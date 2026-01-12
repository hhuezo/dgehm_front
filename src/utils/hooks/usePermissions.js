import { useMemo } from 'react'
import isEmpty from 'lodash/isEmpty'

/**
 * Hook para verificar si el usuario tiene los permisos requeridos
 * @param {Array} userPermissions - Array de permisos del usuario
 * @param {Array} requiredPermissions - Array de permisos requeridos
 * @param {Boolean} emptyCheck - Si es true, retorna false cuando no hay permisos requeridos
 * @returns {Boolean} - true si el usuario tiene al menos uno de los permisos requeridos
 */
function usePermissions(userPermissions = [], requiredPermissions = [], emptyCheck = false) {
    const permissionMatched = useMemo(() => {
        // Si no hay permisos requeridos, permitir acceso (a menos que emptyCheck sea true)
        if (isEmpty(requiredPermissions) || typeof requiredPermissions === 'undefined') {
            return !emptyCheck
        }

        // Si no hay permisos del usuario, denegar acceso
        if (isEmpty(userPermissions)) {
            return false
        }

        // Verificar si el usuario tiene al menos uno de los permisos requeridos
        return requiredPermissions.some((permission) => userPermissions.includes(permission))
    }, [requiredPermissions, userPermissions, emptyCheck])

    return permissionMatched
}

export default usePermissions

