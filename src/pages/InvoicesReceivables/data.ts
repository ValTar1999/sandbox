export type PaymentType = 'smartCollect' | 'bank' | 'card' | 'rfp' | 'ach';

export interface PaymentMethodItem {
  id: string;
  type: PaymentType;
  label: string;
  accountId?: string;
  date: string;
  status: 'waitingOnCustomer' | 'inProcess' | 'pastDue';
}

export interface ActivityLogItem {
  id: string;
  status: 'paid' | 'processing' | 'initiated' | 'pending' | 'failed';
  description: string;
  timestamp: string;
}

export interface ReceivableSummaryItem {
  item: string;
  quantity: number;
  price: string;
  amount: string;
}

export interface Receivable {
  id: string;
  amount: string;
  amountCurrency: string;
  invoiceNumber: string;
  customer: string;
  created: string;
  due: string;
  presented: string;
  expected: string;
  status: 'unprocessed' | 'processed' | 'paid' | 'failed' | 'pastDue';
  notes?: string;
  paymentType?: PaymentType;
  accountId?: string;
  paymentMethods?: PaymentMethodItem[];
  attachments?: string[];
  activityLog?: ActivityLogItem[];
  receivableSummary?: ReceivableSummaryItem[];
}

export const statusMap = {
  'Ready to Invoice': 'unprocessed',
  'In Progress': ['processed', 'pastDue'],
  'Paid': 'paid',
  'Exceptions': 'failed',
} as const;

