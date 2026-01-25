import React, { useEffect, useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'
import {
    setCurrentRouteTitle,
    setCurrentRouteSubtitle,
    setCurrentRouteInfo,
    setCurrentRouteOptions,
} from 'store/base/commonSlice'
import { Card, Notification, toast } from 'components/ui'
import OrganizationalUnitTable from './components/OrganizationalUnitTable'
import OrganizationalUnitDrawer from './components/OrganizationalUnitDrawer'
import DeleteConfirmationModal from 'components/modals/DeleteConfirmationModal'
import {
    apiGetOrganizationalUnits,
    apiGetOrganizationalUnitTypes,
    apiStoreOrganizationalUnit,
    apiDeleteOrganizationalUnit,
} from 'services/FixedAssetService'

const OrganizationalUnit = () => {
    const dispatch = useDispatch()
    const [data, setData] = useState([])
    const [types, setTypes] = useState([])
    const [loading, setLoading] = useState(false)
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [selected, setSelected] = useState(null)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [itemToDelete, setItemToDelete] = useState(null)

    const initialValues = selected
        ? {
              id: selected.id,
              name: selected.name,
              abbreviation: selected.abbreviation ?? '',
              code: selected.code ?? '',
              fa_organizational_unit_type_id: selected.fa_organizational_unit_type_id ?? '',
              fa_organizational_unit_id: selected.fa_organizational_unit_id ?? '',
          }
        : null

    const handleChangeRouteInfo = useCallback(() => {
        dispatch(setCurrentRouteTitle('Unidad organizativa'))
        dispatch(setCurrentRouteSubtitle('Gestión de unidades organizativas'))
        dispatch(setCurrentRouteInfo(''))
        dispatch(setCurrentRouteOptions(''))
    }, [dispatch])

    const fetchData = useCallback(async () => {
        setLoading(true)
        try {
            const [resUnits, resTypes] = await Promise.all([
                apiGetOrganizationalUnits(),
                apiGetOrganizationalUnitTypes(),
            ])
            if (resUnits.data?.success) {
                setData(resUnits.data.data ?? [])
            } else {
                setData(Array.isArray(resUnits.data) ? resUnits.data : resUnits.data?.data ?? [])
            }
            if (resTypes.data?.success) {
                setTypes(resTypes.data.data ?? [])
            } else {
                setTypes(Array.isArray(resTypes.data) ? resTypes.data : resTypes.data?.data ?? [])
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
            ...values,
            abbreviation: values.abbreviation?.trim() || null,
            code: values.code?.trim() || null,
            fa_organizational_unit_type_id: Number(values.fa_organizational_unit_type_id),
            fa_organizational_unit_id:
                values.fa_organizational_unit_id === '' || values.fa_organizational_unit_id == null
                    ? null
                    : Number(values.fa_organizational_unit_id),
        }
        try {
            const res = await apiStoreOrganizationalUnit(payload)
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
            const res = await apiDeleteOrganizationalUnit(itemToDelete.id)
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
            <OrganizationalUnitTable
                data={data}
                loading={loading}
                totalRecords={data.length}
                onAdd={handleOpenCreate}
                onEdit={handleOpenEdit}
                onDelete={handleDelete}
            />
            <OrganizationalUnitDrawer
                isOpen={drawerOpen}
                onClose={handleCloseDrawer}
                onSubmit={handleFormSubmit}
                initialValues={initialValues}
                isEdit={!!selected}
                types={types}
                units={data}
                editingId={selected?.id}
            />
            <DeleteConfirmationModal
                isOpen={deleteDialogOpen}
                onClose={handleCloseDelete}
                onConfirm={handleConfirmDelete}
                itemName={itemToDelete?.name}
                itemType="la unidad organizativa (se deshabilitará)"
            />
        </Card>
    )
}

export default OrganizationalUnit
