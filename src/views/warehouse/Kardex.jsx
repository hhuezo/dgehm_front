import React, { useEffect, useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { HiOutlineFilter } from 'react-icons/hi';

import { apiGetProductShow } from 'services/WareHouseServise';

import {
    setCurrentRouteTitle,
    setCurrentRouteSubtitle,
    setCurrentRouteInfo,
    setCurrentRouteOptions,
} from 'store/base/commonSlice';

import {
    apiGetProducts,
    apiGetKardexMovements
} from 'services/WareHouseServise';

import {
    Card, Notification, toast, Input, Button,
    FormContainer, FormItem, Select, Spinner,
} from 'components/ui';

import Drawer from 'components/ui/Drawer/DrawerOld'

import KardexTable from './components/KardexTable';

import KardexInventoryBalancesTable from './components/KardexInventoryBalancesTable';

// ===============================================
// UTILIDADES DE FECHA
// ===============================================

const getTodayDateString = () => {
    return new Date().toISOString().split('T')[0];
};

const getOneYearAgoDateString = () => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 1);
    return date.toISOString().split('T')[0];
};

// ===============================================
// VALORES INICIALES POR DEFECTO
// ===============================================

const DEFAULT_INITIAL_VALUES = {
    product_id: '',
    start_date: getOneYearAgoDateString(),
    end_date: getTodayDateString(),
};


// ===============================================
// VALIDACIÓN
// ===============================================
const validationSchema = Yup.object().shape({
    product_id: Yup.number()
        .typeError('Debe seleccionar un producto válido')
        .required('El producto es obligatorio')
        .min(1, 'Debe seleccionar un producto válido'),
    start_date: Yup.string()
        .required('La fecha de inicio es obligatoria'),
    end_date: Yup.string()
        .required('La fecha final es obligatoria')
        .test(
            'is-greater-than-start',
            'La fecha final no puede ser anterior a la fecha de inicio',
            function (value) {
                return this.parent.start_date && new Date(value) >= new Date(this.parent.start_date);
            }
        ),
});


