import React from 'react';
import { Table } from 'components/ui';

const { Tr, Th, Td, THead, TBody } = Table;

const formatNumber = (value) => {
    return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
};

const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
};

const KardexInventoryBalancesTable = ({ data }) => {
    if (!data || data.length === 0) {
        return <p className="text-sm text-gray-500">No hay existencias activas pendientes por liquidar.</p>;
    }

    return (
        <div className="max-w-xl border rounded-lg p-4 bg-gray-50 shadow-sm">
            <Table compact>
                <THead>
                    <Tr>
                        <Th>Orden de Compra</Th>
                        <Th className="text-right">Precio Unitario</Th>
                        <Th className="text-right">Existencia</Th>
                        <Th className="text-right">Total</Th>
                    </Tr>
                </THead>
                <TBody>
                    {data.map((item, index) => (
                        <Tr key={index}>
                            <Td className="font-semibold">{item.order_number}</Td>
                            <Td className="text-right">{formatCurrency(item.unit_cost_of_entry)}</Td>
                            <Td className="text-right font-bold text-blue-600">{formatNumber(item.remaining_quantity)}</Td>
                            <Td className="text-right font-bold text-blue-600">{formatCurrency(item.remaining_quantity * item.unit_cost_of_entry)}</Td>
                        </Tr>
                    ))}
                </TBody>
            </Table>
        </div>
    );
};

export default KardexInventoryBalancesTable;