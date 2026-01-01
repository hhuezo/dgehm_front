// PurchaseOrderForm.jsx

import React from 'react'
import { Formik, Form, Field } from 'formik'

import {
    PlainInput,
    PlainSelect,
    PlainFormItem,
} from './PurchaseOrderUtils'

const combineDateTime = (date, time) => {
    if (!date) return '';

    let finalTime = time || '00:00';

    if (finalTime.length === 5) {
        finalTime += ':00';
    } else if (finalTime.length === 0) {
        finalTime = '00:00:00';
    }

    return `${date} ${finalTime}`;
};


const PurchaseOrderForm = ({
    initialValues,
    validationSchema,
    onSubmit,
    onClose,
    disabled = false,
    showOnly = false,
    suppliers,
    administrativeTechnicians
}) => {

    const handleSubmission = (values, actions) => {
        const processedValues = {
            ...values,
            acta_date: combineDateTime(values.acta_date, values.acta_time),
            reception_date: combineDateTime(values.reception_date, values.reception_date_only),
            invoice_date: combineDateTime(values.invoice_date, '00:00'),
            total_amount: parseFloat(values.total_amount),
            administrative_technician: (() => {
                const techId = parseInt(values.administrative_technician_id, 10);
                const tech = administrativeTechnicians?.find(t => t.id === techId);
                return tech ? `${tech.name} ${tech.lastname}` : '';
            })(),
        };

        delete processedValues.acta_time;
        delete processedValues.reception_date_only;


        onSubmit(processedValues, actions);
    };

    const nativeInputClass = (name, errors, touched) => {
        const isInvalid = Boolean(errors[name] && touched[name]);
        const disabledClass = disabled ? 'bg-gray-100 cursor-not-allowed' : '';

        return `
            block w-full rounded border 
            ${isInvalid ? 'border-red-500' : 'border-gray-300'}
            h-10 px-3 text-sm transition duration-150 ease-in-out
            ${disabledClass}
        `;
    };

    if (!initialValues) {
        return <div>Cargando formulario...</div>;
    }


    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmission}
            enableReinitialize
        >
            {({ errors, touched, isSubmitting: formIsSubmitting, values }) => (
                <Form>
                    <div className="grid grid-cols-2 gap-x-6">
                        {/* ======================= COLUMNA 1 ======================= */}
                        <div>
                            <Field name="id" type="hidden" />

                            <PlainFormItem label="Proveedor" invalid={Boolean(errors.supplier_id && touched.supplier_id)} errorMessage={errors.supplier_id}>
                                <Field name="supplier_id" component={PlainSelect} invalid={Boolean(errors.supplier_id && touched.supplier_id)} disabled={disabled}>
                                    <option value="">Seleccione proveedor</option>
                                    {suppliers.map(s => (<option key={s.id} value={s.id}>{s.name}</option>))}
                                </Field>
                            </PlainFormItem>

                            <PlainFormItem label="Número de Orden" invalid={Boolean(errors.order_number && touched.order_number)} errorMessage={errors.order_number}>
                                <Field name="order_number" component={PlainInput} disabled={disabled} />
                            </PlainFormItem>

                            <PlainFormItem label="Número de Factura" invalid={Boolean(errors.invoice_number && touched.invoice_number)} errorMessage={errors.invoice_number}>
                                <Field name="invoice_number" component={PlainInput} disabled={disabled} />
                            </PlainFormItem>

                            <PlainFormItem label="No. Compromiso Presup." invalid={Boolean(errors.budget_commitment_number && touched.budget_commitment_number)} errorMessage={errors.budget_commitment_number}>
                                <Field name="budget_commitment_number" component={PlainInput} disabled={disabled} />
                            </PlainFormItem>

                            <PlainFormItem label="Fecha de Factura" invalid={Boolean(errors.invoice_date && touched.invoice_date)} errorMessage={errors.invoice_date}>
                                <Field name="invoice_date" component={PlainInput} type="date" disabled={disabled} />
                            </PlainFormItem>

                            <div className="grid grid-cols-2 gap-x-4">
                                <PlainFormItem label="Fecha del Acta" invalid={Boolean(errors.acta_date && touched.acta_date)} errorMessage={errors.acta_date}>
                                    <Field name="acta_date" render={({ field }) => (
                                        <input
                                            {...field}
                                            type="date"
                                            disabled={disabled}
                                            value={values.acta_date || ''}
                                            className={nativeInputClass("acta_date", errors, touched)}
                                        />
                                    )} />
                                </PlainFormItem>

                                <PlainFormItem label="Hora del Acta" invalid={Boolean(errors.acta_time && touched.acta_time)} errorMessage={errors.acta_time}>
                                    <Field name="acta_time" render={({ field }) => (
                                        <input
                                            {...field}
                                            type="time"
                                            disabled={disabled}
                                            value={values.acta_time || ''}
                                            className={nativeInputClass("acta_time", errors, touched)}
                                        />
                                    )} />
                                </PlainFormItem>
                            </div>

                        </div>

                        {/* ======================= COLUMNA 2 ======================= */}
                        <div>
                            <div className="grid grid-cols-2 gap-x-4">
                                <PlainFormItem label="Fecha de Recepción" invalid={Boolean(errors.reception_date && touched.reception_date)} errorMessage={errors.reception_date}>
                                    <Field name="reception_date" render={({ field }) => (
                                        <input
                                            {...field}
                                            type="date"
                                            disabled={disabled}
                                            value={values.reception_date || ''}
                                            className={nativeInputClass("reception_date", errors, touched)}
                                        />
                                    )} />
                                </PlainFormItem>

                                <PlainFormItem label="Hora de Recepción" invalid={Boolean(errors.reception_date_only && touched.reception_date_only)} errorMessage={errors.reception_date_only}>
                                    <Field name="reception_date_only" render={({ field }) => (
                                        <input
                                            {...field}
                                            type="time"
                                            disabled={disabled}
                                            value={values.reception_date_only || ''}
                                            className={nativeInputClass("reception_date_only", errors, touched)}
                                        />
                                    )} />
                                </PlainFormItem>
                            </div>


                            <PlainFormItem label="Representante del Proveedor" invalid={Boolean(errors.supplier_representative && touched.supplier_representative)} errorMessage={errors.supplier_representative}>
                                <Field name="supplier_representative" component={PlainInput} disabled={disabled} />
                            </PlainFormItem>

                            <PlainFormItem label="Gerente Administrativo" invalid={Boolean(errors.administrative_manager && touched.administrative_manager)} errorMessage={errors.administrative_manager}>
                                <Field name="administrative_manager" component={PlainInput} disabled={disabled} />
                            </PlainFormItem>

                            <PlainFormItem
                                label="Técnico Administrativo"
                                invalid={Boolean(errors.administrative_technician_id && touched.administrative_technician_id)}
                                errorMessage={errors.administrative_technician_id}
                            >
                                <Field
                                    name="administrative_technician_id"
                                    component={PlainSelect}
                                    invalid={Boolean(errors.administrative_technician_id && touched.administrative_technician_id)}
                                    disabled={disabled}
                                >
                                    <option value="">Seleccione técnico</option>
                                    {administrativeTechnicians && administrativeTechnicians.map(t => (
                                        <option key={t.id} value={t.id}>
                                            {t.name} {t.lastname}
                                        </option>
                                    ))}
                                </Field>
                            </PlainFormItem>

                            <PlainFormItem label="Monto Total" invalid={Boolean(errors.total_amount && touched.total_amount)} errorMessage={errors.total_amount}>
                                <Field name="total_amount" component={PlainInput} type="number" step="0.01" disabled={disabled} />
                            </PlainFormItem>
                        </div>
                    </div>

                    <div className={`flex justify-end gap-2 pt-6 mt-6 border-t ${showOnly ? 'border-t-0' : ''}`}>
                        <button type="button" className="px-3 py-1.5 text-sm border rounded" onClick={onClose}>
                            {showOnly ? 'Cerrar' : 'Cancelar'}
                        </button>

                        {!showOnly && (
                            <button
                                type="submit"
                                disabled={formIsSubmitting}
                                className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60"
                            >
                                {initialValues?.id ? 'Guardar Cambios' : 'Guardar'}
                            </button>
                        )}
                    </div>
                </Form>
            )}
        </Formik>
    )
}

export default PurchaseOrderForm