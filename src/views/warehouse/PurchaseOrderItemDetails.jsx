// src/views/warehouse/PurchaseOrderItemDetails.jsx

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Notification, toast, Spinner } from 'components/ui';
import { HiOutlinePrinter, HiOutlineArrowSmLeft } from 'react-icons/hi';

import PurchaseOrderItemManagement from './components/PurchaseOrderItemManagement';
import { apiGetPurchaseOrder, apiGetActaPurchaseOrder } from 'services/WareHouseServise';

// ===============================================
// UTILIDADES
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

const formatCurrency = (amount) => {
    const numericAmount = Number(amount || 0);
    return new Intl.NumberFormat('es-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
    }).format(numericAmount);
};


// ====================================================================
// COMPONENTE PRINCIPAL: PurchaseOrderItemDetails
// ====================================================================

const PurchaseOrderItemDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [orderData, setOrderData] = useState(null);
    const [loading, setLoading] = useState(true);

    // --- Lógica de Fetch de Datos ---
    const fetchOrderDetails = useCallback(async () => {
        setLoading(true);
        try {
            const res = await apiGetPurchaseOrder(id);
            if (res.data.success) {
                setOrderData(res.data.data);
            } else {
                toast.push(<Notification title="Error" type="danger">Error al cargar la Orden: {res.data.message}</Notification>);
            }
        } catch (error) {
            toast.push(<Notification title="Error" type="danger">Error de red al obtener detalles de la Orden.</Notification>);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        if (id) {
            fetchOrderDetails();
        }
    }, [id, fetchOrderDetails]);

    // --- Lógica de Generación de Acta PDF ---
    const onGenerateActa = useCallback(async (orderId) => {
        toast.push(<Notification title="Procesando" type="info">Generando Acta PDF...</Notification>, { duration: 2000 });
        try {
            const res = await apiGetActaPurchaseOrder(orderId);

            const blob = new Blob([res.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Acta_Orden_${orderData.order_number || orderId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();

            window.URL.revokeObjectURL(url);
            toast.push(<Notification title="Descarga Completa" type="success">El acta ha sido descargada.</Notification>);

        } catch (error) {
            console.error("Error al generar el acta:", error);
            toast.push(<Notification title="Error de Impresión" type="danger">No se pudo generar el acta o PDF. Verifique la conexión.</Notification>);
        }
    }, [orderData]);

    // --- Renderizado de Carga y Error ---
    if (loading) {
        return (
            <Card className="flex justify-center items-center h-96">
                <Spinner size={40} />
            </Card>
        );
    }

    if (!orderData) {
        return (
            <Card>
                <div className="p-4 text-center">
                    <h2 className="text-xl font-semibold">Orden de Compra No Encontrada</h2>
                    <p className="mt-2 text-gray-500">El registro con ID {id} no existe o fue eliminado.</p>
                </div>
            </Card>
        );
    }

    // --- Renderizado Final ---

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
                        Orden #{orderData.order_number}
                    </h4>
                </div>

                <button
                    title="Imprimir Acta PDF"
                    className="p-1.5 rounded-full bg-orange-100 text-orange-600 hover:bg-orange-200 transition-colors"
                    onClick={() => onGenerateActa(orderData.id)}
                >
                    <HiOutlinePrinter className="text-lg" />
                </button>
            </div>


            {/* DETALLES DE LA ORDEN/ACTA (Cabecera) - 4 COLUMNAS */}
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 border-b">
                <div><p className="font-semibold text-gray-700">Proveedor:</p><p className="text-gray-900">{orderData.supplier?.name || 'N/A'}</p></div>
                <div><p className="font-semibold text-gray-700">No. Orden:</p><p className="text-gray-900">{orderData.order_number}</p></div>
                <div><p className="font-semibold text-gray-700">No. Factura:</p><p className="text-gray-900">{orderData.invoice_number}</p></div>
                <div><p className="font-semibold text-gray-700">Monto Total:</p><p className="text-gray-900">{formatCurrency(orderData.total_amount)}</p></div>
                <div><p className="font-semibold text-gray-700">Fecha Acta:</p><p className="text-gray-900">{formatIsoDateTime(orderData.acta_date)}</p></div>
                <div><p className="font-semibold text-gray-700">Fecha Recepción:</p><p className="text-gray-900">{formatIsoDateTime(orderData.reception_date)}</p></div>
                <div><p className="font-semibold text-gray-700">Gerente Adm. (Recibe):</p><p className="text-gray-900">{orderData.administrative_manager}</p></div>
                <div><p className="font-semibold text-gray-700">Técnico Adm. </p><p className="text-gray-900">{orderData.administrative_technician?.name} {orderData.administrative_technician?.lastname}</p></div>
                <div className="lg:col-span-2"><p className="font-semibold text-gray-700">Compromiso Presup.:</p><p className="text-gray-900">{orderData.budget_commitment_number}</p></div>
                <div className="lg:col-span-2"><p className="font-semibold text-gray-700">Representante Proveedor (Entrega):</p><p className="text-gray-900">{orderData.supplier_representative}</p></div>
            </div>


            {/* CUERPO - TABLA INTERACTIVA DE PRODUCTOS */}
            <div className="p-4">
                <PurchaseOrderItemManagement purchaseOrderId={id} />
            </div>

        </Card>
    );
};

export default PurchaseOrderItemDetails;