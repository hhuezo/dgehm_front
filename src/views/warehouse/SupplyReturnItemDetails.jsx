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
    apiGetSupplyReturnDetail,
    apiStoreSupplyReturnItem,
    apiDeleteSupplyReturnItem,
    apiGetProducts
} from 'services/WareHouseServise';

import { Card, Notification, toast, Button, Dialog, Spinner, Tag } from 'components/ui';
import { HiOutlineTrash } from 'react-icons/hi';

import SupplyReturnItemManagement from './components/SupplyReturnItemManagement';
import { DetailItem } from './components/SupplyReturnUtils';


const SupplyReturnItemDetails = () => {
    const { id: returnId } = useParams();
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(true);
    const [headerData, setHeaderData] = useState(null);
    const [detailItems, setDetailItems] = useState([]);
    const [products, setProducts] = useState([]);

    const [itemDrawerOpen, setItemDrawerOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    const [dialogDeleteOpen, setDialogDeleteOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);


    const handleSetHeader = useCallback(() => {
        dispatch(setCurrentRouteTitle(`Devolución #${returnId}`));
        dispatch(setCurrentRouteSubtitle('Detalles y gestión de ítems devueltos'));
        dispatch(setCurrentRouteInfo(''));
        dispatch(setCurrentRouteOptions(''));
    }, [dispatch, returnId]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const resHeader = await apiGetSupplyReturn(returnId);
            if (resHeader.data.success) {
                setHeaderData(resHeader.data.data);
            }

            const resDetail = await apiGetSupplyReturnDetail(returnId);
            if (resDetail.data.success) {
                setDetailItems(resDetail.data.data || []);
            }

            const resProducts = await apiGetProducts();
            if (resProducts.data.success) {
                const mappedProducts = resProducts.data.data.map(p => ({
                    label: p.name,
                    value: p.id,
                }));
                setProducts(mappedProducts);
            }
        } catch (error) {
            toast.push(<Notification title="Error" type="danger">Error al cargar datos de la devolución.</Notification>);
        } finally {
            setLoading(false);
        }
    };

    const refreshData = () => {
        fetchData();
    };

    useEffect(() => {
        handleSetHeader();
        if (returnId) {
            fetchData();
        } else {
            setLoading(false);
        }
    }, [handleSetHeader, returnId]);


    const handleAddItem = () => {
        setEditingItem(null);
        setItemDrawerOpen(true);
    };

    const handleEditItem = (item) => {
        setEditingItem(item);
        setItemDrawerOpen(true);
    };

    const handleCloseItemDrawer = () => {
        setItemDrawerOpen(false);
        setEditingItem(null);
    };

    const handleStoreItem = async (values, actions) => {
        const payload = { ...values, supply_return_id: returnId };
        try {
            const res = await apiStoreSupplyReturnItem(payload);

            if (res.data.success) {
                toast.push(<Notification title="Correcto" type="success">Ítem de devolución guardado correctamente.</Notification>);
                handleCloseItemDrawer();
                refreshData();
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
                refreshData();
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

            <SupplyReturnItemManagement
                supplyReturnId={returnId}
                detailItems={detailItems}
                products={products}

                drawerOpen={itemDrawerOpen}
                editingItem={editingItem}
                onDrawerClose={handleCloseItemDrawer}
                onFormSubmit={handleStoreItem}

                onAddItem={handleAddItem}
                onEditItem={handleEditItem}
                onDeleteConfirm={handleConfirmDelete}
            />

            <Dialog
                isOpen={dialogDeleteOpen}
                onClose={closeDeleteDialog}
                onRequestClose={closeDeleteDialog}
            >
                <h5 className="mb-4 text-red-600 font-bold">Confirmar Eliminación</h5>
                <div className="text-gray-600">
                    ¿Está seguro de que desea <span className="font-semibold text-red-600">ELIMINAR</span> este ítem de la devolución? La acción no se puede deshacer.
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

export default SupplyReturnItemDetails;