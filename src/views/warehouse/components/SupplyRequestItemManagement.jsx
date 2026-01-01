import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    Card, FormContainer, FormItem, Input, Button,
    Notification, toast, Select, Dialog, Spinner
} from 'components/ui';
// Asegúrate de que esta importación sea correcta según tu librería:
import Drawer from 'components/ui/Drawer/DrawerOld'
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { HiOutlineTrash, HiOutlinePencil, HiCheck, HiPlusCircle } from 'react-icons/hi';

// Adaptación de las APIs para Solicitudes de Insumos
import {
    apiGetProducts,
    apiGetSupplyRequestDetail,
    apiStoreSupplyRequestItem, // Usada para store/update
    apiDeleteSupplyRequestItem
} from 'services/WareHouseServise';

// ===============================================
// UTILIDADES
// ===============================================

// Validación que depende del contexto (si es edición de solicitud o de entrega)
const getValidationSchema = (isEditableForDelivery) => {

    // Reglas base para cantidad solicitada
    let schema = Yup.object().shape({
        product_id: Yup.number()
            .required('El insumo es obligatorio')
            .min(1, 'Debe seleccionar un insumo válido'),
        quantity: Yup.number()
            .typeError('La cantidad debe ser un número')
            .required('La cantidad solicitada es obligatoria')
            .min(1, 'La cantidad debe ser mayor a 0'),
    });

    if (isEditableForDelivery) {
        // Si estamos en la fase de entrega (Estado 2), requerimos y validamos delivered_quantity
        schema = schema.shape({
            delivered_quantity: Yup.number()
                .typeError('La cantidad entregada debe ser un número')
                .required('La cantidad entregada es obligatoria')
                .min(0, 'La cantidad entregada no puede ser negativa')
                .test(
                    'is-less-than-quantity',
                    'No puede entregar más de lo solicitado',
                    function (value) {
                        // El valor entregado no debe ser mayor a lo solicitado (se compara con la cantidad solicitada en el mismo formulario)
                        return value <= this.parent.quantity;
                    }
                ),
        });
    }

    return schema;
};


const getInitialValues = (item) => ({
    id: item?.id || null,
    product_id: item?.product_id || '',
    quantity: item?.quantity || '',
    delivered_quantity: item?.delivered_quantity || '',
    supply_request_id: item?.supply_request_id || null,
});


// ===============================================
// COMPONENTE PRINCIPAL DE GESTIÓN DE ÍTEMS
// ===============================================

