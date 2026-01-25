import React, { useEffect, useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'
import {
    setCurrentRouteTitle,
    setCurrentRouteSubtitle,
    setCurrentRouteInfo,
    setCurrentRouteOptions,
} from 'store/base/commonSlice'
import { Card, Notification, toast } from 'components/ui'
import ClaseTable from './components/ClaseTable'
import ClaseDrawer from './components/ClaseDrawer'
import DeleteConfirmationModal from 'components/modals/DeleteConfirmationModal'
import {
    apiGetClasses,
    apiGetSpecifics,
    apiStoreClass,
    apiDeleteClass,
} from 'services/FixedAssetService'

const Clase = () => {
    const dispatch = useDispatch()
    const [data, setData] = useState([])
    const [specifics, setSpecifics] = useState([])
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
              useful_life: selected.useful_life ?? '',
              fa_specific_id: selected.fa_specific_id ?? '',
          }
        : null

    const handleChangeRouteInfo = useCallback(() => {
        dispatch(setCurrentRouteTitle('Clase'))
        dispatch(setCurrentRouteSubtitle('Gestión de clases de activo'))
        dispatch(setCurrentRouteInfo(''))
        dispatch(setCurrentRouteOptions(''))
    }, [dispatch])

    const fetchData = useCallback(async () => {
        setLoading(true)
        try {
            const [resClasses, resSpecifics] = await Promise.all([
                apiGetClasses(),
                apiGetSpecifics(),
            ])
            if (resClasses.data?.success) {
                setData(resClasses.data.data ?? [])
            } else {
                setData(
                    Array.isArray(resClasses.data)
                        ? resClasses.data
                        : resClasses.data?.data ?? []
                )
            }
            if (resSpecifics.data?.success) {
                setSpecifics(resSpecifics.data.data ?? [])
            } else {
                setSpecifics(
                    Array.isArray(resSpecifics.data)
                        ? resSpecifics.data
                        : resSpecifics.data?.data ?? []
                )
            }
        } catch (error) {
            toast.push(
                <Notification title="Error" type="danger">
                    Error al cargar clases
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
            useful_life:
                values.useful_life === '' || values.useful_life == null
                    ? null
                    : Number(values.useful_life),
            fa_specific_id: Number(values.fa_specific_id),
        }
        if (values.id) {
            payload.id = values.id
        }
        try {
            const res = await apiStoreClass(payload)
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
            const res = await apiDeleteClass(itemToDelete.id)
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
            <ClaseTable
                data={data}
                loading={loading}
                totalRecords={data.length}
                onAdd={handleOpenCreate}
                onEdit={handleOpenEdit}
                onDelete={handleDelete}
            />
            <ClaseDrawer
                isOpen={drawerOpen}
                onClose={handleCloseDrawer}
                onSubmit={handleFormSubmit}
                initialValues={initialValues}
                isEdit={!!selected}
                specifics={specifics}
            />
            <DeleteConfirmationModal
                isOpen={deleteDialogOpen}
                onClose={handleCloseDelete}
                onConfirm={handleConfirmDelete}
                itemName={itemToDelete?.name}
                itemType="la clase (se deshabilitará)"
            />
        </Card>
    )
}

export default Clase
