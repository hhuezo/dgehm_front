// src/views/warehouse/SupplyReturnItemManagement.jsx

import React, { useState } from 'react';
import { Card, Button, Tag, Tooltip } from 'components/ui';
import { HiPlusCircle, HiOutlineTrash, HiOutlinePencil } from 'react-icons/hi';
import Drawer from 'components/ui/Drawer/DrawerOld'
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Select } from 'components/ui';
// Importamos los componentes de UI del formulario
import {
    PlainFormItem,
    PlainInput,
    PlainTextArea,
} from './SupplyReturnUtils'; // Asegúrese de que este archivo exista y esté accesible

// ===============================================
// 1. ESQUEMA DE VALIDACIÓN
// ===============================================

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

// ===============================================
// 2. FORMULARIO INTERNO (ReturnItemFormDrawer)
// ===============================================

const ReturnItemFormDrawer = ({ itemData, products, returnId, onSubmit, onClose }) => {
    const initialValues = itemData
        ? {
            id: itemData.id,
            supply_return_id: returnId,
            product_id: Number(itemData.product_id),
            returned_quantity: itemData.returned_quantity,
            observation: itemData.observation || '',
        }
        : {
            supply_return_id: returnId,
            product_id: '',
            returned_quantity: '',
            observation: '',
        };

    const productOptions = products;

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchemaItem}
            onSubmit={onSubmit}
        >
            {({ values, errors, touched, isSubmitting, setFieldValue }) => (
                <Form>
                    <Field name="supply_return_id" type="hidden" />
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
                                        setFieldValue(field.name, option ? option.value : '');
                                    }}
                                    placeholder="Seleccione el producto"
                                    isDisabled={!!itemData || isSubmitting}
                                    getOptionLabel={(option) => option.label}
                                    getOptionValue={(option) => option.value}
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
                        <Button type="button" variant="plain" onClick={onClose} disabled={isSubmitting}>
                            Cancelar
                        </Button>
                        <Button type="submit" variant="solid" loading={isSubmitting}>
                            {itemData ? 'Guardar Cambios' : 'Agregar Ítem'}
                        </Button>
                    </div>
                </Form>
            )}
        </Formik>
    );
};

// ===============================================
// 3. COMPONENTE PRINCIPAL (SupplyReturnItemManagement)
// ===============================================

const SupplyReturnItemManagement = ({
    supplyReturnId, // Nueva prop para el ID de la devolución
    detailItems = [],
    products = [], // Lista de productos disponibles
    onAddItem, // Ahora solo abre el Drawer (maneja el estado del padre)
    onEditItem, // Ahora solo abre el Drawer con datos (maneja el estado del padre)
    onDeleteConfirm,
    // Props para manejar el estado del Drawer y el Formulario
    drawerOpen,
    editingItem,
    onDrawerClose,
    onFormSubmit // La función que maneja la lógica de crear/actualizar
}) => {
    // --- Renderizado de Tabla ---
    return (
        <Card borderless className="shadow-none border-0">
            {/* HEADER */}
            <div className="flex justify-between items-center border-b px-4 py-3">
                <h4 className="text-lg font-semibold">Ítems Devueltos</h4>
                <Button
                    size="sm"
                    icon={<HiPlusCircle />}
                    variant="solid"
                    onClick={() => onAddItem()} // Llama a la función del padre
                >
                    Agregar Ítem
                </Button>
            </div>

            {/* CUERPO DE LA TABLA */}
            <div className="p-4">
                {detailItems.length === 0 ? (
                    <p className="p-4 text-center text-gray-500">No hay ítems registrados en esta devolución.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <div className="min-w-full inline-block align-middle">
                            {/* Encabezado - Grid de 6 columnas */}
                            <div className="grid grid-cols-6 gap-4 py-1 px-3 border-b bg-gray-50 font-semibold text-xs text-gray-600 uppercase tracking-wider">
                                <div className="col-span-2">Producto</div>
                                <div>Cantidad Dev.</div>
                                <div>Unidad Medida</div>
                                <div>Observación</div>
                                <div>Acciones</div>
                            </div>

                            {/* Filas de Datos */}
                            {detailItems.map(item => (
                                <div
                                    key={item.id}
                                    className="grid grid-cols-6 gap-4 py-2 px-3 border-b text-xs items-center"
                                >
                                    <div className="col-span-2 font-medium">{item.product?.name || 'N/A'}</div>
                                    <div className="font-semibold">{item.returned_quantity}</div>
                                    <div>{item.product?.measure?.name || 'N/A'}</div>

                                    {/* Observación (Trunca y muestra Tooltip) */}
                                    <div>
                                        {item.observation ? (
                                            <Tooltip title={item.observation}>
                                                <Tag className="bg-gray-100 text-gray-800 border-none max-w-xs truncate">
                                                    {item.observation}
                                                </Tag>
                                            </Tooltip>
                                        ) : (
                                            <span className="text-gray-400">Sin obs.</span>
                                        )}
                                    </div>

                                    {/* Columna de Acciones */}
                                    <div className="flex justify-start gap-2">
                                        <Button
                                            icon={<HiOutlinePencil />}
                                            variant="twoTone"
                                            color="blue-600"
                                            size="xs"
                                            shape="circle"
                                            onClick={() => onEditItem(item)}
                                        />
                                        <Button
                                            icon={<HiOutlineTrash />}
                                            variant="twoTone"
                                            color="red-600"
                                            size="xs"
                                            shape="circle"
                                            onClick={() => onDeleteConfirm(item)}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* FOOTER */}
            <div className="border-t px-4 py-2 text-sm text-gray-500">
                Total ítems: {detailItems.length}
            </div>

            {/* DRAWER DEL FORMULARIO INTEGRADO */}
            <Drawer
                title={editingItem ? "Editar Ítem de Devolución" : "Agregar Nuevo Ítem de Devolución"}
                isOpen={drawerOpen}
                onClose={onDrawerClose}
                width={500}
                bodyClass="p-4"
            >
                <ReturnItemFormDrawer
                    itemData={editingItem}
                    products={products}
                    returnId={supplyReturnId}
                    onSubmit={onFormSubmit}
                    onClose={onDrawerClose}
                />
            </Drawer>
        </Card>
    );
};

export default SupplyReturnItemManagement;