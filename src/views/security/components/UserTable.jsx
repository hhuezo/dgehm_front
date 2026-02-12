import React from 'react'
import { useSelector } from 'react-redux'
import DataTable from 'components/shared/DataTable'
import { Card } from 'components/ui'
import { AuthorityCheck } from 'components/shared'
import { HiPlusCircle } from 'react-icons/hi'

const UserTable = ({ data, columns, loading, handleAdd }) => {
    const userPermissions = useSelector((state) => state.auth.user.permissions || []);

    return (
        <Card borderless className="shadow-none border-0">
            {/* HEADER */}
            <div className="flex justify-between items-center border-b px-4 py-3">
                <h4 className="text-lg font-semibold">
                    Listado de Usuarios
                </h4>

                {/* Botón Añadir Usuario */}
                <AuthorityCheck userPermissions={userPermissions} permissions={['users create']}>
                    <button
                        className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                        onClick={handleAdd}
                    >
                        <HiPlusCircle className="text-lg" />
                        Añadir Usuario
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
                Total registros: {data.length}
            </div>
        </Card>
    )
}

export default UserTable

