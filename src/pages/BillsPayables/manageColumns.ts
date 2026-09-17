/** Columns that can appear in RootTable (expand / checkbox / actions are fixed). */
export type ManageColumnId =
  | 'amount'
  | 'billReference'
  | 'payee'
  | 'source'
  | 'dueDate'
  | 'status'
  | 'paymentType'
  | 'paymentDate'
  | 'failureReason';

export type ManageColumnConfig = {
  id: ManageColumnId;
  visible: boolean;
};

export type PayablesStatusTab =
  | 'Ready to Pay'
  | 'In Progress'
  | 'Paid'
  | 'Exceptions';

export type ManageColumnDefinition = {
  id: ManageColumnId;
  label: string;
  badge?: string;
};

export const COLUMN_DEFINITIONS: Record<ManageColumnId, ManageColumnDefinition> =
  {
    amount: { id: 'amount', label: 'Amount' },
    billReference: { id: 'billReference', label: 'Bill Reference' },
    payee: { id: 'payee', label: 'Payee' },
    source: { id: 'source', label: 'Source' },
    dueDate: { id: 'dueDate', label: 'Due Date' },
    status: { id: 'status', label: 'Status' },
    paymentType: { id: 'paymentType', label: 'Payment Type' },
    paymentDate: { id: 'paymentDate', label: 'Payment Date' },
    failureReason: {
      id: 'failureReason',
      label: 'Failure Reason',
      badge: 'Exceptions',
    },
  };

/** Full manage-columns list order (Figma). */
export const ALL_COLUMN_IDS: ManageColumnId[] = [
  'amount',
  'billReference',
  'payee',
  'source',
  'dueDate',
  'status',
  'paymentType',
  'paymentDate',
  'failureReason',
];

/**
 * Columns that are on by default for each status tab — matches RootTable.
 * Remaining columns still appear in the modal, but unchecked.
 */
export const ACTIVE_COLUMNS_BY_TAB: Record<
  PayablesStatusTab,
  ManageColumnId[]
> = {
  'Ready to Pay': [
    'amount',
    'billReference',
    'payee',
    'source',
    'dueDate',
    'status',
  ],
  'In Progress': [
    'amount',
    'billReference',
    'payee',
    'paymentType',
    'source',
    'dueDate',
    'status',
  ],
  Paid: ['amount', 'billReference', 'payee', 'source', 'dueDate', 'status'],
  Exceptions: [
    'amount',
    'billReference',
    'payee',
    'source',
    'dueDate',
    'status',
  ],
};

export const getDefaultColumnsForTab = (
  tab: PayablesStatusTab
): ManageColumnConfig[] => {
  const active = ACTIVE_COLUMNS_BY_TAB[tab];
  const activeSet = new Set(active);

  const activeConfigs = active.map((id) => ({ id, visible: true }));
  const inactiveConfigs = ALL_COLUMN_IDS.filter((id) => !activeSet.has(id)).map(
    (id) => ({ id, visible: false })
  );

  return [...activeConfigs, ...inactiveConfigs];
};

export const DEFAULT_COLUMNS_BY_TAB: Record<
  PayablesStatusTab,
  ManageColumnConfig[]
> = {
  'Ready to Pay': getDefaultColumnsForTab('Ready to Pay'),
  'In Progress': getDefaultColumnsForTab('In Progress'),
  Paid: getDefaultColumnsForTab('Paid'),
  Exceptions: getDefaultColumnsForTab('Exceptions'),
};

export const DEFAULT_MANAGE_COLUMNS = getDefaultColumnsForTab('Ready to Pay');

export const getManageColumnDefinition = (id: ManageColumnId) =>
  COLUMN_DEFINITIONS[id];
