import React from 'react'
import StandardDrawer from 'components/ui/Drawer/Drawer'
import { Formik, Form, Field } from 'formik'
import PermissionToggleSwitch from './PermissionToggleSwitch'
import { PlainInput, PlainFormItem } from './RoleForm'

const SECTION_LABELS = {
    security: 'Seguridad',
    warehouse: 'Almacén / Inventario',
    fixedasset: 'Activo fijo',
}

const SECTION_ORDER = ['security', 'warehouse', 'fixedasset']

/** Normaliza la clave que viene del API (ej. "Security", "Warehouse") a la clave interna (lowercase). */
const normalizeSectionKey = (apiKey) => {
    if (!apiKey || typeof apiKey !== 'string') return ''
    const lower = apiKey.toLowerCase().trim()
    if (lower === 'security') return 'security'
    if (lower === 'warehouse') return 'warehouse'
    if (lower === 'fixed asset' || lower === 'fixedasset') return 'fixedasset'
    return lower.replace(/\s+/g, '')
}

const getSectionLabel = (sectionKey) => {
    const key = normalizeSectionKey(sectionKey)
    return SECTION_LABELS[key] || sectionKey
}

const RolePermissionsDrawer = ({ isOpen, onClose, roleToView, setRoleToView, allPermissions }) => {
    // Backend puede enviar all_permissions_by_section (todos los permisos por sección) o permissions_by_section (solo los del rol)
    const permissionsBySection =
        roleToView?.all_permissions_by_section ?? roleToView?.permissions_by_section

    const hasGroupedPermissions =
        permissionsBySection &&
        typeof permissionsBySection === 'object' &&
        Object.keys(permissionsBySection).length > 0

    const sectionEntries = hasGroupedPermissions
        ? Object.entries(permissionsBySection)
              .filter(([_, perms]) => Array.isArray(perms))
              .sort(([keyA], [keyB]) => {
                  const a = normalizeSectionKey(keyA)
                  const b = normalizeSectionKey(keyB)
                  const i = SECTION_ORDER.indexOf(a)
                  const j = SECTION_ORDER.indexOf(b)
                  if (i === -1 && j === -1) return (keyA || '').localeCompare(keyB || '')
                  if (i === -1) return 1
                  if (j === -1) return -1
                  return i - j
              })
        : []

    const hasContent =
        roleToView &&
        (hasGroupedPermissions ? sectionEntries.some(([, perms]) => perms.length > 0) : allPermissions?.length > 0)

    return (
        <StandardDrawer isOpen={isOpen} onClose={onClose} closable={false}>
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

            {hasContent ? (
                <Formik
                    initialValues={{ id: roleToView.id, name: roleToView.name || '' }}
                    onSubmit={() => {}}
                >
                    <Form>
                        <Field name="id" type="hidden" />
                        <PlainFormItem label="Nombre del rol">
                            <Field name="name" component={PlainInput} disabled />
                        </PlainFormItem>

                        <div className="mt-6">
                            <h6 className="font-semibold text-lg border-b pb-2 mb-4">Permisos</h6>

                            {hasGroupedPermissions ? (
                                <div className="space-y-6">
                                    {sectionEntries.map(([sectionKey, permissions]) => (
                                        <div
                                            key={sectionKey}
                                            className="rounded-lg border border-gray-200 bg-gray-50/50 p-4"
                                        >
                                            <div className="block font-medium text-base text-gray-800 mb-3">
                                                {getSectionLabel(sectionKey)}
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3">
                                                {permissions.map((permission) => (
                                                    <PermissionToggleSwitch
                                                        key={permission.id}
                                                        role={roleToView}
                                                        permission={permission}
                                                        setRoleToView={setRoleToView}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
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
                            )}
                        </div>

                        <div className="flex justify-end pt-8 border-t mt-6">
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
                <p className="text-center text-gray-500 py-6">
                    {roleToView ? 'Cargando permisos...' : 'Cargando detalles del rol y permisos...'}
                </p>
            )}
        </StandardDrawer>
    )
}

export default RolePermissionsDrawer