import React, { useState, useEffect } from 'react'
import { Switcher, Notification, toast } from 'components/ui'
import { apiSyncUserOffices } from 'services/SecurityService'

const UserOfficesSection = ({ user, allOffices, onOfficesUpdated }) => {
    const [selectedOfficeIds, setSelectedOfficeIds] = useState(
        user?.offices?.map(office => office.id) || []
    )
    const [isUpdating, setIsUpdating] = useState(false)

    // Actualizar las oficinas seleccionadas cuando cambie el usuario
    useEffect(() => {
        if (user?.offices) {
            setSelectedOfficeIds(user.offices.map(office => office.id))
        }
    }, [user])

    const handleOfficeChange = async (officeId) => {
        if (isUpdating) return

        // Calcular el nuevo estado (toggle)
        const isCurrentlyChecked = selectedOfficeIds.includes(officeId)
        const nextChecked = !isCurrentlyChecked

        const previousOfficeIds = [...selectedOfficeIds]
        const newSelectedOfficeIds = nextChecked
            ? [...selectedOfficeIds, officeId]
            : selectedOfficeIds.filter(id => id !== officeId)

        // Actualización optimista
        setSelectedOfficeIds(newSelectedOfficeIds)

        setIsUpdating(true)
        try {
            const res = await apiSyncUserOffices(user.id, newSelectedOfficeIds)

            if (res.data.success) {
                toast.push(
                    <Notification title="Correcto" type="success">
                        Oficinas actualizadas correctamente
                    </Notification>
                )
                // Notificar al componente padre para actualizar los datos
                if (onOfficesUpdated) {
                    onOfficesUpdated(res.data.data)
                }
            } else {
                // Rollback en caso de fallo
                setSelectedOfficeIds(previousOfficeIds)
                toast.push(
                    <Notification title="Error" type="danger">
                        {res.data.message || 'Error al actualizar las oficinas'}
                    </Notification>
                )
            }
        } catch (error) {
            // Rollback en caso de error de red
            setSelectedOfficeIds(previousOfficeIds)
            const message = error.response?.data?.message || 'Error de red al actualizar las oficinas'
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
        <div className="mb-4 rounded-lg border border-blue-300 bg-blue-50 p-4">
            <label className="block text-sm font-semibold text-blue-800 mb-3 mt-1">
                Oficinas del Usuario
            </label>

            <div className="space-y-3">
                {allOffices.map((office) => {
                    const isChecked = selectedOfficeIds.includes(office.id)
                    return (
                        <div
                            key={office.id}
                            className="flex justify-between items-center rounded-md bg-white px-3 py-2 shadow-sm border border-gray-200"
                        >
                            <span className="text-sm text-gray-700 font-medium">
                                {office.name}
                            </span>
                            <Switcher
                                checked={isChecked}
                                disabled={isUpdating}
                                isLoading={isUpdating}
                                onChange={() => handleOfficeChange(office.id)}
                            />
                        </div>
                    )
                })}
            </div>

            {allOffices.length === 0 && (
                <p className="text-gray-500 text-sm mt-2">
                    No hay oficinas disponibles
                </p>
            )}
        </div>

    )
}

export default UserOfficesSection

