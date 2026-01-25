import React from 'react'
import Drawer from 'components/ui/Drawer/DrawerOld'
import InstitutionForm from './InstitutionForm'

const InstitutionDrawer = ({ isOpen, onClose, onSubmit, initialValues, isEdit }) => {
    const title = isEdit ? 'Editar institución' : 'Nueva institución'

    const handleCancel = () => {
        onClose()
    }

    const defaults = {
        id: null,
        name: '',
        code: '',
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
                <InstitutionForm
                    initialValues={initialValues || defaults}
                    onSubmit={onSubmit}
                    onCancel={handleCancel}
                />
            )}
        </Drawer>
    )
}

export default InstitutionDrawer
