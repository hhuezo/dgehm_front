import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    Card, FormContainer, FormItem, Input, Button,
    Notification, toast, Select, Table, Badge, Dialog,
    Spinner
} from 'components/ui';
import Drawer from 'components/ui/Drawer/DrawerOld'
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { HiOutlineTrash, HiOutlinePencil, HiCheck } from 'react-icons/hi';

import {
    apiGetProducts,
    apiGetPurchaseOrderDetail,
    apiStorePurchaseOrderItem,
    apiDeletePurchaseOrderItem
} from 'services/WareHouseServise';

// ===============================================
// UTILIDADES (Definidas fuera para ser accesibles)
// ===============================================

const formatCurrency = (amount) => {
    const numericAmount = Number(amount || 0).toFixed(4);
    return new Intl.NumberFormat('es-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 4,
    }).format(numericAmount);
};

const validationSchema = Yup.object().shape({
    product_id: Yup.number()
        .required('El producto es obligatorio')
        .min(1, 'Debe seleccionar un producto válido'),
    quantity: Yup.number()
        .typeError('La cantidad debe ser un número')
        .required('La cantidad es obligatoria')
        .min(1, 'La cantidad debe ser mayor a 0'),
    unit_price: Yup.number()
        .typeError('El precio debe ser un número')
        .required('El precio es obligatorio')
        .min(0.0001, 'El precio debe ser mayor a 0.0000'),
});

const getInitialValues = (item) => ({
    id: item?.id || null,
    product_id: item?.product_id || '',
    quantity: item?.quantity || 1,
    unit_price: item?.unit_price || 0.00,
    purchase_order_id: item?.purchase_order_id || null,
});


// ===============================================
// COMPONENTE PRINCIPAL DE GESTIÓN DE ÍTEMS
// ===============================================

