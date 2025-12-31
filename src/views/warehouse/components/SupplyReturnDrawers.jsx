import React from 'react';
import DrawerOld from 'components/ui/Drawer/DrawerOld';
import { Formik, Form, Field } from 'formik';

import {
    PlainFormItem,
    PlainInput,
    PlainTextArea,
    validationSchemaEdit,
} from './SupplyReturnUtils';

const SupplyReturnDrawers = ({
    editDrawerOpen,
    handleCloseEditDrawer,
    selectedReturn,
    handleUpdateReturn,
    getTodayDateString
}) => {

    const getFullName = (user) => {
        return user ? `${user.name} ${user.lastname}` : 'N/A';
    };

    return (
        <DrawerOld
            isOpen={editDrawerOpen}
            onClose={handleCloseEditDrawer}
            closable={false}
        >
            <div className="flex items-center justify-between mb-4 border-b pb-3">
                <h5 className="font-semibold text-xl">Editar Devolución</h5>
                <button
                    type="button"
                    className="px-2 py-1 text-sm text-gray-500 hover:text-gray-700 rounded"
                    onClick={handleCloseEditDrawer}
                >
                    X
                </button>
            </div>

            {selectedReturn && (
                <Formik
                    initialValues={{
                        id: selectedReturn.id,
                        return_date: selectedReturn.return_date ? selectedReturn.return_date.split('T')[0] : getTodayDateString(),

                        returned_by_name: getFullName(selectedReturn.returned_by),
                        supervisor_name: getFullName(selectedReturn.immediate_supervisor),

                        phone_extension: selectedReturn.phone_extension || '',
                        general_observations: selectedReturn.general_observations || '',
                    }}
                    validationSchema={validationSchemaEdit}
                    onSubmit={handleUpdateReturn}
                >
                    {({ errors, touched, isSubmitting }) => (
                        <Form>
                            <Field name="id" type="hidden" />

                            <PlainFormItem label="Fecha de Devolución">
                                <Field
                                    name="return_date"
                                    component={PlainInput}
                                    type="date"
                                    disabled={true}
                                />
                            </PlainFormItem>

                            <PlainFormItem label="Devuelto Por">
                                <Field
                                    name="returned_by_name"
                                    component={PlainInput}
                                    disabled={true}
                                />
                            </PlainFormItem>

                            <PlainFormItem label="Supervisor Inmediato">
                                <Field
                                    name="supervisor_name"
                                    component={PlainInput}
                                    disabled={true}
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

export default SupplyReturnDrawers;