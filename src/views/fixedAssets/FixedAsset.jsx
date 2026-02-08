import React, { useEffect, useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'
import {
    setCurrentRouteTitle,
    setCurrentRouteSubtitle,
    setCurrentRouteInfo,
    setCurrentRouteOptions,
} from 'store/base/commonSlice'
import { Card, Notification, toast } from 'components/ui'
import FixedAssetTable from './components/FixedAssetTable'
import FixedAssetDrawer from './components/FixedAssetDrawer'
import DeleteConfirmationModal from 'components/modals/DeleteConfirmationModal'
import {
    apiGetFixedAssets,
    apiStoreFixedAsset,
    apiDeleteFixedAsset,
    apiGetClasses,
    apiGetOrganizationalUnits,
    apiGetPhysicalConditions,
    apiGetOrigins,
} from 'services/FixedAssetService'

const FixedAsset = () => {
    const dispatch = useDispatch()
    const [data, setData] = useState([])
    const [classes, setClasses] = useState([])
    const [organizationalUnits, setOrganizationalUnits] = useState([])
    const [physicalConditions, setPhysicalConditions] = useState([])
    const [origins, setOrigins] = useState([])
    const [loading, setLoading] = useState(false)
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [selected, setSelected] = useState(null)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [itemToDelete, setItemToDelete] = useState(null)

    const initialValues = selected
        ? {
              id: selected.id,
              fa_class_id: selected.fa_class_id ?? '',
              code: selected.code ?? '',
              correlative: selected.correlative ?? '',
              description: selected.description ?? '',
              brand: selected.brand ?? '',
              model: selected.model ?? '',
              serial_number: selected.serial_number ?? '',
              location: selected.location ?? '',
              policy: selected.policy ?? '',
              current_responsible: selected.current_responsible ?? '',
              organizational_unit_id: selected.organizational_unit_id ?? '',
              asset_type: selected.asset_type ?? '',
              acquisition_date: selected.acquisition_date
                  ? selected.acquisition_date.split('T')[0]
                  : '',
              supplier: selected.supplier ?? '',
              invoice: selected.invoice ?? '',
              origin_id: selected.origin_id ?? '',
              physical_condition_id: selected.physical_condition_id ?? '',
              additional_description: selected.additional_description ?? '',
              measurements: selected.measurements ?? '',
              observation: selected.observation ?? '',
              is_insured: selected.is_insured ?? false,
              insured_description: selected.insured_description ?? '',
              purchase_value: selected.purchase_value ?? '',
          }
        : null

    const handleChangeRouteInfo = useCallback(() => {
        dispatch(setCurrentRouteTitle('Activos Fijos'))
        dispatch(setCurrentRouteSubtitle('Gestión de activos fijos'))
        dispatch(setCurrentRouteInfo(''))
        dispatch(setCurrentRouteOptions(''))
    }, [dispatch])

    const fetchData = useCallback(async () => {
        setLoading(true)
        try {
            const [resAssets, resClasses, resUnits, resConditions, resOrigins] =
                await Promise.all([
                    apiGetFixedAssets(),
                    apiGetClasses(),
                    apiGetOrganizationalUnits(),
                    apiGetPhysicalConditions(),
                    apiGetOrigins(),
                ])

            // Assets
            if (resAssets.data?.success) {
                setData(resAssets.data.data ?? [])
            } else {
                setData(
                    Array.isArray(resAssets.data)
                        ? resAssets.data
                        : resAssets.data?.data ?? []
                )
            }

            // Classes
            if (resClasses.data?.success) {
                setClasses(resClasses.data.data ?? [])
            } else {
                setClasses(
                    Array.isArray(resClasses.data)
                        ? resClasses.data
                        : resClasses.data?.data ?? []
                )
            }

            // Organizational Units
            if (resUnits.data?.success) {
                setOrganizationalUnits(resUnits.data.data ?? [])
            } else {
                setOrganizationalUnits(
                    Array.isArray(resUnits.data)
                        ? resUnits.data
                        : resUnits.data?.data ?? []
                )
            }

            // Physical Conditions
            if (resConditions.data?.success) {
                setPhysicalConditions(resConditions.data.data ?? [])
            } else {
                setPhysicalConditions(
                    Array.isArray(resConditions.data)
                        ? resConditions.data
                        : resConditions.data?.data ?? []
                )
            }

            // Origins
            if (resOrigins.data?.success) {
                setOrigins(resOrigins.data.data ?? [])
            } else {
                setOrigins(
                    Array.isArray(resOrigins.data)
                        ? resOrigins.data
                        : resOrigins.data?.data ?? []
                )
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
            fa_class_id: Number(values.fa_class_id),
            description: values.description?.trim() || '',
            brand: values.brand?.trim() || null,
            model: values.model?.trim() || null,
            serial_number: values.serial_number?.trim() || null,
            location: values.location?.trim() || '',
            policy: values.policy?.trim() || null,
            current_responsible: values.current_responsible?.trim() || '',
            organizational_unit_id: Number(values.organizational_unit_id),
            asset_type: values.asset_type?.trim() || '',
            acquisition_date: values.acquisition_date || null,
            supplier: values.supplier?.trim() || null,
            invoice: values.invoice?.trim() || null,
            origin_id: Number(values.origin_id),
            physical_condition_id: Number(values.physical_condition_id),
            additional_description: values.additional_description?.trim() || null,
            measurements: values.measurements?.trim() || null,
            observation: values.observation?.trim() || null,
            is_insured: values.is_insured ?? false,
            insured_description: values.insured_description?.trim() || null,
            purchase_value: values.purchase_value
                ? parseFloat(values.purchase_value)
                : 0,
        }

        if (values.id) {
            payload.id = values.id
        }

        try {
            const res = await apiStoreFixedAsset(payload)
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
                toast.push(
                    <Notification title="Error" type="danger">
                        {msg}
                    </Notification>
                )
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
            } else if (error.message) {
                msg = error.message
            }
            toast.push(
                <Notification title="Error" type="danger">
                    {msg}
                </Notification>
            )
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
            const res = await apiDeleteFixedAsset(itemToDelete.id)
            if (res.data?.success) {
                toast.push(
                    <Notification title="Correcto" type="success">
                        Activo fijo eliminado correctamente
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
            <FixedAssetTable
                data={data}
                loading={loading}
                totalRecords={data.length}
                onAdd={handleOpenCreate}
                onEdit={handleOpenEdit}
                onDelete={handleDelete}
            />
            <FixedAssetDrawer
                isOpen={drawerOpen}
                onClose={handleCloseDrawer}
                onSubmit={handleFormSubmit}
                initialValues={initialValues}
                isEdit={!!selected}
                classes={classes}
                organizationalUnits={organizationalUnits}
                physicalConditions={physicalConditions}
                origins={origins}
            />
            <DeleteConfirmationModal
                isOpen={deleteDialogOpen}
                onClose={handleCloseDelete}
                onConfirm={handleConfirmDelete}
                itemName={itemToDelete?.description}
                itemType="el activo fijo"
            />
        </Card>
    )
}

export default FixedAsset
