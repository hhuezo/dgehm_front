import React from 'react'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'

// Componente sustituto para Input (Input nativo)
// EXPORTACIÓN NOMBRADA AÑADIDA
export const PlainInput = ({ field, invalid, disabled, ...props }) => (
    <input
        {...field}
        {...props}
        type="text"
        disabled={disabled}
        className={`
            block w-full rounded border 
            ${invalid ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'}
            shadow-sm focus:ring focus:ring-opacity-50 h-10 px-3 text-sm transition duration-150 ease-in-out
            ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''} 
        `}
    />
)

// Componente sustituto para FormItem (Divs nativos)
// EXPORTACIÓN NOMBRADA AÑADIDA
export const PlainFormItem = ({ label, invalid, errorMessage, children }) => (
    <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        {children}
        {invalid && <p className="mt-1 text-sm text-red-600">{errorMessage}</p>}
    </div>
)

// Validación (No necesita exportación si solo se usa internamente)
const validationSchema = Yup.object().shape({
    name: Yup.string().required('El nombre del rol es obligatorio'),
})


const RoleForm = ({ mode, selectedRole, onSubmit, onClose }) => {
    const isEdit = mode === 'edit';
    const initialValues = isEdit
        ? { id: selectedRole.id, name: selectedRole.name || '' }
        : { name: '' };

    const title = isEdit ? 'Editar Rol' : 'Nuevo Rol';

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
        >
            {({ errors, touched, isSubmitting }) => (
                <Form>
                    {/* Header para el Drawer */}
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

                    {isEdit && <Field name="id" type="hidden" />}

                    {/* Campo Nombre */}
                    <PlainFormItem
                        label="Nombre del rol"
                        invalid={Boolean(errors.name && touched.name)}
                        errorMessage={errors.name}
                    >
                        <Field
                            name="name"
                            component={PlainInput}
                            placeholder={isEdit ? 'Ej: editor' : 'Ej: admin'}
                            invalid={Boolean(errors.name && touched.name)}
                        />
                    </PlainFormItem>

                    <div className="flex justify-end gap-2 pt-4">
                        <button
                            type="button"
                            className="px-3 py-1.5 text-sm border rounded"
                            onClick={onClose}
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60"
                        >
                            {isEdit ? 'Guardar Cambios' : 'Guardar'}
                        </button>
                    </div>
                </Form>
            )}
        </Formik>
    )
}

// EXPORTACIÓN POR DEFECTO MANTENIDA
export default RoleForm