// src/views/warehouse/PurchaseOrderItemDetails.jsx

import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Notification, toast, Spinner } from 'components/ui';
import { HiOutlinePrinter } from 'react-icons/hi';

// Importación del nuevo componente de gestión de ítems
import PurchaseOrderItemManagement from './components/PurchaseOrderItemManagement';
// Asegúrese de que estas importaciones sean correctas para su proyecto:
import { apiGetPurchaseOrder, apiGetActaPurchaseOrder } from 'services/WareHouseServise';

// ... (formatIsoDateTime y formatCurrency se mantienen iguales) ...

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
    const { id } = useParams(); // ID de la Orden

    const [orderData, setOrderData] = useState(null);
    const [loading, setLoading] = useState(true);

    // --- Lógica de Fetch de Datos (se mantiene igual) ---
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

    // --- Lógica de Impresión del Acta (se mantiene igual) ---
    const handlePrintActa = async () => { /* ... */ };


    // --- Renderizado de Carga y Error (se mantiene igual) ---
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
            {/* ... (código de header y botones) ... */}
            <div className="flex justify-between items-center border-b px-4 py-3">
                <h4 className="text-lg font-semibold">
                    Orden #{orderData.order_number}
                </h4>

                <button
                    title="Imprimir Acta PDF"
                    className="p-1.5 rounded-full bg-orange-100 text-orange-600 hover:bg-orange-200 transition-colors"
                    onClick={handlePrintActa}
                >
                    <HiOutlinePrinter className="text-lg" />
                </button>
            </div>


            {/* DETALLES DE LA ORDEN/ACTA (Cabecera) - 4 COLUMNAS */}
            {/* ... (código de los 4 bloques de detalles) ... */}
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 border-b">
                <div><p className="font-semibold text-gray-700">Proveedor:</p><p className="text-gray-900">{orderData.supplier?.name || 'N/A'}</p></div>
                <div><p className="font-semibold text-gray-700">No. Orden:</p><p className="text-gray-900">{orderData.order_number}</p></div>
                <div><p className="font-semibold text-gray-700">No. Factura:</p><p className="text-gray-900">{orderData.invoice_number}</p></div>
                <div><p className="font-semibold text-gray-700">Monto Total:</p><p className="text-gray-900">{formatCurrency(orderData.total_amount)}</p></div>
                <div><p className="font-semibold text-gray-700">Fecha Acta:</p><p className="text-gray-900">{formatIsoDateTime(orderData.acta_date)}</p></div>
                <div><p className="font-semibold text-gray-700">Fecha Recepción:</p><p className="text-gray-900">{formatIsoDateTime(orderData.reception_date)}</p></div>
                <div><p className="font-semibold text-gray-700">Gerente Adm. (Recibe):</p><p className="text-gray-900">{orderData.administrative_manager}</p></div>
                <div><p className="font-semibold text-gray-700">Técnico Adm.:</p><p className="text-gray-900">{orderData.administrative_technician}</p></div>
                <div className="lg:col-span-2"><p className="font-semibold text-gray-700">Compromiso Presup.:</p><p className="text-gray-900">{orderData.budget_commitment_number}</p></div>
                <div className="lg:col-span-2"><p className="font-semibold text-gray-700">Representante Proveedor (Entrega):</p><p className="text-gray-900">{orderData.supplier_representative}</p></div>
            </div>


            {/* CUERPO - TABLA INTERACTIVA DE PRODUCTOS */}
            <div className="p-4">
                {/* 🛑 Reemplaza el placeholder con el nuevo componente */}
                <PurchaseOrderItemManagement purchaseOrderId={id} />
            </div>

        </Card>
    );
};

export default PurchaseOrderItemDetails;