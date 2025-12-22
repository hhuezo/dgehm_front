// PurchaseOrder.jsx (Contiene la lógica de estado y API)

import React, { useEffect, useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'
import * as Yup from 'yup'
import { useNavigate } from 'react-router-dom'; // IMPORTAR NAVEGACIÓN

import {
    setCurrentRouteTitle,
    setCurrentRouteSubtitle,
    setCurrentRouteInfo,
    setCurrentRouteOptions,
} from 'store/base/commonSlice'

import {
    apiGetPurchaseOrders,
    apiStorePurchaseOrder,
    // apiGetPurchaseOrder, // YA NO NECESARIO: El fetch se hace en la nueva vista
    apiDeletePurchaseOrder,
    apiGetSuppliers,
    apiGetActaPurchaseOrder
} from 'services/WareHouseServise'

import { Card, Notification, toast } from 'components/ui'
import { HiPlusCircle } from 'react-icons/hi'

// Importar componentes y utilidades
import PurchaseOrderTable from './components/PurchaseOrderTable'
import PurchaseOrderDrawers from './components/PurchaseOrderDrawers'
import { getInitialValues } from './components/PurchaseOrderUtils'


// ===============================================
// VALIDACIÓN (Lógica del Módulo)
// ===============================================
const validationSchema = Yup.object().shape({
    supplier_id: Yup.number()
        .required('El proveedor es obligatorio')
        .min(1, 'Debe seleccionar un proveedor válido'),

    order_number: Yup.string()
        .required('El número de orden es obligatorio')
        .max(50),

    invoice_number: Yup.string()
        .required('El número de factura es obligatorio')
        .max(50),

    budget_commitment_number: Yup.string()
        .required('El número de compromiso presupuestario es obligatorio.')
        .max(50),

    acta_date: Yup.string()
        .required('La fecha del acta es obligatoria'),

    acta_time: Yup.string()
        .required('La hora del acta es obligatoria'),

    reception_date: Yup.string()
        .required('La fecha de recepción es obligatoria'),

    reception_time_only: Yup.string()
        .required('La hora de recepción es obligatoria'),

    invoice_date: Yup.string()
        .required('La fecha de la factura es obligatoria'),

    supplier_representative: Yup.string()
        .required('El representante es obligatorio')
        .max(150),

    total_amount: Yup.number()
        .typeError('El monto total debe ser un número.')
        .required('El monto total es obligatorio')
        .min(0.01, 'El monto total debe ser mayor a cero (0.00).'),

    administrative_manager: Yup.string()
        .required('El gerente es obligatorio')
        .max(150),

    administrative_technician: Yup.string()
        .required('El técnico es obligatorio')
        .max(150),
})

// ===============================================
// COMPONENTE PRINCIPAL: PurchaseOrder
// ===============================================
const PurchaseOrder = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate() // OBTENER INSTANCIA DE NAVEGACIÓN

    // --- Estados ---
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [suppliers, setSuppliers] = useState([])

    // Drawers (Solo mantenemos los de Creación y Edición)
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [editDrawerOpen, setEditDrawerOpen] = useState(false)
    const [selectedOrder, setSelectedOrder] = useState(null)
    // ELIMINADOS: viewDrawerOpen y orderToView

    // --- Lógica de Ruta y Fetch ---
    const handleChange = useCallback(() => {
        dispatch(setCurrentRouteTitle('Órdenes de Compra'))
        dispatch(setCurrentRouteSubtitle('Gestión de pedidos a proveedores'))
        dispatch(setCurrentRouteInfo(''))
        dispatch(setCurrentRouteOptions(''))
    }, [dispatch])

    useEffect(() => {
        handleChange()
        fetchOrders()
        fetchSuppliers()
    }, [handleChange])

    const fetchOrders = async () => {
        setLoading(true)
        try {
            const res = await apiGetPurchaseOrders()
            if (res.data.success) {
                setData(res.data.data)
            }
        } catch (error) {
            toast.push(<Notification title="Error" type="danger">Error al cargar órdenes de compra</Notification>)
        } finally {
            setLoading(false)
        }
    }

    const fetchSuppliers = async () => {
        try {
            const res = await apiGetSuppliers();
            if (res.data.success) {
                setSuppliers(res.data.data);
            }
        } catch (error) {
            toast.push(<Notification title="Error" type="danger">Error al cargar listado maestro de proveedores</Notification>);
        }
    }

    // --- Handlers de Creación ---
    const handleAddOrder = () => {
        setSelectedOrder(getInitialValues(null))
        setDrawerOpen(true)
    }

    const handleCloseDrawer = () => {
        setDrawerOpen(false)
        setSelectedOrder(null)
    }

    const handleCreateOrder = async (values, actions) => {
        try {
            const res = await apiStorePurchaseOrder(values)

            if (res.data.success) {
                toast.push(<Notification title="Correcto" type="success">Orden de Compra creada correctamente</Notification>)
                handleCloseDrawer()
                fetchOrders()
            }
        } catch (error) {
            const message = error.response?.data?.message || 'No se pudo crear la orden de compra';
            toast.push(<Notification title="Error" type="danger">{message}</Notification>)
        } finally {
            actions.setSubmitting(false)
        }
    }

    // --- Handlers de Edición ---
    const handleEdit = (rowData) => {
        setSelectedOrder(getInitialValues(rowData))
        setEditDrawerOpen(true)
    }

    const handleCloseEditDrawer = () => {
        setEditDrawerOpen(false)
        setSelectedOrder(null)
    }

    const handleUpdateOrder = async (values, actions) => {
        try {
            const res = await apiStorePurchaseOrder(values)

            if (res.data.success) {
                toast.push(<Notification title="Correcto" type="success">Orden de Compra actualizada correctamente</Notification>)
                handleCloseEditDrawer()
                fetchOrders()
            }
        } catch (error) {
            const message = error.response?.data?.message || 'No se pudo actualizar la orden de compra';
            toast.push(<Notification title="Error" type="danger">{message}</Notification>)
        } finally {
            actions.setSubmitting(false)
        }
    }


    // --- Handlers de Ver Detalles (Show) ---
    // AHORA REDIRECCIONA A LA NUEVA VISTA
    const handleShow = (rowData) => {
        const orderId = rowData.id;
        navigate(`/warehouse/purchaseOrder/${orderId}`);
    }

    // ELIMINADO: handleCloseViewDrawer (ya no es necesario)


    // --- Lógica de Eliminación ---
    const handleDelete = async (id) => {
        if (!window.confirm("¿Está seguro de que desea eliminar esta Orden de Compra?")) {
            return;
        }

        try {
            const res = await apiDeletePurchaseOrder(id);
            if (res.data.success) {
                toast.push(<Notification title="Eliminado" type="success">Orden de Compra eliminada correctamente.</Notification>);
                fetchOrders();
            } else {
                toast.push(<Notification title="Error" type="danger">{res.data.message || 'Error al eliminar la orden.'}</Notification>);
            }
        } catch (error) {
            toast.push(<Notification title="Error" type="danger">Error de red o servidor al eliminar la orden.</Notification>);
        }
    }

    // HANDLER para el reporte PDF (se mantiene)
    const handleGenerateActa = async (id) => {
        try {
            const response = await apiGetActaPurchaseOrder(id);

            const blob = new Blob([response.data], { type: 'application/pdf' });

            const contentDisposition = response.headers['content-disposition'];
            let fileName = 'acta_recepcion.pdf';

            if (contentDisposition) {
                const fileNameMatch = contentDisposition.match(/filename="(.+)"/i);
                if (fileNameMatch && fileNameMatch.length === 2) {
                    fileName = fileNameMatch[1];
                }
            }

            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = fileName;

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(link.href);

            toast.push(<Notification title="Descarga Iniciada" type="success">El Acta de Recepción ha sido descargada.</Notification>);

        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Error al generar el Acta de Recepción.';
            toast.push(<Notification title="Error" type="danger">{errorMessage}</Notification>);
        }
    }


    return (
        <Card borderless className="shadow-none border-0">
            {/* HEADER */}
            <div className="flex justify-between items-center border-b px-4 py-3">
                <h4 className="text-lg font-semibold">Listado de Órdenes de Compra</h4>
                <button
                    className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                    onClick={handleAddOrder}
                >
                    <HiPlusCircle className="text-lg" />
                    Añadir Orden
                </button>
            </div>

            {/* LISTADO */}
            <div className="p-4">
                <PurchaseOrderTable
                    data={data}
                    loading={loading}
                    onEdit={handleEdit}
                    onShow={handleShow} // Esta llama a la redirección (navigate)
                    onDelete={handleDelete}
                    onGenerateActa={handleGenerateActa}
                />
            </div>

            {/* FOOTER */}
            <div className="border-t px-4 py-2 text-sm text-gray-500">
                Total registros: {data.length}
            </div>

            {/* DRAWERS */}
            {/* Solo se pasan las props de Edición/Creación */}
            <PurchaseOrderDrawers
                // States
                drawerOpen={drawerOpen}
                editDrawerOpen={editDrawerOpen}
                // ELIMINADOS: viewDrawerOpen y orderToView
                selectedOrder={selectedOrder}
                suppliers={suppliers}

                // Handlers
                handleCloseDrawer={handleCloseDrawer}
                handleCloseEditDrawer={handleCloseEditDrawer}
                // ELIMINADO: handleCloseViewDrawer
                handleCreateOrder={handleCreateOrder}
                handleUpdateOrder={handleUpdateOrder}
                validationSchema={validationSchema}
            />
        </Card>
    )
}

export default PurchaseOrder