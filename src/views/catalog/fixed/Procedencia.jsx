import React from 'react'
import FixedCatalogCrud from './components/FixedCatalogCrud'
import {
    apiGetOrigins,
    apiStoreOrigin,
    apiDeleteOrigin,
} from 'services/FixedAssetService'

const Procedencia = () => (
    <FixedCatalogCrud
        title="Procedencia"
        subtitle="Gestión de orígenes / procedencia"
        listTitle="Listado de procedencias"
        addButtonLabel="Añadir procedencia"
        itemType="la procedencia"
        formLabel="Nombre"
        formPlaceholder="Ej: Compra, Donación"
        titleCreate="Nueva procedencia"
        titleEdit="Editar procedencia"
        apiGet={apiGetOrigins}
        apiStore={apiStoreOrigin}
        apiDelete={apiDeleteOrigin}
        createPermission="origins create"
        updatePermission="origins update"
        deletePermission="origins delete"
    />
)

export default Procedencia
