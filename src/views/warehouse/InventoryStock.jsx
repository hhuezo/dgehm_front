import React, { useState } from 'react'
import {
    Card,
    Button,
    Notification,
    toast,
    Drawer,
    Input,
    Switcher,
} from 'components/ui'
import { HiOutlineDocumentReport, HiOutlineFilter } from 'react-icons/hi'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { apiGetStockReport } from 'services/WareHouseServise'

// Validation schema
const validationSchema = Yup.object().shape({
    reportDate: Yup.date().required('La fecha es requerida'),
    exportExcel: Yup.boolean(),
})

// FECHA ACTUAL LOCAL (YYYY-MM-DD) — SIN UTC
const today = new Date().toLocaleDateString('en-CA')

const InventoryStock = () => {
    const [drawerOpen, setDrawerOpen] = useState(true)

    const onDrawerClose = () => {
        setDrawerOpen(false)
    }

    const handleGenerateReport = async (values, setSubmitting) => {
        setSubmitting(true)
        try {
            const response = await apiGetStockReport(values)

            const extension = values.exportExcel ? 'xlsx' : 'pdf'
            const mimeType = values.exportExcel
                ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                : 'application/pdf'

            const blob = new Blob([response.data], { type: mimeType })
            const url = window.URL.createObjectURL(blob)

            const link = document.createElement('a')
            link.href = url
            link.setAttribute(
                'download',
                `Existencias_${values.reportDate}.${extension}`
            )

            document.body.appendChild(link)
            link.click()
            link.parentNode.removeChild(link)

            toast.push(
                <Notification title="Reporte Descargado" type="success">
                    El reporte de existencias se ha descargado correctamente.
                </Notification>
            )

            setDrawerOpen(false)
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

    return (
        <div className="flex flex-col gap-4 h-full">
            <div className="flex justify-between items-center">
                <h3>Reporte de Existencias</h3>
                <Button
                    variant="solid"
                    icon={<HiOutlineFilter />}
                    onClick={() => setDrawerOpen(true)}
                >
                    Filtros
                </Button>
            </div>

            <Card className="h-full flex items-center justify-center bg-gray-50 border-dashed border-2">
                <div className="text-center text-gray-500">
                    <HiOutlineDocumentReport className="text-6xl mx-auto mb-4 text-gray-300" />
                    <p>
                        Seleccione una fecha para generar el reporte de
                        existencias.
                    </p>
                </div>
            </Card>

            <Drawer
                title="Generar Reporte de Existencias"
                isOpen={drawerOpen}
                onClose={onDrawerClose}
                closable
            >
                <div>
                    <p className="mb-6 text-gray-600">
                        Por favor seleccione la fecha de corte y el formato de
                        exportación.
                    </p>

                    <Formik
                        initialValues={{
                            reportDate: today,
                            exportExcel: false,
                        }}
                        validationSchema={validationSchema}
                        onSubmit={(values, { setSubmitting }) => {
                            handleGenerateReport(values, setSubmitting)
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
                                <div>
                                    <label className="font-semibold mb-2 block text-gray-700">
                                        Fecha de Corte
                                    </label>
                                    <Field name="reportDate">
                                        {({ field }) => (
                                            <Input {...field} type="date" />
                                        )}
                                    </Field>
                                    {errors.reportDate &&
                                        touched.reportDate && (
                                            <div className="text-red-500 text-sm mt-1">
                                                {errors.reportDate}
                                            </div>
                                        )}
                                </div>

                                {/* SWITCH EXPORTAR EXCEL */}
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
                                        checked={values.exportExcel}
                                        onChange={(checked) =>
                                            setFieldValue(
                                                'exportExcel',
                                                checked
                                            )
                                        }
                                    />
                                </div>

                                <div className="mt-4 flex justify-end gap-2">
                                    <Button
                                        type="button"
                                        onClick={onDrawerClose}
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
                </div>
            </Drawer>
        </div>
    )
}

export default InventoryStock
