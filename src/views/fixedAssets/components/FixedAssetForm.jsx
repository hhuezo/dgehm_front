import React from 'react'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { Select } from 'components/ui'

const validationSchema = Yup.object().shape({
    fa_class_id: Yup.number()
        .required('La clase es obligatoria.')
        .typeError('Debe seleccionar una clase.'),
    description: Yup.string()
        .required('La descripción es obligatoria.')
        .max(255, 'Máximo 255 caracteres.'),
    brand: Yup.string().nullable().max(150, 'Máximo 150 caracteres.'),
    model: Yup.string().nullable().max(150, 'Máximo 150 caracteres.'),
    serial_number: Yup.string().nullable().max(150, 'Máximo 150 caracteres.'),
    location: Yup.string()
        .required('La ubicación es obligatoria.')
        .max(255, 'Máximo 255 caracteres.'),
    policy: Yup.string().nullable().max(150, 'Máximo 150 caracteres.'),
    current_responsible: Yup.string()
        .required('El responsable actual es obligatorio.')
        .max(255, 'Máximo 255 caracteres.'),
    organizational_unit_id: Yup.number()
        .required('La unidad organizativa es obligatoria.')
        .typeError('Debe seleccionar una unidad organizativa.'),
    asset_type: Yup.string()
        .required('El tipo de bien es obligatorio.')
        .max(150, 'Máximo 150 caracteres.'),
    acquisition_date: Yup.date()
        .required('La fecha de adquisición es obligatoria.')
        .typeError('Fecha no válida.'),
    supplier: Yup.string().nullable().max(255, 'Máximo 255 caracteres.'),
    invoice: Yup.string().nullable().max(150, 'Máximo 150 caracteres.'),
    origin_id: Yup.number()
        .required('El origen es obligatorio.')
        .typeError('Debe seleccionar un origen.'),
    physical_condition_id: Yup.number()
        .required('El estado físico es obligatorio.')
        .typeError('Debe seleccionar un estado físico.'),
    additional_description: Yup.string().nullable(),
    measurements: Yup.string().nullable().max(255, 'Máximo 255 caracteres.'),
    observation: Yup.string().nullable(),
    is_insured: Yup.boolean(),
    insured_description: Yup.string().nullable().max(255, 'Máximo 255 caracteres.'),
    purchase_value: Yup.number()
        .required('El valor de compra es obligatorio.')
        .min(0, 'El valor no puede ser negativo.')
        .typeError('Debe ser un número válido.'),
})