const PurchaseOrderItemManagement = ({ purchaseOrderId }) => {
    const [products, setProducts] = useState([]);
    const [items, setItems] = useState([]);
    const [loadingItems, setLoadingItems] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false); // Estado para el Drawer

    // --- FETCH DE DATOS ---

    const fetchProducts = useCallback(async () => {
        try {
            const res = await apiGetProducts();
            if (res.data.success) {
                const mappedProducts = res.data.data.map(p => ({
                    label: p.name,
                    value: p.id,
                    unit_price: Number(p.unit_price || 0.00).toFixed(4),
                }));
                setProducts(mappedProducts);
            }
        } catch (error) {
            toast.push(<Notification title="Error" type="danger">Error al cargar el catálogo de productos.</Notification>);
        }
    }, []);

    const fetchOrderDetails = useCallback(async () => {
        if (!purchaseOrderId) return;
        setLoadingItems(true);
        try {
            const res = await apiGetPurchaseOrderDetail(purchaseOrderId);
            if (res.data.success) {
                setItems(res.data.data);
            }
        } catch (error) {
            toast.push(<Notification title="Error" type="danger">Error al cargar los ítems de la orden.</Notification>);
        } finally {
            setLoadingItems(false);
        }
    }, [purchaseOrderId]);

    useEffect(() => {
        fetchProducts();
        fetchOrderDetails();
    }, [fetchProducts, fetchOrderDetails]);

    // --- HANDLERS DE DRAWER ---

    const handleOpenDrawer = (item = null) => {
        setEditingItem(item);
        setDrawerOpen(true);
    };

    const handleCloseDrawer = () => {
        setEditingItem(null);
        setDrawerOpen(false);
    };


    // --- HANDLERS DE FORMULARIO ---

    const handleSubmit = async (values, actions) => {
        setIsSubmitting(true);
        try {
            const payload = {
                ...values,
                purchase_order_id: purchaseOrderId,
                id: editingItem ? editingItem.id : null,
            };

            const res = await apiStorePurchaseOrderItem(payload);

            if (res.data.success) {
                toast.push(<Notification title="Correcto" type="success">Ítem guardado correctamente.</Notification>);

                actions.resetForm({ values: getInitialValues({ purchase_order_id: purchaseOrderId }) });
                handleCloseDrawer(); // Cerramos el drawer al éxito

                fetchOrderDetails();
            } else {
                toast.push(<Notification title="Error" type="danger">{res.data.message || 'Error desconocido al guardar.'}</Notification>);
            }
        } catch (error) {
            const message = error.response?.data?.message || (editingItem ? 'No se pudo actualizar el ítem.' : 'No se pudo agregar el ítem.');
            toast.push(<Notification title="Error" type="danger">{message}</Notification>);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (item) => {
        handleOpenDrawer(item);
    }

    // --- HANDLERS DE ELIMINACIÓN (Se mantienen igual) ---

    const openDeleteDialog = (item) => {
        setItemToDelete(item);
        setDialogOpen(true);
    }

    const closeDeleteDialog = () => {
        setDialogOpen(false);
        setItemToDelete(null);
    }

    const handleDelete = async () => {
        if (!itemToDelete) return;

        try {
            const res = await apiDeletePurchaseOrderItem(itemToDelete.id);
            if (res.data.success) {
                toast.push(<Notification title="Eliminado" type="success">Ítem eliminado correctamente.</Notification>);
                fetchOrderDetails();
            } else {
                toast.push(<Notification title="Error" type="danger">{res.data.message || 'Error desconocido al eliminar.'}</Notification>);
            }
        } catch (error) {
            toast.push(<Notification title="Error" type="danger">Error al eliminar el ítem.</Notification>);
        } finally {
            closeDeleteDialog();
        }
    }

    // Cálculo del total de la Orden
    const totalOrderAmount = items.reduce((sum, item) => sum + (Number(item.subtotal) || (Number(item.quantity) * Number(item.unit_price))), 0);

    return (
        <div className="space-y-6">

            {/* BOTÓN PARA ABRIR EL DRAWER */}
            <div className="flex justify-end">
                <Button
                    variant="solid"
                    onClick={() => handleOpenDrawer()}
                >
                    Añadir Nuevo Ítem
                </Button>
            </div>

            {/* ÍTEMS ASIGNADOS - TABLA MANUAL COMPACTA */}
            <Card>
                <div className="flex justify-between items-center mb-4">
                    <h6 className="text-md font-semibold">Ítems Asignados ({items.length})</h6>
                    <Badge content={formatCurrency(totalOrderAmount)} innerClass="bg-blue-600 text-white" className="text-lg py-1 px-3">
                        Total Orden
                    </Badge>
                </div>

                {loadingItems ? (
                    <div className="flex justify-center py-10"><Spinner size={30} /></div>
                ) : items.length === 0 ? (
                    <p className="p-4 text-center text-gray-500">No hay ítems asignados a esta acta.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <div className="min-w-full inline-block align-middle">
                            {/* Encabezado - Compacto (py-1) */}
                            <div className="grid grid-cols-6 gap-4 py-1 px-3 border-b bg-gray-50 font-semibold text-xs text-gray-600 uppercase tracking-wider">
                                <div className="col-span-2">Producto</div>
                                <div>Cantidad</div>
                                <div>Precio Unit.</div>
                                <div>Subtotal</div>
                                <div>Acciones</div>
                            </div>

                            {/* Filas de Datos - Compactas (py-2, text-xs) */}
                            {items.map(item => {
                                const subtotal = item.subtotal || (Number(item.quantity) * Number(item.unit_price));
                                return (
                                    <div key={item.id} className="grid grid-cols-6 gap-4 py-2 px-3 border-b text-xs items-center">
                                        <div className="col-span-2">{item.product?.name || 'N/A'}</div>
                                        <div>{item.quantity}</div>
                                        <div>{formatCurrency(item.unit_price)}</div>
                                        <div className="font-semibold">{formatCurrency(subtotal)}</div>
                                        <div className="flex justify-start gap-2">
                                            <Button
                                                icon={<HiOutlinePencil />}
                                                variant="plain"
                                                size="xs"
                                                onClick={() => handleEdit(item)}
                                            />
                                            <Button
                                                icon={<HiOutlineTrash />}
                                                variant="plain"
                                                size="xs"
                                                color="red-600"
                                                onClick={() => openDeleteDialog(item)}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </Card>

            {/* Diálogo de Confirmación de Eliminación */}
            <Dialog
                isOpen={dialogOpen}
                onClose={closeDeleteDialog}
                onRequestClose={closeDeleteDialog}
            >
                <h5 className="mb-4">Confirmar Eliminación</h5>
                <div className="text-gray-600">
                    ¿Está seguro de que desea eliminar el ítem
                    <span className="font-semibold text-red-600"> {itemToDelete?.product?.name}</span>?
                    Esta acción es irreversible.
                </div>
                <div className="mt-6 text-right">
                    <Button
                        className="mr-2"
                        onClick={closeDeleteDialog}
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="solid"
                        color="red-600"
                        onClick={handleDelete}
                    >
                        Eliminar
                    </Button>
                </div>
            </Dialog>

            {/* EL DRAWER CON EL FORMULARIO */}
            <ItemFormDrawer
                isOpen={drawerOpen}
                onClose={handleCloseDrawer}
                purchaseOrderId={purchaseOrderId}
                editingItem={editingItem}
                products={products}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
            />
        </div>
    );
}

// ===============================================
// NUEVO COMPONENTE: FORMULARIO EN DRAWER
// ===============================================
const ItemFormDrawer = ({
    isOpen,
    onClose,
    purchaseOrderId,
    editingItem,
    products,
    onSubmit,
    isSubmitting
}) => {
    return (
        <Drawer
            isOpen={isOpen}
            onClose={onClose}
            title={editingItem ? 'Editar Ítem de la Orden' : 'Añadir Nuevo Ítem'}
            width={550}
        >
            <Formik
                initialValues={editingItem ? getInitialValues(editingItem) : getInitialValues({ purchase_order_id: purchaseOrderId })}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
                enableReinitialize={true}
            >
                {({ values, errors, touched, setFieldValue, resetForm }) => (
                    <Form>
                        <FormContainer>
                            <div className="grid grid-cols-1 gap-y-3">
                                {/* Producto */}
                                <FormItem
                                    label="Producto"
                                    invalid={errors.product_id && touched.product_id}
                                    errorMessage={errors.product_id}
                                >
                                    <Field name="product_id">
                                        {({ field }) => (
                                            <Select
                                                size="sm"
                                                options={products}
                                                value={products.find(option => option.value === values.product_id)}
                                                onChange={(option) => {
                                                    setFieldValue(field.name, option.value);
                                                    if (!editingItem) {
                                                        setFieldValue('unit_price', option.unit_price || 0.00);
                                                    }
                                                }}
                                                placeholder="Seleccionar Producto"
                                                isDisabled={!!editingItem || isSubmitting}
                                            />
                                        )}
                                    </Field>
                                </FormItem>

                                {/* Cantidad */}
                                <FormItem
                                    label="Cantidad"
                                    invalid={errors.quantity && touched.quantity}
                                    errorMessage={errors.quantity}
                                >
                                    <Field name="quantity">
                                        {({ field }) => (
                                            <Input
                                                size="sm"
                                                type="number"
                                                disabled={isSubmitting}
                                                {...field}
                                            />
                                        )}
                                    </Field>
                                </FormItem>

                                {/* Precio Unitario */}
                                <FormItem
                                    label="Precio Unitario"
                                    invalid={errors.unit_price && touched.unit_price}
                                    errorMessage={errors.unit_price}
                                >
                                    <Field name="unit_price">
                                        {({ field }) => (
                                            <Input
                                                size="sm"
                                                type="number"
                                                step="0.0001"
                                                prefix="$"
                                                disabled={isSubmitting}
                                                {...field}
                                            />
                                        )}
                                    </Field>
                                </FormItem>

                                {/* Subtotal Calculado */}
                                <FormItem label="Subtotal">
                                    <Input
                                        size="sm"
                                        value={formatCurrency(values.quantity * values.unit_price)}
                                        readOnly
                                    />
                                </FormItem>
                            </div>

                            <div className="flex justify-end gap-2 mt-4">
                                <Button
                                    type="button"
                                    onClick={onClose}
                                    disabled={isSubmitting}
                                    size="sm"
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    variant="solid"
                                    type="submit"
                                    icon={<HiCheck />}
                                    loading={isSubmitting}
                                    size="sm"
                                >
                                    {editingItem ? 'Guardar Cambios' : 'Agregar Ítem'}
                                </Button>
                            </div>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </Drawer>
    );
};

export default PurchaseOrderItemManagement;