// src/views/catalog/AccountingAccounts.jsx (Componente Contenedor)
import React, { useEffect, useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'

import {
    setCurrentRouteTitle,
    setCurrentRouteSubtitle,
    setCurrentRouteInfo,
    setCurrentRouteOptions,
} from 'store/base/commonSlice'

import {
    apiGetAccountingAccounts,
    apiStoreAccountingAccount,
    apiDeleteAccountingAccount,
} from 'services/AccountingAccountService'

import {
    Card,
    Notification,
    toast,
} from 'components/ui'

// Componentes importados
import AccountingAccountTable from './components/AccountingAccountTable'
import AccountingAccountActionDrawer from './components/AccountingAccountActionDrawer'
import DeleteConfirmationModal from 'components/modals/DeleteConfirmationModal'

const AccountingAccounts = () => {
    const dispatch = useDispatch()

    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)

    // Estados de UI y Datos
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [selectedAccount, setSelectedAccount] = useState(null)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [accountToDelete, setAccountToDelete] = useState(null)

    // Valores iniciales para la creación/edición (Creación siempre empieza vacío)
    const initialValues = selectedAccount
        ? { 
            id: selectedAccount.id, 
            code: selectedAccount.code || '', 
            name: selectedAccount.name || ''
        }
        : { 
            id: null, 
            code: '', 
            name: ''
        };

    const isEditMode = !!selectedAccount && !drawerOpen;


    // ---- Lógica de Ruta y Fetch ----

    const handleChangeRouteInfo = useCallback(() => {
        dispatch(setCurrentRouteTitle('Cuentas Contables'))
        dispatch(setCurrentRouteSubtitle('Gestión de cuentas contables'))
        dispatch(setCurrentRouteInfo(''))
        dispatch(setCurrentRouteOptions(''))
    }, [dispatch])

    useEffect(() => {
        handleChangeRouteInfo()
        fetchAccountingAccounts()
    }, [handleChangeRouteInfo])

    const fetchAccountingAccounts = async () => {
        setLoading(true)
        try {
            const res = await apiGetAccountingAccounts()
            if (res.data.success) {
                setData(res.data.data)
            }
        } catch (error) {
            toast.push(
                <Notification title="Error" type="danger">
                    Error al cargar cuentas contables
                </Notification>
            )
        } finally {
            setLoading(false)
        }
    }

    // ---- Handlers de Creación/Edición (Lógica de la API) ----

    const handleOpenCreateDrawer = () => {
        setSelectedAccount(null); // Asegura que está en modo creación
        setDrawerOpen(true);
    }

    const handleOpenEditDrawer = (accountData) => {
        setSelectedAccount(accountData); // Carga datos para edición
        setDrawerOpen(true);
    }

    const handleCloseDrawer = () => {
        setDrawerOpen(false);
        // Limpiar la cuenta seleccionada solo después de que el Drawer se cierre
        setTimeout(() => setSelectedAccount(null), 300);
    }

    const handleFormSubmit = async (values, actions) => {
        try {
            // El servicio apiStoreAccountingAccount gestiona POST (sin ID) o PUT (con ID)
            const res = await apiStoreAccountingAccount(values)

            if (res.data.success) {
                toast.push(
                    <Notification title="Correcto" type="success">
                        Cuenta contable {(values.id ? 'actualizada' : 'creada')} correctamente
                    </Notification>
                )
                handleCloseDrawer(); // Cerrar el Drawer
                fetchAccountingAccounts(); // Refrescar la tabla
            } else {
                // Si la respuesta no es exitosa pero no lanzó excepción
                const message = res.data.message || 'No se pudo guardar la cuenta contable'
                toast.push(
                    <Notification title="Error" type="danger">
                        {message}
                    </Notification>
                )
            }
        } catch (error) {
            // Extraer mensaje de error del backend
            let errorMessage = 'Error al guardar la cuenta contable.'
            
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
        setAccountToDelete(data)
        setDeleteDialogOpen(true)
    }

    const handleCloseDeleteDialog = () => {
        setDeleteDialogOpen(false)
        setAccountToDelete(null)
    }

    const handleConfirmDelete = async () => {
        setDeleteDialogOpen(false)

        if (!accountToDelete || !accountToDelete.id) return

        try {
            const res = await apiDeleteAccountingAccount(accountToDelete.id)

            if (res.data.success) {
                toast.push(
                    <Notification title="Correcto" type="success">
                        Cuenta contable eliminada correctamente
                    </Notification>
                )
                fetchAccountingAccounts()
            } else {
                toast.push(
                    <Notification title="Error" type="danger">
                        No se pudo eliminar la cuenta contable.
                    </Notification>
                )
            }
        } catch (error) {
            toast.push(
                <Notification title="Error" type="danger">
                    Ocurrió un error al intentar eliminar la cuenta contable.
                </Notification>
            )
        } finally {
            setAccountToDelete(null)
        }
    }


    return (
        <Card borderless className="shadow-none border-0">

            {/* 1. TABLA (Contiene Header, DataTable y Footer) */}
            <AccountingAccountTable
                data={data}
                loading={loading}
                totalRecords={data.length}
                onAdd={handleOpenCreateDrawer} // Llamado al handler de creación
                onEdit={handleOpenEditDrawer} // Llamado al handler de edición
                onDelete={handleDelete} // Llamado al handler de eliminación
            />

            {/* 2. DRAWER DE ACCIÓN (Creación y Edición) */}
            <AccountingAccountActionDrawer
                isOpen={drawerOpen}
                onClose={handleCloseDrawer}
                onSubmit={handleFormSubmit}
                initialValues={initialValues}
                isEdit={!!selectedAccount}
            />

            {/* 3. MODAL DE ELIMINACIÓN */}
            <DeleteConfirmationModal
                isOpen={deleteDialogOpen}
                onClose={handleCloseDeleteDialog}
                onConfirm={handleConfirmDelete}
                itemName={accountToDelete?.name}
                itemType="la cuenta contable"
            />
        </Card>
    )
}

export default AccountingAccounts

