import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Notification, toast, Spinner, Dialog } from 'components/ui';
// Importamos HiX para el botón de rechazo
import { HiOutlinePrinter, HiOutlineArrowSmLeft, HiCheck, HiOutlineTruck, HiPaperAirplane, HiX } from 'react-icons/hi';

import SupplyRequestItemManagement from './components/SupplyRequestItemManagement';

import {
    apiGetSupplyRequest,
    apiGetPdfSupplyRequest,
    apiApproveSupplyRequest,
    apiSendSupplyRequest,
    apiFinalizeSupplyRequest,
    // Importamos la función de rechazo (asumiendo que existe)
    apiRejectSupplyRequest,
} from 'services/WareHouseServise';


// ===============================================
// UTILIDADES (Sin cambios)
// ===============================================

const formatIsoDateTime = (isoDateStr) => {
    if (!isoDateStr) return 'N/A';
    const dateObj = new Date(isoDateStr);
    if (isNaN(dateObj.getTime())) return isoDateStr;
    const dateOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: false };
    const formattedDate = dateObj.toLocaleDateString('es-ES', dateOptions);
    const formattedTime = dateObj.toLocaleTimeString('es-ES', timeOptions);
    return `${formattedDate} ${formattedTime}`;
};


// ====================================================================
// COMPONENTE PRINCIPAL: SupplyRequestItemDetails
// ====================================================================

const SupplyRequestItemDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [request, setRequest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isApproving, setIsApproving] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [isFinalizing, setIsFinalizing] = useState(false);
    const [isRejecting, setIsRejecting] = useState(false); // NUEVO ESTADO

    const [dialogApproveOpen, setDialogApproveOpen] = useState(false);
    const [dialogSendOpen, setDialogSendOpen] = useState(false);
    const [dialogFinalizeOpen, setDialogFinalizeOpen] = useState(false);
    const [dialogRejectOpen, setDialogRejectOpen] = useState(false); // NUEVO DIÁLOGO

    // --- Lógica de Fetch de Datos (Sin cambios) ---
    const fetchRequestDetails = useCallback(async () => {
        setLoading(true);
        try {
            const res = await apiGetSupplyRequest(id);
            if (res.data.success) {
                setRequest(res.data.data);
            } else {
                toast.push(<Notification title="Error" type="danger">Solicitud no encontrada: {res.data.message}</Notification>);
            }
        } catch (error) {
            toast.push(<Notification title="Error" type="danger">Error de red al obtener detalles de la Solicitud.</Notification>);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        if (id) {
            fetchRequestDetails();
        }
    }, [id, fetchRequestDetails]);

    // --- HANDLERS DE ENVÍO (Sin cambios) ---

    const openSendDialog = () => { setDialogSendOpen(true); }
    const closeSendDialog = () => { setDialogSendOpen(false); }

    const handleSendRequest = async () => {
        setIsSending(true);
        try {
            const res = await apiSendSupplyRequest(id);

            if (res.data.success) {
                toast.push(<Notification title="Envío Exitoso" type="success">{res.data.message || 'La solicitud ha sido enviada.'}</Notification>);
                closeSendDialog();
                fetchRequestDetails();
            } else {
                toast.push(<Notification title="Error de Envío" type="danger">{res.data.message || 'No se pudo enviar la solicitud.'}</Notification>);
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Error de red al intentar enviar la solicitud.';
            toast.push(<Notification title="Error" type="danger">{message}</Notification>);
        } finally {
            setIsSending(false);
        }
    }

    // --- HANDLERS DE APROBACIÓN (Sin cambios) ---

    const openApproveDialog = () => { setDialogApproveOpen(true); }
    const closeApproveDialog = () => { setDialogApproveOpen(false); }

    const handleApproveRequest = async () => {
        setIsApproving(true);
        try {
            const res = await apiApproveSupplyRequest(id);

            if (res.data.success) {
                toast.push(<Notification title="Aprobación Exitosa" type="success">{res.data.message || 'La solicitud ha sido aprobada.'}</Notification>);
                closeApproveDialog();
                fetchRequestDetails();
            } else {
                toast.push(<Notification title="Error de Aprobación" type="danger">{res.data.message || 'No se pudo aprobar la solicitud.'}</Notification>);
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Error de red al intentar aprobar la solicitud.';
            toast.push(<Notification title="Error" type="danger">{message}</Notification>);
        } finally {
            setIsApproving(false);
        }
    }

    // --- HANDLERS DE FINALIZACIÓN (Sin cambios) ---

    const openFinalizeDialog = () => { setDialogFinalizeOpen(true); }
    const closeFinalizeDialog = () => { setDialogFinalizeOpen(false); }

    const handleFinalizeRequest = async () => {
        setIsFinalizing(true);
        try {
            const res = await apiFinalizeSupplyRequest(id);

            if (res.data.success) {
                toast.push(<Notification title="Entrega Finalizada" type="success">{res.data.message || 'La entrega ha sido finalizada correctamente.'}</Notification>);
                closeFinalizeDialog();
                fetchRequestDetails();
            } else {
                toast.push(<Notification title="Error de Finalización" type="danger">{res.data.message || 'No se pudo finalizar la entrega.'}</Notification>);
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Error de red al intentar finalizar la solicitud.';
            toast.push(<Notification title="Error" type="danger">{message}</Notification>);
        } finally {
            setIsFinalizing(false);
        }
    }

    // --- HANDLERS DE RECHAZO (NUEVOS) ---

    const openRejectDialog = () => { setDialogRejectOpen(true); }
    const closeRejectDialog = () => { setDialogRejectOpen(false); }

    const handleRejectRequest = async () => {
        setIsRejecting(true);
        try {
            const res = await apiRejectSupplyRequest(id);

            if (res.data.success) {
                toast.push(<Notification title="Solicitud Rechazada" type="success">{res.data.message || 'La solicitud ha sido rechazada.'}</Notification>);
                closeRejectDialog();
                fetchRequestDetails();
            } else {
                toast.push(<Notification title="Error de Rechazo" type="danger">{res.data.message || 'No se pudo rechazar la solicitud.'}</Notification>);
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Error de red al intentar rechazar la solicitud.';
            toast.push(<Notification title="Error" type="danger">{message}</Notification>);
        } finally {
            setIsRejecting(false);
        }
    }

    // --- Renderizado de Carga y Error (Sin cambios) ---
    if (loading) {
        return (
            <Card className="flex justify-center items-center h-96">
                <Spinner size={40} />
            </Card>
        );
    }

    if (!request) {
        return (
            <Card>
                <div className="p-4 text-center">
                    <h2 className="text-xl font-semibold">Solicitud de Insumos No Encontrada</h2>
                    <p className="mt-2 text-gray-500">El registro con ID {id} no existe o no se pudo cargar.</p>
                </div>
            </Card>
        );
    }

    // --- LÓGICA CORREGIDA PARA EL ESTATUS ---
    const requestNumber = request.id;
    const statusId = request.status.id;

    // Mapeo de Estatus según el requerimiento del usuario (1 -> Enviar, 2 -> Aprobar, 3 -> Finalizar):
    const isPendingDraft = statusId === 1;     // Estado 1: Pendiente de Envío/Borrador
    const isReadyForApproval = statusId === 2; // Estado 2: Enviado / Pendiente de Aprobación
    const isReadyForDelivery = statusId === 3; // Estado 3: Aprobado / Pendiente de Entrega

    // EL BOTÓN DE RECHAZAR DEBE SER VISIBLE SÓLO SI ESTÁ EN ESTADO 2 (Pendiente de Aprobación)
    const isRejectable = isReadyForApproval; // Solo si statusId === 2


    return (
        <Card borderless className="shadow-none border-0">
            {/* HEADER */}
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
                        Solicitud de Insumos #{requestNumber}
                    </h4>
                </div>

                {/* BOTONES DE ACCIÓN CORREGIDOS */}
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
                            Enviar Solicitud
                        </Button>
                    )}

                    {/* Botón de RECHAZAR (Visible SOLO si está en estado 2 - CORREGIDO) */}
                    {isRejectable && (
                        <Button
                            variant="solid"
                            color="red-600"
                            size="sm"
                            icon={<HiX />}
                            onClick={openRejectDialog}
                            loading={isRejecting}
                        >
                            Rechazar Solicitud
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
                            Aprobar Solicitud
                        </Button>
                    )}


                    {/* Botón de FINALIZAR ENTREGA (Visible si está en estado 3) */}
                    {isReadyForDelivery && (
                        <Button
                            variant="solid"
                            color="blue-600"
                            size="sm"
                            icon={<HiOutlineTruck />}
                            onClick={openFinalizeDialog}
                            loading={isFinalizing}
                        >
                            Finalizar Entrega
                        </Button>
                    )}


                    {/* Botón de IMPRESIÓN */}
                    <button
                        title="Imprimir Solicitud PDF"
                        className="p-1.5 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                        onClick={() => apiGetPdfSupplyRequest(request.id)}
                        disabled={isApproving || isFinalizing}
                    >
                        <HiOutlinePrinter className="text-lg" />
                    </button>
                </div>
            </div>


            {/* DETALLES DE LA SOLICITUD (Cabecera) - Sin cambios */}
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 border-b">
                <div><p className="font-semibold text-gray-700">Solicitante:</p><p className="text-gray-900">{request.requester ? `${request.requester.name} ${request.requester.lastname}` : 'N/A'}</p></div>
                <div><p className="font-semibold text-gray-700">Oficina Solicitante:</p><p className="text-gray-900">{request.office?.name || 'N/A'}</p></div>
                <div><p className="font-semibold text-gray-700">Fecha Solicitud:</p><p className="text-gray-900">{formatIsoDateTime(request.date)}</p></div>

                <div className="lg:col-span-2"><p className="font-semibold text-gray-700">Jefe Inmediato:</p><p className="text-gray-900">{request.immediate_boss ? `${request.immediate_boss.name} ${request.immediate_boss.lastname}` : request.immediate_boss_id}</p></div>
                <div>
                    <p className="font-semibold text-gray-700">Estado:</p>
                    <p>
                        <span className={`font-semibold text-white px-2 py-1 rounded text-xs ${request.status.id === 1 ? 'bg-yellow-500' :
                            request.status.id === 2 ? 'bg-blue-500' :
                                request.status.id === 3 ? 'bg-green-500' :
                                    request.status.id === 4 ? 'bg-red-500' :
                                        request.status.id === 5 ? 'bg-red-700' : // Rechazado
                                            'bg-gray-400'
                            }`}>
                            {request.status ? request.status.name : 'N/A'}
                        </span>
                    </p>
                </div>

                <div className="col-span-full"><p className="font-semibold text-gray-700">Observación:</p><p className="whitespace-pre-wrap text-gray-900 bg-gray-50 p-3 rounded text-sm mt-1">{request.observation}</p></div>
            </div>


            {/* CUERPO - TABLA INTERACTIVA DE PRODUCTOS */}
            <div className="p-4">
                <SupplyRequestItemManagement requestId={id} requestStatusId={statusId} />
            </div>

            {/* DIÁLOGO DE CONFIRMACIÓN DE ENVÍO (Sin cambios) */}
            <Dialog
                isOpen={dialogSendOpen}
                onClose={closeSendDialog}
                onRequestClose={closeSendDialog}
            >
                <h5 className="mb-4 text-blue-600 font-bold">Confirmar Envío</h5>
                <div className="text-gray-600">
                    ¿Está seguro de que desea <span className="font-semibold text-blue-600">ENVIAR</span> la solicitud #{requestNumber}?
                </div>
                <div className="mt-6 text-right">
                    <Button
                        className="mr-2"
                        onClick={closeSendDialog}
                        disabled={isSending}
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="solid"
                        color="blue-600"
                        onClick={handleSendRequest}
                        loading={isSending}
                        icon={!isSending && <HiPaperAirplane className="rotate-90" />}
                    >
                        {isSending ? 'Enviando...' : 'Sí, Enviar'}
                    </Button>
                </div>
            </Dialog>

            {/* DIÁLOGO DE CONFIRMACIÓN DE APROBACIÓN (Sin cambios) */}
            <Dialog
                isOpen={dialogApproveOpen}
                onClose={closeApproveDialog}
                onRequestClose={closeApproveDialog}
            >
                <h5 className="mb-4 text-green-600 font-bold">Confirmar Aprobación</h5>
                <div className="text-gray-600">
                    ¿Está seguro de que desea <span className="font-semibold text-green-600">APROBAR</span> la solicitud de insumos #{requestNumber}?
                    Esta acción cambiará el estado a **APROBADO**.
                </div>
                <div className="mt-6 text-right">
                    <Button
                        className="mr-2"
                        onClick={closeApproveDialog}
                        disabled={isApproving}
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="solid"
                        color="green-600"
                        onClick={handleApproveRequest}
                        loading={isApproving}
                        icon={!isApproving && <HiCheck />}
                    >
                        {isApproving ? 'Aprobando...' : 'Sí, Aprobar'}
                    </Button>
                </div>
            </Dialog>

            {/* DIÁLOGO DE CONFIRMACIÓN DE FINALIZACIÓN DE ENTREGA (Sin cambios) */}
            <Dialog
                isOpen={dialogFinalizeOpen}
                onClose={closeFinalizeDialog}
                onRequestClose={closeFinalizeDialog}
            >
                <h5 className="mb-4 text-blue-600 font-bold">Confirmar Entrega y Finalización</h5>
                <div className="text-gray-600">
                    ¿Está seguro de que desea <span className="font-semibold text-blue-600">FINALIZAR LA ENTREGA</span> de la solicitud #{requestNumber}?
                    Esta acción marcará el estado como **FINALIZADO** y no podrá modificarse.
                </div>
                <div className="mt-6 text-right">
                    <Button
                        className="mr-2"
                        onClick={closeFinalizeDialog}
                        disabled={isFinalizing}
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="solid"
                        color="blue-600"
                        onClick={handleFinalizeRequest}
                        loading={isFinalizing}
                        icon={!isFinalizing && <HiOutlineTruck />}
                    >
                        {isFinalizing ? 'Finalizando...' : 'Sí, Finalizar Entrega'}
                    </Button>
                </div>
            </Dialog>

            {/* NUEVO DIÁLOGO DE CONFIRMACIÓN DE RECHAZO */}
            <Dialog
                isOpen={dialogRejectOpen}
                onClose={closeRejectDialog}
                onRequestClose={closeRejectDialog}
            >
                <h5 className="mb-4 text-red-600 font-bold">Confirmar Rechazo</h5>
                <div className="text-gray-600">
                    ¿Está seguro de que desea <span className="font-semibold text-red-600">RECHAZAR</span> la solicitud #{requestNumber}?
                    Esta acción marcará el estado como **RECHAZADO**.
                </div>
                <div className="mt-6 text-right">
                    <Button
                        className="mr-2"
                        onClick={closeRejectDialog}
                        disabled={isRejecting}
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="solid"
                        color="red-600"
                        onClick={handleRejectRequest}
                        loading={isRejecting}
                        icon={!isRejecting && <HiX />}
                    >
                        {isRejecting ? 'Rechazando...' : 'Sí, Rechazar'}
                    </Button>
                </div>
            </Dialog>
        </Card>
    );
};

export default SupplyRequestItemDetails;