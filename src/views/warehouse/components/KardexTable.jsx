import React, { useMemo } from 'react';
import DataTable from 'components/shared/DataTableNoSearch';
import { Card, Tag } from 'components/ui';

// Función para formatear moneda
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

// Función para formatear fecha
const formatDate = (isoDate) => {
    if (!isoDate) return 'N/A';
    const date = new Date(isoDate);
    if (isNaN(date)) return 'N/A';

    return date.toLocaleDateString('es-ES');
};

const KardexTable = ({ data = [], loading = false }) => {

    const columns = useMemo(() => [
        {
            header: 'Fecha',
            accessorKey: 'fecha_movimiento',
            cell: (props) => {
                const item = props.row.original;

                const fecha =
                    item.supplier_request?.delivery_date ||
                    item.supplierRequest?.delivery_date || // respaldo camelCase
                    item.purchase_order?.reception_date;

                return <span>{formatDate(fecha)}</span>;
            }
        },

        // NUEVA COLUMNA: Tipo Movimiento (Funcional)
        {
            header: 'Tipo Mov.',
            accessorKey: 'movement_type_functional',
            cell: (props) => {
                const item = props.row.original;
                let tag = <Tag>Ajuste/Otro</Tag>;

                if (item['supplier_return'] || item.supplierReturn) {
                    tag = <Tag className="bg-blue-100 text-blue-800">Devolución</Tag>;
                }
                else if (item['supplier_request'] || item.supplierRequest) {
                    tag = <Tag className="bg-red-100 text-red-800">Salida</Tag>;
                }
                else if (item.purchase_order && item.movement_type === 1) {
                    tag = <Tag className="bg-green-100 text-green-800">Entrada (Compra)</Tag>;
                }
                else if (item.movement_type === 2) {
                    tag = <Tag className="bg-red-50 text-red-700">Salida (Ajuste)</Tag>;
                }
                else if (item.movement_type === 1) {
                    tag = <Tag className="bg-green-50 text-green-700">Entrada (Ajuste)</Tag>;
                }

                return tag;
            }
        },

        // COLUMNA ORDEN COMPRA
        {
            header: 'Orden Compra',
            accessorKey: 'reference',
            cell: (props) => {
                const item = props.row.original;
                const ocNumber = item.purchase_order?.order_number;

                if (ocNumber) {
                    return <Tag className="bg-gray-100 text-gray-800">OC: {ocNumber}</Tag>;
                }

                return 'N/A o Ajuste';
            }
        },

        // COLUMNA OFICINA
        {
            header: 'Oficina',
            accessorKey: 'office_name',
            cell: (props) => {
                const item = props.row.original;

                const requestOffice =
                    item.supplier_request?.office?.name ||
                    item.supplierRequest?.office?.name;

                const returnOffice =
                    item.supplier_return?.office?.name ||
                    item.supplierReturn?.office?.name;

                const officeName = requestOffice || returnOffice || '';

                return <span>{officeName}</span>;
            }
        },

        {
            header: 'Entrada',
            accessorKey: 'quantity',
            id: 'quantity_in',
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
            id: 'quantity_out',
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
    ], [data]);

    if (data.length === 0 && !loading) {
        return (
            <Card className="text-center py-5 text-gray-500">
                No hay movimientos de Kardex para mostrar.
            </Card>
        );
    }

    return (
        <DataTable
            data={data}
            columns={columns}
            loading={loading}
            disableGlobalFilter={true}
            showGlobalFilter={false}
        />
    );
};

export default KardexTable;
