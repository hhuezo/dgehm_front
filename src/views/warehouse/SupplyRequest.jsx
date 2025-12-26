import React, { useEffect, useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
    setCurrentRouteTitle,
    setCurrentRouteSubtitle,
    setCurrentRouteInfo,
    setCurrentRouteOptions,
} from 'store/base/commonSlice'

import {
    apiGetSupplyRequests,
    apiStoreSupplyRequest,
    apiGetBosses,
} from 'services/WareHouseServise'

import { Card, Notification, toast } from 'components/ui'
import DrawerOld from 'components/ui/Drawer/DrawerOld'
import { HiPlusCircle } from 'react-icons/hi'

import SupplyRequestTable from './components/SupplyRequestTable'
import SupplyRequestForm from './components/SupplyRequestForm'
import SupplyRequestDrawers from './components/SupplyRequestDrawers'
import { getTodayDateString } from './components/SupplyRequestUtils'


const SupplyRequests = () => {
    const dispatch = useDispatch()

    const userOffices = useSelector((state) => state.auth.user.offices);
    const userId = useSelector((state) => state.auth.user.id);

    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [immediateBosses, setImmediateBosses] = useState([]);

    const [drawerOpen, setDrawerOpen] = useState(false)
    const [editDrawerOpen, setEditDrawerOpen] = useState(false)
    const [selectedRequest, setSelectedRequest] = useState(null)


    const fetchBossesByOffice = async (officeId) => {
        setImmediateBosses([]);
        if (!officeId) return;
        try {
            const res = await apiGetBosses(officeId);
            if (res.data.success) {
                setImmediateBosses(res.data.data);
            }
        } catch (error) {
            toast.push(<Notification title="Error" type="danger">Error al cargar jefes de área.</Notification>);
            setImmediateBosses([]);
        }
    };

    const handleChange = useCallback(() => {
        dispatch(setCurrentRouteTitle('Solicitudes de Insumos'))
        dispatch(setCurrentRouteSubtitle('Gestión de solicitudes de almacén'))
        dispatch(setCurrentRouteInfo(''))
        dispatch(setCurrentRouteOptions(''))
    }, [dispatch])

    useEffect(() => {
        handleChange()
        fetchSupplyRequests()
    }, [handleChange])

    const fetchSupplyRequests = async () => {
        setLoading(true)
        try {
            const res = await apiGetSupplyRequests()
            if (res.data.success) {
                setData(res.data.data)
            }
        } catch (error) {
            toast.push(<Notification title="Error" type="danger">Error al cargar solicitudes de insumos</Notification>)
        } finally {
            setLoading(false)
        }
    }


    const handleAddRequest = () => {
        if (userOffices.length === 1) {
            const singleOfficeId = userOffices[0].id;
            fetchBossesByOffice(singleOfficeId);
        }
        setDrawerOpen(true);
    }

    const handleCloseDrawer = () => {
        setDrawerOpen(false)
        setImmediateBosses([]);
    }

    const handleCreateRequest = async (values, actions) => {
        try {
            const payload = { ...values, requester_id: userId };
            const res = await apiStoreSupplyRequest(payload);

            if (res.data.success) {
                toast.push(<Notification title="Correcto" type="success">Solicitud creada correctamente</Notification>)
                setDrawerOpen(false)
                fetchSupplyRequests()
            } else {
                const errorMsg = res.data.message || "No se pudo crear la solicitud";
                toast.push(<Notification title="Error" type="danger">{errorMsg}</Notification>)
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Error de red o servidor al crear la solicitud.';
            toast.push(<Notification title="Error" type="danger">{errorMsg}</Notification>)
        } finally {
            actions.setSubmitting(false)
        }
    }

    const handleEdit = (data) => {
        setSelectedRequest(data)
        setEditDrawerOpen(true)
    }

    const handleCloseEditDrawer = () => {
        setEditDrawerOpen(false)
        setSelectedRequest(null)
    }

    const handleUpdateRequest = async (values, actions) => {
        try {
            const dataToUpdate = { ...values, id: selectedRequest.id };
            const res = await apiStoreSupplyRequest(dataToUpdate)

            if (res.data.success) {
                toast.push(<Notification title="Correcto" type="success">Solicitud actualizada correctamente</Notification>)
                setEditDrawerOpen(false)
                fetchSupplyRequests()
            }
        } catch (error) {
            toast.push(<Notification title="Error" type="danger">No se pudo actualizar la solicitud</Notification>)
        } finally {
            actions.setSubmitting(false)
        }
    }


    return (
        <Card borderless className="shadow-none border-0">
            <div className="flex justify-between items-center border-b px-4 py-3">
                <h4 className="text-lg font-semibold">Listado de Solicitudes de Insumos</h4>
                <button
                    className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                    onClick={handleAddRequest}
                >
                    <HiPlusCircle className="text-lg" />
                    Nueva Solicitud
                </button>
            </div>

            <div className="p-4">
                <SupplyRequestTable
                    data={data}
                    loading={loading}
                    handleEdit={handleEdit}
                />
            </div>

            <div className="border-t px-4 py-2 text-sm text-gray-500">
                Total registros: {data.length}
            </div>

            <DrawerOld
                isOpen={drawerOpen}
                onClose={handleCloseDrawer}
                closable={false}
            >
                <div className="flex items-center justify-between mb-4 border-b pb-3">
                    <h5 className="font-semibold text-xl">Crear Solicitud</h5>
                    <button
                        type="button"
                        className="px-2 py-1 text-sm text-gray-500 hover:text-gray-700 rounded"
                        onClick={handleCloseDrawer}
                    >
                        X
                    </button>
                </div>

                <SupplyRequestForm
                    userOffices={userOffices}
                    userId={userId}
                    immediateBosses={immediateBosses}
                    fetchBossesByOffice={fetchBossesByOffice}
                    onSubmit={handleCreateRequest}
                    onClose={handleCloseDrawer}
                />
            </DrawerOld>

            <SupplyRequestDrawers
                editDrawerOpen={editDrawerOpen}
                handleCloseEditDrawer={handleCloseEditDrawer}
                selectedRequest={selectedRequest}
                handleUpdateRequest={handleUpdateRequest}
                getTodayDateString={getTodayDateString}
            />
        </Card>
    )
}

export default SupplyRequests