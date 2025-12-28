import React from 'react'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'

// Componente sustituto para Input (Input nativo)
export const PlainInput = ({ field, invalid, disabled, ...props }) => (
    <input
        {...field}
        {...props}
        type={props.type || 'text'}
        disabled={disabled}
        className={`
            block w-full rounded border 
            ${invalid ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'}
            shadow-sm focus:ring focus:ring-opacity-50 h-10 px-3 text-sm transition duration-150 ease-in-out
            ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''} 
        `}
    />
)

// Componente sustituto para Select
export const PlainSelect = ({ field, invalid, disabled, children, ...props }) => (
    <select
        {...field}
        {...props}
        disabled={disabled}
        className={`
            block w-full rounded border 
            ${invalid ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'}
            shadow-sm focus:ring focus:ring-opacity-50 h-10 px-3 text-sm transition duration-150 ease-in-out
            ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''} 
        `}
    >
        {children}
    </select>
)

// Componente sustituto para FormItem (Divs nativos)
export const PlainFormItem = ({ label, invalid, errorMessage, children }) => (
    <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        {children}
        {invalid && <p className="mt-1 text-sm text-red-600">{errorMessage}</p>}
    </div>
)

// Función para crear el schema de validación según el modo
const getValidationSchema = (mode) => {
    const baseSchema = {
        name: Yup.string().required('El nombre es obligatorio'),
        email: Yup.string()
            .email('El email no es válido')
            .required('El email es obligatorio'),
    }

    // role_id solo es requerido al crear (add), no al editar
    if (mode === 'add') {
        baseSchema.role_id = Yup.number()
            .required('El rol es obligatorio')
            .min(1, 'Debe seleccionar un rol válido')
        baseSchema.password = Yup.string()
            .min(6, 'La contraseña debe tener al menos 6 caracteres')
            .required('La contraseña es obligatoria')
    } else if (mode === 'edit') {
        baseSchema.password = Yup.string()
            .min(6, 'La contraseña debe tener al menos 6 caracteres')
            .notRequired()
    }

    return Yup.object().shape(baseSchema)
}


const UserForm = ({ mode, selectedUser, onSubmit, onClose, roles = [] }) => {
    const isEdit = mode === 'edit'
    const isView = mode === 'view'
    const isAdd = mode === 'add'

    const initialValues = isEdit || isView
        ? {
            id: selectedUser?.id,
            name: selectedUser?.name || '',
            email: selectedUser?.email || '',
            password: '',
        }
        : {
            name: '',
            email: '',
            password: '',
            role_id: '',
        }

    const title = isView ? 'Ver Usuario' : isEdit ? 'Editar Usuario' : 'Nuevo Usuario'

    const validationSchema = getValidationSchema(mode)

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
            enableReinitialize
        >
            {({ errors, touched, isSubmitting, values }) => (
                <Form>
                    {/* Header para el Drawer */}
                    <div className="flex items-center justify-between mb-4 border-b pb-3">
                        <h5 className="font-semibold text-xl">{title}</h5>
                        <button
                            type="button"
                            className="px-2 py-1 text-sm text-gray-500 hover:text-gray-700 rounded"
                            onClick={onClose}
                        >
                            X
                        </button>
                    </div>

                    {isEdit && <Field name="id" type="hidden" />}

                    {/* Campo Nombre */}
                    <PlainFormItem
                        label="Nombre completo"
                        invalid={Boolean(errors.name && touched.name)}
                        errorMessage={errors.name}
                    >
                        <Field
                            name="name"
                            component={PlainInput}
                            placeholder="Ej: Juan Pérez"
                            invalid={Boolean(errors.name && touched.name)}
                            disabled={isView}
                        />
                    </PlainFormItem>

                    {/* Campo Email */}
                    <PlainFormItem
                        label="Email"
                        invalid={Boolean(errors.email && touched.email)}
                        errorMessage={errors.email}
                    >
                        <Field
                            name="email"
                            type="email"
                            component={PlainInput}
                            placeholder="Ej: usuario@ejemplo.com"
                            invalid={Boolean(errors.email && touched.email)}
                            disabled={isView}
                        />
                    </PlainFormItem>

                    {/* Campo Contraseña */}
                    {!isView && (
                        <PlainFormItem
                            label={isEdit ? 'Nueva contraseña (dejar vacío para mantener la actual)' : 'Contraseña'}
                            invalid={Boolean(errors.password && touched.password)}
                            errorMessage={errors.password}
                        >
                            <Field
                                name="password"
                                type="password"
                                component={PlainInput}
                                placeholder={isEdit ? 'Dejar vacío para mantener' : 'Mínimo 6 caracteres'}
                                invalid={Boolean(errors.password && touched.password)}
                            />
                        </PlainFormItem>
                    )}

                    {/* Campo Rol - Solo en modo add (crear), no en edit */}
                    {isAdd && (
                        <PlainFormItem
                            label="Rol"
                            invalid={Boolean(errors.role_id && touched.role_id)}
                            errorMessage={errors.role_id}
                        >
                            <Field
                                name="role_id"
                                component={PlainSelect}
                                invalid={Boolean(errors.role_id && touched.role_id)}
                            >
                                <option value="">Seleccione un rol</option>
                                {roles.map((role) => (
                                    <option key={role.id} value={role.id}>
                                        {role.name}
                                    </option>
                                ))}
                            </Field>
                        </PlainFormItem>
                    )}

                    {/* Botones de acción */}
                    {!isView && (
                        <div className="flex justify-end gap-2 pt-4">
                            <button
                                type="button"
                                className="px-3 py-1.5 text-sm border rounded"
                                onClick={onClose}
                            >
                                Cancelar
                            </button>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60"
                            >
                                {isEdit ? 'Guardar Cambios' : 'Guardar'}
                            </button>
                        </div>
                    )}

                    {isView && (
                        <div className="flex justify-end gap-2 pt-4">
                            <button
                                type="button"
                                className="px-3 py-1.5 text-sm border rounded"
                                onClick={onClose}
                            >
                                Cerrar
                            </button>
                        </div>
                    )}
                </Form>
            )}
        </Formik>
    )
}

export default UserForm

