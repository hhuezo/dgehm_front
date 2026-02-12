import React, { useMemo } from 'react'
import DataTable from 'components/shared/DataTable'
import { AuthorityCheck } from 'components/shared'
import { HiOutlinePencil, HiOutlineTrash, HiPlusCircle } from 'react-icons/hi'

const FixedCatalogTable = ({
    data,
    loading,
    onAdd,
    onEdit,
    onDelete,
    totalRecords,
    listTitle = 'Listado',
    addButtonLabel = 'Añadir',
    userPermissions = [],
    createPermission,
    updatePermission,
    deletePermission,
}) => {
    const ActionColumn = ({ row }) => (
        <div className="flex justify-end items-center gap-1">
            <AuthorityCheck userPermissions={userPermissions} permissions={updatePermission ? [updatePermission] : []}>
                <button
                    title="Editar"
                    className="p-1.5 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                    onClick={() => onEdit(row.original)}
                >
                    <HiOutlinePencil className="text-lg" />
                </button>
            </AuthorityCheck>
            <AuthorityCheck userPermissions={userPermissions} permissions={deletePermission ? [deletePermission] : []}>
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
        []
    )

    return (
        <>
            <div className="flex justify-between items-center border-b px-4 py-3">
                <h4 className="text-lg font-semibold">{listTitle}</h4>
                <AuthorityCheck userPermissions={userPermissions} permissions={createPermission ? [createPermission] : []}>
                    <button
                        className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                        onClick={onAdd}
                    >
                        <HiPlusCircle className="text-lg" />
                        {addButtonLabel}
                    </button>
                </AuthorityCheck>
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

export default FixedCatalogTable
