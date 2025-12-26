import React, { useMemo } from 'react';
import DataTable from 'components/shared/DataTable';
import { HiOutlinePencil, HiOutlineEye } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';

const SupplyRequestTable = ({ data, loading, handleEdit }) => {
    const navigate = useNavigate();

    const handleViewDetails = (requestId) => {
        navigate(`/warehouse/supply-request/${requestId}`);
    };

    const ActionColumn = ({ row }) => (
        <div className="flex justify-end items-center gap-1">
            <button
                title="Ver Detalles"
                className="p-1.5 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
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
                header: 'Fecha Solicitud',
                accessorKey: 'date',
                cell: props => new Date(props.row.original.date).toLocaleDateString()
            },
            {
                header: 'Solicitante',
                accessorKey: 'requester.name',
                cell: props => <span className="font-medium">{props.row.original.requester ? `${props.row.original.requester.name} ${props.row.original.requester.lastname}` : 'N/A'}</span>
            },
            {
                header: 'Jefe Inmediato',
                accessorKey: 'immediate_boss',
                cell: props => {
                    const boss = props.row.original.immediate_boss;
                    return (
                        <span className="font-medium">
                            {boss ? `${boss.name} ${boss.lastname}` : props.row.original.immediate_boss_id}
                        </span>
                    );
                }
            },
            {
                header: 'Estado',
                accessorKey: 'status.name',
                cell: props => (
                    <span className="font-medium">
                        {props.row.original.status ? props.row.original.status.name : 'N/A'}
                    </span>
                )
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

export default SupplyRequestTable;