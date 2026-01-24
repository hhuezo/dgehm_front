import React, { useEffect, useCallback } from 'react'
import { useDispatch } from 'react-redux'

import {
    setCurrentRouteTitle,
    setCurrentRouteSubtitle,
    setCurrentRouteInfo,
    setCurrentRouteOptions,
} from 'store/base/commonSlice'

import { Card } from 'components/ui'

const CatalogPlaceholder = ({ title, subtitle = 'Gestión de catálogo' }) => {
    const dispatch = useDispatch()

    const handleChangeRouteInfo = useCallback(() => {
        dispatch(setCurrentRouteTitle(title))
        dispatch(setCurrentRouteSubtitle(subtitle))
        dispatch(setCurrentRouteInfo(''))
        dispatch(setCurrentRouteOptions(''))
    }, [dispatch, title, subtitle])

    useEffect(() => {
        handleChangeRouteInfo()
    }, [handleChangeRouteInfo])

    return (
        <Card borderless className="shadow-none border-0">
            <div className="p-6 text-center">
                <h4 className="text-lg font-semibold mb-2">{title}</h4>
                <p className="text-gray-500">Próximamente. Conecte los servicios para gestionar este catálogo.</p>
            </div>
        </Card>
    )
}

export default CatalogPlaceholder