const SupplyRequestItemManagement = ({ requestId, requestStatusId }) => {
    const [products, setProducts] = useState([]);
    const [items, setItems] = useState([]);
    const [loadingItems, setLoadingItems] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);

    // Bandera para permitir edición de la SOLICITUD (Solo si está Pendiente: Status 1)
    const isEditable = requestStatusId === 1;

    // Bandera para permitir edición de la ENTREGA (Solo si está Aprobada: Status 3)
    const isEditableForDelivery = requestStatusId === 3;

    // --- FETCH DE DATOS ---

    const fetchProducts = useCallback(async () => {
        try {
            const res = await apiGetProducts();
            if (res.data.success) {
                const mappedProducts = res.data.data.map(p => ({
                    label: `${p.name} (${p.measure?.name || 'Unidad'})`,
                    value: p.id,
                }));
                setProducts(mappedProducts);
            }
        } catch (error) {
            toast.push(<Notification title="Error" type="danger">Error al cargar el catálogo de insumos.</Notification>);
        }
    }, []);

    const fetchRequestDetails = useCallback(async () => {
        if (!requestId) return;
        setLoadingItems(true);
        try {
            const res = await apiGetSupplyRequestDetail(requestId);
            if (res.data.success) {
                setItems(res.data.data);
            }
        } catch (error) {
            toast.push(<Notification title="Error" type="danger">Error al cargar los ítems de la solicitud.</Notification>);
        } finally {
            setLoadingItems(false);
        }
    }, [requestId]);

    useEffect(() => {
        fetchProducts();
        fetchRequestDetails();
    }, [fetchProducts, fetchRequestDetails]);

    // --- HANDLERS DE DRAWER ---

    const handleOpenDrawer = (item = null) => {
        // Solo permitir añadir nuevos ítems si está Pendiente (Status 1)
        if (!item && !isEditable) return;

        // Solo permitir editar si está Pendiente (Status 1) o Aprobado (Status 2)
        if (item && !isEditable && !isEditableForDelivery) return;

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
                supply_request_id: requestId,
                id: editingItem ? editingItem.id : null,
            };

            const res = await apiStoreSupplyRequestItem(payload);

            if (res.data.success) {
                const successMessage = isEditableForDelivery
                    ? 'Cantidad entregada actualizada correctamente.'
                    : 'Ítem guardado correctamente.';

                toast.push(<Notification title="Correcto" type="success">{successMessage}</Notification>);

                // Reiniciar solo si se está añadiendo (isEditable y no es edición)
                if (isEditable && !editingItem) {
                    actions.resetForm({ values: getInitialValues({ supply_request_id: requestId }) });
                }

                handleCloseDrawer();
                fetchRequestDetails();
            } else {
                toast.push(<Notification title="Error" type="danger">{res.data.message || 'Error desconocido al guardar.'}</Notification>);
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Error al guardar el ítem.';
            toast.push(<Notification title="Error" type="danger">{message}</Notification>);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (item) => {
        // Abrir el drawer solo si es editable (Status 1) o editable para entrega (Status 2)
        if (isEditable || isEditableForDelivery) {
            handleOpenDrawer(item);
        }
    }

    // --- HANDLERS DE ELIMINACIÓN (Solo permitido si está Pendiente - Status 1) ---

    const openDeleteDialog = (item) => {
        if (isEditable) {
            setItemToDelete(item);
            setDialogOpen(true);
        }
    }

    const closeDeleteDialog = () => {
        setDialogOpen(false);
        setItemToDelete(null);
    }

    const handleDelete = async () => {
        if (!itemToDelete) return;

        try {
            const res = await apiDeleteSupplyRequestItem(itemToDelete.id);
            if (res.data.success) {
                toast.push(<Notification title="Eliminado" type="success">Ítem eliminado correctamente.</Notification>);
                fetchRequestDetails();
            } else {
                toast.push(<Notification title="Error" type="danger">{res.data.message || 'Error desconocido al eliminar.'}</Notification>);
            }
        } catch (error) {
            toast.push(<Notification title="Error" type="danger">Error al eliminar el ítem.</Notification>);
        } finally {
            closeDeleteDialog();
        }
    }

    // Definición dinámica de columnas para la tabla
    const hasDeliveredColumn = isEditableForDelivery || requestStatusId > 2; // Mostrar 'Entregado' si ya se aprobó o finalizó
    const showActions = isEditable || isEditableForDelivery; // Mostrar acciones si está Pendiente o Aprobado

    // Definición de la estructura de la tabla (usando spans para 'Insumo')
    const headerColumns = [
        { name: 'Insumo', span: 2 },
        { name: 'Cantidad Solicitada', span: 1 },
    ];
    if (hasDeliveredColumn) {
        headerColumns.push({ name: 'Entregado', span: 1 });
    }
    headerColumns.push({ name: 'Unidad', span: 1 });
    if (showActions) {
        headerColumns.push({ name: 'Acciones', span: 1 });
    }

    // Calcular el total de columnas para la grilla CSS
    const totalGridColumns = headerColumns.reduce((sum, col) => sum + col.span, 0);

    // Función para obtener la clase CSS de la grilla
    const getGridTemplate = (count) => {
        switch (count) {
            case 4: return 'grid-cols-4';
            case 5: return 'grid-cols-5';
            case 6: return 'grid-cols-6';
            default: return 'grid-cols-5';
        }
    }

    return (
        <div className="space-y-6">

            {/* BOTÓN PARA ABRIR EL DRAWER (Solo si es editable = Status 1) */}
            {isEditable && (
                <div className="flex justify-end">
                    <Button
                        icon={<HiPlusCircle />}
                        variant="solid"
                        onClick={() => handleOpenDrawer()}
                    >
                        Añadir Nuevo Ítem
                    </Button>
                </div>
            )}


            {/* ÍTEMS ASIGNADOS - TABLA */}
            <Card>
                <div className="flex justify-between items-center mb-4">
                    <h6 className="text-md font-semibold">Ítems Solicitados ({items.length})</h6>
                </div>

                {loadingItems ? (
                    <div className="flex justify-center py-10"><Spinner size={30} /></div>
                ) : items.length === 0 ? (
                    <p className="p-4 text-center text-gray-500">No hay insumos solicitados para esta solicitud.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <div className="min-w-full inline-block align-middle">

                            {/* Encabezado: Dinámico */}
                            <div className={`grid ${getGridTemplate(totalGridColumns)} gap-4 py-1 px-3 border-b bg-gray-50 font-semibold text-xs text-gray-600 uppercase tracking-wider`}>
                                {headerColumns.map((col, index) => (
                                    <div key={index} className={`col-span-${col.span}`}>{col.name}</div>
                                ))}
                            </div>

                            {/* Filas de Datos */}
                            {items.map(item => (
                                <div
                                    key={item.id}
                                    className={`grid ${getGridTemplate(totalGridColumns)} gap-4 py-2 px-3 border-b text-xs items-center`}
                                >
                                    <div className="col-span-2">{item.product?.name || 'N/A'}</div>
                                    <div className="font-semibold">{item.quantity}</div>

                                    {/* Cantidad Entregada (Condicional) */}
                                    {hasDeliveredColumn && (
                                        <div className="font-semibold text-blue-600">
                                            {item.delivered_quantity !== null ? item.delivered_quantity : '0'}
                                        </div>
                                    )}

                                    <div>{item.product?.measure?.name || 'N/A'}</div>

                                    {/* Columna de Acciones (Condicional) */}
                                    {showActions && (
                                        <div className="flex justify-start gap-2">
                                            <Button
                                                icon={<HiOutlinePencil />}
                                                variant="twoTone"
                                                color={isEditableForDelivery ? "blue-600" : "blue-600"}
                                                size="xs"
                                                shape="circle"
                                                onClick={() => handleEdit(item)}
                                            />
                                            {/* Solo permitir eliminar si es editable (Status 1) */}
                                            {isEditable && (
                                                <Button
                                                    icon={<HiOutlineTrash />}
                                                    variant="twoTone"
                                                    color="red-600"
                                                    size="xs"
                                                    shape="circle"
                                                    onClick={() => openDeleteDialog(item)}
                                                />
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </Card>

            {/* Diálogo de Confirmación de Eliminación (Sin cambios) */}
            <Dialog
                isOpen={dialogOpen}
                onClose={closeDeleteDialog}
                onRequestClose={closeDeleteDialog}
            >
                <h5 className="mb-4">Confirmar Eliminación</h5>
                <div className="text-gray-600">
                    ¿Está seguro de que desea eliminar el ítem
                    <span className="font-semibold text-red-600"> {itemToDelete?.product?.name}</span>?
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

            {/* EL DRAWER CON EL FORMULARIO (MODIFICADO) */}
            <ItemFormDrawer
                isOpen={drawerOpen}
                onClose={handleCloseDrawer}
                requestId={requestId}
                editingItem={editingItem}
                products={products}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                isEditable={isEditable} // Status 1
                isEditableForDelivery={isEditableForDelivery} // Status 2
            />
        </div>
    );
}

// ===============================================
// FORMULARIO EN DRAWER (Corregido el error de Hooks)
// ===============================================
const ItemFormDrawer = ({
    isOpen,
    onClose,
    requestId,
    editingItem,
    products,
    onSubmit,
    isSubmitting,
    isEditable,
    isEditableForDelivery // <--- RECIBIDO: true si statusId === 2
}) => {

    // CORRECCIÓN DEL ERROR DE HOOKS: useMemo se llama SIEMPRE al inicio.
    const validationSchema = useMemo(() => getValidationSchema(isEditableForDelivery), [isEditableForDelivery]);

    // Si no es editable en ningún modo, no renderizar el Drawer (Retorno condicional DESPUÉS del Hook)
    if (!isEditable && !isEditableForDelivery) return null;

    const title = isEditableForDelivery
        ? 'Registrar Cantidad Entregada'
        : (editingItem ? 'Editar Insumo Solicitado' : 'Añadir Nuevo Insumo');


    return (
        <Drawer
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            width={500}
        >
            <Formik
                initialValues={editingItem ? getInitialValues(editingItem) : getInitialValues({ supply_request_id: requestId })}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
                enableReinitialize={true}
            >
                {({ values, errors, touched, setFieldValue }) => (
                    <Form>
                        <FormContainer>
                            <div className="grid grid-cols-1 gap-y-3">
                                {/* Producto (Siempre deshabilitado en edición/entrega) */}
                                <FormItem
                                    label="Insumo"
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
                                                }}
                                                placeholder="Buscar y seleccionar Insumo"
                                                // Deshabilitar si ya está guardado (edición) o es fase de entrega
                                                isDisabled={!!editingItem || isSubmitting || isEditableForDelivery}
                                            />
                                        )}
                                    </Field>
                                </FormItem>

                                {/* Cantidad Solicitada (Deshabilitada en fase de entrega) */}
                                <FormItem
                                    label="Cantidad Solicitada"
                                    invalid={errors.quantity && touched.quantity}
                                    errorMessage={errors.quantity}
                                >
                                    <Field name="quantity">
                                        {({ field }) => (
                                            <Input
                                                size="sm"
                                                type="number"
                                                // Deshabilitar si es fase de entrega (Status 2) o si se está enviando el form o no es editable (Status 1)
                                                disabled={isSubmitting || isEditableForDelivery || !isEditable}
                                                {...field}
                                            />
                                        )}
                                    </Field>
                                </FormItem>

                                {/* Cantidad Entregada (Visible y Editable solo si es Status 2) */}
                                {isEditableForDelivery && (
                                    <FormItem
                                        label={`Cantidad Entregada (Máx: ${values.quantity})`}
                                        invalid={errors.delivered_quantity && touched.delivered_quantity}
                                        errorMessage={errors.delivered_quantity}
                                    >
                                        <Field name="delivered_quantity">
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
                                )}
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
                                    {isEditableForDelivery ? 'Guardar Entrega' : (editingItem ? 'Guardar Cambios' : 'Agregar Ítem')}
                                </Button>
                            </div>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </Drawer>
    );
};

export default SupplyRequestItemManagement;