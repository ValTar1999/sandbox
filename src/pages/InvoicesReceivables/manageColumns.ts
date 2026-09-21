import type { ReceivableStatus } from './data';

/** Columns that can appear in ReceivablesTable (expand / actions are fixed). */
export type ReceivablesColumnId =
  | 'amount'
  | 'invoiceNumber'
  | 'customer'
  | 'created'
  | 'due'
  | 'presented'
  | 'expected'
  | 'paymentType'
  | 'status';

export type ReceivablesColumnConfig = {
  id: ReceivablesColumnId;
  visible: boolean;
};

export type ReceivablesColumnDefinition = {
  id: ReceivablesColumnId;
  label: string;
  badge?: string;
};

export const COLUMN_DEFINITIONS: Record<
  ReceivablesColumnId,
  ReceivablesColumnDefinition
> = {
  amount: { id: 'amount', label: 'Amount' },
  invoiceNumber: { id: 'invoiceNumber', label: 'Invoice Number' },
  customer: { id: 'customer', label: 'Customer' },
  created: { id: 'created', label: 'Created' },
  due: { id: 'due', label: 'Due' },
  presented: { id: 'presented', label: 'Presented' },
  expected: { id: 'expected', label: 'Expected' },
  paymentType: { id: 'paymentType', label: 'Payment Type' },
  status: { id: 'status', label: 'Status' },
};

export const ALL_COLUMN_IDS: ReceivablesColumnId[] = [
  'amount',
  'invoiceNumber',
  'customer',
  'created',
  'due',
  'presented',
  'expected',
  'paymentType',
  'status',
];

/** Default-visible columns per status tab — matches current ReceivablesTable. */
export const ACTIVE_COLUMNS_BY_TAB: Record<
  ReceivableStatus,
  ReceivablesColumnId[]
> = {
  'Ready to Invoice': [
    'amount',
    'invoiceNumber',
    'customer',
    'created',
    'due',
    'presented',
    'expected',
    'status',
  ],
  'In Progress': [
    'amount',
    'invoiceNumber',
    'customer',
    'created',
    'due',
    'presented',
    'expected',
    'paymentType',
    'status',
  ],
  Paid: [
    'amount',
    'invoiceNumber',
    'customer',
    'created',
    'due',
    'presented',
    'expected',
    'paymentType',
    'status',
  ],
  Exceptions: [
    'amount',
    'invoiceNumber',
    'customer',
    'created',
    'due',
    'presented',
    'expected',
    'paymentType',
    'status',
  ],
};

export const getDefaultColumnsForTab = (
  tab: ReceivableStatus
): ReceivablesColumnConfig[] => {
  const active = ACTIVE_COLUMNS_BY_TAB[tab];
  const activeSet = new Set(active);

  const activeConfigs = active.map((id) => ({ id, visible: true }));
  const inactiveConfigs = ALL_COLUMN_IDS.filter((id) => !activeSet.has(id)).map(
    (id) => ({ id, visible: false })
  );

  return [...activeConfigs, ...inactiveConfigs];
};

export const DEFAULT_COLUMNS_BY_TAB: Record<
  ReceivableStatus,
  ReceivablesColumnConfig[]
> = {
  'Ready to Invoice': getDefaultColumnsForTab('Ready to Invoice'),
  'In Progress': getDefaultColumnsForTab('In Progress'),
  Paid: getDefaultColumnsForTab('Paid'),
  Exceptions: getDefaultColumnsForTab('Exceptions'),
};

export const getManageColumnDefinition = (id: ReceivablesColumnId) =>
  COLUMN_DEFINITIONS[id];
