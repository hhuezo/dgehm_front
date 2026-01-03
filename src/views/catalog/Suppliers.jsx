// src/views/catalog/Suppliers.jsx (Componente Contenedor)
import React, { useEffect, useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'

import {
    setCurrentRouteTitle,
    setCurrentRouteSubtitle,
    setCurrentRouteInfo,
    setCurrentRouteOptions,
} from 'store/base/commonSlice'

import {
    apiGetSuppliers,
    apiStoreSupplier,
    apiDeleteSupplier,
} from 'services/SupplierService'

import {
    Card,
    Notification,
    toast,
} from 'components/ui'

// Componentes importados
import SupplierTable from './components/SupplierTable'
import SupplierActionDrawer from './components/SupplierActionDrawer'
import DeleteConfirmationModal from 'components/modals/DeleteConfirmationModal'

const Suppliers = () => {
    const dispatch = useDispatch()

    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)

    // Estados de UI y Datos
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [selectedSupplier, setSelectedSupplier] = useState(null)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [supplierToDelete, setSupplierToDelete] = useState(null)

    // Valores iniciales para la creación/edición (Creación siempre empieza vacío)
    const initialValues = selectedSupplier
        ? { 
            id: selectedSupplier.id, 
            name: selectedSupplier.name || '', 
            contact_person: selectedSupplier.contact_person || '',
            phone: selectedSupplier.phone || '',
            email: selectedSupplier.email || '',
            address: selectedSupplier.address || ''
        }
        : { 
            id: null, 
            name: '', 
            contact_person: '',
            phone: '',
            email: '',
            address: ''
        };

    const isEditMode = !!selectedSupplier && !drawerOpen;


    // ---- Lógica de Ruta y Fetch ----

    const handleChangeRouteInfo = useCallback(() => {
        dispatch(setCurrentRouteTitle('Proveedores'))
        dispatch(setCurrentRouteSubtitle('Gestión de proveedores'))
        dispatch(setCurrentRouteInfo(''))
        dispatch(setCurrentRouteOptions(''))
    }, [dispatch])

    useEffect(() => {
        handleChangeRouteInfo()
        fetchSuppliers()
    }, [handleChangeRouteInfo])

    const fetchSuppliers = async () => {
        setLoading(true)
        try {
            const res = await apiGetSuppliers()
            if (res.data.success) {
                setData(res.data.data)
            }
        } catch (error) {
            toast.push(
                <Notification title="Error" type="danger">
                    Error al cargar proveedores
                </Notification>
            )
        } finally {
            setLoading(false)
        }
    }

    // ---- Handlers de Creación/Edición (Lógica de la API) ----

    const handleOpenCreateDrawer = () => {
        setSelectedSupplier(null); // Asegura que está en modo creación
        setDrawerOpen(true);
    }

    const handleOpenEditDrawer = (supplierData) => {
        setSelectedSupplier(supplierData); // Carga datos para edición
        setDrawerOpen(true);
    }

    const handleCloseDrawer = () => {
        setDrawerOpen(false);
        // Limpiar el proveedor seleccionado solo después de que el Drawer se cierre
        setTimeout(() => setSelectedSupplier(null), 300);
    }

    const handleFormSubmit = async (values, actions) => {
        try {
            // El servicio apiStoreSupplier gestiona POST (sin ID) o PUT (con ID)
            const res = await apiStoreSupplier(values)

            if (res.data.success) {
                toast.push(
                    <Notification title="Correcto" type="success">
                        Proveedor {(values.id ? 'actualizado' : 'creado')} correctamente
                    </Notification>
                )
                handleCloseDrawer(); // Cerrar el Drawer
                fetchSuppliers(); // Refrescar la tabla
            } else {
                // Si la respuesta no es exitosa pero no lanzó excepción
                const message = res.data.message || 'No se pudo guardar el proveedor'
                toast.push(
                    <Notification title="Error" type="danger">
                        {message}
                    </Notification>
                )
            }
        } catch (error) {
            // Extraer mensaje de error del backend
            let errorMessage = 'Error al guardar el proveedor.'
            
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
        setSupplierToDelete(data)
        setDeleteDialogOpen(true)
    }

    const handleCloseDeleteDialog = () => {
        setDeleteDialogOpen(false)
        setSupplierToDelete(null)
    }

    const handleConfirmDelete = async () => {
        setDeleteDialogOpen(false)

        if (!supplierToDelete || !supplierToDelete.id) return

        try {
            const res = await apiDeleteSupplier(supplierToDelete.id)

            if (res.data.success) {
                toast.push(
                    <Notification title="Correcto" type="success">
                        Proveedor eliminado correctamente
                    </Notification>
                )
                fetchSuppliers()
            } else {
                toast.push(
                    <Notification title="Error" type="danger">
                        No se pudo eliminar el proveedor.
                    </Notification>
                )
            }
        } catch (error) {
            toast.push(
                <Notification title="Error" type="danger">
                    Ocurrió un error al intentar eliminar el proveedor.
                </Notification>
            )
        } finally {
            setSupplierToDelete(null)
        }
    }


    return (
        <Card borderless className="shadow-none border-0">

            {/* 1. TABLA (Contiene Header, DataTable y Footer) */}
            <SupplierTable
                data={data}
                loading={loading}
                totalRecords={data.length}
                onAdd={handleOpenCreateDrawer} // Llamado al handler de creación
                onEdit={handleOpenEditDrawer} // Llamado al handler de edición
                onDelete={handleDelete} // Llamado al handler de eliminación
            />

            {/* 2. DRAWER DE ACCIÓN (Creación y Edición) */}
            <SupplierActionDrawer
                isOpen={drawerOpen}
                onClose={handleCloseDrawer}
                onSubmit={handleFormSubmit}
                initialValues={initialValues}
                isEdit={!!selectedSupplier}
            />

            {/* 3. MODAL DE ELIMINACIÓN */}
            <DeleteConfirmationModal
                isOpen={deleteDialogOpen}
                onClose={handleCloseDeleteDialog}
                onConfirm={handleConfirmDelete}
                itemName={supplierToDelete?.name}
                itemType="el proveedor"
            />
        </Card>
    )
}

export default Suppliers

