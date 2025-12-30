import React, { forwardRef, useMemo, useRef, useEffect, useState, useImperativeHandle } from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { Table, Pagination, Select, Checkbox, Alert } from 'components/ui' // Importamos sin Input
import TableRowSkeleton from './loaders/TableRowSkeleton'
import Loading from './Loading'
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    flexRender,
} from '@tanstack/react-table'
import { BiFileBlank } from 'react-icons/bi'

const { Tr, Th, Td, THead, TBody, Sorter } = Table

// Componente IndeterminateCheckbox (sin cambios)
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
        pageSizes,
        selectable,
        skeletonAvatarProps,
        pagingData,
    } = props

    const { total } = pagingData;

    // ** LÓGICA ELIMINADA: ELIMINAR el estado `globalFilter` y su manejador `handleSearchChange` **

    const pageSizeOption = useMemo(() => {
        let options = pageSizes.map(number => ({ value: number, label: `${number} por página` }));
        if (availableAll) options.push({ value: data.length, label: 'Todos' });
        return options;
    },
        [pageSizes, availableAll, data.length]
    );

    // ************* MANEJADORES DE EVENTOS EN EL CLIENTE *************

    // ** LÓGICA ELIMINADA: Eliminado `handleSearchChange` **

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
        // ... (lógica de columnas y selectable sin cambios)
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
        // *** CAMBIOS CLAVE: Deshabilitar el filtro y remover lógica de estado ***
        // 1. Ya no se usa getFilteredRowModel() ya que no habrá filtro global
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),

        manualPagination: false,
        manualSorting: false,

        // 2. Se remueve onGlobalFilterChange y el estado globalFilter del objeto state
        // onGlobalFilterChange: setGlobalFilter, 
        initialState: {
            pagination: { pageSize: pagingData.pageSize, pageIndex: pagingData.pageIndex - 1 },
        },
        state: {
            // Se remueve globalFilter: globalFilter
        },
        // Opcional: Si quieres un filtro por columna, aquí podrías agregarlo
    })

    // ************* VALORES INTERNOS DE LA TABLA *************
    // El total ahora es simplemente el total de filas, ya no filtradas.
    const { pageSize: internalPageSize, pageIndex: internalPageIndex } = table.getState().pagination
    const internalTotalRows = data.length // Se usa el total sin filtrar
    const currentPage = internalPageIndex + 1;

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

            {/* ** BLOQUE ELIMINADO: Eliminado el div con el Input de búsqueda ** */}

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
                        {/* Iterar sobre las filas paginadas de la tabla */}
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
                    total={internalTotalRows} // Usamos el total sin filtrar
                    onChange={table.setPageIndex}
                />
                <div style={{ minWidth: 130 }}>
                    <Select
                        size="sm"
                        menuPlacement="top"
                        isSearchable={false}
                        value={pageSizeOption.filter((option) => option.value === internalPageSize)}
                        options={pageSizeOption}
                        onChange={(option) => table.setPageSize(Number(option.value))}
                    />
                </div>
            </div>
            {/* Mensaje cuando no hay datos */}
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
    // ... (PropTypes sin cambios)
    columns: PropTypes.array,
    data: PropTypes.array,
    loading: PropTypes.bool,
    onCheckBoxChange: PropTypes.func,
    onIndeterminateCheckBoxChange: PropTypes.func,
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

export default DataTable;