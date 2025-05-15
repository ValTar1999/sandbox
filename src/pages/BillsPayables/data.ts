export interface PayableItem {
  id: string;
  dueDate: string;
  amount: string;
}

export interface Vendor {
  name: string;
  paymentMethod: string;
  payables: PayableItem[];
}

export interface Payment {
  id: string;
  lock?: boolean;
  totalAmount: string;
  amountValute: string;
  billReference: string;
  badgeVendors?: string;
  payee: string;
  paymentType?: string;
  source: string;
  dueDate: string;
  status: string;
  notes: string;
  attachments: string;
  payableSummary?: {
    item: string;
    quantity: number;
    price: string;
    amount: string;
  }[];
  vendors?: Vendor[];
}

export const readyToPay: Payment[] = [
  {
    id: 'XZ1-A',
    totalAmount: '$90,365.80',
    amountValute: 'USD',
    billReference: 'XZ1-A',
    payee: 'Liam Stone',
    source: 'Sage (ERP)',
    dueDate: 'Aug 17, 2023',
    status: 'unprocessed',   
    notes: 'Payment for Q2 consulting services. Urgent processing required.',
    attachments: 'invoice_345.xml',
    payableSummary: [
      { item: 'Chair KS8671', quantity: 6, price: '$332.95', amount: '$1,997.70' },
      { item: 'Pillow FT1241', quantity: 2, price: '$50.95', amount: '$101.90' },
      { item: 'TV Unit OSK112', quantity: 1, price: '$1,250.50', amount: '$1,250.50' },
      { item: 'Table VGY716', quantity: 1, price: '$1,725.25', amount: '$1,725.25' },
      { item: 'Sofa OG00GY', quantity: 1, price: '$13,332.95', amount: '$13,332.95' },
      { item: 'Sofa OG00GY', quantity: 1, price: '$13,332.95', amount: '$13,332.95' },
      { item: 'Bed Frame 812HYG87', quantity: 1, price: '$9,125.95', amount: '$9,125.95' },
      { item: 'Sliding Door Cupboard 0912GD712', quantity: 1, price: '$25,250.95', amount: '$25,250.95' },
      { item: 'Bed Cover 1124FH8', quantity: 3, price: '$115.95', amount: '$347.80' },
    ],
    badgeVendors: '0',
  },
  {
    id: 'TY3-B',
    lock: true,
    totalAmount: '$30,100.00',
    amountValute: 'USD',
    billReference: 'TY3-B',
    payee: 'Sophia Nguyen',
    source: 'Sage (ERP)',
    dueDate: 'Aug 21, 2023',
    status: 'unprocessed',
    notes: 'Final invoice for marketing campaign.',
    attachments: 'receipt_final.xml',
    vendors: [
      {
        name: 'Nichol Nickel Mining',
        paymentMethod: 'ACH - Bank of America ••••1728',
        payables: [
          { id: 'LC7-A', dueDate: 'Jul 27, 2023', amount: '2,459.00' },
          { id: 'LC7-B', dueDate: 'Jun 22, 2023', amount: '500.00' },
          { id: 'LC7-A', dueDate: 'Jul 27, 2023', amount: '2,459.00' },
          { id: 'LC7-B', dueDate: 'Jun 22, 2023', amount: '500.00' },
          { id: 'LC7-A', dueDate: 'Jul 27, 2023', amount: '2,459.00' },
          { id: 'LC7-B', dueDate: 'Jun 22, 2023', amount: '500.00' },
          { id: 'LC7-A', dueDate: 'Jul 27, 2023', amount: '2,459.00' },
          { id: 'LC7-B', dueDate: 'Jun 22, 2023', amount: '500.00' },
        ]
      },
      {
        name: 'Liam Anderson',
        paymentMethod: 'SMART Disburse • comas@tequila.me',
        payables: [
          { id: 'LC7-C', dueDate: 'May 15, 2023', amount: '575.00' },
          { id: 'LC7-D', dueDate: 'Apr 12, 2023', amount: '988.00' }
        ]
      },
      {
        name: 'Ava Martinez',
        paymentMethod: '',
        payables: []
      }
    ],
    badgeVendors: '0',
  },
];

export const inProgress: Payment[] = [
  {
    id: 'MV9-J',
    totalAmount: '$20,100.00',
    amountValute: 'USD',
    billReference: 'MV9-J',
    paymentType: 'ACH',
    payee: 'Carlos Romero',
    source: 'Sage (ERP)',
    dueDate: 'Aug 24, 2023',
    status: 'processed',
    notes: 'Pending approval from finance manager.',
    attachments: 'doc789.xml',
  },
  {
    id: 'QN8-Z',
    totalAmount: '$20,100.00',
    amountValute: 'USD',
    billReference: 'QN8-Z',
    paymentType: 'sd',
    payee: 'Ava Schmidt',
    source: 'Sage (ERP)',
    dueDate: 'Aug 26, 2023',
    status: 'processed',
    notes: 'Includes additional fees for expedited delivery.',
    attachments: 'extra_charges.xml',
  },
  {
    id: 'QN8-Z0',
    totalAmount: '$50,100.00',
    amountValute: 'USD',
    billReference: 'QN8-X',
    paymentType: 'Card',
    payee: 'Eva Schmidt',
    source: 'Batch Upload',
    dueDate: 'Aug 26, 2023',
    status: 'pastDue',
    notes: 'Includes additional fees for expedited delivery.',
    attachments: 'extra_charges.xml',
  },
];

export const paid: Payment[] = [
  {
    id: 'KP4-L',
    totalAmount: '$20,100.00',
    amountValute: 'USD',
    billReference: 'KP4-L',
    payee: 'Noah Thompson',
    source: 'Sage (ERP)',
    dueDate: 'Aug 28, 2023',
    status: 'paid',
    notes: 'Payment completed via ACH transfer.',
    attachments: 'confirmation_2023.xml',
  },
  {
    id: 'UJ2-R',
    totalAmount: '$20,100.00',
    amountValute: 'USD',
    billReference: 'UJ2-R',
    payee: 'Emma Fischer',
    source: 'Sage (ERP)',
    dueDate: 'Sep 01, 2023',
    status: 'paid',
    notes: 'Paid on time, no issues reported.',
    attachments: 'receipt_aug.xml',
  },
  {
    id: 'RW3-D',
    totalAmount: '$20,100.00',
    amountValute: 'USD',
    billReference: 'RW3-D',
    payee: 'James Okafor',
    source: 'Sage (ERP)',
    dueDate: 'Sep 03, 2023',
    status: 'paid',
    notes: 'Monthly subscription charge.',
    attachments: 'sub_2023_august.xml',
  },
];

export const exceptions: Payment[] = [
  {
    id: 'ZC7-W',
    totalAmount: '$20,100.00',
    amountValute: 'USD',
    billReference: 'ZC7-W',
    payee: 'Isabella Laurent',
    source: 'Sage (ERP)',
    dueDate: 'Sep 07, 2023',
    status: 'failed',
    notes: 'Payment failed due to invalid bank details.',
    attachments: 'error_log.xml',
  },
];

export const payments: Payment[] = [
  ...readyToPay,
  ...inProgress,
  ...paid,
  ...exceptions,
];

payments.forEach(payment => {
  if (payment.vendors) {
    payment.badgeVendors = payment.vendors.length.toString();
    payment.badgeVendors = "0";
  }
});
