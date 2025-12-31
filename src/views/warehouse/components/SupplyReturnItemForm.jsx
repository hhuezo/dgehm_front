import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

// Importamos Select de components/ui para usar la búsqueda
import { Select } from 'components/ui';

import {
    PlainFormItem,
    PlainInput,
    PlainTextArea,
} from './SupplyReturnUtils';

// --- Esquema de Validación para Ítems de Detalle ---
const validationSchemaItem = Yup.object().shape({
    product_id: Yup.number()
        .required('El producto es obligatorio')
        .min(1, 'Debe seleccionar un producto válido'),
    returned_quantity: Yup.number()
        .typeError('La cantidad debe ser un número entero')
        .required('La cantidad devuelta es obligatoria')
        .min(1, 'La cantidad debe ser al menos 1')
        .integer('La cantidad debe ser un número entero'),
    observation: Yup.string().nullable().max(500, 'La observación no debe exceder los 500 caracteres'),
});

const SupplyReturnItemForm = ({ itemData, products, returnId, onSubmit, onClose }) => {

    const initialValues = itemData
        ? {
            id: itemData.id,
            wh_supply_return_id: returnId,
            product_id: Number(itemData.product_id),
            returned_quantity: itemData.returned_quantity,
            observation: itemData.observation || '',
        }
        : {
            wh_supply_return_id: returnId,
            product_id: '',
            returned_quantity: '',
            observation: '',
        };

    // Mapear productos al formato de opciones {label, value}
    // Solo usamos el nombre (label) y el ID (value)
    const productOptions = products.map(p => ({
        label: p.name,
        value: p.id,
    }));

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchemaItem}
            onSubmit={onSubmit}
        >
            {({ values, errors, touched, isSubmitting, setFieldValue }) => (
                <Form>
                    <Field name="wh_supply_return_id" type="hidden" />
                    <Field name="id" type="hidden" />

                    <PlainFormItem
                        label="Producto Devuelto"
                        invalid={Boolean(errors.product_id && touched.product_id)}
                        errorMessage={errors.product_id}
                    >
                        <Field name="product_id">
                            {({ field }) => (
                                <Select
                                    size="sm"
                                    options={productOptions}
                                    value={productOptions.find(option => option.value === values.product_id)}
                                    onChange={(option) => {
                                        // Aseguramos que el valor sea el ID si se selecciona una opción, o vacío si se limpia
                                        setFieldValue(field.name, option ? option.value : '');
                                    }}
                                    placeholder="Seleccione el producto"
                                    isDisabled={!!itemData || isSubmitting} // Deshabilitado si edita
                                // NO se utiliza getOptionLabel ni getOptionValue, se usa el formato por defecto {label, value}
                                />
                            )}
                        </Field>
                    </PlainFormItem>

                    <PlainFormItem
                        label="Cantidad Devuelta"
                        invalid={Boolean(errors.returned_quantity && touched.returned_quantity)}
                        errorMessage={errors.returned_quantity}
                    >
                        <Field
                            name="returned_quantity"
                            component={PlainInput}
                            type="number"
                            placeholder="Ej: 5"
                            invalid={Boolean(errors.returned_quantity && touched.returned_quantity)}
                        />
                    </PlainFormItem>

                    <PlainFormItem
                        label="Observación del Ítem (Opcional)"
                        invalid={Boolean(errors.observation && touched.observation)}
                        errorMessage={errors.observation}
                    >
                        <Field
                            name="observation"
                            component={PlainTextArea}
                            placeholder="Estado del producto, motivo específico de la devolución."
                            invalid={Boolean(errors.observation && touched.observation)}
                        />
                    </PlainFormItem>

                    <div className="flex justify-end gap-2 pt-4">
                        <button
                            type="button"
                            className="px-3 py-1.5 text-sm border rounded"
                            onClick={onClose}
                            disabled={isSubmitting}
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60"
                        >
                            {itemData ? 'Guardar Cambios' : 'Agregar Ítem'}
                        </button>
                    </div>

                </Form>
            )}
        </Formik>
    );
};

export default SupplyReturnItemForm;