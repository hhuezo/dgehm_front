import React from 'react'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { Select } from 'components/ui'

const validationSchema = Yup.object().shape({
    name: Yup.string().required('El nombre es obligatorio.'),
    abbreviation: Yup.string().nullable(),
    code: Yup.string().max(32, 'El código no puede superar 32 caracteres.').nullable(),
    fa_organizational_unit_type_id: Yup.number()
        .required('El tipo de unidad organizativa es obligatorio.')
        .typeError('Debe seleccionar un tipo.'),
    fa_organizational_unit_id: Yup.number().nullable().transform((v) => (v === '' ? null : v)),
})

const PlainInput = ({ field, invalid, uppercase, ...props }) => {
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
            type="text"
            className={`
                block w-full rounded border 
                ${invalid ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'}
                shadow-sm focus:ring focus:ring-opacity-50 h-10 px-3 text-sm transition duration-150 ease-in-out
            `}
        />
    )
}

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

const PlainFormItem = ({ label, invalid, errorMessage, children }) => (
    <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        {children}
        {invalid && <p className="mt-1 text-sm text-red-600">{errorMessage}</p>}
    </div>
)

const OrganizationalUnitForm = ({
    initialValues,
    onSubmit,
    onCancel,
    types = [],
    units = [],
    editingId,
}) => {
    const parentOptions = editingId
        ? units.filter((u) => Number(u.id) !== Number(editingId))
        : units

    const parentSelectOptions = parentOptions.map((u) => ({
        value: u.id,
        label: u.abbreviation ? `${u.name} (${u.abbreviation})` : u.name,
    }))

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
        >
            {({ errors, touched, isSubmitting, values, setFieldValue }) => (
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
                            placeholder="Ej: Dirección General"
                            invalid={Boolean(errors.name && touched.name)}
                            uppercase
                        />
                    </PlainFormItem>

                    <PlainFormItem
                        label="Abreviación (opcional)"
                        invalid={Boolean(errors.abbreviation && touched.abbreviation)}
                        errorMessage={errors.abbreviation}
                    >
                        <Field
                            name="abbreviation"
                            component={PlainInput}
                            placeholder="Ej: DG"
                            invalid={Boolean(errors.abbreviation && touched.abbreviation)}
                            uppercase
                        />
                    </PlainFormItem>

                    <PlainFormItem
                        label="Código (opcional, máx. 32 caracteres)"
                        invalid={Boolean(errors.code && touched.code)}
                        errorMessage={errors.code}
                    >
                        <Field
                            name="code"
                            component={PlainInput}
                            placeholder="Ej: UO-001"
                            maxLength={32}
                            invalid={Boolean(errors.code && touched.code)}
                            uppercase
                        />
                    </PlainFormItem>

                    <PlainFormItem
                        label="Tipo de unidad organizativa"
                        invalid={Boolean(errors.fa_organizational_unit_type_id && touched.fa_organizational_unit_type_id)}
                        errorMessage={errors.fa_organizational_unit_type_id}
                    >
                        <Field
                            name="fa_organizational_unit_type_id"
                            component={PlainSelect}
                            required
                            invalid={Boolean(errors.fa_organizational_unit_type_id && touched.fa_organizational_unit_type_id)}
                        >
                            <option value="">Seleccione un tipo</option>
                            {types.map((t) => (
                                <option key={t.id} value={t.id}>
                                    {t.name}
                                </option>
                            ))}
                        </Field>
                    </PlainFormItem>

                    <PlainFormItem
                        label="Unidad organizativa padre (opcional)"
                        invalid={Boolean(errors.fa_organizational_unit_id && touched.fa_organizational_unit_id)}
                        errorMessage={errors.fa_organizational_unit_id}
                    >
                        <Field name="fa_organizational_unit_id">
                            {({ field }) => (
                                <Select
                                    options={parentSelectOptions}
                                    value={
                                        values.fa_organizational_unit_id === '' ||
                                        values.fa_organizational_unit_id == null
                                            ? null
                                            : parentSelectOptions.find(
                                                  (o) => o.value === values.fa_organizational_unit_id
                                              ) ?? null
                                    }
                                    onChange={(option) => {
                                        setFieldValue(
                                            field.name,
                                            option?.value ?? null
                                        )
                                    }}
                                    onBlur={field.onBlur}
                                    placeholder="Seleccione unidad padre (opcional)"
                                    isClearable
                                    isSearchable
                                    noOptionsMessage={() => 'Sin resultados'}
                                />
                            )}
                        </Field>
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
}

export default OrganizationalUnitForm
