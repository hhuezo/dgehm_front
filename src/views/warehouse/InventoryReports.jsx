import React, { useState, useEffect } from 'react'
import {
    Card,
    Button,
    Drawer,
    Input,
    Switcher,
    Notification,
    toast,
} from 'components/ui'
import {
    HiOutlineDocumentReport,
    HiOutlineChartBar,
    HiOutlineTruck,
    HiOutlineCollection,
} from 'react-icons/hi'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import dayjs from 'dayjs'
import {
    apiGetLiquidationReport,
    apiGetDeliveryReport,
    apiGetStockReport,
} from 'services/WareHouseServise'

// Validation schemas
const liquidationValidationSchema = Yup.object().shape({
    startDate: Yup.date().required('La fecha de inicio es requerida'),
    endDate: Yup.date()
        .required('La fecha final es requerida')
        .min(
            Yup.ref('startDate'),
            'La fecha final debe ser posterior a la fecha de inicio'
        ),
})

const deliveryValidationSchema = Yup.object().shape({
    startDate: Yup.date().required('La fecha de inicio es requerida'),
    endDate: Yup.date()
        .required('La fecha final es requerida')
        .min(
            Yup.ref('startDate'),
            'La fecha final debe ser posterior a la fecha de inicio'
        ),
})

const stockValidationSchema = Yup.object().shape({
    reportDate: Yup.date().required('La fecha es requerida'),
})

// FECHA ACTUAL LOCAL (YYYY-MM-DD) — SIN UTC
const today = new Date().toLocaleDateString('en-CA')

const reportOptions = [
    {
        id: 'liquidation',
        title: 'Reporte de Liquidación',
        description:
            'Genera un reporte de liquidación de inventario por rango de fechas. Permite exportar en PDF o Excel.',
        icon: <HiOutlineDocumentReport className="text-5xl" />,
        bgGradient: 'from-blue-50 to-blue-100',
        iconColor: 'text-blue-600',
        borderColor: 'border-blue-200',
        buttonColor: 'bg-blue-600 text-white hover:bg-blue-700',
        drawerTitle: 'Generar Reporte de Liquidación',
        drawerDescription:
            'Por favor seleccione el rango de fechas y el formato de exportación.',
    },
    {
        id: 'delivery',
        title: 'Reporte de Entregas',
        description:
            'Obtén un reporte detallado de entregas de inventario filtrado por fechas. Disponible en PDF o Excel.',
        icon: <HiOutlineTruck className="text-5xl" />,
        bgGradient: 'from-green-50 to-green-100',
        iconColor: 'text-green-600',
        borderColor: 'border-green-200',
        buttonColor: 'bg-green-600 text-white hover:bg-green-700',
        drawerTitle: 'Generar Reporte de Entregas',
        drawerDescription:
            'Por favor seleccione el rango de fechas y el formato de exportación.',
    },
    {
        id: 'stock',
        title: 'Reporte de Existencias',
        description:
            'Consulta las existencias actuales del inventario a partir de una fecha específica. Exporta en PDF o Excel.',
        icon: <HiOutlineCollection className="text-5xl" />,
        bgGradient: 'from-purple-50 to-purple-100',
        iconColor: 'text-purple-600',
        borderColor: 'border-purple-200',
        buttonColor: 'bg-purple-600 text-white hover:bg-purple-700',
        drawerTitle: 'Generar Reporte de Existencias',
        drawerDescription:
            'Por favor seleccione la fecha de corte y el formato de exportación.',
    },
]

