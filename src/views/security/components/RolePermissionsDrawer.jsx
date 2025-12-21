import React from 'react'
import StandardDrawer from 'components/ui/Drawer/Drawer' // DRAWER NORMAL (STANDARD)
import { Formik, Form, Field } from 'formik'

// Importa el componente que maneja la lógica de alternancia de permisos
import PermissionToggleSwitch from './PermissionToggleSwitch'

// Reutilizamos los componentes de input y form-item que ahora están exportados desde RoleForm.jsx
import { PlainInput, PlainFormItem } from './RoleForm'

const RolePermissionsDrawer = ({ isOpen, onClose, roleToView, setRoleToView, allPermissions }) => {

    return (
        <StandardDrawer
            isOpen={isOpen}
            onClose={onClose}
            closable={false}
        >
            {/* Header manual */}
            <div className="flex items-center justify-between mb-4 border-b pb-3">
                <h5 className="font-semibold text-xl">Gestión de Permisos del Rol</h5>
                <button
                    type="button"
                    className="px-2 py-1 text-sm text-gray-500 hover:text-gray-700 rounded"
                    onClick={onClose}
                >
                    X
                </button>
            </div>

            {/* Contenido: Formulario de Solo Lectura con Switches */}
            {roleToView && allPermissions.length > 0 ? (
                <Formik
                    initialValues={{ id: roleToView.id, name: roleToView.name || '' }}
                    // No hay un submit real aquí, solo lectura y manejo de estado optimista en el switch
                    onSubmit={() => { /* No hacemos nada al enviar */ }}
                >
                    <Form>
                        {/* Campo ID oculto */}
                        <Field name="id" type="hidden" />

                        {/* Campo Nombre (Visible, pero deshabilitado) */}
                        <PlainFormItem
                            label="Nombre del rol"
                        >
                            <Field
                                name="name"
                                component={PlainInput}
                                disabled // Deshabilitado para solo lectura
                            />
                        </PlainFormItem>

                        {/* --- SECCIÓN DE PERMISOS EN TRES COLUMNAS --- */}
                        <div className="mt-6">
                            <h6 className="font-semibold text-lg border-b pb-2 mb-4">Permisos</h6>

                            {/* La clave es el uso de 'grid grid-cols-3' para la distribución */}
                            <div className="grid grid-cols-3 gap-x-6 gap-y-4">
                                {allPermissions.map((permission) => (
                                    <PermissionToggleSwitch
                                        key={permission.id}
                                        role={roleToView}
                                        permission={permission}
                                        setRoleToView={setRoleToView}
                                    />
                                ))}
                            </div>
                        </div>
                        {/* --- FIN SECCIÓN DE PERMISOS EN TRES COLUMNAS --- */}


                        <div className="flex justify-end pt-8 border-t mt-6">
                            {/* SOLO BOTÓN DE CERRAR */}
                            <button
                                type="button"
                                className="px-3 py-1.5 text-sm border rounded bg-gray-100 hover:bg-gray-200"
                                onClick={onClose}
                            >
                                Cerrar
                            </button>
                        </div>
                    </Form>
                </Formik>
            ) : (
                <p className="text-center text-gray-500 py-6">Cargando detalles del rol y permisos...</p>
            )}
        </StandardDrawer>
    )
}

export default RolePermissionsDrawer