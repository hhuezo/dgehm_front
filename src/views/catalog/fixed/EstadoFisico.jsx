import React from 'react'
import FixedCatalogCrud from './components/FixedCatalogCrud'
import {
    apiGetPhysicalConditions,
    apiStorePhysicalCondition,
    apiDeletePhysicalCondition,
} from 'services/FixedAssetService'

const EstadoFisico = () => (
    <FixedCatalogCrud
        title="Estado físico"
        subtitle="Gestión de condiciones físicas"
        listTitle="Listado de estados físicos"
        addButtonLabel="Añadir estado físico"
        itemType="el estado físico"
        formLabel="Nombre"
        formPlaceholder="Ej: Bueno, Regular, Malo"
        titleCreate="Nuevo estado físico"
        titleEdit="Editar estado físico"
        apiGet={apiGetPhysicalConditions}
        apiStore={apiStorePhysicalCondition}
        apiDelete={apiDeletePhysicalCondition}
    />
)

export default EstadoFisico