const InventoryReports = () => {
    const [activeDrawer, setActiveDrawer] = useState(null)
    const [exportExcel, setExportExcel] = useState(false)

    // Función helper para limpiar el scroll del body
    const restoreBodyScroll = () => {
        // Limpiar las clases del body que bloquean el scroll
        document.body.classList.remove('drawer-open', 'drawer-lock-scroll')
        // Asegurar que el overflow esté restaurado
        document.body.style.overflow = ''
    }

    // Limpiar el scroll cuando el componente se desmonte (navegación a otra vista)
    useEffect(() => {
        return () => {
            restoreBodyScroll()
        }
    }, [])

    // Limpiar el scroll cuando el drawer se cierre
    useEffect(() => {
        if (!activeDrawer) {
            // Esperar un poco más que el closeTimeoutMS del drawer (300ms) para asegurar que react-modal haya terminado
            const timeoutId = setTimeout(() => {
                restoreBodyScroll()
            }, 350)
            
            return () => clearTimeout(timeoutId)
        }
    }, [activeDrawer])

    const handleCardClick = (reportId) => {
        setActiveDrawer(reportId)
        setExportExcel(false)
    }

    const handleDrawerClose = () => {
        setActiveDrawer(null)
        setExportExcel(false)
    }

    const handleGenerateLiquidationReport = async (values, setSubmitting) => {
        setSubmitting(true)

        try {
            const payload = {
                ...values,
                exportExcel,
            }

            const response = await apiGetLiquidationReport(payload)

            const extension = exportExcel ? 'xlsx' : 'pdf'
            const mimeType = exportExcel
                ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                : 'application/pdf'

            const blob = new Blob([response.data], { type: mimeType })
            const url = window.URL.createObjectURL(blob)

            const link = document.createElement('a')
            link.href = url
            link.setAttribute(
                'download',
                `Liquidacion_${values.startDate}_${values.endDate}.${extension}`
            )

            document.body.appendChild(link)
            link.click()
            link.parentNode.removeChild(link)

            toast.push(
                <Notification title="Reporte Descargado" type="success">
                    El reporte de liquidación se ha descargado correctamente.
                </Notification>
            )

            handleDrawerClose()
        } catch (error) {
            toast.push(
                <Notification title="Error" type="danger">
                    Hubo un problema al generar el reporte.
                </Notification>
            )
            console.error(error)
        } finally {
            setSubmitting(false)
        }
    }

    const handleGenerateDeliveryReport = async (values, setSubmitting) => {
        setSubmitting(true)

        try {
            const payload = {
                ...values,
                exportExcel,
            }

            const response = await apiGetDeliveryReport(payload)

            const extension = exportExcel ? 'xlsx' : 'pdf'
            const mimeType = exportExcel
                ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                : 'application/pdf'

            const blob = new Blob([response.data], { type: mimeType })
            const url = window.URL.createObjectURL(blob)

            const link = document.createElement('a')
            link.href = url
            link.setAttribute(
                'download',
                `Entregas_${values.startDate}_${values.endDate}.${extension}`
            )

            document.body.appendChild(link)
            link.click()
            link.parentNode.removeChild(link)

            toast.push(
                <Notification title="Reporte Descargado" type="success">
                    El reporte de entregas se ha descargado correctamente.
                </Notification>
            )

            handleDrawerClose()
        } catch (error) {
            toast.push(
                <Notification title="Error" type="danger">
                    Hubo un problema al generar el reporte.
                </Notification>
            )
            console.error(error)
        } finally {
            setSubmitting(false)
        }
    }

    const handleGenerateStockReport = async (values, setSubmitting) => {
        setSubmitting(true)
        try {
            const payload = {
                date: dayjs(values.reportDate).format('YYYY-MM-DD'),
                exportExcel: exportExcel ? 1 : 0,
            }

            const response = await apiGetStockReport(payload)

            const extension = exportExcel ? 'xlsx' : 'pdf'
            const mimeType = exportExcel
                ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                : 'application/pdf'

            const blob = new Blob([response.data], { type: mimeType })
            const url = window.URL.createObjectURL(blob)

            const link = document.createElement('a')
            link.href = url
            link.setAttribute(
                'download',
                `Existencias_${payload.date}.${extension}`
            )

            document.body.appendChild(link)
            link.click()
            link.parentNode.removeChild(link)

            toast.push(
                <Notification title="Reporte Descargado" type="success">
                    El reporte de existencias se ha descargado correctamente.
                </Notification>
            )

            handleDrawerClose()
        } catch (error) {
            toast.push(
                <Notification title="Error" type="danger">
                    Hubo un problema al generar el reporte.
                </Notification>
            )
            console.error(error)
        } finally {
            setSubmitting(false)
        }
    }

    const renderDrawerContent = () => {
        const report = reportOptions.find((r) => r.id === activeDrawer)

        if (!report) return null

        if (activeDrawer === 'liquidation') {
            return (
                <Formik
                    initialValues={{
                        startDate: '',
                        endDate: '',
                    }}
                    validationSchema={liquidationValidationSchema}
                    onSubmit={(values, { setSubmitting }) =>
                        handleGenerateLiquidationReport(values, setSubmitting)
                    }
                >
                    {({ errors, touched, isSubmitting }) => (
                        <Form className="flex flex-col gap-5">
                            <p className="mb-6 text-gray-600">
                                {report.drawerDescription}
                            </p>
                            <div>
                                <label className="font-semibold mb-2 block text-gray-700">
                                    Fecha de Inicio
                                </label>
                                <Field name="startDate">
                                    {({ field }) => (
                                        <Input {...field} type="date" />
                                    )}
                                </Field>
                                {errors.startDate && touched.startDate && (
                                    <div className="text-red-500 text-sm mt-1">
                                        {errors.startDate}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="font-semibold mb-2 block text-gray-700">
                                    Fecha Final
                                </label>
                                <Field name="endDate">
                                    {({ field }) => (
                                        <Input {...field} type="date" />
                                    )}
                                </Field>
                                {errors.endDate && touched.endDate && (
                                    <div className="text-red-500 text-sm mt-1">
                                        {errors.endDate}
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-between items-center mt-2">
                                <div>
                                    <p className="font-semibold text-gray-700">
                                        Exportar en Excel
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Descarga el reporte en formato Excel
                                    </p>
                                </div>
                                <Switcher
                                    checked={exportExcel}
                                    onChange={() =>
                                        setExportExcel((prev) => !prev)
                                    }
                                />
                            </div>

                            <div className="mt-4 flex justify-end gap-2">
                                <Button
                                    type="button"
                                    onClick={handleDrawerClose}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    variant="solid"
                                    type="submit"
                                    loading={isSubmitting}
                                >
                                    Generar Reporte
                                </Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            )
        }

        if (activeDrawer === 'delivery') {
            return (
                <Formik
                    initialValues={{
                        startDate: '',
                        endDate: '',
                    }}
                    validationSchema={deliveryValidationSchema}
                    onSubmit={(values, { setSubmitting }) =>
                        handleGenerateDeliveryReport(values, setSubmitting)
                    }
                >
                    {({ errors, touched, isSubmitting }) => (
                        <Form className="flex flex-col gap-5">
                            <p className="mb-6 text-gray-600">
                                {report.drawerDescription}
                            </p>
                            <div>
                                <label className="font-semibold mb-2 block text-gray-700">
                                    Fecha de Inicio
                                </label>
                                <Field name="startDate">
                                    {({ field }) => (
                                        <Input {...field} type="date" />
                                    )}
                                </Field>
                                {errors.startDate && touched.startDate && (
                                    <div className="text-red-500 text-sm mt-1">
                                        {errors.startDate}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="font-semibold mb-2 block text-gray-700">
                                    Fecha Final
                                </label>
                                <Field name="endDate">
                                    {({ field }) => (
                                        <Input {...field} type="date" />
                                    )}
                                </Field>
                                {errors.endDate && touched.endDate && (
                                    <div className="text-red-500 text-sm mt-1">
                                        {errors.endDate}
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-between items-center mt-2">
                                <div>
                                    <p className="font-semibold text-gray-700">
                                        Exportar en Excel
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Descarga el reporte en formato Excel
                                    </p>
                                </div>
                                <Switcher
                                    checked={exportExcel}
                                    onChange={() =>
                                        setExportExcel((prev) => !prev)
                                    }
                                />
                            </div>

                            <div className="mt-4 flex justify-end gap-2">
                                <Button
                                    type="button"
                                    onClick={handleDrawerClose}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    variant="solid"
                                    type="submit"
                                    loading={isSubmitting}
                                >
                                    Generar Reporte
                                </Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            )
        }

        if (activeDrawer === 'stock') {
            return (
                <Formik
                    initialValues={{
                        reportDate: today,
                    }}
                    validationSchema={stockValidationSchema}
                    onSubmit={(values, { setSubmitting }) => {
                        handleGenerateStockReport(values, setSubmitting)
                    }}
                >
                    {({
                        errors,
                        touched,
                        isSubmitting,
                        values,
                        setFieldValue,
                    }) => (
                        <Form className="flex flex-col gap-5">
                            <p className="mb-6 text-gray-600">
                                {report.drawerDescription}
                            </p>
                            <div>
                                <label className="font-semibold mb-2 block text-gray-700">
                                    Fecha de Corte
                                </label>
                                <Field name="reportDate">
                                    {({ field }) => (
                                        <Input {...field} type="date" />
                                    )}
                                </Field>
                                {errors.reportDate && touched.reportDate && (
                                    <div className="text-red-500 text-sm mt-1">
                                        {errors.reportDate}
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-between items-center mt-2">
                                <div>
                                    <p className="font-semibold text-gray-700">
                                        Exportar en Excel
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Descarga el reporte en formato Excel
                                    </p>
                                </div>
                                <Switcher
                                    checked={exportExcel}
                                    onChange={() =>
                                        setExportExcel((prev) => !prev)
                                    }
                                />
                            </div>

                            <div className="mt-4 flex justify-end gap-2">
                                <Button
                                    type="button"
                                    onClick={handleDrawerClose}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    variant="solid"
                                    type="submit"
                                    loading={isSubmitting}
                                >
                                    Generar Reporte
                                </Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            )
        }

        return null
    }

    const activeReport = reportOptions.find((r) => r.id === activeDrawer)

    return (
        <div className="flex flex-col gap-6 h-full">
            <div className="flex items-center gap-3">
                <HiOutlineChartBar className="text-3xl text-gray-700" />
                <h3 className="text-2xl font-semibold text-gray-800">
                    Reportes de Inventario
                </h3>
            </div>

            <p className="text-gray-600 mb-4">
                Selecciona el tipo de reporte que deseas generar. Puedes exportar
                los reportes en formato PDF o Excel.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reportOptions.map((report) => (
                    <Card
                        key={report.id}
                        className={`
                            transition-all duration-300 
                            cursor-pointer 
                            hover:shadow-lg 
                            hover:scale-105 
                            hover:-translate-y-1
                            border-2 
                            ${report.borderColor}
                            bg-gradient-to-br ${report.bgGradient}
                        `}
                        clickable
                        onClick={() => handleCardClick(report.id)}
                    >
                        <div className="flex flex-col items-center text-center p-6">
                            <div
                                className={`
                                    mb-4 
                                    p-4 
                                    rounded-full 
                                    bg-white 
                                    shadow-md 
                                    ${report.iconColor}
                                `}
                            >
                                {report.icon}
                            </div>
                            <h4 className="text-xl font-semibold text-gray-800 mb-3">
                                {report.title}
                            </h4>
                            <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                                {report.description}
                            </p>
                            <Button
                                variant="solid"
                                size="md"
                                className={`w-full ${report.buttonColor} shadow-sm`}
                                onClick={(e) => {
                                    e.stopPropagation()
                                    handleCardClick(report.id)
                                }}
                            >
                                Generar Reporte
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Drawer que se muestra sobre la vista */}
            {activeReport && (
                <Drawer
                    title={activeReport.drawerTitle}
                    isOpen={!!activeDrawer}
                    onClose={handleDrawerClose}
                    closable
                >
                    {renderDrawerContent()}
                </Drawer>
            )}
        </div>
    )
}

export default InventoryReports
