import React, { useEffect, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { setCurrentRouteTitle,setCurrentRouteSubtitle,setCurrentRouteInfo,setCurrentRouteOptions } from 'store/base/commonSlice'

const Home = () => {

    const dispatch = useDispatch()

    const handleChange = useCallback(() => {
        
        dispatch(setCurrentRouteTitle(''));
        dispatch(setCurrentRouteSubtitle(''));
        dispatch(setCurrentRouteInfo(''));
        dispatch(setCurrentRouteOptions(''));

    }, [ dispatch ])

    useEffect(() => {
        handleChange()
    }, [handleChange])

    return <>
        <div>Home</div>
    </>
}

export default Home
