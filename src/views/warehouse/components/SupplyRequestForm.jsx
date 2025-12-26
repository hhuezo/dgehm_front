// Ubicación: src/views/warehouse/components/SupplyRequestForm.jsx

import React from 'react';
import { Formik, Form, Field } from 'formik';
import {
    PlainFormItem,
    PlainSelect,
    PlainInput,
    PlainTextArea,
    validationSchemaCreate,
    getTodayDateString,
} from './SupplyRequestUtils';

const SupplyRequestForm = ({ userOffices, userId, immediateBosses, fetchBossesByOffice, onSubmit, onClose }) => {

    return (
        <Formik
            initialValues={{
                date: getTodayDateString(),
                immediate_boss_id: '',
                observation: '',
                office_id: userOffices.length === 1 ? userOffices[0].id.toString() : '',
                requester_id: userId,
            }}
            validationSchema={validationSchemaCreate}
            onSubmit={onSubmit}
        >
            {({ errors, touched, isSubmitting, setFieldValue }) => (
                <Form>
                    <Field name="requester_id" type="hidden" />

                    <PlainFormItem
                        label="Fecha de Solicitud"
                        invalid={Boolean(errors.date && touched.date)}
                        errorMessage={errors.date}
                    >
                        <Field
                            name="date"
                            component={PlainInput}
                            type="date"
                            disabled={true}
                            invalid={Boolean(errors.date && touched.date)}
                        />
                    </PlainFormItem>

                    <PlainFormItem
                        label="Oficina Solicitante"
                        invalid={Boolean(errors.office_id && touched.office_id)}
                        errorMessage={errors.office_id}
                    >
                        <Field
                            name="office_id"
                            component={PlainSelect}
                            options={userOffices}
                            placeholder="Seleccione la oficina"
                            invalid={Boolean(errors.office_id && touched.office_id)}
                            disabled={userOffices.length === 1}
                            onChange={(e) => {
                                const officeId = e.target.value;
                                setFieldValue('office_id', officeId);
                                setFieldValue('immediate_boss_id', '');
                                fetchBossesByOffice(officeId);
                            }}
                        />
                    </PlainFormItem>


                    <PlainFormItem
                        label="Jefe Inmediato (Aprobador)"
                        invalid={Boolean(errors.immediate_boss_id && touched.immediate_boss_id)}
                        errorMessage={errors.immediate_boss_id}
                    >
                        <Field
                            name="immediate_boss_id"
                            component={PlainSelect}
                            options={immediateBosses}
                            placeholder={immediateBosses.length > 0 ? "Seleccione el jefe aprobador" : "Seleccione primero una oficina"}
                            invalid={Boolean(errors.immediate_boss_id && touched.immediate_boss_id)}
                            disabled={immediateBosses.length === 0}
                        />
                    </PlainFormItem>

                    <PlainFormItem
                        label="Observación / Detalles del Requerimiento"
                        invalid={Boolean(errors.observation && touched.observation)}
                        errorMessage={errors.observation}
                    >
                        <Field
                            name="observation"
                            component={PlainTextArea}
                            placeholder="Detalle los insumos y cantidades requeridas."
                            invalid={Boolean(errors.observation && touched.observation)}
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
                            Enviar Solicitud
                        </button>
                    </div>

                </Form>
            )}
        </Formik>
    );
};

export default SupplyRequestForm;