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

export const exportPaymentsToCsv = (
  rows: SmartExchangePayment[],
  activeTab: SmartExchangeTab
) => {
  const headers = [
    'Amount',
    'Vendor Entry',
    'Invoice #',
    'Customer',
    'Date Initiated',
    'Payment Method',
    'Status',
  ];
  const csvRows = rows.map((row) => [
    (row.amountCents / 100).toFixed(2),
    row.vendorEntry,
    row.invoiceNumber,
    row.customer,
    row.dateInitiated,
    getPaymentMethodLabel(row.paymentMethod),
    row.status,
  ]);
  const csv = [headers, ...csvRows]
    .map((line) =>
      line.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    )
    .join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `smart-exchange-${activeTab}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};

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
