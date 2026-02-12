import React, { useState } from 'react';
import { Notification, toast } from 'components/ui';
import { togglePermission } from 'services/SecurityService'; // Asegúrate de que esta ruta sea correcta

const PermissionToggleSwitch = ({ role, permission, setRoleToView }) => {
    const assignedList = role?.permissions ?? [];
    const isAssigned = assignedList.some((p) => p.id === permission.id);
    const [isToggling, setIsToggling] = useState(false);

    const handleToggle = async () => {
        if (isToggling) return;

        setIsToggling(true);
        const dataToSend = {
            role_id: role.id,
            permission_id: permission.id,
        };

        // Lógica de Actualización Optimista
        const newIsAssigned = !isAssigned;
        const newPermissionsList = newIsAssigned
            ? [...assignedList, permission]
            : assignedList.filter((p) => p.id !== permission.id);

        setRoleToView(prevRole => ({
            ...prevRole,
            permissions: newPermissionsList
        }));

        try {
            const res = await togglePermission(dataToSend);

            if (res.data.success) {
                toast.push(
                    <Notification title="Correcto" type="success">
                        {res.data.message}
                    </Notification>
                );
            } else {
                // Rollback: restaurar lista anterior
                setRoleToView((prevRole) => ({ ...prevRole, permissions: assignedList }));
                toast.push(
                    <Notification title="Error" type="danger">
                        {res.data.message || "Error al actualizar el permiso. Revirtiendo cambio local."}
                    </Notification>
                );
            }
        } catch (error) {
            // Rollback: restaurar lista anterior
            setRoleToView((prevRole) => ({ ...prevRole, permissions: assignedList }));
            toast.push(
                <Notification title="Error" type="danger">
                    Error de red o servidor al alternar el permiso. Revirtiendo cambio local.
                </Notification>
            );
        } finally {
            setIsToggling(false);
        }
    };

    return (
        <div className="flex justify-between items-center pr-2 col-span-1">
            <span className="text-sm text-gray-700 font-medium truncate cursor-default" title={permission.name}>
                {permission.name}
            </span>
            <span
                className={`
                    inline-block h-5 w-10 rounded-full cursor-pointer transition-colors relative 
                    ${isAssigned ? 'bg-blue-600' : 'bg-gray-300'}
                    ${isToggling ? 'opacity-50 cursor-wait' : ''}
                `}
                onClick={handleToggle}
            >
                {/* ESTE ES EL CÍRCULO DEL SWITCH CON EL CENTRADO CORREGIDO */}
                <span
                    className={`
                        inline-block h-4 w-4 rounded-full bg-white shadow absolute 
                        
                        // CLASES CORREGIDAS: Mueve al 50% y luego ajusta hacia arriba su propia mitad
                        top-1/2 -translate-y-1/2 
                        
                        transition-transform duration-200 ease-in-out
                        ${isAssigned ? 'translate-x-5' : 'translate-x-0.5'}
                    `}
                ></span>
            </span>
        </div>
    );
};

export default PermissionToggleSwitch;