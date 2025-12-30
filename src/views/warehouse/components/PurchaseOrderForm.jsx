// PurchaseOrderForm.jsx

import React from 'react'
import { Formik, Form, Field } from 'formik'

import {
    PlainInput,
    PlainSelect,
    PlainFormItem,
} from './PurchaseOrderUtils'

// Función CORREGIDA: Asegura el formato YYYY-MM-DD HH:MM:SS para Laravel
const combineDateTime = (date, time) => {
    if (!date) return '';

    // Aseguramos que el tiempo tenga segundos (:00) si el input solo da HH:MM
    let finalTime = time || '00:00';

    // Si el tiempo tiene 5 caracteres (HH:MM), agregamos los segundos
    if (finalTime.length === 5) {
        finalTime += ':00';
    } else if (finalTime.length === 0) {
        // Si el campo de tiempo estuviera vacío
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
    administrativeTechnicians // <-- NUEVA PROP: Lista de técnicos
}) => {

    const handleSubmission = (values, actions) => {
        const processedValues = {
            ...values,
            acta_date: combineDateTime(values.acta_date, values.acta_time),
            reception_time: combineDateTime(values.reception_date, values.reception_time_only),
            invoice_date: combineDateTime(values.invoice_date, '00:00'),
            total_amount: parseFloat(values.total_amount),
            // CONVERTIMOS EL VALOR DEL SELECT (STRING) A ENTERO para Laravel
            administrative_technician: parseInt(values.administrative_technician, 10),
        };

        // Campos eliminados que solo se usan en el formulario para separar fecha/hora
        delete processedValues.acta_time;
        delete processedValues.reception_date;
        delete processedValues.reception_time_only;

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

                            {/* 1. Proveedor */}
                            <PlainFormItem label="Proveedor" invalid={Boolean(errors.supplier_id && touched.supplier_id)} errorMessage={errors.supplier_id}>
                                <Field name="supplier_id" component={PlainSelect} invalid={Boolean(errors.supplier_id && touched.supplier_id)} disabled={disabled}>
                                    <option value="">Seleccione proveedor</option>
                                    {suppliers.map(s => (<option key={s.id} value={s.id}>{s.name}</option>))}
                                </Field>
                            </PlainFormItem>

                            {/* 2. Número de Orden */}
                            <PlainFormItem label="Número de Orden" invalid={Boolean(errors.order_number && touched.order_number)} errorMessage={errors.order_number}>
                                <Field name="order_number" component={PlainInput} disabled={disabled} />
                            </PlainFormItem>

                            {/* 3. Número de Factura */}
                            <PlainFormItem label="Número de Factura" invalid={Boolean(errors.invoice_number && touched.invoice_number)} errorMessage={errors.invoice_number}>
                                <Field name="invoice_number" component={PlainInput} disabled={disabled} />
                            </PlainFormItem>

                            {/* 4. No. Compromiso Presup. */}
                            <PlainFormItem label="No. Compromiso Presup." invalid={Boolean(errors.budget_commitment_number && touched.budget_commitment_number)} errorMessage={errors.budget_commitment_number}>
                                <Field name="budget_commitment_number" component={PlainInput} disabled={disabled} />
                            </PlainFormItem>

                            {/* 5. Fecha de Factura */}
                            <PlainFormItem label="Fecha de Factura" invalid={Boolean(errors.invoice_date && touched.invoice_date)} errorMessage={errors.invoice_date}>
                                <Field name="invoice_date" component={PlainInput} type="date" disabled={disabled} />
                            </PlainFormItem>

                            {/* 6. GRUPO: FECHA/HORA DEL ACTA */}
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
                            {/* 7. GRUPO: FECHA/HORA DE RECEPCIÓN */}
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

                                <PlainFormItem label="Hora de Recepción" invalid={Boolean(errors.reception_time_only && touched.reception_time_only)} errorMessage={errors.reception_time_only}>
                                    <Field name="reception_time_only" render={({ field }) => (
                                        <input
                                            {...field}
                                            type="time"
                                            disabled={disabled}
                                            value={values.reception_time_only || ''}
                                            className={nativeInputClass("reception_time_only", errors, touched)}
                                        />
                                    )} />
                                </PlainFormItem>
                            </div>

                            {/* --------------------------------------------------- */}

                            {/* 8. Representante del Proveedor */}
                            <PlainFormItem label="Representante del Proveedor" invalid={Boolean(errors.supplier_representative && touched.supplier_representative)} errorMessage={errors.supplier_representative}>
                                <Field name="supplier_representative" component={PlainInput} disabled={disabled} />
                            </PlainFormItem>

                            {/* 9. Gerente Administrativo */}
                            <PlainFormItem label="Gerente Administrativo" invalid={Boolean(errors.administrative_manager && touched.administrative_manager)} errorMessage={errors.administrative_manager}>
                                <Field name="administrative_manager" component={PlainInput} disabled={disabled} />
                            </PlainFormItem>

                            {/* 10. Técnico Administrativo (CAMBIADO a SELECT) */}
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

                            {/* 11. Monto Total */}
                            <PlainFormItem label="Monto Total" invalid={Boolean(errors.total_amount && touched.total_amount)} errorMessage={errors.total_amount}>
                                <Field name="total_amount" component={PlainInput} type="number" step="0.01" disabled={disabled} />
                            </PlainFormItem>
                        </div>
                    </div>

                    {/* Pie de página (Botones) */}
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