// ===============================================
// COMPONENTE PRINCIPAL: Kardex
// ===============================================
const Kardex = () => {
    const dispatch = useDispatch();

    const [products, setProducts] = useState([]);
    const [kardexData, setKardexData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const [inventoryBalances, setInventoryBalances] = useState([]);

    const [searchParams, setSearchParams] = useState(DEFAULT_INITIAL_VALUES);

    const [lastFilters, setLastFilters] = useState({});

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    const handleChange = useCallback(() => {
        dispatch(setCurrentRouteTitle('Kardex de Inventario'));
        dispatch(setCurrentRouteSubtitle('Movimientos de productos por fecha'));
        dispatch(setCurrentRouteInfo(''));
        dispatch(setCurrentRouteOptions(''));
    }, [dispatch]);

    useEffect(() => {
        handleChange();
        fetchProducts();
    }, [handleChange]);

    const fetchProducts = async () => {
        try {
            const res = await apiGetProducts();
            if (res.data.success) {
                const mappedProducts = res.data.data.map(p => ({
                    label: `${p.name} (${p.measure?.name || 'Unidad'})`,
                    value: p.id,
                    product_name: p.name,
                }));
                setProducts(mappedProducts);
            }
        } catch (error) {
            toast.push(<Notification title="Error" type="danger">Error al cargar el catálogo de productos.</Notification>);
        }
    };

    const fetchInventoryBalances = async (productId) => {
        try {
            const res = await apiGetProductShow(productId);

            if (res.data.success) {
                setInventoryBalances(res.data.data);
            } else {
                setInventoryBalances([]);
                console.error("Error al cargar saldos por OC:", res.data.message);
            }
        } catch (error) {
            setInventoryBalances([]);
            console.error("Error de red/servidor al cargar saldos por OC:", error);
        }
    }


    const fetchKardexMovements = async (values) => {
        setLoading(true);
        setKardexData([]);
        setInventoryBalances([]);
        setIsDrawerOpen(false);

        const { product_id, start_date, end_date } = values;
        const filters = { start_date, end_date };

        try {
            // 1. Cargar movimientos del Kardex
            const resKardex = await apiGetKardexMovements(product_id, filters);

            if (resKardex.data.success) {
                setKardexData(resKardex.data.data);

                // 2. Llamar a la función para obtener los saldos por OC
                await fetchInventoryBalances(product_id);

                setSearchParams(values);

                const selectedProduct = products.find(p => p.value === product_id);
                setLastFilters({
                    product_name: selectedProduct?.product_name || `Producto ID: ${product_id}`,
                    start_date,
                    end_date
                });

                toast.push(<Notification title="Correcto" type="success">Movimientos y saldos cargados con éxito.</Notification>);
            } else {
                toast.push(<Notification title="Error" type="danger">{resKardex.data.message || 'Error desconocido al cargar movimientos.'}</Notification>);
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Error de red al cargar el Kardex.';
            toast.push(<Notification title="Error" type="danger">{message}</Notification>);
        } finally {
            setLoading(false);
        }
    };

    const cardTitle = lastFilters.product_name
        ? `PRODUCTO: ${lastFilters.product_name} | FECHA: ${formatDate(lastFilters.start_date)} - ${formatDate(lastFilters.end_date)}`
        : 'Movimientos del Kardex';


    return (
        <Card borderless className="shadow-none border-0">
            {/* HEADER */}
            <div className="flex justify-between items-center border-b px-4 py-3">
                <h4 className="text-lg font-semibold">{cardTitle}</h4>
                <Button
                    icon={<HiOutlineFilter />}
                    onClick={() => setIsDrawerOpen(true)}
                    variant="solid"
                    size="sm"
                >
                    Filtrar
                </Button>
            </div>

            {/* CONTENEDOR DE RESULTADOS */}
            <div className="p-4">
                {loading && (
                    <div className="flex justify-center py-10">
                        <Spinner size={40} />
                    </div>
                )}

                {/* SALDOS */}
                {!loading && inventoryBalances.length > 0 && (
                    <div className="flex justify-end mb-6">
                        <div>
                            <KardexInventoryBalancesTable data={inventoryBalances} />
                        </div>
                    </div>
                )}

                {/* TABLA DE MOVIMIENTOS */}
                {!loading && kardexData.length > 0 && (
                    <KardexTable data={kardexData} />
                )}

                {!loading && kardexData.length === 0 && (
                    <div className="text-center py-10 text-gray-500">
                        {lastFilters.product_name ? `No se encontraron movimientos para ${lastFilters.product_name} en el rango de fechas.` : 'Use el botón "Filtrar" para seleccionar un producto y rango de fechas.'}
                    </div>
                )}
            </div>

            {/* FOOTER */}
            <div className="border-t px-4 py-2 text-sm text-gray-500">
                Total movimientos: {kardexData.length}
            </div>

            {/* DRAWER PARA FILTROS */}
            <Drawer
                title="Filtrar Movimientos del Kardex"
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                onRequestClose={() => setIsDrawerOpen(false)}
                width={500}
            >
                <Formik
                    initialValues={searchParams}
                    validationSchema={validationSchema}
                    onSubmit={fetchKardexMovements}
                    enableReinitialize={false}
                >
                    {({ values, errors, touched, setFieldValue }) => (
                        <Form>
                            <FormContainer>
                                <div className="grid grid-cols-1 gap-4">
                                    {/* Dropdown de Producto */}
                                    <FormItem
                                        label="Producto"
                                        invalid={errors.product_id && touched.product_id}
                                        errorMessage={errors.product_id}
                                    >
                                        <Field name="product_id">
                                            {({ field }) => (
                                                <Select
                                                    options={products}
                                                    value={products.find(option => option.value === values.product_id)}
                                                    onChange={(option) => {
                                                        setFieldValue(field.name, option.value);
                                                    }}
                                                    placeholder="Seleccione un producto..."
                                                    isDisabled={loading}
                                                />
                                            )}
                                        </Field>
                                    </FormItem>

                                    {/* Fecha de Inicio */}
                                    <FormItem
                                        label="Fecha de Inicio"
                                        invalid={errors.start_date && touched.start_date}
                                        errorMessage={errors.start_date}
                                    >
                                        <Field name="start_date">
                                            {({ field }) => (
                                                <Input
                                                    type="date"
                                                    disabled={loading}
                                                    {...field}
                                                />
                                            )}
                                        </Field>
                                    </FormItem>

                                    {/* Fecha Final */}
                                    <FormItem
                                        label="Fecha Final"
                                        invalid={errors.end_date && touched.end_date}
                                        errorMessage={errors.end_date}
                                    >
                                        <Field name="end_date">
                                            {({ field }) => (
                                                <Input
                                                    type="date"
                                                    disabled={loading}
                                                    {...field}
                                                />
                                            )}
                                        </Field>
                                    </FormItem>
                                </div>
                                <div className="text-right mt-6">
                                    <Button
                                        className="mr-2"
                                        variant="plain"
                                        onClick={() => setIsDrawerOpen(false)}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        variant="solid"
                                        type="submit"
                                        loading={loading}
                                    >
                                        {loading ? 'Buscando...' : 'Aplicar Filtros'}
                                    </Button>
                                </div>
                            </FormContainer>
                        </Form>
                    )}
                </Formik>
            </Drawer>
        </Card>
    );
};

export default Kardex;