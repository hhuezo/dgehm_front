import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Importamos useNavigate
import { useDispatch } from 'react-redux';
import {
    setCurrentRouteTitle,
    setCurrentRouteSubtitle,
    setCurrentRouteInfo,
    setCurrentRouteOptions,
} from 'store/base/commonSlice';

import {
    apiGetSupplyReturn,
    apiGetSupplyReturnDetail,
    apiStoreSupplyReturnItem,
    apiDeleteSupplyReturnItem,
    apiGetProducts,

    // ASUMIMOS QUE ESTAS FUNCIONES EXISTEN PARA DEVOLUCIONES
    apiSendSupplyReturn,
    apiApproveSupplyReturn,
    apiRejectSupplyReturn,
    apiFinalizeSupplyReturn,
    // Fin de funciones asumidas
} from 'services/WareHouseServise';

import { Card, Notification, toast, Button, Dialog, Spinner, Tag } from 'components/ui';
// Importamos todos los iconos necesarios
import {
    HiOutlineTrash,
    HiCheck,
    HiOutlineTruck,
    HiPaperAirplane,
    HiX,
    HiOutlineArrowSmLeft, // Necesario para el botón de Volver
} from 'react-icons/hi';

import SupplyReturnItemManagement from './components/SupplyReturnItemManagement';
import { DetailItem, formatIsoDateTime } from './components/SupplyReturnUtils'; // Agregamos formatIsoDateTime si lo necesita

// Si DetailItem y formatIsoDateTime no están en SupplyReturnUtils, asumo que las tienes definidas o las pego aquí.
// Usaré el 'formatIsoDateTime' de la solicitud anterior para la fecha.
const formatStatusTag = (statusId, statusName) => {
    let color = 'bg-gray-400';
    if (statusId === 1) color = 'bg-yellow-500'; // Borrador / Pendiente de Envío
    if (statusId === 2) color = 'bg-blue-500';   // Enviado / Pendiente de Aprobación
    if (statusId === 3) color = 'bg-green-500';  // Aprobado / Pendiente de Finalizar
    if (statusId === 4) color = 'bg-red-500';    // Finalizado
    if (statusId === 5) color = 'bg-red-700';    // Rechazado (Asumiendo 5 como Rechazado)

    return (
        <span className={`font-semibold text-white px-2 py-1 rounded text-xs ${color}`}>
            {statusName || 'N/A'}
        </span>
    );
}

