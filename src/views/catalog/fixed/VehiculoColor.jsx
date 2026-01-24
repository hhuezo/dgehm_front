import React from 'react'
import FixedCatalogCrud from './components/FixedCatalogCrud'
import {
    apiGetVehicleColors,
    apiStoreVehicleColor,
    apiDeleteVehicleColor,
} from 'services/FixedAssetService'

const VehiculoColor = () => (
    <FixedCatalogCrud
        title="Vehículo color"
        subtitle="Gestión de colores de vehículo"
        listTitle="Listado de colores de vehículo"
        addButtonLabel="Añadir color"
        itemType="el color de vehículo"
        formLabel="Nombre"
        formPlaceholder="Ej: Blanco, Negro, Rojo"
        titleCreate="Nuevo color de vehículo"
        titleEdit="Editar color de vehículo"
        apiGet={apiGetVehicleColors}
        apiStore={apiStoreVehicleColor}
        apiDelete={apiDeleteVehicleColor}
    />
)

export default VehiculoColor
