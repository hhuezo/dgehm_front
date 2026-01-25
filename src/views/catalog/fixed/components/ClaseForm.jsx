import React from 'react'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'

const validationSchema = Yup.object().shape({
    name: Yup.string().required('El nombre es obligatorio.'),
    code: Yup.string().required('El código es obligatorio.'),
    useful_life: Yup.number()
        .nullable()
        .transform((v) => (v === '' || v == null ? null : v))
        .integer('La vida útil debe ser un número entero.')
        .min(0, 'La vida útil no puede ser negativa.'),
    fa_specific_id: Yup.number()
        .required('El específico es obligatorio.')
        .typeError('Debe seleccionar un específico.'),
})

const PlainInput = ({ field, invalid, uppercase, type = 'text', ...props }) => {
    const { onChange, ...restField } = field
    const handleChange = (e) => {
        if (uppercase) e.target.value = e.target.value.toUpperCase()
        onChange(e)
    }
    return (
        <input
            {...restField}
            {...props}
            onChange={handleChange}
            type={type}
            className={`
                block w-full rounded border 
                ${invalid ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'}
                shadow-sm focus:ring focus:ring-opacity-50 h-10 px-3 text-sm transition duration-150 ease-in-out
            `}
        />
    )
}

const PlainFormItem = ({ label, invalid, errorMessage, children }) => (
    <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        {children}
        {invalid && <p className="mt-1 text-sm text-red-600">{errorMessage}</p>}
    </div>
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

const ClaseForm = ({ initialValues, onSubmit, onCancel, specifics = [] }) => (
    <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
    >
        {({ errors, touched, isSubmitting }) => (
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
                        placeholder="Ej: EQUIPO DE CÓMPUTO"
                        invalid={Boolean(errors.name && touched.name)}
                        uppercase
                    />
                </PlainFormItem>

                <PlainFormItem
                    label="Código"
                    invalid={Boolean(errors.code && touched.code)}
                    errorMessage={errors.code}
                >
                    <Field
                        name="code"
                        component={PlainInput}
                        placeholder="Ej: CLS-001"
                        invalid={Boolean(errors.code && touched.code)}
                        uppercase
                    />
                </PlainFormItem>

                <PlainFormItem
                    label="Específico"
                    invalid={Boolean(errors.fa_specific_id && touched.fa_specific_id)}
                    errorMessage={errors.fa_specific_id}
                >
                    <Field
                        name="fa_specific_id"
                        component={PlainSelect}
                        required
                        invalid={Boolean(errors.fa_specific_id && touched.fa_specific_id)}
                    >
                        <option value="">Seleccione un específico</option>
                        {specifics.map((s) => (
                            <option key={s.id} value={s.id}>
                                {s.name} {s.code ? `(${s.code})` : ''}
                            </option>
                        ))}
                    </Field>
                </PlainFormItem>

                <PlainFormItem
                    label="Vida útil (años, opcional)"
                    invalid={Boolean(errors.useful_life && touched.useful_life)}
                    errorMessage={errors.useful_life}
                >
                    <Field
                        name="useful_life"
                        component={PlainInput}
                        type="number"
                        min={0}
                        step={1}
                        placeholder="Ej: 5"
                        invalid={Boolean(errors.useful_life && touched.useful_life)}
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
                        {initialValues?.id ? 'Guardar cambios' : 'Guardar'}
                    </button>
                </div>
            </Form>
        )}
    </Formik>
)

export default ClaseForm
