import React, { useMemo } from 'react'
import DataTable from 'components/shared/DataTable'
import { HiOutlinePencil, HiOutlineTrash, HiPlusCircle } from 'react-icons/hi'

const ClaseTable = ({
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
            { header: 'ID', accessorKey: 'id' },
            { header: 'Nombre', accessorKey: 'name' },
            {
                header: 'Código',
                accessorKey: 'code',
                cell: ({ row }) => row.original.code ?? '—',
            },
            {
                header: 'Vida útil',
                accessorKey: 'useful_life',
                cell: ({ row }) =>
                    row.original.useful_life != null ? row.original.useful_life : '—',
            },
            {
                header: 'Específico',
                accessorKey: 'specific',
                cell: ({ row }) =>
                    row.original.specific?.name ?? row.original.fa_specific_id ?? '—',
            },
            {
                header: '',
                id: 'action',
                cell: (props) => <ActionColumn row={props.row} />,
                cellClassName: 'text-right',
                headerClassName: 'text-right',
            },
        ],
        []
    )

    return (
        <>
            <div className="flex justify-between items-center border-b px-4 py-3">
                <h4 className="text-lg font-semibold">Listado de clases</h4>
                <button
                    className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                    onClick={onAdd}
                >
                    <HiPlusCircle className="text-lg" />
                    Añadir clase
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

export default ClaseTable
