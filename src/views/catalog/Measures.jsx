// src/views/catalog/Measures.jsx (Componente Contenedor)
import React, { useEffect, useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'

import {
    setCurrentRouteTitle,
    setCurrentRouteSubtitle,
    setCurrentRouteInfo,
    setCurrentRouteOptions,
} from 'store/base/commonSlice'

import {
    apiGetMeasures,
    apiStoreMeasure,
    apiDeleteMeasure,
} from 'services/MeasureService'

import {
    Card,
    Notification,
    toast,
} from 'components/ui'

// Componentes importados
import MeasureTable from './components/MeasureTable'
import MeasureActionDrawer from './components/MeasureActionDrawer'
import DeleteConfirmationModal from 'components/modals/DeleteConfirmationModal'

const Measures = () => {
    const dispatch = useDispatch()

    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)

    // Estados de UI y Datos
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [selectedMeasure, setSelectedMeasure] = useState(null)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [measureToDelete, setMeasureToDelete] = useState(null)

    // Valores iniciales para la creación/edición (Creación siempre empieza vacío)
    const initialValues = selectedMeasure
        ? { id: selectedMeasure.id, name: selectedMeasure.name }
        : { id: null, name: '' };

    const isEditMode = !!selectedMeasure && !drawerOpen;


    // ---- Lógica de Ruta y Fetch ----

    const handleChangeRouteInfo = useCallback(() => {
        dispatch(setCurrentRouteTitle('Unidades de Medida'))
        dispatch(setCurrentRouteSubtitle('Gestión de unidades de medida'))
        dispatch(setCurrentRouteInfo(''))
        dispatch(setCurrentRouteOptions(''))
    }, [dispatch])

    useEffect(() => {
        handleChangeRouteInfo()
        fetchMeasures()
    }, [handleChangeRouteInfo])

    const fetchMeasures = async () => {
        setLoading(true)
        try {
            const res = await apiGetMeasures()
            if (res.data.success) {
                setData(res.data.data)
            }
        } catch (error) {
            toast.push(
                <Notification title="Error" type="danger">
                    Error al cargar unidades de medida
                </Notification>
            )
        } finally {
            setLoading(false)
        }
    }

    // ---- Handlers de Creación/Edición (Lógica de la API) ----

    const handleOpenCreateDrawer = () => {
        setSelectedMeasure(null); // Asegura que está en modo creación
        setDrawerOpen(true);
    }

    const handleOpenEditDrawer = (measureData) => {
        setSelectedMeasure(measureData); // Carga datos para edición
        setDrawerOpen(true);
    }

    const handleCloseDrawer = () => {
        setDrawerOpen(false);
        // Limpiar la medida seleccionada solo después de que el Drawer se cierre
        setTimeout(() => setSelectedMeasure(null), 300);
    }

    const handleFormSubmit = async (values, actions) => {
        try {
            // El servicio apiStoreMeasure gestiona POST (sin ID) o PUT (con ID)
            const res = await apiStoreMeasure(values)

            if (res.data.success) {
                toast.push(
                    <Notification title="Correcto" type="success">
                        Unidad de medida {(values.id ? 'actualizada' : 'creada')} correctamente
                    </Notification>
                )
                handleCloseDrawer(); // Cerrar el Drawer
                fetchMeasures(); // Refrescar la tabla
            } else {
                // Si la respuesta no es exitosa pero no lanzó excepción
                const message = res.data.message || 'No se pudo guardar la unidad de medida'
                toast.push(
                    <Notification title="Error" type="danger">
                        {message}
                    </Notification>
                )
            }
        } catch (error) {
            // Extraer mensaje de error del backend
            let errorMessage = 'Error al guardar la unidad de medida.'
            
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
        setMeasureToDelete(data)
        setDeleteDialogOpen(true)
    }

    const handleCloseDeleteDialog = () => {
        setDeleteDialogOpen(false)
        setMeasureToDelete(null)
    }

    const handleConfirmDelete = async () => {
        setDeleteDialogOpen(false)

        if (!measureToDelete || !measureToDelete.id) return

        try {
            const res = await apiDeleteMeasure(measureToDelete.id)

            if (res.data.success) {
                toast.push(
                    <Notification title="Correcto" type="success">
                        Unidad de medida eliminada correctamente
                    </Notification>
                )
                fetchMeasures()
            } else {
                toast.push(
                    <Notification title="Error" type="danger">
                        No se pudo eliminar la unidad de medida.
                    </Notification>
                )
            }
        } catch (error) {
            toast.push(
                <Notification title="Error" type="danger">
                    Ocurrió un error al intentar eliminar la unidad de medida.
                </Notification>
            )
        } finally {
            setMeasureToDelete(null)
        }
    }


    return (
        <Card borderless className="shadow-none border-0">

            {/* 1. TABLA (Contiene Header, DataTable y Footer) */}
            <MeasureTable
                data={data}
                loading={loading}
                totalRecords={data.length}
                onAdd={handleOpenCreateDrawer} // Llamado al handler de creación
                onEdit={handleOpenEditDrawer} // Llamado al handler de edición
                onDelete={handleDelete} // Llamado al handler de eliminación
            />

            {/* 2. DRAWER DE ACCIÓN (Creación y Edición) */}
            <MeasureActionDrawer
                isOpen={drawerOpen}
                onClose={handleCloseDrawer}
                onSubmit={handleFormSubmit}
                initialValues={initialValues}
                isEdit={!!selectedMeasure}
            />

            {/* 3. MODAL DE ELIMINACIÓN */}
            <DeleteConfirmationModal
                isOpen={deleteDialogOpen}
                onClose={handleCloseDeleteDialog}
                onConfirm={handleConfirmDelete}
                itemName={measureToDelete?.name}
                itemType="la unidad de medida"
            />
        </Card>
    )
}

export default Measures

