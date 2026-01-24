import React from 'react'
import FixedCatalogCrud from './components/FixedCatalogCrud'
import {
    apiGetVehicleBrands,
    apiStoreVehicleBrand,
    apiDeleteVehicleBrand,
} from 'services/FixedAssetService'

const VehiculoMarca = () => (
    <FixedCatalogCrud
        title="Vehículo marca"
        subtitle="Gestión de marcas de vehículo"
        listTitle="Listado de marcas de vehículo"
        addButtonLabel="Añadir marca"
        itemType="la marca de vehículo"
        formLabel="Nombre"
        formPlaceholder="Ej: Toyota, Nissan"
        titleCreate="Nueva marca de vehículo"
        titleEdit="Editar marca de vehículo"
        apiGet={apiGetVehicleBrands}
        apiStore={apiStoreVehicleBrand}
        apiDelete={apiDeleteVehicleBrand}
    />
)

export default VehiculoMarca
