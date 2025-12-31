import React, { useEffect, useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
    setCurrentRouteTitle,
    setCurrentRouteSubtitle,
    setCurrentRouteInfo,
    setCurrentRouteOptions,
} from 'store/base/commonSlice'

import {
    apiGetSupplyReturns,
    apiStoreSupplyReturn,
    apiGetAdministrativeTechnicians, // Asumo que esta función trae a los posibles receptores
    apiGetBosses, // Para obtener el jefe inmediato
} from 'services/WareHouseServise' // Asegúrate de que esta ruta contenga las funciones

import { Card, Notification, toast } from 'components/ui'
import DrawerOld from 'components/ui/Drawer/DrawerOld'
import { HiPlusCircle } from 'react-icons/hi'

// Componentes a crear/adaptar
import SupplyReturnTable from './components/SupplyReturnTable'
import SupplyReturnForm from './components/SupplyReturnForm'
import SupplyReturnDrawers from './components/SupplyReturnDrawers'
import { getTodayDateString } from './components/SupplyReturnUtils' // Utilidad adaptada


const SupplyReturns = () => {
    const dispatch = useDispatch()

    const userOffices = useSelector((state) => state.auth.user.offices);
    const userId = useSelector((state) => state.auth.user.id); // Usuario que registra/devuelve

    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)

    // Datos necesarios para los selectores del formulario
    const [immediateSupervisors, setImmediateSupervisors] = useState([]);
    const [receivingTechnicians, setReceivingTechnicians] = useState([]);

    const [drawerOpen, setDrawerOpen] = useState(false)
    const [editDrawerOpen, setEditDrawerOpen] = useState(false)
    const [selectedReturn, setSelectedReturn] = useState(null)


    // Carga a los usuarios que pueden recibir la devolución (Técnicos administrativos)
    const fetchReceivingTechnicians = async () => {
        try {
            const res = await apiGetAdministrativeTechnicians();
            if (res.data.success) {
                setReceivingTechnicians(res.data.data);
            }
        } catch (error) {
            toast.push(<Notification title="Error" type="danger">Error al cargar técnicos receptores.</Notification>);
            setReceivingTechnicians([]);
        }
    };

    // Carga al jefe inmediato (supervisor)
    const fetchSupervisorsByOffice = async (officeId) => {
        setImmediateSupervisors([]);
        if (!officeId) return;
        try {
            const res = await apiGetBosses(officeId);
            if (res.data.success) {
                setImmediateSupervisors(res.data.data);
            }
        } catch (error) {
            toast.push(<Notification title="Error" type="danger">Error al cargar jefes de área.</Notification>);
            setImmediateSupervisors([]);
        }
    };

    const handleChange = useCallback(() => {
        dispatch(setCurrentRouteTitle('Devolución de Suministros'))
        dispatch(setCurrentRouteSubtitle('Gestión de devoluciones a almacén'))
        dispatch(setCurrentRouteInfo(''))
        dispatch(setCurrentRouteOptions(''))
    }, [dispatch])

    useEffect(() => {
        handleChange()
        fetchSupplyReturns()
        fetchReceivingTechnicians() // Carga los posibles receptores al iniciar
    }, [handleChange])

    const fetchSupplyReturns = async () => {
        setLoading(true)
        try {
            const res = await apiGetSupplyReturns()
            if (res.data.success) {
                setData(res.data.data)
            }
        } catch (error) {
            toast.push(<Notification title="Error" type="danger">Error al cargar devoluciones de suministros</Notification>)
        } finally {
            setLoading(false)
        }
    }


    const handleAddReturn = () => {
        if (userOffices.length === 1) {
            const singleOfficeId = userOffices[0].id;
            fetchSupervisorsByOffice(singleOfficeId);
        }
        setDrawerOpen(true);
    }

    const handleCloseDrawer = () => {
        setDrawerOpen(false)
        setImmediateSupervisors([]);
    }

    const handleCreateReturn = async (values, actions) => {
        try {
            // El usuario logueado es la persona que devuelve el suministro (returned_by_id)
            const payload = { ...values, returned_by_id: userId };
            const res = await apiStoreSupplyReturn(payload);

            if (res.data.success) {
                toast.push(<Notification title="Correcto" type="success">Devolución registrada correctamente</Notification>)
                setDrawerOpen(false)
                fetchSupplyReturns()
            } else {
                const errorMsg = res.data.message || "No se pudo registrar la devolución";
                toast.push(<Notification title="Error" type="danger">{errorMsg}</Notification>)
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Error de red o servidor al registrar la devolución.';
            toast.push(<Notification title="Error" type="danger">{errorMsg}</Notification>)
        } finally {
            actions.setSubmitting(false)
        }
    }

    const handleEdit = (data) => {
        setSelectedReturn(data)
        setEditDrawerOpen(true)
    }

    const handleCloseEditDrawer = () => {
        setEditDrawerOpen(false)
        setSelectedReturn(null)
    }

    const handleUpdateReturn = async (values, actions) => {
        try {
            const dataToUpdate = { ...values, id: selectedReturn.id };
            const res = await apiStoreSupplyReturn(dataToUpdate)

            if (res.data.success) {
                toast.push(<Notification title="Correcto" type="success">Devolución actualizada correctamente</Notification>)
                setEditDrawerOpen(false)
                fetchSupplyReturns()
            } else {
                const errorMsg = res.data.message || "No se pudo actualizar la devolución";
                toast.push(<Notification title="Error" type="danger">{errorMsg}</Notification>)
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Error de red o servidor al actualizar la devolución.';
            toast.push(<Notification title="Error" type="danger">{errorMsg}</Notification>)
        } finally {
            actions.setSubmitting(false)
        }
    }


    return (
        <Card borderless className="shadow-none border-0">
            <div className="flex justify-between items-center border-b px-4 py-3">
                <h4 className="text-lg font-semibold">Listado de Devoluciones de Suministros</h4>
                <button
                    className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                    onClick={handleAddReturn}
                >
                    <HiPlusCircle className="text-lg" />
                    Registrar Devolución
                </button>
            </div>

            <div className="p-4">
                <SupplyReturnTable
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
                    <h5 className="font-semibold text-xl">Registrar Devolución</h5>
                    <button
                        type="button"
                        className="px-2 py-1 text-sm text-gray-500 hover:text-gray-700 rounded"
                        onClick={handleCloseDrawer}
                    >
                        X
                    </button>
                </div>

                <SupplyReturnForm
                    userOffices={userOffices}
                    userId={userId}
                    immediateSupervisors={immediateSupervisors}
                    receivingTechnicians={receivingTechnicians} // Nuevo prop
                    fetchSupervisorsByOffice={fetchSupervisorsByOffice}
                    onSubmit={handleCreateReturn}
                    onClose={handleCloseDrawer}
                />
            </DrawerOld>

            <SupplyReturnDrawers
                editDrawerOpen={editDrawerOpen}
                handleCloseEditDrawer={handleCloseEditDrawer}
                selectedReturn={selectedReturn}
                handleUpdateReturn={handleUpdateReturn}
                getTodayDateString={getTodayDateString}
            />
        </Card>
    )
}

export default SupplyReturns