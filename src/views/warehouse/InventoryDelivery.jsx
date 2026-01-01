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
import { apiGetDeliveryReport } from 'services/WareHouseServise'

// Validation schema
const validationSchema = Yup.object().shape({
    startDate: Yup.date().required('La fecha de inicio es requerida'),
    endDate: Yup.date()
        .required('La fecha final es requerida')
        .min(
            Yup.ref('startDate'),
            'La fecha final debe ser posterior a la fecha de inicio'
        ),
})

const InventoryDelivery = () => {
    const [drawerOpen, setDrawerOpen] = useState(true)

    //  CONTROL REAL DEL SWITCH
    const [exportExcel, setExportExcel] = useState(false)

    const onDrawerClose = () => {
        setDrawerOpen(false)
    }

    const handleGenerateReport = async (values, setSubmitting) => {
        setSubmitting(true)

        try {
            const payload = {
                ...values,
                exportExcel, // 🔥 se inyecta aquí
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
                <h3>Reporte de Entregas de Inventario</h3>
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
                        Seleccione un rango de fechas para generar el reporte.
                    </p>
                </div>
            </Card>

            <Drawer
                title="Generar Reporte de Entregas"
                isOpen={drawerOpen}
                onClose={onDrawerClose}
                closable
            >
                <div>
                    <p className="mb-6 text-gray-600">
                        Por favor seleccione el rango de fechas y el formato de
                        exportación.
                    </p>

                    <Formik
                        initialValues={{
                            startDate: '',
                            endDate: '',
                        }}
                        validationSchema={validationSchema}
                        onSubmit={(values, { setSubmitting }) =>
                            handleGenerateReport(values, setSubmitting)
                        }
                    >
                        {({ errors, touched, isSubmitting }) => (
                            <Form className="flex flex-col gap-5">
                                <div>
                                    <label className="font-semibold mb-2 block text-gray-700">
                                        Fecha de Inicio
                                    </label>
                                    <Field name="startDate">
                                        {({ field }) => (
                                            <Input {...field} type="date" />
                                        )}
                                    </Field>
                                    {errors.startDate &&
                                        touched.startDate && (
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
                                    {errors.endDate &&
                                        touched.endDate && (
                                            <div className="text-red-500 text-sm mt-1">
                                                {errors.endDate}
                                            </div>
                                        )}
                                </div>

                                {/* ✅ SWITCH QUE SÍ FUNCIONA */}
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

export default InventoryDelivery
