import React from 'react'
import FixedCatalogCrud from './components/FixedCatalogCrud'
import {
    apiGetInstitutions,
    apiStoreInstitution,
    apiDeleteInstitution,
} from 'services/FixedAssetService'

const Institution = () => (
    <FixedCatalogCrud
        title="Institución"
        subtitle="Gestión de instituciones"
        listTitle="Listado de instituciones"
        addButtonLabel="Añadir institución"
        itemType="la institución"
        formLabel="Nombre de la institución"
        formPlaceholder="Ej: Ministerio de Salud"
        titleCreate="Nueva institución"
        titleEdit="Editar institución"
        apiGet={apiGetInstitutions}
        apiStore={apiStoreInstitution}
        apiDelete={apiDeleteInstitution}
    />
)

export default Institution
