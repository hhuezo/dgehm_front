import React, { useEffect, useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'
import {
    setCurrentRouteTitle,
    setCurrentRouteSubtitle,
    setCurrentRouteInfo,
    setCurrentRouteOptions,
} from 'store/base/commonSlice'
import { Card, Notification, toast } from 'components/ui'
import FixedCatalogTable from './FixedCatalogTable'
import FixedCatalogDrawer from './FixedCatalogDrawer'
import DeleteConfirmationModal from 'components/modals/DeleteConfirmationModal'

const FixedCatalogCrud = ({
    title,
    subtitle,
    listTitle,
    addButtonLabel,
    itemType,
    formLabel = 'Nombre',
    formPlaceholder = 'Ej: Nombre',
    titleCreate = 'Nuevo registro',
    titleEdit = 'Editar registro',
    apiGet,
    apiStore,
    apiDelete,
}) => {
    const dispatch = useDispatch()
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [selected, setSelected] = useState(null)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [itemToDelete, setItemToDelete] = useState(null)

    const initialValues = selected
        ? { id: selected.id, name: selected.name }
        : { id: null, name: '' }

    const handleChangeRouteInfo = useCallback(() => {
        dispatch(setCurrentRouteTitle(title))
        dispatch(setCurrentRouteSubtitle(subtitle))
        dispatch(setCurrentRouteInfo(''))
        dispatch(setCurrentRouteOptions(''))
    }, [dispatch, title, subtitle])

    const fetchData = useCallback(async () => {
        setLoading(true)
        try {
            const res = await apiGet()
            if (res.data?.success) {
                setData(res.data.data ?? [])
            } else {
                setData(Array.isArray(res.data) ? res.data : res.data?.data ?? [])
            }
        } catch (error) {
            toast.push(
                <Notification title="Error" type="danger">
                    Error al cargar datos
                </Notification>
            )
        } finally {
            setLoading(false)
        }
    }, [apiGet])

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
        try {
            const res = await apiStore(values)
            if (res.data?.success) {
                toast.push(
                    <Notification title="Correcto" type="success">
                        {values.id ? 'Actualizado' : 'Creado'} correctamente
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
            const res = await apiDelete(itemToDelete.id)
            if (res.data?.success) {
                toast.push(
                    <Notification title="Correcto" type="success">
                        Eliminado correctamente
                    </Notification>
                )
                fetchData()
            } else {
                toast.push(
                    <Notification title="Error" type="danger">
                        No se pudo eliminar
                    </Notification>
                )
            }
        } catch (error) {
            toast.push(
                <Notification title="Error" type="danger">
                    Error al eliminar
                </Notification>
            )
        } finally {
            setItemToDelete(null)
        }
    }

    return (
        <Card borderless className="shadow-none border-0">
            <FixedCatalogTable
                data={data}
                loading={loading}
                totalRecords={data.length}
                onAdd={handleOpenCreate}
                onEdit={handleOpenEdit}
                onDelete={handleDelete}
                listTitle={listTitle}
                addButtonLabel={addButtonLabel}
            />
            <FixedCatalogDrawer
                isOpen={drawerOpen}
                onClose={handleCloseDrawer}
                onSubmit={handleFormSubmit}
                initialValues={initialValues}
                isEdit={!!selected}
                titleCreate={titleCreate}
                titleEdit={titleEdit}
                formLabel={formLabel}
                formPlaceholder={formPlaceholder}
            />
            <DeleteConfirmationModal
                isOpen={deleteDialogOpen}
                onClose={handleCloseDelete}
                onConfirm={handleConfirmDelete}
                itemName={itemToDelete?.name}
                itemType={itemType}
            />
        </Card>
    )
}

export default FixedCatalogCrud
