import React from 'react'
import DrawerOld from 'components/ui/Drawer/DrawerOld' // DRAWER PEQUEÑO (OLD)
import RoleForm from './RoleForm' // Importa el formulario

const RoleActionDrawer = ({ isOpen, onClose, onSubmit, selectedRole, mode }) => {
    // Si estamos editando y selectedRole es nulo, no renderizamos nada (para evitar errores)
    if (mode === 'edit' && !selectedRole) {
        return null;
    }

    // Nota: El header del Drawer está integrado dentro de RoleForm.jsx para manejar el título dinámico.

    return (
        <DrawerOld
            isOpen={isOpen}
            onClose={onClose}
            closable={false}
        // Puedes agregar una clase de ancho si DrawerOld lo soporta, por ejemplo:
        // width={mode === 'add' ? 400 : 500} 
        >
            <RoleForm
                mode={mode}
                selectedRole={selectedRole}
                onSubmit={onSubmit}
                onClose={onClose}
            />
        </DrawerOld>
    )
}

export default RoleActionDrawer