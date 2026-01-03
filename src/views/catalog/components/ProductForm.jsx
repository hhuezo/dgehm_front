import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { apiGetMeasures } from 'services/MeasureService'

const validationSchema = Yup.object().shape({
    name: Yup.string().required('El nombre del producto es obligatorio'),
    accounting_account_id: Yup.number()
        .required('Debe seleccionar una cuenta contable')
        .typeError('Debe seleccionar una cuenta contable'),
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

const PlainSelect = ({ field, invalid, children, ...props }) => (
    <select
        {...field}
        {...props}
        className={`
            block w-full rounded border 
            ${invalid ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'}
            shadow-sm focus:ring focus:ring-opacity-50 h-10 px-3 text-sm transition duration-150 ease-in-out
        `}
    >
        {children}
    </select>
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


const ProductForm = ({ initialValues, onSubmit, onCancel, accountingAccounts }) => {
    const [measures, setMeasures] = useState([])

    useEffect(() => {
        const fetchMeasures = async () => {
            try {
                const res = await apiGetMeasures()
                if (res.data.success) {
                    setMeasures(res.data.data)
                }
            } catch (error) {
                console.error('Error al cargar medidas:', error)
            }
        }
        fetchMeasures()
    }, [])

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
                        label="Nombre del producto"
                        invalid={Boolean(errors.name && touched.name)}
                        errorMessage={errors.name}
                    >
                        <Field
                            name="name"
                            component={PlainInput}
                            placeholder="Ej: Papel A4"
                            invalid={Boolean(errors.name && touched.name)}
                        />
                    </PlainFormItem>

                    <PlainFormItem
                        label="Cuenta contable"
                        invalid={Boolean(errors.accounting_account_id && touched.accounting_account_id)}
                        errorMessage={errors.accounting_account_id}
                    >
                        <Field
                            name="accounting_account_id"
                            component={PlainSelect}
                            required
                            invalid={Boolean(errors.accounting_account_id && touched.accounting_account_id)}
                        >
                            <option value="">Seleccione una cuenta contable</option>
                            {accountingAccounts.map((account) => (
                                <option key={account.id} value={account.id}>
                                    {account.code} - {account.name}
                                </option>
                            ))}
                        </Field>
                    </PlainFormItem>

                    <PlainFormItem
                        label="Unidad de medida"
                        invalid={Boolean(errors.measure_id && touched.measure_id)}
                        errorMessage={errors.measure_id}
                    >
                        <Field
                            name="measure_id"
                            
                            component={PlainSelect}
                            invalid={Boolean(errors.measure_id && touched.measure_id)}
                        >
                            
                            <option value="">Seleccione una unidad de medida (opcional)</option>
                            {measures.map((measure) => (
                                <option key={measure.id} value={measure.id}>
                                    {measure.name}
                                </option>
                            ))}
                            
                        </Field>
                        
                    </PlainFormItem>

                    <PlainFormItem
                        label="Descripción"
                        invalid={Boolean(errors.description && touched.description)}
                        errorMessage={errors.description}
                    >
                        <Field
                            name="description"
                            component={PlainTextarea}
                            placeholder="Ej: Descripción del producto (opcional)"
                            invalid={Boolean(errors.description && touched.description)}
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

export default ProductForm;

