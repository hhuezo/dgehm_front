import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import DataTable from 'components/shared/DataTable'
import { AuthorityCheck } from 'components/shared'
import { HiOutlinePencil, HiOutlineEye, HiOutlinePrinter } from 'react-icons/hi'
import { apiGetActaPurchaseOrder } from 'services/WareHouseServise'
import Notification from 'components/ui/Notification'
import toast from 'components/ui/toast'

// ===============================================
// UTILIDADES DE FORMATO
// ===============================================

const formatIsoDateTime = (isoDateStr) => {
    if (!isoDateStr) return 'N/A'
    const dateObj = new Date(isoDateStr)
    if (isNaN(dateObj.getTime())) return isoDateStr
    const dateOptions = { day: '2-digit', month: '2-digit', year: 'numeric' }
    const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: false }
    const formattedDate = dateObj.toLocaleDateString('es-ES', dateOptions)
    const formattedTime = dateObj.toLocaleTimeString('es-ES', timeOptions)
    return `${formattedDate} ${formattedTime}`
}

const formatCurrency = (amount) => {
    const numericAmount = Number(amount || 0)
    return new Intl.NumberFormat('es-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
    }).format(numericAmount)
}

// ===============================================
// ABRIR ACTA PDF EN NUEVA PESTAÑA (_blank)
// ===============================================

const openActaReport = async (orderId) => {
    // 🔴 abrir pestaña inmediatamente (evita bloqueo del navegador)
    const newTab = window.open('', '_blank')

    try {
        const res = await apiGetActaPurchaseOrder(orderId)

        const blob = new Blob([res.data], { type: 'application/pdf' })
        const url = window.URL.createObjectURL(blob)

        // cargar el PDF en la pestaña abierta
        newTab.location.href = url
    } catch (error) {
        if (newTab) newTab.close()

        console.error('Error al generar el acta', error)
        toast.push(
            <Notification title="Error" type="danger">
                No se pudo generar el acta PDF
            </Notification>
        )
    }
}

// ===============================================
// COMPONENTE DE ACCIÓN
// ===============================================

const ActionColumn = ({ row, onEdit, onShow, userPermissions }) => {
    const rowData = row.original

    return (
        <div className="flex justify-end items-center gap-1">
            <AuthorityCheck userPermissions={userPermissions} permissions={['purchase_order report-acta']}>
                <button
                    title="Reporte"
                    className="p-1.5 rounded-full bg-orange-100 text-orange-600 hover:bg-orange-200 transition-colors"
                    onClick={() => openActaReport(rowData.id)}
                >
                    <HiOutlinePrinter className="text-lg" />
                </button>
            </AuthorityCheck>

            <AuthorityCheck userPermissions={userPermissions} permissions={['purchase_order show']}>
                <button
                    title="Ver Detalles"
                    className="p-1.5 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
                    onClick={() => onShow(rowData)}
                >
                    <HiOutlineEye className="text-lg" />
                </button>
            </AuthorityCheck>

            <AuthorityCheck userPermissions={userPermissions} permissions={['purchase_order update']}>
                <button
                    title="Editar"
                    className="p-1.5 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                    onClick={() => onEdit(rowData)}
                >
                    <HiOutlinePencil className="text-lg" />
                </button>
            </AuthorityCheck>
        </div>
    )
}

// ===============================================
// COMPONENTE PRINCIPAL DE LA TABLA
// ===============================================

const PurchaseOrderTable = ({ data, loading, onEdit, onShow }) => {
    const userPermissions = useSelector((state) => state.auth.user.permissions || []);

    const finalColumns = useMemo(() => [
        { header: 'ID', accessorKey: 'id' },
        { header: 'No. Orden', accessorKey: 'order_number' },
        {
            header: 'Proveedor',
            accessorKey: 'supplier.name',
            cell: (props) => (
                <span>{props.row.original.supplier?.name || 'N/A'}</span>
            )
        },
        { header: 'Factura', accessorKey: 'invoice_number' },
        {
            header: 'Monto Total',
            accessorKey: 'total_amount',
            cell: (props) => (
                <span>{formatCurrency(props.row.original.total_amount)}</span>
            )
        },
        {
            header: 'Fecha Acta',
            accessorKey: 'acta_date',
            cell: (props) => (
                <span>{formatIsoDateTime(props.row.original.acta_date)}</span>
            )
        },
        {
            header: '',
            id: 'action',
            cell: (props) => (
                <ActionColumn
                    row={props.row}
                    onEdit={onEdit}
                    onShow={onShow}
                    userPermissions={userPermissions}
                />
            ),
            cellClassName: 'text-right',
            headerClassName: 'text-right',
        },
    ], [onEdit, onShow, userPermissions])

    return (
        <DataTable
            data={data}
            columns={finalColumns}
            loading={loading}
        />
    )
}

export default PurchaseOrderTable
