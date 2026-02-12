import React, { useEffect, useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'

import {
    setCurrentRouteTitle,
    setCurrentRouteSubtitle,
    setCurrentRouteInfo,
    setCurrentRouteOptions,
} from 'store/base/commonSlice'

import {
    apiGetPermissionTypes,
    apiStorePermissionType,
    apiDeletePermissionType,
} from 'services/SecurityService'

import { Card, Notification, toast } from 'components/ui'

import PermissionTypeTable from './components/PermissionTypeTable'
import PermissionTypeActionDrawer from './components/PermissionTypeActionDrawer'
import DeleteConfirmationModal from 'components/modals/DeleteConfirmationModal'

const PermissionTypes = () => {
    const dispatch = useDispatch()

    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [selectedType, setSelectedType] = useState(null)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [typeToDelete, setTypeToDelete] = useState(null)

    const initialValues = selectedType
        ? {
              id: selectedType.id,
              name: selectedType.name ?? '',
              is_active: selectedType.is_active !== false,
          }
        : { id: null, name: '', is_active: true }

    const handleChangeRouteInfo = useCallback(() => {
        dispatch(setCurrentRouteTitle('Tipos de permiso'))
        dispatch(setCurrentRouteSubtitle('Gestión de tipos de permiso'))
        dispatch(setCurrentRouteInfo(''))
        dispatch(setCurrentRouteOptions(''))
    }, [dispatch])

    useEffect(() => {
        handleChangeRouteInfo()
        fetchTypes()
    }, [handleChangeRouteInfo])

    const fetchTypes = async () => {
        setLoading(true)
        try {
            const res = await apiGetPermissionTypes()
            if (res.data.success) {
                setData(res.data.data)
            }
        } catch (error) {
            toast.push(
                <Notification title="Error" type="danger">
                    Error al cargar tipos de permiso
                </Notification>
            )
        } finally {
            setLoading(false)
        }
    }

    const handleOpenCreateDrawer = () => {
        setSelectedType(null)
        setDrawerOpen(true)
    }

    const handleOpenEditDrawer = (rowData) => {
        setSelectedType(rowData)
        setDrawerOpen(true)
    }

    const handleCloseDrawer = () => {
        setDrawerOpen(false)
        setTimeout(() => setSelectedType(null), 300)
    }

    const handleFormSubmit = async (values, actions) => {
        try {
            const res = await apiStorePermissionType(values)
            if (res.data.success) {
                toast.push(
                    <Notification title="Correcto" type="success">
                        Tipo de permiso {(values.id ? 'actualizado' : 'creado')} correctamente
                    </Notification>
                )
                handleCloseDrawer()
                fetchTypes()
            } else {
                toast.push(
                    <Notification title="Error" type="danger">
                        {res.data.message || 'No se pudo guardar el tipo de permiso'}
                    </Notification>
                )
            }
        } catch (error) {
            let errorMessage = 'Error al guardar el tipo de permiso.'
            if (error.response?.data) {
                if (error.response.data.errors) {
                    const errors = error.response.data.errors
                    const firstError = Object.values(errors)[0]
                    errorMessage = Array.isArray(firstError) ? firstError[0] : firstError
                } else if (error.response.data.message) {
                    errorMessage = error.response.data.message
                }
            } else if (error.message) {
                errorMessage = error.message
            }
            toast.push(
                <Notification title="Error" type="danger">
                    {errorMessage}
                </Notification>
            )
        } finally {
            actions.setSubmitting(false)
        }
    }

    const handleDelete = (rowData) => {
        setTypeToDelete(rowData)
        setDeleteDialogOpen(true)
    }

    const handleCloseDeleteDialog = () => {
        setDeleteDialogOpen(false)
        setTypeToDelete(null)
    }

    const handleConfirmDelete = async () => {
        setDeleteDialogOpen(false)
        if (!typeToDelete?.id) return
        try {
            const res = await apiDeletePermissionType(typeToDelete.id)
            if (res.data.success) {
                toast.push(
                    <Notification title="Correcto" type="success">
                        Tipo de permiso eliminado correctamente
                    </Notification>
                )
                fetchTypes()
            } else {
                toast.push(
                    <Notification title="Error" type="danger">
                        {res.data.message || 'No se pudo eliminar el tipo de permiso.'}
                    </Notification>
                )
            }
        } catch (error) {
            const msg =
                error.response?.data?.message ||
                'Ocurrió un error al intentar eliminar el tipo de permiso.'
            toast.push(
                <Notification title="Error" type="danger">
                    {msg}
                </Notification>
            )
        } finally {
            setTypeToDelete(null)
        }
    }

    return (
        <Card borderless className="shadow-none border-0">
            <PermissionTypeTable
                data={data}
                loading={loading}
                totalRecords={data.length}
                onAdd={handleOpenCreateDrawer}
                onEdit={handleOpenEditDrawer}
                onDelete={handleDelete}
            />

            <PermissionTypeActionDrawer
                isOpen={drawerOpen}
                onClose={handleCloseDrawer}
                onSubmit={handleFormSubmit}
                initialValues={initialValues}
                isEdit={!!selectedType}
            />

            <DeleteConfirmationModal
                isOpen={deleteDialogOpen}
                onClose={handleCloseDeleteDialog}
                onConfirm={handleConfirmDelete}
                itemName={typeToDelete?.name}
                itemType="el tipo de permiso"
            />
        </Card>
    )
}

export default PermissionTypes
