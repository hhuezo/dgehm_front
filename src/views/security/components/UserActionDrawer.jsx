import React from 'react'
import DrawerOld from 'components/ui/Drawer/DrawerOld' // DRAWER PEQUEÑO (OLD) para mantener el mismo ancho
import UserForm from './UserForm' // Importa el formulario
import UserRolesSection from './UserRolesSection' // Importa la sección de roles
import UserOfficesSection from './UserOfficesSection' // Importa la sección de oficinas

const UserActionDrawer = ({ isOpen, onClose, onSubmit, selectedUser, mode, roles = [], offices = [], onRolesUpdated, onOfficesUpdated }) => {
    // Si estamos editando o viendo y selectedUser es nulo, no renderizamos nada (para evitar errores)
    if ((mode === 'edit' || mode === 'view') && !selectedUser) {
        return null
    }

    // Para el modo "view" (show), usamos el mismo drawer para mantener el ancho consistente
    if (mode === 'view') {
        return (
            <DrawerOld
                isOpen={isOpen}
                onClose={onClose}
                closable={false}
            >
                {/* Header manual */}
                <div className="flex items-center justify-between mb-4 border-b pb-3">
                    <h5 className="font-semibold text-xl">Detalles del Usuario</h5>
                    <button
                        type="button"
                        className="px-2 py-1 text-sm text-gray-500 hover:text-gray-700 rounded"
                        onClick={onClose}
                    >
                        X
                    </button>
                </div>

                {/* Información del usuario (solo lectura) */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
                    <input
                        type="text"
                        value={selectedUser?.name || ''}
                        disabled
                        className="block w-full rounded border border-gray-300 bg-gray-100 cursor-not-allowed shadow-sm h-10 px-3 text-sm"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                        type="email"
                        value={selectedUser?.email || ''}
                        disabled
                        className="block w-full rounded border border-gray-300 bg-gray-100 cursor-not-allowed shadow-sm h-10 px-3 text-sm"
                    />
                </div>

                {/* Sección de Roles */}
                <UserRolesSection
                    user={selectedUser}
                    allRoles={roles}
                    onRolesUpdated={onRolesUpdated}
                />

                {/* Sección de Oficinas */}
                <UserOfficesSection
                    user={selectedUser}
                    allOffices={offices}
                    onOfficesUpdated={onOfficesUpdated}
                />

                {/* Botón de cerrar */}
                <div className="flex justify-end pt-8 border-t mt-6">
                    <button
                        type="button"
                        className="px-3 py-1.5 text-sm border rounded bg-gray-100 hover:bg-gray-200"
                        onClick={onClose}
                    >
                        Cerrar
                    </button>
                </div>
            </DrawerOld>
        )
    }

    // Para los modos "add" y "edit", usamos el drawer pequeño con el formulario
    return (
        <DrawerOld
            isOpen={isOpen}
            onClose={onClose}
            closable={false}
        >
            <UserForm
                mode={mode}
                selectedUser={selectedUser}
                onSubmit={onSubmit}
                onClose={onClose}
                roles={roles}
            />
        </DrawerOld>
    )
}

export default UserActionDrawer


