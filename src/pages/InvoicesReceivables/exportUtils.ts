import type { Receivable } from './data';

export type ExportFormat = 'csv' | 'json' | 'xlsx' | 'pdf';

const EXPORT_HEADERS = [
  'Amount',
  'Currency',
  'Invoice Number',
  'Customer',
  'Created',
  'Due',
  'Presented',
  'Expected',
  'Payment Type',
  'Status',
] as const;

const toExportRows = (rows: Receivable[]) =>
  rows.map((row) => ({
    amount: row.amount,
    currency: row.amountCurrency,
    invoiceNumber: row.invoiceNumber,
    customer: row.customer,
    created: row.created,
    due: row.due,
    presented: row.presented,
    expected: row.expected,
    paymentType: row.paymentType ?? '',
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

const buildCsv = (rows: Receivable[]) => {
  const csvRows = toExportRows(rows).map((row) => [
    row.amount,
    row.currency,
    row.invoiceNumber,
    row.customer,
    row.created,
    row.due,
    row.presented,
    row.expected,
    row.paymentType,
    row.status,
  ]);
  return [EXPORT_HEADERS, ...csvRows]
    .map((line) =>
      line.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    )
    .join('\n');
};

export const exportReceivables = (
  rows: Receivable[],
  tabSlug: string,
  format: ExportFormat
) => {
  const filename = `receivables-${tabSlug}.${format === 'xlsx' ? 'xlsx' : format}`;

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
