import React, { useMemo } from 'react';
import DataTable from 'components/shared/DataTable';
import { HiOutlinePencil, HiOutlineEye } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';

const SupplyReturnTable = ({ data, loading, handleEdit }) => {
    const navigate = useNavigate();

    const handleViewDetails = (returnId) => {

        // Nueva ruta para ver detalles de la devolución
        if (returnId) {
            navigate(`/warehouse/supply-return/${returnId}`);
        } else {
            console.error("No se pudo obtener el ID de devolución para navegar.");
            // Opcional: Mostrar una notificación al usuario si el ID es inválido
        }
    };

    const ActionColumn = ({ row }) => (
        <div className="flex justify-end items-center gap-1">
            <button
                title="Ver Detalles"
                className="p-1.5 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
                // Aquí se llama handleViewDetails con row.original.id
                onClick={() => handleViewDetails(row.original.id)}
            >
                <HiOutlineEye className="text-lg" />
            </button>

            <button
                title="Editar"
                className="p-1.5 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                onClick={() => handleEdit(row.original)}
            >
                <HiOutlinePencil className="text-lg" />
            </button>
        </div>
    );

    const columns = useMemo(
        () => [
            { header: 'ID', accessorKey: 'id' },
            {
                header: 'Fecha Devolución',
                accessorKey: 'return_date',
                cell: props => new Date(props.row.original.return_date).toLocaleDateString()
            },
            {
                header: 'Devuelto Por',
                accessorKey: 'returned_by.name',
                cell: props => <span className="font-medium">{props.row.original.returned_by ? `${props.row.original.returned_by.name} ${props.row.original.returned_by.lastname}` : 'N/A'}</span>
            },
            {
                header: 'Supervisor Inmediato',
                accessorKey: 'immediate_supervisor',
                cell: props => {
                    const supervisor = props.row.original.immediate_supervisor;
                    return (
                        <span className="font-medium">
                            {supervisor ? `${supervisor.name} ${supervisor.lastname}` : 'N/A'}
                        </span>
                    );
                }
            },
            {
                header: 'Recibido Por',
                accessorKey: 'received_by.name',
                cell: props => <span className="font-medium">{props.row.original.received_by ? `${props.row.original.received_by.name} ${props.row.original.received_by.lastname}` : 'N/A'}</span>
            },
            {
                header: 'Oficina',
                accessorKey: 'office.name',
                cell: props => <span className="font-medium">{props.row.original.office ? props.row.original.office.name : 'N/A'}</span>
            },
            {
                header: '',
                id: 'action',
                cell: (props) => <ActionColumn row={props.row} />,
                cellClassName: 'text-right',
                headerClassName: 'text-right',
            },
        ],
        [handleEdit]
    );

    return (
        <DataTable
            data={data}
            columns={columns}
            loading={loading}
        />
    );
};

export default SupplyReturnTable;