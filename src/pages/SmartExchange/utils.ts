import type { SmartExchangePayment, SmartExchangeTab } from './data';

export const formatAmountValue = (amountCents: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amountCents / 100);

export const getPaymentMethodLabel = (
  method: SmartExchangePayment['paymentMethod']
) =>
  method.kind === 'card'
    ? `Card •••• ${method.last4}`
    : 'SMART Exchange';

export type ExportFormat = 'csv' | 'json' | 'xlsx' | 'pdf';

const EXPORT_HEADERS = [
  'Amount',
  'Vendor Entry',
  'Invoice #',
  'Customer',
  'Date Initiated',
  'Payment Method',
  'Status',
] as const;

const toExportRows = (rows: SmartExchangePayment[]) =>
  rows.map((row) => ({
    amount: (row.amountCents / 100).toFixed(2),
    vendorEntry: row.vendorEntry,
    invoiceNumber: row.invoiceNumber,
    customer: row.customer,
    dateInitiated: row.dateInitiated,
    paymentMethod: getPaymentMethodLabel(row.paymentMethod),
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

const buildCsv = (rows: SmartExchangePayment[]) => {
  const csvRows = toExportRows(rows).map((row) => [
    row.amount,
    row.vendorEntry,
    row.invoiceNumber,
    row.customer,
    row.dateInitiated,
    row.paymentMethod,
    row.status,
  ]);
  return [EXPORT_HEADERS, ...csvRows]
    .map((line) =>
      line.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    )
    .join('\n');
};

export const exportPayments = (
  rows: SmartExchangePayment[],
  activeTab: SmartExchangeTab,
  format: ExportFormat
) => {
  const filename = `smart-exchange-${activeTab}.${format === 'xlsx' ? 'xlsx' : format}`;

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

export const exportPaymentsToCsv = (
  rows: SmartExchangePayment[],
  activeTab: SmartExchangeTab
) => exportPayments(rows, activeTab, 'csv');

export const getCardAddressLines = (
  details: Extract<
    SmartExchangePayment['paymentMethod'],
    { kind: 'card' }
  >['details']
) =>
  [
    details.addressLine1,
    details.addressLine2,
    [details.city, details.state, details.zip].filter(Boolean).join(', '),
    details.country,
  ].filter(Boolean);
