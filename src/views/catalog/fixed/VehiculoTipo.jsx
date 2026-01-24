import React from 'react'
import FixedCatalogCrud from './components/FixedCatalogCrud'
import {
    apiGetVehicleTypes,
    apiStoreVehicleType,
    apiDeleteVehicleType,
} from 'services/FixedAssetService'

const VehiculoTipo = () => (
    <FixedCatalogCrud
        title="Vehículo tipo"
        subtitle="Gestión de tipos de vehículo"
        listTitle="Listado de tipos de vehículo"
        addButtonLabel="Añadir tipo"
        itemType="el tipo de vehículo"
        formLabel="Nombre"
        formPlaceholder="Ej: Automóvil, Camión"
        titleCreate="Nuevo tipo de vehículo"
        titleEdit="Editar tipo de vehículo"
        apiGet={apiGetVehicleTypes}
        apiStore={apiStoreVehicleType}
        apiDelete={apiDeleteVehicleType}
    />
)

export default VehiculoTipo
