// src/views/catalog/Products.jsx (Componente Contenedor)
import React, { useEffect, useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'

import {
    setCurrentRouteTitle,
    setCurrentRouteSubtitle,
    setCurrentRouteInfo,
    setCurrentRouteOptions,
} from 'store/base/commonSlice'

import {
    apiGetProducts,
    apiStoreProduct,
    apiDeleteProduct,
} from 'services/ProductService'

import {
    apiGetAccountingAccounts,
} from 'services/AccountingAccountService'

import {
    Card,
    Notification,
    toast,
} from 'components/ui'

// Componentes importados
import ProductTable from './components/ProductTable'
import ProductActionDrawer from './components/ProductActionDrawer'
import DeleteConfirmationModal from 'components/modals/DeleteConfirmationModal'

const Products = () => {
    const dispatch = useDispatch()

    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [accountingAccounts, setAccountingAccounts] = useState([])

    // Estados de UI y Datos
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState(null)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [productToDelete, setProductToDelete] = useState(null)

    // Valores iniciales para la creación/edición (Creación siempre empieza vacío)
    const initialValues = selectedProduct
        ? { 
            id: selectedProduct.id, 
            name: selectedProduct.name || '', 
            accounting_account_id: selectedProduct.accounting_account_id || '',
            measure_id: selectedProduct.measure_id || '',
            description: selectedProduct.description || ''
        }
        : { 
            id: null, 
            name: '', 
            accounting_account_id: '',
            measure_id: '',
            description: ''
        };

    const isEditMode = !!selectedProduct && !drawerOpen;


    // ---- Lógica de Ruta y Fetch ----

    const handleChangeRouteInfo = useCallback(() => {
        dispatch(setCurrentRouteTitle('Productos'))
        dispatch(setCurrentRouteSubtitle('Gestión de productos'))
        dispatch(setCurrentRouteInfo(''))
        dispatch(setCurrentRouteOptions(''))
    }, [dispatch])

    useEffect(() => {
        handleChangeRouteInfo()
        fetchProducts()
        fetchAccountingAccounts()
    }, [handleChangeRouteInfo])

    const fetchProducts = async () => {
        setLoading(true)
        try {
            const res = await apiGetProducts()
            if (res.data.success) {
                setData(res.data.data)
            }
        } catch (error) {
            toast.push(
                <Notification title="Error" type="danger">
                    Error al cargar productos
                </Notification>
            )
        } finally {
            setLoading(false)
        }
    }

    const fetchAccountingAccounts = async () => {
        try {
            const res = await apiGetAccountingAccounts()
            if (res.data.success) {
                setAccountingAccounts(res.data.data)
            }
        } catch (error) {
            toast.push(
                <Notification title="Error" type="danger">
                    Error al cargar cuentas contables
                </Notification>
            )
        }
    }

    // ---- Handlers de Creación/Edición (Lógica de la API) ----

    const handleOpenCreateDrawer = () => {
        setSelectedProduct(null); // Asegura que está en modo creación
        setDrawerOpen(true);
    }

    const handleOpenEditDrawer = (productData) => {
        setSelectedProduct(productData); // Carga datos para edición
        setDrawerOpen(true);
    }

    const handleCloseDrawer = () => {
        setDrawerOpen(false);
        // Limpiar el producto seleccionado solo después de que el Drawer se cierre
        setTimeout(() => setSelectedProduct(null), 300);
    }

    const handleFormSubmit = async (values, actions) => {
        try {
            // El servicio apiStoreProduct gestiona POST (sin ID) o PUT (con ID)
            const res = await apiStoreProduct(values)

            if (res.data.success) {
                toast.push(
                    <Notification title="Correcto" type="success">
                        Producto {(values.id ? 'actualizado' : 'creado')} correctamente
                    </Notification>
                )
                handleCloseDrawer(); // Cerrar el Drawer
                fetchProducts(); // Refrescar la tabla
            } else {
                // Si la respuesta no es exitosa pero no lanzó excepción
                const message = res.data.message || 'No se pudo guardar el producto'
                toast.push(
                    <Notification title="Error" type="danger">
                        {message}
                    </Notification>
                )
            }
        } catch (error) {
            // Extraer mensaje de error del backend
            let errorMessage = 'Error al guardar el producto.'
            
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
        setProductToDelete(data)
        setDeleteDialogOpen(true)
    }

    const handleCloseDeleteDialog = () => {
        setDeleteDialogOpen(false)
        setProductToDelete(null)
    }

    const handleConfirmDelete = async () => {
        setDeleteDialogOpen(false)

        if (!productToDelete || !productToDelete.id) return

        try {
            const res = await apiDeleteProduct(productToDelete.id)

            if (res.data.success) {
                toast.push(
                    <Notification title="Correcto" type="success">
                        Producto eliminado correctamente
                    </Notification>
                )
                fetchProducts()
            } else {
                toast.push(
                    <Notification title="Error" type="danger">
                        No se pudo eliminar el producto.
                    </Notification>
                )
            }
        } catch (error) {
            toast.push(
                <Notification title="Error" type="danger">
                    Ocurrió un error al intentar eliminar el producto.
                </Notification>
            )
        } finally {
            setProductToDelete(null)
        }
    }


    return (
        <Card borderless className="shadow-none border-0">

            {/* 1. TABLA (Contiene Header, DataTable y Footer) */}
            <ProductTable
                data={data}
                loading={loading}
                totalRecords={data.length}
                onAdd={handleOpenCreateDrawer} // Llamado al handler de creación
                onEdit={handleOpenEditDrawer} // Llamado al handler de edición
                onDelete={handleDelete} // Llamado al handler de eliminación
            />

            {/* 2. DRAWER DE ACCIÓN (Creación y Edición) */}
            <ProductActionDrawer
                isOpen={drawerOpen}
                onClose={handleCloseDrawer}
                onSubmit={handleFormSubmit}
                initialValues={initialValues}
                isEdit={!!selectedProduct}
                accountingAccounts={accountingAccounts}
            />

            {/* 3. MODAL DE ELIMINACIÓN */}
            <DeleteConfirmationModal
                isOpen={deleteDialogOpen}
                onClose={handleCloseDeleteDialog}
                onConfirm={handleConfirmDelete}
                itemName={productToDelete?.name}
                itemType="el producto"
            />
        </Card>
    )
}

export default Products

