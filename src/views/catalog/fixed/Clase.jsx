import React from 'react'
import FixedCatalogCrud from './components/FixedCatalogCrud'
import {
    apiGetClasses,
    apiStoreClass,
    apiDeleteClass,
} from 'services/FixedAssetService'

const Clase = () => (
    <FixedCatalogCrud
        title="Clase"
        subtitle="Gestión de clases de activo"
        listTitle="Listado de clases"
        addButtonLabel="Añadir clase"
        itemType="la clase"
        formLabel="Nombre"
        formPlaceholder="Ej: Equipo de cómputo"
        titleCreate="Nueva clase"
        titleEdit="Editar clase"
        apiGet={apiGetClasses}
        apiStore={apiStoreClass}
        apiDelete={apiDeleteClass}
    />
)

export default Clase
