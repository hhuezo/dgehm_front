import React from 'react'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'

const validationSchema = Yup.object().shape({
    name: Yup.string().required('El nombre es obligatorio'),
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

const FixedCatalogForm = ({
    initialValues,
    onSubmit,
    onCancel,
    label = 'Nombre',
    placeholder = 'Ej: Nombre del registro',
}) => (
    <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
    >
        {({ errors, touched, isSubmitting }) => (
            <Form>
                <Field name="id" type="hidden" />
                <PlainFormItem
                    label={label}
                    invalid={Boolean(errors.name && touched.name)}
                    errorMessage={errors.name}
                >
                    <Field
                        name="name"
                        component={PlainInput}
                        placeholder={placeholder}
                        invalid={Boolean(errors.name && touched.name)}
                    />
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

export default FixedCatalogForm
