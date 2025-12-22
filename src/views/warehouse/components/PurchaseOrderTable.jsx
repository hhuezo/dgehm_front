// PurchaseOrderTable.jsx

import React, { useMemo } from 'react'
import DataTable from 'components/shared/DataTable'
import { HiOutlinePencil, HiOutlineEye, HiOutlineTrash, HiOutlineDocumentReport } from 'react-icons/hi'

// 1. CORRECCIÓN: ActionColumn debe recibir la prop onGenerateActa
const ActionColumn = ({ row, onEdit, onShow, onDelete, onGenerateActa }) => {
    const rowData = row.original;

    return (
        <div className="flex justify-end items-center gap-1">
            <button
                title="Reporte"
                className="p-1.5 rounded-full bg-orange-100 text-orange-600 hover:bg-orange-200 transition-colors"
                // Ahora onGenerateActa está definido y puede ser llamado
                onClick={() => onGenerateActa(rowData.id)}
            >
                <HiOutlineDocumentReport className="text-lg" />
            </button>
            <button
                title="Ver Detalles"
                className="p-1.5 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
                onClick={() => onShow(rowData)} // <-- Llama a handleShow() del componente padre
            >
                <HiOutlineEye className="text-lg" />
            </button>
            <button title="Editar" className="p-1.5 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors" onClick={() => onEdit(rowData)}>
                <HiOutlinePencil className="text-lg" />
            </button>
            {/* Si el botón de eliminar se reactiva, debe usar onDelete(rowData.id) */}
            {/* <button title="Eliminar" className="p-1.5 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors" onClick={() => onDelete(rowData.id)}>
                <HiOutlineTrash className="text-lg" />
            </button> */}
        </div>
    )
}

// PurchaseOrderTable recibe todas las props, incluyendo onGenerateActa
const PurchaseOrderTable = ({ data, loading, onEdit, onShow, onDelete, onGenerateActa }) => {

    // 2. CORRECCIÓN: Pasar onGenerateActa a ActionColumn en useMemo
    const finalColumns = useMemo(() => [
        { header: 'ID', accessorKey: 'id' },
        { header: 'No. Orden', accessorKey: 'order_number' },
        {
            header: 'Proveedor',
            accessorKey: 'supplier.name',
            cell: (props) => <span>{props.row.original.supplier?.name || 'N/A'}</span>
        },
        { header: 'Factura', accessorKey: 'invoice_number' },
        { header: 'Monto Total', accessorKey: 'total_amount' },
        { header: 'Fecha Acta', accessorKey: 'acta_date' },
        {
            header: '',
            id: 'action',
            // Asegúrate de que onGenerateActa se pasa como prop aquí
            cell: (props) => <ActionColumn row={props.row} onEdit={onEdit} onShow={onShow} onDelete={onDelete} onGenerateActa={onGenerateActa} />,
            cellClassName: 'text-right',
            headerClassName: 'text-right',
        },
    ], [onEdit, onShow, onDelete, onGenerateActa]); // Añadir onGenerateActa a las dependencias

    return (
        <DataTable
            data={data}
            columns={finalColumns}
            loading={loading}
        />
    )
}

export default PurchaseOrderTable