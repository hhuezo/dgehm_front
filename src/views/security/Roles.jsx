import React, { useEffect, useCallback, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

// --- Imports de Redux/Store ---
import {
    setCurrentRouteTitle,
    setCurrentRouteSubtitle,
    setCurrentRouteInfo,
    setCurrentRouteOptions,
} from 'store/base/commonSlice'

// --- Imports de UI ---
import {
    Card,
    Notification,
    toast,
} from 'components/ui'
import { HiOutlinePencil, HiOutlineEye } from 'react-icons/hi' // Usados en ActionColumn

// --- Imports de APIs ---
import {
    apiGetRoles,
    apiStoreRole,
    apiShowRole,
    apiGetPermissions,
} from 'services/SecurityService'

// --- IMPORTS DE COMPONENTES HIJOS (Ubicados en ./components/) ---
import RoleTable from './components/RoleTable'
import RoleActionDrawer from './components/RoleActionDrawer'
import RolePermissionsDrawer from './components/RolePermissionsDrawer'
import { AuthorityCheck } from 'components/shared'


const Roles = () => {
    const dispatch = useDispatch()
    const userPermissions = useSelector((state) => state.auth.user.permissions || [])

    // --- ESTADO ---
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)

    // Estados para Drawer de Creación/Edición
    const [createDrawerOpen, setCreateDrawerOpen] = useState(false)
    const [editDrawerOpen, setEditDrawerOpen] = useState(false)
    const [selectedRole, setSelectedRole] = useState(null)

    // Estados para Drawer de Ver Permisos (Show)
    const [viewDrawerOpen, setViewDrawerOpen] = useState(false)
    const [roleToView, setRoleToView] = useState(null)
    const [allPermissions, setAllPermissions] = useState([]); // Lista maestra de permisos


    // ---- Lógica de Ruta, Fetch y Handlers (Mantenida aquí) ----

    const handleChange = useCallback(() => {
        dispatch(setCurrentRouteTitle('Roles'))
        dispatch(setCurrentRouteSubtitle('Gestión de roles'))
        dispatch(setCurrentRouteInfo(''))
        dispatch(setCurrentRouteOptions(''))
    }, [dispatch])

    useEffect(() => {
        handleChange()
        fetchRoles()
        fetchAllPermissions()
    }, [handleChange])

    const fetchRoles = async () => {
        setLoading(true)
        try {
            const res = await apiGetRoles()
            if (res.data.success) {
                setData(res.data.data)
            }
        } catch (error) {
            toast.push(<Notification title="Error" type="danger">Error al cargar roles</Notification>)
        } finally {
            setLoading(false)
        }
    }

    const fetchAllPermissions = async () => {
        try {
            const res = await apiGetPermissions();
            if (res.data.success) {
                setAllPermissions(res.data.data);
            }
        } catch (error) {
            toast.push(<Notification title="Error" type="danger">Error al cargar listado maestro de permisos</Notification>);
        }
    }


    // --- Handlers de Creación ---
    const handleAdd = () => setCreateDrawerOpen(true)
    const handleCloseCreateDrawer = () => setCreateDrawerOpen(false)
    const handleCreateRole = async (values, actions) => {
        try {
            const res = await apiStoreRole(values)
            if (res.data.success) {
                toast.push(<Notification title="Correcto" type="success">Rol creado correctamente</Notification>)
                setCreateDrawerOpen(false)
                fetchRoles()
            }
        } catch (error) {
            toast.push(<Notification title="Error" type="danger">No se pudo crear el rol</Notification>)
        } finally {
            actions.setSubmitting(false)
        }
    }


    // --- Handlers de Edición ---
    const handleEdit = (data) => {
        setSelectedRole(data)
        setEditDrawerOpen(true)
    }
    const handleCloseEditDrawer = () => {
        setEditDrawerOpen(false)
        setSelectedRole(null)
    }
    const handleUpdateRole = async (values, actions) => {
        try {
            const dataToUpdate = { ...values, id: selectedRole.id };
            const res = await apiStoreRole(dataToUpdate)
            if (res.data.success) {
                toast.push(<Notification title="Correcto" type="success">Rol actualizado correctamente</Notification>)
                setEditDrawerOpen(false)
                fetchRoles()
            }
        } catch (error) {
            toast.push(<Notification title="Error" type="danger">No se pudo actualizar el rol</Notification>)
        } finally {
            actions.setSubmitting(false)
        }
    }


    // --- Handlers de Ver Detalles (Show) ---
    const handleShow = async (rowData) => {
        setViewDrawerOpen(true);
        setRoleToView(null);

        try {
            const res = await apiShowRole(rowData.id);
            if (res.data.success) {
                setRoleToView(res.data.data);
            } else {
                toast.push(<Notification title="Error" type="danger">Error al cargar detalles del rol</Notification>);
            }
        } catch (error) {
            toast.push(<Notification title="Error" type="danger">Error de red al obtener detalles del rol</Notification>);
        }
    }
    const handleCloseViewDrawer = () => {
        setViewDrawerOpen(false)
        setRoleToView(null)
    }


    // --- Definición de Columnas de Acción ---
    const ActionColumn = ({ row }) => (
        <div className="flex justify-end items-center gap-1">
            {/* Botón de Ver Detalles */}
            <AuthorityCheck userPermissions={userPermissions} permissions={['roles show']}>
                <button
                    title="Ver Detalles"
                    className="p-1.5 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
                    onClick={() => handleShow(row.original)}
                >
                    <HiOutlineEye className="text-lg" />
                </button>
            </AuthorityCheck>

            {/* Botón de Edición */}
            <AuthorityCheck userPermissions={userPermissions} permissions={['roles update']}>
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
        [ActionColumn]
    )


    // --- RENDERIZADO DEL CONTENEDOR ---
    return (
        <>
            {/* 1. Tabla de Roles (Contiene Card, Header, DataTable y Footer) */}
            <RoleTable
                data={data}
                columns={columns}
                loading={loading}
                handleAdd={handleAdd} // Llama a setCreateDrawerOpen(true)
            />

            {/* 2. Drawer de Creación (Usa DrawerOld/Pequeño) */}
            <RoleActionDrawer
                isOpen={createDrawerOpen}
                onClose={handleCloseCreateDrawer}
                onSubmit={handleCreateRole}
                mode="add"
                selectedRole={null}
            />

            {/* 3. Drawer de Edición (Usa DrawerOld/Pequeño) */}
            <RoleActionDrawer
                isOpen={editDrawerOpen}
                onClose={handleCloseEditDrawer}
                onSubmit={handleUpdateRole}
                selectedRole={selectedRole}
                mode="edit"
            />

            {/* 4. Drawer de Permisos (Show - Usa StandardDrawer/Normal) */}
            <RolePermissionsDrawer
                isOpen={viewDrawerOpen}
                onClose={handleCloseViewDrawer}
                roleToView={roleToView}
                setRoleToView={setRoleToView}
                allPermissions={allPermissions}
            />
        </>
    )
}

export default Roles