const SupplyReturnItemDetails = () => {
    const { id: returnId } = useParams();
    const navigate = useNavigate(); // Inicializamos useNavigate
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(true);
    const [headerData, setHeaderData] = useState(null);
    const [detailItems, setDetailItems] = useState([]);
    const [products, setProducts] = useState([]);

    const [itemDrawerOpen, setItemDrawerOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    const [dialogDeleteOpen, setDialogDeleteOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    // ESTADOS PARA ACCIONES
    const [isSending, setIsSending] = useState(false);
    const [isApproving, setIsApproving] = useState(false);
    const [isRejecting, setIsRejecting] = useState(false);
    const [isFinalizing, setIsFinalizing] = useState(false);

    // DIÁLOGOS PARA ACCIONES
    const [dialogSendOpen, setDialogSendOpen] = useState(false);
    const [dialogApproveOpen, setDialogApproveOpen] = useState(false);
    const [dialogRejectOpen, setDialogRejectOpen] = useState(false);
    const [dialogFinalizeOpen, setDialogFinalizeOpen] = useState(false);


    const handleSetHeader = useCallback(() => {
        dispatch(setCurrentRouteTitle(`Devolución #${returnId}`));
        dispatch(setCurrentRouteSubtitle('Detalles y gestión de ítems devueltos'));
        dispatch(setCurrentRouteInfo(''));
        dispatch(setCurrentRouteOptions(''));
    }, [dispatch, returnId]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const resHeader = await apiGetSupplyReturn(returnId);
            if (resHeader.data.success) {
                setHeaderData(resHeader.data.data);
            }

            const resDetail = await apiGetSupplyReturnDetail(returnId);
            if (resDetail.data.success) {
                setDetailItems(resDetail.data.data || []);
            }

            const resProducts = await apiGetProducts();
            if (resProducts.data.success) {
                const mappedProducts = resProducts.data.data.map(p => ({
                    label: p.name,
                    value: p.id,
                }));
                setProducts(mappedProducts);
            }
        } catch (error) {
            toast.push(<Notification title="Error" type="danger">Error al cargar datos de la devolución.</Notification>);
        } finally {
            setLoading(false);
        }
    };

    const refreshData = () => {
        fetchData();
    };

    useEffect(() => {
        handleSetHeader();
        if (returnId) {
            fetchData();
        } else {
            setLoading(false);
        }
    }, [handleSetHeader, returnId]);


    // --- HANDLERS DE ACCIÓN ---

    // 1. ENVIAR
    const openSendDialog = () => { setDialogSendOpen(true); }
    const closeSendDialog = () => { setDialogSendOpen(false); }
    const handleSendReturn = async () => {
        setIsSending(true);
        try {
            const res = await apiSendSupplyReturn(returnId);
            if (res.data.success) {
                toast.push(<Notification title="Envío Exitoso" type="success">{res.data.message || 'La devolución ha sido enviada.'}</Notification>);
                closeSendDialog();
                refreshData();
            } else {
                toast.push(<Notification title="Error de Envío" type="danger">{res.data.message || 'No se pudo enviar la devolución.'}</Notification>);
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Error de red al intentar enviar la devolución.';
            toast.push(<Notification title="Error" type="danger">{message}</Notification>);
        } finally {
            setIsSending(false);
        }
    }

    // 2. APROBAR
    const openApproveDialog = () => { setDialogApproveOpen(true); }
    const closeApproveDialog = () => { setDialogApproveOpen(false); }
    const handleApproveReturn = async () => {
        setIsApproving(true);
        try {
            const res = await apiApproveSupplyReturn(returnId);
            if (res.data.success) {
                toast.push(<Notification title="Aprobación Exitosa" type="success">{res.data.message || 'La devolución ha sido aprobada.'}</Notification>);
                closeApproveDialog();
                refreshData();
            } else {
                toast.push(<Notification title="Error de Aprobación" type="danger">{res.data.message || 'No se pudo aprobar la devolución.'}</Notification>);
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Error de red al intentar aprobar la devolución.';
            toast.push(<Notification title="Error" type="danger">{message}</Notification>);
        } finally {
            setIsApproving(false);
        }
    }

    // 3. RECHAZAR (Visible solo en Estado 2: Pendiente de Aprobación)
    const openRejectDialog = () => { setDialogRejectOpen(true); }
    const closeRejectDialog = () => { setDialogRejectOpen(false); }
    const handleRejectReturn = async () => {
        setIsRejecting(true);
        try {
            const res = await apiRejectSupplyReturn(returnId);
            if (res.data.success) {
                toast.push(<Notification title="Devolución Rechazada" type="success">{res.data.message || 'La devolución ha sido rechazada.'}</Notification>);
                closeRejectDialog();
                refreshData();
            } else {
                toast.push(<Notification title="Error de Rechazo" type="danger">{res.data.message || 'No se pudo rechazar la devolución.'}</Notification>);
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Error de red al intentar rechazar la devolución.';
            toast.push(<Notification title="Error" type="danger">{message}</Notification>);
        } finally {
            setIsRejecting(false);
        }
    }

    // 4. FINALIZAR
    const openFinalizeDialog = () => { setDialogFinalizeOpen(true); }
    const closeFinalizeDialog = () => { setDialogFinalizeOpen(false); }
    const handleFinalizeReturn = async () => {
        setIsFinalizing(true);
        try {
            const res = await apiFinalizeSupplyReturn(returnId);
            if (res.data.success) {
                toast.push(<Notification title="Finalización Exitosa" type="success">{res.data.message || 'La devolución ha sido finalizada.'}</Notification>);
                closeFinalizeDialog();
                refreshData();
            } else {
                toast.push(<Notification title="Error de Finalización" type="danger">{res.data.message || 'No se pudo finalizar la devolución.'}</Notification>);
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Error de red al intentar finalizar la devolución.';
            toast.push(<Notification title="Error" type="danger">{message}</Notification>);
        } finally {
            setIsFinalizing(false);
        }
    }

    // --- HANDLERS DE ÍTEMS (Mantenidos) ---

    const handleAddItem = () => {
        setEditingItem(null);
        setItemDrawerOpen(true);
    };

    const handleEditItem = (item) => {
        setEditingItem(item);
        setItemDrawerOpen(true);
    };

    const handleCloseItemDrawer = () => {
        setItemDrawerOpen(false);
        setEditingItem(null);
    };

    const handleStoreItem = async (values, actions) => {
        const payload = { ...values, supply_return_id: returnId };
        try {
            const res = await apiStoreSupplyReturnItem(payload);

            if (res.data.success) {
                toast.push(<Notification title="Correcto" type="success">Ítem de devolución guardado correctamente.</Notification>);
                handleCloseItemDrawer();
                refreshData();
            } else {
                toast.push(<Notification title="Error" type="danger">{res.data.message || 'Error al guardar el ítem.'}</Notification>);
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Error de red o servidor al guardar el ítem.';
            toast.push(<Notification title="Error" type="danger">{errorMsg}</Notification>);
        } finally {
            actions.setSubmitting(false);
        }
    };

    const handleConfirmDelete = (item) => {
        setItemToDelete(item);
        setDialogDeleteOpen(true);
    };

    const closeDeleteDialog = () => {
        setDialogDeleteOpen(false);
        setItemToDelete(null);
    };

    const handleDeleteItem = async () => {
        setDialogDeleteOpen(false);
        if (!itemToDelete) return;

        try {
            const res = await apiDeleteSupplyReturnItem(itemToDelete.id);
            if (res.data.success) {
                toast.push(<Notification title="Eliminado" type="success">Ítem de devolución eliminado correctamente.</Notification>);
                refreshData();
            } else {
                toast.push(<Notification title="Error" type="danger">{res.data.message || 'Error al eliminar el ítem.'}</Notification>);
            }
        } catch (error) {
            toast.push(<Notification title="Error" type="danger">Error de red o servidor al eliminar el ítem.</Notification>);
        } finally {
            setItemToDelete(null);
        }
    };


    if (loading) {
        return (
            <Card className="flex justify-center items-center h-96">
                <Spinner size={40} />
            </Card>
        );
    }

    if (!headerData) {
        return <Card>Devolución no encontrada.</Card>;
    }

    // --- LÓGICA DE ESTATUS ---
    const statusId = headerData.status?.id;

    const isPendingDraft = statusId === 1;     // Estado 1: Borrador / Pendiente de Envío
    const isReadyForApproval = statusId === 2; // Estado 2: Enviado / Pendiente de Aprobación
    const isReadyForFinalize = statusId === 3; // Estado 3: Aprobado / Pendiente de Finalizar

    // Si statusId es 4 (Finalizado) o 5 (Rechazado), no se muestran botones de acción, excepto el botón Volver.

    return (
        <>
            <Card borderless className="shadow-none border-0 mb-4">
                {/* HEADER CON BOTONES DE ACCIÓN */}
                <div className="flex justify-between items-center border-b px-4 py-3">

                    <div className="flex items-center gap-2">
                        <Button
                            icon={<HiOutlineArrowSmLeft />}
                            variant="plain"
                            color="gray-500"
                            size="sm"
                            onClick={() => navigate(-1)}
                        >
                            Volver
                        </Button>
                        <h4 className="text-lg font-semibold ml-2">
                            Devolución de Suministros #{returnId}
                        </h4>
                    </div>

                    <div className="flex gap-2 items-center">
                        {/* Botón de ENVIAR (Visible si está en estado 1) */}
                        {isPendingDraft && (
                            <Button
                                variant="solid"
                                color="blue-600"
                                size="sm"
                                icon={<HiPaperAirplane className="rotate-90" />}
                                onClick={openSendDialog}
                                loading={isSending}
                            >
                                Enviar Devolución
                            </Button>
                        )}

                        {/* Botón de RECHAZAR (Visible SOLO si está en estado 2) */}
                        {isReadyForApproval && (
                            <Button
                                variant="solid"
                                color="red-600"
                                size="sm"
                                icon={<HiX />}
                                onClick={openRejectDialog}
                                loading={isRejecting}
                            >
                                Rechazar
                            </Button>
                        )}

                        {/* Botón de APROBAR (Visible si está en estado 2) */}
                        {isReadyForApproval && (
                            <Button
                                variant="solid"
                                color="green-600"
                                size="sm"
                                icon={<HiCheck />}
                                onClick={openApproveDialog}
                                loading={isApproving}
                            >
                                Aprobar
                            </Button>
                        )}

                        {/* Botón de FINALIZAR (Visible si está en estado 3) */}
                        {isReadyForFinalize && (
                            <Button
                                variant="solid"
                                color="blue-600"
                                size="sm"
                                icon={<HiOutlineTruck />}
                                onClick={openFinalizeDialog}
                                loading={isFinalizing}
                            >
                                Finalizar Devolución
                            </Button>
                        )}

                        {/* Botón de IMPRESIÓN (si es necesario) */}
                        {/* <button
                            title="Imprimir Devolución PDF"
                            className="p-1.5 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                            onClick={() => console.log("Imprimir")} // Reemplazar con apiGetPdfSupplyReturn(returnId)
                        >
                            <HiOutlinePrinter className="text-lg" />
                        </button> */}
                    </div>
                </div>


                <h6 className="mb-4 text-lg font-semibold border-b pb-2 px-4 pt-4">Información de Cabecera</h6>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-4 pb-4">
                    <DetailItem label="ID Devolución">#{headerData.id}</DetailItem>
                    <DetailItem label="Fecha Devolución">{new Date(headerData.return_date).toLocaleDateString()}</DetailItem>
                    <DetailItem label="Oficina">{headerData.office?.name || 'N/A'}</DetailItem>
                    <DetailItem label="Extensión Teléfono">{headerData.phone_extension || 'N/A'}</DetailItem>

                    <DetailItem label="Devuelto Por">
                        {headerData.returned_by ? `${headerData.returned_by.name} ${headerData.returned_by.lastname}` : 'N/A'}
                    </DetailItem>
                    <DetailItem label="Supervisor Inmediato">
                        {headerData.immediate_supervisor ? `${headerData.immediate_supervisor.name} ${headerData.immediate_supervisor.lastname}` : 'N/A'}
                    </DetailItem>
                    <DetailItem label="Recibido Por">
                        {headerData.received_by ? `${headerData.received_by.name} ${headerData.received_by.lastname}` : 'N/A'}
                    </DetailItem>

                    <DetailItem label="Estado">
                        {formatStatusTag(headerData.status?.id, headerData.status?.name)}
                    </DetailItem>

                    <div className="lg:col-span-4">
                        <DetailItem label="Observaciones">
                            <Tag className="bg-gray-100 text-gray-800 border-none max-w-full truncate whitespace-normal">
                                {headerData.general_observations || 'Sin observaciones'}
                            </Tag>
                        </DetailItem>
                    </div>
                </div>
            </Card>

            <SupplyReturnItemManagement
                supplyReturnId={returnId}
                detailItems={detailItems}
                products={products}

                drawerOpen={itemDrawerOpen}
                editingItem={editingItem}
                onDrawerClose={handleCloseItemDrawer}
                onFormSubmit={handleStoreItem}

                onAddItem={handleAddItem}
                onEditItem={handleEditItem}
                onDeleteConfirm={handleConfirmDelete}
            />

            {/* DIÁLOGO DE CONFIRMACIÓN DE ELIMINACIÓN (Mantenido) */}
            <Dialog
                isOpen={dialogDeleteOpen}
                onClose={closeDeleteDialog}
                onRequestClose={closeDeleteDialog}
            >
                <h5 className="mb-4 text-red-600 font-bold">Confirmar Eliminación</h5>
                <div className="text-gray-600">
                    ¿Está seguro de que desea <span className="font-semibold text-red-600">ELIMINAR</span> este ítem de la devolución? La acción no se puede deshacer.
                </div>
                <div className="mt-6 text-right">
                    <Button
                        className="mr-2"
                        onClick={closeDeleteDialog}
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="solid"
                        color="red-600"
                        onClick={handleDeleteItem}
                        icon={<HiOutlineTrash />}
                    >
                        Sí, Eliminar
                    </Button>
                </div>
            </Dialog>

            {/* DIÁLOGO DE CONFIRMACIÓN DE ENVÍO */}
            <Dialog isOpen={dialogSendOpen} onClose={closeSendDialog} onRequestClose={closeSendDialog}>
                <h5 className="mb-4 text-blue-600 font-bold">Confirmar Envío</h5>
                <div className="text-gray-600">¿Está seguro de que desea <span className="font-semibold text-blue-600">ENVIAR</span> la devolución #{returnId}?</div>
                <div className="mt-6 text-right">
                    <Button className="mr-2" onClick={closeSendDialog} disabled={isSending}>Cancelar</Button>
                    <Button variant="solid" color="blue-600" onClick={handleSendReturn} loading={isSending} icon={!isSending && <HiPaperAirplane className="rotate-90" />}>
                        {isSending ? 'Enviando...' : 'Sí, Enviar'}
                    </Button>
                </div>
            </Dialog>

            {/* DIÁLOGO DE CONFIRMACIÓN DE APROBACIÓN */}
            <Dialog isOpen={dialogApproveOpen} onClose={closeApproveDialog} onRequestClose={closeApproveDialog}>
                <h5 className="mb-4 text-green-600 font-bold">Confirmar Aprobación</h5>
                <div className="text-gray-600">¿Está seguro de que desea <span className="font-semibold text-green-600">APROBAR</span> la devolución #{returnId}?</div>
                <div className="mt-6 text-right">
                    <Button className="mr-2" onClick={closeApproveDialog} disabled={isApproving}>Cancelar</Button>
                    <Button variant="solid" color="green-600" onClick={handleApproveReturn} loading={isApproving} icon={!isApproving && <HiCheck />}>
                        {isApproving ? 'Aprobando...' : 'Sí, Aprobar'}
                    </Button>
                </div>
            </Dialog>

            {/* DIÁLOGO DE CONFIRMACIÓN DE RECHAZO */}
            <Dialog isOpen={dialogRejectOpen} onClose={closeRejectDialog} onRequestClose={closeRejectDialog}>
                <h5 className="mb-4 text-red-600 font-bold">Confirmar Rechazo</h5>
                <div className="text-gray-600">¿Está seguro de que desea <span className="font-semibold text-red-600">RECHAZAR</span> la devolución #{returnId}?</div>
                <div className="mt-6 text-right">
                    <Button className="mr-2" onClick={closeRejectDialog} disabled={isRejecting}>Cancelar</Button>
                    <Button variant="solid" color="red-600" onClick={handleRejectReturn} loading={isRejecting} icon={!isRejecting && <HiX />}>
                        {isRejecting ? 'Rechazando...' : 'Sí, Rechazar'}
                    </Button>
                </div>
            </Dialog>

            {/* DIÁLOGO DE CONFIRMACIÓN DE FINALIZACIÓN */}
            <Dialog isOpen={dialogFinalizeOpen} onClose={closeFinalizeDialog} onRequestClose={closeFinalizeDialog}>
                <h5 className="mb-4 text-blue-600 font-bold">Confirmar Finalización</h5>
                <div className="text-gray-600">¿Está seguro de que desea <span className="font-semibold text-blue-600">FINALIZAR</span> la devolución #{returnId}? Esta acción afecta al inventario.</div>
                <div className="mt-6 text-right">
                    <Button className="mr-2" onClick={closeFinalizeDialog} disabled={isFinalizing}>Cancelar</Button>
                    <Button variant="solid" color="blue-600" onClick={handleFinalizeReturn} loading={isFinalizing} icon={!isFinalizing && <HiOutlineTruck />}>
                        {isFinalizing ? 'Finalizando...' : 'Sí, Finalizar'}
                    </Button>
                </div>
            </Dialog>
        </>
    );
};

export default SupplyReturnItemDetails;