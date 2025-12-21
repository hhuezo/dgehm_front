import { useEffect, useMemo, useState } from 'react'
import { apiGetEmployeePhoto } from 'services/AdministrationService'

const photoCache = new Map()
function makeKey(employeeId, params) {
    const qs = new URLSearchParams(
        Object.entries(params || {}).reduce((acc, [k, v]) => {
            if (v !== undefined && v !== null) acc[k] = String(v)
            return acc
        }, {})
    ).toString()
    return `${employeeId}?${qs}`
}

export default function useEmployeePhoto(employeeId, params) {
    const key = useMemo(
        () => makeKey(employeeId, params),
        [employeeId, JSON.stringify(params)]
    )
    const [src, setSrc] = useState(() => photoCache.get(key) || null)
    const [error, setError] = useState(null)

    useEffect(() => {
        let cancelled = false

        if (!employeeId) {
            setSrc(null)
            return
        }

        const cached = photoCache.get(key)
        if (cached) {
            setSrc(cached)
            return
        }

        apiGetEmployeePhoto(employeeId, params)
            .then((res) => {
                const blob = res.data
                const objectUrl = URL.createObjectURL(blob)
                photoCache.set(key, objectUrl)
                if (!cancelled) setSrc(objectUrl)
            })
            .catch((e) => {
                console.error('photo fetch error:', e)
                if (!cancelled) setError(e)
            })

        return () => {
            cancelled = true
        }
    }, [employeeId, key])

    return { src, error }
}