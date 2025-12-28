import React, { useEffect, useCallback, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'

// --- Imports de Redux/Store ---
import {
    setCurrentRouteTitle,
    setCurrentRouteSubtitle,
    setCurrentRouteInfo,
    setCurrentRouteOptions,
} from 'store/base/commonSlice'

// --- Imports de UI ---
import {
    Notification,
    toast,
} from 'components/ui'
import { HiOutlinePencil, HiOutlineEye, HiOutlineTrash } from 'react-icons/hi'

// --- Imports de APIs ---
import {
    apiGetUsers,
    apiStoreUser,
    apiGetUser,
    apiDeleteUser,
} from 'services/SecurityService'
import { apiGetRoles } from 'services/SecurityService'
import { apiGetOffices } from 'services/OfficeService'

// --- IMPORTS DE COMPONENTES HIJOS (Ubicados en ./components/) ---
import UserTable from './components/UserTable'
import UserActionDrawer from './components/UserActionDrawer'


const Users = () => {
    const dispatch = useDispatch()

    // --- ESTADO ---
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [roles, setRoles] = useState([])
    const [offices, setOffices] = useState([])

    // Estados para Drawer de Creación/Edición
    const [createDrawerOpen, setCreateDrawerOpen] = useState(false)
    const [editDrawerOpen, setEditDrawerOpen] = useState(false)
    const [selectedUser, setSelectedUser] = useState(null)

    // Estados para Drawer de Ver Detalles (Show)
    const [viewDrawerOpen, setViewDrawerOpen] = useState(false)
    const [userToView, setUserToView] = useState(null)


    // ---- Lógica de Ruta, Fetch y Handlers ----

    const handleChange = useCallback(() => {
        dispatch(setCurrentRouteTitle('Usuarios'))
        dispatch(setCurrentRouteSubtitle('Gestión de usuarios del sistema'))
        dispatch(setCurrentRouteInfo(''))
        dispatch(setCurrentRouteOptions(''))
    }, [dispatch])

    useEffect(() => {
        handleChange()
        fetchUsers()
        fetchRoles()
        fetchOffices()
    }, [handleChange])

    const fetchUsers = async () => {
        setLoading(true)
        try {
            const res = await apiGetUsers()
            if (res.data.success) {
                setData(res.data.data)
            }
        } catch (error) {
            toast.push(<Notification title="Error" type="danger">Error al cargar usuarios</Notification>)
        } finally {
            setLoading(false)
        }
    }

    const fetchRoles = async () => {
        try {
            const res = await apiGetRoles()
            if (res.data.success) {
                setRoles(res.data.data)
            }
        } catch (error) {
            toast.push(<Notification title="Error" type="danger">Error al cargar roles</Notification>)
        }
    }

    const fetchOffices = async () => {
        try {
            const res = await apiGetOffices()
            if (res.data.success) {
                setOffices(res.data.data)
            }
        } catch (error) {
            toast.push(<Notification title="Error" type="danger">Error al cargar oficinas</Notification>)
        }
    }


    // --- Handlers de Creación ---
    const handleAdd = () => setCreateDrawerOpen(true)
    const handleCloseCreateDrawer = () => setCreateDrawerOpen(false)
    const handleCreateUser = async (values, actions) => {
        try {
            const res = await apiStoreUser(values)
            if (res.data.success) {
                toast.push(<Notification title="Correcto" type="success">Usuario creado correctamente</Notification>)
                setCreateDrawerOpen(false)
                fetchUsers()
            }
        } catch (error) {
            const message = error.response?.data?.message || 'No se pudo crear el usuario'
            toast.push(<Notification title="Error" type="danger">{message}</Notification>)
        } finally {
            actions.setSubmitting(false)
        }
    }


    // --- Handlers de Edición ---
    const handleEdit = async (data) => {
        try {
            const res = await apiGetUser(data.id)
            if (res.data.success) {
                setSelectedUser(res.data.data)
                setEditDrawerOpen(true)
            }
        } catch (error) {
            toast.push(<Notification title="Error" type="danger">Error al cargar datos del usuario</Notification>)
        }
    }
    const handleCloseEditDrawer = () => {
        setEditDrawerOpen(false)
        setSelectedUser(null)
    }
    const handleUpdateUser = async (values, actions) => {
        try {
            // Si la contraseña está vacía, no la incluimos en la actualización
            const dataToUpdate = { ...values, id: selectedUser.id }
            if (!dataToUpdate.password || dataToUpdate.password.trim() === '') {
                delete dataToUpdate.password
            }
            
            const res = await apiStoreUser(dataToUpdate)
            if (res.data.success) {
                toast.push(<Notification title="Correcto" type="success">Usuario actualizado correctamente</Notification>)
                setEditDrawerOpen(false)
                fetchUsers()
            }
        } catch (error) {
            const message = error.response?.data?.message || 'No se pudo actualizar el usuario'
            toast.push(<Notification title="Error" type="danger">{message}</Notification>)
        } finally {
            actions.setSubmitting(false)
        }
    }


    // --- Handlers de Ver Detalles (Show) ---
    const handleShow = async (rowData) => {
        setViewDrawerOpen(true)
        setUserToView(null)

        try {
            const res = await apiGetUser(rowData.id)
            if (res.data.success) {
                setUserToView(res.data.data)
            } else {
                toast.push(<Notification title="Error" type="danger">Error al cargar detalles del usuario</Notification>)
            }
        } catch (error) {
            toast.push(<Notification title="Error" type="danger">Error de red al obtener detalles del usuario</Notification>)
        }
    }
    const handleCloseViewDrawer = () => {
        setViewDrawerOpen(false)
        setUserToView(null)
    }


    // --- Handlers de Eliminación ---
    const handleDelete = async (id) => {
        if (!window.confirm("¿Está seguro de que desea eliminar este usuario?")) {
            return
        }

        try {
            const res = await apiDeleteUser(id)
            if (res.data.success) {
                toast.push(<Notification title="Eliminado" type="success">Usuario eliminado correctamente</Notification>)
                fetchUsers()
            } else {
                toast.push(<Notification title="Error" type="danger">{res.data.message || 'Error al eliminar el usuario'}</Notification>)
            }
        } catch (error) {
            toast.push(<Notification title="Error" type="danger">Error de red o servidor al eliminar el usuario</Notification>)
        }
    }


    // --- Definición de Columnas de Acción ---
    const ActionColumn = ({ row }) => (
        <div className="flex justify-end items-center gap-1">
            {/* Botón de Ver Detalles */}
            <button
                title="Ver Detalles"
                className="p-1.5 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
                onClick={() => handleShow(row.original)}
            >
                <HiOutlineEye className="text-lg" />
            </button>

            {/* Botón de Edición */}
            <button
                title="Editar"
                className="p-1.5 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                onClick={() => handleEdit(row.original)}
            >
                <HiOutlinePencil className="text-lg" />
            </button>

            {/* Botón de Eliminación */}
            <button
                title="Eliminar"
                className="p-1.5 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                onClick={() => handleDelete(row.original.id)}
            >
                <HiOutlineTrash className="text-lg" />
            </button>
        </div>
    )

    const columns = useMemo(
        () => [
            { header: 'ID', accessorKey: 'id' },
            { header: 'Nombre', accessorKey: 'name' },
            { header: 'Email', accessorKey: 'email' },
            { header: 'Rol', accessorKey: 'role_name', cell: ({ row }) => row.original.role?.name || 'Sin rol' },
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


    // --- RENDERIZADO DEL CONTENEDOR ---
    return (
        <>
            {/* 1. Tabla de Usuarios (Contiene Card, Header, DataTable y Footer) */}
            <UserTable
                data={data}
                columns={columns}
                loading={loading}
                handleAdd={handleAdd}
            />

            {/* 2. Drawer de Creación */}
            <UserActionDrawer
                isOpen={createDrawerOpen}
                onClose={handleCloseCreateDrawer}
                onSubmit={handleCreateUser}
                mode="add"
                selectedUser={null}
                roles={roles}
            />

            {/* 3. Drawer de Edición */}
            <UserActionDrawer
                isOpen={editDrawerOpen}
                onClose={handleCloseEditDrawer}
                onSubmit={handleUpdateUser}
                selectedUser={selectedUser}
                mode="edit"
                roles={roles}
            />

            {/* 4. Drawer de Ver Detalles (Show) */}
            {viewDrawerOpen && (
                <UserActionDrawer
                    isOpen={viewDrawerOpen}
                    onClose={handleCloseViewDrawer}
                    mode="view"
                    selectedUser={userToView}
                    roles={roles}
                    offices={offices}
                    onRolesUpdated={(updatedUser) => {
                        // Actualizar el usuario en la vista y en la lista
                        setUserToView(updatedUser)
                        fetchUsers() // Refrescar la lista de usuarios
                    }}
                    onOfficesUpdated={(updatedUser) => {
                        // Actualizar el usuario en la vista y en la lista
                        setUserToView(updatedUser)
                        fetchUsers() // Refrescar la lista de usuarios
                    }}
                />
            )}
        </>
    )
}

export default Users

