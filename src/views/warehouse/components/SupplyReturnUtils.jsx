// Ubicación: src/views/warehouse/components/SupplyReturnUtils.jsx

import React from 'react';
import * as Yup from 'yup';

// --- VALIDACIÓN Y UTILIDADES ---

/**
 * Obtiene la fecha de hoy en formato YYYY-MM-DD.
 */
export const getTodayDateString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

/**
 * Esquema de validación para la creación de una Devolución de Suministros.
 */
export const validationSchemaReturn = Yup.object().shape({
    return_date: Yup.date().required('La fecha de devolución es obligatoria'),
    wh_office_id: Yup.string().required('Debe seleccionar una oficina de origen'),
    immediate_supervisor_id: Yup.string().required('El supervisor inmediato es obligatorio'),
    received_by_id: Yup.string().required('El técnico que recibe la devolución es obligatorio'),
    phone_extension: Yup.string().nullable().max(10, 'La extensión no debe superar los 10 caracteres'),
    general_observations: Yup.string().nullable().max(1000, 'Las observaciones no deben superar los 1000 caracteres'),
});

/**
 * Esquema de validación para la edición de una Devolución de Suministros.
 * Se simplifica para permitir la edición de campos opcionales.
 */
export const validationSchemaEdit = Yup.object().shape({
    return_date: Yup.date().required('La fecha de devolución es obligatoria'),
    phone_extension: Yup.string().nullable().max(10, 'La extensión no debe superar los 10 caracteres'),
    general_observations: Yup.string().nullable().max(1000, 'Las observaciones no deben superar los 1000 caracteres'),
});


// --- COMPONENTES UI BÁSICOS (Reutilizados sin cambios) ---

export const PlainInput = ({ field, invalid, disabled, type = 'text', ...props }) => (
    <input
        {...field}
        {...props}
        type={type}
        disabled={disabled}
        className={`
            block w-full rounded border 
            ${invalid ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'}
            shadow-sm focus:ring focus:ring-opacity-50 h-10 px-3 text-sm transition duration-150 ease-in-out
            ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''} 
        `}
    />
);

export const PlainTextArea = ({ field, invalid, disabled, ...props }) => (
    <textarea
        {...field}
        {...props}
        disabled={disabled}
        rows={4}
        className={`
            block w-full rounded border 
            ${invalid ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'}
            shadow-sm focus:ring focus:ring-opacity-50 px-3 py-2 text-sm transition duration-150 ease-in-out
            ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''} 
        `}
    />
);

export const PlainFormItem = ({ label, invalid, errorMessage, children }) => (
    <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        {children}
        {invalid && <p className="mt-1 text-sm text-red-600">{errorMessage}</p>}
    </div>
);

export const PlainSelect = ({ field, invalid, disabled, options = [], placeholder, onChange, ...props }) => (
    <select
        {...field}
        {...props}
        disabled={disabled}
        onChange={onChange || field.onChange}
        className={`
            block w-full rounded border 
            ${invalid ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'}
            shadow-sm focus:ring focus:ring-opacity-50 h-10 px-3 text-sm transition duration-150 ease-in-out
            ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''} 
        `}
    >
        <option value="" disabled>{placeholder || 'Seleccione una opción'}</option>
        {options.map((option) => (
            <option key={option.id} value={option.id}>
                {option.lastname ? `${option.name} ${option.lastname}` : option.name}
            </option>
        ))}
    </select>
);

export const DetailItem = ({ label, children }) => (
    <div>
        <span className="block text-xs font-medium text-gray-500">{label}</span>
        <span className="block text-sm font-medium text-gray-800">{children}</span>
    </div>
);