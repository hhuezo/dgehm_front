// Ubicación: src/views/warehouse/components/SupplyRequestUtils.jsx

import React from 'react';
import * as Yup from 'yup';

// --- VALIDACIÓN Y UTILIDADES ---

export const getTodayDateString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export const validationSchemaCreate = Yup.object().shape({
    date: Yup.date().required('La fecha de solicitud es obligatoria'),
    immediate_boss_id: Yup.string().required('El jefe inmediato es obligatorio'),
    observation: Yup.string().required('La observación es obligatoria'),
    office_id: Yup.string().required('Debe seleccionar una oficina'),
});

export const validationSchemaEdit = Yup.object().shape({
    date: Yup.date().required('La fecha de solicitud es obligatoria'),
    observation: Yup.string().required('La observación es obligatoria'),
    immediate_boss: Yup.string().required('El jefe inmediato es obligatorio'),
});


// --- COMPONENTES UI BÁSICOS ---

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