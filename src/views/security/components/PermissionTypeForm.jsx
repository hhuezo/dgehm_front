import React from 'react'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'

const validationSchema = Yup.object().shape({
    name: Yup.string()
        .required('El nombre del tipo de permiso es obligatorio')
        .max(100, 'Máximo 100 caracteres'),
})

const PlainInput = ({ field, invalid, ...props }) => (
    <input
        {...field}
        {...props}
        type="text"
        className={`
            block w-full rounded border 
            ${invalid ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'}
            shadow-sm focus:ring focus:ring-opacity-50 h-10 px-3 text-sm transition duration-150 ease-in-out
        `}
    />
)

const PlainFormItem = ({ label, invalid, errorMessage, children }) => (
    <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        {children}
        {invalid && <p className="mt-1 text-sm text-red-600">{errorMessage}</p>}
    </div>
)

const PermissionTypeForm = ({ initialValues, onSubmit, onCancel }) => {
    const defaultInitial = {
        id: null,
        name: '',
        is_active: true,
        ...initialValues,
    }
    return (
        <Formik
            initialValues={defaultInitial}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
        >
            {({ errors, touched, isSubmitting, setFieldValue, values }) => (
                <Form>
                    <Field name="id" type="hidden" />

                    <PlainFormItem
                        label="Nombre"
                        invalid={Boolean(errors.name && touched.name)}
                        errorMessage={errors.name}
                    >
                        <Field
                            name="name"
                            component={PlainInput}
                            placeholder="Ej: Security"
                            invalid={Boolean(errors.name && touched.name)}
                        />
                    </PlainFormItem>

                    <PlainFormItem
                        label="Activo"
                        invalid={false}
                        errorMessage=""
                    >
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={!!values.is_active}
                                onChange={(e) => setFieldValue('is_active', e.target.checked)}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">Tipo de permiso activo</span>
                        </label>
                    </PlainFormItem>

                    <div className="flex justify-end gap-2 pt-4">
                        <button
                            type="button"
                            className="px-3 py-1.5 text-sm border rounded"
                            onClick={onCancel}
                            disabled={isSubmitting}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60"
                        >
                            {initialValues?.id ? 'Guardar Cambios' : 'Guardar'}
                        </button>
                    </div>
                </Form>
            )}
        </Formik>
    )
}

export default PermissionTypeForm
