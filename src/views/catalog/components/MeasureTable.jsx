import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import DataTable from 'components/shared/DataTable';
import { AuthorityCheck } from 'components/shared';
import { HiOutlinePencil, HiOutlineTrash, HiPlusCircle } from 'react-icons/hi'

const MeasureTable = ({ data, loading, onAdd, onEdit, onDelete, totalRecords }) => {
    const userPermissions = useSelector((state) => state.auth.user.permissions || []);

    // ---- Columnas de Acción (Estilo Two-Tone) ----
    const ActionColumn = ({ row }) => (
        <div className="flex justify-end items-center gap-1">
            {/* Botón de Edición */}
            <AuthorityCheck userPermissions={userPermissions} permissions={['wh.measures.update']}>
                <button
                    title="Editar"
                    className="p-1.5 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                    onClick={() => onEdit(row.original)}
                >
                    <HiOutlinePencil className="text-lg" />
                </button>
            </AuthorityCheck>

            {/* Botón de Eliminación */}
            <AuthorityCheck userPermissions={userPermissions} permissions={['wh.measures.delete']}>
                <button
                    title="Eliminar"
                    className="p-1.5 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                    onClick={() => onDelete(row.original)}
                >
                    <HiOutlineTrash className="text-lg" />
                </button>
            </AuthorityCheck>
        </div>
    )

    const columns = useMemo(
        () => [
            { header: 'ID', accessorKey: 'id' },
            { header: 'Nombre', accessorKey: 'name' },
            {
                header: '',
                id: 'action',
                cell: (props) => <ActionColumn row={props.row} />,
                cellClassName: 'text-right',
                headerClassName: 'text-right',
            },
        ],
        [onEdit, onDelete] // Las funciones de callback deben estar en las dependencias
    )

    return (
        <>
            {/* HEADER */}
            <div className="flex justify-between items-center border-b px-4 py-3">
                <h4 className="text-lg font-semibold">
                    Listado de Unidades de Medida
                </h4>

                {/* Botón Añadir Unidad de Medida (nativo HTML, color AZUL) */}
                <AuthorityCheck userPermissions={userPermissions} permissions={['wh.measures.create']}>
                    <button
                        className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                        onClick={onAdd}
                    >
                        <HiPlusCircle className="text-lg" />
                        Añadir Unidad de Medida
                    </button>
                </AuthorityCheck>
            </div>

            {/* LISTADO */}
            <div className="p-4">
                <DataTable
                    data={data}
                    columns={columns}
                    loading={loading}
                />
            </div>

            {/* FOOTER */}
            <div className="border-t px-4 py-2 text-sm text-gray-500">
                Total registros: {totalRecords}
            </div>
        </>
    );
};

export default MeasureTable;

