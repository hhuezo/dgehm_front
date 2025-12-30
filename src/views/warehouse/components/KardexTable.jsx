import React, { useMemo } from 'react';
import DataTable from 'components/shared/DataTableNoSearch';
import { Card } from 'components/ui';

const formatCurrency = (value) => {
    if (value === null || value === undefined) return 'N/A';
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return 'N/A';

    return new Intl.NumberFormat('es-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 4,
    }).format(numValue);
};

const formatDate = (isoDate) => {
    if (!isoDate) return 'N/A';
    const dateStr = typeof isoDate === 'string' ? isoDate.split('T')[0] : isoDate;
    return new Date(dateStr).toLocaleDateString('es-ES');
};

const KardexTable = ({ data = [], loading = false }) => {

    const processedData = data;

    const columns = useMemo(() => [
        {
            header: 'Fecha',
            accessorKey: 'created_at',
            cell: (props) => <span>{formatDate(props.row.original.created_at)}</span>
        },
        {
            header: 'Orden compra',
            accessorKey: 'purchase_order.order_number',
            cell: (props) => {
                const item = props.row.original;
                return <span>{`OC: ${item.purchase_order?.order_number || item.purchase_order_id}`}</span>;
            }
        },
        {
            header: 'Oficina',
            accessorKey: 'supplier_request.office.name',
        },
        {
            header: 'Entrada',
            accessorKey: 'quantity',
            cell: (props) => {
                const item = props.row.original;
                const qty = item.movement_type === 1 ? parseFloat(item.quantity) : 0;
                return (
                    <span className="font-medium text-green-600">
                        {qty > 0 ? qty : '-'}
                    </span>
                );
            },
            cellClassName: 'text-right',
            headerClassName: 'text-right',
        },
        {
            header: 'Salida',
            accessorKey: 'quantity',
            cell: (props) => {
                const item = props.row.original;
                const qty = item.movement_type === 2 ? parseFloat(item.quantity) : 0;
                return (
                    <span className="font-medium text-red-600">
                        {qty > 0 ? qty : '-'}
                    </span>
                );
            },
            cellClassName: 'text-right',
            headerClassName: 'text-right',
        },
        {
            header: 'Costo Unitario',
            accessorKey: 'unit_price',
            cell: (props) => <span>{formatCurrency(props.row.original.unit_price)}</span>,
            cellClassName: 'text-right',
            headerClassName: 'text-right',
        },
        {
            header: 'Costo Total',
            accessorKey: 'subtotal',
            cell: (props) => <span>{formatCurrency(props.row.original.subtotal)}</span>,
            cellClassName: 'text-right',
            headerClassName: 'text-right',
        },
    ], []);

    if (processedData.length === 0 && !loading) {
        return (
            <Card className="text-center py-5 text-gray-500">
                No hay movimientos de Kardex para mostrar.
            </Card>
        );
    }

    return (
        <DataTable
            data={processedData}
            columns={columns}
            loading={loading}
            disableGlobalFilter={true}
            showGlobalFilter={false}
        />
    )
}

export default KardexTable;