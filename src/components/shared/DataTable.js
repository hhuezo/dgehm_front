import React, { forwardRef, useMemo, useRef, useEffect, useState, useImperativeHandle } from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { Table, Pagination, Select, Checkbox, Alert, Input } from 'components/ui'
import TableRowSkeleton from './loaders/TableRowSkeleton'
import Loading from './Loading'
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel, // Necesario para el filtro en cliente
    getPaginationRowModel, // Necesario para la paginación en cliente
    getSortedRowModel, // Necesario para el ordenamiento en cliente
    flexRender,
} from '@tanstack/react-table'
import { BiFileBlank } from 'react-icons/bi'

const { Tr, Th, Td, THead, TBody, Sorter } = Table

// Componente IndeterminateCheckbox (no modificado, pero aseguramos forwardRef)
const IndeterminateCheckbox = forwardRef((props, ref) => {

    const { indeterminate, onChange, onCheckBoxChange, onIndeterminateCheckBoxChange, ...rest } = props

    const innerRef = useRef(null)

    useEffect(() => {
        if (typeof indeterminate === 'boolean') {
            innerRef.current.indeterminate = !rest.checked && indeterminate
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [innerRef, indeterminate])

    const handleChange = (e) => {
        onChange(e)
        onCheckBoxChange?.(e)
        onIndeterminateCheckBoxChange?.(e)
    }

    return <Checkbox className="mb-0" ref={innerRef} onChange={(_, e) => handleChange(e)} {...rest} />
})


const DataTable = forwardRef((props, ref) => {
    const {
        availableAll,
        skeletonAvatarColumns,
        columns: columnsProp,
        data,
        loading,
        onCheckBoxChange,
        onIndeterminateCheckBoxChange,
        // ** Props de control manual removidas o ignoradas **
        // onPaginationChange, 
        // onSelectChange,
        // onSort, 
        // onSearch, 
        pageSizes,
        selectable,
        skeletonAvatarProps,
        pagingData,
    } = props

    // Usaremos los valores iniciales de pagingData, pero la tabla los gestionará
    const { total } = pagingData;

    // ** NUEVO ESTADO para el filtro global de la tabla **
    const [globalFilter, setGlobalFilter] = useState('');

    // El ordenamiento ahora es manejado por el estado interno de la tabla (no necesitamos un estado propio)

    const pageSizeOption = useMemo(() => {
        // La opción 'Todos' solo tiene sentido si la data es pequeña y cargada en cliente
        let options = pageSizes.map(number => ({ value: number, label: `${number} por página` }));
        // Si tienes toda la data en el cliente, 'total' es data.length.
        if (availableAll) options.push({ value: data.length, label: 'Todos' });
        return options;
    },
        [pageSizes, availableAll, data.length]
    );

    // ************* MANEJADORES DE EVENTOS EN EL CLIENTE *************

    const handleSearchChange = (e) => {
        // 1. **CAMBIO CLAVE:** Actualiza el estado globalFilter, TanStack Table hará el filtro automático
        setGlobalFilter(e.target.value);
    }

    // Los siguientes manejadores siguen siendo necesarios para las filas seleccionables

    const handleCheckBoxChange = (checked, row) => {
        if (!loading) {
            onCheckBoxChange?.(checked, row)
        }
    }

    const handleIndeterminateCheckBoxChange = (checked, rows) => {
        if (!loading) {
            onIndeterminateCheckBoxChange?.(checked, rows)
        }
    }

    // ************* CONSTRUCCIÓN DE COLUMNAS *************
    const hasOldColumnMetaKey = columnsProp.some(col => col.Header || col.accessor || col.Cell)

    const finalColumns = useMemo(() => {

        const columns = columnsProp

        if (selectable) {
            return [
                {
                    id: 'select',
                    header: ({ table }) => (
                        <IndeterminateCheckbox
                            checked={table.getIsAllRowsSelected()}
                            indeterminate={table.getIsSomeRowsSelected()}
                            onChange={table.getToggleAllRowsSelectedHandler()}
                            onIndeterminateCheckBoxChange={(e) => {
                                handleIndeterminateCheckBoxChange(
                                    e.target.checked,
                                    table.getRowModel().rows
                                )
                            }}
                        />
                    ),
                    cell: ({ row }) => (
                        <IndeterminateCheckbox
                            checked={row.getIsSelected()}
                            disabled={!row.getCanSelect()}
                            indeterminate={row.getIsSomeSelected()}
                            onChange={row.getToggleSelectedHandler()}
                            onCheckBoxChange={(e) =>
                                handleCheckBoxChange(
                                    e.target.checked,
                                    row.original
                                )
                            }
                        />
                    ),
                },
                ...columns
            ]
        }
        return columns
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [columnsProp, selectable])

    // ************* CONFIGURACIÓN DE TanStack Table *************
    const table = useReactTable({
        data,
        columns: hasOldColumnMetaKey ? [] : finalColumns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(), // Habilita el filtrado en cliente
        getPaginationRowModel: getPaginationRowModel(), // Habilita la paginación en cliente
        getSortedRowModel: getSortedRowModel(), // Habilita el ordenamiento en cliente

        // ** CAMBIO CLAVE: Deshabilitar manejo manual **
        manualPagination: false,
        manualSorting: false,

        onGlobalFilterChange: setGlobalFilter, // Conecta el estado de búsqueda
        initialState: {
            pagination: { pageSize: pagingData.pageSize, pageIndex: pagingData.pageIndex - 1 },
        },
        state: {
            globalFilter, // Pasa el valor del filtro
        },
        // Opcional: Define cómo debe filtrar (por defecto usa fuzzysort, 'includesString' es simple)
        // globalFilterFn: 'includesString', 
    })

    // ************* VALORES INTERNOS DE LA TABLA *************
    // Usamos los valores internos de la tabla para el paginador
    const { pageSize: internalPageSize, pageIndex: internalPageIndex } = table.getState().pagination
    const internalTotalRows = table.getFilteredRowModel().rows.length // Total de filas DESPUÉS del filtro
    const currentPage = internalPageIndex + 1; // Ajuste 0-based a 1-based

    const resetSorting = () => {
        table.resetSorting()
    };

    const resetSelected = () => {
        table.toggleAllRowsSelected(false);
    }

    useImperativeHandle(ref, () => ({
        resetSorting,
        resetSelected
    }));

    if (hasOldColumnMetaKey) {
        const message = 'You are using old react-table v7 column config, please use v8 column config instead, refer to our demo or https://tanstack.com/table/v8'
        if (process.env.NODE_ENV === 'development') { console.warn(message) }
        return (<Alert>{message}</Alert>)
    }

    // ************* RENDERIZADO *************
    return (
        <Loading loading={loading && data.length !== 0} type="cover">
            {/* Campo de búsqueda */}
            <div className="mb-4">
                <Input
                    type="text"
                    placeholder="Buscar..."
                    value={globalFilter} // Usa el estado globalFilter
                    onChange={handleSearchChange}
                    prefix={<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true" className="w-4 h-4 text-gray-400" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>}
                />
            </div>

            <Table>
                <THead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <Tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <Th
                                    key={header.id}
                                    colSpan={header.colSpan}
                                    className={header.column.columnDef.headerClassName}
                                >
                                    {header.isPlaceholder ? null : (
                                        <div
                                            className={
                                                classNames(
                                                    header.column.getCanSort() && 'cursor-pointer select-none point',
                                                    loading && 'pointer-events-none'
                                                )
                                            }
                                            // ** Ordenamiento interno de la tabla **
                                            onClick={header.column.getToggleSortingHandler()}
                                        >
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                            {header.column.getCanSort() && <Sorter sort={header.column.getIsSorted()} />}
                                        </div>
                                    )}
                                </Th>
                            ))}
                        </Tr>
                    ))}
                </THead>
                {loading && data.length === 0 ? (
                    <TableRowSkeleton
                        columns={finalColumns.length}
                        rows={internalPageSize}
                        avatarInColumns={skeletonAvatarColumns}
                        avatarProps={skeletonAvatarProps}
                    />
                ) : (
                    <TBody>
                        {/* 2. **CAMBIO CLAVE:** Iterar sobre las filas paginadas de la tabla */}
                        {table.getRowModel().rows.map((row) => (
                            <Tr key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <Td key={cell.id} className={cell.column.columnDef.cellClassName}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </Td>
                                ))}
                            </Tr>
                        ))}
                    </TBody>
                )}
            </Table>
            <div className="flex items-center justify-between mt-4">
                <Pagination
                    pageSize={internalPageSize}
                    currentPage={currentPage}
                    total={internalTotalRows} // Usamos el total de filas después de filtrar
                    // ** Paginación interna de la tabla **
                    onChange={table.setPageIndex} // Pasa el índice 0-based
                />
                <div style={{ minWidth: 130 }}>
                    <Select
                        size="sm"
                        menuPlacement="top"
                        isSearchable={false}
                        value={pageSizeOption.filter((option) => option.value === internalPageSize)}
                        options={pageSizeOption}
                        // ** Selector de tamaño de página interno de la tabla **
                        onChange={(option) => table.setPageSize(Number(option.value))}
                    />
                </div>
            </div>
            {/* Mensaje cuando no hay datos (total de filas filtradas es 0) */}
            {internalTotalRows === 0 && !loading && (
                <div className="flex justify-between mt-5 text-lg font-semibold">
                    <div className="flex justify-between gap-5 items-center">
                        <BiFileBlank />
                        <span>No hay datos que mostrar</span>
                    </div>
                </div>
            )}
        </Loading>
    );
})

