// PurchaseOrderDrawers.jsx

import React from 'react'
import Drawer from 'components/ui/Drawer/Drawer'
import * as Yup from 'yup'

import PurchaseOrderForm from './PurchaseOrderForm'

const DrawerHeader = ({ title, onClose }) => (
    <div className="flex items-center justify-between mb-4 border-b pb-3">
        <h5 className="font-semibold text-xl">{title}</h5>
        <button type="button" className="px-2 py-1 text-sm text-gray-500 hover:text-gray-700 rounded" onClick={onClose}>
            X
        </button>
    </div>
);

const PurchaseOrderDrawers = ({
    drawerOpen, editDrawerOpen, viewDrawerOpen,
    selectedOrder, orderToView, suppliers,
    handleCloseDrawer, handleCloseEditDrawer, handleCloseViewDrawer,
    handleCreateOrder, handleUpdateOrder, validationSchema
}) => {

    return (
        <>
            {/* DRAWER DE CREACIÓN */}
            <Drawer isOpen={drawerOpen} onClose={handleCloseDrawer} closable={false}>
                <DrawerHeader title="Nueva Orden de Compra" onClose={handleCloseDrawer} />
                {selectedOrder && (
                    <PurchaseOrderForm
                        initialValues={selectedOrder}
                        validationSchema={validationSchema}
                        onSubmit={handleCreateOrder}
                        onClose={handleCloseDrawer}
                        suppliers={suppliers}
                    />
                )}
            </Drawer>

            {/* DRAWER DE EDICIÓN */}
            <Drawer isOpen={editDrawerOpen} onClose={handleCloseEditDrawer} closable={false}>
                <DrawerHeader title="Editar Orden de Compra" onClose={handleCloseEditDrawer} />
                {selectedOrder && (
                    <PurchaseOrderForm
                        initialValues={selectedOrder}
                        validationSchema={validationSchema}
                        onSubmit={handleUpdateOrder}
                        onClose={handleCloseEditDrawer}
                        suppliers={suppliers}
                    />
                )}
            </Drawer>

            {/* DRAWER DE VER DETALLES (SHOW) */}
            <Drawer isOpen={viewDrawerOpen} onClose={handleCloseViewDrawer} closable={false}>
                <DrawerHeader title={`Detalles de la Orden: ${orderToView?.order_number || ''}`} onClose={handleCloseViewDrawer} />
                {orderToView ? (
                    <PurchaseOrderForm
                        initialValues={orderToView}
                        // Usamos un esquema vacío, ya que no se necesita validación en modo lectura
                        validationSchema={Yup.object()}
                        onSubmit={() => { }}
                        onClose={handleCloseViewDrawer}
                        disabled={true} // Deshabilitamos la interacción
                        showOnly={true} // Cambiamos la etiqueta del botón
                        suppliers={suppliers}
                    />
                ) : (
                    <p className="text-center text-gray-500 py-6">Cargando detalles de la Orden...</p>
                )}
            </Drawer>
        </>
    )
}

export default PurchaseOrderDrawers