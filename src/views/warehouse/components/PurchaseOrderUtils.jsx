// PurchaseOrderUtils.jsx

import React from 'react';

// Funciones Auxiliares para Fecha/Hora

const padZero = (num) => num.toString().padStart(2, '0');

// Devuelve {datePart: 'YYYY-MM-DD', timePart: 'HH:MM'}
export const getCurrentDateTime = () => {
    const now = new Date();
    // YYYY-MM-DD
    const datePart = `${now.getFullYear()}-${padZero(now.getMonth() + 1)}-${padZero(now.getDate())}`;
    // HH:MM (Formato requerido para input type="time")
    const timePart = `${padZero(now.getHours())}:${padZero(now.getMinutes())}`;

    return { datePart, timePart };
};

// Divide un string datetime (YYYY-MM-DD HH:MM:SS) en fecha y hora para Formik
export const splitDateTime = (dateTimeString) => {
    if (!dateTimeString || typeof dateTimeString !== 'string' || dateTimeString.trim() === '') {
        return { date: '', time: '' };
    }

    const parts = dateTimeString.split(' ');
    const date = parts[0] || '';
    const time = parts[1]?.substring(0, 5) || ''; // HH:MM

    return { date, time };
};


export const getInitialValues = (data) => {
    let defaultValues = {
        supplier_id: '',
        order_number: '',
        invoice_number: '',
        budget_commitment_number: '',
        acta_date: '',
        acta_time: '',
        reception_date: '',
        reception_time_only: '',
        supplier_representative: '',
        invoice_date: '',
        total_amount: 0.00,
        administrative_manager: '',
        administrative_technician: '',
    };

    if (data) {
        // MODO EDICIÓN/VISTA: Mapear datos existentes

        // Aseguramos strings vacíos si el dato viene nulo/undefined
        const actaDateString = data.acta_date || '';
        const receptionDateString = data.reception_time || '';
        const invoiceDateString = data.invoice_date || '';

        const actaDateTime = splitDateTime(actaDateString);
        const receptionDateTime = splitDateTime(receptionDateString);

        // Tomamos solo la parte de la fecha
        const invoiceDatePart = invoiceDateString.split(' ')[0] || '';

        return {
            ...defaultValues,
            id: data.id,
            supplier_id: data.supplier_id || '',
            order_number: data.order_number || '',
            invoice_number: data.invoice_number || '',
            budget_commitment_number: data.budget_commitment_number || '',

            // Asignación de fechas/horas existentes
            acta_date: actaDateTime.date,
            acta_time: actaDateTime.time,
            reception_date: receptionDateTime.date,
            reception_time_only: receptionDateTime.time,
            supplier_representative: data.supplier_representative || '',

            invoice_date: invoiceDatePart,
            total_amount: data.total_amount || 0.00,
            administrative_manager: data.administrative_manager || '',
            administrative_technician: data.administrative_technician || '',
        };
    } else {
        // MODO CREACIÓN: Inicializa con la fecha/hora actual
        const { datePart, timePart } = getCurrentDateTime();

        return {
            ...defaultValues,

            // Valores de fecha/hora iniciales:
            acta_date: datePart,
            acta_time: timePart,
            reception_date: datePart,
            reception_time_only: timePart,
            invoice_date: datePart
        };
    }
};


// ===============================================
// Componentes de UI
// ===============================================

export const PlainInput = ({ field, invalid, disabled, type = 'text', ...props }) => (
    <input
        {...field}
        {...props}
        type={type}
        disabled={disabled}
        value={field.value || ''}
        className={`
            block w-full rounded border 
            ${invalid ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'}
            shadow-sm focus:ring focus:ring-opacity-50 h-10 px-3 text-sm transition duration-150 ease-in-out
            ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''} 
        `}
    />
)

export const PlainSelect = ({ field, invalid, disabled, children, ...props }) => (
    <select
        {...field}
        {...props}
        disabled={disabled}
        className={`block w-full rounded border ${invalid ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'} shadow-sm focus:ring focus:ring-opacity-50 h-10 px-3 text-sm transition duration-150 ease-in-out ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
    >
        {children}
    </select>
)

export const PlainFormItem = ({ label, invalid, errorMessage, children }) => (
    <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        {children}
        {invalid && <p className="mt-1 text-sm text-red-600">{errorMessage}</p>}
    </div>
)