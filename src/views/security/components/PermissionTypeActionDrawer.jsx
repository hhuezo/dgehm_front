import React from 'react'
import Drawer from 'components/ui/Drawer/DrawerOld'
import PermissionTypeForm from './PermissionTypeForm'

const PermissionTypeActionDrawer = ({
    isOpen,
    onClose,
    onSubmit,
    initialValues,
    isEdit,
}) => {
    const title = isEdit ? 'Editar tipo de permiso' : 'Nuevo tipo de permiso'

    const handleCancel = () => {
        onClose()
    }

    return (
        <Drawer isOpen={isOpen} onClose={onClose} closable={false}>
            <div className="flex items-center justify-between mb-4 border-b pb-3">
                <h5 className="font-semibold text-xl">{title}</h5>
                <button
                    type="button"
                    className="px-2 py-1 text-sm text-gray-500 hover:text-gray-700 rounded"
                    onClick={onClose}
                >
                    X
                </button>
            </div>

            {(initialValues || !isEdit) && (
                <PermissionTypeForm
                    initialValues={initialValues}
                    onSubmit={onSubmit}
                    onCancel={handleCancel}
                />
            )}
        </Drawer>
    )
}

export default PermissionTypeActionDrawer
