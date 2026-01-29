import React from 'react'
import Drawer from 'components/ui/Drawer/DrawerOld'
import ClaseForm from './ClaseForm'

const ClaseDrawer = ({ isOpen, onClose, onSubmit, initialValues, isEdit, specifics = [] }) => {
    const title = isEdit ? 'Editar clase' : 'Nueva clase'

    const handleCancel = () => {
        onClose()
    }

    const defaults = {
        id: null,
        name: '',
        code: '',
        useful_life: '',
        fa_specific_id: '',
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
                <ClaseForm
                    initialValues={initialValues || defaults}
                    onSubmit={onSubmit}
                    onCancel={handleCancel}
                    specifics={specifics}
                />
            )}
        </Drawer>
    )
}

export default ClaseDrawer
