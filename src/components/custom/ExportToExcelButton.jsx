import React, { useState } from 'react';
import Button from './Button';
import { FaFileExcel } from 'react-icons/fa';
import * as XLSX from 'xlsx';

/**
 * Either `data` **or** `getData` must be provided.
 * `getData` may return a Promise that resolves to an array of rows.
 */
const ExportToExcelButton = ({
  data,
  getData,                  // async () => rows[]
  title = 'Exportar a Excel',
  reportName = 'exported_data',
  className = '',
  color = 'primary',
  twColor = null,
}) => {
  const [busy, setBusy] = useState(false);

  const exportToExcel = async () => {
    try {
      setBusy(true);
      const rows = data ?? (await getData?.());

      if (!rows?.length) {
        alert('No hay datos para exportar');
        return;
      }

      const wb  = XLSX.utils.book_new();
      const ws  = XLSX.utils.json_to_sheet(rows);
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      XLSX.writeFile(wb, `${reportName}.xlsx`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Button
      className={className}
      title={busy ? 'Generando…' : title}
      color={color}
      twColor={twColor}
      disabled={busy}
      variant="solid"
      onClick={exportToExcel}
      icon={<FaFileExcel />}
    />
  );
};

export default ExportToExcelButton;
