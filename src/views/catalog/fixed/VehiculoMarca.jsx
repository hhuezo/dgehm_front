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
        createPermission="vehicle_brands create"
        updatePermission="vehicle_brands update"
        deletePermission="vehicle_brands delete"
    />
)

export default VehiculoMarca
