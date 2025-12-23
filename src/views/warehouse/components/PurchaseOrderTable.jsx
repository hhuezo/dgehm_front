// PurchaseOrderTable.jsx

import React, { useMemo } from 'react'
import DataTable from 'components/shared/DataTable'
import { HiOutlinePencil, HiOutlineEye, HiOutlineTrash, HiOutlineDocumentReport } from 'react-icons/hi'

// ===============================================
// UTILIDADES DE FORMATO
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


// ===============================================
// COMPONENTE DE ACCIÓN
// ===============================================

const ActionColumn = ({ row, onEdit, onShow, onDelete, onGenerateActa }) => {
    const rowData = row.original;

    return (
        <div className="flex justify-end items-center gap-1">
            <button
                title="Reporte"
                className="p-1.5 rounded-full bg-orange-100 text-orange-600 hover:bg-orange-200 transition-colors"
                onClick={() => onGenerateActa(rowData.id)}
            >
                <HiOutlineDocumentReport className="text-lg" />
            </button>
            <button
                title="Ver Detalles"
                className="p-1.5 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
                onClick={() => onShow(rowData)}
            >
                <HiOutlineEye className="text-lg" />
            </button>
            <button title="Editar" className="p-1.5 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors" onClick={() => onEdit(rowData)}>
                <HiOutlinePencil className="text-lg" />
            </button>
        </div>
    )
}

// ===============================================
// COMPONENTE PRINCIPAL DE LA TABLA
// ===============================================

const PurchaseOrderTable = ({ data, loading, onEdit, onShow, onDelete, onGenerateActa }) => {

    const finalColumns = useMemo(() => [
        { header: 'ID', accessorKey: 'id' },
        { header: 'No. Orden', accessorKey: 'order_number' },
        {
            header: 'Proveedor',
            accessorKey: 'supplier.name',
            cell: (props) => <span>{props.row.original.supplier?.name || 'N/A'}</span>
        },
        { header: 'Factura', accessorKey: 'invoice_number' },
        {
            header: 'Monto Total',
            accessorKey: 'total_amount',
            //APLICACIÓN DEL FORMATO DE MONEDA
            cell: (props) => <span>{formatCurrency(props.row.original.total_amount)}</span>
        },
        {
            header: 'Fecha Acta',
            accessorKey: 'acta_date',
            cell: (props) => <span>{formatIsoDateTime(props.row.original.acta_date)}</span>
        },
        {
            header: '',
            id: 'action',
            cell: (props) => <ActionColumn row={props.row} onEdit={onEdit} onShow={onShow} onDelete={onDelete} onGenerateActa={onGenerateActa} />,
            cellClassName: 'text-right',
            headerClassName: 'text-right',
        },
    ], [onEdit, onShow, onDelete, onGenerateActa]);

    return (
        <DataTable
            data={data}
            columns={finalColumns}
            loading={loading}
        />
    )
}

export default PurchaseOrderTable