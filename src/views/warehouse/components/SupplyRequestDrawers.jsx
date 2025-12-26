import React from 'react';
import DrawerOld from 'components/ui/Drawer/DrawerOld';
import { Formik, Form, Field } from 'formik';

import {
    PlainFormItem,
    PlainInput,
    PlainTextArea,
    validationSchemaEdit,
} from './SupplyRequestUtils';

const SupplyRequestDrawers = ({
    editDrawerOpen,
    handleCloseEditDrawer,
    selectedRequest,
    handleUpdateRequest,
    getTodayDateString
}) => {

    return (
        <DrawerOld
            isOpen={editDrawerOpen}
            onClose={handleCloseEditDrawer}
            closable={false}
        >
            <div className="flex items-center justify-between mb-4 border-b pb-3">
                <h5 className="font-semibold text-xl">Editar Solicitud</h5>
                <button
                    type="button"
                    className="px-2 py-1 text-sm text-gray-500 hover:text-gray-700 rounded"
                    onClick={handleCloseEditDrawer}
                >
                    X
                </button>
            </div>

            {selectedRequest && (
                <Formik
                    initialValues={{
                        id: selectedRequest.id,
                        date: selectedRequest.date ? selectedRequest.date.split('T')[0] : getTodayDateString(),
                        observation: selectedRequest.observation || '',
                        immediate_boss: selectedRequest.immediate_boss || ''
                    }}
                    validationSchema={validationSchemaEdit}
                    onSubmit={handleUpdateRequest}
                >
                    {({ errors, touched, isSubmitting }) => (
                        <Form>
                            <Field name="id" type="hidden" />

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
                                label="Jefe Inmediato"
                                invalid={Boolean(errors.immediate_boss && touched.immediate_boss)}
                                errorMessage={errors.immediate_boss}
                            >
                                <Field
                                    name="immediate_boss"
                                    component={PlainInput}
                                    placeholder="Nombre del jefe que aprueba"
                                    invalid={Boolean(errors.immediate_boss && touched.immediate_boss)}
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
                                    onClick={handleCloseEditDrawer}
                                >
                                    Cancelar
                                </button>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60"
                                >
                                    Guardar Cambios
                                </button>
                            </div>

                        </Form>
                    )}
                </Formik>
            )}
        </DrawerOld>
    );
};

export default SupplyRequestDrawers;