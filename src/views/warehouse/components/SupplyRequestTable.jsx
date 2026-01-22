import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import DataTable from 'components/shared/DataTable'
import { AuthorityCheck } from 'components/shared'
import { HiOutlinePencil, HiOutlineEye, HiOutlinePrinter } from 'react-icons/hi'
import { useNavigate } from 'react-router-dom'
import { apiGetRequestFormReport } from 'services/WareHouseServise'

const SupplyRequestTable = ({ data, loading, handleEdit }) => {
    const navigate = useNavigate()
    const userPermissions = useSelector((state) => state.auth.user.permissions || []);

    // ===============================================
    // NAVEGACIÓN A DETALLE
    // ===============================================
    const handleViewDetails = (requestId) => {
        navigate(`/warehouse/supply-request/${requestId}`)
    }

    // ===============================================
    // IMPRIMIR SOLICITUD (PDF)
    // ===============================================
    const handlePrintRequest = async (id) => {
        try {
            const response = await apiGetRequestFormReport(id)

            const blob = new Blob([response.data], { type: 'application/pdf' })
            const url = window.URL.createObjectURL(blob)

            // Abrir PDF en nueva pestaña
            window.open(url)
        } catch (error) {
            console.error('Error al generar el reporte de la solicitud', error)
        }
    }

    // ===============================================
    // COLUMNA DE ACCIONES
    // ===============================================
    const ActionColumn = ({ row }) => (
        <div className="flex justify-end items-center gap-1">
            <AuthorityCheck userPermissions={userPermissions} permissions={['wh.supply_request.view']}>
                <button
                    title="Imprimir"
                    className="p-1.5 rounded-full bg-orange-100 text-orange-600 hover:bg-orange-200 transition-colors"
                    onClick={() => handlePrintRequest(row.original.id)}
                >
                    <HiOutlinePrinter className="text-lg" />
                </button>
            </AuthorityCheck>

            <AuthorityCheck userPermissions={userPermissions} permissions={['wh.supply_request.show']}>
                <button
                    title="Ver Detalles"
                    className="p-1.5 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
                    onClick={() => handleViewDetails(row.original.id)}
                >
                    <HiOutlineEye className="text-lg" />
                </button>
            </AuthorityCheck>

            <AuthorityCheck userPermissions={userPermissions} permissions={['wh.supply_request.view']}>
                <button
                    title="Editar"
                    className="p-1.5 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                    onClick={() => handleEdit(row.original)}
                >
                    <HiOutlinePencil className="text-lg" />
                </button>
            </AuthorityCheck>
        </div>
    )

    // ===============================================
    // DEFINICIÓN DE COLUMNAS
    // ===============================================
    const columns = useMemo(
        () => [
            { header: 'ID', accessorKey: 'id' },
            {
                header: 'Fecha Solicitud',
                accessorKey: 'date',
                cell: (props) =>
                    new Date(props.row.original.date).toLocaleDateString()
            },
            {
                header: 'Solicitante',
                accessorKey: 'requester.name',
                cell: (props) => (
                    <span className="font-medium">
                        {props.row.original.requester
                            ? `${props.row.original.requester.name} ${props.row.original.requester.lastname}`
                            : 'N/A'}
                    </span>
                )
            },
            {
                header: 'Jefe Inmediato',
                accessorKey: 'immediate_boss',
                cell: (props) => {
                    const boss = props.row.original.immediate_boss
                    return (
                        <span className="font-medium">
                            {boss
                                ? `${boss.name} ${boss.lastname}`
                                : props.row.original.immediate_boss_id}
                        </span>
                    )
                }
            },
            {
                header: 'Estado',
                accessorKey: 'status.name',
                cell: (props) => (
                    <span className="font-medium">
                        {props.row.original.status
                            ? props.row.original.status.name
                            : 'N/A'}
                    </span>
                )
            },
            {
                header: '',
                id: 'action',
                cell: (props) => <ActionColumn row={props.row} />,
                cellClassName: 'text-right',
                headerClassName: 'text-right'
            }
        ],
        [handleEdit]
    )

    // ===============================================
    // RENDER
    // ===============================================
    return (
        <DataTable
            data={data}
            columns={columns}
            loading={loading}
        />
    )
}

export default SupplyRequestTable
