// src/views/catalog/Offices.jsx (Componente Contenedor)
import React, { useEffect, useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'

import {
    setCurrentRouteTitle,
    setCurrentRouteSubtitle,
    setCurrentRouteInfo,
    setCurrentRouteOptions,
} from 'store/base/commonSlice'

import {
    apiGetOffices,
    apiStoreOffice,
    apiDeleteOffice,
} from 'services/OfficeService'

import {
    Card,
    Notification,
    toast,
} from 'components/ui'

// Componentes importados
import OfficeTable from './components/OfficeTable'
import OfficeActionDrawer from './components/OfficeActionDrawer'
import DeleteConfirmationModal from 'components/modals/DeleteConfirmationModal'

const Offices = () => {
    const dispatch = useDispatch()

    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)

    // Estados de UI y Datos
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [selectedOffice, setSelectedOffice] = useState(null)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [officeToDelete, setOfficeToDelete] = useState(null)

    // Valores iniciales para la creación/edición (Creación siempre empieza vacío)
    const initialValues = selectedOffice
        ? { id: selectedOffice.id, name: selectedOffice.name, phone: selectedOffice.phone }
        : { id: null, name: '', phone: '' };

    const isEditMode = !!selectedOffice && !drawerOpen;


    // ---- Lógica de Ruta y Fetch ----

    const handleChangeRouteInfo = useCallback(() => {
        dispatch(setCurrentRouteTitle('Oficinas'))
        dispatch(setCurrentRouteSubtitle('Gestión de oficinas'))
        dispatch(setCurrentRouteInfo(''))
        dispatch(setCurrentRouteOptions(''))
    }, [dispatch])

    useEffect(() => {
        handleChangeRouteInfo()
        fetchOffices()
    }, [handleChangeRouteInfo])

    const fetchOffices = async () => {
        setLoading(true)
        try {
            const res = await apiGetOffices()
            if (res.data.success) {
                setData(res.data.data)
            }
        } catch (error) {
            toast.push(
                <Notification title="Error" type="danger">
                    Error al cargar oficinas
                </Notification>
            )
        } finally {
            setLoading(false)
        }
    }

    // ---- Handlers de Creación/Edición (Lógica de la API) ----

    const handleOpenCreateDrawer = () => {
        setSelectedOffice(null); // Asegura que está en modo creación
        setDrawerOpen(true);
    }

    const handleOpenEditDrawer = (officeData) => {
        setSelectedOffice(officeData); // Carga datos para edición
        setDrawerOpen(true);
    }

    const handleCloseDrawer = () => {
        setDrawerOpen(false);
        // Limpiar la oficina seleccionada solo después de que el Drawer se cierre
        setTimeout(() => setSelectedOffice(null), 300);
    }

    const handleFormSubmit = async (values, actions) => {
        try {
            // El servicio apiStoreOffice gestiona POST (sin ID) o PUT (con ID)
            const res = await apiStoreOffice(values)

            if (res.data.success) {
                toast.push(
                    <Notification title="Correcto" type="success">
                        Oficina {(values.id ? 'actualizada' : 'creada')} correctamente
                    </Notification>
                )
                handleCloseDrawer(); // Cerrar el Drawer
                fetchOffices(); // Refrescar la tabla
            } else {
                // Si la respuesta no es exitosa pero no lanzó excepción
                const message = res.data.message || 'No se pudo guardar la oficina'
                toast.push(
                    <Notification title="Error" type="danger">
                        {message}
                    </Notification>
                )
            }
        } catch (error) {
            // Extraer mensaje de error del backend
            let errorMessage = 'Error al guardar la oficina.'
            
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
        setOfficeToDelete(data)
        setDeleteDialogOpen(true)
    }

    const handleCloseDeleteDialog = () => {
        setDeleteDialogOpen(false)
        setOfficeToDelete(null)
    }

    const handleConfirmDelete = async () => {
        setDeleteDialogOpen(false)

        if (!officeToDelete || !officeToDelete.id) return

        try {
            const res = await apiDeleteOffice(officeToDelete.id)

            if (res.data.success) {
                toast.push(
                    <Notification title="Correcto" type="success">
                        Oficina eliminada correctamente
                    </Notification>
                )
                fetchOffices()
            } else {
                toast.push(
                    <Notification title="Error" type="danger">
                        No se pudo eliminar la oficina.
                    </Notification>
                )
            }
        } catch (error) {
            toast.push(
                <Notification title="Error" type="danger">
                    Ocurrió un error al intentar eliminar la oficina.
                </Notification>
            )
        } finally {
            setOfficeToDelete(null)
        }
    }


    return (
        <Card borderless className="shadow-none border-0">

            {/* 1. TABLA (Contiene Header, DataTable y Footer) */}
            <OfficeTable
                data={data}
                loading={loading}
                totalRecords={data.length}
                onAdd={handleOpenCreateDrawer} // Llamado al handler de creación
                onEdit={handleOpenEditDrawer} // Llamado al handler de edición
                onDelete={handleDelete} // Llamado al handler de eliminación
            />

            {/* 2. DRAWER DE ACCIÓN (Creación y Edición) */}
            <OfficeActionDrawer
                isOpen={drawerOpen}
                onClose={handleCloseDrawer}
                onSubmit={handleFormSubmit}
                initialValues={initialValues}
                isEdit={!!selectedOffice}
            />

            {/* 3. MODAL DE ELIMINACIÓN */}
            <DeleteConfirmationModal
                isOpen={deleteDialogOpen}
                onClose={handleCloseDeleteDialog}
                onConfirm={handleConfirmDelete}
                itemName={officeToDelete?.name}
                itemType="la oficina"
            />
        </Card>
    )
}

export default Offices

