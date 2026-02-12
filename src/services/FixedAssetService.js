import ApiService from './ApiService'

function createCrud(endpoint) {
    return {
        get: (params) =>
            ApiService.fetchData({
                url: `/${endpoint}`,
                method: 'GET',
                params,
            }),
        store: (data) => {
            let url = `/${endpoint}`
            let method = 'POST'
            if (data.id) {
                url = `/${endpoint}/${data.id}`
                method = 'PUT'
            }
            return ApiService.fetchData({ url, method, data })
        },
        delete: (id) =>
            ApiService.fetchData({
                url: `/${endpoint}/${id}`,
                method: 'DELETE',
            }),
    }
}

// Clases (AssetClass)
const classes = createCrud('classes')
export const apiGetClasses = classes.get
export const apiStoreClass = classes.store
export const apiDeleteClass = classes.delete

// Instituciones
const institutions = createCrud('institutions')
export const apiGetInstitutions = institutions.get
export const apiStoreInstitution = institutions.store
export const apiDeleteInstitution = institutions.delete

// Categorías
const categories = createCrud('categories')
export const apiGetCategories = categories.get
export const apiStoreCategory = categories.store
export const apiDeleteCategory = categories.delete

// Tipos de unidad organizativa
const organizationalUnitTypes = createCrud('organizational_unit_types')
export const apiGetOrganizationalUnitTypes = organizationalUnitTypes.get
export const apiStoreOrganizationalUnitType = organizationalUnitTypes.store
export const apiDeleteOrganizationalUnitType = organizationalUnitTypes.delete

// Unidades organizativas
const organizationalUnits = createCrud('organizational_units')
export const apiGetOrganizationalUnits = organizationalUnits.get
export const apiStoreOrganizationalUnit = organizationalUnits.store
export const apiDeleteOrganizationalUnit = organizationalUnits.delete

export const apiGetOrganizationalUnitsTree = () =>
    ApiService.fetchData({ url: '/organizational_units/tree', method: 'GET' })

export const apiAssignOrganizationalUnitParent = (id, data) =>
    ApiService.fetchData({
        url: `/organizational_units/${id}/parent`,
        method: 'PUT',
        data,
    })

// Orígenes / Procedencia
const origins = createCrud('origins')
export const apiGetOrigins = origins.get
export const apiStoreOrigin = origins.store
export const apiDeleteOrigin = origins.delete

// Condiciones físicas / Estado físico
const physicalConditions = createCrud('physical_conditions')
export const apiGetPhysicalConditions = physicalConditions.get
export const apiStorePhysicalCondition = physicalConditions.store
export const apiDeletePhysicalCondition = physicalConditions.delete

// Específicos
const specifics = createCrud('specifics')
export const apiGetSpecifics = specifics.get
export const apiStoreSpecific = specifics.store
export const apiDeleteSpecific = specifics.delete

// Marcas de vehículo
const vehicleBrands = createCrud('vehicle_brands')
export const apiGetVehicleBrands = vehicleBrands.get
export const apiStoreVehicleBrand = vehicleBrands.store
export const apiDeleteVehicleBrand = vehicleBrands.delete

// Colores de vehículo
const vehicleColors = createCrud('vehicle_colors')
export const apiGetVehicleColors = vehicleColors.get
export const apiStoreVehicleColor = vehicleColors.store
export const apiDeleteVehicleColor = vehicleColors.delete

// Tipos de tracción / Vehículo tracción
const vehicleDriveTypes = createCrud('vehicle_drive_types')
export const apiGetVehicleDriveTypes = vehicleDriveTypes.get
export const apiStoreVehicleDriveType = vehicleDriveTypes.store
export const apiDeleteVehicleDriveType = vehicleDriveTypes.delete

// Tipos de vehículo
const vehicleTypes = createCrud('vehicle_types')
export const apiGetVehicleTypes = vehicleTypes.get
export const apiStoreVehicleType = vehicleTypes.store
export const apiDeleteVehicleType = vehicleTypes.delete

// Activos fijos
const fixedAssets = createCrud('fixed_assets')
export const apiGetFixedAssets = fixedAssets.get
export const apiStoreFixedAsset = fixedAssets.store
export const apiDeleteFixedAsset = fixedAssets.delete
