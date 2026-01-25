import React from 'react'
import Drawer from 'components/ui/Drawer/DrawerOld'
import FixedCatalogForm from './FixedCatalogForm'

const FixedCatalogDrawer = ({
    isOpen,
    onClose,
    onSubmit,
    initialValues,
    isEdit,
    titleCreate = 'Nuevo registro',
    titleEdit = 'Editar registro',
    formLabel = 'Nombre',
    formPlaceholder = 'Ej: Nombre del registro',
}) => {
    const title = isEdit ? titleEdit : titleCreate

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
                <FixedCatalogForm
                    initialValues={initialValues || { id: null, name: '' }}
                    onSubmit={onSubmit}
                    onCancel={handleCancel}
                    label={formLabel}
                    placeholder={formPlaceholder}
                />
            )}
        </Drawer>
    )
}

export default FixedCatalogDrawer
