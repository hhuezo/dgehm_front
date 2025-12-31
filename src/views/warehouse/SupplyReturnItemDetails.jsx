import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
    setCurrentRouteTitle,
    setCurrentRouteSubtitle,
    setCurrentRouteInfo,
    setCurrentRouteOptions,
} from 'store/base/commonSlice';

import {
    apiGetSupplyReturn,
    apiStoreSupplyReturnItem,
    apiDeleteSupplyReturnItem,
    apiGetProducts,
} from 'services/WareHouseServise';

import { Card, Notification, toast, Button, Tag, Dialog, Spinner } from 'components/ui';
import { HiPlusCircle, HiOutlineTrash } from 'react-icons/hi';

import SupplyReturnDetailTable from './components/SupplyReturnDetailTable';
import SupplyReturnItemForm from './components/SupplyReturnItemForm';
import { DetailItem } from './components/SupplyReturnUtils';
import DrawerOld from 'components/ui/Drawer/DrawerOld';


const SupplyReturnItemDetail = () => {
    const { id: returnId } = useParams();
    const dispatch = useDispatch();


    const [loading, setLoading] = useState(true);
    const [headerData, setHeaderData] = useState(null);
    const [detailItems, setDetailItems] = useState([]);
    const [products, setProducts] = useState([]);

    const [itemDrawerOpen, setItemDrawerOpen] = useState(false);
    const [editItem, setEditItem] = useState(null);

    const [dialogDeleteOpen, setDialogDeleteOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);


    const handleSetHeader = useCallback(() => {
        dispatch(setCurrentRouteTitle(`Devolución #${returnId}`));
        dispatch(setCurrentRouteSubtitle('Detalles y gestión de ítems devueltos'));
        dispatch(setCurrentRouteInfo(''));
        dispatch(setCurrentRouteOptions(''));
    }, [dispatch, returnId]);

    useEffect(() => {
        handleSetHeader();

        // Verificación agregada para evitar llamadas a la API con 'undefined'
        if (returnId) {
            fetchReturnData();
            fetchProducts();
        } else {
            setLoading(false);
            toast.push(<Notification title="Error de URL" type="warning">ID de devolución no encontrado en la ruta.</Notification>);
        }

    }, [handleSetHeader, returnId]);

    const fetchProducts = async () => {
        try {
            const res = await apiGetProducts();
            if (res.data.success) {
                setProducts(res.data.data);
            }
        } catch (error) {
            toast.push(<Notification title="Error" type="danger">Error al cargar listado de productos.</Notification>);
        }
    };

    const fetchReturnData = async () => {
        setLoading(true);
        try {
            // Este es el endpoint que mostró el error 'http://127.0.0.1:8000/api/supply_return/undefined'
            const res = await apiGetSupplyReturn(returnId);
            if (res.data.success) {
                const data = res.data.data;
                setHeaderData(data);
                setDetailItems(data.details || []);
            }
        } catch (error) {
            toast.push(<Notification title="Error" type="danger">Error al cargar los detalles de la devolución.</Notification>);
        } finally {
            setLoading(false);
        }
    };

    // --- Gestión del Drawer de Ítems ---

    const handleAddItem = () => {
        setEditItem(null);
        setItemDrawerOpen(true);
    };

    const handleEditItem = (item) => {
        setEditItem(item);
        setItemDrawerOpen(true);
    };

    const handleCloseItemDrawer = () => {
        setItemDrawerOpen(false);
        setEditItem(null);
    };

    // --- Creación / Edición de Ítems ---

    const handleStoreItem = async (values, actions) => {
        const payload = { ...values, wh_supply_return_id: returnId };

        try {
            const res = await apiStoreSupplyReturnItem(payload);

            if (res.data.success) {
                toast.push(<Notification title="Correcto" type="success">Ítem de devolución guardado correctamente.</Notification>);
                handleCloseItemDrawer();
                fetchReturnData();
            } else {
                toast.push(<Notification title="Error" type="danger">{res.data.message || 'Error al guardar el ítem.'}</Notification>);
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Error de red o servidor al guardar el ítem.';
            toast.push(<Notification title="Error" type="danger">{errorMsg}</Notification>);
        } finally {
            actions.setSubmitting(false);
        }
    };

    // --- Eliminación de Ítems ---

    const handleConfirmDelete = (item) => {
        setItemToDelete(item);
        setDialogDeleteOpen(true);
    };

    const closeDeleteDialog = () => {
        setDialogDeleteOpen(false);
        setItemToDelete(null);
    };

    const handleDeleteItem = async () => {
        setDialogDeleteOpen(false);
        if (!itemToDelete) return;

        try {
            const res = await apiDeleteSupplyReturnItem(itemToDelete.id);
            if (res.data.success) {
                toast.push(<Notification title="Eliminado" type="success">Ítem de devolución eliminado correctamente.</Notification>);
                fetchReturnData();
            } else {
                toast.push(<Notification title="Error" type="danger">{res.data.message || 'Error al eliminar el ítem.'}</Notification>);
            }
        } catch (error) {
            toast.push(<Notification title="Error" type="danger">Error de red o servidor al eliminar el ítem.</Notification>);
        } finally {
            setItemToDelete(null);
        }
    };


    if (loading) {
        return (
            <Card className="flex justify-center items-center h-96">
                <Spinner size={40} />
            </Card>
        );
    }

    if (!headerData) {
        return <Card>Devolución no encontrada.</Card>;
    }

    return (
        <>
            <Card borderless className="mb-4">
                <h6 className="mb-4 text-lg font-semibold border-b pb-2">Información de Cabecera</h6>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <DetailItem label="ID Devolución">#{headerData.id}</DetailItem>
                    <DetailItem label="Fecha Devolución">{new Date(headerData.return_date).toLocaleDateString()}</DetailItem>
                    <DetailItem label="Oficina">{headerData.office?.name || 'N/A'}</DetailItem>
                    <DetailItem label="Extensión Teléfono">{headerData.phone_extension || 'N/A'}</DetailItem>

                    <DetailItem label="Devuelto Por">
                        {headerData.returned_by ? `${headerData.returned_by.name} ${headerData.returned_by.lastname}` : 'N/A'}
                    </DetailItem>
                    <DetailItem label="Supervisor Inmediato">
                        {headerData.immediate_supervisor ? `${headerData.immediate_supervisor.name} ${headerData.immediate_supervisor.lastname}` : 'N/A'}
                    </DetailItem>
                    <DetailItem label="Recibido Por">
                        {headerData.received_by ? `${headerData.received_by.name} ${headerData.received_by.lastname}` : 'N/A'}
                    </DetailItem>

                    <DetailItem label="Observaciones">
                        <Tag className="bg-gray-100 text-gray-800 border-none max-w-full truncate whitespace-normal">
                            {headerData.general_observations || 'Sin observaciones'}
                        </Tag>
                    </DetailItem>
                </div>
            </Card>

            <Card borderless className="shadow-none border-0">
                <div className="flex justify-between items-center border-b px-4 py-3">
                    <h4 className="text-lg font-semibold">Ítems Devueltos</h4>
                    <Button
                        size="sm"
                        icon={<HiPlusCircle />}
                        variant="solid"
                        onClick={handleAddItem}
                    >
                        Agregar Ítem
                    </Button>
                </div>

                <div className="p-4">
                    <SupplyReturnDetailTable
                        data={detailItems}
                        loading={loading}
                        handleEdit={handleEditItem}
                        handleDelete={handleConfirmDelete}
                    />
                </div>

                <div className="border-t px-4 py-2 text-sm text-gray-500">
                    Total ítems: {detailItems.length}
                </div>
            </Card>

            {/* Drawer para agregar/editar ítems */}
            <DrawerOld
                isOpen={itemDrawerOpen}
                onClose={handleCloseItemDrawer}
                closable={false}
                width={500}
            >
                <div className="flex items-center justify-between mb-4 border-b pb-3">
                    <h5 className="font-semibold text-xl">{editItem ? 'Editar Ítem' : 'Agregar Ítem'}</h5>
                    <button
                        type="button"
                        className="px-2 py-1 text-sm text-gray-500 hover:text-gray-700 rounded"
                        onClick={handleCloseItemDrawer}
                    >
                        X
                    </button>
                </div>

                <SupplyReturnItemForm
                    itemData={editItem}
                    products={products}
                    returnId={returnId}
                    onSubmit={handleStoreItem}
                    onClose={handleCloseItemDrawer}
                />
            </DrawerOld>

            {/* Diálogo de Confirmación de Eliminación (Usando Dialog) */}
            <Dialog
                isOpen={dialogDeleteOpen}
                onClose={closeDeleteDialog}
                onRequestClose={closeDeleteDialog}
            >
                <h5 className="mb-4 text-red-600 font-bold">Confirmar Eliminación</h5>
                <div className="text-gray-600">
                    ¿Está seguro de que desea <span className="font-semibold text-red-600">ELIMINAR</span> este ítem de la devolución? Esta acción no se puede deshacer.
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
                        onClick={handleDeleteItem}
                        icon={<HiOutlineTrash />}
                    >
                        Sí, Eliminar
                    </Button>
                </div>
            </Dialog>
        </>
    );
};

export default SupplyReturnItemDetail;