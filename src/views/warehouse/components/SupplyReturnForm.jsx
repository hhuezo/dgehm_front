// Ubicación: src/views/warehouse/components/SupplyReturnForm.jsx

import React from 'react';
import { Formik, Form, Field } from 'formik';
import {
    PlainFormItem,
    PlainSelect,
    PlainInput,
    PlainTextArea,
    validationSchemaReturn, // Asumimos este nombre para el esquema de validación
    getTodayDateString,
} from './SupplyReturnUtils'; // Asegúrate de que las utilidades estén adaptadas

const SupplyReturnForm = ({
    userOffices,
    userId, // Será returned_by_id
    immediateSupervisors, // Jefes inmediatos
    receivingTechnicians, // Técnicos que reciben
    fetchSupervisorsByOffice, // Función para cargar supervisores
    onSubmit,
    onClose
}) => {
    // Mapeo de technicians a un formato simple de opción {id, name}
    const receiverOptions = receivingTechnicians.map(user => ({
        id: user.id.toString(),
        name: `${user.name} ${user.lastname}`,
    }));

    // Mapeo de supervisores a un formato simple de opción {id, name}
    const supervisorOptions = immediateSupervisors.map(user => ({
        id: user.id.toString(),
        name: `${user.name} ${user.lastname}`,
    }));


    return (
        <Formik
            initialValues={{
                return_date: getTodayDateString(), // Fecha de la devolución
                wh_office_id: userOffices.length === 1 ? userOffices[0].id.toString() : '',
                immediate_supervisor_id: '',
                received_by_id: '',
                phone_extension: '', // Opcional
                general_observations: '',
            }}
            validationSchema={validationSchemaReturn} // Usar el esquema de validación adaptado
            onSubmit={onSubmit}
        >
            {({ errors, touched, isSubmitting, setFieldValue }) => (
                <Form>
                    {/* Campo oculto: Quién devuelve (Usuario logueado) */}
                    <Field name="returned_by_id" type="hidden" initialValue={userId} />

                    <PlainFormItem
                        label="Fecha de Devolución"
                        invalid={Boolean(errors.return_date && touched.return_date)}
                        errorMessage={errors.return_date}
                    >
                        <Field
                            name="return_date"
                            component={PlainInput}
                            type="date"
                            disabled={true} // Se mantiene la fecha actual como no editable
                            invalid={Boolean(errors.return_date && touched.return_date)}
                        />
                    </PlainFormItem>

                    <PlainFormItem
                        label="Oficina de Origen"
                        invalid={Boolean(errors.wh_office_id && touched.wh_office_id)}
                        errorMessage={errors.wh_office_id}
                    >
                        <Field
                            name="wh_office_id"
                            component={PlainSelect}
                            options={userOffices}
                            placeholder="Seleccione la oficina de origen"
                            invalid={Boolean(errors.wh_office_id && touched.wh_office_id)}
                            disabled={userOffices.length === 1}
                            onChange={(e) => {
                                const officeId = e.target.value;
                                setFieldValue('wh_office_id', officeId);
                                setFieldValue('immediate_supervisor_id', '');
                                // Carga el supervisor asociado a la oficina
                                fetchSupervisorsByOffice(officeId);
                            }}
                        />
                    </PlainFormItem>


                    <PlainFormItem
                        label="Supervisor Inmediato"
                        invalid={Boolean(errors.immediate_supervisor_id && touched.immediate_supervisor_id)}
                        errorMessage={errors.immediate_supervisor_id}
                    >
                        <Field
                            name="immediate_supervisor_id"
                            component={PlainSelect}
                            options={supervisorOptions}
                            placeholder={supervisorOptions.length > 0 ? "Seleccione el supervisor" : "Seleccione primero una oficina"}
                            invalid={Boolean(errors.immediate_supervisor_id && touched.immediate_supervisor_id)}
                            disabled={supervisorOptions.length === 0}
                        />
                    </PlainFormItem>

                    <PlainFormItem
                        label="Recibido Por (Técnico Almacén)"
                        invalid={Boolean(errors.received_by_id && touched.received_by_id)}
                        errorMessage={errors.received_by_id}
                    >
                        <Field
                            name="received_by_id"
                            component={PlainSelect}
                            options={receiverOptions}
                            placeholder="Seleccione quién recibe en almacén"
                            invalid={Boolean(errors.received_by_id && touched.received_by_id)}
                            disabled={receiverOptions.length === 0}
                        />
                    </PlainFormItem>

                    <PlainFormItem
                        label="Extensión Telefónica (Opcional)"
                        invalid={Boolean(errors.phone_extension && touched.phone_extension)}
                        errorMessage={errors.phone_extension}
                    >
                        <Field
                            name="phone_extension"
                            component={PlainInput}
                            placeholder="Extensión"
                            invalid={Boolean(errors.phone_extension && touched.phone_extension)}
                        />
                    </PlainFormItem>


                    <PlainFormItem
                        label="Observaciones Generales"
                        invalid={Boolean(errors.general_observations && touched.general_observations)}
                        errorMessage={errors.general_observations}
                    >
                        <Field
                            name="general_observations"
                            component={PlainTextArea}
                            placeholder="Detalles sobre la devolución, estado de los ítems, etc."
                            invalid={Boolean(errors.general_observations && touched.general_observations)}
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
                            Registrar Devolución
                        </button>
                    </div>

                </Form>
            )}
        </Formik>
    );
};

export default SupplyReturnForm;