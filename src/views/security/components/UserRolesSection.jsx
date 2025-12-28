import React, { useState, useEffect } from 'react'
import { Switcher, Notification, toast } from 'components/ui'
import { apiSyncUserRoles } from 'services/SecurityService'

const UserRolesSection = ({ user, allRoles, onRolesUpdated }) => {
    const [selectedRoleIds, setSelectedRoleIds] = useState(
        user?.roles?.map(role => role.id) || []
    )
    const [isUpdating, setIsUpdating] = useState(false)

    // Actualizar los roles seleccionados cuando cambie el usuario
    useEffect(() => {
        if (user?.roles) {
            setSelectedRoleIds(user.roles.map(role => role.id))
        }
    }, [user])

    const handleRoleChange = async (roleId) => {
        if (isUpdating) return

        // Calcular el nuevo estado (toggle)
        const isCurrentlyChecked = selectedRoleIds.includes(roleId)
        const nextChecked = !isCurrentlyChecked

        const previousRoleIds = [...selectedRoleIds]
        const newSelectedRoleIds = nextChecked
            ? [...selectedRoleIds, roleId]
            : selectedRoleIds.filter(id => id !== roleId)

        // Actualización optimista
        setSelectedRoleIds(newSelectedRoleIds)

        setIsUpdating(true)
        try {
            const res = await apiSyncUserRoles(user.id, newSelectedRoleIds)

            if (res.data.success) {
                toast.push(
                    <Notification title="Correcto" type="success">
                        Roles actualizados correctamente
                    </Notification>
                )
                // Notificar al componente padre para actualizar los datos
                if (onRolesUpdated) {
                    onRolesUpdated(res.data.data)
                }
            } else {
                // Rollback en caso de fallo
                setSelectedRoleIds(previousRoleIds)
                toast.push(
                    <Notification title="Error" type="danger">
                        {res.data.message || 'Error al actualizar los roles'}
                    </Notification>
                )
            }
        } catch (error) {
            // Rollback en caso de error de red
            setSelectedRoleIds(previousRoleIds)
            const message = error.response?.data?.message || 'Error de red al actualizar los roles'
            toast.push(
                <Notification title="Error" type="danger">
                    {message}
                </Notification>
            )
        } finally {
            setIsUpdating(false)
        }
    }

    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Roles del Usuario</label>
            <div className="space-y-3">
                {allRoles.map((role) => {
                    const isChecked = selectedRoleIds.includes(role.id)
                    return (
                        <div key={role.id} className="flex justify-between items-center">
                            <span className="text-sm text-gray-700 font-medium">
                                {role.name}
                            </span>
                            <Switcher
                                checked={isChecked}
                                disabled={isUpdating}
                                isLoading={isUpdating}
                                onChange={() => handleRoleChange(role.id)}
                            />
                        </div>
                    )
                })}
            </div>
            {allRoles.length === 0 && (
                <p className="text-gray-500 text-sm">No hay roles disponibles</p>
            )}
        </div>
    )
}

export default UserRolesSection

