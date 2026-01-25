import React from 'react'
import FixedCatalogCrud from './components/FixedCatalogCrud'
import {
    apiGetCategories,
    apiStoreCategory,
    apiDeleteCategory,
} from 'services/FixedAssetService'

const Category = () => (
    <FixedCatalogCrud
        title="Categoría"
        subtitle="Gestión de categorías de activo fijo"
        listTitle="Listado de categorías"
        addButtonLabel="Añadir categoría"
        itemType="la categoría"
        formLabel="Nombre"
        formPlaceholder="Ej: Muebles, Equipos"
        titleCreate="Nueva categoría"
        titleEdit="Editar categoría"
        apiGet={apiGetCategories}
        apiStore={apiStoreCategory}
        apiDelete={apiDeleteCategory}
    />
)

export default Category
