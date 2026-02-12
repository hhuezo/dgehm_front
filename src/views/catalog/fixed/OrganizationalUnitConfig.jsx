import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import {
    setCurrentRouteTitle,
    setCurrentRouteSubtitle,
    setCurrentRouteInfo,
    setCurrentRouteOptions,
} from 'store/base/commonSlice'
import { Card, Notification, toast } from 'components/ui'
import { HiChevronDown, HiChevronRight, HiOfficeBuilding } from 'react-icons/hi'
import {
    apiGetOrganizationalUnitsTree,
    apiAssignOrganizationalUnitParent,
} from 'services/FixedAssetService'

const DRAG_PAYLOAD_KEY = 'application/x-org-unit-payload'
const INDENT_PX = 28

// Estilo Monday: gutter a la izquierda = soltar ahí sube nivel (mismo nivel que la fila); área de contenido = soltar ahí la deja como hija
function TreeNode({ node, level = 0, onMove, onDragOver, onDragLeave }) {
    const [expanded, setExpanded] = useState(true)
    const [gutterOver, setGutterOver] = useState(false)
    const [contentOver, setContentOver] = useState(false)
    const hasChildren = node.children && node.children.length > 0
    const displayName = [node.name, node.abbreviation && `(${node.abbreviation})`]
        .filter(Boolean)
        .join(' ')
    const typeName = node.type?.name ? ` — ${node.type.name}` : ''
    const parentId = node.fa_organizational_unit_id ?? null

    const handleDragStart = (e) => {
        e.dataTransfer.setData(
            DRAG_PAYLOAD_KEY,
            JSON.stringify({ id: node.id, parentId })
        )
        e.dataTransfer.effectAllowed = 'move'
        e.stopPropagation()
    }

    const preventAndAllow = (e) => {
        e.preventDefault()
        e.stopPropagation()
        e.dataTransfer.dropEffect = 'move'
    }

    const handleGutterDragOver = (e) => {
        preventAndAllow(e)
        setGutterOver(true)
        setContentOver(false)
        onDragOver?.()
    }

    const handleContentDragOver = (e) => {
        preventAndAllow(e)
        setContentOver(true)
        setGutterOver(false)
        onDragOver?.()
    }

    const handleDragLeave = (e) => {
        e.preventDefault()
        setGutterOver(false)
        setContentOver(false)
        onDragLeave?.()
    }

    const doDrop = (e, newParentId) => {
        e.preventDefault()
        e.stopPropagation()
        setGutterOver(false)
        setContentOver(false)
        onDragLeave?.()
        const raw = e.dataTransfer.getData(DRAG_PAYLOAD_KEY)
        if (!raw) return
        try {
            const { id: draggedId } = JSON.parse(raw)
            if (Number(draggedId) === node.id) return
            onMove(draggedId, newParentId)
        } catch {
            // ignore
        }
    }

    return (
        <div className="select-none" style={{ marginLeft: level * INDENT_PX }}>
            <div className="flex items-stretch rounded border border-gray-200 overflow-hidden min-h-[44px]">
                {/* Gutter: soltar aquí = mismo nivel que esta fila (subir nivel) */}
                <div
                    className={`
                        flex-shrink-0 w-7 flex items-center justify-center border-r border-gray-200
                        ${gutterOver ? 'bg-amber-100 border-amber-400' : 'bg-gray-50 hover:bg-gray-100'}
                    `}
                    style={{ width: INDENT_PX }}
                    onDragOver={handleGutterDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => doDrop(e, parentId)}
                    title="Soltar aquí: mismo nivel (subir nivel)"
                />
                {/* Contenido: arrastrable y zona de soltar como hijo */}
                <div
                    className={`
                        flex-1 flex items-center gap-2 py-2 px-3 min-w-0 cursor-grab active:cursor-grabbing
                        ${contentOver ? 'bg-blue-100 border-blue-300' : 'bg-white hover:bg-gray-50'}
                    `}
                    draggable
                    onDragStart={handleDragStart}
                    onDragOver={handleContentDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => doDrop(e, node.id)}
                    title="Arrastrar para mover; soltar aquí: como hija de esta unidad"
                >
                    <button
                        type="button"
                        className="p-0.5 text-gray-500 hover:text-gray-700 flex-shrink-0"
                        onClick={(ev) => {
                            ev.stopPropagation()
                            setExpanded((e) => !e)
                        }}
                    >
                        {hasChildren ? (
                            expanded ? (
                                <HiChevronDown className="text-lg" />
                            ) : (
                                <HiChevronRight className="text-lg" />
                            )
                        ) : (
                            <span className="inline-block w-5" />
                        )}
                    </button>
                    <HiOfficeBuilding className="text-gray-400 flex-shrink-0" />
                    <span className="font-medium text-gray-800 truncate">
                        {displayName}
                    </span>
                    {typeName && (
                        <span className="text-sm text-gray-500 truncate hidden sm:inline">
                            {typeName}
                        </span>
                    )}
                    {node.code && (
                        <span className="text-xs text-gray-400 ml-1 flex-shrink-0">
                            {node.code}
                        </span>
                    )}
                </div>
            </div>
            {hasChildren && expanded && (
                <div className="mt-0.5">
                    {node.children.map((child) => (
                        <TreeNode
                            key={child.id}
                            node={child}
                            level={level + 1}
                            onMove={onMove}
                            onDragOver={onDragOver}
                            onDragLeave={onDragLeave}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

const OrganizationalUnitConfig = () => {
    const dispatch = useDispatch()
    const [tree, setTree] = useState([])
    const [loading, setLoading] = useState(true)

    const setRouteInfo = useCallback(() => {
        dispatch(setCurrentRouteTitle('Unidad organizativa config'))
        dispatch(setCurrentRouteSubtitle('Árbol de unidades organizativas'))
        dispatch(setCurrentRouteInfo(''))
        dispatch(setCurrentRouteOptions(''))
    }, [dispatch])

    const fetchTree = useCallback(async () => {
        setLoading(true)
        try {
            const res = await apiGetOrganizationalUnitsTree()
            if (res.data?.success) {
                setTree(res.data.data ?? [])
            } else {
                setTree(Array.isArray(res.data) ? res.data : res.data?.data ?? [])
            }
        } catch (error) {
            toast.push(
                <Notification title="Error" type="danger">
                    Error al cargar el árbol de unidades
                </Notification>
            )
            setTree([])
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        setRouteInfo()
        fetchTree()
    }, [setRouteInfo, fetchTree])

    const handleMoveToParent = useCallback(
        async (draggedId, newParentId) => {
            try {
                const res = await apiAssignOrganizationalUnitParent(draggedId, {
                    fa_organizational_unit_id: newParentId,
                })
                if (res.data?.success) {
                    toast.push(
                        <Notification title="Correcto" type="success">
                            {res.data.message || 'Unidad padre asignada correctamente.'}
                        </Notification>
                    )
                    fetchTree()
                } else {
                    toast.push(
                        <Notification title="Error" type="danger">
                            {res.data?.message || 'No se pudo asignar la unidad padre.'}
                        </Notification>
                    )
                }
            } catch (error) {
                const msg =
                    error.response?.data?.message ||
                    'Error al asignar la unidad padre.'
                toast.push(
                    <Notification title="Error" type="danger">
                        {msg}
                    </Notification>
                )
            }
        },
        [fetchTree]
    )

    return (
        <Card borderless className="shadow-none border-0">
            <div className="border-b px-4 py-3">
                <h4 className="text-lg font-semibold">
                    Árbol de unidades organizativas
                </h4>
                <p className="text-sm text-gray-500 mt-1">
                    Arrastra la fila por el contenido. Suelta en el <strong className="text-gray-700">canal izquierdo</strong> de una fila para subir nivel (mismo nivel que esa fila; en filas de nivel raíz queda sin padre);
                    suelta en el <strong className="text-gray-700">contenido</strong> para que sea hija de esa unidad.
                </p>
            </div>

            {loading ? (
                <div className="p-8 text-center text-gray-500">
                    Cargando árbol...
                </div>
            ) : (
                <div className="p-4">
                    <div className="space-y-0.5">
                        {tree.length === 0 ? (
                            <p className="text-gray-500 py-4 text-center">
                                No hay unidades organizativas.
                            </p>
                        ) : (
                            tree.map((node) => (
                                <TreeNode
                                    key={node.id}
                                    node={node}
                                    onMove={handleMoveToParent}
                                    onDragOver={() => {}}
                                    onDragLeave={() => {}}
                                />
                            ))
                        )}
                    </div>
                </div>
            )}
        </Card>
    )
}

export default OrganizationalUnitConfig
