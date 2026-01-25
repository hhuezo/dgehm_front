import React from 'react'
import Drawer from 'components/ui/Drawer/DrawerOld'
import OrganizationalUnitForm from './OrganizationalUnitForm'

const OrganizationalUnitDrawer = ({
    isOpen,
    onClose,
    onSubmit,
    initialValues,
    isEdit,
    types,
    units,
    editingId,
}) => {
    const title = isEdit ? 'Editar unidad organizativa' : 'Nueva unidad organizativa'

    const handleCancel = () => {
        onClose()
    }

    const defaults = {
        id: null,
        name: '',
        abbreviation: '',
        code: '',
        fa_organizational_unit_type_id: '',
        fa_organizational_unit_id: '',
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
                <OrganizationalUnitForm
                    initialValues={initialValues || defaults}
                    onSubmit={onSubmit}
                    onCancel={handleCancel}
                    types={types}
                    units={units}
                    editingId={editingId}
                />
            )}
        </Drawer>
    )
}

export default OrganizationalUnitDrawer
