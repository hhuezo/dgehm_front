import React, { useEffect, useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'
import {
    setCurrentRouteTitle,
    setCurrentRouteSubtitle,
    setCurrentRouteInfo,
    setCurrentRouteOptions,
} from 'store/base/commonSlice'
import { Card, Notification, toast } from 'components/ui'
import InstitutionTable from './components/InstitutionTable'
import InstitutionDrawer from './components/InstitutionDrawer'
import DeleteConfirmationModal from 'components/modals/DeleteConfirmationModal'
import {
    apiGetInstitutions,
    apiStoreInstitution,
    apiDeleteInstitution,
} from 'services/FixedAssetService'

const Institution = () => {
    const dispatch = useDispatch()
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [selected, setSelected] = useState(null)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [itemToDelete, setItemToDelete] = useState(null)

    const initialValues = selected
        ? {
              id: selected.id,
              name: selected.name,
              code: selected.code ?? '',
          }
        : null

    const handleChangeRouteInfo = useCallback(() => {
        dispatch(setCurrentRouteTitle('Institución'))
        dispatch(setCurrentRouteSubtitle('Gestión de instituciones'))
        dispatch(setCurrentRouteInfo(''))
        dispatch(setCurrentRouteOptions(''))
    }, [dispatch])

    const fetchData = useCallback(async () => {
        setLoading(true)
        try {
            const res = await apiGetInstitutions()
            if (res.data?.success) {
                setData(res.data.data ?? [])
            } else {
                setData(Array.isArray(res.data) ? res.data : res.data?.data ?? [])
            }
        } catch (error) {
            toast.push(
                <Notification title="Error" type="danger">
                    Error al cargar instituciones
                </Notification>
            )
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        handleChangeRouteInfo()
        fetchData()
    }, [handleChangeRouteInfo, fetchData])

    const handleOpenCreate = () => {
        setSelected(null)
        setDrawerOpen(true)
    }

    const handleOpenEdit = (row) => {
        setSelected(row)
        setDrawerOpen(true)
    }

    const handleCloseDrawer = () => {
        setDrawerOpen(false)
        setTimeout(() => setSelected(null), 300)
    }

    const handleFormSubmit = async (values, actions) => {
        const payload = {
            name: values.name?.trim() || '',
            code: values.code?.trim() || '',
        }
        if (values.id) {
            payload.id = values.id
        }
        try {
            const res = await apiStoreInstitution(payload)
            if (res.data?.success) {
                toast.push(
                    <Notification title="Correcto" type="success">
                        {payload.id ? 'Actualizado' : 'Creado'} correctamente
                    </Notification>
                )
                handleCloseDrawer()
                fetchData()
            } else {
                const msg = res.data?.message || 'No se pudo guardar'
                toast.push(<Notification title="Error" type="danger">{msg}</Notification>)
            }
        } catch (error) {
            let msg = 'Error al guardar.'
            if (error.response?.data?.errors) {
                const first = Object.values(error.response.data.errors)[0]
                msg = Array.isArray(first) ? first[0] : first
            } else if (error.response?.data?.message) {
                msg = error.response.data.message
            } else if (error.response?.data?.error) {
                msg = error.response.data.error
            } else if (error.message) msg = error.message
            toast.push(<Notification title="Error" type="danger">{msg}</Notification>)
        } finally {
            actions.setSubmitting(false)
        }
    }

    const handleDelete = (row) => {
        setItemToDelete(row)
        setDeleteDialogOpen(true)
    }

    const handleCloseDelete = () => {
        setDeleteDialogOpen(false)
        setItemToDelete(null)
    }

    const handleConfirmDelete = async () => {
        setDeleteDialogOpen(false)
        if (!itemToDelete?.id) return
        try {
            const res = await apiDeleteInstitution(itemToDelete.id)
            if (res.data?.success) {
                toast.push(
                    <Notification title="Correcto" type="success">
                        Registro deshabilitado correctamente
                    </Notification>
                )
                fetchData()
            } else {
                toast.push(
                    <Notification title="Error" type="danger">
                        No se pudo deshabilitar
                    </Notification>
                )
            }
        } catch (error) {
            toast.push(
                <Notification title="Error" type="danger">
                    Error al deshabilitar
                </Notification>
            )
        } finally {
            setItemToDelete(null)
        }
    }

    return (
        <Card borderless className="shadow-none border-0">
            <InstitutionTable
                data={data}
                loading={loading}
                totalRecords={data.length}
                onAdd={handleOpenCreate}
                onEdit={handleOpenEdit}
                onDelete={handleDelete}
            />
            <InstitutionDrawer
                isOpen={drawerOpen}
                onClose={handleCloseDrawer}
                onSubmit={handleFormSubmit}
                initialValues={initialValues}
                isEdit={!!selected}
            />
            <DeleteConfirmationModal
                isOpen={deleteDialogOpen}
                onClose={handleCloseDelete}
                onConfirm={handleConfirmDelete}
                itemName={itemToDelete?.name}
                itemType="la institución (se deshabilitará)"
            />
        </Card>
    )
}

export default Institution
