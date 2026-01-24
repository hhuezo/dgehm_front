import React from 'react'
import FixedCatalogCrud from './components/FixedCatalogCrud'
import {
    apiGetOrganizationalUnits,
    apiStoreOrganizationalUnit,
    apiDeleteOrganizationalUnit,
} from 'services/FixedAssetService'

const OrganizationalUnit = () => (
    <FixedCatalogCrud
        title="Unidad organizativa"
        subtitle="Gestión de unidades organizativas"
        listTitle="Listado de unidades organizativas"
        addButtonLabel="Añadir unidad organizativa"
        itemType="la unidad organizativa"
        formLabel="Nombre"
        formPlaceholder="Ej: Dirección General"
        titleCreate="Nueva unidad organizativa"
        titleEdit="Editar unidad organizativa"
        apiGet={apiGetOrganizationalUnits}
        apiStore={apiStoreOrganizationalUnit}
        apiDelete={apiDeleteOrganizationalUnit}
    />
)

export default OrganizationalUnit