DataTable.propTypes = {
    // ... (otras PropTypes)
    columns: PropTypes.array,
    data: PropTypes.array,
    loading: PropTypes.bool,
    onCheckBoxChange: PropTypes.func,
    onIndeterminateCheckBoxChange: PropTypes.func,
    // onPaginationChange: PropTypes.func, // REMOVIDO: Ya no es manual
    // onSelectChange: PropTypes.func,     // REMOVIDO: Ya no es manual
    // onSort: PropTypes.func,             // REMOVIDO: Ya no es manual
    // onSearch: PropTypes.func,           // REMOVIDO: Ya no es manual
    pageSizes: PropTypes.arrayOf(PropTypes.number),
    selectable: PropTypes.bool,
    skeletonAvatarColumns: PropTypes.arrayOf(PropTypes.number),
    skeletonAvatarProps: PropTypes.object,
    pagingData: PropTypes.shape({
        total: PropTypes.number,
        pageIndex: PropTypes.number,
        pageSize: PropTypes.number,
        paginate: PropTypes.number
    }),
}

DataTable.defaultProps = {
    pageSizes: [10, 25, 50, 100],
    pagingData: {
        total: 0,
        pageIndex: 1,
        pageSize: 10,
        paginate: 10
    },
    data: [],
    columns: [],
    selectable: false,
    loading: false,
}

export default DataTable