export const receivables: Receivable[] = [
  {
    id: '1',
    amount: '$1,892.00',
    amountCurrency: 'USD',
    invoiceNumber: 'KQ5-B',
    customer: "Hubert Blaine Wolfeschlegelsteinhausenbergerdorff Sr.",
    created: 'Jun 17, 2022',
    due: 'Jun 21, 2022',
    presented: '-',
    expected: '-',
    status: 'unprocessed',
    notes: 'Ligula vehicula consequat morbi a ipsum integer a nibh in quis justo maecenas rhoncus aliquam lacus morbi',
    attachments: ['file01.xml'],
    receivableSummary: [
      { item: 'Chair KS8671', quantity: 6, price: '$332.95', amount: '$1,997.70' },
      { item: 'Pillow FT1241', quantity: 2, price: '$50.95', amount: '$101.90' },
      { item: 'TV Unit OSK112', quantity: 1, price: '$1,250.50', amount: '$1,250.50' },
      { item: 'Table VGY716', quantity: 1, price: '$1,725.25', amount: '$1,725.25' },
      { item: 'Sofa OG00GY', quantity: 1, price: '$13,332.95', amount: '$13,332.95' },
      { item: 'Bed Frame 812HYG87', quantity: 1, price: '$9,125.95', amount: '$9,125.95' },
      { item: 'Sliding Door Cupboard 0912GD712', quantity: 1, price: '$25,250.95', amount: '$25,250.95' },
      { item: 'Bed Cover 1124FH8', quantity: 3, price: '$115.95', amount: '$347.80' },
    ],
    activityLog: [
      {
        id: '1',
        status: 'pending',
        description: 'Bill for receivable id #2345REQ3 is pending initiation on 06/17/2022',
        timestamp: 'Jun 17, 2022 10:40 AM (EST)',
      },
    ],
  },
  {
    id: '2',
    amount: '$1,983,526.00',
    amountCurrency: 'USD',
    invoiceNumber: 'TA6-D',
    customer: "He's Organic Foods",
    created: 'Jun 15, 2022',
    due: 'Jun 28, 2022',
    presented: '-',
    expected: '-',
    status: 'unprocessed',
    notes: 'Q2 organic produce delivery.',
  },
  {
    id: '3',
    amount: '$2,033,582.00',
    amountCurrency: 'USD',
    invoiceNumber: 'WL9-E',
    customer: "Likang's Bakery",
    created: 'Jun 18, 2022',
    due: 'Jul 26, 2022',
    presented: '-',
    expected: '-',
    status: 'unprocessed',
    notes: 'Bulk flour and ingredients order.',
  },
  {
    id: '4',
    amount: '$45,230.00',
    amountCurrency: 'USD',
    invoiceNumber: 'RX2-F',
    customer: 'Rad Roofing',
    created: 'Jun 12, 2022',
    due: 'Jul 12, 2022',
    presented: '-',
    expected: '-',
    status: 'unprocessed',
    notes: 'Roof repair services invoice.',
  },
  {
    id: '5',
    amount: '$12,500.00',
    amountCurrency: 'USD',
    invoiceNumber: 'MN7-G',
    customer: 'Tech Solutions Inc.',
    created: 'Jun 20, 2022',
    due: 'Jul 20, 2022',
    presented: '-',
    expected: '-',
    status: 'unprocessed',
    notes: 'Software licensing fees.',
  },
  {
    id: '6',
    amount: '$89,100.00',
    amountCurrency: 'USD',
    invoiceNumber: 'PQ3-H',
    customer: 'Green Valley Farms',
    created: 'Jun 10, 2022',
    due: 'Jul 10, 2022',
    presented: '-',
    expected: '-',
    status: 'unprocessed',
    notes: 'Agricultural equipment rental.',
  },
  {
    id: '7',
    amount: '$3,450.00',
    amountCurrency: 'USD',
    invoiceNumber: 'ST8-I',
    customer: 'Metro Logistics',
    created: 'Jun 22, 2022',
    due: 'Jul 22, 2022',
    presented: '-',
    expected: '-',
    status: 'unprocessed',
    notes: 'Freight and shipping services.',
  },
  {
    id: '8',
    amount: '$156,780.00',
    amountCurrency: 'USD',
    invoiceNumber: 'UV4-J',
    customer: 'Pacific Construction',
    created: 'Jun 14, 2022',
    due: 'Jul 14, 2022',
    presented: '-',
    expected: '-',
    status: 'unprocessed',
    notes: 'Construction materials invoice.',
  },
  {
    id: '9',
    amount: '$5,670.00',
    amountCurrency: 'USD',
    invoiceNumber: 'WX1-K',
    customer: 'Sunrise Catering',
    created: 'Jun 19, 2022',
    due: 'Jul 19, 2022',
    presented: '-',
    expected: '-',
    status: 'unprocessed',
    notes: 'Event catering services.',
  },
  {
    id: '10',
    amount: '$234,500.00',
    amountCurrency: 'USD',
    invoiceNumber: 'YZ6-L',
    customer: 'Northern Manufacturing',
    created: 'Jun 16, 2022',
    due: 'Jul 16, 2022',
    presented: '-',
    expected: '-',
    status: 'unprocessed',
    notes: 'Industrial equipment parts.',
  },
  { id: '11-u', amount: '$7,200.00', amountCurrency: 'USD', invoiceNumber: 'KQ5-C', customer: 'Alpha Corp', created: 'Jun 17, 2022', due: 'Jun 22, 2022', presented: '-', expected: '-', status: 'unprocessed' as const, notes: '' },
  { id: '12-u', amount: '$18,500.00', amountCurrency: 'USD', invoiceNumber: 'TA6-E', customer: 'Beta Industries', created: 'Jun 16, 2022', due: 'Jun 29, 2022', presented: '-', expected: '-', status: 'unprocessed' as const, notes: '' },
  { id: '13-u', amount: '$3,100.00', amountCurrency: 'USD', invoiceNumber: 'WL9-F', customer: 'Gamma LLC', created: 'Jun 19, 2022', due: 'Jul 27, 2022', presented: '-', expected: '-', status: 'unprocessed' as const, notes: '' },
  { id: '14-u', amount: '$42,000.00', amountCurrency: 'USD', invoiceNumber: 'RX2-G', customer: 'Delta Services', created: 'Jun 13, 2022', due: 'Jul 13, 2022', presented: '-', expected: '-', status: 'unprocessed' as const, notes: '' },
  { id: '15-u', amount: '$9,800.00', amountCurrency: 'USD', invoiceNumber: 'MN7-H', customer: 'Epsilon Group', created: 'Jun 21, 2022', due: 'Jul 21, 2022', presented: '-', expected: '-', status: 'unprocessed' as const, notes: '' },
  { id: '16-u', amount: '$125,000.00', amountCurrency: 'USD', invoiceNumber: 'PQ3-I', customer: 'Zeta Enterprises', created: 'Jun 11, 2022', due: 'Jul 11, 2022', presented: '-', expected: '-', status: 'unprocessed' as const, notes: '' },
  { id: '17-u', amount: '$2,400.00', amountCurrency: 'USD', invoiceNumber: 'ST8-J', customer: 'Eta Solutions', created: 'Jun 23, 2022', due: 'Jul 23, 2022', presented: '-', expected: '-', status: 'unprocessed' as const, notes: '' },
  { id: '18-u', amount: '$88,900.00', amountCurrency: 'USD', invoiceNumber: 'UV4-K', customer: 'Theta Partners', created: 'Jun 15, 2022', due: 'Jul 15, 2022', presented: '-', expected: '-', status: 'unprocessed' as const, notes: '' },
  { id: '19-u', amount: '$4,200.00', amountCurrency: 'USD', invoiceNumber: 'WX1-L', customer: 'Iota Consulting', created: 'Jun 20, 2022', due: 'Jul 20, 2022', presented: '-', expected: '-', status: 'unprocessed' as const, notes: '' },
  { id: '20-u', amount: '$56,300.00', amountCurrency: 'USD', invoiceNumber: 'YZ6-M', customer: 'Kappa Ltd', created: 'Jun 18, 2022', due: 'Jul 18, 2022', presented: '-', expected: '-', status: 'unprocessed' as const, notes: '' },
  { id: '21-u', amount: '$11,750.00', amountCurrency: 'USD', invoiceNumber: 'AB9-N', customer: 'Lambda Inc', created: 'Jun 14, 2022', due: 'Jul 14, 2022', presented: '-', expected: '-', status: 'unprocessed' as const, notes: '' },
  { id: '22-u', amount: '$33,400.00', amountCurrency: 'USD', invoiceNumber: 'CD2-O', customer: 'Mu Corp', created: 'Jun 24, 2022', due: 'Jul 24, 2022', presented: '-', expected: '-', status: 'unprocessed' as const, notes: '' },
  // In Progress
  {
    id: 'ip-1',
    amount: '$15,200.00',
    amountCurrency: 'USD',
    invoiceNumber: 'AB9-M',
    customer: 'City Utilities Co.',
    created: 'Jun 08, 2022',
    due: 'Jul 08, 2022',
    presented: 'Jun 25, 2022',
    expected: 'Jul 08, 2022',
    status: 'processed',
    notes: 'Ligula vehicula consequat morbi a ipsum integer a nibh in quis justo maecenas rhoncus aliquam lacus morbi',
    paymentMethods: [
      { id: 'pm-1-1', type: 'smartCollect', label: 'SMART Collect', date: 'Jul 02, 2022', status: 'waitingOnCustomer' },
      { id: 'pm-1-2', type: 'bank', label: 'Bank', accountId: '1010', date: 'Jul 02, 2022', status: 'waitingOnCustomer' },
      { id: 'pm-1-3', type: 'card', label: 'Card', accountId: '5612', date: '-', status: 'waitingOnCustomer' },
    ],
    attachments: ['file01.xml'],
    activityLog: [
      { id: 'al-ip-1', status: 'processing', description: 'Bill for receivable id #2345REQ3 is processing', timestamp: 'Aug 29, 2023 10:40 AM (EST)' },
      { id: 'al-ip-2', status: 'initiated', description: 'Bill for receivable id #2345REQ3 has been initiated', timestamp: 'Aug 29, 2023 10:40 AM (EST)' },
      { id: 'al-ip-3', status: 'pending', description: 'Bill for receivable id #2345REQ3 is pending billing', timestamp: 'Aug 29, 2023 10:40 AM (EST)' },
      { id: 'al-ip-4', status: 'pending', description: 'Bill for receivable id #2345REQ3 was created', timestamp: 'Aug 28, 2023 09:15 AM (EST)' },
    ],
  },
  {
    id: 'ip-2',
    amount: '$67,890.00',
    amountCurrency: 'USD',
    invoiceNumber: 'CD2-N',
    customer: 'Global Logistics',
    created: 'Jun 05, 2022',
    due: 'Jul 05, 2022',
    presented: 'Jun 20, 2022',
    expected: 'Jul 05, 2022',
    status: 'processed',
    notes: 'Ligula vehicula consequat morbi a ipsum integer a nibh in quis justo maecenas rhoncus aliquam lacus morbi',
    paymentMethods: [
      { id: 'pm-2-1', type: 'rfp', label: 'RfP', date: 'Jul 01, 2022', status: 'pastDue' },
      { id: 'pm-2-2', type: 'ach', label: 'ACH', date: 'Jul 02, 2022', status: 'inProcess' },
    ],
    attachments: ['file01.xml'],
    activityLog: [
      { id: 'al-ip2-1', status: 'processing', description: 'Bill for receivable id #2345REQ3 is processing', timestamp: 'Aug 29, 2023 10:40 AM (EST)' },
      { id: 'al-ip2-2', status: 'initiated', description: 'Bill for receivable id #2345REQ3 has been initiated', timestamp: 'Aug 29, 2023 10:40 AM (EST)' },
      { id: 'al-ip2-3', status: 'pending', description: 'Bill for receivable id #2345REQ3 is pending billing', timestamp: 'Aug 29, 2023 10:40 AM (EST)' },
    ],
  },
  { id: 'ip-3', amount: '$22,100.00', amountCurrency: 'USD', invoiceNumber: 'IP3-001', customer: 'Omega Corp', created: 'Jun 01, 2022', due: 'Jul 01, 2022', presented: 'Jun 18, 2022', expected: 'Jul 01, 2022', status: 'processed' as const, notes: 'Ligula vehicula consequat morbi a ipsum integer a nibh in quis justo maecenas rhoncus aliquam lacus morbi', paymentMethods: [{ id: 'pm-3-1', type: 'ach', label: 'ACH', date: 'Jul 01, 2022', status: 'inProcess' }], attachments: ['file01.xml'], activityLog: [{ id: 'al-ip3-1', status: 'processing', description: 'Bill for receivable id #2345REQ3 is processing', timestamp: 'Aug 29, 2023 10:40 AM (EST)' }, { id: 'al-ip3-2', status: 'initiated', description: 'Bill for receivable id #2345REQ3 has been initiated', timestamp: 'Aug 29, 2023 10:40 AM (EST)' }, { id: 'al-ip3-3', status: 'pending', description: 'Bill for receivable id #2345REQ3 is pending billing', timestamp: 'Aug 29, 2023 10:40 AM (EST)' }] },
  { id: 'ip-4', amount: '$14,500.00', amountCurrency: 'USD', invoiceNumber: 'IP4-002', customer: 'Sigma Ltd', created: 'Jun 02, 2022', due: 'Jul 02, 2022', presented: 'Jun 19, 2022', expected: 'Jul 02, 2022', status: 'processed' as const, notes: 'Ligula vehicula consequat morbi a ipsum integer a nibh in quis justo maecenas rhoncus aliquam lacus morbi', paymentMethods: [{ id: 'pm-4-1', type: 'bank', label: 'Bank', accountId: '1010', date: 'Jul 02, 2022', status: 'waitingOnCustomer' }], attachments: ['file01.xml'], activityLog: [{ id: 'al-ip4-1', status: 'processing', description: 'Bill for receivable id #2345REQ3 is processing', timestamp: 'Aug 29, 2023 10:40 AM (EST)' }, { id: 'al-ip4-2', status: 'initiated', description: 'Bill for receivable id #2345REQ3 has been initiated', timestamp: 'Aug 29, 2023 10:40 AM (EST)' }, { id: 'al-ip4-3', status: 'pending', description: 'Bill for receivable id #2345REQ3 is pending billing', timestamp: 'Aug 29, 2023 10:40 AM (EST)' }] },
  { id: 'ip-5', amount: '$89,200.00', amountCurrency: 'USD', invoiceNumber: 'IP5-003', customer: 'Tau Industries', created: 'Jun 03, 2022', due: 'Jul 03, 2022', presented: 'Jun 20, 2022', expected: 'Jul 03, 2022', status: 'processed' as const, notes: 'Ligula vehicula consequat morbi a ipsum integer a nibh in quis justo maecenas rhoncus aliquam lacus morbi', paymentMethods: [{ id: 'pm-5-1', type: 'card', label: 'Card', accountId: '5612', date: 'Jul 03, 2022', status: 'inProcess' }], attachments: ['file01.xml'], activityLog: [{ id: 'al-ip5-1', status: 'processing', description: 'Bill for receivable id #2345REQ3 is processing', timestamp: 'Aug 29, 2023 10:40 AM (EST)' }, { id: 'al-ip5-2', status: 'initiated', description: 'Bill for receivable id #2345REQ3 has been initiated', timestamp: 'Aug 29, 2023 10:40 AM (EST)' }, { id: 'al-ip5-3', status: 'pending', description: 'Bill for receivable id #2345REQ3 is pending billing', timestamp: 'Aug 29, 2023 10:40 AM (EST)' }] },
  { id: 'ip-6', amount: '$5,600.00', amountCurrency: 'USD', invoiceNumber: 'IP6-004', customer: 'Upsilon Inc', created: 'Jun 04, 2022', due: 'Jul 04, 2022', presented: 'Jun 21, 2022', expected: 'Jul 04, 2022', status: 'processed' as const, notes: 'Ligula vehicula consequat morbi a ipsum integer a nibh in quis justo maecenas rhoncus aliquam lacus morbi', paymentMethods: [{ id: 'pm-6-1', type: 'rfp', label: 'RfP', date: 'Jul 04, 2022', status: 'pastDue' }], attachments: ['file01.xml'], activityLog: [{ id: 'al-ip6-1', status: 'processing', description: 'Bill for receivable id #2345REQ3 is processing', timestamp: 'Aug 29, 2023 10:40 AM (EST)' }, { id: 'al-ip6-2', status: 'initiated', description: 'Bill for receivable id #2345REQ3 has been initiated', timestamp: 'Aug 29, 2023 10:40 AM (EST)' }, { id: 'al-ip6-3', status: 'pending', description: 'Bill for receivable id #2345REQ3 is pending billing', timestamp: 'Aug 29, 2023 10:40 AM (EST)' }] },
  { id: 'ip-7', amount: '$31,400.00', amountCurrency: 'USD', invoiceNumber: 'IP7-005', customer: 'Phi Group', created: 'Jun 06, 2022', due: 'Jul 06, 2022', presented: 'Jun 22, 2022', expected: 'Jul 06, 2022', status: 'processed' as const, notes: 'Ligula vehicula consequat morbi a ipsum integer a nibh in quis justo maecenas rhoncus aliquam lacus morbi', paymentMethods: [{ id: 'pm-7-1', type: 'smartCollect', label: 'SMART Collect', date: 'Jul 06, 2022', status: 'waitingOnCustomer' }], attachments: ['file01.xml'], activityLog: [{ id: 'al-ip7-1', status: 'processing', description: 'Bill for receivable id #2345REQ3 is processing', timestamp: 'Aug 29, 2023 10:40 AM (EST)' }, { id: 'al-ip7-2', status: 'initiated', description: 'Bill for receivable id #2345REQ3 has been initiated', timestamp: 'Aug 29, 2023 10:40 AM (EST)' }, { id: 'al-ip7-3', status: 'pending', description: 'Bill for receivable id #2345REQ3 is pending billing', timestamp: 'Aug 29, 2023 10:40 AM (EST)' }] },
  { id: 'ip-8', amount: '$17,800.00', amountCurrency: 'USD', invoiceNumber: 'IP8-006', customer: 'Chi Services', created: 'Jun 07, 2022', due: 'Jul 07, 2022', presented: 'Jun 23, 2022', expected: 'Jul 07, 2022', status: 'processed' as const, notes: 'Ligula vehicula consequat morbi a ipsum integer a nibh in quis justo maecenas rhoncus aliquam lacus morbi', paymentMethods: [{ id: 'pm-8-1', type: 'ach', label: 'ACH', date: 'Jul 07, 2022', status: 'inProcess' }], attachments: ['file01.xml'], activityLog: [{ id: 'al-ip8-1', status: 'processing', description: 'Bill for receivable id #2345REQ3 is processing', timestamp: 'Aug 29, 2023 10:40 AM (EST)' }, { id: 'al-ip8-2', status: 'initiated', description: 'Bill for receivable id #2345REQ3 has been initiated', timestamp: 'Aug 29, 2023 10:40 AM (EST)' }, { id: 'al-ip8-3', status: 'pending', description: 'Bill for receivable id #2345REQ3 is pending billing', timestamp: 'Aug 29, 2023 10:40 AM (EST)' }] },
  { id: 'ip-9', amount: '$52,300.00', amountCurrency: 'USD', invoiceNumber: 'IP9-007', customer: 'Psi Partners', created: 'Jun 09, 2022', due: 'Jul 09, 2022', presented: 'Jun 24, 2022', expected: 'Jul 09, 2022', status: 'processed' as const, notes: 'Ligula vehicula consequat morbi a ipsum integer a nibh in quis justo maecenas rhoncus aliquam lacus morbi', paymentMethods: [{ id: 'pm-9-1', type: 'bank', label: 'Bank', accountId: '1010', date: 'Jul 09, 2022', status: 'waitingOnCustomer' }], attachments: ['file01.xml'], activityLog: [{ id: 'al-ip9-1', status: 'processing', description: 'Bill for receivable id #2345REQ3 is processing', timestamp: 'Aug 29, 2023 10:40 AM (EST)' }, { id: 'al-ip9-2', status: 'initiated', description: 'Bill for receivable id #2345REQ3 has been initiated', timestamp: 'Aug 29, 2023 10:40 AM (EST)' }, { id: 'al-ip9-3', status: 'pending', description: 'Bill for receivable id #2345REQ3 is pending billing', timestamp: 'Aug 29, 2023 10:40 AM (EST)' }] },
  { id: 'ip-10', amount: '$12,900.00', amountCurrency: 'USD', invoiceNumber: 'IP10-008', customer: 'Omega Plus', created: 'Jun 10, 2022', due: 'Jul 10, 2022', presented: 'Jun 26, 2022', expected: 'Jul 10, 2022', status: 'processed' as const, notes: 'Ligula vehicula consequat morbi a ipsum integer a nibh in quis justo maecenas rhoncus aliquam lacus morbi', paymentMethods: [{ id: 'pm-10-1', type: 'card', label: 'Card', accountId: '5612', date: 'Jul 10, 2022', status: 'pastDue' }], attachments: ['file01.xml'], activityLog: [{ id: 'al-ip10-1', status: 'processing', description: 'Bill for receivable id #2345REQ3 is processing', timestamp: 'Aug 29, 2023 10:40 AM (EST)' }, { id: 'al-ip10-2', status: 'initiated', description: 'Bill for receivable id #2345REQ3 has been initiated', timestamp: 'Aug 29, 2023 10:40 AM (EST)' }, { id: 'al-ip10-3', status: 'pending', description: 'Bill for receivable id #2345REQ3 is pending billing', timestamp: 'Aug 29, 2023 10:40 AM (EST)' }] },
  { id: 'ip-11', amount: '$45,600.00', amountCurrency: 'USD', invoiceNumber: 'IP11-009', customer: 'Alpha Beta', created: 'Jun 11, 2022', due: 'Jul 11, 2022', presented: 'Jun 27, 2022', expected: 'Jul 11, 2022', status: 'processed' as const, notes: 'Ligula vehicula consequat morbi a ipsum integer a nibh in quis justo maecenas rhoncus aliquam lacus morbi', paymentMethods: [{ id: 'pm-11-1', type: 'rfp', label: 'RfP', date: 'Jul 11, 2022', status: 'inProcess' }], attachments: ['file01.xml'], activityLog: [{ id: 'al-ip11-1', status: 'processing', description: 'Bill for receivable id #2345REQ3 is processing', timestamp: 'Aug 29, 2023 10:40 AM (EST)' }, { id: 'al-ip11-2', status: 'initiated', description: 'Bill for receivable id #2345REQ3 has been initiated', timestamp: 'Aug 29, 2023 10:40 AM (EST)' }, { id: 'al-ip11-3', status: 'pending', description: 'Bill for receivable id #2345REQ3 is pending billing', timestamp: 'Aug 29, 2023 10:40 AM (EST)' }] },
  { id: 'ip-12', amount: '$28,700.00', amountCurrency: 'USD', invoiceNumber: 'IP12-010', customer: 'Gamma Delta', created: 'Jun 12, 2022', due: 'Jul 12, 2022', presented: 'Jun 28, 2022', expected: 'Jul 12, 2022', status: 'processed' as const, notes: 'Ligula vehicula consequat morbi a ipsum integer a nibh in quis justo maecenas rhoncus aliquam lacus morbi', paymentMethods: [{ id: 'pm-12-1', type: 'smartCollect', label: 'SMART Collect', date: 'Jul 12, 2022', status: 'waitingOnCustomer' }], attachments: ['file01.xml'], activityLog: [{ id: 'al-ip12-1', status: 'processing', description: 'Bill for receivable id #2345REQ3 is processing', timestamp: 'Aug 29, 2023 10:40 AM (EST)' }, { id: 'al-ip12-2', status: 'initiated', description: 'Bill for receivable id #2345REQ3 has been initiated', timestamp: 'Aug 29, 2023 10:40 AM (EST)' }, { id: 'al-ip12-3', status: 'pending', description: 'Bill for receivable id #2345REQ3 is pending billing', timestamp: 'Aug 29, 2023 10:40 AM (EST)' }] },
  // Paid
  {
    id: 'paid-1',
    amount: '$1,829.00',
    amountCurrency: 'USD',
    invoiceNumber: 'GH5',
    customer: "Hubert Blaine Wolfeschlegelsteinh...",
    created: 'May 25, 2022',
    due: 'Jul 24, 2022',
    presented: 'Jun 19, 2022',
    expected: 'Jul 24, 2022',
    status: 'paid',
    notes: 'Ligula vehicula consequat morbi a ipsum integer a nibh in quis justo maecenas rhoncus aliquam lacus morbi',
    paymentType: 'smartCollect',
    attachments: ['file01.xml'],
    activityLog: [
      { id: 'al-1', status: 'paid', description: 'Bill for receivable id #2345REQ3 has been paid with SMART Collect with payment type: Card Payment', timestamp: 'Aug 29, 2023 10:40 AM (EST)' },
      { id: 'al-2', status: 'processing', description: 'Bill for receivable id #2345REQ3 is processing', timestamp: 'Aug 29, 2023 10:40 AM (EST)' },
      { id: 'al-3', status: 'initiated', description: 'Bill for receivable id #2345REQ3 has been initiated', timestamp: 'Aug 29, 2023 10:40 AM (EST)' },
    ],
  },
  {
    id: 'paid-2',
    amount: '$1,646,246.32',
    amountCurrency: 'USD',
    invoiceNumber: 'VFJ5483N',
    customer: "Richard's Rock and Roll Rentals",
    created: 'May 20, 2022',
    due: 'Jul 20, 2022',
    presented: 'Jun 15, 2022',
    expected: 'Jul 20, 2022',
    status: 'paid',
    paymentType: 'bank',
    accountId: '1010',
  },
  {
    id: 'paid-3',
    amount: '$1,906,258.52',
    amountCurrency: 'USD',
    invoiceNumber: 'FJ68D',
    customer: "Likang's Bakery",
    created: 'May 18, 2022',
    due: 'Jul 18, 2022',
    presented: 'Jun 12, 2022',
    expected: 'Jul 18, 2022',
    status: 'paid',
    paymentType: 'card',
    accountId: '5612',
  },
  {
    id: 'paid-4',
    amount: '$45,230.00',
    amountCurrency: 'USD',
    invoiceNumber: 'PAID-1004',
    customer: 'Rad Roofing',
    created: 'May 15, 2022',
    due: 'Jun 15, 2022',
    presented: 'Jun 01, 2022',
    expected: 'Jun 15, 2022',
    status: 'paid',
    paymentType: 'rfp',
  },
  {
    id: 'paid-5',
    amount: '$12,500.00',
    amountCurrency: 'USD',
    invoiceNumber: 'PAID-1005',
    customer: 'Tech Solutions Inc.',
    created: 'May 15, 2022',
    due: 'Jun 15, 2022',
    presented: 'Jun 01, 2022',
    expected: 'Jun 15, 2022',
    status: 'paid',
    paymentType: 'ach',
  },
  ...Array.from({ length: 20 }, (_, i) => {
    const types: Array<'smartCollect' | 'bank' | 'card' | 'rfp' | 'ach'> = ['smartCollect', 'bank', 'card', 'rfp', 'ach'];
    return {
      id: `paid-${i + 6}`,
      amount: `$${(Math.random() * 50000 + 1000).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`,
      amountCurrency: 'USD' as const,
      invoiceNumber: `PAID-${1006 + i}`,
      customer: `Paid Customer ${i + 1}`,
      created: 'May 15, 2022',
      due: 'Jun 15, 2022',
      presented: 'Jun 01, 2022',
      expected: 'Jun 15, 2022',
      status: 'paid' as const,
      notes: '',
      paymentType: types[i % 5],
      accountId: types[i % 5] === 'bank' ? '1010' : types[i % 5] === 'card' ? '5612' : undefined,
    };
  }),
  // Exceptions
  {
    id: 'ex-1',
    amount: '$1,829.00',
    amountCurrency: 'USD',
    invoiceNumber: 'PS9FJGL',
    customer: "Hubert Blaine Wolfes...",
    created: 'May 5, 2022',
    due: 'Jul 12, 2022',
    presented: 'Jun 7, 2022',
    expected: '-',
    status: 'failed',
    notes: 'Ligula vehicula consequat morbi a ipsum integer a nibh in quis justo maecenas rhoncus aliquam lacus morbi',
    paymentType: 'smartCollect',
    attachments: ['file01.xml'],
    activityLog: [
      { id: 'al-ex-1', status: 'failed', description: 'Bill for receivable id #2345REQ3 failed due to internal error', timestamp: 'Aug 29, 2023 10:40 AM (EST)' },
      { id: 'al-ex-2', status: 'processing', description: 'Bill for receivable id #2345REQ3 is processing', timestamp: 'Aug 29, 2023 10:40 AM (EST)' },
      { id: 'al-ex-3', status: 'initiated', description: 'Bill for receivable id #2345REQ3 has been initiated', timestamp: 'Aug 29, 2023 10:40 AM (EST)' },
    ],
  },
  { id: 'ex-2', amount: '$45,000.00', amountCurrency: 'USD', invoiceNumber: 'EX2-001', customer: 'Exception Co.', created: 'Jun 05, 2022', due: 'Jul 05, 2022', presented: '-', expected: '-', status: 'failed' as const, notes: 'Bank account closed.', paymentType: 'bank' as const, accountId: '1010' },
  { id: 'ex-3', amount: '$12,300.00', amountCurrency: 'USD', invoiceNumber: 'EX3-002', customer: 'Error Inc', created: 'Jun 10, 2022', due: 'Jul 10, 2022', presented: '-', expected: '-', status: 'failed' as const, notes: 'Invalid routing number.', paymentType: 'ach' as const },
];

export type ReceivableStatus = keyof typeof statusMap;
