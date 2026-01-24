import React from 'react'
import FixedCatalogCrud from './components/FixedCatalogCrud'
import {
    apiGetSpecifics,
    apiStoreSpecific,
    apiDeleteSpecific,
} from 'services/FixedAssetService'

const Especifico = () => (
    <FixedCatalogCrud
        title="Específico"
        subtitle="Gestión de específicos"
        listTitle="Listado de específicos"
        addButtonLabel="Añadir específico"
        itemType="el específico"
        formLabel="Nombre"
        formPlaceholder="Ej: Específico 1"
        titleCreate="Nuevo específico"
        titleEdit="Editar específico"
        apiGet={apiGetSpecifics}
        apiStore={apiStoreSpecific}
        apiDelete={apiDeleteSpecific}
    />
)

export default Especifico
