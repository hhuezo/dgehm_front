import React from 'react'
import Drawer from 'components/ui/Drawer/DrawerOld'
import FixedAssetForm from './FixedAssetForm'

const FixedAssetDrawer = ({
    isOpen,
    onClose,
    onSubmit,
    initialValues,
    isEdit,
    classes = [],
    organizationalUnits = [],
    physicalConditions = [],
    origins = [],
}) => {
    const title = isEdit ? 'Editar activo fijo' : 'Nuevo activo fijo'

    const handleCancel = () => {
        onClose()
    }

    const defaults = {
        id: null,
        fa_class_id: '',
        code: '',
        correlative: '',
        description: '',
        brand: '',
        model: '',
        serial_number: '',
        location: '',
        policy: '',
        current_responsible: '',
        organizational_unit_id: '',
        asset_type: '',
        acquisition_date: '',
        supplier: '',
        invoice: '',
        origin_id: '',
        physical_condition_id: '',
        additional_description: '',
        measurements: '',
        observation: '',
        is_insured: false,
        insured_description: '',
        purchase_value: '',
    }

    return (
        <Drawer
            isOpen={isOpen}
            onClose={onClose}
            closable={false}
            width="50vw"
            bodyClass="p-0"
        >
            <div className="flex flex-col h-full">
                <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50">
                    <h5 className="font-semibold text-xl">{title}</h5>
                    <button
                        type="button"
                        className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded transition-colors"
                        onClick={onClose}
                    >
                        ✕
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto px-6 py-4">
                    {(initialValues || !isEdit) && (
                        <FixedAssetForm
                            initialValues={initialValues || defaults}
                            onSubmit={onSubmit}
                            onCancel={handleCancel}
                            classes={classes}
                            organizationalUnits={organizationalUnits}
                            physicalConditions={physicalConditions}
                            origins={origins}
                            isEdit={isEdit}
                        />
                    )}
                </div>
            </div>
        </Drawer>
    )
}

export default FixedAssetDrawer
