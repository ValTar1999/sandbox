import type { SmartExchangePayment } from '../data';

export type AcceptedAttachmentMeta = {
  label: string;
  typeLabel: string;
  sizeLabel: string;
};

export const getAttachmentMeta = (filename: string): AcceptedAttachmentMeta => {
  const base = filename.replace(/\.[^.]+$/, '');
  const ext = filename.split('.').pop()?.toUpperCase() ?? 'FILE';
  const sizeMap: Record<string, string> = {
    photo_12432: '980.5 KB',
    photo_1: '980.5 KB',
    invoice_1: '1.3 MB',
    Adjuster_Report: '1.3 MB',
    Adjuster_Report_02: '1.3 MB',
    Card_Authorization: '1.3 MB',
  };
  return {
    label: base,
    typeLabel:
      ext === 'PDF' ? 'PDF' : ext === 'JPG' || ext === 'JPEG' ? 'JPG' : ext,
    sizeLabel: sizeMap[base] ?? '1.3 MB',
  };
};

export const getCardholderDetails = (payment: SmartExchangePayment) => {
  if (payment.paymentMethod.kind === 'card') {
    const { details } = payment.paymentMethod;
    const addressLines = [
      details.addressLine1,
      details.addressLine2,
      `${details.city}, ${details.state} ${details.zip}`,
      details.country,
    ].filter((line): line is string => Boolean(line?.trim()));

    return {
      name: details.cardholderName,
      addressLines,
    };
  }

  return {
    name: payment.customer,
    addressLines: ['3476 Orphan Road', 'Hayward, WI 54843', 'US'],
  };
};