const PlainInput = ({ field, invalid, uppercase, type = 'text', ...props }) => {
    const { onChange, ...restField } = field
    const handleChange = (e) => {
        if (uppercase && type === 'text') {
            e.target.value = e.target.value.toUpperCase()
        }
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

const PlainTextarea = ({ field, invalid, rows = 3, ...props }) => (
    <textarea
        {...field}
        {...props}
        rows={rows}
        className={`
            block w-full rounded border 
            ${invalid ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'}
            shadow-sm focus:ring focus:ring-opacity-50 px-3 py-2 text-sm transition duration-150 ease-in-out resize-none
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

const PlainCheckbox = ({ field, label, ...props }) => (
    <label className="flex items-center gap-2 cursor-pointer">
        <input
            {...field}
            {...props}
            type="checkbox"
            checked={field.value}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <span className="text-sm text-gray-700">{label}</span>
    </label>
)

const PlainFormItem = ({ label, invalid, errorMessage, children, required }) => (
    <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {children}
        {invalid && <p className="mt-1 text-sm text-red-600">{errorMessage}</p>}
    </div>
)

const SectionTitle = ({ children }) => (
    <h6 className="text-sm font-semibold text-gray-800 border-b pb-2 mb-4 mt-6 first:mt-0">
        {children}
    </h6>
)

const FixedAssetForm = ({
    initialValues,
    onSubmit,
    onCancel,
    classes = [],
    organizationalUnits = [],
    physicalConditions = [],
    origins = [],
    isEdit = false,
}) => (
    <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
    >
        {({ errors, touched, isSubmitting, values }) => (
            <Form>
                <Field name="id" type="hidden" />

                {/* Código autogenerado (solo lectura en edición) */}
                {isEdit && initialValues?.code && (
                    <>
                        <SectionTitle>Información del registro</SectionTitle>
                        <div className="grid grid-cols-2 gap-4">
                            <PlainFormItem label="Código (autogenerado)">
                                <input
                                    type="text"
                                    value={initialValues.code}
                                    disabled
                                    className="block w-full rounded border border-gray-200 bg-gray-100 shadow-sm h-10 px-3 text-sm text-gray-600 font-mono"
                                />
                            </PlainFormItem>
                            <PlainFormItem label="Correlativo">
                                <input
                                    type="text"
                                    value={initialValues.correlative}
                                    disabled
                                    className="block w-full rounded border border-gray-200 bg-gray-100 shadow-sm h-10 px-3 text-sm text-gray-600"
                                />
                            </PlainFormItem>
                        </div>
                    </>
                )}

                {/* Información básica */}
                <SectionTitle>Información básica</SectionTitle>

                <PlainFormItem
                    label="Clase"
                    invalid={Boolean(errors.fa_class_id && touched.fa_class_id)}
                    errorMessage={errors.fa_class_id}
                    required
                >
                    <Field name="fa_class_id">
                        {({ field, form }) => {
                            const options = classes.map((c) => ({
                                value: c.id,
                                label: `${c.name}${
                                    c.code ? ` (${c.code})` : ''
                                }${c.specific?.name ? ` - ${c.specific.name}` : ''}`,
                            }))

                            const value =
                                values.fa_class_id === '' ||
                                values.fa_class_id == null
                                    ? null
                                    : options.find(
                                          (o) => o.value === values.fa_class_id
                                      ) ?? null

                            return (
                                <Select
                                    options={options}
                                    value={value}
                                    onChange={(option) => {
                                        form.setFieldValue(
                                            field.name,
                                            option?.value ?? null
                                        )
                                    }}
                                    onBlur={() =>
                                        form.setFieldTouched(field.name, true)
                                    }
                                    placeholder="Seleccione una clase"
                                    isClearable
                                    isSearchable
                                    noOptionsMessage={() => 'Sin resultados'}
                                />
                            )
                        }}
                    </Field>
                </PlainFormItem>

                <div className="grid grid-cols-2 gap-4">
                    <PlainFormItem
                        label="Descripción"
                        invalid={Boolean(errors.description && touched.description)}
                        errorMessage={errors.description}
                        required
                    >
                        <Field
                            name="description"
                            component={PlainInput}
                            placeholder="Descripción del activo"
                            invalid={Boolean(errors.description && touched.description)}
                            uppercase
                        />
                    </PlainFormItem>

                    <PlainFormItem
                        label="Tipo de bien"
                        invalid={Boolean(errors.asset_type && touched.asset_type)}
                        errorMessage={errors.asset_type}
                        required
                    >
                        <Field
                            name="asset_type"
                            component={PlainInput}
                            placeholder="Ej: MUEBLE, EQUIPO, VEHÍCULO"
                            invalid={Boolean(errors.asset_type && touched.asset_type)}
                            uppercase
                        />
                    </PlainFormItem>
                </div>

                {/* Características */}
                <SectionTitle>Características</SectionTitle>

                <div className="grid grid-cols-2 gap-4">
                    <PlainFormItem
                        label="Marca"
                        invalid={Boolean(errors.brand && touched.brand)}
                        errorMessage={errors.brand}
                    >
                        <Field
                            name="brand"
                            component={PlainInput}
                            placeholder="Marca del activo"
                            invalid={Boolean(errors.brand && touched.brand)}
                            uppercase
                        />
                    </PlainFormItem>

                    <PlainFormItem
                        label="Modelo"
                        invalid={Boolean(errors.model && touched.model)}
                        errorMessage={errors.model}
                    >
                        <Field
                            name="model"
                            component={PlainInput}
                            placeholder="Modelo"
                            invalid={Boolean(errors.model && touched.model)}
                            uppercase
                        />
                    </PlainFormItem>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <PlainFormItem
                        label="Número de serie"
                        invalid={Boolean(errors.serial_number && touched.serial_number)}
                        errorMessage={errors.serial_number}
                    >
                        <Field
                            name="serial_number"
                            component={PlainInput}
                            placeholder="Número de serie"
                            invalid={Boolean(errors.serial_number && touched.serial_number)}
                            uppercase
                        />
                    </PlainFormItem>

                    <PlainFormItem
                        label="Medidas"
                        invalid={Boolean(errors.measurements && touched.measurements)}
                        errorMessage={errors.measurements}
                    >
                        <Field
                            name="measurements"
                            component={PlainInput}
                            placeholder="Ej: 50x30x20 cm"
                            invalid={Boolean(errors.measurements && touched.measurements)}
                        />
                    </PlainFormItem>
                </div>

                {/* Ubicación y responsable */}
                <SectionTitle>Ubicación y responsable</SectionTitle>

                <PlainFormItem
                    label="Ubicación"
                    invalid={Boolean(errors.location && touched.location)}
                    errorMessage={errors.location}
                    required
                >
                    <Field
                        name="location"
                        component={PlainInput}
                        placeholder="Ubicación física del activo"
                        invalid={Boolean(errors.location && touched.location)}
                        uppercase
                    />
                </PlainFormItem>

                <PlainFormItem
                    label="Responsable actual"
                    invalid={Boolean(errors.current_responsible && touched.current_responsible)}
                    errorMessage={errors.current_responsible}
                    required
                >
                    <Field
                        name="current_responsible"
                        component={PlainInput}
                        placeholder="Nombre del responsable"
                        invalid={Boolean(errors.current_responsible && touched.current_responsible)}
                        uppercase
                    />
                </PlainFormItem>

                <PlainFormItem
                    label="Unidad organizativa"
                    invalid={Boolean(
                        errors.organizational_unit_id &&
                            touched.organizational_unit_id
                    )}
                    errorMessage={errors.organizational_unit_id}
                    required
                >
                    <Field name="organizational_unit_id">
                        {({ field, form }) => {
                            const options = organizationalUnits.map((u) => ({
                                value: u.id,
                                label: `${u.name}${
                                    u.abbreviation ? ` (${u.abbreviation})` : ''
                                }`,
                            }))

                            const value =
                                values.organizational_unit_id === '' ||
                                values.organizational_unit_id == null
                                    ? null
                                    : options.find(
                                          (o) =>
                                              o.value ===
                                              values.organizational_unit_id
                                      ) ?? null

                            return (
                                <Select
                                    options={options}
                                    value={value}
                                    onChange={(option) => {
                                        form.setFieldValue(
                                            field.name,
                                            option?.value ?? null
                                        )
                                    }}
                                    onBlur={() =>
                                        form.setFieldTouched(field.name, true)
                                    }
                                    placeholder="Seleccione una unidad organizativa"
                                    isClearable
                                    isSearchable
                                    noOptionsMessage={() => 'Sin resultados'}
                                />
                            )
                        }}
                    </Field>
                </PlainFormItem>

                {/* Adquisición */}
                <SectionTitle>Adquisición</SectionTitle>

                <div className="grid grid-cols-2 gap-4">
                    <PlainFormItem
                        label="Fecha de adquisición"
                        invalid={Boolean(errors.acquisition_date && touched.acquisition_date)}
                        errorMessage={errors.acquisition_date}
                        required
                    >
                        <Field
                            name="acquisition_date"
                            component={PlainInput}
                            type="date"
                            invalid={Boolean(errors.acquisition_date && touched.acquisition_date)}
                        />
                    </PlainFormItem>

                    <PlainFormItem
                        label="Valor de compra ($)"
                        invalid={Boolean(errors.purchase_value && touched.purchase_value)}
                        errorMessage={errors.purchase_value}
                        required
                    >
                        <Field
                            name="purchase_value"
                            component={PlainInput}
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            invalid={Boolean(errors.purchase_value && touched.purchase_value)}
                        />
                    </PlainFormItem>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <PlainFormItem
                        label="Proveedor"
                        invalid={Boolean(errors.supplier && touched.supplier)}
                        errorMessage={errors.supplier}
                    >
                        <Field
                            name="supplier"
                            component={PlainInput}
                            placeholder="Nombre del proveedor"
                            invalid={Boolean(errors.supplier && touched.supplier)}
                            uppercase
                        />
                    </PlainFormItem>

                    <PlainFormItem
                        label="Factura"
                        invalid={Boolean(errors.invoice && touched.invoice)}
                        errorMessage={errors.invoice}
                    >
                        <Field
                            name="invoice"
                            component={PlainInput}
                            placeholder="Número de factura"
                            invalid={Boolean(errors.invoice && touched.invoice)}
                            uppercase
                        />
                    </PlainFormItem>
                </div>

                <PlainFormItem
                    label="Póliza"
                    invalid={Boolean(errors.policy && touched.policy)}
                    errorMessage={errors.policy}
                >
                    <Field
                        name="policy"
                        component={PlainInput}
                        placeholder="Número de póliza"
                        invalid={Boolean(errors.policy && touched.policy)}
                        uppercase
                    />
                </PlainFormItem>

                <PlainFormItem
                    label="Origen"
                    invalid={Boolean(errors.origin_id && touched.origin_id)}
                    errorMessage={errors.origin_id}
                    required
                >
                    <Field
                        name="origin_id"
                        component={PlainSelect}
                        invalid={Boolean(errors.origin_id && touched.origin_id)}
                    >
                        <option value="">Seleccione un origen</option>
                        {origins.map((o) => (
                            <option key={o.id} value={o.id}>
                                {o.name}
                            </option>
                        ))}
                    </Field>
                </PlainFormItem>

                {/* Estado */}
                <SectionTitle>Estado</SectionTitle>

                <PlainFormItem
                    label="Estado físico"
                    invalid={Boolean(errors.physical_condition_id && touched.physical_condition_id)}
                    errorMessage={errors.physical_condition_id}
                    required
                >
                    <Field
                        name="physical_condition_id"
                        component={PlainSelect}
                        invalid={Boolean(errors.physical_condition_id && touched.physical_condition_id)}
                    >
                        <option value="">Seleccione un estado físico</option>
                        {physicalConditions.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.name}
                            </option>
                        ))}
                    </Field>
                </PlainFormItem>

                <PlainFormItem
                    label="Descripción adicional"
                    invalid={Boolean(errors.additional_description && touched.additional_description)}
                    errorMessage={errors.additional_description}
                >
                    <Field
                        name="additional_description"
                        component={PlainTextarea}
                        placeholder="Información adicional del activo"
                        invalid={Boolean(errors.additional_description && touched.additional_description)}
                        rows={2}
                    />
                </PlainFormItem>

                <PlainFormItem
                    label="Observación"
                    invalid={Boolean(errors.observation && touched.observation)}
                    errorMessage={errors.observation}
                >
                    <Field
                        name="observation"
                        component={PlainTextarea}
                        placeholder="Observaciones generales"
                        invalid={Boolean(errors.observation && touched.observation)}
                        rows={2}
                    />
                </PlainFormItem>

                {/* Seguro */}
                <SectionTitle>Seguro</SectionTitle>

                <div className="mb-4">
                    <Field name="is_insured" component={PlainCheckbox} label="¿Está asegurado?" />
                </div>

                {values.is_insured && (
                    <PlainFormItem
                        label="Descripción del seguro"
                        invalid={Boolean(errors.insured_description && touched.insured_description)}
                        errorMessage={errors.insured_description}
                    >
                        <Field
                            name="insured_description"
                            component={PlainInput}
                            placeholder="Detalles del seguro"
                            invalid={Boolean(errors.insured_description && touched.insured_description)}
                        />
                    </PlainFormItem>
                )}

                {/* Botones */}
                <div className="flex justify-end gap-2 pt-6 mt-6 border-t">
                    <button
                        type="button"
                        className="px-4 py-2 text-sm border rounded hover:bg-gray-50"
                        onClick={onCancel}
                        disabled={isSubmitting}
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60"
                    >
                        {initialValues?.id ? 'Guardar cambios' : 'Guardar'}
                    </button>
                </div>
            </Form>
        )}
    </Formik>
)

export default FixedAssetForm
