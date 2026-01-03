import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'


const validationSchema = Yup.object().shape({
    name: Yup.string().required('El nombre del proveedor es obligatorio'),
    contact_person: Yup.string().required('El contacto es obligatorio'),
    phone: Yup.string().required('El teléfono es obligatorio'),
    email: Yup.string().email('El correo no es válido').nullable(),
    address: Yup.string().nullable(),
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

const PlainTextarea = ({ field, invalid, ...props }) => (
    <textarea
        {...field}
        {...props}
        rows={3}
        className={`
            block w-full rounded border 
            ${invalid ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'}
            shadow-sm focus:ring focus:ring-opacity-50 px-3 py-2 text-sm transition duration-150 ease-in-out
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


const SupplierForm = ({ initialValues, onSubmit, onCancel }) => {
    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
        >
            {({ errors, touched, isSubmitting }) => (
                <Form>
                    <Field name="id" type="hidden" />

                    <PlainFormItem
                        label="Nombre del proveedor"
                        invalid={Boolean(errors.name && touched.name)}
                        errorMessage={errors.name}
                    >
                        <Field
                            name="name"
                            component={PlainInput}
                            placeholder="Ej: Proveedor ABC S.A."
                            invalid={Boolean(errors.name && touched.name)}
                        />
                    </PlainFormItem>

                    <PlainFormItem
                        label="Persona de contacto"
                        invalid={Boolean(errors.contact_person && touched.contact_person)}
                        errorMessage={errors.contact_person}
                    >
                        <Field
                            name="contact_person"
                            component={PlainInput}
                            placeholder="Ej: Juan Pérez"
                            invalid={Boolean(errors.contact_person && touched.contact_person)}
                        />
                    </PlainFormItem>

                    <PlainFormItem
                        label="Teléfono"
                        invalid={Boolean(errors.phone && touched.phone)}
                        errorMessage={errors.phone}
                    >
                        <Field
                            name="phone"
                            component={PlainInput}
                            pattern="^[0-9]{4}-[0-9]{4}$"
                            minLength={9}
                            maxLength={9}
                            format="0000-0000"
                            placeholder="Ej: 2222-3333"
                            invalid={Boolean(errors.phone && touched.phone)}
                        />
                    </PlainFormItem>

                    <PlainFormItem
                        label="Email"
                        invalid={Boolean(errors.email && touched.email)}
                        errorMessage={errors.email}
                    >
                        <Field
                            name="email"
                            type="email"
                            component={PlainInput}
                            placeholder="Ej: contacto@proveedor.com"
                            invalid={Boolean(errors.email && touched.email)}
                        />
                    </PlainFormItem>

                    <PlainFormItem
                        label="Dirección"
                        invalid={Boolean(errors.address && touched.address)}
                        errorMessage={errors.address}
                    >
                        <Field
                            name="address"
                            component={PlainTextarea}
                            placeholder="Ej: Calle Principal #123, Ciudad"
                            invalid={Boolean(errors.address && touched.address)}
                        />
                    </PlainFormItem>

                    <div className="flex justify-end gap-2 pt-4">
                        {/* Botón de Cancelación */}
                        <button
                            type="button"
                            className="px-3 py-1.5 text-sm border rounded"
                            onClick={onCancel}
                            disabled={isSubmitting}
                        >
                            Cancelar
                        </button>

                        {/* Botón de Submit (Guardar/Guardar Cambios) */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60"
                        >
                            {/* Cambiamos el texto basado en si hay ID (edición) */}
                            {initialValues.id ? 'Guardar Cambios' : 'Guardar'}
                        </button>
                    </div>

                </Form>
            )}
        </Formik>
    );
};

export default SupplierForm;

