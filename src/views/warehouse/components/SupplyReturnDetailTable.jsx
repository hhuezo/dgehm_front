import React, { useMemo } from 'react';
import DataTable from 'components/shared/DataTable';
import { HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi';

const SupplyReturnDetailTable = ({ data, loading, handleEdit, handleDelete }) => {

    const ActionColumn = ({ row }) => {
        const item = row.original;

        return (
            <div className="flex justify-end items-center gap-1">
                <button
                    title="Editar Ítem"
                    className="p-1.5 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                    onClick={() => handleEdit(item)}
                >
                    <HiOutlinePencil className="text-lg" />
                </button>

                <button
                    title="Eliminar Ítem"
                    className="p-1.5 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                    onClick={() => handleDelete(item)}
                >
                    <HiOutlineTrash className="text-lg" />
                </button>
            </div>
        );
    };

    const columns = useMemo(
        () => [
            { header: 'ID', accessorKey: 'id' },
            {
                header: 'Producto',
                accessorKey: 'product.name',
                cell: props => (
                    // Asumimos que existe una relación 'product' con el campo 'name'
                    <span className="font-medium">{props.row.original.product?.name || 'Producto Eliminado'}</span>
                )
            },
            {
                header: 'Código',
                accessorKey: 'product.sku',
                cell: props => (
                    // Asumimos que existe una relación 'product' con el campo 'sku'
                    <span className="text-sm text-gray-500">{props.row.original.product?.sku || 'N/A'}</span>
                )
            },
            {
                header: 'Cantidad Devuelta',
                accessorKey: 'returned_quantity',
                cell: props => <span className="font-bold text-right w-full block">{props.row.original.returned_quantity}</span>
            },
            {
                header: 'Observación Específica',
                accessorKey: 'observation',
                cell: props => <span className="text-sm text-gray-600 truncate max-w-xs block">{props.row.original.observation || 'Sin observación'}</span>
            },
            {
                header: '',
                id: 'action',
                cell: (props) => <ActionColumn row={props.row} />,
                cellClassName: 'text-right',
                headerClassName: 'text-right',
            },
        ],
        [handleEdit, handleDelete]
    );

    return (
        <DataTable
            data={data}
            columns={columns}
            loading={loading}
        />
    );
};

export default SupplyReturnDetailTable;