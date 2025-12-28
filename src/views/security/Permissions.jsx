// src/views/security/Permissions.jsx (Componente Contenedor)
import React, { useEffect, useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'

import {
    setCurrentRouteTitle,
    setCurrentRouteSubtitle,
    setCurrentRouteInfo,
    setCurrentRouteOptions,
} from 'store/base/commonSlice'

import {
    apiGetPermissions,
    apiStorePermission,
    apiDeletePermission,
} from 'services/SecurityService'

import {
    Card,
    Notification,
    toast,
} from 'components/ui'

// Componentes importados
import PermissionTable from './components/PermissionTable'
import PermissionActionDrawer from './components/PermissionActionDrawer'
import DeleteConfirmationModal from 'components/modals/DeleteConfirmationModal'

const Permissions = () => {
    const dispatch = useDispatch()

    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)

    // Estados de UI y Datos
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [selectedPermission, setSelectedPermission] = useState(null)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [permissionToDelete, setPermissionToDelete] = useState(null)

    // Valores iniciales para la creación/edición (Creación siempre empieza vacío)
    const initialValues = selectedPermission
        ? { id: selectedPermission.id, name: selectedPermission.name }
        : { id: null, name: '' };

    const isEditMode = !!selectedPermission && !drawerOpen;


    // ---- Lógica de Ruta y Fetch ----

    const handleChangeRouteInfo = useCallback(() => {
        dispatch(setCurrentRouteTitle('Permisos'))
        dispatch(setCurrentRouteSubtitle('Gestión de permisos'))
        dispatch(setCurrentRouteInfo(''))
        dispatch(setCurrentRouteOptions(''))
    }, [dispatch])

    useEffect(() => {
        handleChangeRouteInfo()
        fetchPermissions()
    }, [handleChangeRouteInfo])

    const fetchPermissions = async () => {
        setLoading(true)
        try {
            const res = await apiGetPermissions()
            if (res.data.success) {
                setData(res.data.data)
            }
        } catch (error) {
            toast.push(
                <Notification title="Error" type="danger">
                    Error al cargar permisos
                </Notification>
            )
        } finally {
            setLoading(false)
        }
    }

    // ---- Handlers de Creación/Edición (Lógica de la API) ----

    const handleOpenCreateDrawer = () => {
        setSelectedPermission(null); // Asegura que está en modo creación
        setDrawerOpen(true);
    }

    const handleOpenEditDrawer = (permissionData) => {
        setSelectedPermission(permissionData); // Carga datos para edición
        setDrawerOpen(true);
    }

    const handleCloseDrawer = () => {
        setDrawerOpen(false);
        // Limpiar el permiso seleccionado solo después de que el Drawer se cierre
        setTimeout(() => setSelectedPermission(null), 300);
    }

    const handleFormSubmit = async (values, actions) => {
        try {
            // El servicio apiStorePermission gestiona POST (sin ID) o PUT (con ID)
            const res = await apiStorePermission(values)

            if (res.data.success) {
                toast.push(
                    <Notification title="Correcto" type="success">
                        Permiso {(values.id ? 'actualizado' : 'creado')} correctamente
                    </Notification>
                )
                handleCloseDrawer(); // Cerrar el Drawer
                fetchPermissions(); // Refrescar la tabla
            } else {
                // Si la respuesta no es exitosa pero no lanzó excepción
                const message = res.data.message || 'No se pudo guardar el permiso'
                toast.push(
                    <Notification title="Error" type="danger">
                        {message}
                    </Notification>
                )
            }
        } catch (error) {
            // Extraer mensaje de error del backend
            let errorMessage = 'Error al guardar el permiso.'
            
            if (error.response?.data) {
                // Si hay errores de validación
                if (error.response.data.errors) {
                    const errors = error.response.data.errors
                    const firstError = Object.values(errors)[0]
                    errorMessage = Array.isArray(firstError) ? firstError[0] : firstError
                } else if (error.response.data.message) {
                    errorMessage = error.response.data.message
                } else if (error.response.data.error) {
                    errorMessage = error.response.data.error
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


    // ---- Handlers de Eliminación ----

    const handleDelete = (data) => {
        setPermissionToDelete(data)
        setDeleteDialogOpen(true)
    }

    const handleCloseDeleteDialog = () => {
        setDeleteDialogOpen(false)
        setPermissionToDelete(null)
    }

    const handleConfirmDelete = async () => {
        setDeleteDialogOpen(false)

        if (!permissionToDelete || !permissionToDelete.id) return

        try {
            const res = await apiDeletePermission(permissionToDelete.id)

            if (res.data.success) {
                toast.push(
                    <Notification title="Correcto" type="success">
                        Permiso eliminado correctamente
                    </Notification>
                )
                fetchPermissions()
            } else {
                toast.push(
                    <Notification title="Error" type="danger">
                        No se pudo eliminar el permiso.
                    </Notification>
                )
            }
        } catch (error) {
            toast.push(
                <Notification title="Error" type="danger">
                    Ocurrió un error al intentar eliminar el permiso.
                </Notification>
            )
        } finally {
            setPermissionToDelete(null)
        }
    }


    return (
        <Card borderless className="shadow-none border-0">

            {/* 1. TABLA (Contiene Header, DataTable y Footer) */}
            <PermissionTable
                data={data}
                loading={loading}
                totalRecords={data.length}
                onAdd={handleOpenCreateDrawer} // Llamado al handler de creación
                onEdit={handleOpenEditDrawer} // Llamado al handler de edición
                onDelete={handleDelete} // Llamado al handler de eliminación
            />

            {/* 2. DRAWER DE ACCIÓN (Creación y Edición) */}
            <PermissionActionDrawer
                isOpen={drawerOpen}
                onClose={handleCloseDrawer}
                onSubmit={handleFormSubmit}
                initialValues={initialValues}
                isEdit={!!selectedPermission}
            />

            {/* 3. MODAL DE ELIMINACIÓN */}
            <DeleteConfirmationModal
                isOpen={deleteDialogOpen}
                onClose={handleCloseDeleteDialog}
                onConfirm={handleConfirmDelete}
                itemName={permissionToDelete?.name}
                itemType="el permiso"
            />
        </Card>
    )
}

export default Permissions