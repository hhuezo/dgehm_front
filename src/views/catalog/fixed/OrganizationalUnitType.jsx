import React from 'react'
import FixedCatalogCrud from './components/FixedCatalogCrud'
import {
    apiGetOrganizationalUnitTypes,
    apiStoreOrganizationalUnitType,
    apiDeleteOrganizationalUnitType,
} from 'services/FixedAssetService'

const OrganizationalUnitType = () => (
    <FixedCatalogCrud
        title="Tipo unidad organizativa"
        subtitle="Gestión de tipos de unidad organizativa"
        listTitle="Listado de tipos de unidad organizativa"
        addButtonLabel="Añadir tipo"
        itemType="el tipo de unidad organizativa"
        formLabel="Nombre"
        formPlaceholder="Ej: Departamento"
        titleCreate="Nuevo tipo de unidad organizativa"
        titleEdit="Editar tipo de unidad organizativa"
        apiGet={apiGetOrganizationalUnitTypes}
        apiStore={apiStoreOrganizationalUnitType}
        apiDelete={apiDeleteOrganizationalUnitType}
        createPermission="organizational_unit_types create"
        updatePermission="organizational_unit_types update"
        deletePermission="organizational_unit_types delete"
    />
)

export default OrganizationalUnitType
