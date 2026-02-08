import React, { useMemo } from 'react'
import DataTable from 'components/shared/DataTable'
import { HiOutlinePencil, HiOutlineTrash, HiPlusCircle } from 'react-icons/hi'

const FixedAssetTable = ({
    data,
    loading,
    onAdd,
    onEdit,
    onDelete,
    totalRecords,
}) => {
    const ActionColumn = ({ row }) => (
        <div className="flex justify-end items-center gap-1">
            <button
                title="Editar"
                className="p-1.5 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                onClick={() => onEdit(row.original)}
            >
                <HiOutlinePencil className="text-lg" />
            </button>
            <button
                title="Eliminar"
                className="p-1.5 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                onClick={() => onDelete(row.original)}
            >
                <HiOutlineTrash className="text-lg" />
            </button>
        </div>
    )

    const columns = useMemo(
        () => [
            { header: 'ID', accessorKey: 'id', size: 60 },
            {
                header: 'Código',
                accessorKey: 'code',
                size: 180,
                cell: ({ row }) => (
                    <span className="font-mono text-xs">
                        {row.original.code ?? '—'}
                    </span>
                ),
            },
            {
                header: 'Descripción',
                accessorKey: 'description',
                size: 200,
                cell: ({ row }) => (
                    <span
                        className="truncate block max-w-[200px]"
                        title={row.original.description}
                    >
                        {row.original.description ?? '—'}
                    </span>
                ),
            },
            {
                header: 'Clase',
                accessorKey: 'asset_class',
                size: 150,
                cell: ({ row }) =>
                    row.original.asset_class?.name ?? '—',
            },
            {
                header: 'Unidad Org.',
                accessorKey: 'organizational_unit',
                size: 150,
                cell: ({ row }) =>
                    row.original.organizational_unit?.name ?? '—',
            },
            {
                header: 'Responsable',
                accessorKey: 'current_responsible',
                size: 150,
                cell: ({ row }) => (
                    <span
                        className="truncate block max-w-[150px]"
                        title={row.original.current_responsible}
                    >
                        {row.original.current_responsible ?? '—'}
                    </span>
                ),
            },
            {
                header: 'Estado',
                accessorKey: 'physical_condition',
                size: 120,
                cell: ({ row }) =>
                    row.original.physical_condition?.name ?? '—',
            },
            {
                header: 'Origen',
                accessorKey: 'origin',
                size: 140,
                cell: ({ row }) =>
                    row.original.origin?.name ?? '—',
            },
            {
                header: 'Valor',
                accessorKey: 'purchase_value',
                size: 100,
                cell: ({ row }) =>
                    row.original.purchase_value != null
                        ? `$${parseFloat(row.original.purchase_value).toFixed(2)}`
                        : '—',
            },
            {
                header: '',
                id: 'action',
                cell: (props) => <ActionColumn row={props.row} />,
                size: 80,
            },
        ],
        []
    )

    return (
        <>
            <div className="flex justify-between items-center border-b px-4 py-3">
                <h4 className="text-lg font-semibold">Listado de activos fijos</h4>
                <button
                    className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                    onClick={onAdd}
                >
                    <HiPlusCircle className="text-lg" />
                    Añadir activo
                </button>
            </div>
            <div className="p-4">
                <DataTable data={data} columns={columns} loading={loading} />
            </div>
            <div className="border-t px-4 py-2 text-sm text-gray-500">
                Total registros: {totalRecords}
            </div>
        </>
    )
}

export default FixedAssetTable
