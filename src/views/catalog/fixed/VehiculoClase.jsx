import React from 'react'
import FixedCatalogCrud from './components/FixedCatalogCrud'
import {
    apiGetVehicleClasses,
    apiStoreVehicleClass,
    apiDeleteVehicleClass,
} from 'services/FixedAssetService'

const VehiculoClase = () => (
    <FixedCatalogCrud
        title="Vehículo clase"
        subtitle="Gestión de clases de vehículo"
        listTitle="Listado de clases de vehículo"
        addButtonLabel="Añadir clase"
        itemType="la clase de vehículo"
        formLabel="Nombre"
        formPlaceholder="Ej: Sedan, Pickup"
        titleCreate="Nueva clase de vehículo"
        titleEdit="Editar clase de vehículo"
        apiGet={apiGetVehicleClasses}
        apiStore={apiStoreVehicleClass}
        apiDelete={apiDeleteVehicleClass}
    />
)

export default VehiculoClase
