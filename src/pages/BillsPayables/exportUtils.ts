import type { Payment } from './data';

export type ExportFormat = 'csv' | 'json' | 'xlsx' | 'pdf';

const EXPORT_HEADERS = [
  'Amount',
  'Currency',
  'Bill Reference',
  'Payee',
  'Payment Type',
  'Source',
  'Due Date',
  'Status',
] as const;

const toExportRows = (rows: Payment[]) =>
  rows.map((row) => ({
    amount: row.totalAmount,
    currency: row.amountValute,
    billReference: row.billReference,
    payee: row.payee,
    paymentType: row.paymentType ?? '',
    source: row.source,
    dueDate: row.dueDate,
    status: row.status,
  }));

const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

const buildCsv = (rows: Payment[]) => {
  const csvRows = toExportRows(rows).map((row) => [
    row.amount,
    row.currency,
    row.billReference,
    row.payee,
    row.paymentType,
    row.source,
    row.dueDate,
    row.status,
  ]);
  return [EXPORT_HEADERS, ...csvRows]
    .map((line) =>
      line.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    )
    .join('\n');
};

export const exportPayables = (
  rows: Payment[],
  tabSlug: string,
  format: ExportFormat
) => {
  const filename = `payables-${tabSlug}.${format === 'xlsx' ? 'xlsx' : format}`;

  if (format === 'json') {
    downloadBlob(
      new Blob([JSON.stringify(toExportRows(rows), null, 2)], {
        type: 'application/json;charset=utf-8;',
      }),
      filename
    );
    return;
  }

  // Demo sandbox: CSV payload for csv/xlsx/pdf downloads.
  const csv = buildCsv(rows);
  const mimeType =
    format === 'pdf'
      ? 'application/pdf'
      : format === 'xlsx'
        ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        : 'text/csv;charset=utf-8;';

  downloadBlob(new Blob([csv], { type: mimeType }), filename);
};
