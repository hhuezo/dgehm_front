import React from 'react'
import FixedCatalogCrud from './components/FixedCatalogCrud'
import {
    apiGetVehicleDriveTypes,
    apiStoreVehicleDriveType,
    apiDeleteVehicleDriveType,
} from 'services/FixedAssetService'

const VehiculoTraccion = () => (
    <FixedCatalogCrud
        title="Vehículo tracción"
        subtitle="Gestión de tipos de tracción"
        listTitle="Listado de tipos de tracción"
        addButtonLabel="Añadir tipo de tracción"
        itemType="el tipo de tracción"
        formLabel="Nombre"
        formPlaceholder="Ej: 4x2, 4x4"
        titleCreate="Nuevo tipo de tracción"
        titleEdit="Editar tipo de tracción"
        apiGet={apiGetVehicleDriveTypes}
        apiStore={apiStoreVehicleDriveType}
        apiDelete={apiDeleteVehicleDriveType}
    />
)

export default VehiculoTraccion
